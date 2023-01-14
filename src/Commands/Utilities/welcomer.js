const Command = require('../../Structures/Command'),
  { EmbedBuilder, ChannelType } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'welcomer',
      category: 'Utilities',
      userPerms: 'ManageChannels',
      guildOnly: true,
    });
  }
  async run(message, args) {
    const { guild, author } = message;

    const settings = await Db('settings');
    let guildSettings = await settings.findOneOrNew({ guildId: guild.id });

    guildSettings.welcomerJoinChannel ??= undefined;
    guildSettings.welcomerLeaveChannel ??= undefined;
    guildSettings.welcomerJoinMessage ??= 'Welcome to {server}, {user}!';
    guildSettings.welcomerLeaveMessage ??= 'Goodbye {user}!';
    guildSettings.welcomerJoinRoles ??= [];

    if (!args.length) {
      const joinSettingsEmbed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: guild.name + ' | Join Settings', iconURL: guild.iconURL() })
        .addFields({
          name: 'Channel',
          value: `\`joinchannel <channel>\` - sets the join channel\n\`resetjoinchannel\` - resets the join channel\n*Current Channel:* ${guildSettings.welcomerJoinChannel ? `<#${guildSettings.welcomerJoinChannel}>` : 'None'}`,
        },
          { name: 'Message', value: `\`joinmessage <message>\` - sets the join message\n*Current Message:*\n${guildSettings.welcomerJoinMessage}` },
          {
            name: 'Placeholders',
            value: [
              `\`{server}\` - ${guild.name}`,
              `\`{user}\` - ${author}`,
              `\`{userId}\` - ${author.id}`,
              `\`{userTag}\` - ${author.tag}`,
              `\`{memberCount}\` - ${guild.memberCount}`,
              `\`\\n\` - Makes a new line`,
            ].join('\n'),
          }
        );
      const leaveSettingsEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: guild.name + ' | Leave Settings', iconURL: guild.iconURL() })
        .addFields({
          name: 'Channel',
          value: `\`leavechannel <channel>\` - sets the leave channel\n\`resetleavechannel\` - resets the leave channel\n*Current Channel:* ${guildSettings.welcomerLeaveChannel ? `<#${guildSettings.welcomerLeaveChannel}>` : 'None'}`,
        },
          { name: 'Message', value: `\`leavemessage <message>\` - sets the leave message\n*Current Message:*\n${guildSettings.welcomerLeaveMessage}` },
          {
            name: 'Placeholders',
            value: [
              `\`{server}\` - ${guild.name}`,
              `\`{user}\` - ${author}`,
              `\`{userId}\` - ${author.id}`,
              `\`{userTag}\` - ${author.tag}`,
              `\`{memberCount}\` - ${guild.memberCount}`,
              `\`\\n\` - Makes a new line`,
            ].join('\n'),
          });
      const joinRolesEmbed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: guild.name + ' | Join Roles', iconURL: guild.iconURL() })
        .addFields({
          name: 'Commands',
          value: [
            `\`addrole <@role>\` - Adds a role to the list`, `\`removerole <id>\` - Removes a role from the list`
          ].join('\n')
        },
          {
            name: `Roles (${guildSettings.welcomerJoinRoles.length} of 30)`,
            value: `${guildSettings.welcomerJoinRoles.length ? guildSettings.welcomerJoinRoles.map((id) => `<@&${id}>`).join(' ') : 'None'}`,
          });
      return message.reply({ embeds: [joinSettingsEmbed, leaveSettingsEmbed, joinRolesEmbed] });
    } else if (args[0].toLowerCase() === 'joinmessage') {
      const msg = args.slice(1).join(' ');
      if (!msg.length || msg.length > 600) return message.reply('Invalid or no message provided! If your message is over 600 charectors it will not be set');
      guildSettings.welcomerJoinMessage = msg;
      settings.save(guildSettings);
      message.reply(`The message was set!`);
    } else if (args[0].toLowerCase() === 'joinchannel') {
      const channel = message.mentions.channels.first();
      if (!channel || channel.type != ChannelType.GuildText) return message.reply('You did not provide a channel!');
      guildSettings.welcomerJoinChannel = channel.id;
      settings.save(guildSettings);
      message.reply(`The channel was set!`);
    } else if (args[0].toLowerCase() === 'resetjoinchannel') {
      if (!guildSettings.welcomerJoinChannel) return message.reply('There is no channel set!');
      guildSettings.welcomerJoinChannel = undefined;
      guildSettings.save(guildSettings);
      message.reply(`The channel was reset!`);
    } else if (args[0].toLowerCase() === 'leavemessage') {
      const msg = args.slice(1).join(' ');
      if (!msg.length || msg.length > 500) return message.reply('Invalid or no message provided!');
      guildSettings.welcomerLeaveMessage = msg;
      settings.save(guildSettings);
      message.reply(`The message was set!`);
    } else if (args[0].toLowerCase() === 'leavechannel') {
      const channel = message.mentions.channels.first();
      if (!channel || channel.type != ChannelType.GuildText) return message.reply('You did not provide a channel!');
      guildSettings.welcomerLeaveChannel = channel.id;
      settings.save(guildSettings);
      message.reply(`The channel was set!`);
    } else if (args[0].toLowerCase() === 'resetleavechannel') {
      if (!guildSettings.welcomerLeaveChannel) return message.reply('There is no channel set!');
      guildSettings.welcomerLeaveChannel = undefined;
      guildSettings.save(guildSettings);
      message.reply(`The channel was reset!`);
    } else if (args[0].toLowerCase() === 'addrole') {
      const role = message.guild.roles.cache.get(args[1].replace(/\</g, '').replace(/\@/g, '').replace(/\&/g, '').replace(/\>/g, ''));
      if (!role) return message.reply('Role was not found!');
      if (guildSettings.welcomerJoinRoles.length >= 30) return message.reply('The list can not have more than 30 roles');
      if (guildSettings.welcomerJoinRoles.includes(role.id)) return message.reply('The role is already on the list');
      guildSettings.welcomerJoinRoles.push(role.id);
      settings.save(guildSettings);
      message.reply('The role was added!');
    } else if (args[0].toLowerCase() === 'removerole') {
      const role = args[1];
      if (!role || !guildSettings.welcomerJoinRoles.includes(role)) return message.reply('The role is not on the list');
      guildSettings.welcomerJoinRoles = guildSettings.welcomerJoinRoles.filter((id) => id != role);
      settings.save(guildSettings);
      message.reply('The role was removed!');
    }
  }
};
