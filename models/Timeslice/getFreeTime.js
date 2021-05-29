const {log} = require('./../../logger')
const db = require('./../Db');
const {Op} = require('sequelize')

// ================================================================================
// RETURN INFO OF SOME TIMESLICE
// ================================================================================
module.exports = async (weekday, classRoomId) => {
    let busyTime
    let freeTime
    let timeSlices = []
    let arrayOfBusyTime= []


    let query = 'SELECT `id, `startTime`, `finishTime` FROM' +
        ' INNER JOIN (' +
        'SELECT `id`, `classRoomId` FROM `Classes` UNION ' +
        'SELECT `id`, `startTime`, `FinishTime` FROM `TimeSlice`' +
        'UNION SELECT * FROM `TimeClass`)'
    const freeTimes = await db().sequelize.query(query)


    // try {
    //     // get time that take it in class with weekday and classRoomId
    //     busyTime = await db().sequelize.models.Class.findAll({
    //         attributes: [
    //             'timeId', 'classRoomId', 'weekday' // We had to list all attributes...
    //         ],
    //         where: {
    //             classRoomId: classRoomId,
    //             weekday: weekday
    //         },
    //         nest: false
    //     })
    //
    //     // converts info to a JSON string
    //     const strBusyTime = JSON.stringify(busyTime)
    //     const holder1 = JSON.parse(strBusyTime)
    //
    //     holder1.forEach(node => {
    //         arrayOfBusyTime.push(node.timeId)
    //     })
    //
    //     // get time that not taked before
    //     freeTime = await db().sequelize.models.TimeSlice.findAll({
    //         where: {
    //             id: {
    //                 [Op.notIn]: arrayOfBusyTime
    //             }
    //         },
    //         order: [
    //             ['createdAt', 'ASC']
    //         ],
    //     })
    //
    //     const strFreeTime = JSON.stringify(freeTime)
    //     const holder2 = JSON.parse(strFreeTime)
    //
    //     holder2.forEach(node => {
    //         let slice = {
    //             id: node.id,
    //             startTime: node.startTime,
    //             finishTime: node.finishTime
    //         }
    //         timeSlices.push(slice)
    //     })
    //
    //     console.log(timeSlices)
    //     return timeSlices
    //
    // } catch(err) {
    //     log.record('error', err +":in:"+ __filename)
    // }
}
