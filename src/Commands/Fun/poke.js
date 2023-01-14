"use strict";

const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js"),
  anime = require("anime-actions");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Fun",
    });
  }
  // eslint-disable-next-line no-unused-vars

  async run(message, args) {
    const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send(`please supply an @mention or ID`);
    }

    const embed = new EmbedBuilder()
      .setTitle(`${message.author.tag} pokes ${member.user.tag}`)
      .setImage(await anime.poke())
      .setColor("Random");
    message.channel.send({ embeds: [embed] });
  }
};
