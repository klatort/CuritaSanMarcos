// flujos/flowWelcome.js
const path = require('path');
const isTest = process.env.NODE_ENV === 'test';
const userStates = {};
async function handler(ctx,{gotoFlow,flowDynamic}){
  const id = ctx.from;
  if(!userStates[id]) userStates[id]=false;
  if(userStates[id]){
    await flowDynamic('Regresando al Menú... 🏃');
    return gotoFlow(require('./menuFlow'));
  }
  userStates[id]=true;
  return gotoFlow(require('./flowSaludar'));
}

if (isTest) {
  module.exports = handler;
} else {
  /* istanbul ignore next */
  const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
  /* istanbul ignore next */
  const flowDSL = addKeyword(EVENTS.WELCOME).addAction(handler);
  /* istanbul ignore next */
  module.exports = flowDSL;
}