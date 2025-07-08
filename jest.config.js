
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
};
