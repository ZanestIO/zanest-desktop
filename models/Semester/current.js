const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const {Op} = require('sequelize');
// ================================================================================
// Current Semester
/**
 * return Current Semester id
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async () => {
    try {

        const moment = require('jalali-moment');
        let currentDate = moment().locale('fa').format('YYYY-MM-DD')

        let query = 'SELECT * FROM `Semesters`'
        let result = await db().sequelize.query(query)
        result = result[0]

        currentDate = parseInt(currentDate.split('-').join(""))
        let flag = 0

        result.forEach( sem => {
            const startDate = parseInt(sem.startDate.split('-').join(""))
            const finishDate = parseInt(sem.finishDate.split('-').join(""))
            if (startDate <= currentDate && finishDate >= currentDate)
                flag = sem.id
        })

        return flag



    } catch (err) {
        log.record('Error', 'Current Semester Not Found:' + err + __filename)
        return 0
    }
}