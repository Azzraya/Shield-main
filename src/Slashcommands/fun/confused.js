const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('confused')
    .setDescription('You are confused')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} is confused`)
      .setImage(await anime.confused())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
