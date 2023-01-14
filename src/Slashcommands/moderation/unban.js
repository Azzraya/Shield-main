const { SlashCommandBuilder, Client, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) => {
      return options.setName('user-id').setDescription('The user you want to unban').setRequired(true);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const user = await client.users.fetch(interaction.options.getString('user-id'), { force: true });
    if (!user) return interaction.reply('ID did not match any user');

    interaction.guild.members.unban(user.id).catch(() => { });

    await client.modLog(interaction.guildId, `${interaction.user} unbanned ${user}`);
    await interaction.reply(`You have unbanned ${user.tag} | ${user.id}`);
  },
};
