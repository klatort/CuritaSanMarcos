// flujos/flowReservar.js
const path = require('path');
const isTest = process.env.NODE_ENV === 'test';
const fs = require('fs');
const db = require('../mysql');
const menuFlow = require('./menuFlow');
const raw = fs.readFileSync(path.join(__dirname, '..', 'mensajes', 'especialidades.txt'),'utf8');
const especialidades = raw.split(/\r?\n/).filter(Boolean).map(l=>l.split('.')[0].trim());

async function handler(ctx, { flowDynamic, gotoFlow, fallBack }) {
  const choice = String(ctx.body||'').trim();
  if (choice === '0') {
    await flowDynamic('Regresando al Menú... 🏃');
    return gotoFlow(menuFlow);
  }
  if (!especialidades.includes(choice)) {
    return fallBack('Respuesta no válida, por favor selecciona una de las especialidades disponibles');
  }
  await flowDynamic(`Has seleccionado la especialidad ${choice}.`);
}

if (isTest) {
  module.exports = handler;
} else {
  /* istanbul ignore next */
  const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
  /* istanbul ignore next */
  const flowDSL = addKeyword(EVENTS.ACTION)
  .addAnswer('📆 Aquí podrás reservar tus citas 📆', { capture: true }, handler);
  /* istanbul ignore next */
  module.exports = flowDSL;
}