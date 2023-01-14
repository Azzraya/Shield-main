const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Moderation",
      userPerms: ["ManageRoles"],
      usage: "<user_id/mention> <warn_id>",
    });
  }

  async run(message, args) {
    let userObj = message.mentions.members.last() ?? message.guild.members.cache.get(args[0]);
    let user = userObj?.id;
    if (!user) return message.channel.send("User not found");

    let warnId = args[1];
    if (isNaN(warnId)) return message.channel.send("Invalid warn id");
    warnId = parseInt(warnId) - 1;

    let guild = message.guild.id;
    let collection = await Db("warnings");
    let userWarning = await collection.findOne({ user, guild });

    if (!userWarning || warnId >= userWarning.warnings.length)
      return message.channel.send("Warn id not found");

    userWarning.warnings.splice(warnId, 1);
    if (userWarning.warnings.length) await collection.save(userWarning);
    else await collection.deleteOne({ user, guild });

    await this.client.modLog(message.guild.id, `${message.author} removed ${userObj.user}\'s warning`);

    message.channel.send(`Removed warning from ${userObj.user.tag} | ${userObj.id}`);
  }
};
