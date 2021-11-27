const Bot = require('../index');
const bot = Bot.instance;
const mcData = require('minecraft-data')(bot.version);

const equipItem = async (name, destination = 'hand') => {
  const items = bot.inventory.items();
  const item = items.filter(item => item.name === name)[0];

  if (item) {
    try {
      await bot.equip(item, destination);
      bot.chat(`equipped ${name}`);
    } catch (err) {
      bot.chat(`cannot equip ${name}: ${err.message}`);
    }
  } else {
    bot.chat(`I have no ${name}`);
  }
};

const useItem = async () => {
  bot.activateItem()
};
