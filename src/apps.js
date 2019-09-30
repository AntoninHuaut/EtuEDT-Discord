const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config');
const commands = require("./commands");
const sql = require('./sql');
sql.initTable();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(config.bot.activity, {
        type: "PLAYING"
    });
});

client.on('message', msg => {
    if (!msg.content.startsWith(config.discord.prefix)) return;
    commands(msg);
});

client.login(config.discord.token);

exports.getClient = () => {
    return client;
}