// jest.config.js
module.exports = {
  testEnvironment: 'node',         // entorno Node.js
  verbose: true,                   // salida detallada
  clearMocks: true,                // limpia mocks entre tests
  coverageDirectory: 'coverage',   // carpeta de cobertura
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],  // dónde buscar tests
};
