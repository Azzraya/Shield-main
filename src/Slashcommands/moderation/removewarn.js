const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Removes a warn of a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((options) => {
      return options.setName('user').setDescription('The user you would like to remove a warn from').setRequired(true);
    })
    .addStringOption((options) => {
      return options.setName('warn-id').setDescription('The id of a warn').setRequired(true);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    await interaction.deferReply();
    const target = interaction.options.getUser('user');
    const warnId = parseInt(interaction.options.getString('warn-id')) - 1;
    const collection = await Db('warnings');
    const userWarnings = await collection.findOne({ user: target.id, guild: interaction.guildId });

    if (!userWarnings || warnId >= userWarnings.warnings.length) return interaction.editReply('Warn was not found!');
    userWarnings.warnings.splice(warnId, 1);
    if (userWarnings.warnings.length) await collection.save(userWarnings);
    else await collection.deleteOne({ user: target.id, guild: interaction.guildId });

    await client.modLog(interaction.guildId, `${interaction.user} removed ${target}\'s warning`);
    interaction.editReply(`Removed warning from ${target.tag} | ${target.id}`);
  },
};
