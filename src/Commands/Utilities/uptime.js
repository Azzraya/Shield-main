"use strict";

const Command = require("../../Structures/Command"),
  ms = require("ms"),
  { EmbedBuilder } = require("discord.js"),
  os = require("os");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "uptime",
      aliases: ["ut"],
      description: "This provides the current uptime of the bot.",
      category: "Utilities",
    });
  }

  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const e = new EmbedBuilder()
      .setColor("Random")
      .addFields({
        name: `My uptime is`,
        value: [
          `\`${ms(this.client.uptime, { long: true })}\``
        ].join("\n"),
      })

      .addFields({
        name: `My host uptime is`,
        value: [
          `\`${ms(os.uptime() * 1000, { long: true })}\``
        ].join("\n"),
      })

      .setTimestamp();
    message.channel.send({ embeds: [e] });
  }
};
