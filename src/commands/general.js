const embed = require('../utils/embed');
const config = require('../../config.json');

exports.info = (msg) => {
    msg.channel.send(embed.getInfos(msg)).catch(o => {});
}

exports.url = (msg) => {
    msg.reply("Emploi du temps en ligne : " + config.edtURL).catch(o => {});
}