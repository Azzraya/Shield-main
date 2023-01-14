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

  async run(message) {
    const embed = new EmbedBuilder()
      .setImage(await anime.wallpaper())
      .setColor("Random");
    message.channel.send({ embeds: [embed] });
  }
};
