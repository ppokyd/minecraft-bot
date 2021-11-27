
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const inventoryViewer = require('mineflayer-web-inventory');

const bot = mineflayer.createBot({
  host: 'localhost',
  username: 'player',
  version: '1.17.1'
});

const mcData = require('minecraft-data')(bot.version);

inventoryViewer(bot);

const spawn = () => {
  return new Promise((resolve) => {
    bot.once('spawn', () => {
      const defaultMove = new Movements(bot, mcData);

      bot.loadPlugin(pathfinder);
      bot.pathfinder.setMovements(defaultMove);

      console.log('Spawned!');

      resolve();
    });
  })
};

module.exports = {
  spawn,
  mcData,
  bot
};
