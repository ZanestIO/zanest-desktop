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
        let noConflict = true

        // find timeSlice with id
        const ts = await db().sequelize.models.TimeSlice.findOne({
            where: {
                id: id 
            }
        })

        //
        if( ts.startTime != startTime || ts.finishTime != finishTime){
            console.log('helloooo')
            // search in database for this start time and finish time that selected.
            let query = 'SELECT * FROM `TimeSlice`'
            let alreadyTimes = await db().sequelize.query(query)
            alreadyTimes = alreadyTimes[0]

            //  new time update most have no confilct with other time 
            noConflict = checkConflict(startTime, finishTime, alreadyTimes)
        }

        // if start time greater then finish time return error message
        if (campareTime(startTime, finishTime)) {
            const msg = message.request('update', false, ts.id, 'timeSlice')
            log.record('info', msg)
            return [false, message.finishTimeError]
        }

        // if new timeSlice info desn't have conflict, updated with new value
        if (noConflict == true){
            ts.update({startTime: startTime, finishTime: finishTime})

            const msg = message.request('update', true, ts.id, 'timeSlice')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'بازه زمانی')]
            
        } else {
            // else show already exist message
            const msg = message.conflictTimeSlice
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

function checkConflict(startTime, finishTime, alreadyTimes){
    let flag = null
    let from = parseInt(startTime.split(':').join(""))
    let to = parseInt(finishTime.split(':').join(""))

    alreadyTimes.forEach( time => {
        const startTime = parseInt(time.startTime.split(':').join(""))
        const finishTime = parseInt(time.finishTime.split(':').join(""))

        if (startTime <= from && finishTime > from || startTime < to && finishTime >= to)
            flag = time.id
    })

    if (flag != null) {
        return false
    } else {
        return true
    }
}