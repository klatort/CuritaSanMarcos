// tests/flows/flowWelcome.test.js
const flowWelcome = require('../../flujos/flowWelcome');
const flowSaludar = require('../../flujos/flowSaludar');
const menuFlow    = require('../../flujos/menuFlow');

describe('flowWelcome', () => {
  let tools;
  beforeEach(() => {
    tools = {
      gotoFlow:    jest.fn(),
      flowDynamic: jest.fn(),
    };
  });

  it('la primera vez lleva a flowSaludar', async () => {
    const ctx = { from: 'user123' };
    await flowWelcome(ctx, tools);
    expect(tools.gotoFlow).toHaveBeenCalledWith(flowSaludar);
  });

  it('la segunda vez regresa al menú', async () => {
    const ctx = { from: 'user123' };
    // Segunda llamada mantiene el mismo userStates interno
    tools.gotoFlow.mockClear();
    tools.flowDynamic.mockClear();

    await flowWelcome(ctx, tools);
    expect(tools.flowDynamic).toHaveBeenCalledWith('Regresando al Menú... 🏃');
    expect(tools.gotoFlow).toHaveBeenCalledWith(menuFlow);
  });
});
