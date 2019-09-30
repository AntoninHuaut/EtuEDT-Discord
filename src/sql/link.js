const sql = require('./index');

exports.getEDTName = (userId) => {
    return new Promise((resolve, reject) => {
        sql.getConnection().query("select * from edtdiscord_link where userId = ?", [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

exports.updateEDTName = (userId, edtName) => {
    return new Promise((resolve, reject) => {
        sql.getConnection().query("insert into edtdiscord_link(userId, edtName) " +
            "values(?, ?) ON DUPLICATE KEY UPDATE edtName = ?", [userId, edtName, edtName], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
    });
};