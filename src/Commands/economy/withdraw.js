const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["with"],
      category: "Economy",
      description: "Withdraw coins from bank to pocket",
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
    if (amount === "all" || amount === "max") amount = u.amountBank;
    else if (isNaN(amount) || amount <= 0)
      return message.channel.send("Invalid amount");
    amount = parseInt(amount);

    if (u.amountBank === 0) return message.channel.send("Your bank is empty");
    if (amount > u.amountBank)
      return message.channel.send("You don't have enough in your bank");

    u.amountBank -= amount;
    u.amountPocket += amount;

    await economy.save(u);

    return message.channel.send(`You withdrew ${amount} Shield Coin`);
  }
};
