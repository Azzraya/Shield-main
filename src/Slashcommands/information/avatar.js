const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Shows your avatar')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user').setDescription('The user you want the avatar of').setRequired(false);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const user = await client.users.fetch(interaction.options.getUser('user') || interaction.user, { force: true }).catch(() => {
      interaction.reply(`Cannot find the user!`);
    });

    const member = interaction.guild.members.cache.get(user.id);

    const e = new EmbedBuilder()
      .setTitle(`${user.username}\'s avatar`)
      .setColor('Random')
      .setTimestamp()
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

    if (member) {
      e.setTitle(`${member.user.username}\'s avatar`)
        .setColor('Random')
        .setTimestamp()
        .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }));
    }
    interaction.reply({ embeds: [e] });
  },
};
