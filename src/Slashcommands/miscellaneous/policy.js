const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('policy')
    .setDescription('Gives a link to the policies')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    const embed = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('Red')
      .addFields({
        name: `**Policy**`,
        value: [
          `[click here](https://docs.google.com/document/d/1191a3LQnuh6cNKRTP9UD-ADqTCdE3eSeCNK4xQU6Bhk/edit)`
        ].join('\n'),
      });
    interaction.reply({ embeds: [embed] });
  },
};
