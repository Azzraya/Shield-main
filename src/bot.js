"use strict";

const { ShardingManager } = require("discord.js"),
  config = require("./Structures/Config"),
  manager = new ShardingManager("./src/index.js", {
    token: config.token,
  });

manager.on("shardCreate", async (shard) => console.log(`[Shard] Launched shard ${shard.id}`));

manager.spawn({
  amount: "auto",
  delay: 5500,
  timeout: 30000,
});
