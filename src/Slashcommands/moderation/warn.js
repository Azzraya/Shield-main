const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Adds a warn to a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((options) => {
      return options.setName('user').setDescription('The user you would like to add a warn to').setRequired(true);
    })
    .addStringOption((options) => {
      return options.setName('reason').setDescription('Why do you want to warn this user?').setRequired(true);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const target = interaction.options.getUser('user');
    if (target.id === interaction.user.id) return interaction.reply('You can not warn yourself');

    const collection = await Db('warnings');
    const userWarnings = await collection.findOneOrNew({ user: target.id, guild: interaction.guildId });

    if (interaction.guild.members.cache.get(target.id).roles.highest.position > interaction.member.roles.highest.position) {
      return interaction.reply(`This user is too high in the role hierarchy, please move my role above it, either that or your role is below the users your trying to warn`);
    }

    if (!userWarnings?.warnings) userWarnings.warnings = [];
    userWarnings.warnings.push({ content: interaction.options.getString('reason'), user: interaction.user.id });
    await collection.save(userWarnings);

    await client.modLog(interaction.guildId, `${target} warned ${target} for ${interaction.options.getString('reason')}`);
    interaction.reply(`${target} was warned (${userWarnings.warnings.length})`);
  },
};
