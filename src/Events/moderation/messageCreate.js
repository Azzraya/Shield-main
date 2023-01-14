'use strict';

const { Message, ChannelType, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db'),
  Event = require('../../Structures/Event'),
  spamMap = new Map();

module.exports = class extends Event {
  /**
   * @param {Message} message
   */
  async run(message) {
    const { guildId, channelId, channel, author, content, member, guild } = message;
    if (author.bot || channel.type === ChannelType.DM || !guild || !member || member?.permissions.has(PermissionFlagsBits.Administrator)) return;

    const settings = await Db('settings');
    const guildSettings = await settings.findOneOrNew({ guildId });

    // mass mention
    if (guildSettings?.mentionRoleEnabled || guildSettings?.mentionMemberEnabled) {
      if (!guildSettings?.mentionIgnoredChannels) guildSettings.mentionIgnoredChannels = [];
      if (guildSettings?.mentionIgnoredChannels.includes(channelId)) return;

      let memberLimit = guildSettings?.mentionMemberLimit ?? 5;
      let roleLimit = guildSettings?.mentionRoleLimit ?? 5;

      if (guildSettings?.mentionMemberEnabled && message.mentions.members.size > memberLimit) {
        return message.delete().catch(() => {
          channel.send(`${author}, you're mentioning too many members!\nMessage could not be deleted.`);
        }).then(() => {
          channel.send(`${author}, you're mentioning too many members!\nMessage has been deleted.`);
        });
      } else if (guildSettings?.mentionRoleEnabled && message.mentions.roles.size > roleLimit) {
        return message.delete().catch(() => {
          return channel.send(`${author}, you're mentioning too many roles!\nMessage could not be deleted.`);
        }).then(() => {
          return channel.send(`${author}, you're mentioning too many roles!\nMessage has been deleted.`);
        });
      }
    }

    // anti spam
    if (guildSettings?.spamEnabled) {
      if (!guildSettings?.spamIgnoredChannels) guildSettings.spamIgnoredChannels = [];
      if (guildSettings?.spamIgnoredChannels.includes(channelId)) return;

      let diff = guildSettings?.spamDifference ?? 5;
      let limit = guildSettings?.spamLimit ?? 5;

      if (spamMap.has(author.id)) {
        const userData = spamMap.get(author.id);
        const difference = message.createdTimestamp - userData.lastMessage.createdTimestamp;
        if (difference > diff * 1000) {
          clearTimeout(userData.timer);
          userData.msgCount = 1;
          userData.lastMessage = message;
          userData.timer = setTimeout(() => spamMap.delete(author.id), diff * 1000);
          spamMap.set(author.id, userData);
        } else {
          ++userData.msgCount;
          if (userData.msgCount === limit) {
            try {
              let messages = await channel.messages.fetch({ limit: limit }).catch(() => (messages = []));
              messages = messages.filter((msg) => msg.author.id === author.id);
              return message.channel.bulkDelete(messages).catch(() => {
                return channel.send(`${author}, you're sending messages too quickly! Please slow down.\n${messages.size} messages could not be deleted...`);
              }).then(() => {
                return channel.send(`${author}, you're sending messages too quickly! Please slow down.\n${messages.size} messages have been deleted...`);
              });
            } catch (e) { }
          }
        }
      } else {
        let timeout = setTimeout(() => spamMap.delete(author.id), diff * 1000);
        spamMap.set(author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: timeout,
        });
      }
    }

    // zalgo text
    if (guildSettings?.zalgoEnabled) {
      if (!guildSettings?.zalgoIgnoredChannels) guildSettings.zalgoIgnoredChannels = [];
      if (guildSettings?.zalgoIgnoredChannels.includes(channelId)) return;

      const regex = /%CC%/g;

      if (regex.test(encodeURIComponent(content))) {
        return message.delete().catch(() => {
          channel.send(`${author}, zalgo text is not allowed!\nMessage could not be deleted.`);
        }).then(() => {
          channel.send(`${author}, zalgo text is not allowed!\nMessage has been deleted.`);
        });
      }
    }

    // caps lock
    if (guildSettings?.capslockEnabled) {
      if (!guildSettings?.capslockIgnoredChannels) guildSettings.capslockIgnoredChannels = [];
      if (guildSettings?.capslockIgnoredChannels.includes(channelId)) return;

      if (content.length >= 6) {
        let caps = 0;
        let msg = content.replace(/ /g, '').replace(/1/g, '').replace(/2/g, '').replace(/3/g, '').replace(/4/g, '').replace(/5/g, '').replace(/6/g, '').replace(/7/g, '').replace(/8/g, '').replace(/9/g, '').replace(/0/g, '').replace(/\!/g, '').replace(/\?/g, '').replace(/\./g, '').replace(/\-/g, '').replace(/\+/g, '').replace(/\_/g, '').replace(/\;/g, '').replace(/\,/g, '').replace(/\:/g, '').replace(/\#/g, '').replace(/\@/g, '').replace(/\&/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\\/g, '').replace(/\//g, '').replace(/\$/g, '').replace(/\€/g, '').replace(/\£/g, '').replace(/\¥/g, '').replace(/\¢/g, '').replace(/\§/g, '').replace(/\¶/g, '').replace(/\°/g, '').replace(/\×/g, '').replace(/\¬/g, '').replace(/\*/g, '').replace(/\~/g, '').replace(/\%/g, '').replace(/\"/g, '').replace(/\'/g, '').replace(/\´/g, '').replace(/\`/g, '').replace(/\{/g, '').replace(/\}/g, '').replace(/\[/g, '').replace(/\]/g, '').replace(/\=/g, '').replace(/\±/g, '').replace(/\¡/g, '').replace(/\¿/g, '').replace(/\ʼ/g, '').replace(/\‹/g, '').replace(/\›/g, '').replace(/\‡/g, '').replace(/\>/g, '').replace(/\</g, '').replace(/\⟩/g, '').replace(/\⟨/g, '').replace(/\†/g, '').replace(/\«/g, '').replace(/\»/g, '').replace(/\≥/g, '').replace(/\≤/g, '').replace(/\|/g, '').replace(/\∆/g, '').replace(/\π/g, '').replace(/\÷/g, '').replace(/\√/g, '').replace(/\©/g, '').replace(/\®/g, '').replace(/\™/g, '').replace(/\✓/g, '').replace(/\^/g, '').replace(/\¯/g, '').replace(/\ツ/g, '').replace(/\╯/g, '').replace(/\□/g, '').replace(/\︵/g, '').replace(/\┻/g, '').replace(/\━/g, '').replace(/\）/g, '').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');

        for (var i = 0; i < msg.length; i++) {
          if (msg[i].toUpperCase() === msg[i]) caps++;
        }

        const percentage = guildSettings?.capslockPercentage ?? 75;
        const capsPercent = (caps / msg.length) * 100;
        if (capsPercent > percentage) {
          return message.delete().catch(() => {
            channel.send(`${author}, you're using too many CAPITALS!\nMessage could not be deleted.`);
          }).then(() => {
            channel.send(`${author}, you're using too many CAPITALS!\nMessage has been deleted.`);
          });
        }
      }
    }

    // server invites
    if (guildSettings?.invitesEnabled) {
      if (!guildSettings?.invitesIgnoredChannels) guildSettings.invitesIgnoredChannels = [];
      if (guildSettings?.invitesIgnoredChannels.includes(channelId)) return;
      const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
      if (regex.test(message.content)) {
        return message.delete().catch(() => {
          channel.send(`${author}, do note share invites!\nMessage could not be deleted.`);
        }).then(() => {
          channel.send(`${author}, do note share invites!\nMessage has been deleted.`);
        });
      }
    }

    // emoji
    if (guildSettings?.emojiEnabled) {
      if (!guildSettings?.emojiIgnoredChannels) guildSettings.emojiIgnoredChannels = [];
      if (guildSettings?.emojiIgnoredChannels.includes(channelId)) return;

      let limit = guildSettings?.emojiLimit ?? 5;

      const regex = /((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu;
      const emojiList = content.match(regex);

      if (emojiList && emojiList?.length > limit) {
        return message.delete().catch(() => {
          channel.send(`${author}, you're using too many emojis!\nMessage could not be deleted.`);
        }).then(() => {
          channel.send(`${author}, you're using too many emojis!\nMessage has been deleted.`);
        });
      }
    }
  }
};
