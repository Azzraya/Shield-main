const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('wave')
    .setDescription('You are waving')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} waves`)
      .setImage(await anime.wave())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
