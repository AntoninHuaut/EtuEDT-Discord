const fetch = require('node-fetch');
const moment = require('moment');
const config = require('../../config.json');

exports.getEDTList = () => {
    return new Promise((resolve, reject) => {
        fetch(`${config.edtURL}data/`)
            .then(res => res.json())
            .then(res => {
                if (!res || !!res.error) return reject(res);
                resolve(convertEDTList(res));
            });
    });
}

function convertEDTList(edtList) {
    edtList = edtList.map(item => {
        return {
            edtId: item.edtId,
            edtName: item.edtName,
            numUniv: item.numUniv,
            nomUniv: item.nomUniv,
            numAnnee: item.numAnnee
        };
    });

    let edtFinalList = [];

    edtList.forEach(item => {
        let itemUniv = edtFinalList.find(subItem => subItem.numUniv == item.numUniv);
        if (!itemUniv)
            edtFinalList.push({
                numUniv: item.numUniv,
                nomUniv: item.nomUniv,
                data: []
            });
        let indexUniv = itemUniv ? edtFinalList.indexOf(itemUniv) : edtFinalList.length - 1;
        let dataAnnee = edtFinalList[indexUniv].data;

        let itemAnnee = dataAnnee.find(subItem => subItem.numAnnee == item.numAnnee);
        if (!itemAnnee)
            dataAnnee.push({
                numAnnee: item.numAnnee,
                data: []
            });
        let indexAnnee = itemAnnee ? dataAnnee.indexOf(itemAnnee) : dataAnnee.length - 1;
        dataAnnee[indexAnnee].data.push(item);
    });

    return edtFinalList;
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