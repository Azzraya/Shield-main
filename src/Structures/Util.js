"use strict";

const path = require("path"),
  { promisify } = require("util"),
  glob = promisify(require("glob")),
  Command = require("./Command.js"),
  Event = require("./Event.js"),
  axios = require("axios");

module.exports = class Util {
  constructor(client) {
    this.client = client;
  }

  isClass(input) {
    return (typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class");
  }

  get directory() {
    let dir = `${path.dirname(require.main.filename)}${path.sep}`;
    dir = dir.replaceAll("\\", "/");
    return dir;
  }

  trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(`${len} more...`);
    }
    return arr;
  }

  formatBytes(bytes) {
    if (bytes === 0) return `0`;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  capitalise(string) {
    return string.split(" ").map((str) => str.slice(0, 1).toUpperCase() + str.slice(1)).join(" ");
  }

  checkOwner(target) {
    return this.client.owners.includes(target);
  }

  comparePerms(member, target) {
    return member.roles.highest.position < target.member.roles.highest.position;
  }

  formatPerms(perm) {
    return perm.replace(/([A-Z])/g, " $1").trim().replace(/Guild/g, "Server").replace(/Use Vad/g, "Use Voice Acitvity");
  }

  formatArray(array, type = "conjunction") {
    return new Intl.ListFormat("en-GB", { style: "short", type: type }).format(array);
  }

  async getUserBannerUrl(client, userId, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {
    if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
      throw new Error(`The size '${size}' is not supported!`);
    }

    if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
      throw new Error(`The format '${defaultFormat}' is not supported as a default format!`);
    }

    const user = await client.users.fetch(userId, { force: true });

    if (!user.banner) return null;

    const query = `?size=${size}`;
    const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;

    if (dynamicFormat) {
      const { headers } = await axios.head(baseUrl);

      if (headers && headers.hasOwnProperty("content-type")) {
        return (baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query);
      }
    }
    return baseUrl + `.${defaultFormat}` + query;
  }

  keygen(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVQXYZabcdefghijklmnpqrstuvqxyz1234567890{}[]:;@'~#?/>.<,+=)-_(\*&^%$£!¬\`\"";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  //await sleep(milisecondsHere);

  idgen(length) {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  async loadSlashcommands() {
    const commandData = [];
    glob(`${this.directory}Slashcommands/**/*.js`).then((commands) => {
      for (const commandFile of commands) {
        delete require.cache[commandFile];
        const command = require(commandFile);
        if (!command.data) return this.client.logger.log(`Command ${commandFile} doesn't export slashcommand data.`);
        this.client.slashCommands.set(command.data.name, command);
        commandData.push(command.data);
        this.client.logger.log(`${this.capitalise(command.data.name)} Slashcommand Loaded`);
      }
    });

    if (this.client.isReady()) {
      this.client.application.commands.set(commandData);
    } else {
      this.client.once('ready', () => {
        this.client.application.commands.set(commandData);
      })
    }
  }

  async loadCommands() {
    return glob(`${this.directory}Commands/**/*.js`).then((commands) => {
      for (const commandFile of commands) {
        delete require.cache[commandFile];
        const { name } = path.parse(commandFile);
        const File = require(commandFile);
        if (!this.isClass(File))
          throw new TypeError(`Command ${name} doesn't export a class.`);
        const command = new File(this.client, name.toLowerCase());
        this.client.logger.log(`${this.capitalise(command.name)} Command Loaded`);
        if (!(command instanceof Command))
          throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`);
        this.client.commands.set(command.name, command);
        if (command.aliases.length) {
          for (const alias of command.aliases) {
            this.client.aliases.set(alias, command.name);
          }
        }
      }
    });
  }

  async loadEvents() {
    return glob(`${this.directory}Events/**/*.js`).then((events) => {
      for (const eventFile of events) {
        delete require.cache[eventFile];
        const { name } = path.parse(eventFile);
        const File = require(eventFile);
        if (!this.isClass(File))
          throw new TypeError(`Event ${name} doesn't export a class!`);
        const event = new File(this.client, name);
        this.client.logger.log(`${this.capitalise(event.name)} Event Loaded`);
        if (!(event instanceof Event))
          throw new TypeError(`Event ${name} doesn't belong in Events`);
        this.client.events.set(event.name, event);
        event.emitter[event.type](name, (...args) => event.run(...args));
      }
    });
  }
};