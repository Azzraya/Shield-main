"use strict";

const { EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "shardstats",
      aliases: ["ss", "shards"],
      category: "Information",
    });
  }
  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const msg = message,
      client = this.client;

    client.shard.broadcastEval((client) => [
      client.shard.ids,
      client.ws.status,
      client.ws.ping,
      client.guilds.cache.size,
    ]).then((results) => {
      const embed = new EmbedBuilder()
        .setTitle(`Bot Shards (${msg.guild.shard.id}/${client.shard.count})`)
        .setColor("Random")
        .setTimestamp();

      results.map((data) => {
        embed.addFields({
          name: `Shard ${data[0]}`,
          value: `**Status:** ${data[1]}\n**Ping:** ${data[2]}ms\n**Guilds:** ${data[3]}`,
        });
      });
      message.channel.send({ embeds: [embed] });
    });
  }
};
