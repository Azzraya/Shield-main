"use strict";

const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "checkbl",
      category: "Owner",
      ownerOnly: true,
    });
  }
  // eslint-disable-next-line no-unused-vars

  async run(message, args) {
    const client = this.client;

    let member = null;
    if (!args[0] || !(member = await client.users.fetch(args[0]))) {
      return message.channel.send({
        content: `Please include a user ID`,
      });
    }

    const blacklist = await Db("blacklist");
    const ub = await blacklist.findOne({ user: member.id });

    const em = new EmbedBuilder()
      .setColor("Random")
      .setThumbnail(member.avatarURL({ dynamic: true }))
      .addFields({
        name: `User blacklist check`,
        value: [
          `Name: ${member.tag}`,
          `User ID: ${member.id}`,
          `\u200b`,
          `Blacklisted: ${ub ? "User is blacklisted" : "User is not blacklisted"}`,
          `Blacklisted for: ${ub ? ub.reason : "No data to show"}`,
        ].join("\n"),
      });
    message.channel.send({ embeds: [em] });
  }
};
