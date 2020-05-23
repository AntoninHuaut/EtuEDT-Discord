const moment = require('moment');
const edtUtils = require('../utils/edtUtils');
const embed = require('../utils/embed');
const sql = require('../sql/');

exports.cmd = (msg, content) => {
    edtUtils.getEDTList()
        .catch(() => edtUtils.sendErrMsg(msg))
        .then(res => {
            content = content.split(" ");
            let edtContent = content[0];
            let nDay = content.length > 1 && !isNaN(content[1]) ? parseInt(content[1]) : 0;
            const weekDay = moment().days();

            if (nDay == 0 && weekDay >= 6) nDay = 8 - weekDay;

            let item = getEDTByID(res, edtContent);

            if (item.length != 1) return msg.reply(`**${item.length}** résultat(s) - **Filtre :** ${edtContent}\n\n${resultToStr(item)}`).catch(o => {});

            sql.updateEDTName(msg.author.id, edtContent.toLowerCase());

            edtUtils.getEDTJson(item[0].edtId)
                .then(data => msg.channel.send(embed.getEdtNDay(msg, item[0], data, nDay)).catch(err => console.error(err)))
                .catch(err => {
                    console.error(err);
                    edtUtils.sendErrMsg(msg);
                });
        });
}

function getEDTByID(edtList, edtContent) {
    let res = [];

    edtList.forEach(eta => {
        eta.data.forEach(annee => {
            let tmpRes = annee.data.filter(i => i.edtId == edtContent);
            tmpRes.forEach(i => res.push(i));
        });
    });

    return res;
}

function resultToStr(item) {
    let str = "";
    item.forEach(i => str += i.edtName + "\n");
    return str;
}