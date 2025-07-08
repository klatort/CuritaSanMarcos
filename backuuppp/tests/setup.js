// tests/setup.js
// Ajusta variables de entorno para que no toquen tu BD de prod
jest.mock('mysql2/promise', () => ({
  createPool: () => ({
    query: jest.fn().mockResolvedValue([]),
    end:   jest.fn().mockResolvedValue(),
  }),
}));

// 2) Registramos codecs de iconv-lite (cede à cesu8, evita ese error)
require('iconv-lite').encodingExists('cesu8') ||
  require('iconv-lite/encodings');

// 3) Silenciamos console.error
jest.spyOn(console, 'error').mockImplementation(() => {});