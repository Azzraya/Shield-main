const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits } = require('discord.js');
const vortexMusicEmbed = require('../../Structures/ShieldEmbed');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all the commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addStringOption((option) => option.setName('command').setDescription('Gives more information about a command').setRequired(false)),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  run(interaction, client) {
    const embed = new vortexMusicEmbed()
      .setColor('Random')
      .setTitle(`${interaction.guild.name} Help Menu`, interaction.guild.iconURL({ dynamic: true }))
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp();

    if (interaction.options.get('command')) {
      const command = client.commands.get(interaction.options.get('command').value) || client.commands.get(client.aliases.get(interaction.options.get('command').value));
      if (!command) return interaction.reply('I was not able to find that command');

      embed.setTitle(`${client.utils.capitalise(command.name)} Command Help`);
      embed.setDescription([
        `Aliases: ${command.aliases.length ? command.aliases.map((alias) => `\`${alias}\``).join(' ') : 'No Aliases'}`,
        `Description: ${command.description}`,
        `Category: ${command.category}`,
        `Usage: ${command.usage}`,
      ].join('\n'));
      return interaction.reply({ embeds: [embed] });
    } else {
      let categories;
      if (!client.owners.includes(interaction.user.id)) {
        categories = client.utils.removeDuplicates(client.commands.filter((cmd) => cmd.category !== 'Owner').map((cmd) => cmd.category));
      } else {
        categories = client.utils.removeDuplicates(client.commands.map((cmd) => cmd.category));
      }

      for (const category of categories) {
        embed.addFields({
          name: `**${client.utils.capitalise(category)}**`,
          value: client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(', '),
        });
      }

      return interaction.reply({ embeds: [embed] });
    }
  },
};
