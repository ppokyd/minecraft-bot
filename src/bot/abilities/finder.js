const { bot, mcData } = require('../client');

const findBlocks = (name) => {
  // TODO: mcData.findItemOrBlockByName(name)
  const ids = [...mcData.blocksArray]
    .filter(block => block.name.includes(name))
    .map(block => block.id);

  return bot.findBlocks({ matching: ids, maxDistance: 128, count: 10 });
};

module.exports = {
  findBlocks
};
