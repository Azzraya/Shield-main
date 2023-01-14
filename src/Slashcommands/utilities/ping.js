const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Gives you the Bot and API latency')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const message = await interaction.reply({ content: ':ping_pong: Pinging...', fetchReply: true }),
      latency = message.createdTimestamp - interaction.createdTimestamp;

    let i = 0,
      s = Date.now();
    while (Date.now() - s <= 1) i++;

    const e = new EmbedBuilder()
      .setColor('Random')
      .addFields({
        name: 'Bot Latency:',
        value: [
          `${latency.toLocaleString()}ms`
        ].join('\n'),
      })
      .addFields({
        name: 'API Latency:',
        value: [
          `${Math.round(client.ws.ping).toLocaleString()}ms`
        ].join('\n'),
      })

      .addFields({
        name: `Shard Latency`,
        value: [
          `${Math.round(message.guild.shard.ping).toLocaleString()}ms`
        ].join("\n")
      })

      .addFields({
        name: `Server TPS`,
        value: [
          `${i.toLocaleString()}TPS`
        ].join("\n")
      })

      .setTimestamp();

    await interaction.editReply({ content: '​', embeds: [e] });
  },
};
