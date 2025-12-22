// Test setup file for Jest
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.BCRYPT_ROUNDS = '10';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'bangopoints_test';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Mock logger to reduce noise in tests
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Global test utilities
global.testUser = {
  email: 'test@example.com',
  password: 'Test123!@#',
  first_name: 'Test',
  last_name: 'User',
  role: 'shopper'
};

// Clean up after all tests
afterAll(async () => {
  // Close any open connections
  await new Promise(resolve => setTimeout(resolve, 500));
});
