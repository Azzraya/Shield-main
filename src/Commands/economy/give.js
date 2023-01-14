const Command = require('../../Structures/Command'),
  Db = require('../../Structures/Db');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['pay'],
      category: 'Economy',
      description: 'Give coins to a user',
      usage: '<user> <amount>',
      args: true,
    });
  }
  async run(message, args) {
    const user = message.author;
    const otherUser = message.guild.members.cache.get(args[0]) || message.mentions.members.last();

    if (!otherUser || otherUser.user.bot || user.id === otherUser.user.id) return message.channel.send(`please inlcude a user ID or @mention`);

    const economy = await Db('economy');
    const userEconomy = await economy.findOneOrNew({ user: user.id });
    userEconomy.amountPocket ??= 0;
    const otherUserEconomy = await economy.findOneOrNew({ user: otherUser.user.id });
    otherUserEconomy.amountBank ??= 0;

    let amount = parseInt(args[1]) ?? 0;
    if (isNaN(amount) || amount <= 0) return message.channel.send('Invalid amount');
    if (userEconomy.amountPocket === 0) return message.channel.send('Your pocket is empty');
    if (amount > userEconomy.amountPocket) return message.channel.send("You don't have enough in your pocket");

    userEconomy.amountPocket -= amount;
    otherUserEconomy.amountBank += amount;
    await economy.save(userEconomy);
    await economy.save(otherUserEconomy);

    return message.reply(`You have sent **${amount}** Shield Coins to **${otherUser.user.tag}**`);
  }
};
