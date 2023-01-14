const { SlashCommandBuilder, Client, PermissionFlagsBits, ChannelType, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Manages the anti raid modules')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((cmd) => {
      return cmd.setName('settings').setDescription('Shows the current settings');
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('message-spam')
        .setDescription('Manages the anti message spam module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti message spam module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti message spam module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('limit')
            .setDescription('Sets the max amount of messages you can send in x seconds')
            .addIntegerOption((options) => {
              return options
                .setName('amount')
                .setDescription('The amount of messages you can send in x seconds')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('difference')
            .setDescription('Sets the max amount of seconds you can send x messages in')
            .addIntegerOption((options) => {
              return options
                .setName('amount')
                .setDescription('The amount of seconds you can send x messages in')
                .setRequired(true)
                .setMinValue(3)
                .setMaxValue(60);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('emoji-spam')
        .setDescription('Manages the anti emoji spam module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti emoji spam module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti emoji spam module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('limit')
            .setDescription('Sets the max amount of emojis you can have in a message')
            .addIntegerOption((options) => {
              return options
                .setName('amount')
                .setDescription('The amount of emojis you can have in a message')
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(1000);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('mass-usermention')
        .setDescription('Manages the anti mass user mention module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti mass user mention module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti mass user mention module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('limit')
            .setDescription('Sets the max amount of users you can mention in a message')
            .addIntegerOption((options) => {
              return options
                .setName('amount')
                .setDescription('The max amount of users you can mention in a message')
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(1000);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('mass-rolemention')
        .setDescription('Manages the anti mass role mention module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti mass role mention module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti mass role mention module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('limit')
            .setDescription('Sets the max amount of roles you can mention in a message')
            .addIntegerOption((options) => {
              return options
                .setName('amount')
                .setDescription('The max amount of roles you can mention in a message')
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(1000);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('zalgo-text')
        .setDescription('Manages the anti zalgo text module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti zalgo text module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti zalgo text module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('nicknames')
            .setDescription('Toggles whether zalgo nicknames should be translated')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns of or off whether zalgo nicknames should be translated').setRequired(true);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('new-accounts')
        .setDescription('Manages the anti new accounts module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti new accounts module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti new accounts module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('minimum-age')
            .setDescription('Sets the minimum age to x days')
            .addIntegerOption((options) => {
              return options.setName('amount').setDescription('The minimum account age').setRequired(true).setMinValue(1).setMaxValue(30);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('server-invites')
        .setDescription('Manages the anti server invite module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti server invite module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti server invite module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('caps-lock')
        .setDescription('Manages the anti caps lock module')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('toggle')
            .setDescription('Toggles the anti caps lock module')
            .addBooleanOption((options) => {
              return options.setName('turn').setDescription('Turns the anti caps lock module on or off').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('ignore')
            .setDescription('Ignores the given channel')
            .addChannelOption((options) => {
              return options.setName('channel').setDescription('The channel the bot should ignore').setRequired(true).addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('unignore')
            .setDescription('Stops ignoring the given channel')
            .addStringOption((options) => {
              return options.setName('channel-id').setDescription('The channel the bot should no longer ignore').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('percentage')
            .setDescription('How much percent of the message need to be in caps')
            .addIntegerOption((options) => {
              return options
                .setName('amount')
                .setDescription('The percent of the message that needs to be in caps')
                .setRequired(true)
                .setMinValue(50)
                .setMaxValue(100);
            });
        });
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const settings = await Db('settings');
    let guildSettings = await settings.findOneOrNew({ guildId: interaction.guild.id });

    guildSettings.spamIgnoredChannels ??= [];
    guildSettings.emojiIgnoredChannels ??= [];
    guildSettings.mentionIgnoredChannels ??= [];
    guildSettings.zalgoIgnoredChannels ??= [];
    guildSettings.invitesIgnoredChannels ??= [];
    guildSettings.capslockIgnoredChannels ??= [];

    if (interaction.options.getSubcommand() === 'settings' && !interaction.options.getSubcommandGroup()) {
      const helpEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setColor('Red')
        .addFields({
          name: 'Message Spam',
          value:
            '`message-spam toggle` - toggles whether spam should be deleted or not\n' +
            '`message-spam <ignore/unignore> <channel>` - ignores spam in the ignored channels\n' +
            `\`message-spam limit <number>\` - sets the max amount of messages you can send in ${guildSettings?.spamDifference ?? 5} seconds\n` +
            `\`message-spam difference <number>\` - sets the max amount of seconds you can send ${guildSettings?.spamLimit ?? 5} messages in\n` +
            `*Current Settings* - (${guildSettings?.spamEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.spamLimit ?? 5} messages in ${guildSettings?.spamDifference ?? 5} seconds`,
        },
          {
            name: 'Emoji Spam',
            value:
              '`emoji-spam toggle` - toggles whether emoji spam should be deleted or not\n' +
              '`emoji-spam <ignore/unignore> <channel>` - ignores emoji spam in the ignored channels\n' +
              '`emoji-spam limit <number>` - sets the max amount of emojis you can send in one messsage\n' +
              `*Current Settings* - (${guildSettings?.emojiEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.emojiLimit ?? 5} emojis in one message`,
          },
          {
            name: 'Mass User Mention',
            value:
              '`mass-usermention toggle` - toggles whether mass mention should be deleted or not\n' +
              '`mass-usermention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
              '`mass-usermention limit <number>` - sets the max amount of users you can mention in a message\n' +
              `*Current Settings* - (${guildSettings?.mentionMemberEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionUserLimit ?? 5} user mentions in one message`,
          },
          {
            name: 'Mass Role Mention',
            value:
              '`mass-rolemention toggle` - toggles whether mass mention should be deleted or not\n' +
              '`mass-rolemention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
              '`mass-rolemention limit <number>` - sets the max amount of roles you can mention in a message\n' +
              `*Current Settings* - (${guildSettings?.mentionRoleEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionRoleLimit ?? 5} role mentions in one message`,
          },
          {
            name: 'Zalgo Text',
            value:
              '`zalgo-text toggle` - toggles whether zalgo text should be deleted or not\n' +
              '`zalgo-text nicknames` - toggles whether nicknames with zalgo text should be translated\n' +
              '`zalgo-text <ignore/unignore> <channel>` - ignores zalgo text in the ignored channels\n' +
              `*Current Settings* - (${guildSettings?.zalgoEnabled ? 'enabled' : 'disabled'}) Text | (${guildSettings?.zalgoNicknamesEnabled ? 'enabled' : 'disabled'}) Nicknames`,
          },
          {
            name: 'Ban New Accounts',
            value:
              '`new-accounts toggle` - toggles whether new accounts should be banned or not\n' +
              '`new-accounts minimumage <number>` - how old accounts have to be in order to join\n' +
              `*Current Settings* - (${guildSettings?.autobanEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.autobanAge ?? 1} day old`,
          },
          {
            name: 'Server Invites',
            value:
              '`server-invites toggle` - toggles whether invite links should be deleted or not\n' +
              '`server-invites <ignore/unignore> <channel>` - ignores invite links in the ignored channels\n' +
              `*Current Settings* - (${guildSettings?.invitesEnabled ? 'enabled' : 'disabled'})`,
          },
          {
            name: 'Caps Lock',
            value:
              '`caps-lock toggle` - toggles whether caps lock should be deleted or not\n' +
              '`caps-lock percentage <number>` - how many percent of the message have to be caps\n' +
              '`caps-lock <ignore/unignore> <channel>` - ignores caps lock in the ignored channels\n' +
              `*Current Settings* - (${guildSettings?.capslockEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.capslockPercentage ?? 75}%`,
          },
          {
            name: 'Ignored Channels',
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
      interaction.reply({ embeds: [helpEmbed] });
    }
    switch (interaction.options.getSubcommandGroup()) {
      case 'message-spam':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const spamHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Message Spam',
                    value:
                      '`message-spam toggle` - toggles whether spam should be deleted or not\n' +
                      '`message-spam <ignore/unignore> <channel>` - ignores spam in the ignored channels\n' +
                      `\`message-spam limit <number>\` - sets the max amount of messages you can send in ${guildSettings?.spamDifference ?? 5} seconds\n` +
                      `\`message-spam difference <number>\` - sets the max amount of seconds you can send ${guildSettings?.spamLimit ?? 5} messages in\n` +
                      `*Current Settings* - (${guildSettings?.spamEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.spamLimit ?? 5} messages in ${guildSettings?.spamDifference ?? 5} seconds`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [spamHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.spamEnabled) return interaction.reply(`The anti spam module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.spamEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti spam module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti spam module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.spamIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.spamIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.spamIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.spamIgnoredChannels = guildSettings.spamIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'limit':
              {
                const limit = parseInt(interaction.options.getInteger('amount'));
                guildSettings.spamLimit = limit;
                settings.save(guildSettings);
                interaction.reply(`The message spam limit has been set to ${limit} messages in ${guildSettings?.spamDifference ?? 5} seconds`);
              }
              break;
            case 'difference':
              {
              }
              break;
          }
        }
        break;
      case 'emoji-spam':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const emojiHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Emoji Spam',
                    value:
                      '`emoji-spam toggle` - toggles whether emoji spam should be deleted or not\n' +
                      '`emoji-spam <ignore/unignore> <channel>` - ignores emoji spam in the ignored channels\n' +
                      '`emoji-spam limit <number>` - sets the max amount of emojis you can send in one messsage\n' +
                      `*Current Settings* - (${guildSettings?.emojiEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.emojiLimit ?? 5} emojis in one message`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [emojiHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.emojiEnabled) return interaction.reply(`The anti emoji spam module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.emojiEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti emoji spam module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti emoji spam module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.emojiIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.emojiIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.emojiIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.emojiIgnoredChannels = guildSettings.emojiIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'limit':
              {
                const limit = parseInt(interaction.options.getInteger('amount'));
                guildSettings.emojiLimit = limit;
                settings.save(guildSettings);
                interaction.reply(`The emoji spam limit has been set to ${limit} emojis in a message`);
              }
              break;
          }
        }
        break;
      case 'mass-usermention':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const mentionMemberHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Mass User Mention',
                    value:
                      '`mass-usermention toggle` - toggles whether mass mention should be deleted or not\n' +
                      '`mass-usermention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
                      '`mass-usermention limit <number>` - sets the max amount of users you can mention in a message\n' +
                      `*Current Settings* - (${guildSettings?.mentionMemberEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionUserLimit ?? 5} user mentions in one message`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [mentionMemberHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.mentionMemberEnabled)
                  return interaction.reply(`The anti mass user mention module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.mentionMemberEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti mass user mention module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti mass user mention module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.mentionIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.mentionIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.mentionIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.mentionIgnoredChannels = guildSettings.mentionIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'limit':
              {
                const limit = parseInt(interaction.options.getInteger('amount'));
                guildSettings.mentionMemberLimit = limit;
                settings.save(guildSettings);
                interaction.reply(`The mass user mention limit has been set to ${limit} mentions in a message`);
              }
              break;
          }
        }
        break;
      case 'mass-rolemention':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const mentionRoleHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Mass Role Mention',
                    value:
                      '`mass-rolemention toggle` - toggles whether mass mention should be deleted or not\n' +
                      '`mass-rolemention <ignore/unignore> <channel>` - ignores mass mention in the ignored channels\n' +
                      '`mass-rolemention limit <number>` - sets the max amount of roles you can mention in a message\n' +
                      `*Current Settings* - (${guildSettings?.mentionRoleEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.mentionRoleLimit ?? 5} role mentions in one message`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [mentionRoleHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.mentionRoleEnabled)
                  return interaction.reply(`The anti mass role mention module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.mentionRoleEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti mass role mention module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti mass role mention module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.mentionIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.mentionIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.mentionIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.mentionIgnoredChannels = guildSettings.mentionIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'limit':
              {
                const limit = parseInt(interaction.options.getInteger('amount'));
                guildSettings.mentionRoleLimit = limit;
                settings.save(guildSettings);
                interaction.reply(`The mass role mention limit has been set to ${limit} mentions in a message`);
              }
              break;
          }
        }
        break;
      case 'zalgo-text':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const zalgoHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Zalgo Text',
                    value:
                      '`zalgo-text toggle` - toggles whether zalgo text should be deleted or not\n' +
                      '`zalgo-text nicknames` - toggles whether nicknames with zalgo text should be translated\n' +
                      '`zalgo-text <ignore/unignore> <channel>` - ignores zalgo text in the ignored channels\n' +
                      `*Current Settings* - (${guildSettings?.zalgoEnabled ? 'enabled' : 'disabled'}) Text | (${guildSettings?.zalgoNicknamesEnabled ? 'enabled' : 'disabled'}) Nicknames`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [zalgoHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.zalgoEnabled) return interaction.reply(`The anti zalgo text module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.zalgoEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti zalgo text module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti zalgo text module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.zalgoIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.zalgoIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.zalgoIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.zalgoIgnoredChannels = guildSettings.zalgoIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'nicknames':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.zalgoNicknamesEnabled)
                  return interaction.reply(`The anti zalgo nickname module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.zalgoNicknamesEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti zalgo nickname module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti zalgo nickname module`);
              }
              break;
          }
        }
        break;
      case 'new-accounts':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const autobanHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Ban New Accounts',
                    value:
                      '`new-accounts toggle` - toggles new accounts should be banned or not\n' +
                      '`new-accounts minimumage <number>` - how old accounts have to be in order to join\n' +
                      `*Current Settings* - (${guildSettings?.autobanEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.autobanAge ?? 1} day old`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [autobanHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.autobanEnabled)
                  return interaction.reply(`The anti new accounts module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.autobanEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti new accounts module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti new accounts module`);
              }
              break;
            case 'minimum-age':
              {
                guildSettings.autobanAge = interaction.options.getInteger('amount');
                settings.save(guildSettings);
                interaction.reply(`The minimum age has been set to ${interaction.options.getInteger('amount')} days`);
              }
              break;
          }
        }
        break;
      case 'server-invites':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const inviteHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Server Invites',
                    value:
                      '`server-invites toggle` - toggles whether invite links should be deleted or not\n' +
                      `*Current Settings* - (${guildSettings?.invitesEnabled ? 'enabled' : 'disabled'})`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [inviteHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.invitesEnabled)
                  return interaction.reply(`The anti server invites module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.invitesEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti server invites module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti server invites module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.invitesIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.invitesIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.invitesIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.invitesIgnoredChannels = guildSettings.invitesIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
          }
        }
        break;
      case 'caps-lock':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const capslockHelp = new EmbedBuilder()
                  .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                  .setColor('Red')
                  .addFields({
                    name: 'Caps Lock',
                    value:
                      '`caps-lock toggle` - toggles whether caps lock should be deleted or not\n' +
                      '`caps-lock percentage <number>` - how many percent of the message have to be caps\n' +
                      '`caps-lock <ignore/unignore> <channel>` - ignores caps lock in the ignored channels\n' +
                      `*Current Settings* - (${guildSettings?.capslockEnabled ? 'enabled' : 'disabled'}) ${guildSettings?.capslockPercentage ?? 75}%`,
                  })
                  .setTimestamp();
                interaction.reply({ embeds: [capslockHelp] });
              }
              break;
            case 'toggle':
              {
                const turn = interaction.options.getBoolean('turn');
                if (turn === guildSettings?.capslockEnabled) return interaction.reply(`The anti caps lock module is already ${turn ? 'enabled' : 'disabled'}`);
                guildSettings.capslockEnabled = turn;
                settings.save(guildSettings);
                client.modLog(interaction.guild.id, `${interaction.user} has ${turn ? 'enabled' : 'disabled'} the anti caps lock module`);
                interaction.reply(`You have ${turn ? 'enabled' : 'disabled'} the anti caps lock module`);
              }
              break;
            case 'ignore':
              {
                const channel = interaction.options.getChannel('channel');
                if (guildSettings?.capslockIgnoredChannels.includes(channel.id)) return interaction.reply('The channel is already on the list');
                guildSettings.capslockIgnoredChannels.push(channel.id);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'unignore':
              {
                const channelId = interaction.options.getChannel('channel-id');
                if (!guildSettings?.capslockIgnoredChannels.includes(channelId)) return interaction.reply('The channel is not on the list');
                guildSettings.capslockIgnoredChannels = guildSettings.capslockIgnoredChannels.filter((id) => id !== channelId);
                interaction.reply('The channel has been added to the list');
              }
              break;
            case 'percentage':
              {
                guildSettings.capslockPercentage = interaction.options.getInteger('amount');
                settings.save(guildSettings);
                interaction.reply(`The minimum age has been set to ${interaction.options.getInteger('amount')} days`);
              }
              break;
          }
        }
        break;
    }
  },
};
