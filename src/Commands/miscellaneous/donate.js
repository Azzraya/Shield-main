"use strict";

const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "donate",
      category: "Misc",
    });
  }

  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const e = new EmbedBuilder()
      .addFields({
        name: `Donations`,
        value: [
          `Would mean a ton if you donated to us donate [here](https://www.patreon.com/join/shieldBot01/checkout?ru=undefined) <3`,
        ].join("\n"),
      });
    message.channel.send({ embeds: [e] });
  }
};
