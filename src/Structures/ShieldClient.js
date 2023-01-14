'use strict';

const { Client, Collection, PermissionsBitField, GatewayIntentBits } = require('discord.js'),
  Util = require('./Util.js'),
  Db = require('./Db'),
  Config = require('./Config');

module.exports = class ShieldClient extends Client {
  constructor(options = {}) {
    super({
      messageCacheLifetime: 60,
      fetchAllMembers: true,
      messageCacheMaxSize: 10,
      restTimeOffset: 0,
      restWsBridgetimeout: 100,
      shards: 'auto',
      allowedMentions: {
        disableMentions: true,
        repliedUser: false,
      },
      partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER', 'VOICE'],
      intents: 3276799 | GatewayIntentBits.MessageContent,
    });

    this.validate(options);
    this.aliases = new Collection();
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.events = new Collection();
    this.logger = require('./logger');
    this.owners = options.owners;
    this.utils = new Util(this);
    this.prefixCache = new Map();
    this.blackList = Config.blackList ?? [];

    (async () => {
      let blacklist = await Db('blacklist');
      let bus = await blacklist.findMany();
      this.blackList.push(...bus.map((bu) => bu.user));
    })();
  }

  validate(options) {
    if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

    if (!options.token) throw new Error('You must pass the token for the client.');
    this.token = options.token;

    if (!options.prefix) throw new Error('You must pass a prefix for the client.');
    if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
    this.prefix = options.prefix;

    if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
    this.defaultPerms = new PermissionsBitField(options.defaultPerms).freeze();
  }

  async start(token = this.token) {
    this.utils.loadCommands();
    this.utils.loadEvents();
    this.utils.loadSlashcommands();

    await super.login(token);
  }

  async getPrefix(guildId = null) {
    if (!guildId) return this.prefix;

    let prefix = this.prefixCache.get(guildId);
    if (prefix) return prefix;

    try {
      let settings = await Db('settings');
      prefix = (await settings.findOne({ guild: guildId }))?.prefix ?? this.prefix;
      this.prefixCache.set(guildId, prefix);
      return prefix;
    } catch (e) {
      this.logger.error(e);
      return this.prefix;
    }
  }

  async setPrefix(guildId, prefix) {
    let settings = await Db('settings');
    await settings.updateOne({ guild: guildId }, { $set: { prefix } }, { upsert: true });
    this.prefixCache.set(guildId, prefix);
  }
};
