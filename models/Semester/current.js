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

        const  moment = require('jalali-moment');
        const currentDate = moment().locale('fa').format('YYYY-M-D')
        console.log(currentDate)

        const currentSemester = await db().sequelize.models.Semester.findOne({
            where: {
                [Op.and]: [
                    {
                        startDate: { [Op.gte]: currentDate }
                    },
                    { 
                        finishDate: {  [Op.lt]: currentDate }
                    }
                ]
            }
        })

        return currentSemester.id

        } catch (err) {
            log.record('Error', 'Current Semester Not Found:' + err + __filename)
            return 0
        }
}