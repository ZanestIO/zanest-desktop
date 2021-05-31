const {log} = require('./../../logger')
const db = require('./../Db');
const sequelize = require('sequelize')
// ================================================================================
// RETURN INFO OF SOME TIMESLICE
// ================================================================================
module.exports = async () => {
    let info
    let timeSlices = []
    try {
        // get info 
        info = await db().sequelize.models.TimeSlice.findAll({
            order:[
                ['startTime', 'DESC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let slice = {
                id: node.id,
                startTime: node.startTime,
                finishTime: node.finishTime
            }
            timeSlices.push(slice)
        })

        return timeSlices

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}