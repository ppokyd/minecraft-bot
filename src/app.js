
const dotenv = require('dotenv');
const BotClient = require('./bot/client');
const game = require('./controllers/game.controller');

dotenv.config();

(async () => {
  try {
    await BotClient.spawn();

    game.listen();

  } catch (error) {
    console.error(error);
  }
})()
