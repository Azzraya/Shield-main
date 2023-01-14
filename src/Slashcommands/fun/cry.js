const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('cry')
    .setDescription('You are crying')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} is crying`)
      .setImage(await anime.cry())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
