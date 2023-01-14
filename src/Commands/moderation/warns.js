const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Moderation",
      usage: "<user id/mention>",
    });
  }

  async run(message, args) {
    let userObj = message.mentions.members.last() ?? message.guild.members.cache.get(args[0]);
    let user = userObj?.id;
    if (!user) return message.channel.send("User not found");

    let guild = message.guild.id;
    let collection = await Db("warnings");
    let userWarning = await collection.findOne({ user, guild });

    let warnings = userWarning?.warnings ?? [];
    warnings = warnings.map((w, i) => {
      let warnedBy = message.guild.members.cache.get(w.user);
      return `${i + 1}: ${w.content} (warned by: ${warnedBy.user.tag} | (${warnedBy.id}))`;
    });

    message.channel.send(`User has ${warnings.length} warns\n` + warnings.join("\n"));
  }
};
