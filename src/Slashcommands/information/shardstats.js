const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('shardstats')
    .setDescription('Gives you the shard statistics')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    client.shard?.broadcastEval((client) => [client.shard.ids, client.ws.status, client.ws.ping, client.guilds.cache.size]).then((results) => {
      const embed = new EmbedBuilder()
        .setTitle(`Bot Shards (${interaction.guild.shard.id}/${client.shard.count})`)
        .setColor('Random')
        .setTimestamp();

      results.map((data) => {
        embed.addFields({
          name: `Shard ${data[0]}`,
          value: `**Status:** ${data[1]}\n**Ping:** ${data[2]}ms\n**Guilds:** ${data[3]}`,
        });
      });
      interaction.reply({ embeds: [embed] });
    });
  },
};
