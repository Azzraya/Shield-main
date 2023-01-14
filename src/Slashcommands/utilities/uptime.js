const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  ms = require('ms'),
  os = require('os');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Gives you the time for how long the bot has been up')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    const e = new EmbedBuilder()
      .setColor('Random')
      .addFields({
        name: `My uptime is`,
        value: [
          `\`${ms(client.uptime, { long: true })}\``
        ].join('\n'),
      })

      .addFields({
        name: `My host uptime is`,
        value: [
          `\`${ms(os.uptime() * 1000, { long: true })}\``
        ].join('\n'),
      })
      .setTimestamp();
    interaction.reply({ embeds: [e] });
  },
};
