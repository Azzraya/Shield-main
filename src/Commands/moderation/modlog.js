const Command = require("../../Structures/Command"),
  Db = require("../../Structures/Db"),
  modLogCache = new Map();

(async () => {
  let settings = await Db("settings");
  let guildSettings = await settings.findMany();
  for (let gs of guildSettings) {
    if (gs.modLog) modLogCache.set(gs.guild, gs.modLog);
  }
})();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      category: "Moderation",
      userPerms: ["ManageChannels"],
      usage: "<enable|disable> <channel_id or #>",
    });

    this.client.modLog = (guild, data) => this.log(guild, data);
  }

  async run(message, [cmd, channel]) {
    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
    let enable = this.parseCmd(cmd);
    if (enable == null || (enable && !channel))
      return message.channel.send(this.usage);

    if (enable) {
      await this.enable(message.guild.id, channel.id);
      return message.channel.send(`Enabled mod log in ${channel}`);
    } else {
      await this.disable(message.guild.id);
      return message.channel.send(`Disabled mod log`);
    }
  }

  async log(guild, data) {
    let channel = modLogCache.get(guild);
    if (!channel) return;

    guild = this.client.guilds.cache.get(guild);
    if (!guild) return;

    channel = guild.channels.cache.get(channel);
    if (!channel) return this.disable(guild.id);

    return channel.send(data);
  }

  async disable(guild) {
    modLogCache.delete(guild);
    let settings = await Db("settings");
    let guildSettings = await settings.findOne({ guild });
    if (guildSettings) {
      guildSettings.modLog = null;
      await settings.save(guildSettings);
    }
  }

  async enable(guild, channel) {
    modLogCache.set(guild, channel);
    let settings = await Db("settings");
    let guildSettings = await settings.findOneOrNew({ guild });
    guildSettings.modLog = channel;
    await settings.save(guildSettings);
  }

  parseCmd(cmd) {
    if (!cmd) return null;
    cmd = cmd.toLowerCase();
    if (cmd.startsWith("e") || cmd.startsWith("on") || cmd.startsWith("true") || cmd === "1")
      return true;
    if (cmd.startsWith("d") || cmd.startsWith("of") || cmd.startsWith("false") || cmd === "0")
      return false;
    return null;
  }
};
