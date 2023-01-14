'use strict';
const { GuildMember, EmbedBuilder } = require('discord.js'),
  Db = require('../../Structures/Db'),
  Event = require('../../Structures/Event');

module.exports = class extends Event {
  /**
   * @param {GuildMember} member
   */
  async run(member) {
    const { guild, user } = member;

    const settings = await Db('settings');
    const guildSettings = await settings.findOneOrNew({ guildId: guild.id });

    guildSettings.welcomerJoinChannel ??= undefined;
    guildSettings.welcomerLeaveChannel ??= undefined;
    guildSettings.welcomerJoinMessage ??= 'Welcome to {server}, {user}!';
    guildSettings.welcomerLeaveMessage ??= 'Goodbye {user}!';
    guildSettings.welcomerJoinRoles ??= [];

    if (guildSettings.welcomerJoinRoles.length) {
      if (!member.pending) member.roles.add(guildSettings.welcomerJoinRoles).catch(() => { });
    }

    const channel = this.client.channels.cache.get(guildSettings.welcomerJoinChannel);
    if (channel) {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(guildSettings.welcomerJoinMessage.replace(/\{server\}/m, `${guild.name}`).replace(/\{user\}/m, `${user}`).replace(/\{userId\}/m, `${user.id}`).replace(/\{userTag\}/m, `${user.tag}`).replace(/\{memberCount\}/m, `${guild.memberCount}`).replace(/\\n/, '\n'))
        .setFooter({ text: `ID: ${user.id}` });
      channel.send({ embeds: [embed] });
    }
  }
};
