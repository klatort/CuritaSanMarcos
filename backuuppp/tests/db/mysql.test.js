// tests/db/mysql.test.js
const connection = require('../../mysql');

describe('MySQL connection (mysql.js)', () => {
  it('debe exportar un objeto con método on y query', () => {
    expect(typeof connection.on).toBe('function');
    expect(typeof connection.query).toBe('function');
  });
});
