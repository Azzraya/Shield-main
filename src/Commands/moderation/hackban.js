"use strict";

const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "hackban",
      aliases: ["hackbean"],
      category: "Moderation",
      botPerms: [`BanMembers`],
      userPerms: [`BanMembers`],
      args: true,
    });
  }

  async run(message, args) {
    const client = this.client;
    const user = await client.users.fetch(args[0], { force: true });
    if (!user) return message.reply("ID did not match any user");

    if (user.id === message.author.id) {
      return message.channel.send("You cannot ban yourself");
    }

    const content = args.slice(1).join(" "),
      reason = content ? "for " + content : "";

    let member = undefined;
    if (message.guild.members.cache.get(user.id))
      member = message.guild.members.cache.get(user.id);
    if (member && !member.bannable) {
      message.channel.send({
        content: `I cannot ban this user, please make sure this users roles is not above your own and that i am above the role of the user your trying to ban`,
      });
    } else if (member && member.bannable) {
      await member.send(`You have been banned from ${member.guild.name} by ${message.author.tag} ${reason}`).catch(() => null);

      member.ban({ reason: reason }).catch(() => null);
      await this.client.modLog(message.guild.id, `${message.author} banned ${user} ${reason}`);

      await message.channel.send(`You have banned ${member.user.tag} | ${member.user.id} ${reason}`);
    } else {
      message.guild.members.ban(user.id).catch(() => { });
      await this.client.modLog(message.guild.id, `${message.author} hack banned ${user} ${reason}`);

      await message.channel.send(`You have hackbanned ${user.tag} | ${user.id} ${reason}`);
    }
  }
};
