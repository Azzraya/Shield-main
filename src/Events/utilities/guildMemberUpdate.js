'use strict';
const { GuildMember } = require('discord.js'),
  Db = require('../../Structures/Db'),
  Event = require('../../Structures/Event');

module.exports = class extends Event {
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  async run(oldMember, newMember) {
    if (oldMember.pending && !newMember.pending) {
      const settings = await Db('settings');
      const guildSettings = await settings.findOneOrNew({ guildId: newMember.guild.id });
      guildSettings.welcomerJoinRoles ??= [];
      if (guildSettings.welcomerJoinRoles.length) {
        newMember.roles.add(guildSettings.welcomerJoinRoles).catch(() => null);
      }
    }
  }
};
