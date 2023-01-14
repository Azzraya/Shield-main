const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('pat')
    .setDescription('Pat a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user')
        .setDescription('The user you want to pat')
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const target = interaction.options.getUser('user');
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} pats ${target.username}`)
      .setImage(await anime.pat())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
