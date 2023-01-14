const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  MuteUtils = require("../../Structures/MuteUtils"),
  Ms = require("ms"),
  { TextChannel, PermissionFlagsBits } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "mute",
      category: "Moderation",
      userPerms: ["ManageRoles"],
      botPerms: ["ManageRoles"],
      usage: "<user_id> <time(s, m, h, d)>",
    });

    (async () => {
      let mutes = await Db("mutes");

      for (let mute of await mutes.findMany()) {
        let guild = await this.client.guilds.fetch(mute.guild);
        if (!guild) return mutes.deleteMany({ guild: mute.guild });

        let member = guild.members.cache.get(mute.user);
        if (!member)
          return mutes.deleteMany({
            user: mute.user,
            guild: mute.guild,
          });

        let duration = mute.until - Date.now();
        if (duration < 0) duration = 0;
        this.unmuteAfter(member, duration);
      }
    })();
  }

  async run(message, args) {
    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

    if (!member) {
      return message.channel.send(`please add a user mention or id`);
    }

    let botMember = message.guild.members.cache.get(this.client.user.id);
    if (member.roles.highest.position > message.member.roles.highest.position || member.roles.highest.position > botMember.roles.highest.position) {
      return message.channel.send(`This user is too high in the role hierarchy`);
    }

    let mutedRole = await MuteUtils.getMutedRole(message.guild);
    mutedRole ??= await MuteUtils.createMutedRole(message.guild);

    if (args.length > 1) {
      let mutes = await Db("mutes");
      let mute = await mutes.findOneOrNew({
        user: member.id,
        guild: message.guild.id,
      });

      let duration = Ms(args[1]);

      if (!duration || duration <= 0)
        return message.channel.send("Invalid time");
      mute.until = new Date(Date.now() + duration);
      await mutes.save(mute);
      this.unmuteAfter(member, duration);
    }

    await member.roles.add(mutedRole);
    await this.updateChannelPerms(message.guild, mutedRole);
    await this.client.modLog(member.guild.id, `${message.author} muted ${member.user}`);

    return message.channel.send(`Muted ${member.user.tag}`).catch((err) => {
      message.channel.send(`${err.stack}`);
    });
  }

  unmuteAfter(member, duration) {
    setTimeout(async () => {
      let mutes = await Db("mutes");
      await mutes.deleteMany({ user: member.id, guild: member.guild.id });
      let mutedRole = await MuteUtils.getMutedRole(member.guild);
      await member.roles.remove(mutedRole);
    }, duration);
  }

  async updateChannelPerms(guild, role) {
    let channels = guild.channels.cache.filter((c) => c instanceof TextChannel).filter((c) => !c.permissionOverwrites.cache.some((po) => {
      return (po.type === "role" && po.id === role.id && po.deny.has([
        PermissionFlagsBits.Flags.SendMessages,
        PermissionFlagsBits.Flags.SendMessagesInThreads,
      ]));
    }));

    channels.forEach((channel) => {
      channel.permissionOverwrites.edit(role, {
        SendMessages: false,
        SendMessagesInThreads: false,
      });
    });
  }
};
