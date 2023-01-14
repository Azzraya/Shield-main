"use strict";

const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ban",
      aliases: ["bean"],
      category: "Moderation",
      botPerms: [`BanMembers`],
      userPerms: [`BanMembers`],
    });
  }

  async run(message, args) {
    const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send({
        content: `Seems you have used this command incorectly please add the user id/mention you wanna ban`,
      });
    }

    if (member.id === message.author.id) {
      return message.channel.send("You cannot ban yourself");
    }

    const content = args.slice(1).join(" "),
      reason = content ? "for " + content : "";

    if (!member.bannable) {
      message.channel.send({
        content: `I cannot ban this user, please make sure this users roles is not above your own and that i am above the role of the user your trying to ban`,
      });
    } else if (member.bannable) {
      await member.send(`You have been banned from ${member.guild.name} by ${message.author.tag} ${reason}`).catch(() => null);

      member.ban({ reason: reason });
      await this.client.modLog(member.guild.id, `${message.author} banned ${member.user} ${reason}`);

      await message.channel.send(`You have banned ${member.user.tag} | ${member.user.id} ${reason}`);
    }
  }
};
