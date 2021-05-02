const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME USER
// ================================================================================
module.exports = async (username) => {
    try {

        // select * from User where userName == username
        let info = await db().sequelize.models.User.findAll({
            where: {
                userName: username
            },
            nest: false,
            raw: true
        })

        if (info !== null) {
            log.record('info', message.request('read', 'User', true, username))
            info = info[0]
            let result =
                {
                    fullName: info.fullName,
                    userName: info.userName,
                    userType: info.uesrType,
                    birthDate: info.birthDate,
                    phoneNumber: info.phoneNumber,
                }
            return [true, result]

        } else {
            const msg = message.check('User', false, sid)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
