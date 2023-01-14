const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Win double or lose all!')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addIntegerOption((option) => {
      return option.setName('amount')
        .setDescription('The amount of coins you want to gamble')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100000);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const user = interaction.user.id;
    const economy = await Db('economy');
    const u = await economy.findOneOrNew({ user });

    u.amountBank ??= 0;

    const amount = interaction.options.get('amount').value;

    if (u.amountPocket === 0) return interaction.reply('Your pocket is empty');
    if (amount > u.amountPocket) return interaction.reply("You don't have enough in your pocket");

    let win = Math.random() >= 0.5;
    if (win) u.amountPocket += amount;
    else u.amountPocket -= amount;

    await economy.save(u);

    return interaction.reply(`You ${win ? 'win' : 'lose'} ${amount}`);
  },
};
