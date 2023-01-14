"use strict";

const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "purge",
      aliases: ["clear"],
      category: "Moderation",
      userPerms: ["ManageMessages"],
      botPerms: ["ManageMessages"],
    });
  }

  async run(message, args) {
    let messageCount = args[0];

    if (!messageCount) {
      return await message.channel.send({
        content: "Please specify an ammount",
      });
    }

    if (messageCount > 100) {
      return message.channel.send(`the purge amount must be no smaller than 1 but no bigger than 100`)
    }

    if (messageCount < 1) {
      return message.channel.send(`the purge amount must be no smaller than 1 but no bigger than 100`)
    }

    const fetch = await message.channel.messages.fetch({
      limit: messageCount,
      before: message.id,
    });

    await message.channel.bulkDelete(fetch).catch(async () => {
      return message.channel.send(`You cannot purge message older than 14 days old.`)
    });
    await message.delete();
  }
};
