const Command = require("../../Structures/Command.js"),
  { EmbedBuilder } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["leaveguild", "lg"],
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const client = this.client;

    const guild = client.guilds.cache.get(args[0]);

    if (!guild) {
      return message.channel.send({ content: "Unable to find server, please check the provided ID, or please add a guilds ID" });
    }
    
    await guild.leave();

    const embed = new EmbedBuilder()
      .setColor("BLUE")
      .setTimestamp()
      .addFields({
        name: `Leave Guild`,
        value: [
          `I have successfully left ${guild.name} | (${guild.id}).`
        ].join("\n"),
      });
    return await message.channel.send({ embeds: [embed] });
  }
};
