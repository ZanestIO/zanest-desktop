const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const {Op} = require("sequelize");

// ================================================================================
// ADD NEW TimeSlice
// ================================================================================
/**
 * add TimeSlice to DB
 * @param startTime
 * @param finishTime
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (startTime, finishTime) => {
    let newTime
    try {

        // search in database for this start time and finish time that selected.
        newTime = await db().sequelize.models.TimeSlice.findOne({
            where: {
                [Op.or]: [{
                    startTime: {
                        [Op.between]: [startTime, finishTime]
                    }
                }, {
                    finishTime: {
                        [Op.between]: [startTime, finishTime]
                    }
                }]
            }
        })


        // if new TimeSlice does not exist create it. 
        if (!newTime) {
            const holder = await db().sequelize.models.TimeSlice.create({startTime: startTime, finishTime: finishTime});

            const msg = message.request('create', true, holder.id, 'timeSlice')
            log.record('info', msg)
            return [true, message.show(true, 'create', 'بازه زمانی')]

        } else {
            const msg = message.conflictTimeSlice
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
