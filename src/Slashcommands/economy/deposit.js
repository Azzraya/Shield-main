const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposits coins from your wallet to your bank')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addIntegerOption((option) => {
      return option.setName('amount')
        .setDescription('The amount of coins you want to deposit')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000000);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const user = interaction.user.id;
    const economy = await Db('economy');
    const u = await economy.findOneOrNew({ user });

    u.amountBank ??= 0;
    u.amountPocket ??= 0;

    const amount = interaction.options.get('amount').value;

    if (u.amountPocket === 0) return interaction.reply('Your pocket is empty');
    if (amount > u.amountPocket) return interaction.reply("You don't have enough in your pocket");

    u.amountPocket -= amount;
    u.amountBank += amount;

    await economy.save(u);

    const e = new EmbedBuilder()
      .setColor('Random')
      .addFields({
        name: `${client.users.cache.get(user).username}\'s balance`,
        value: [
          `Pocket: ${u.amountPocket}`,
          `Bank: ${u.amountBank}`,
          `Total: ${u.amountPocket + u.amountBank}`
        ].join('\n'),
      });
    return interaction.reply({ content: 'Money has been deposited!', embeds: [e] });
  },
};
