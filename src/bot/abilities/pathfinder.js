const Bot = require('../index');
const { Movements, goals } = require('mineflayer-pathfinder');

// const bot = Bot.instance;

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

const findBlocks = (name) => {
  const mcData = require('minecraft-data')(Bot.instance.version);

  // TODO: mcData.findItemOrBlockByName(name)
  const ids = [...mcData.blocksArray]
    .filter(block => block.name.includes(name))
    .map(block => block.id);

  return Bot.instance.findBlocks({ matching: ids, maxDistance: 128, count: 10 });
};

const move = async (direction, blocks = 1) => {
  const mcData = require('minecraft-data')(Bot.instance.version);
  const defaultMove = new Movements(Bot.instance, mcData);

  const facing = Bot.getFacingDirection();
  const coords = MOVES[direction][facing](Bot.position, blocks);

  Bot.instance.pathfinder.setMovements(defaultMove);
  await Bot.goTo(new goals.GoalXZ(coords.x, coords.z));
};

const find = async (blockName) => {
  const blocks = findBlocks(blockName);

  await Bot.goTo(new goals.GoalNear(blocks[0].x, blocks[0].y, blocks[0].z, 1));
};

module.exports = {
  move,
  find
};

