// OCR Service for Receipt Processing using Tesseract.js

/**
 * Extract text from image using OCR
 * @param {string} imageData - Base64 encoded image or blob URL
 * @returns {Promise<string>} Extracted text
 */
export async function extractText(imageData) {
  try {
    // Dynamic import of Tesseract to reduce initial bundle size
    const Tesseract = await import('tesseract.js');
    
    console.log('[OCR] Starting text extraction...');
    
    const result = await Tesseract.recognize(imageData, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    console.log('[OCR] Text extraction complete');
    return result.data.text;
  } catch (error) {
    console.error('[OCR] Text extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Parse receipt structure from text
 * @param {string} text - Extracted OCR text
 * @returns {Object} Parsed receipt data
 */
export function parseReceiptData(text) {
  const data = {
    items: [],
    total: null,
    receiptNumber: null,
    date: null,
    store: null
  };

  const lines = text.split('\n').filter(line => line.trim());

  // Find receipt number
  const receiptPattern = /(?:receipt|inv|no)[\s:]*(\d+)/i;
  for (const line of lines) {
    const match = line.match(receiptPattern);
    if (match) {
      data.receiptNumber = match[1];
      break;
    }
  }

  // Find date
  const datePattern = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/;
  for (const line of lines) {
    const match = line.match(datePattern);
    if (match) {
      data.date = match[1];
      break;
    }
  }

  // Find total
  const totalPattern = /(?:total|sum|amount)[\s:]*(?:kes|ksh)?\s*(\d+(?:[.,]\d{2})?)/i;
  for (const line of lines) {
    const match = line.match(totalPattern);
    if (match) {
      data.total = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }

  // Find items (simplified - looks for price patterns)
  const itemPattern = /^(.+?)\s+(\d+(?:[.,]\d{2})?)\s*$/;
  for (const line of lines) {
    const match = line.match(itemPattern);
    if (match && match[1].length > 2) {
      const name = match[1].trim();
      const price = parseFloat(match[2].replace(',', '.'));
      
      // Skip if name looks like a total or subtotal
      if (!/total|subtotal|tax|vat|change/i.test(name)) {
        data.items.push({ name, price, quantity: 1 });
      }
    }
  }

  // Find store name (usually in first few lines)
  const storeLines = lines.slice(0, 3);
  for (const line of storeLines) {
    // Look for known store chains
    const stores = ['carrefour', 'naivas', 'quickmart', 'chandarana', 'tuskys', 'cleanshelf', 'zucchini'];
    const lowerLine = line.toLowerCase();
    
    for (const store of stores) {
      if (lowerLine.includes(store)) {
        data.store = store.charAt(0).toUpperCase() + store.slice(1);
        break;
      }
    }
    
    if (data.store) break;
  }

  return data;
}

/**
 * Parse complete receipt from image
 * @param {string} imageData - Base64 encoded image
 * @returns {Promise<Object>} Parsed receipt data
 */
export async function parseReceipt(imageData) {
  try {
    console.log('[OCR] Starting receipt parsing...');
    
    const text = await extractText(imageData);
    console.log('[OCR] Extracted text:', text);
    
    const data = parseReceiptData(text);
    console.log('[OCR] Parsed receipt data:', data);
    
    return {
      success: true,
      text,
      ...data
    };
  } catch (error) {
    console.error('[OCR] Receipt parsing error:', error);
    return {
      success: false,
      error: error.message,
      text: null,
      items: [],
      total: null,
      receiptNumber: null
    };
  }
}

/**
 * Validate receipt image quality before OCR
 * @param {string} imageData - Base64 encoded image
 * @returns {Promise<Object>} Quality assessment
 */
export async function validateImageQuality(imageData) {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const quality = {
        valid: true,
        width: img.width,
        height: img.height,
        aspectRatio: (img.width / img.height).toFixed(2),
        warnings: []
      };

      // Check resolution
      if (img.width < 800 || img.height < 600) {
        quality.warnings.push('Image resolution is low. OCR accuracy may be reduced.');
      }

      // Check aspect ratio (receipts are usually tall)
      const ratio = img.width / img.height;
      if (ratio > 1) {
        quality.warnings.push('Image appears to be landscape. Rotate to portrait for better results.');
      }

      // Check size
      const sizeKB = Math.round((imageData.length * 3) / 4 / 1024);
      if (sizeKB > 5000) {
        quality.warnings.push('Image is very large. Processing may take longer.');
      }

      resolve(quality);
    };

    img.onerror = () => {
      resolve({
        valid: false,
        warnings: ['Failed to load image. Please try again.']
      });
    };

    img.src = imageData;
  });
}

/**
 * Match extracted items with brand database
 * @param {Array} items - Extracted items from receipt
 * @param {Array} brands - Available brands from database
 * @returns {Array} Items with matched brands
 */
export function matchBrands(items, brands) {
  return items.map(item => {
    const lowerName = item.name.toLowerCase();
    
    // Try to match with known brands
    const matchedBrand = brands.find(brand => {
      const brandName = brand.name.toLowerCase();
      return lowerName.includes(brandName) || brandName.includes(lowerName);
    });

    return {
      ...item,
      brand: matchedBrand || null,
      brandId: matchedBrand?.id || null
    };
  });
}

/**
 * Calculate confidence score for OCR result
 * @param {Object} parsedData - Parsed receipt data
 * @returns {number} Confidence score (0-100)
 */
export function calculateConfidenceScore(parsedData) {
  let score = 0;

  // Receipt number found (+30)
  if (parsedData.receiptNumber) score += 30;

  // Total found (+30)
  if (parsedData.total && parsedData.total > 0) score += 30;

  // Items found (+20 for some, +40 for many)
  if (parsedData.items.length > 0) {
    score += Math.min(parsedData.items.length * 10, 40);
  }

  // Date found (+10)
  if (parsedData.date) score += 10;

  // Store found (+10)
  if (parsedData.store) score += 10;

  return Math.min(score, 100);
}

export default {
  extractText,
  parseReceiptData,
  parseReceipt,
  validateImageQuality,
  matchBrands,
  calculateConfidenceScore
};
