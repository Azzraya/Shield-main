'use strict';
const moment = require('moment'),
  { GuildMember } = require('discord.js'),
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

    if (guildSettings?.autobanEnabled) {
      const age = moment().diff(user.createdTimestamp, 'days');
      const minimum = guildSettings?.autobanAge ?? 1;

      if (age < minimum) {
        await user.send(`You were banned from **${member.guild.name}** because your account needs to be at least ${minimum} days old!`).catch(() => null);
        await member.ban({ reason: 'AutoBan: Account too young!' }).catch(() => null);
      }
    }
    if (guildSettings?.zalgoNicknamesEnabled) {
      const regex = /%CC%/g;
      if (regex.test(encodeURIComponent(member?.nickname))) {
        member.setNickname(decodeURIComponent(encodeURIComponent(member.nickname.replace(/[^\x00-\x7F]/g, '')).replace(/%CC(%[A-Z0-9]{2})+%20/g, ' ').replace(/%CC(%[A-Z0-9]{2})+(\w)/g, '$2'))).catch(() => null);
      }
    }
  }
};
