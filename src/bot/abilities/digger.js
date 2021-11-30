const { bot } = require('../client');
const { findBlocks } = require('./finder');

const dig = async (blockName, amount) => {
  // eslint-disable-next-line no-unused-vars
  for (let i of Array(parseInt(amount)).fill(0)) {
    const blocks = findBlocks(blockName);
    const target = blocks[0];

    if (target) {
      await _dig(target);
    }
  }
};

const _dig = async(position) => {
  const target = bot.blockAt(position);

  return new Promise((resolve) => {
    if (target) {
      bot.dig(target, false, () => {
        resolve();
      });
    }
  })
}

module.exports = {
  dig,
};
