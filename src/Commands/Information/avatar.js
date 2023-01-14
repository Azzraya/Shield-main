'use strict';

const { EmbedBuilder } = require('discord.js'),
  Command = require('../../Structures/Command');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'avatar',
      aliases: ['av'],
      category: 'Information',
      cooldown: 10,
    });
  }

  async run(message, [target]) {
    const client = this.client;
    const user = await client.users.fetch(message.mentions.users.last() || target || message.author, {
      force: true,
    }).catch(() => {
      message.reply(`Cannot match the id given!`);
      return;
    });

    if (!user) return;

    const member = message.guild.members.cache.get(user.id);

    const e = new EmbedBuilder()
      .setTitle(`${user.username}\'s avatar`)
      .setColor('Random')
      .setTimestamp()
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

    if (member) {
      e.setTitle(`${member.user.username}\'s avatar`)
        .setColor('Random')
        .setTimestamp()
        .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }));
    }

    message.channel.send({ embeds: [e] });
  }
};
