"use strict";

const ShieldClient = require("./Structures/ShieldClient"),
  config = require("./Structures/Config"),
  client = new ShieldClient(config);

client.debug = 3;

client.on("disconnect", () => client.logger.warn("Bot is disconnecting . . .")).on("reconnecting", () => client.logger.log("Bot reconnecting . . .")).on("rateLimit", (info) => client.logger.warn(info)).on("error", (e) => client.logger.error(e)).on("shardError", (e, id) => {
  client.logger.error(`Error on shard ${id}:`);
  client.logger.error(e);
}).on("debug", (info) => {
  const sessions = info.match(/Remaining: (\d+)$/);

  if (sessions) {
    return client.logger.debug(`Session ${1000 - parseInt(sessions[1], 10)} of 1000`, { shard: "Manager" });
  }

  if (info.match(/\[WS => Shard \d+] (?:\[HeartbeatTimer] Sending a heartbeat\.|Heartbeat acknowledged, latency of \d+ms\.)/)) {
    return;
  }

  if (info.startsWith("429 hit on route")) {
    return;
  }

  if (client.debug >= 6) {
    client.logger.debug(info);
  }

}).on("warn", (info) => client.logger.warn(info, { shard: "Manager" }));

process.on("unhandledRejection", (err) => client.logger.error(err.stack));

client.start();