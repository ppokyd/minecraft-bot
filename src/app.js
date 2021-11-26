const Bot = require('./bot');
const dotenv = require('dotenv');
// const abilities = require('./bot/abilities');

dotenv.config();

(async () => {
  try {
    await Bot.init();

    // setTimeout(async() => {
    //   await abilities.move('backward', 5);
    // }, 5e3);

  } catch (error) {
    console.error(error);
  }
})()
