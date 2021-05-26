const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME TimeSlice
// ================================================================================
module.exports = async () => {
    try {
        // find element with id 
        let info = await db().sequelize.models.Institution.findAll({
            where: {
                id: 1
            },
            nest: false,
            raw: true
        })

        // if find info for those id then return all attribute
        if (info !== null) {
            log.record('info', message.request('read', true, 'one', 'Institution'))
            info = info[0]
            let result =
                {
                    id: info.id,
                    name: info.name,
                    address: info.address,
                    phone: info.phone,
                }
            return [true, result]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
















