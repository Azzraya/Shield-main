"use strict";

const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js"),
  anime = require("anime-actions");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Fun",
    });
  }
  // eslint-disable-next-line no-unused-vars

  async run(message, args) {
    const client = this.client;

    const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send(`please supply an @mention or ID`);
    }

    if (member.id === client.user.id) {
      return message.channel.send(`:( ouch.. Why...?, This is how you treat me...? :sob:`);
    }

    const e = new EmbedBuilder()
      .setTitle(`${message.author.tag} slaps ${member.user.tag}`)
      .setImage(await anime.slap())
      .setColor("Random");
    message.channel.send({ embeds: [e] });
  }
};
