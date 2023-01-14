'use strict';
const { GuildMember, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db'),
  Event = require('../../Structures/Event');

module.exports = class extends Event {
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  async run(oldMember, newMember) {
    if (newMember.permissions.has(PermissionFlagsBits.Administrator)) return;

    const settings = await Db('settings');
    const guildSettings = await settings.findOneOrNew({ guildId: newMember.guild.id });

    if (guildSettings?.zalgoNicknamesEnabled) {
      if (oldMember?.nickname === newMember?.nickname) return;
      const regex = /%CC%/g;

      if (regex.test(encodeURIComponent(newMember?.nickname))) {
        newMember.setNickname(decodeURIComponent(encodeURIComponent(newMember.nickname.replace(/[^\x00-\x7F]/g, '')).replace(/%CC(%[A-Z0-9]{2})+%20/g, ' ').replace(/%CC(%[A-Z0-9]{2})+(\w)/g, '$2'))).catch(() => null);
      }
    }
  }
};
