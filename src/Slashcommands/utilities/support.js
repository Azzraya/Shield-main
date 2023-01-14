const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Gives you an invite to the support server')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction) {
    const e = new EmbedBuilder()
      .setColor('Random')
      .addFields({
        name: `Support Server`,
        value: [
          `Support [here](https://discord.gg/kjpTrqKCWV)`
        ].join('\n'),
      })
      .setTimestamp();
    interaction.reply({ embeds: [e] });
  },
};
