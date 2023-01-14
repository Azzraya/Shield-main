"use strict";

const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "debug",
      category: "Utilities",
    });
  }

  // eslint-disable-next-line no-unused-vars

  async run(message, args) {
    const client = this.client;

    const guild = client.guilds.cache.get(args[0]) || message.guild;

    const debugEmbed = new EmbedBuilder()
      .setColor("Red")
      .addFields({
        name: `Debug Information for ${guild.name}`,
        value: [
          `Current shard: ${guild?.shard.id ?? 0}`,
          `Guild ID: ${guild.id}`,
          `user: ${message.author.tag} | (${message.author.id})`,
        ].join("\n"),
      });
    message.channel.send({ embeds: [debugEmbed] });
  }
};
