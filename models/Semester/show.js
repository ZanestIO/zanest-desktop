const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const moment = require('jalali-moment');
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

            sDate = moment.from(info.startDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD')
            fDate = moment.from(info.finishDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD')

            let result =
                {
                    id: info.id,
                    year: info.year,
                    startDate: sDate,
                    finishDate: fDate,
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
