const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  ms = require('ms'),
  Db = require('../../Structures/Db'),
  economyUtils = require('../../Structures/EconomyUtils');

module.exports = {
  ownerOnly: false,
  guildOnly: false,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Earns you money by working')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    let user = interaction.user.id;
    let economy = await Db('economy');
    let u = await economy.findOneOrNew({ user });

    let now = new Date();
    if (u.lastWorkDate) {
      const timeframe = 12 * 60 * 60 * 1000; // 12 hours
      let nextWorkDate = u.lastWorkDate.getTime() + timeframe;
      if (nextWorkDate > now) return interaction.reply(`You can work again in ${ms(nextWorkDate - now)}`);
    }

    let amount = economyUtils.getRandomValue(1, 1000);

    u.amountPocket ??= 0;
    u.amountBank ??= 0;
    u.amountPocket += amount;
    u.lastWorkDate = now;

    await economy.save(u);

    const e = new EmbedBuilder().setColor('Random').addFields({
      name: `${client.users.cache.get(user).username}\'s balance`,
      value: [
        `Pocket: ${u.amountPocket}`,
        `Bank: ${u.amountBank}`,
        `Total: ${u.amountPocket + u.amountBank}`
      ].join('\n'),
    });
    return interaction.reply({ content: `You earned ${amount} by working!`, embeds: [e] });
  },
};
