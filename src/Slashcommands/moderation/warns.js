const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Shows warns of a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((options) => {
      return options.setName('user').setDescription('The user you would like to see the warns of').setRequired(false);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;

    const collection = await Db('warnings');
    const userWarnings = await collection.findOne({ user: target.id, guild: interaction.guildId });

    let warnings = userWarnings?.warnings ?? [];
    warnings = warnings.map((w, i) => {
      const warnedBy = interaction.guild.members.cache.get(w.user);
      return `${i + 1}: ${w.content} (warned by: ${warnedBy.user.tag} | (${warnedBy.id}))`;
    });

    interaction.reply(`(${warnings.length} warns)\n` + warnings.join('\n'));
  },
};
