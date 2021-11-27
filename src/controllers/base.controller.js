const Bot = require('../bot');
const q = require('../services/queue');

const onMessage = async (message) => {
  const [direction, blocks] = message.split(/\s/);

  if (['forward', 'backward', 'left', 'right'].includes(direction)) {
    q.enqueue(async () => Bot.move(direction, parseInt(blocks)));
  }

  if ('go' === message) {
    q.enqueue(async () => Bot.move('forward', parseInt(10)));
    q.enqueue(async () => Bot.move('left', parseInt(10)));
    q.enqueue(async () => Bot.move('backward', parseInt(10)));
    q.enqueue(async () => Bot.move('right', parseInt(10)));
  }

  if (message.includes('find')) {
    q.enqueue(async () => Bot.find(message.split(/\s/)[1]));
  }

  if (message.includes('dig')) {
    q.enqueue(async () => Bot.dig(message.split(/\s/)[1], message.split(/\s/)[2]));
  }
  
  if (message.includes('craft')) {
    q.enqueue(async () => Bot.craft(message.split(/\s/)[1]));
  }

  if (message.includes('take')) {
    q.enqueue(async () => Bot.equipItem(message.split(/\s/)[1]));
  }
  
  if (message.includes('use')) {
    q.enqueue(async () => Bot.useItem(message.split(/\s/)[1]));
  }
};

module.exports = {
  onMessage
};

