"use strict";

const { Type } = require("@anishshobith/deeptype"),
  { inspect } = require("util"),
  Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "eval",
      aliases: ["ev", "e"],
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {

    const msg = message,
      client = this.client

    if (!args.length) {
      return message.channel.send("You must provide something to evaluate.");
    }

    let code = await args.join(" ");
    code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

    let evaled;
    try {
      const start = process.hrtime();
      evaled = eval(code);
      if (eval instanceof Promise) {
        evaled = await evaled;
      }

      const stop = process.hrtime(start);
      const response = [
        `**Output**: \`\`\`js\n${this.clean(inspect(evaled, { depth: 0 }))}\n\`\`\``,
        `**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
        `**Time:** \`\`\`${(stop[0] * 1e9 + stop[1]) / 1e6}ms \`\`\``,
      ];

      const res = response.join("\n");
      if (res.length < 2000) {
        await message.channel.send(res);
      }
    } catch (err) {
      return await message.channel.send({
        content: `Error: \`\`\`xl\n${this.clean(err)}\n\`\`\``,
      });
    }
  }

  clean(text) {
    if (typeof text === "string") {
      text = text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`).replace(new RegExp(this.client.token, "gi"), "****");
    }
    return text;
  }
};
