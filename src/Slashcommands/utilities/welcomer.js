const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ChatInputCommandInteraction } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('welcomer')
    .setDescription('Manage the welcome and leave messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

    .addSubcommandGroup((group) => {
      return group
        .setName('join')
        .setDescription('Manage the welcome messages')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('channel')
            .setDescription('Sets the channel for welcome messages')
            .addChannelOption((option) => {
              return option.setName('channel').setDescription('The channel for welcome messages').addChannelTypes(ChannelType.GuildText).setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd.setName('reset-channel').setDescription('Removes the channel for welcome messages');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('message')
            .setDescription('Sets the welcome message')
            .addStringOption((option) => {
              return option.setName('msg').setDescription('The welcome message').setMinLength(1).setMaxLength(500);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('leave')
        .setDescription('Manage the leave messages')
        .addSubcommand((cmd) => {
          return cmd.setName('settings').setDescription('Shows the current settings');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('channel')
            .setDescription('Sets the channel for leave messages')
            .addChannelOption((option) => {
              return option.setName('channel').setDescription('The channel for leave messages').addChannelTypes(ChannelType.GuildText).setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd.setName('reset-channel').setDescription('Removes the channel for welcome messages');
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('message')
            .setDescription('Sets the leave message')
            .addStringOption((option) => {
              return option.setName('msg').setDescription('The leave message').setMinLength(1).setMaxLength(500);
            });
        });
    })
    .addSubcommandGroup((group) => {
      return group
        .setName('join-roles')
        .setDescription('Manage the roles that you get on join')
        .addSubcommand((cmd) => {
          return cmd
            .setName('add')
            .setDescription('Adds a role to the list')
            .addRoleOption((option) => {
              return option.setName('role').setDescription('The role you want to add').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('remove')
            .setDescription('Removes a role to the list')
            .addRoleOption((option) => {
              return option.setName('roleid').setDescription('The role you want to remove').setRequired(true);
            });
        })
        .addSubcommand((cmd) => {
          return cmd.setName('list').setDescription('Lists all roles that members get on join');
        });
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const { guild, user } = interaction;

    const settings = await Db('settings');
    let guildSettings = await settings.findOneOrNew({ guildId: guild.id });

    guildSettings.welcomerJoinChannel ??= undefined;
    guildSettings.welcomerLeaveChannel ??= undefined;
    guildSettings.welcomerJoinMessage ??= 'Welcome to {server}, {user}!';
    guildSettings.welcomerLeaveMessage ??= 'Goodbye {user}!';
    guildSettings.welcomerJoinRoles ??= [];

    /*
     * .replace(/\{server\}/m, `${guild.name}`)
     * .replace(/\{user\}/m, `${user}`)
     * .replace(/\{userId\}/m, `${user.id}`)
     * .replace(/\{userTag\}/m, `${user.tag}`)
     * .replace(/\{memberCount\}/m, `${guild.memberCount}`)
     * .replace(/\\n/, '\n')
     */

    switch (interaction.options.getSubcommandGroup()) {
      case 'join':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const joinSettingsEmbed = new EmbedBuilder()
                  .setColor('Green')
                  .setAuthor({ name: guild.name + ' | Join Settings', iconURL: guild.iconURL() })
                  .addFields({ name: 'Channel', value: `${guildSettings.welcomerJoinChannel ? `<#${guildSettings.welcomerJoinChannel}>` : 'None'}` },
                    { name: 'Message', value: `${guildSettings.welcomerJoinMessage}` },
                    {
                      name: 'Placeholders',
                      value: [
                        `\`{server}\` - ${guild.name}`,
                        `\`{user}\` - ${user}`,
                        `\`{userId}\` - ${user.id}`,
                        `\`{userTag}\` - ${user.tag}`,
                        `\`{memberCount}\` - ${guild.memberCount}`,
                        `\`\\n\` - Makes a new line`,
                      ].join('\n')
                    });
                interaction.reply({ embeds: [joinSettingsEmbed] });
              }
              break;
            case 'channel':
              {
                const channel = interaction.options.getChannel('channel');
                guildSettings.welcomerJoinChannel = channel.id;
                settings.save(guildSettings);
                interaction.reply(`The channel was set to ${channel}!`);
              }
              break;
            case 'reset-channel':
              {
                guildSettings.welcomerJoinChannel = undefined;
                settings.save(guildSettings);
                interaction.reply(`The channel was reset!`);
              }
              break;
            case 'message':
              {
                const message = interaction.options.getString('msg');
                guildSettings.welcomerJoinMessage = message;
                settings.save(guildSettings);
                interaction.reply(`The message was set!`);
              }
              break;
          }
        }
        break;
      case 'leave':
        {
          switch (interaction.options.getSubcommand()) {
            case 'settings':
              {
                const leaveSettingsEmbed = new EmbedBuilder()
                  .setColor('Red')
                  .setAuthor({ name: guild.name + ' | Leave Settings', iconURL: guild.iconURL() })
                  .addFields({ name: 'Channel', value: `${guildSettings.welcomerLeaveChannel ? `<#${guildSettings.welcomerLeaveChannel}>` : 'None'}` },
                    { name: 'Message', value: `${guildSettings.welcomerLeaveMessage}` },
                    {
                      name: 'Placeholders',
                      value: [
                        `\`{server}\` - ${guild.name}`,
                        `\`{user}\` - ${user}`,
                        `\`{userId}\` - ${user.id}`,
                        `\`{userTag}\` - ${user.tag}`,
                        `\`{memberCount}\` - ${guild.memberCount}`,
                        `\`\\n\` - Makes a new line`,
                      ].join('\n'),
                    });
                interaction.reply({ embeds: [leaveSettingsEmbed] });
              }
              break;
            case 'channel':
              {
                const channel = interaction.options.getChannel('channel');
                guildSettings.welcomerLeaveChannel = channel.id;
                settings.save(guildSettings);
                interaction.reply(`The channel was set to ${channel}!`);
              }
              break;
            case 'reset-channel':
              {
                guildSettings.welcomerLeaveChannel = undefined;
                settings.save(guildSettings);
                interaction.reply(`The channel was reset!`);
              }
              break;
            case 'message':
              {
                const message = interaction.options.getString('msg');
                guildSettings.welcomerLeaveMessage = message;
                settings.save(guildSettings);
                interaction.reply(`The message was set!`);
              }
              break;
          }
        }
        break;
      case 'join-roles':
        {
          switch (interaction.options.getSubcommand()) {
            case 'add':
              {
                const role = interaction.options.getRole('role');
                if (guildSettings.welcomerJoinRoles.length >= 30) return interaction.reply('The list can not have more than 30 roles');
                if (guildSettings.welcomerJoinRoles.includes(role.id)) return interaction.reply('The role is already on the list');
                guildSettings.welcomerJoinRoles.push(role.id);
                settings.save(guildSettings);
                interaction.reply('The role was added!');
              }
              break;
            case 'remove':
              {
                const role = interaction.options.getRole('roleid');
                if (!guildSettings.welcomerJoinRoles.includes(role)) return interaction.reply('The role is not on the list');
                guildSettings.welcomerJoinRoles = guildSettings.welcomerJoinRoles.filter((id) => id != role);
                settings.save(guildSettings);
                interaction.reply('The role was removed!');
              }
              break;
            case 'list':
              {
                const embed = new EmbedBuilder()
                  .setColor('Green')
                  .setAuthor({ name: guild.name + ' | Join Roles', iconURL: guild.iconURL() })
                  .addFields({
                    name: `Roles (${guildSettings.welcomerJoinRoles.length} of 30)`,
                    value: `${guildSettings.welcomerJoinRoles.length ? guildSettings.welcomerJoinRoles.map((id) => `<@&${id}>`).join(' ') : 'None'}`,
                  });

                interaction.reply({ embeds: [embed] });
              }
              break;
          }
        }
        break;
    }
  },
};
