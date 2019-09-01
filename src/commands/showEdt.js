const edtUtils = require('../utils/edtUtils');
const embed = require('../utils/embed');

module.exports = (msg, content) => {
    edtUtils.getEDTList()
        .catch(() => edtUtils.sendErrMsg(msg))
        .then(res => {
            content = content.split(" ");
            let edtContent = content[0];
            let nDay = content.length > 1 && !isNaN(content[1]) ? parseInt(content[1]) : 0;
            let item = res.filter(i => i.edtName.replace(/ /g, '').toLowerCase().includes(edtContent.toLowerCase()))
            if (item.length != 1) return msg.reply(`**${item.length}** résultat(s) - **Filtre :** ${edtContent}\n\n${resultToStr(item)}`).catch(o => {});

            edtUtils.getEDTJson(item[0].edtId)
                .then(data => msg.channel.send(embed.getEdtNDay(msg, data, nDay)).catch(o => {}))
                .catch(() => edtUtils.sendErrMsg(msg));
        });
}

function resultToStr(item) {
    let str = "";
    item.forEach(i => str += i.edtName + "\n");
    return str;
}