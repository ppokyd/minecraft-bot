const { bot } = require('../bot/client');
const base = require('./base.controller');

const listen = () => {
  bot.on('chat', async (username, message) => {
    await base.onMessage(message);
  });
};

module.exports = {
  listen
};
