'use strict';

const { EmbedBuilder, ActivityType } = require('discord.js'),
  Event = require('../Structures/Event'),
  Db = require('../Structures/Db');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      once: true,
    });
  }

  async run() {
    const client = this.client;

    await client.guilds.cache.forEach(async (guild) => {
      const bl = await Db('blacklist');
      const blacklist = (await bl.findMany()).map((b) => b.user);

      if (blacklist.includes(guild.ownerId)) {
        const u = client.users.cache.get(guild.ownerId);
        const embed = new EmbedBuilder()
          .addFields({
            name: `Hello ${client.users.cache.get(guild.ownerId)?.tag}`,
            value: [
              `You\'re reciving this message on behalf of the Shield Development Team and or the Trust & Safety Team`,
              `${client.user.tag} has been removed from your server due to your guild ID or your user ID being blacklisted`,
              `\u200b`,
              `If you believe this is a mistake or a misunderstanding please join our support guild and request to speak to the lead dev or an admin.`,
              `Support Server: https://discord.gg/uRYUSqmPrn`,
            ].join('\n'),
          });
        u.send({ embeds: [embed] }).then(() => guild.leave()).catch(() => null);
      }
    })


    client.on('guildCreate', async (guild) => {
      const bl = await Db('blacklist');
      const blacklist = (await bl.findMany()).map((b) => b.user);

      if (blacklist.includes(guild.ownerId)) {
        const u = client.users.cache.get(guild.ownerId);
        const embed = new EmbedBuilder()
          .addFields({
            name: `Hello ${client.users.cache.get(guild.ownerId)?.tag}`,
            value: [
              `You\'re reciving this message on behalf of the Shield Development Team and or the Trust & Safety Team`,
              `${client.user.tag} has been removed from your server due to your guild ID or your user ID being blacklisted`,
              `\u200b`,
              `If you believe this is a mistake or a misunderstanding please join our support guild and request to speak to the lead dev or an admin.`,
              `Support Server: https://discord.gg/uRYUSqmPrn`,
            ].join('\n'),
          });
        u.send({ embeds: [embed] }).then(() => guild.leave()).catch(() => null);
      }


      this.client.logger.warn(`i have been added to ${guild.name} (${guild.id}) | Owner: ${client.users.cache.get(guild.ownerId).tag} (${guild.ownerId})`);

      const ch = client.channels.cache.get('984939956982136892');
      ch.send(`${client.user.username} is now in ${client.guilds.cache.size} servers`);

      const members = guild.members.cache;
      const neededChannel = '984095549642928159';
      const c = client.channels.cache.get(neededChannel);
      const embed = new EmbedBuilder().setColor('Green').addFields({
        name: `Guild join`,
        value: [
          `Name: ${guild.name} (${guild.id})`,
          `Owner: ${client.users.cache.get(guild.ownerId).tag} (${guild.ownerId})`,
          `Humans: ${members.filter((member) => !member.user.bot).size.toLocaleString()}`,
          `Bots: ${members.filter((member) => member.user.bot).size.toLocaleString()}`,
        ].join('\n'),
      });

      c.send({ embeds: [embed] });

    });

    client.on('guildDelete', async (guild) => {
      const members = guild.members.cache;

      this.client.logger.warn(`i have been removed from ${guild.name} (${guild.id})`);

      const settings = await Db('settings');
      settings.findOneAndDelete({ guildId: guild.id });

      const ch = client.channels.cache.get('984939956982136892');
      ch.send(`${client.user.username} is now in ${client.guilds.cache.size} servers`);

      const neededChannel = '984095590134718494';
      const c = client.channels.cache.get(neededChannel);
      const embed = new EmbedBuilder().setColor('Green').addFields({
        name: `Guild leave`,
        value: [
          `Name: ${guild.name} (${guild.id})`,
          `Owner: ${client.users.cache.get(guild.ownerId).tag} (${guild.ownerId})`,
          `Humans: ${members.filter((member) => !member.user.bot).size.toLocaleString()}`,
          `Bots: ${members.filter((member) => member.user.bot).size.toLocaleString()}`,
        ].join('\n'),
      });

      c.send({ embeds: [embed] });
    });

    //shard error handling
    this.client.once('shardError', (error) => {
      this.client.logger.error(`A websocket connection encountered an error: \n${error.stack}`);
    });

    const activities = [
      `${this.client.guilds.cache.size.toLocaleString()} servers!`,
      `${this.client.channels.cache.size.toLocaleString()} channels!`,
      `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users!`,
    ];

    let i = 0;
    setInterval(() => this.client.user.setActivity(`${activities[i++ % activities.length]}`, { type: ActivityType.Watching }), 5000);

    client.logger.ready(
      `Connected to ${client.user.tag} with ${client.guilds.cache.size.toLocaleString()} servers and ${client.guilds.cache
        .reduce((p, g) => p + g.memberCount, 0)
        .toLocaleString()} members`,
      { shard: 'Manager' }
    );
    process.on('unhandledRejection', (err) => client.logger.error(err.stack));
  }
};
