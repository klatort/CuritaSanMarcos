// tests/flows/flowSaludar.test.js
jest.mock('../../mysql', () => ({
  query: jest.fn(),
}));
const flowSaludar = require('../../flujos/flowSaludar');
const menuFlow    = require('../../flujos/menuFlow');
const db          = require('../../mysql');

describe('flowSaludar', () => {
  let tools;
  beforeEach(() => {
    tools = {
      flowDynamic: jest.fn(),
      fallBack:    jest.fn(),
      gotoFlow:    jest.fn(),
    };
    db.query.mockClear();
  });

  it('debe hacer fallBack si el correo es inválido', async () => {
    db.query.mockResolvedValueOnce([]); // ninguna fila ⇒ correo no existe
    await flowSaludar({ body: 'bad@mail.com' }, tools);
    expect(tools.fallBack).toHaveBeenCalledWith(
      expect.stringContaining('correo no es válido')
    );
  });

  it('debe fallBack si el código es inválido', async () => {
    // primero responde correo válido (no falla)
    db.query.mockResolvedValueOnce([{ primer_nombre: 'Ana' }]);
    // luego, en la segunda consulta (código) no hay filas
    db.query.mockResolvedValueOnce([]);
    await flowSaludar({ body: '1234' }, tools);
    expect(tools.fallBack).toHaveBeenCalledWith(
      expect.stringContaining('código no es válido')
    );
  });

  it('debe enviar bienvenida y gotoFlow(menuFlow) si el código es válido', async () => {
    // correo existe
    db.query.mockResolvedValueOnce([{ primer_nombre: 'Ana' }]);
    // código existe
    db.query.mockResolvedValueOnce([{ primer_nombre: 'Ana', codigo: '1234' }]);
    await flowSaludar({ body: '1234' }, tools);
    expect(tools.flowDynamic).toHaveBeenCalledWith(
      expect.stringContaining('Bienvenido Ana')
    );
    expect(tools.gotoFlow).toHaveBeenCalledWith(menuFlow);
  });
});
