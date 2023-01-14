const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js'),
  Db = require('../../Structures/Db');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give someone coins')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user').setDescription('The user you want to give coins to').setRequired(true);
    })
    .addIntegerOption((option) => {
      return option.setName('amount').setDescription('The amount of coins you want to gamble').setRequired(true).setMinValue(1).setMaxValue(100000);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {
    const user = interaction.user;
    const otherUser = interaction.options.getMember('user');

    if (!otherUser || otherUser.user.bot || user.id === otherUser.user.id) return message.channel.send(`please inlcude a user ID or @mention`);

    const economy = await Db('economy');
    const userEconomy = await economy.findOneOrNew({ user: user.id });
    userEconomy.amountPocket ??= 0;
    const otherUserEconomy = await economy.findOneOrNew({ user: otherUser.user.id });
    otherUserEconomy.amountBank ??= 0;

    let amount = interaction.options.get('amount').value;
    if (userEconomy.amountPocket === 0) return interaction.reply('Your pocket is empty');
    if (amount > userEconomy.amountPocket) return interaction.reply("You don't have enough in your pocket");

    userEconomy.amountPocket -= amount;
    otherUserEconomy.amountBank += amount;
    await economy.save(userEconomy);
    await economy.save(otherUserEconomy);

    return interaction.reply(`You have sent **${amount}** coins to **${otherUser.user.tag}**`);
  },
};
