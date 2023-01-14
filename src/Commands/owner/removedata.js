const Command = require("../../Structures/Command.js"),
    Db = require("../../Structures/Db");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "removedata",
            aliases: ["rd"],
            category: "Owner",
            ownerOnly: true,
        });
    }

    async run(message, args) {
        const client = this.client

        let user = null;
        if (!args[0] || !(user = await client.users.fetch(args[0]))) {
            return message.channel.send({ content: `Please include a user ID` });
        }

        await Db("economy").then(async (db) => {
            db.deleteOne({ user: user.id });
        });

        return message.channel.send(`I have deleted ${user}\'s data`)
    }
};