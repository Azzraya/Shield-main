'use strict';

const { EmbedBuilder, CommandInteraction } = require('discord.js'),
  Event = require('../../Structures/Event');

module.exports = class extends Event {
  /**
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const client = this.client;

    if (!interaction.isChatInputCommand()) return;

    const command = this.client.slashCommands.get(interaction.commandName);

    if (this.client.blackList.includes(interaction.user.id)) {
      this.client.logger.warn(`blocked user : ${interaction.user.id} | ${interaction.user.tag} tried to run a command`);

      return await interaction.reply({ content: `you are blocked from using ${this.client.user.username} \nif you think this is a mistake please contact my developer via the support server https://discord.gg/uRYUSqmPrn` });
    }

    if (command) {
      if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
        return interaction.reply('Sorry, this command can only be used by the bot owners.');
      }

      if ((command.guildOnly && !interaction.guild) || (command.guildOnly && !interaction.inCachedGuild())) {
        return interaction.reply('Sorry, this command can only be used in a discord server.');
      }

      if (command.nsfw && !interaction.channel.nsfw) {
        return interaction.reply('Sorry, this command can only be ran in a NSFW marked channel.');
      }

      client.logger.cmd(`${client.utils.capitalise(command.data.name)} Slashcommand Executed\n\t${interaction.user.id}\t${interaction.user.tag}\n\t${interaction.channel ? interaction.channel.id : ''}\t${interaction.channel ? `#${interaction.channel.name}` : ''}${interaction.guild ? `\n\t${interaction.guild.id}\t${interaction.guild.name}` : ''}`, { shard: interaction.guild?.shard.id ?? 0 });

      const maintanence = false;

      if (maintanence === true) {
        return interaction.reply({ content: `maintanence mode is active, you cannot use this bot\'s commands during this time.\n For more information join our support server: https://discord.gg/uRYUSqmPrn` });
      }

      const internalLogChannel = '999053996482383942';

      try {
        command.run(interaction, client);
      } catch (error) {
        await client.logger.error(error.stack);
        const errorEmbed = new EmbedBuilder()
          .setColor('Red')
          .addFields({
            name: `Command ${command.name} raised an error:`,
            value: '```js\n' + error.stack.replace(new RegExp(process.env.PWD, 'g'), '.') + '\n```',
          });

        interaction.reply([
          'An unexpected error has occured!',
          'The developer has been made aware, so hopefully it should be fixed soon!',
          'If this error persists, please join our support server`//support`',
          '\u200b',
          'In other words, someone made a fucky wucky that broke the bot lmao',
        ].join('\n'));

        return await this.client.channels.cache.get(internalLogChannel).send({ embeds: [errorEmbed] });
      }
    }
  }
};
