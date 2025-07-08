// tests/utils/gemini.test.js
// 1) Mockeamos la librería de Gemini
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: jest.fn().mockResolvedValue({
        response: Promise.resolve({ text: () => 'respuesta simulada' })
      }),
    }),
  })),
}));

const chat = require('../../gemini');

describe('gemini.js', () => {
  it('debe devolver el texto cuando todo va bien', async () => {
    
    jest.resetModules();
    const chatError = require('../../gemini');
    const res = await chatError('prompt', 'texto');

    expect(res).toBe('respuesta simulada');
  });

  it('debe capturar errores y devolver "ERROR"', async () => {
    // Forzamos un error
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: () => { throw new Error('boom'); }
      }),
    }));
    
    jest.resetModules();
    const chatError = require('../../gemini');
    const res = await chatError('prompt', 'texto');

    expect(res).toBe('ERROR');
  });
});
