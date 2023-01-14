const Command = require("./Command");

module.exports = class Log extends Command {
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
