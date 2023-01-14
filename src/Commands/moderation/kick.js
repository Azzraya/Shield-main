"use strict";

const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "kick",
      category: "Moderation",
      botPerms: [`KickMembers`],
      userPerms: [`KickMembers`],
    });
  }

  async run(message, args) {
    const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send({
        content: `Seems you have used this command incorectly please add the user id/mention you wanna kick`,
      });
    }

    if (member.id === message.author.id) {
      return message.channel.send("You cannot kick yourself");
    }

    const content = args.slice(1).join(" ");
    const forReason = content ? "for " + content : "";

    if (!member.kickable) {
      message.channel.send({
        content: `I cannot kick this user, please make sure this users roles is not above your own and that i am above the role of the user your trying to kick`,
      });
    } else if (member.kickable) {
      await member.send(`You have been kicked from ${member.guild.name} by ${message.author.tag} ${forReason}`).catch(() => null);

      await member.kick(content);
      await this.client.modLog(member.guild.id, `${message.author} kicked ${member.user} ${forReason}`);
      await message.channel.send(`You have kicked ${member.user.tag} | ${member.user.id} ${forReason}`);
    }
  }
};
