const fs = require('fs').promises;
const moment = require('moment');

const sql = require('../sql/');
const edtUtils = require('../utils/edtUtils');
const embed = require('../utils/embed');
const captureEDT = require('../utils/captureEDT.js');
const config = require('../../config.json');

exports.cmd = (msg, content) => {
    edtUtils.getEDTList()
        .catch(() => edtUtils.sendErrMsg(msg))
        .then(async res => {
            const edtContent = content.split(" ")[0];
            const item = getEDTByID(res, edtContent);

            if (item.length == 0)
                return msg.reply(`Aucun emploi du temps ne possède l'id \`${edtContent}\``).catch(err => {});

            sql.updateEDTName(msg.author.id, edtContent.toLowerCase());

            const replyMsg = await msg.channel.send("Vérification...").catch(err => {});
            const imgRes = await checkIfNeedCapture(edtContent, replyMsg);
            replyMsg.edit("3/3 Récupération depuis le cache...").catch(err => {});

            replyMsg.delete().catch(err => {});
            if (!imgRes) return edtUtils.sendErrMsg(msg);

            replyMsg.channel.send(embed.getEDTImg(msg, item[0], imgRes, 'edt.png')).catch(err => {});
        });
}

async function checkIfNeedCapture(edtId, replyMsg) {
    const folder = 'captures/';
    const name = `edt-${edtId}.png`;
    const path = folder + name;

    try {
        const stat = await fs.stat(folder + name);
        const limitedDate = moment(stat.mtime).add(config.img.cacheTime, 'seconds');
        const currentDate = moment();

        if (limitedDate.isAfter(currentDate))
            return path;
    } catch (ex) {}

    try {
        replyMsg.edit("1/3 Capture de l'emploi du temps...");
        await captureEDT.takeScreenshot(edtId, folder, name);
        replyMsg.edit("2/3 Traitement de la capture...");
        return await captureEDT.resizeScreenshot(folder, name);
    } catch (ex) {
        return null;
    }
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