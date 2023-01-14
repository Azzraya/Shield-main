const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  MuteUtils = require("../../Structures/MuteUtils");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "unmute",
      category: "Moderation",
      userPerms: ["ManageRoles"],
      botPerms: ["ManageRoles"],
    });
  }

  async run(message, args) {
    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

    if (!member) {
      return message.channel.send(`please add a user mention or id`);
    }

    let mutedRole = await MuteUtils.getMutedRole(message.guild);
    if (mutedRole) await member.roles.remove(mutedRole);

    let mutes = await Db("mutes");
    await mutes.deleteMany({ user: member.id, guild: message.guild.id });

    await this.client.modLog(member.guild.id, `${message.author} unmuted ${member.user}`);
    return message.channel.send(`unmuted ${member.user.tag}`).catch((err) => {
      message.channel.send(`${err.stack}`);
    });
  }
};
