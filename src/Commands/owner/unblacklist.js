const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  { EmbedBuilder } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Owner",
      ownerOnly: true,
      aliases: ["ub"],
      usage: "unblacklist <user_id>",
    });
  }

  async run(message, args) {
    const member = message.mentions.users.first() || (!isNaN(args[0]) && (await message.client.users.fetch(args[0])));
    if (!member) return message.channel.send(`please add a user mention or id`);

    let blacklist = await Db("blacklist");
    let ub = await blacklist.findOne({ user: member.id });

    if (!ub) return message.channel.send(`user not blacklisted`);

    const em = new EmbedBuilder().addFields({
      name: `You\'ve been un-blacklisted`,
      value: [
        `Hello ${member.tag} | ${member.id}`,
        `You have been un-blacklisted from ${this.client.user.tag} by ${message.author.tag} | ${message.author.id}`,
      ].join("\n"),
    });
    member.send({ embeds: [em] }).catch(() => null);

    await blacklist.deleteMany({ user: member.id });
    let i = this.client.blackList.indexOf(member.id);
    if (i >= 0) {
      this.client.blackList.splice(i, 1);
    }

    return message.channel.send(`Un-blacklisted ${member.tag}`);
  }
};
