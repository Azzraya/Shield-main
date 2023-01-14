const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Moderation",
      usage: "<user_id/mention> <reason>",
    });
  }

  async run(message, args) {
    let userObj = message.mentions.members.last() ?? message.guild.members.cache.get(args[0]);
    let user = userObj?.id;

    if (!user) {
      return message.channel.send("User not found");
    }

    if (userObj.id === message.author.id) {
      return message.channel.send({ content: `Cannot warn ya self pal` });
    }

    if (
      userObj.roles.highest.position > message.member.roles.highest.position
    ) {
      return message.channel.send(`This user is too high in the role hierarchy, please move my role above it, either that or your role is below the users your trying to warn`);
    }

    let content = args.slice(1).join(" ");
    if (content.length === 0) return message.channel.send("Reason needed");

    let guild = message.guild.id;
    let warnings = await Db("warnings");
    let userWarning = await warnings.findOneOrNew({ user, guild });

    userWarning.warnings ??= [];
    userWarning.warnings.push({ content, user: message.author.id });
    await warnings.save(userWarning);

    await this.client.modLog(message.guild.id, `${message.author} warned ${userObj.user} for ${content}`);
    message.channel.send(`${userObj.toString()} was warned (${userWarning.warnings.length})`);
  }
};
