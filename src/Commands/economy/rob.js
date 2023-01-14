const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  EconomyUtils = require("../../Structures/EconomyUtils"),
  Ms = require("ms");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["steal"],
      category: "Economy",
      description: "Rob coins from a user",
      usage: "<user>",
    });
  }

  async run(message, args) {
    let user = message.author.id;
    let otherUser = message.guild.members.cache.get(args[0]) || message.mentions.members.last();

    if (!otherUser) {
      return message.channel.send(`please inlcude a user ID or @mention`);
    }

    otherUser = otherUser?.id;

    let economy = await Db("economy");
    let userEconomy = await economy.findOneOrNew({ user });

    let now = new Date();
    if (userEconomy.lastRobDate) {
      const timeframe = 12 * 60 * 60 * 1000; // 12 hours
      let nextRobData = userEconomy.lastRobDate.getTime() + timeframe;
      if (nextRobData > now)
        return message.channel.send(`You can rob again in ${Ms(nextRobData - now)}`);
    }

    let otherUserEconomy = null;
    if (otherUser) {
      if (otherUser === user)
        return message.channel.send(`You can't rob yourself`);
      otherUserEconomy = await economy.findOne({ user: otherUser });
      if (!otherUserEconomy) return message.channel.send(`User not found`);
      if ((otherUserEconomy.amountPocket ?? 0) === 0)
        return message.channel.send(`The user has nothing, in their pocket`);
    } else {
      let serverUsers = Array.from(message.guild.members.cache.keys());

      otherUserEconomy = await economy.aggregateOne([{
        $match: {
          user: { $ne: user, $in: serverUsers },
          amountPocket: { $gt: 0 },
        }
      },
      { $sample: { size: 1 } },
      ]);

      if (!otherUserEconomy)
        return message.channel.send(`Please add a user id or mention of a user you would like to rob`);
    }

    otherUser = message.guild.members.cache.get(otherUserEconomy.user);

    userEconomy.lastRobDate = now;

    let caught = Math.random() <= 0.2;
    if (caught) {
      let loss = 2000;
      loss = EconomyUtils.take(userEconomy, loss, true);
      await economy.save(userEconomy);
      return message.channel.send(`You got caught and lose ${loss} Shield Coin`);
    }

    let amountRob = EconomyUtils.getRandomValue(1, 1000);
    amountRob = EconomyUtils.take(otherUserEconomy, amountRob);
    await economy.save(otherUserEconomy);
    userEconomy.amountPocket ??= 0;
    userEconomy.amountPocket += amountRob;
    await economy.save(userEconomy);

    return message.channel.send(`You robbed ${amountRob} Shield Coin from ${otherUser}`);
  }
};
