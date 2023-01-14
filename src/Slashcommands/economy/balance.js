const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Shows your current amount of money aka. balance')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user')
        .setDescription('The user you want the balance of')
        .setRequired(false);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    let user = interaction.options.getUser('user') ? interaction.options.getUser('user').id : interaction.user.id;
    let userEconomy = await Db('economy').then((c) => c.findOne({ user }));
    let amountBank = userEconomy?.amountBank ?? 0;
    let amountPocket = userEconomy?.amountPocket ?? 0;

    const e = new EmbedBuilder()
      .setColor('Random')
      .addFields({
        name: `${client.users.cache.get(user).username}\'s balance`,
        value: [
          `Pocket: ${amountPocket}`,
          `Bank: ${amountBank}`,
          `Total: ${amountPocket + amountBank}`
        ].join('\n'),
      });
    return interaction.reply({ embeds: [e] });
  },
};
