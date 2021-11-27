const { bot } = require('../client');
const { goals } = require('mineflayer-pathfinder');
const { findBlocks } = require('./finder');

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

const _getFacingDirection = () => {
  const getCardinal = (degrees) => ['N', 'N', 'E', 'E', 'S', 'S', 'W', 'W'][(degrees / 45) & 0x7];
  const degrees = (bot.player.entity.yaw * 180 / Math.PI) - 180;
  return getCardinal(degrees);
}

const move = async (direction, blocks = 1) => {
  const { position } = bot.player.entity;
  const facing = _getFacingDirection();
  const coords = MOVES[direction][facing](position, blocks);

  await _goTo(new goals.GoalXZ(coords.x, coords.z));
};

const find = async (blockName) => {
  const blocks = findBlocks(blockName);

  await _goTo(new goals.GoalNear(blocks[0].x, blocks[0].y, blocks[0].z, 1));
};

const _goTo = async (goal) => {
  return new Promise((resolve) => {
    bot.pathfinder.goto(goal, () => {
      resolve();
    });
  })
}

module.exports = {
  move,
  find
};

