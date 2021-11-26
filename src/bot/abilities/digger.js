
const dig = async (blockName) => {
  const blocks = findBlocks(blockName);
  const target = blocks[0];

  if (target && bot.canDigBlock(target)) {
    await Bot.dig(target);
  }
};
