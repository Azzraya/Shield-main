const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('blush')
    .setDescription('You are blushing')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} blushes`)
      .setImage(await anime.blush())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
