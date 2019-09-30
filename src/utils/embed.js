const client = require('../apps').getClient();
const Discord = require('discord.js');
const config = require('../../config.json');
const moment = require('moment');
const edtUtils = require('./edtUtils');

exports.getInfos = (msg) => {
    let embed = getEmbed(msg);
    embed.addField(`${config.discord.prefix}`, "Affiche la liste des emplois du temps", false);
    embed.addField(`${config.discord.prefix}me`, "Affiche votre emploi du temps favori", false);
    embed.addField(`${config.discord.prefix}url`, "Site de consultation des emplois du temps", false);
    embed.addField(`${config.discord.prefix}<nom>`, "Affiche l'emploi du temps à la date du jour", false);
    embed.addField(`${config.discord.prefix}<nom> <nombre jour>`, "Affiche l'emploi du temps à x jour(s) de différence", false);
    return embed;
};

exports.getListEDT = (msg, res) => {
    let embed = getEmbed(msg);
    res.forEach(item => embed.addField(item.edtName, "\u200B", false));
    return embed;
}

exports.getEdtNDay = (msg, data, nDay) => {
    let embed = getEmbed(msg);
    embed.setAuthor(embed.author.name + " - " + getNDayInfos(nDay), embed.author.icon_url, embed.author.url);
    data.filter(item => edtUtils.isDateValid(moment(item.start), nDay))
        .forEach(item => {
            let location = item.location || "?";
            embed.addField(`${getHour(item.start)} - ${getHour(item.end)} (${location})`, item.title);
        });
    return embed;
}

function getNDayInfos(nDay) {
    if (nDay == -1) return "Hier";
    if (nDay == 0) return "Aujourdhui";
    if (nDay == 1) return "Demain";
    else return "Jour " + (nDay < 0 ? nDay : "+" + nDay);
}

function getHour(date) {
    return moment(date).format("HH[h]mm").replace('h00', 'h');
}

function getEmbed(msg) {
    return new Discord.RichEmbed()
        .setColor('#F44336')
        .setAuthor("EtuEDT", client.user.avatarURL, config.edtURL)
        .setFooter(msg.author.tag, msg.author.avatarURL)
        .setTimestamp();
}