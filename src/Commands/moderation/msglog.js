const LogCommand = require("../../Structures/LogCommand"),
  Db = require("../../Structures/Db"),
  cache = new Map();

(async () => {
  let settings = await Db("settings");
  let guildSettings = await settings.findMany();
  for (let gs of guildSettings) {
    if (gs.messageLog) cache.set(gs.guild, gs.messageLog);
  }
})();

module.exports = class extends LogCommand {
  constructor(...args) {
    super(...args, {
      category: "Moderation",
      aliases: ["messagelog", "mlogging"],
      userPerms: ["ManageChannels"],
      usage: "<enable|disable> <channel_id or #>",
    });

    this.client.on("messageUpdate", async (oldMessage, newMessage) => {
      if (oldMessage.author.bot) return;
      if (!oldMessage.author) return;
      if (oldMessage.content === newMessage.content) return;
      await this.log(oldMessage.guild.id, `${oldMessage.author.tag} | (${oldMessage.author.id}) edited a message \nbefore: ${oldMessage.content}\n\nafter: ${newMessage.content}`);
    });

    this.client.on("messageDelete", async (oldMessage) => {
      if (oldMessage.author.bot) return;
      if (!oldMessage.author) return;
      await this.log(oldMessage.guild.id, `${oldMessage.author.tag} | (${oldMessage.author.id}) deleted a message \n${oldMessage.content}`);
    });

    this.client.messageLog = (guild, data) => this.log(guild, data);
  }

  async run(message, [cmd, channel]) {
    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
    let enable = this.parseCmd(cmd);
    if (enable && !channel) return message.channel.send(this.usage);

    if (enable) {
      await this.enable(message.guild.id, channel.id);
      return message.channel.send(`Enabled message log in ${channel}`);
    } else if (enable === false) {
      await this.disable(message.guild.id);
      return message.channel.send(`Disabled message log`);
    }

    return message.channel.send(`Message log is ${cache.has(message.guild.id) ? "enabled" : "disabled"}`);
  }

  async log(guild, data) {
    let channel = cache.get(guild);
    if (!channel) return;

    guild = this.client.guilds.cache.get(guild);
    if (!guild) return;

    channel = guild.channels.cache.get(channel);
    if (!channel) return this.disable(guild.id);

    return channel.send(data);
  }

  async disable(guild) {
    cache.delete(guild);
    let settings = await Db("settings");
    let guildSettings = await settings.findOne({ guild });
    if (guildSettings) {
      guildSettings.messageLog = null;
      await settings.save(guildSettings);
    }
  }

  async enable(guild, channel) {
    cache.set(guild, channel);
    let settings = await Db("settings");
    let guildSettings = await settings.findOneOrNew({ guild });
    guildSettings.messageLog = channel;
    await settings.save(guildSettings);
  }
};
