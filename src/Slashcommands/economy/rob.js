const { SlashCommandBuilder, CommandInteraction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js'),
  Db = require('../../Structures/Db'),
  economyUtils = require('../../Structures/EconomyUtils'),
  ms = require('ms');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Earns you money by robbing another user')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addUserOption((option) => {
      return option.setName('user')
        .setDescription('The user you want to rob')
        .setRequired(true);
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction, client) {
    const user = interaction.user.id;
    const economy = await Db('economy');
    const u = await economy.findOneOrNew({ user });

    let now = new Date();
    if (u.lastRobDate) {
      const timeframe = 12 * 60 * 60 * 1000; // 12 hours
      let nextRobData = u.lastRobDate.getTime() + timeframe;
      if (nextRobData > now) return message.channel.send(`You can rob again in ${ms(nextRobData - now)}`);
    }

    const target = interaction.options.getUser('user');
    if (target.id === interaction.user.id) return interaction.reply('You can not rob yourself!');

    const t = await economy.findOne({ user: target.id });

    let amountRob = economyUtils.getRandomValue(1, 1000);
    if (!t || !t.amountPocket || (t.amountPocket ??= 0) < 1000)
      return interaction.reply('That user was not found or does not have any or enough coins on them');

    u.lastRobDate = now;

    let caught = Math.random() <= 0.2;
    if (caught) {
      let loss = 2000;
      loss = economyUtils.take(u, loss, true);
      await economy.save(u);
      return message.channel.send(`You got caught and lost ${loss}`);
    }

    amountRob = economyUtils.take(t, amountRob);
    await economy.save(t);
    u.amountPocket ??= 0;
    u.amountPocket += amountRob;
    await economy.save(u);

    return message.channel.send(`You robbed ${amountRob} from ${otherUser}`);
  },
};
