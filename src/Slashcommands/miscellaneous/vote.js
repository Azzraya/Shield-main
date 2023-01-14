const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Gives a where you can vote for the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    const embed = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields({
        name: `Vote for ${client.user.username}`,
        value: [
          `[Link](https://top.gg/bot/981205974125776947/vote) - Top.gg`
        ].join('\n'),
      });
    interaction.reply({ embeds: [embed] });
  },
};
