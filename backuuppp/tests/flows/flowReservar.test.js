// tests/flows/flowReservar.test.js
// Mockeamos lectura de archivo y base de datos
jest.mock('fs', () => {
    const fs = jest.requireActual('fs');
  return {
    ...fs,
  readFileSync: jest.fn().mockReturnValue(
    '1. Cardiología\n2. Dermatología\n0. Salir'
  ),
  };
});
jest.mock('../../mysql', () => ({
  query: jest.fn(),
}));

const flowReservar = require('../../flujos/flowReservar');
const menuFlow    = require('../../flujos/menuFlow');
const db           = require('../../mysql');

describe('flowReservar', () => {
  let tools;
  beforeEach(() => {
    tools = {
      flowDynamic: jest.fn(),
      fallBack:    jest.fn(),
      gotoFlow:    jest.fn(),
    };
    db.query.mockClear();
  });

  it('hace fallBack si la especialidad es inválida', async () => {
    await flowReservar({ body: '99' }, tools);
    expect(tools.fallBack).toHaveBeenCalledWith(
      expect.stringContaining('Respuesta no válida, por favor selecciona una de las especialidades')
    );
  });

  it('si elige "0" vuelve al menú', async () => {
    await flowReservar({ body: '0' }, tools);
    expect(tools.flowDynamic).toHaveBeenCalledWith(
      expect.stringContaining('Regresando al Menú')
    );
    expect(tools.gotoFlow).toHaveBeenCalledWith(menuFlow);
  });
});
