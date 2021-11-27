const { bot, mcData } = require('../client');

const craft = async (name, amount) => {
  amount = parseInt(amount, 10);

  const item = mcData.findItemOrBlockByName(name);

  if (item) {

    if ('crafting_table' === name || name === 'oak_planks') {
      const recipe = bot.recipesAll(item.id)[0];
      try {
        await bot.craft(recipe, 1);
      } catch (err) {
        bot.chat(`error making ${name}`);
      }
    } else {
      const craftingTableID = mcData.blocksByName.crafting_table.id;

      const craftingTable = bot.findBlock({
        matching: craftingTableID
      });

      const recipe = bot.recipesFor(item.id, null, 1, craftingTable)[0];

      if (recipe) {
        try {
          await bot.craft(recipe, amount, craftingTable);
          bot.chat(`did the recipe for ${name} ${amount} times`);
        } catch (err) {
          bot.chat(`error making ${name}`);
        }
      }
    }
  }
};

module.exports = {
  craft,
};
