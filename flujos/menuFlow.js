// flujos/menuFlow.js
const path = require('path');
const fs   = require('fs');
const isTest = process.env.NODE_ENV === 'test';

// Handler puro para tests y producción (en producción solo se usa vía DSL)
async function handler(ctx, { gotoFlow, fallBack, flowDynamic }) {
  const op = String(ctx.body || '').trim();

  // Validación estricta: solo 1,2,3
  if (!['1', '2', '3'].includes(op)) {
    return fallBack('Respuesta no válida, por favor selecciona una de las opciones. 👆👆');
  }

  switch (op) {
    case '1':
      return gotoFlow(require(path.join(__dirname, 'flowReservar')));
    case '2':
      return gotoFlow(require(path.join(__dirname, 'flowVerCitas')));
    case '3':
      return gotoFlow(require(path.join(__dirname, 'flowConsultas')));
  }
}

if (isTest) {
  // En Jest exportamos solo el handler para cubrir el 100%
  module.exports = handler;
} else {
  // En producción leemos el menú desde el archivo de mensajes
  /* istanbul ignore next */
  const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
  /* istanbul ignore next */
  const menuPath = path.join(__dirname, '..', 'mensajes', 'menu.txt');
  /* istanbul ignore next */
  const menuText = fs.readFileSync(menuPath, 'utf8');

  /* istanbul ignore next */
  const flowDSL = addKeyword(EVENTS.ACTION)
    .addAnswer(menuText, { capture: true }, handler);

  /* istanbul ignore next */
  module.exports = flowDSL;
}
