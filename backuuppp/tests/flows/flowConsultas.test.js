// tests/flows/flowConsultas.test.js
// Mockeamos Gemini y lectura de prompt
jest.mock('../../gemini', () => jest.fn().mockResolvedValue('respuesta simulada'));
jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  return {
    ...fs,  
  readFileSync: jest.fn().mockReturnValue('PROMPT_BASE'),
};
});

const flowConsultas = require('../../flujos/flowConsultas');
const menuFlow      = require('../../flujos/menuFlow');
const chat          = require('../../gemini');

describe('flowConsultas', () => {
  let tools;
  beforeEach(() => {
    tools = {
      flowDynamic: jest.fn(),
      gotoFlow:    jest.fn(),
      fallBack:    jest.fn(),
    };
    chat.mockClear();
  });

  it('envía al usuario lo que devuelve Gemini', async () => {
    await flowConsultas({ body: '¿Tengo fiebre?' }, tools);
    expect(chat).toHaveBeenCalledWith('PROMPT_BASE', '¿Tengo fiebre?');
    expect(tools.flowDynamic).toHaveBeenCalledWith('respuesta simulada');
  });

  it('si responde "1" reinicia el flujo de consulta', async () => {
    await flowConsultas({ body: '1' }, tools);
    expect(tools.gotoFlow).toHaveBeenCalledWith(flowConsultas);
  });

  it('si responde "2" vuelve al menú', async () => {
    await flowConsultas({ body: '2' }, tools);
    expect(tools.flowDynamic).toHaveBeenCalledWith('Regresando al Menú... 🏃');
    expect(tools.gotoFlow).toHaveBeenCalledWith(menuFlow);
  });

  it('fallBack en opción inválida', async () => {
    await flowConsultas({ body: 'x' }, tools);
    expect(tools.fallBack).toHaveBeenCalledWith(
      expect.stringContaining('Respuesta no válida')
    );
  });
});
