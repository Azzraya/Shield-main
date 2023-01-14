const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Changes the prefix of the bot (Only affects text commands)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((options) => {
      return options.setName('prefix').setDescription('The new Prefix').setRequired(false).setMinLength(1).setMaxLength(10);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const prefix = interaction.options.getString('prefix');
    const currentPrefix = await client.getPrefix(interaction.guild.id);

    if (!prefix) {
      return interaction.reply(`Current prefix is '${currentPrefix}'`);
    } else {
      if (prefix === currentPrefix) return interaction.reply('That prefix is already set');

      await client.setPrefix(interaction.guild.id, prefix);
      await client.modLog(interaction.guild.id, `${interaction.user} changed ${client.user.username}\'s prefix to ${prefix}`);
      await interaction.reply(`Changed prefix to '${prefix}'`);
    }
  },
};
