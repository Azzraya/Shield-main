const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((options) => {
      return options.setName('user').setDescription('The user you would like to kick').setRequired(true);
    })
    .addStringOption((options) => {
      return options.setName('reason').setDescription('Why do you want to kick this user?').setRequired(false);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const user = interaction.options.getMember('user');
    const reason = `for ${interaction.options.getString('reason')}` ?? '';
    if (user.id === interaction.user.id) return interaction.reply('You can not ban yourself');

    if (!user.kickable)
      return interaction.reply('I can not kick this user, please make sure this users roles are not above your own and that I am above the role of the user you are trying to ban');
    else if (user.kickable) {
      await user.send(`You have been kicked from ${interaction.guild.name} by ${interaction.user.tag} ${reason}`).catch(() => { });
      user.kick({ reason: reason }).catch(() => null);
      await this.client.modLog(interaction.guild.id, `${interaction.user} kicked ${user} ${reason}`);
      await message.channel.send(`You have kicked ${user.user.tag} | ${user.user.id} ${reason}`);
    }
  },
};
