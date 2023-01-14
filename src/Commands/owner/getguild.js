"use strict";

const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "getguild",
      aliases: ["gg", "guild", "g"],
      category: "Owner",
      ownerOnly: true,
    });
  }
  // eslint-disable-next-line no-unused-vars

  async run(message, args) {
    const client = this.client,
      msg = message;

    const guild = client.guilds.cache.get(args[0]) || message.guild;

    const em = new EmbedBuilder()
      .setColor("Random")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields({
        name: `Guild info for ${guild.name}`,
        value: [
          `Guild name: ${guild.name}`,
          `Guild ID: ${guild.id}`,
          `Owner: ${(await guild.fetchOwner()).user.tag}`,
          `Owner ID: ${guild.ownerId}`,
          `Users: ${guild.members.cache.size.toLocaleString()}`,
          `Channels: ${guild.channels.cache.size.toLocaleString()}`,
        ].join("\n"),
      });
    msg.channel.send({ embeds: [em] });
  }
};
