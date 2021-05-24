const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const {Op} = require('sequelize')
// ================================================================================
// creates the New Semester
// ================================================================================
/**
 * creates a new semester
 * @param year
 * @param startDate
 * @param finishDate
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (year, startDate, finishDate) => {
    let newSem
    try {
        // check if netSem exist
        newSem = await db().sequelize.models.Semester.findAll({
            where: {
                [Op.or]: [{
                    startDate: {
                        [Op.between]: [startDate, finishDate]
                    }
                }, {
                    finishDate: {
                        [Op.between]: [startDate, finishDate]
                    }
                }]
            }
        })

        // if new semester have no conflict create it else return conflict message
        if (newSem == false) {
            let semester = await db().sequelize.models.Semester.create({year: year, startDate: startDate, finishDate: finishDate})

            const msg = message.request('create', true, semester.id, 'semester')
            log.record('info', msg)
            return [true, message.show(true, 'create', 'ترم تحصیلی')]

        } else {
            const msg = message.conflictSemester
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
