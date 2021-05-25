const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE TIMESLICE INFO 
// ================================================================================
/**
 * update timeSlice attributes
 * @param id
 * @param startTime
 * @param finishTime
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (id, startTime, finishTime) => {
    try {
        let check = null

        // find timeSlice with id
        const ts = await db().sequelize.models.TimeSlice.findOne({
            where: {
                id: id 
            }
        })

        // 
        check = await db().sequelize.models.TimeSlice.findOne({
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

        // if new timeSlice info desn't have conflict, updated with new value
        if (!check[1]){
            ts.update({startTime: startTime, finishTime: finishTime})

            const msg = message.request('update', true, ts.id, 'TimeSlice')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'بازه زمانی')]
            
        } else {
            // else show already exist message
            const msg = message.check(true, ts.id )
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}
