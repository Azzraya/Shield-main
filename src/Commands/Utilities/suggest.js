"use strict";

const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "suggest",
      category: "Utilities",
    });
  }

  async run(message, args) {
    const msg = message;

    if (!args[0]) {
      return message.channel.send("You need to enter a Suggestion");
    }

    message.channel.send({ content: `Thank you ${message.author.username} for giving your suggestion`, });

    const embed = new EmbedBuilder()
      .setTitle(`New Suggestion`)
      .setColor("Random")
      .setThumbnail(msg.author.avatarURL({ dynamic: true }))
      .setTimestamp()
      .addFields({
        name: `User Information`,
        value: [
          `Username: ${message.author.tag}`,
          `ID: ${message.author.id}`,
        ].join("\n"),
      })
      .addFields({
        name: `Suggestion:`,
        value: [
          `${args.join(" ")}`
        ].join("\n"),
      })
      .setTimestamp();

    this.client.channels.cache.get("984146713738629170").send({ embeds: [embed] });
  }
};
