const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  Config = require("../../Structures/Config"),
  Ms = require("ms");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Owner",
      ownerOnly: true,
      aliases: ["bl"],
      usage:
        "blacklist <user_id> <reason> <time (m, s, d, h, y, or permanent if no time is passed)>",
    });

    (async () => {
      let blacklist = await Db("blacklist");
      for (let ub of await blacklist.findMany({
        until: { $exists: true },
      })) {
        let duration = ub.until - Date.now();
        if (duration < 0) duration = 0;
        this.unBlacklistAfter(ub.user, duration);
      }
    })();
  }

  async run(message, args) {
    const user = message.mentions.users.first() || (!isNaN(args[0]) && (await message.client.users.fetch(args[0])));

    if (!user) return message.channel.send(`please add a user mention or id`);

    if (Array.from(Config.owners).includes(user.id))
      return message.channel.send(`can't blacklist an owner`);

    if (args.length <= 1) return message.channel.send(`please add a reason`);

    let duration = null;

    if (args.length > 2) {
      duration = Ms(args[args.length - 1]);
      if (duration >= 0) args.splice(args.length - 1, 1);
    }

    const reason = args.slice(1).join(" ");

    let blacklist = await Db("blacklist");
    let ub = await blacklist.findOneOrNew({ user: user.id });
    ub.reason = reason;

    if (duration) {
      if (duration <= 0) return message.channel.send("Invalid time");
      ub.until = new Date(Date.now() + duration);
      this.unBlacklistAfter(user.id, duration);
    }

    const em = new EmbedBuilder()
      .addFields({
        name: `You\'ve been blacklisted`,
        value: [
          `Hello ${user.tag} | ${user.id}`,
          `You have been blacklisted from ${this.client.user.tag} by ${message.author.tag} | ${message.author.id} for ${reason}`,
          `If you think this is a mistake please join our support server: https://discord.gg/kjpTrqKCWV`,
        ].join("\n"),
      });

    user.send({ embeds: [em] }).catch(() => null);

    let i = this.client.blackList.indexOf(user.id);
    if (i < 0) this.client.blackList.push(user.id);
    await blacklist.save(ub);

    return message.channel.send(`Blacklisted ${user.tag}`);
  }

  unBlacklistAfter(user, duration) {
    setTimeout(async () => {
      let i = this.client.blackList.indexOf(user);
      if (i >= 0) this.client.blackList.splice(i, 1);
      let blacklist = await Db("blacklist");
      await blacklist.deleteMany({ user });
    }, duration);
  }
};
