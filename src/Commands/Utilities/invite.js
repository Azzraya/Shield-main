const Command = require("../../Structures/Command"),
  { EmbedBuilder } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "invite",
      category: "Utilities",
      aliases: ["inv"],
    });
  }

  // eslint-disable-next-line no-unused-vars

  async run(message) {
    const client = this.client;

    const e = new EmbedBuilder()
      .setColor("Random")
      .addFields({
        name: `Invite ${this.client.user.username}`,
        value: [
          `Needed permissions (Recommended)`,
          `[Invite Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1117294554599&scope=bot%20applications.commands)`,
          `\u200b`,
          `All permissions (Not recommended)`,
          `[Invite Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
        ].join("\n"),
      })
      .setTimestamp();
    message.channel.send({ embeds: [e] });
  }
};
