const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('bite')
    .setDescription('Bite a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user')
        .setDescription('The user you want to bite')
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const target = interaction.options.getUser('user');
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} bites ${target.username}`)
      .setImage(await anime.bite())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
