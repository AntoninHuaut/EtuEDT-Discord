const edtUtils = require('../utils/edtUtils');
const embed = require('../utils/embed');

module.exports = (msg) => {
    edtUtils.getEDTList()
        .then(res => msg.channel.send(embed.getListEDT(msg, res)).catch(err => console.error(err)))
        .catch((err) => {
            console.error(err);
            edtUtils.sendErrMsg(msg);
        });
}