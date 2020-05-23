const fetch = require('node-fetch');
const config = require('../../config.json');

exports.getEDTList = () => {
    return new Promise((resolve, reject) => {
        fetch(config.url.back)
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
            numEta: item.numEta,
            nomEta: item.nomEta,
            numAnnee: item.numAnnee,
            lastUpdate: item.lastUpdate
        };
    });

    let edtFinalList = [];

    edtList.forEach(item => {
        let itemEta = edtFinalList.find(subItem => subItem.numEta == item.numEta);
        if (!itemEta)
            edtFinalList.push({
                numEta: item.numEta,
                nomEta: item.nomEta,
                data: []
            });
        let indexEta = itemEta ? edtFinalList.indexOf(itemEta) : edtFinalList.length - 1;
        let dataAnnee = edtFinalList[indexEta].data;

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
        fetch(`${config.url.back}/${edtId}/json`)
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