"use strict";

const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js"),
  anime = require("anime-actions");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Fun",
      guildOnly: true,
    });
  }
  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const e = new EmbedBuilder()
      .setTitle(`${message.author.tag} waves`)
      .setImage(await anime.wave())
      .setColor("Random");
    message.channel.send({ embeds: [e] });
  }
};
