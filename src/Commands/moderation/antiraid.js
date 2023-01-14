"use strict";

const { Message, EmbedBuilder } = require("discord.js"),
  Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "antiraid",
      aliases: ["raid"],
      category: "Moderation",
      botPerms: [],
      userPerms: ["ManageChannels"],
    });
  }

  /**
   * @param {Message} message
   * @param {Array<string>} args
   */

  async run(message, args) {
    const { guildId, author } = message,
      settings = await Db("settings");
    let guildSettings = await settings.findOneOrNew({ guildId });

    switch (args[0]) {
      default:
        {
          const helpEmbed = new EmbedBuilder()
            .setAuthor({
              name: author.username,
              iconURL: author.avatarURL({ dynamic: true }),
            })
            .setColor("Red")
            .addFields(
              {
                name: "Message Spam",
                value:
                  '`msgspam toggle` - toggles whether spam should be deleted or not\n' +
                  '`msgspam <ignore/unignore> <channel>` - ignores spam in the ignored channels\n' +
                  `\`msgspam limit <number>\` - sets the max amount of messages you can send in ${guildSettings?.spamDifference ?? 5} seconds\n` +
                  `\`msgspam difference <number>\` - sets the max amount of seconds you can send ${guildSettings?.spamLimit ?? 5} messages in\n` +
                  `*Current Settings* - (${guildSettings?.spamEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.spamLimit ?? 5} messages in ${guildSettings?.spamDifference ?? 5} seconds`,
              },
              {
                name: "Emoji Spam",
                value:
                  "`emojispam toggle` - toggles whether emoji spam should be deleted or not\n" +
                  "`emojispam <ignore/unignore> <channel>` - ignores emoji spam in the ignored channels\n" +
                  "`emojispam limit <number>` - sets the max amount of emojis you can send in one messsage\n" +
                  `*Current Settings* - (${guildSettings?.emojiEnabled ? "enabled" : "disabled"}) ${guildSettings?.emojiLimit ?? 5} emojis in one message`,
              },
              {
                name: "Mass User Mention",
                value:
                  '`usermention toggle` - toggles whether mass mention should be deleted or not\n' +
                  '`usermention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
                  '`usermention limit <number>` - sets the max amount of users you can mention in a message\n' +
                  `*Current Settings* - (${guildSettings?.mentionMemberEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionUserLimit ?? 5} user mentions in one message`,
              },
              {
                name: "Mass Role Mention",
                value:
                  '`rolemention toggle` - toggles whether mass mention should be deleted or not\n' +
                  '`rolemention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
                  '`rolemention limit <number>` - sets the max amount of roles you can mention in a message\n' +
                  `*Current Settings* - (${guildSettings?.mentionRoleEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionRoleLimit ?? 5} role mentions in one message`,
              },
              {
                name: "Zalgo Text",
                value:
                  '`zalgo toggle` - toggles whether zalgo text should be deleted or not\n' +
                  '`zalgo nicknames` - toggles whether nicknames with zalgo text should be translated\n' +
                  '`zalgo <ignore/unignore> <channel>` - ignores zalgo text in the ignored channels\n' +
                  `*Current Settings* - (${guildSettings?.zalgoEnabled ? 'enabled' : 'disabled'}) Text | (${guildSettings?.zalgoNicknamesEnabled ? 'enabled' : 'disabled'}) Nicknames`,
              },
              {
                name: "Ban New Accounts",
                value:
                  "`ban toggle` - toggles whether new accounts should be banned or not\n" +
                  "`ban minimumage <number>` - how old accounts have to be in order to join\n" +
                  `*Current Settings* - (${guildSettings?.autobanEnabled ? "enabled" : "disabled"}) ${guildSettings?.autobanAge ?? 1} day old`,
              },
              {
                name: "Server Invites",
                value:
                  "`invite toggle` - toggles whether invite links should be deleted or not\n" +
                  "`invite <ignore/unignore> <channel>` - ignores invite links in the ignored channels\n" +
                  `*Current Settings* - (${guildSettings?.invitesEnabled ? "enabled" : "disabled"})`,
              },
              {
                name: "Caps Lock",
                value:
                  "`capslock toggle` - toggles whether caps lock should be deleted or not\n" +
                  "`capslock percentage <number>` - how many percent of the message have to be caps\n" +
                  "`capslock <ignore/unignore> <channel>` - ignores caps lock in the ignored channels\n" +
                  `*Current Settings* - (${guildSettings?.capslockEnabled ? "enabled" : "disabled"}) ${guildSettings?.capslockPercentage ?? 75}%`,
              },
              {
                name: "Ignored Channels",
                value:
                  `(Message Spam): ${guildSettings?.spamIgnoredChannels?.map((id) => `<#${id}>`).join(', ') || 'None'}\n` +
                  `(Emoji Spam): ${guildSettings?.emojiIgnoredChannels?.map((id) => `<#${id}>`).join(', ') || 'None'}\n` +
                  `(Mass Mention): ${guildSettings?.mentionIgnoredChannels?.map((id) => `<#${id}>`).join(', ') || 'None'}\n` +
                  `(Zalgo Text): ${guildSettings?.zalgoIgnoredChannels?.map((id) => `<#${id}>`).join(', ') || 'None'}\n` +
                  `(Server Invites): ${guildSettings?.invitesIgnoredChannels?.map((id) => `<#${id}>`).join(', ') || 'None'}\n` +
                  `(Caps Lock): ${guildSettings?.capslockIgnoredChannels?.map((id) => `<#${id}>`).join(', ') || 'None'}`,
              }
            )
            .setTimestamp();
          message.reply({ embeds: [helpEmbed] });
        }
        break;
      case "msgspam":
      case "mspam":
        {
          switch (args[1]) {
            default:
              {
                const spamHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Message Spam",
                    value:
                      '`msgspam toggle` - toggles whether spam should be deleted or not\n' +
                      '`msgspam <ignore/unignore> <channel>` - ignores spam in the ignored channels\n' +
                      `\`msgspam limit <number>\` - sets the max amount of messages you can send in ${guildSettings?.spamDifference ?? 5} seconds\n` +
                      `\`msgspam difference <number>\` - sets the max amount of seconds you can send ${guildSettings?.spamLimit ?? 5} messages in\n` +
                      `*Current Settings* - (${guildSettings?.spamEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.spamLimit ?? 5} messages in ${guildSettings?.spamDifference ?? 5} seconds`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [spamHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.spamEnabled ? (guildSettings.spamEnabled = false) : (guildSettings.spamEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.spamEnabled ? "enabled" : "disabled"} the anti spam module`);
                const spamToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.spamEnabled ? "enabled" : "disabled"} anti spam module`)
                  .setTimestamp();
                message.reply({ embeds: [spamToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.spamIgnoredChannels)
                  guildSettings.spamIgnoredChannels = [];
                if (guildSettings?.spamIgnoredChannels.includes(channelId)) {
                  guildSettings.spamIgnoredChannels = guildSettings?.spamIgnoredChannels.filter((id) => id != channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.spamIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.spamIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
            case "limit":
              {
                const limit = parseInt(args[2]);
                if (!limit || isNaN(limit))
                  return message.reply("You did not provide a number");
                if (limit > 100 || limit <= 1)
                  return message.reply("Limit must be greater than 1 and less than 100");
                guildSettings.spamLimit = limit;
                settings.save(guildSettings);
                message.reply(`The message spam limit has been set to ${limit} messages in ${guildSettings?.spamDifference ?? 5} seconds`);
              }
              break;
            case "difference":
            case "diff":
              {
                const diff = parseInt(args[2]);
                if (!diff || isNaN(diff))
                  return message.reply("You did not provide a number");
                if (diff > 60 || diff < 3)
                  return message.reply("Difference must be greater than 3 and less than 60");
                guildSettings.spamDifference = difference;
                settings.save(guildSettings);
                message.reply(`The message spam difference has been set to ${guildSettings?.spamLimit ?? 5} messages in ${diff} seconds`);
              }
              break;
          }
        }
        break;
      case "emojispam":
      case "espam":
        {
          switch (args[1]) {
            default:
              {
                const emojiHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Emoji Spam",
                    value:
                      "`emojispam toggle` - toggles whether emoji spam should be deleted or not\n" +
                      "`emojispam <ignore/unignore> <channel>` - ignores emoji spam in the ignored channels\n" +
                      "`emojispam limit <number>` - sets the max amount of emojis you can send in one messsage\n" +
                      `*Current Settings* - (${guildSettings?.emojiEnabled ? "enabled" : "disabled"}) ${guildSettings?.emojiLimit ?? 5} emojis in one message`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [emojiHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.emojiEnabled ? (guildSettings.emojiEnabled = false) : (guildSettings.emojiEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.emojiEnabled ? "enabled" : "disabled"} the emoji spam module`);
                const emojiToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.emojiEnabled ? "enabled" : "disabled"} anti emoji spam module`)
                  .setTimestamp();
                message.reply({ embeds: [emojiToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.emojiIgnoredChannels)
                  guildSettings.emojiIgnoredChannels = [];
                if (guildSettings?.emojiIgnoredChannels.includes(channelId)) {
                  guildSettings.emojiIgnoredChannels = guildSettings?.emojiIgnoredChannels.filter((id) => id != channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.emojiIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.emojiIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
            case "limit":
              {
                const limit = parseInt(args[2]);
                if (!limit || isNaN(limit))
                  return message.reply("You did not provide a number");
                if (limit > 1000 || limit <= 1)
                  return message.reply("Limit must be greater than 1 and less than 1000");
                guildSettings.emojiLimit = limit;
                settings.save(guildSettings);
                message.reply(`The emoji limit has been set to ${limit} emojis in one message`);
              }
              break;
          }
        }
        break;
      case "usermention":
      case "umention":
      case "mention":
      case "mmention":
      case "massmention":
        {
          switch (args[1]) {
            default:
              {
                const mentionMemberHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Mass User Mention",
                    value:
                      '`usermention toggle` - toggles whether mass mention should be deleted or not\n' +
                      '`usermention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
                      '`usermention limit <number>` - sets the max amount of users you can mention in a message\n' +
                      `*Current Settings* - (${guildSettings?.mentionMemberEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionUserLimit ?? 5} user mentions in one message`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [mentionMemberHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.mentionMemberEnabled ? (guildSettings.mentionMemberEnabled = false) : (guildSettings.mentionMemberEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.mentionMemberEnabled ? "enabled" : "disabled"} the anti mass user mention module`);
                const mentionMemberToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.mentionMemberEnabled ? "enabled" : "disabled"} anti mass user mention module`)
                  .setTimestamp();
                message.reply({ embeds: [mentionMemberToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.mentionIgnoredChannels)
                  guildSettings.mentionIgnoredChannels = [];
                if (guildSettings?.mentionIgnoredChannels.includes(channelId)) {
                  guildSettings.mentionIgnoredChannels = guildSettings?.mentionIgnoredChannels.filter((id) => id != channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.mentionIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.mentionIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
            case "limit":
              {
                const limit = parseInt(args[2]);
                if (!limit || isNaN(limit))
                  return message.reply("You did not provide a number");
                if (limit > 1000 || limit <= 1)
                  return message.reply("Limit must be greater than 1 and less than 1000");
                guildSettings.mentionMemberLimit = limit;
                settings.save(guildSettings);
                message.reply(`The user mention limit has been set to ${limit} user mentions in one message`);
              }
              break;
          }
        }
        break;
      case "rolemention":
      case "rmention":
        {
          switch (args[1]) {
            default:
              {
                const mentionRoleHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Mass Role Mention",
                    value:
                      '`rolemention toggle` - toggles whether mass mention should be deleted or not\n' +
                      '`rolemention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
                      '`rolemention limit <number>` - sets the max amount of roles you can mention in a message\n' +
                      `*Current Settings* - (${guildSettings?.mentionRoleEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionRoleLimit ?? 5} role mentions in one message`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [mentionRoleHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.mentionRoleEnabled ? (guildSettings.mentionRoleEnabled = false) : (guildSettings.mentionRoleEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.mentionRoleEnabled ? "enabled" : "disabled"} the anti mass role mention module`);
                const mentionRoleToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.mentionRoleEnabled ? "enabled" : "disabled"} anti mass role mention module`)
                  .setTimestamp();
                message.reply({ embeds: [mentionRoleToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.mentionIgnoredChannels)
                  guildSettings.mentionIgnoredChannels = [];
                if (guildSettings?.mentionIgnoredChannels.includes(channelId)) {
                  guildSettings.mentionIgnoredChannels = guildSettings?.mentionIgnoredChannels.filter((id) => id != channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.mentionIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.mentionIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
            case "limit":
              {
                const limit = parseInt(args[2]);
                if (!limit || isNaN(limit))
                  return message.reply("You did not provide a number");
                if (limit > 1000 || limit <= 1)
                  return message.reply("Limit must be greater than 1 and less than 1000");
                guildSettings.mentionRoleLimit = limit;
                settings.save(guildSettings);
                message.reply(`The role mention limit has been set to ${limit} role mentions in one message`);
              }
              break;
          }
        }
        break;
      case "zalgotext":
      case "zalgo":
        {
          switch (args[1]) {
            default:
              {
                const zalgoHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Zalgo Text",
                    value:
                      '`zalgo toggle` - toggles whether zalgo text should be deleted or not\n' +
                      '`zalgo nicknames` - toggles whether nicknames with zalgo text should be translated\n' +
                      '`zalgo <ignore/unignore> <channel>` - ignores zalgo text in the ignored channels\n' +
                      `*Current Settings* - (${guildSettings?.zalgoEnabled ? 'enabled' : 'disabled'}) Text | (${guildSettings?.zalgoNicknamesEnabled ? 'enabled' : 'disabled'}) Nicknames`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [zalgoHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.zalgoEnabled ? (guildSettings.zalgoEnabled = false) : (guildSettings.zalgoEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.zalgoEnabled ? "enabled" : "disabled"} the anti zalgo text module`);
                const zalgoToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.zalgoEnabled ? "enabled" : "disabled"} anti zalgo text module`)
                  .setTimestamp();
                message.reply({ embeds: [zalgoToggledEmbed] });
              }
              break;
            case "nicknames":
              {
                guildSettings?.zalgoNicknamesEnabled ? (guildSettings.zalgoNicknamesEnabled = false) : (guildSettings.zalgoNicknamesEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.zalgoNicknamesEnabled ? "enabled" : "disabled"} the anti zalgo nickname module`);
                const zalgoNicknameToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.zalgoNicknamesEnabled ? "enabled" : "disabled"} anti anti zalgo nickname module`)
                  .setTimestamp();
                message.reply({ embeds: [zalgoNicknameToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.zalgoIgnoredChannels)
                  guildSettings.zalgoIgnoredChannels = [];
                if (guildSettings?.zalgoIgnoredChannels.includes(channelId)) {
                  guildSettings.zalgoIgnoredChannels = guildSettings?.zalgoIgnoredChannels.filter((id) => id != channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.zalgoIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.zalgoIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
          }
        }
        break;
      case "autoban":
      case "ban":
        {
          switch (args[1]) {
            default:
              {
                const autobanHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Ban New Accounts",
                    value:
                      "`ban toggle` - toggles new accounts should be banned or not\n" +
                      "`ban minimumage <number>` - how old accounts have to be in order to join\n" +
                      `*Current Settings* - (${guildSettings?.autobanEnabled ? "enabled" : "disabled"}) ${guildSettings?.autobanAge ?? 1} day old`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [autobanHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.autobanEnabled ? (guildSettings.autobanEnabled = false) : (guildSettings.autobanEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.autobanEnabled ? "enabled" : "disabled"} the auto ban module`);
                const autobanToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.autobanEnabled ? "enabled" : "disabled"} anti auto ban module`)
                  .setTimestamp();
                message.reply({ embeds: [autobanToggledEmbed] });
              }
              break;
            case "minimumage":
            case "mage":
            case "age":
              {
                const age = parseInt(args[2]);
                if (!age || isNaN(age))
                  return message.reply("You did not provide a number");
                if (age > 30 || age <= 0)
                  return message.reply("Age must be greater than 1 and less than 30");
                guildSettings.autobanAge = age;
                settings.save(guildSettings);
                message.reply(`The minimum age has been set to ${age} days`);
              }
              break;
          }
        }
        break;
      case "invites":
      case "invite":
        {
          switch (args[1]) {
            default:
              {
                const inviteHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Server Invites",
                    value:
                      "`invite toggle` - toggles whether invite links should be deleted or not\n" +
                      `*Current Settings* - (${guildSettings?.invitesEnabled ? "enabled" : "disabled"})`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [inviteHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.invitesEnabled
                  ? (guildSettings.invitesEnabled = false)
                  : (guildSettings.invitesEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.invitesEnabled ? "enabled" : "disabled"} the anti invite link module`);
                const inviteToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.invitesEnabled ? "enabled" : "disabled"} the anti invite link module`)
                  .setTimestamp();
                message.reply({ embeds: [inviteToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.invitesIgnoredChannels)
                  guildSettings.invitesIgnoredChannels = [];
                if (guildSettings?.invitesIgnoredChannels.includes(channelId)) {
                  guildSettings.invitesIgnoredChannels = guildSettings?.invitesIgnoredChannels.filter();
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.invitesIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.invitesIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
          }
        }
        break;
      case "capslock":
      case "caps":
        {
          switch (args[1]) {
            default:
              {
                const capslockHelp = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .addFields({
                    name: "Caps Lock",
                    value:
                      "`capslock toggle` - toggles whether caps lock should be deleted or not\n" +
                      "`capslock percentage <number>` - how many percent of the message have to be caps\n" +
                      "`capslock <ignore/unignore> <channel>` - ignores caps lock in the ignored channels\n" +
                      `*Current Settings* - (${guildSettings?.capslockEnabled ? "enabled" : "disabled"}) ${guildSettings?.capslockPercentage ?? 75}%`,
                  })
                  .setTimestamp();
                message.reply({ embeds: [capslockHelp] });
              }
              break;
            case "toggle":
              {
                guildSettings?.capslockEnabled ? (guildSettings.capslockEnabled = false) : (guildSettings.capslockEnabled = true);
                settings.save(guildSettings);
                this.client.modLog(message.guild.id, `${message.author} has ${guildSettings?.capslockEnabled ? "enabled" : "disabled"} the anti caps lock module`);
                const inviteToggledEmbed = new EmbedBuilder()
                  .setAuthor({
                    name: author.username,
                    iconURL: author.avatarURL(),
                  })
                  .setColor("Red")
                  .setDescription(`You have ${guildSettings?.capslockEnabled ? "enabled" : "disabled"} the anti caps lock module`)
                  .setTimestamp();
                message.reply({ embeds: [inviteToggledEmbed] });
              }
              break;
            case "ignore":
            case "unignore":
              {
                const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1];
                if (!guildSettings?.capslockIgnoredChannels)
                  guildSettings.capslockIgnoredChannels = [];
                if (guildSettings?.capslockIgnoredChannels.includes(channelId)) {
                  guildSettings.capslockIgnoredChannels = guildSettings?.capslockIgnoredChannels.filter((id) => id != channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been removed from the list!`);
                } else {
                  if (guildSettings?.capslockIgnoredChannels.length >= 30)
                    return message.reply("You cannot ignore more than 30 channels");
                  if (!message.guild.channels.cache.get(channelId))
                    return message.reply("The channel was not found");
                  guildSettings?.capslockIgnoredChannels.push(channelId);
                  settings.save(guildSettings);
                  message.reply(`<#${channelId}> has been added to the list!`);
                }
              }
              break;
            case "percentage":
            case "percent":
              {
                const percent = parseInt(args[2]);
                if (!percent || isNaN(percent))
                  return message.reply("You did not provide a number");
                if (percent > 100 || percent < 50)
                  return message.reply("Percentage must be greater than 50 and less than 100");
                guildSettings.capslockPercentage = percent;
                settings.save(guildSettings);
                message.reply(`A message now must contain ${percent}% caps lock for it to be deleted`);
              }
              break;
          }
        }
        break;
    }
  }
};
