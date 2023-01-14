'use strict';

const { PermissionsBitField, Client } = require('discord.js');

module.exports = class Command {
  /**
   * @param {Client} client
   * @param {string} name
   * @param {object} options
   */
  constructor(client, name, options = {}) {
    this.client = client;
    this.name = options.name || name;
    this.aliases = options.aliases || [];
    this.description = options.description || 'No description provided.';
    this.category = options.category || 'General';
    this.usage = `${this.name} ${options.usage || ''}`.trim();
    this.userPerms = new PermissionsBitField(options.userPerms).freeze();
    this.botPerms = new PermissionsBitField(options.botPerms).freeze();
    this.guildOnly = options.guildOnly || true;
    this.ownerOnly = options.ownerOnly || false;
    this.nsfw = options.nsfw || false;
    this.args = options.args || false;
  }

  // eslint-disable-next-line no-unused-vars
  async run() {
    throw new Error(`Command ${this.name} doesn't provide a run method!`);
  }
};
