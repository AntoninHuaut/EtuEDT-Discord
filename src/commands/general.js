const embed = require('../utils/embed');
const config = require('../../config.json');
const showEdt = require('./showEdt');
const sql = require('../sql/');

exports.info = (msg) => {
    msg.channel.send(embed.getInfos(msg)).catch(o => {});
}

exports.url = (msg) => {
    msg.reply("Emploi du temps en ligne : " + config.edtURL).catch(o => {});
}

exports.me = (msg, content) => {
    sql.getEDTName(msg.author.id).then(edtName => {
        if (!edtName.length) return msg.reply("Vous n'avez pas d'emploi du temps favori").catch(o => {});

        edtName = edtName[0].edtName;
        content = content.split(" ");
        let nDay = content.length > 1 && !isNaN(content[1]) ? parseInt(content[1]) : 0;

        showEdt.cmd(msg, edtName + " " + nDay);
    }).catch(e => {});
}