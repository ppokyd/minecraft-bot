const { bot } = require('../client');
const { findBlocks } = require('./finder');

const dig = async (blockName, amount) => {
  await Promise.all(
    Array(parseInt(amount)).fill(0).map(() => {
      const blocks = findBlocks(blockName);
      const target = blocks[0];

      if (target && bot.canDigBlock(target)) {
        return _dig(target);
      }
    })
  );
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
