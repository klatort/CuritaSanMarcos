// tests/flows/menuFlow.test.js
// Mockeamos lectura de menu
jest.mock('fs', () => {
   const fs = jest.requireActual('fs');
  return {
    ...fs,  
  readFileSync: jest.fn().mockReturnValue('1) Reserva\n2) Ver citas\n3) Consultas'),
 };
});

const menuFlow      = require('../../flujos/menuFlow');
const flowReservar  = require('../../flujos/flowReservar');
const flowVerCitas  = require('../../flujos/flowVerCitas');
const flowConsultas = require('../../flujos/flowConsultas');

describe('menuFlow', () => {
  let tools;
  beforeEach(() => {
    tools = {
      gotoFlow:    jest.fn(),
      fallBack:    jest.fn(),
      flowDynamic: jest.fn(),
    };
  });

  it('hace fallBack con opción inválida', async () => {
    await menuFlow({ body: '9' }, tools);
    expect(tools.fallBack).toHaveBeenCalledWith(
      expect.stringContaining('Respuesta no válida')
    );
  });

  it('opción 1 → flowReservar', async () => {
    await menuFlow({ body: '1' }, tools);
    expect(tools.gotoFlow).toHaveBeenCalledWith(flowReservar);
  });

  it('opción 2 → flowVerCitas', async () => {
    await menuFlow({ body: '2' }, tools);
    expect(tools.gotoFlow).toHaveBeenCalledWith(flowVerCitas);
  });

  it('opción 3 → flowConsultas', async () => {
    await menuFlow({ body: '3' }, tools);
    expect(tools.gotoFlow).toHaveBeenCalledWith(flowConsultas);
  });
});
