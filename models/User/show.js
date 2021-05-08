const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME USER
// ================================================================================
module.exports = async (id) => {
    try {
        // select * from User where userName == username
        let info = await db().sequelize.models.User.findAll({
            where: {
                id: id
            },
            nest: false,
            raw: true
        })

        if (info !== null) {
            log.record('info', message.request('read', true, id))
            info = info[0]
            let result =
                {
                    userID: info.id,
                    userName: info.userName,
                    fullName: info.fullName,
                    password:  null,
                    userType: info.userType,
                    birthDate: info.birthDate,
                    phoneNumber: info.phoneNumber,
                }
            return [true, result]

        } else {
            const msg = message.check(false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
