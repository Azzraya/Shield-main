const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "prefix",
      category: "Utilities",
      botPerms: ["ManageGuild"],
      userPerms: ["ManageGuild"],
    });
  }

  async run(message, args) {
    const client = this.client;

    const currentPrefix = await this.client.getPrefix(message.guild.id);

    if (args.length === 0) {
      await message.channel.send(`Current prefix is '${currentPrefix}'`);
    } else {
      const prefix = args[0];
      if (prefix === currentPrefix) {
        return message.channel.send({
          content: "That prefix is already set",
        });
      }

      await this.client.setPrefix(message.guild.id, prefix);
      await this.client.modLog(message.guild.id, `${message.author} changed ${client.user.username}\'s prefix to ${prefix}`);
      await message.channel.send(`Changed prefix to '${prefix}'`);
    }
  }
};
