// flujos/flowVerCitas.js
const path = require('path');
const isTest = process.env.NODE_ENV === 'test';
const db = require('../mysql');
const menuFlow = require('./menuFlow');
function format(filas){
  return filas.map((h,i)=>`\n${i+1}. ${h.fecha} ${h.hora_inicio}-${h.hora_final}`).join('');
}
async function handler(ctx,{flowDynamic,gotoFlow}){
  const rows = await db.query('SELECT ...',[ctx.from]);
  if(!rows.length){
    return flowDynamic('No tienes citas pendientes. 😎');
  }
  await flowDynamic(format(rows));
  await flowDynamic('Regresando al Menú... 🏃');
  return gotoFlow(menuFlow);
}

if (isTest) {
  module.exports = handler;
} else {
  /* istanbul ignore next */
  const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
  /* istanbul ignore next */
  const flowDSL = addKeyword(EVENTS.ACTION)
  .addAction(handler);
  /* istanbul ignore next */
  module.exports = flowDSL;
}