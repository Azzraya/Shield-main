"use strict";

const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "vote",
      category: "Misc",
    });
  }

  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const client = this.client;

    const em = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields({
        name: `Vote for ${client.user.username}`,
        value: [
          `[Link](https://top.gg/bot/981205974125776947/vote) - Top.gg`,
        ].join("\n"),
      });
    message.channel.send({ embeds: [em] });
  }
};
