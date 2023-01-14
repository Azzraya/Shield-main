"use strict";

const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["pong"],
      description: "This provides the ping of the bot",
      category: "Utilities",
      cooldown: 10,
    });
  }

  async run(message) {
    const msg = await message.channel.send(":ping_pong: Pinging..."),
      latency = msg.createdTimestamp - message.createdTimestamp;

    let i = 0,
      s = Date.now();
    while (Date.now() - s <= 1) i++;

    const e = new EmbedBuilder()
      .setColor("Random")
      .addFields({
        name: "Bot Latency:",
        value: [
          `${latency.toLocaleString()}ms`
        ].join("\n"),
      })

      .addFields({
        name: "API Latency:",
        value: [
          `${Math.round(this.client.ws.ping).toLocaleString()}ms`
        ].join("\n"),
      })

      .addFields({
        name: `Shard Latency`,
        value: [
          `${Math.round(msg.guild.shard.ping).toLocaleString()}ms`
        ].join("\n")
      })

      .addFields({
        name: `Server TPS`,
        value: [
          `${i.toLocaleString()}TPS`
        ].join("\n")
      })

      .setTimestamp();

    await msg.edit({ content: "​", embeds: [e] });
  }
};
