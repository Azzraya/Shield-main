const { SlashCommandBuilder, Client, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('hackban')
    .setDescription('Bans a user from the server even if they are not on it')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((options) => {
      return options.setName('user-id').setDescription('The user you would like to ban').setRequired(true);
    })
    .addStringOption((options) => {
      return options.setName('reason').setDescription('Why do you want to ban this user?').setRequired(false);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const userId = interaction.options.getString('user-id');
    const reason = `for ${interaction.options.getString('reason')}` ?? '';
    if (userId === interaction.user.id) return interaction.reply('You can not ban yourself');

    const user = await client.users.fetch(userId, { force: true });
    if (!user) return message.reply('ID did not match any user');

    let member = undefined;
    if (interaction.guild.members.cache.get(user.id)) member = interaction.guild.members.cache.get(user.id);
    if (member && !member.bannable)
      return interaction.reply('I can not ban this user, please make sure this users roles are not above your own and that I am above the role of the user you are trying to ban');
    else if (member && member.bannable) {
      await member.send(`You have been banned from ${interaction.guild.name} by ${interaction.user.tag} ${reason}`).catch(() => null);

      member.ban({ reason: reason }).catch(() => null);
      await client.modLog(interaction.guild.id, `${interaction.user} banned ${user} ${reason}`);

      await interaction.reply(`You have banned ${user.tag} | ${user.tag} ${reason}`);
    } else {
      interaction.guild.members.ban(user.id).catch(() => null);
      await client.modLog(interaction.guild.id, `${interaction.user} hack banned ${user} ${reason}`);

      await interaction.reply(`You have hackbanned ${user.tag} | ${user.id} ${reason}`);
    }
  },
};
