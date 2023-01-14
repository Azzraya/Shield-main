const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('donate')
    .setDescription('Donation links to support the staff team')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction) {
    const e = new EmbedBuilder()
      .addFields({
        name: `Donations`,
        value: [
          `Would mean a ton if you donated to us donate [here](https://www.patreon.com/join/shieldBot01/checkout?ru=undefined) <3`
        ].join('\n'),
      });
    interaction.reply({ embeds: [e] });
  },
};
