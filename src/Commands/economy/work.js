const Ms = require("ms"),
  Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  EconomyUtils = require("../../Structures/EconomyUtils");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Economy",
      description: "Work to earn coins",
    });
  }

  async run(message) {
    let user = message.author.id;
    let economy = await Db("economy");
    let u = await economy.findOneOrNew({ user });

    let now = new Date();
    if (u.lastWorkDate) {
      const timeframe = 12 * 60 * 60 * 1000; // 12 hours
      let nextWorkDate = u.lastWorkDate.getTime() + timeframe;
      if (nextWorkDate > now)
        return message.channel.send(`You can work again in ${Ms(nextWorkDate - now)}`);
    }

    let amount = EconomyUtils.getRandomValue(1, 1000);

    u.amountPocket ??= 0;
    u.amountPocket += amount;
    u.lastWorkDate = now;

    await economy.save(u);

    return message.channel.send(`You earned ${amount} Shield Coin`);
  }
};
