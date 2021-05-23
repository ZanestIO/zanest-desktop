const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
// RETURN INFO OF SOME SEMESTER
// ================================================================================
module.exports = async (id) => {
    try {
        // get info where id equal input id
        let info = await db().sequelize.models.Semester.findAll({
            where: {
                id: id
            },
            nest: false,
            raw: true
        })

        // if info exsit then return attributes
        if (info !== null) {
            log.record('info', message.request('read', true, id,'semester'))
            info = info[0]
            let result =
                {
                    id: info.id,
                    year: info.year,
                    startDate: info.startDate,
                    finishDate: info.finishDate,
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
