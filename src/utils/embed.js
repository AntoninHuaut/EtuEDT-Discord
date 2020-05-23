const client = require('../apps').getClient();
const Discord = require('discord.js');
const config = require('../../config.json');
const moment = require('moment');
const edtUtils = require('./edtUtils');

exports.getInfos = (msg) => {
    let embed = getEmbed(msg);
    embed.addField(`${config.discord.prefix}`, "Affiche la liste des emplois du temps", false);
    embed.addField(`${config.discord.prefix}me`, "Affiche le dernier emploi du temps consulté", false);
    embed.addField(`${config.discord.prefix}url`, "Site de consultation des emplois du temps", false);
    embed.addField(`${config.discord.prefix}<id>`, "Affiche l'emploi du temps à la date du jour *(sauf weekends)*", false);
    embed.addField(`${config.discord.prefix}<id> <**+/-** nombre jour>`, "Affiche l'emploi du temps à x jour(s) de différence", false);
    return embed;
};

exports.getListEDT = (msg, res) => {
    let embed = getEmbed(msg);
    embed.setDescription(`Choisissez l'emploi du temps avec ${config.discord.prefix}<numero>`);
    res.forEach(eta => {
        embed.addField(`**${eta.nomEta} :**`, `*${eta.data.length} sous-catégories :*`, false);

        eta.data.forEach(annee => {
            let str = "";

            annee.data.forEach(edt => {
                const edtName = edt.edtName.replace(annee.numAnnee + 'A', '');
                str += `\n${edt.edtId} - ${edtName}`;
            });

            embed.addField(`${annee.numAnnee}A :`, str, true);
        });

        if (res.indexOf(eta) > 0 && res.indexOf(eta) + 1 < res.length)
            embed.addBlankField(false);
    });

    return embed;
}

exports.getEdtNDay = (msg, edtInfos, data, nDay) => {
    let embed = getEmbed(msg);
    embed.setAuthor(embed.author.name + " - " + edtInfos.edtName + " - " + getNDayInfos(nDay), embed.author.icon_url, embed.author.url);
    embed.setTitle(getDateDay(nDay));
    embed.setDescription(`*Dernière update le : ${moment(edtInfos.lastUpdate).format("DD/MM/YYYY [à] HH:mm")}*`);
    data.filter(item => edtUtils.isDateValid(moment(item.start), nDay))
        .forEach(item => {
            let location = item.location || "?";
            embed.addField(`${getHour(item.start)} - ${getHour(item.end)} (${location})`, item.title);
        });
    return embed;
}

function getDateDay(nDay) {
    const dateName = moment().add(nDay, 'days').locale("fr").format("dddd DD MMMM YYYY");
    return dateName.charAt(0).toUpperCase() + dateName.slice(1).toLowerCase();
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
        .setAuthor("EtuEDT", client.user.avatarURL, config.url.front)
        .setFooter(msg.author.tag, msg.author.avatarURL)
        .setTimestamp();
}