
const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
// const inventoryViewer = require('mineflayer-web-inventory');

class Bot {
  constructor() {
    this._instance = mineflayer.createBot({
      host: 'localhost',
      username: 'player'
    });

    // inventoryViewer(this._instance);
  }

  get instance() {
    return this._instance;
  }

  get position() {
    return this._instance.player.entity.position;
  }

  init() {
    return new Promise((resolve, reject) => {
      this._instance.once('spawn', () => {
        this._instance.loadPlugin(pathfinder);

        console.log('Spawned!');

        resolve();
      });
    })
  }

  getFacingDirection() {
    const getCardinal = (degrees) => ['N', 'N', 'E', 'E', 'S', 'S', 'W', 'W'][(degrees / 45) & 0x7];
    const degrees = (this._instance.player.entity.yaw * 180 / Math.PI) - 180;
    return getCardinal(degrees);
  }

  goTo(goal) {
    return new Promise((resolve) => {
      this._instance.pathfinder.goto(goal, () => {
        resolve();
      });
    })
  }

  dig(position) {
    const target = this._instance.blockAt(position);

    return new Promise((resolve) => {
      if (target) {
        this._instance.dig(target, false, () => {
          resolve();
        });
      }
    })
  }
}

module.exports = new Bot();
