'use strict';

const Command = require('../../Structures/Command'),
  { EmbedBuilder, Message } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['user', 'ui', 'lookup', 'whois', 'u'],
      description: 'Displays information about a provided user or the message author.',
      category: 'Information',
      usage: '[user]',
    });
  }
  /**
   * @param {Message} message
   */
  async run(message, [target]) {
    const user = await this.client.users.fetch(message.mentions.users.last() || target || message.author, { force: true }).catch(() => {
      message.reply(`Cannot match the id given!`);
      return;
    });

    if (!user) return;

    if (message.guild.members.cache.get(user.id)) {
      const target = message.guild.members.cache.get(user.id);
      const { presence, roles } = target;
      const formatter = new Intl.ListFormat('en-GB', { style: 'narrow', type: 'conjunction' });

      await user.fetch();

      const statusType = {
        idle: '1FJj7pX.png',
        dnd: 'fbLqSYv.png',
        online: 'JhW7v9d.png',
        invisible: 'dibKqth.png',
      };

      const activityType = ['🕹 *Playing*', '🎙 *Streaming*', '🎧 *Listening to*', '📺 *Watching*', '🤹🏻‍♀️ *Custom*', '🏆 *Competing in*'];

      const clientType = [
        { name: 'desktop', text: 'Computer', emoji: '💻' },
        { name: 'mobile', text: 'Phone', emoji: '🤳🏻' },
        { name: 'web', text: 'Website', emoji: '🌍' },
        { name: 'offline', text: 'Offline', emoji: '💤' },
      ];

      const badges = {
        BugHunterLevel1: 'Bug Hunter',
        BugHunterLevel2: 'Bug Buster',
        CertifiedModerator: 'Discord Certified Moderator',
        HypeSquadOnlineHouse1: 'Hypesquad Bravery',
        HypeSquadOnlineHouse2: 'Hypesquad Brilliance',
        HypeSquadOnlineHouse3: 'Hypesquad Balance',
        Hypesquad: 'Hypesquad Event Attendee',
        Partner: 'Discord Partner',
        PremiumEarlySupporter: 'Early Supporter',
        Staff: 'Discord Staff',
        VerifiedBot: 'Verified Bot',
        VerifiedDeveloper: 'Verified Developer',
      };

      const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
        let totalLength = 0;
        const result = [];

        for (const role of roles) {
          const roleString = `<@&${role.id}>`;

          if (roleString.length + totalLength > maxFieldLength) break;

          totalLength += roleString.length + 1;

          result.push(roleString);
        }

        return result.length;
      };

      const sortedRoles = roles.cache.map((role) => role).sort((a, b) => b.position - a.position).slice(0, roles.cache.size - 1);

      const clientStatus = presence?.clientStatus instanceof Object ? Object.keys(presence.clientStatus) : 'offline';
      const userFlags = user.flags.toArray();

      const deviceFilter = clientType.filter((device) => clientStatus.includes(device.name));
      const devices = !Array.isArray(deviceFilter) ? new Array(deviceFilter) : deviceFilter;

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(user.hexAccentColor || 'Random')
            .setAuthor({
              name: user.tag,
              iconURL: `https://i.imgur.com/${statusType[presence?.status || 'invisible']}`,
            })
            .setThumbnail(user.avatarURL({ size: 1024 }))
            .setImage(user.bannerURL({ size: 1024 }))
            .addFields({ name: 'ID', value: `💳 ${user.id}` },
              {
                name: '🎢 Activities',
                value: presence?.activities.length ? presence.activities.map((activity) => {
                  if (activity.name === 'Custom Status')
                    return `${activityType[activity.type]} ${this.client.emojis.cache.get(activity.emoji?.id) ? this.client.emojis.cache.get(activity.emoji?.id) : ''} ${activity.state || 'Emoji Only'}`;
                  else return `${activityType[activity.type]} ${activity.name}`;
                })
                  .join('\n')
                  : 'None',
              },
              { name: 'Joined Server', value: `🤝🏻 <t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
              { name: 'Account Created', value: `📆 <t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
              { name: 'Nickname', value: `🦸🏻‍♀️ ${target.nickname || 'None'}`, inline: true },
              {
                name: `Roles (${maxDisplayRoles(sortedRoles)} of ${sortedRoles.length})`,
                value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(' ') || 'None'}`,
              },
              { name: `Badges (${userFlags.length})`, value: userFlags.length ? formatter.format(userFlags.map((flag) => `**${badges[flag]}**`)) : 'None' },
              { name: `Devices`, value: devices.map((device) => `${device.emoji} ${device.text}`).join('\n'), inline: true },
              { name: 'Profile Colour', value: `🎨 ${user.hexAccentColor || 'None'}`, inline: true },
              {
                name: 'Boosting Server',
                value: `🏋🏻‍♀️ ${roles.premiumSubscriberRole ? `Since <t:${parseInt(target.premiumSinceTimestamp / 1000)}:R>` : 'No'}`,
                inline: true,
              },
              { name: 'Banner', value: user.bannerURL() ? '** **' : '🎏 None' }),
        ],
      });
    } else {
      const formatter = new Intl.ListFormat('en-GB', { style: 'narrow', type: 'conjunction' });
      const badges = {
        BugHunterLevel1: 'Bug Hunter',
        BugHunterLevel2: 'Bug Buster',
        CertifiedModerator: 'Discord Certified Moderator',
        HypeSquadOnlineHouse1: 'Hypesquad Bravery',
        HypeSquadOnlineHouse2: 'Hypesquad Brilliance',
        HypeSquadOnlineHouse3: 'Hypesquad Balance',
        Hypesquad: 'Hype Squad Event Attendee',
        Partner: 'Discord Partner',
        PremiumEarlySupporter: 'Early Supporter',
        Staff: 'Discord Staff',
        VerifiedBot: 'Verified Bot',
        VerifiedDeveloper: 'Verified Developer',
      };

      const userFlags = user.flags.toArray();

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(user.hexAccentColor || 'Random')
            .setAuthor({ name: user.tag })
            .setThumbnail(user.avatarURL({ size: 1024 }))
            .setImage(user.bannerURL({ size: 1024 }))
            .addFields({ name: 'ID', value: `💳 ${user.id}` },
              { name: 'Account Created', value: `📆 <t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
              { name: `Badges (${userFlags.length})`, value: userFlags.length ? formatter.format(userFlags.map((flag) => `**${badges[flag]}**`)) : 'None' },
              { name: 'Profile Colour', value: `🎨 ${user.hexAccentColor || 'None'}`, inline: true },
              { name: 'Banner', value: user.bannerURL() ? '** **' : '🎏 None' }),
        ],
      });
    }
  }
};
