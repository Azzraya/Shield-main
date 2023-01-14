const Config = require("./Config");

module.exports = {
  getMutedRoleName() {
    return Config.mute?.roleName ?? "Muted";
  },

  async getMutedRole(guild) {
    const roleName = this.getMutedRoleName(guild);
    return await guild.roles.cache.find((role) => role.name === roleName);
  },

  async createMutedRole(guild) {
    return guild.roles.create({
      name: await this.getMutedRoleName()
    });
  },
};
