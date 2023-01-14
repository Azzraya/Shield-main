const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Sends the developers a suggestion')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addStringOption((option) => option.setName('suggestion').setDescription('Your suggestion').setRequired(true)),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    const suggestion = interaction.options.get('suggestion').value;
    interaction.reply(`Thank you for sending your suggestion`);

    const embed = new EmbedBuilder()
      .setTitle(`New Suggestion`)
      .setColor('Random')
      .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
      .setTimestamp()
      .addFields({
        name: `User Information`,
        value: [
          `Username: ${interaction.user.tag}`,
          `ID: ${interaction.user.id}`
        ].join('\n'),
      })
      .addFields({
        name: `Suggestion:`,
        value: suggestion,
      })
      .setTimestamp();

    client.channels.cache.get('984146713738629170').send({ embeds: [embed] });
  },
};
