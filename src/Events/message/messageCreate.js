"use strict";

const { EmbedBuilder } = require("discord.js"),
  Event = require("../../Structures/Event");

module.exports = class extends Event {
  async run(message) {
    const client = this.client,
      msg = message;

    if (message.author.bot) return;

    const mentionRegex = new RegExp(`^<@!?${this.client.user.id}>$`),
      mentionRegexPrefix = new RegExp(`^<@!?${this.client.user.id}> `),
      guildPrefix = await this.client.getPrefix(message.guild?.id);

    if (message.content.match(mentionRegex)) {
      return message.channel.send(`My prefix for ${message.guild.name} is \`${guildPrefix}\`.`);
    }

    let mentionMatch = message.content.match(mentionRegexPrefix);
    const prefix = mentionMatch ? mentionMatch[0] : guildPrefix

    let contentLowerCase = message.content.toLowerCase();
    if (!contentLowerCase.startsWith(prefix.toLowerCase())) return;

    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g),
      command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

    if (this.client.blackList.includes(message.author.id)) {
      this.client.logger.warn(`blocked user : ${message.author.id} | ${message.author.tag} tried to run a command`);

      return await message.channel.send({ content: `you are blocked from using ${this.client.user.username} \nif you think this is a mistake please contact my developer via the support server https://discord.gg/uRYUSqmPrn` });
    }

    if (command) {
      if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
        return message.reply("Sorry, this command can only be used by the bot owners.");
      }

      if (command.guildOnly && !message.guild) {
        return message.reply("Sorry, this command can only be used in a discord server.");
      }

      if (command.nsfw && !message.channel.nsfw) {
        return message.reply("Sorry, this command can only be ran in a NSFW marked channel.");
      }

      if (command.args && !args.length) {
        return message.reply(`Sorry, this command requires arguments to function. Usage: ${command.usage ? `${guildPrefix + command.name} ${command.usage}` : "This command doesn't have a usage format"}`);
      }

      if (message.guild) {
        const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;

        if (userPermCheck) {
          const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);

          if (missing.length) {
            return message.reply(`You are missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, you need them to use this command!`);
          }
        }

        const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;

        if (botPermCheck) {
          const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);

          if (missing.length) {
            return message.reply(`I am missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, I need them to run this command!`);
          }
        }
      }

      client.logger.cmd(`${client.utils.capitalise(command.name)} Command Executed\n\t${msg.author.id}\t${msg.author.tag}\n\t${msg.channel.id}\t#${msg.channel.name}${msg.guild ? `\n\t${msg.guild.id}\t${msg.guild.name}` : ""} ${client.debug >= 2 ? `\n\t${msg.id}\t${msg.content.replace(/\n/g, "\n\t\t\t\t")}` : ""}`, { shard: msg.guild?.shard.id ?? 0 });

      const maintanence = false;

      if (maintanence === true) {
        return message.channel.send({ content: `maintanence mode is active, you cannot use this bot\'s commands during this time.\n For more information join our support server: https://discord.gg/uRYUSqmPrn` });
      }

      const internalLogChannel = "999053996482383942";

      command.run(message, args).catch(async (error) => {
        await this.client.logger.error(error.stack);
        const errorEmbed = new EmbedBuilder()
          .setColor("Red")
          .addFields({
            name: `Command ${command.name} raised an error:`,
            value: "```js\n" + error.stack.replace(new RegExp(process.env.PWD, "g"), ".") + "\n```",
          });

        message.channel.send([
          "An unexpected error has occured!",
          "The developer has been made aware, so hopefully it should be fixed soon!",
          "If this error persists, please join our support server`//support`",
          "\u200b",
          "In other words, someone made a fucky wucky that broke the bot lmao",
        ].join("\n"));

        return await this.client.channels.cache.get(internalLogChannel).send({ embeds: [errorEmbed] });
      });
    }
  }
};