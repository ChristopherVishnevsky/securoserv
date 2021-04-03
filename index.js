const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
client.config = require("./config.json");

client.on("message", async message => {
    if(message.author.bot)return;

    let prefix = "?";
    let msg = message.content.toLowerCase();
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    let blist = ["vk.com/danilli", "vk.com/slivdsrrp", "https://vk.com/danilli", "https://vk.com/slivdsrrp"];

    if (blist.some(word => message.content.toLowerCase().includes(word))) {
        
        let m = await db.fetch(`channel.${message.guild.id}.audit.toggle`)
        let f = await db.fetch(`channel.${message.guild.id}.audit.channel`)
        if (m === null || m === false) {
            console.log(`[IGNORE] Offtop: Invite link was skipped`)
        } else if(m === true) {
            message.delete();
            client.channels.cache.get(f).send(`<@${message.author.id}> прислал ссылку на сливщика в канале <#${message.channel.id}>`)
        }
    }

    if(msg.startsWith("?setchannel")) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return;

        let toggling = ["enable", "disable"]; // creating toggling system.

        /*if(!toggling.includes.any(args[0])) {
            return message.channel.send("enable/disable?")
        }*/

        if(args[0] === "enable") {
            let channel = message.mentions.channels.first();
            if(!channel) return message.channel.send("Канал?");

            await db.set(`channel.${message.guild.id}.audit.toggle`, true);
            await db.set(`channel.${message.guild.id}.audit.channel`, channel.id);

            return message.channel.send(`+`);
        }

        if(args[0] === "disable") {
            let toggle = db.get(`channel.${message.guild.id}.audit.toggle`);
            if (!toggle || toggle == false) return message.channel.send("-");
            await db.set(`channel.${message.guild.id}.audit.toggle`, false);
            await db.delete(`channel.${message.guild.id}.audit.channel`);

            return message.channel.send("+")
        }

    }
})

client.on("ready", () => {
    client.user.setStatus("idle");

    console.log("BOT UP")
})

client.login(client.config.TOKEN);