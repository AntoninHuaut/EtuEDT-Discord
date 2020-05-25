const client = require('../apps').getClient();
const Discord = require('discord.js');
const config = require('../../config.json');

exports.getInfos = (msg) => {
    let embed = getEmbed(msg);
    embed.addField(`${config.discord.prefix}list`, "Afficha la liste des EDTs", false);
    embed.addField(`${config.discord.prefix}me`, "Affiche le dernier EDT consulté", false);
    embed.addField(`${config.discord.prefix}<id>`, "Affiche l'EDT *(vue semaine)*", false);
    return embed;
};

exports.getListEDT = (msg, res) => {
    const embed = getEmbed(msg);
    embed.setDescription(`Choisissez l'emploi du temps avec **${config.discord.prefix}<numero>**\nPuis accédez y rapidement avec **${config.discord.prefix}me**`);
    res.forEach(eta => {
        embed.addField(`**${eta.nomEta} :**`, `*${eta.data.length} sous-catégories :*`, false);

        eta.data.forEach(annee => {
            let str = "";

            annee.data.forEach(edt => {
                const edtName = edt.edtName.replace(annee.numAnnee + 'A', '');
                str += `\n**${edtName}** : ${edt.edtId}`;
            });

            embed.addField(`${annee.numAnnee}A :`, str, true);
        });

        if (res.indexOf(eta) > 0 && res.indexOf(eta) + 1 < res.length)
            embed.addBlankField(false);
    });

    return embed;
}

exports.getEDTImg = (msg, edtInfos, imgUrl, fileName) => {
    const attachment = new Discord.Attachment(imgUrl, fileName);
    const embed = getEmbed(msg);
    embed.setAuthor(embed.author.name + " - " + edtInfos.edtName, embed.author.icon_url, embed.author.url);
    embed.setDescription("Cliquez sur l'image pour l'agrandir");
    embed.attachFile(attachment);
    embed.setImage('attachment://' + fileName);

    return embed;
}

function getEmbed(msg) {
    return new Discord.RichEmbed()
        .setColor('#F44336')
        .setAuthor("EtuEDT", client.user.avatarURL, config.url.front)
        .setFooter(msg.author.tag, msg.author.avatarURL)
        .setTimestamp();
}