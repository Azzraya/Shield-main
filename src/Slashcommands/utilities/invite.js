const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Gives you invite links to invite the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    const e = new EmbedBuilder()
      .setColor("Random")
      .addFields({
        name: `Invite ${client.user.username}`,
        value: [
          `Needed permissions (Recommended)`,
          `[Invite Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1099511627767&scope=bot%20applications.commands)`,
          `\u200b`,
          `All permissions (Not recommended)`,
          `[Invite Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
        ].join("\n"),
      })
      .setTimestamp();
    interaction.reply({ embeds: [e] });
  },
};
