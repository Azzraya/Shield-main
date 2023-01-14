const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('wallpaper')
    .setDescription('Sends a random wallpaper')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const e = new EmbedBuilder()
      .setImage(await anime.wallpaper())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
