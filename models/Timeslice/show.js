const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME TimeSlice
// ================================================================================
module.exports = async (id) => {
    try {
        // find element with id 
        let info = await db().sequelize.models.TimeSlice.findAll({
            where: {
                id: id
            },
            nest: false,
            raw: true
        })

        // if find info for those id then return all attribute
        if (info !== null) {
            log.record('info', message.request('read', true, info.id, 'timeSlice'))
            info = info[0]
            let result =
                {
                    id: info.id,
                    startTime: info.startTime,
                    finishTime: info.finishTime,
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
