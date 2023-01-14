const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  ownerOnly: false,
  guildOnly: true,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purges a specified amount of messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((options) => {
      return options.setName('amount').setDescription('The amount of messages to purge').setRequired(true).setMinValue(2).setMaxValue(100);
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async run(interaction) {

    const fetch = await interaction.channel.messages.fetch({
      limit: interaction.options.getInteger('amount'),
    });

    await interaction.channel.bulkDelete(fetch, true).catch(() => {
      interaction.reply('Something went wrong...');
    }).then(() => {
      interaction.reply({ content: `${interaction.options.getInteger('amount')} messages have been purged`, ephemeral: true });
    });
  },
};
