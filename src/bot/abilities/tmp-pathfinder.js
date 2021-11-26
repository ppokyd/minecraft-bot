const Bot = require('../index');
const bot = Bot.instance;
const mcData = require('minecraft-data')(bot.version);
const { Movements, goals } = require('mineflayer-pathfinder');

const q = require('../../services/queue');

const defaultMove = new Movements(bot, mcData);

const MOVES = {
  forward: {
    N: ({ x, z }, dif) => ({ x, z: z + dif }),
    S: ({ x, z }, dif) => ({ x, z: z - dif }),
    E: ({ x, z }, dif) => ({ x: x + dif, z }),
    W: ({ x, z }, dif) => ({ x: x - dif, z }),
  },
  backward: {
    N: ({ x, z }, dif) => ({ x, z: z - dif }),
    S: ({ x, z }, dif) => ({ x, z: z + dif }),
    E: ({ x, z }, dif) => ({ x: x - dif, z }),
    W: ({ x, z }, dif) => ({ x: x + dif, z }),
  },
  right: {
    N: ({ x, z }, dif) => ({ x: x - dif, z }),
    S: ({ x, z }, dif) => ({ x: x + dif, z }),
    E: ({ x, z }, dif) => ({ x, z: z + dif }),
    W: ({ x, z }, dif) => ({ x, z: z - dif }),
  },
  left: {
    N: ({ x, z }, dif) => ({ x: x + dif, z }),
    S: ({ x, z }, dif) => ({ x: x - dif, z }),
    E: ({ x, z }, dif) => ({ x, z: z - dif }),
    W: ({ x, z }, dif) => ({ x, z: z + dif }),
  },
};

const MATS = {
  wood: 'log'
};

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  const [direction, blocks] = message.split(/\s/);

  if (['forward', 'backward', 'left', 'right'].includes(direction)) {
    q.enqueue(async () => move(direction, parseInt(blocks)));
  }

  if ('go' === message) {
    q.enqueue(async () => move('forward', parseInt(10)));
    q.enqueue(async () => move('left', parseInt(10)));
    q.enqueue(async () => move('backward', parseInt(10)));
    q.enqueue(async () => move('right', parseInt(10)));
  }

  if (message.includes('find')) {
    q.enqueue(async () => find(message.split(/\s/)[1]));
  }

  if (message.includes('collect')) {
    q.enqueue(async () => collect(message.split(/\s/)[1]));
  }
  
  if (message.includes('craft')) {
    q.enqueue(async () => craft(message.split(/\s/)[1]));
  }

  if (message.includes('take')) {
    q.enqueue(async () => equipItem(message.split(/\s/)[1]));
  }
  
  if (message.includes('use')) {
    q.enqueue(async () => useItem(message.split(/\s/)[1]));
  }
});

const findBlocks = (name) => {
  // TODO: mcData.findItemOrBlockByName(name)
  const ids = [...mcData.blocksArray]
    .filter(block => block.name.includes(MATS[name] || name))
    .map(block => block.id);

  return bot.findBlocks({ matching: ids, maxDistance: 128, count: 10 });
};

const move = async (direction, blocks = 1) => {
  const facing = Bot.getFacingDirection();
  const coords = MOVES[direction][facing](Bot.position, blocks);
 
  bot.pathfinder.setMovements(defaultMove);
  await Bot.goTo(new goals.GoalXZ(coords.x, coords.z));
};

const find = async (blockName) => {
  const blocks = findBlocks(blockName);

  await Bot.goTo(new goals.GoalNear(blocks[0].x, blocks[0].y, blocks[0].z, 1));
};

const collect = async (blockName) => {
  const blocks = findBlocks(blockName);
  const target = blocks[0];

  if (target && bot.canDigBlock(target)) {
    await Bot.dig(target);
  }
};

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
