// tests/flows/flowVerCitas.test.js
jest.mock('../../mysql', () => ({
  query: jest.fn(),
}));
const flowVerCitas = require('../../flujos/flowVerCitas');
const menuFlow     = require('../../flujos/menuFlow');
const db            = require('../../mysql');

describe('flowVerCitas', () => {
  let tools;
  beforeEach(() => {
    tools = {
      flowDynamic: jest.fn(),
      gotoFlow:    jest.fn(),
      fallBack:    jest.fn(),
    };
    db.query.mockClear();
  });

  it('informa que no hay citas si la consulta regresa vacío', async () => {
    db.query.mockResolvedValueOnce([]);
    await flowVerCitas({ from: 'user1' }, tools);
    expect(tools.flowDynamic).toHaveBeenCalledWith('No tienes citas pendientes. 😎');
  });

  it('muestra citas y vuelve al menú si hay resultados', async () => {
    const filas = [{
      fecha: '2025-07-09',
      hora_inicio: '10:00:00',
      hora_final:  '11:00:00',
    }];
    db.query.mockResolvedValueOnce(filas);
    await flowVerCitas({ from: 'user1' }, tools);

    // Primera llamada con la lista de citas formateada
    expect(tools.flowDynamic).toHaveBeenCalledWith(
      expect.stringContaining('1.')
    );
    // Luego indica que regresa al menú
    expect(tools.flowDynamic).toHaveBeenCalledWith('Regresando al Menú... 🏃');
    // Y hace gotoFlow a menuFlow
    expect(tools.gotoFlow).toHaveBeenCalledWith(menuFlow);
  });
});
