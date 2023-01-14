const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js'),
  { version, license } = require('../../../data/config.json');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Gives you information about the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    await client.application.fetch();

    const getChannelTypeSize = (type) => client.channels.cache.filter((channel) => type.includes(channel.type)).size;

    let stickerCount = 0;
    client.guilds.cache.forEach((guild) => {
      stickerCount += guild.stickers.cache.size;
    });

    const totalChannels = getChannelTypeSize([
      ChannelType.GuildText,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
      ChannelType.GuildForum,
      ChannelType.PublicThread,
      ChannelType.PrivateThread,
      ChannelType.AnnouncementThread,
      ChannelType.GuildCategory,
    ]);

    const embed = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setColor('Random')
      .setTitle(`${client.user.username}'s Information`)
      .addFields({
        name: '📝 Description',
        value: client.application.description || 'None',
      },
        {
          name: 'General',
          value: [
            `💳 **ID** ${client.user.id}`,
            `📜 **Created** <t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
            `👑 **Owners** ${client.owners}`,
          ].join('\n'),
        },
        {
          name: 'Guilds & Users',
          value: [
            `👤 **Guilds** ${client.guilds.cache.size}`,
            `👥 **Users** ${(client.users.cache.size).toLocaleString()}`
          ].join('\n'),
          inline: true,
        },
        {
          name: `Channels (${(totalChannels).toLocaleString()})`,
          value: [
            `💬 **Text** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement])}`,
            `🎙 **Voice** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
            `🧵 **Threads** ${getChannelTypeSize([ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread])}`,
            `📑 **Categories** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
          ].join('\n'),
          inline: true,
        },
        {
          name: `Emojis & Stickers (${client.emojis.cache.size + stickerCount})`,
          value: [
            `📺 **Animated** ${client.emojis.cache.filter((emoji) => emoji.animated).size}`,
            `🗿 **Static** ${client.emojis.cache.filter((emoji) => !emoji.animated).size}`,
            `🏷 **Stickers** ${stickerCount}`,

          ].join('\n'),
          inline: true,
        },
        {
          name: `Miscellaneous`,
          value: [
            `🔮 **Shards** ${interaction.guild.shard.id}/${client.shard?.count || 0}`,
            `🛠️ **Commands** ${client.commands.size}`,
            `🐈‍⬛ **Blacklists** ${client.blackList.length}`,
            `🏷️ **Client Version** ${version}`,
            `🪧 **License** ${license || 'None'}`,
          ].join('\n'),
        })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
