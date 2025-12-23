import React from 'react';

/**
 * Logo Component for BangoPoints
 * 
 * @param {string} variant - 'icon' for square icon (bango-PrA) or 'full' for full logo (bango-actual)
 * @param {string} size - 'sm', 'md', 'lg', or 'xl'
 * @param {string} className - Additional CSS classes
 */
const Logo = ({ variant = 'icon', size = 'md', className = '' }) => {
  const sizes = {
    icon: {
      xs: { width: 24, height: 24, src: '/images/bango-PrA-150x150.png' },
      sm: { width: 40, height: 40, src: '/images/bango-PrA-150x150.png' },
      md: { width: 48, height: 48, src: '/images/bango-PrA-300x300.png' },
      lg: { width: 64, height: 64, src: '/images/bango-PrA-300x300.png' },
      xl: { width: 80, height: 80, src: '/images/bango-PrA-768x768.png' },
    },
    full: {
      xs: { width: 60, height: 34, src: '/images/bango-actual-300x168.png' },
      sm: { width: 120, height: 67, src: '/images/bango-actual-300x168.png' },
      md: { width: 180, height: 101, src: '/images/bango-actual-300x168.png' },
      lg: { width: 240, height: 135, src: '/images/bango-actual-768x431.png' },
      xl: { width: 320, height: 179, src: '/images/bango-actual-768x431.png' },
    },
  };

  const config = sizes[variant][size];

  return (
    <img
      src={config.src}
      alt="BangoPoints Logo"
      width={config.width}
      height={config.height}
      className={`object-contain ${className}`}
      srcSet={
        variant === 'icon'
          ? `/images/bango-PrA-150x150.png 150w, /images/bango-PrA-300x300.png 300w, /images/bango-PrA-768x768.png 768w, /images/bango-PrA-1024x1024.png 1024w`
          : `/images/bango-actual-300x168.png 300w, /images/bango-actual-768x431.png 768w, /images/bango-actual-1024x574.png 1024w`
      }
    />
  );
};

export default Logo;
