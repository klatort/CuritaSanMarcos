
/**
 * Jest global setup: Mock MySQL and other heavy deps.
 */
jest.mock('mysql2', () => ({
  createConnection: () => ({
    query: jest.fn().mockResolvedValue([]),
    on:    jest.fn(),
  }),
}));

jest.mock('mysql2/promise', () => ({
  createPool: () => ({
    query: jest.fn().mockResolvedValue([[], []]),
    end:   jest.fn(),
  }),
}));

// Ensure iconv-lite knows about cesu8 to silence mysql2 parser
require('iconv-lite/encodings');

// Silence console.error in tests to keep output clean
jest.spyOn(console, 'error').mockImplementation(() => {});
