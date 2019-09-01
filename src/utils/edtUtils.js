const fetch = require('node-fetch');
const moment = require('moment');
const config = require('../../config.json');

exports.getEDTList = () => {
    return new Promise((resolve, reject) => {
        fetch(`${config.edtURL}data/`)
            .then(res => res.json())
            .then(res => {
                if (!res || !!res.error) return reject(res);
                resolve(res);
            });
    });
}

exports.getEDTJson = (edtId) => {
    return new Promise((resolve, reject) =>
        fetch(`${config.edtURL}data/${edtId}/json`)
        .then(res => res.json())
        .then(res => {
            if (!res || !!res.error) return reject(res);
            resolve(res);
        })
    );
}

exports.sendErrMsg = (msg) => {
    msg.reply(":x: Erreur dans la récuparation de(s) (l') emploi(s) du temps").catch(o => {})
}

exports.isDateValid = (date, nDay) => {
    return date.isSame(getDateNDay(nDay), 'day');
}

function getDateNDay(nDay) {
    return moment().add(nDay, 'days').startOf('day');
}