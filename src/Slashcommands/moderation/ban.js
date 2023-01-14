const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((options) => {
      return options.setName('user').setDescription('The user you would like to ban').setRequired(true);
    })
    .addStringOption((options) => {
      return options.setName('reason').setDescription('Why do you want to ban this user?').setRequired(false);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const user = interaction.options.getMember('user');
    const reason = `for ${interaction.options.getString('reason')}` ?? '';
    if (user.id === interaction.user.id) return interaction.reply('You can not ban yourself');

    if (!user.bannable)
      return interaction.reply('I can not ban this user, please make sure this users roles are not above your own and that I am above the role of the user you are trying to ban');
    else if (user.bannable) {
      await user.send(`You have been banned from ${interaction.guild.name} by ${interaction.user.tag} ${reason}`).catch(() => { });
      user.ban({ reason: reason }).catch(() => null);
      await this.client.modLog(interaction.guild.id, `${interaction.user} banned ${user} ${reason}`);
      await message.channel.send(`You have banned ${member.user.tag} | ${member.user.id} ${reason}`);
    }
  },
};
