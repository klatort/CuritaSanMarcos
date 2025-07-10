// flujos/flowConsultas.js
const path = require('path');
const isTest = process.env.NODE_ENV === 'test';
const fs = require('fs');
const chat = require('../gemini');
const menuFlow = require('./menuFlow');
const promptConsultas = fs.readFileSync(
  path.join(__dirname, '..', 'mensajes', 'promptConsultas.txt'),
  'utf8'
);
async function handler(ctx, { flowDynamic, fallBack, gotoFlow }) {
  const txt = String(ctx.body || '').trim().toLowerCase();

  if (txt === '1' || txt === 'sí' || txt === 'si') {
    return gotoFlow(handler);
  }
  if (txt === '2' || txt === 'no') {
    await flowDynamic('Regresando al Menú... 🏃');
    return gotoFlow(menuFlow);
  }
  if (/^[0-9]+$/.test(txt)) {
    return fallBack('Respuesta no válida, por favor selecciona 1 para Sí o 2 para No.');
  }
  const resp = await chat(promptConsultas, txt);
  return flowDynamic(resp);
}

if (isTest) {
  module.exports = handler;
} else {
  /* istanbul ignore next */
  const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
  /* istanbul ignore next */
  const flowDSL = addKeyword(EVENTS.ACTION)
  .addAnswer('Realiza tu consulta 🤖', { capture: true }, handler)
  .addAnswer('¿Quieres continuar con otra consulta? 1. Sí | 2. No', { capture: true }, handler);
  /* istanbul ignore next */
  module.exports = flowDSL;
}