"use strict";

const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "policy",
      aliases: ["privacy"],
      category: "Misc",
    });
  }

  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const client = this.client;

    const embed = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL())
      .setColor("Red")
      .addFields({
        name: `**Policy**`,
        value: [
          `[click here](https://docs.google.com/document/d/1191a3LQnuh6cNKRTP9UD-ADqTCdE3eSeCNK4xQU6Bhk/edit)`,
        ].join("\n"),
      });
    message.channel.send({ embeds: [embed] });
  }
};
