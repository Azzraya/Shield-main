"use strict";

const vortexMusicEmbed = require("../../Structures/ShieldEmbed"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["halp", "h"],
      description: "Displays all the commands in the bot",
      category: "Utilities",
      usage: "[command]",
    });
  }

  async run(message, [command]) {
    const client = this.client

    const embed = new vortexMusicEmbed()
      .setColor("Random")
      .setTitle(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter({ text: `${client.user.username}, now uses slash cmds! (type / to get started)` })
      .setTimestamp();

    if (command) {
      const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

      if (!cmd) return;

      embed.setTitle(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());

      embed.setDescription([
        `Aliases: ${cmd.aliases.length ? cmd.aliases.map((alias) => `\`${alias}\``).join(" ") : "No Aliases"}`,
        `Description: ${cmd.description}`,
        `Category: ${cmd.category}`,
        `Usage: ${cmd.usage}`,
      ].join("\n"));

      return await message.channel.send({ embeds: [embed] });
    } else {
      let categories;
      if (!this.client.owners.includes(message.author.id)) {
        categories = this.client.utils.removeDuplicates(this.client.commands.filter((cmd) => cmd.category !== "Owner").map((cmd) => cmd.category));
      } else {
        categories = this.client.utils.removeDuplicates(this.client.commands.map((cmd) => cmd.category));
      }

      for (const category of categories) {
        embed.addFields({
          name: `**${this.client.utils.capitalise(category)}**`,
          value: this.client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", "),
        });
      }

      return await message.channel.send({ embeds: [embed] });
    }
  }
};
