const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  anime = require('anime-actions');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('cuddle')
    .setDescription('Cuddle a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user')
        .setDescription('The user you want to cuddle')
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const target = interaction.options.getUser('user');
    const e = new EmbedBuilder()
      .setTitle(`${interaction.user.username} cuddles ${target.username}`)
      .setImage(await anime.cuddle())
      .setColor('Random');
    interaction.reply({ embeds: [e] });
  },
};
