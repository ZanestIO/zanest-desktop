const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const {Op} = require('sequelize');
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
        if( ts.startTime != startTime || ts.finishTime != finishTime){
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
        }

        // if start time greater then finish time return error message
        if (campareTime(startTime, finishTime)) {
            const msg = message.request('update', false, ts.id, 'timeSlice')
            log.record('info', msg)
            return [false, message.finishTimeError]
        }

        // if new timeSlice info desn't have conflict, updated with new value
        if (check == null){
            ts.update({startTime: startTime, finishTime: finishTime})

            const msg = message.request('update', true, ts.id, 'timeSlice')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'بازه زمانی')]
            
        } else {
            // else show already exist message
            const msg = message.check(true, id )
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err +":in" + __filename)
        return [false, err]
    }
}

function campareTime(from, to){
    let start = parseFloat(from.replace(/\:/g, ""))
    let finish = parseFloat(to.replace(/\:/g, ""))
    
    if(start >= finish) {
        return true
    } else {
        return false
    }
}