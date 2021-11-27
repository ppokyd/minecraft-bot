const { bot } = require('./client');
const abilities = require('./abilities');

class Bot {
  constructor() {

  }

  get position() {
    return bot.player.entity.position;
  }

  async move(direction, blocks) {
    await abilities.move(direction, blocks);
  }

  async find(blockName) {
    await abilities.find(blockName);
  }

  async dig(blockName, amount) {
    await abilities.dig(blockName, amount);
  }
}

module.exports = new Bot();
