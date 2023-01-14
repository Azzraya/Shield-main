const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["dep"],
      category: "Economy",
      description: "Deposit coins from pocket to bank",
      usage: "<amount | all | max>",
    });
  }

  async run(message, args) {
    let user = message.author.id;
    let economy = await Db("economy");
    let u = await economy.findOneOrNew({ user });

    u.amountBank ??= 0;
    u.amountPocket ??= 0;

    let amount = args[0] ?? 0;
    if (amount === "all" || amount === "max") amount = u.amountPocket;
    else if (isNaN(amount) || amount <= 0)
      return message.channel.send("Invalid amount");
    amount = parseInt(amount);

    if (u.amountPocket === 0)
      return message.channel.send("Your pocket is empty");
    if (amount > u.amountPocket)
      return message.channel.send("You don't have enough in your pocket");

    u.amountPocket -= amount;
    u.amountBank += amount;

    await economy.save(u);

    return message.channel.send(`You deposited ${amount} Shield Coin`);
  }
};
