const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Gives debug information')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addStringOption((option) => option.setName('guild-id').setDescription('Gives debug information for that guild').setRequired(false)),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    let { guild } = interaction;
    if (interaction.options.get('guild-id')) guild = client.guilds.cache.get(interaction.options.get('guild-id').value);
    if (!guild) return interaction.reply('I was not able to find that guild!');

    const debugEmbed = new EmbedBuilder()
      .setColor('Red')
      .addFields({
        name: `Debug Information for ${guild.name}`,
        value: [
          `Current shard: ${guild?.shard.id ?? 0}`,
          `Guild ID: ${guild.id}`,
          `user: ${interaction.user.tag} | (${interaction.user.id})`
        ].join('\n'),
      });
    interaction.reply({ embeds: [debugEmbed] });
  },
};
