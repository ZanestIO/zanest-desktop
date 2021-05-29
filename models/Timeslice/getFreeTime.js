const {log} = require('./../../logger')
const db = require('./../Db');
const {Op} = require('sequelize')

// ================================================================================
// RETURN INFO OF SOME TIMESLICE
// ================================================================================
module.exports = async (classRoomId) => {
    try {

        availableTimeSlices = {
            saturday: [],
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
        }

        for ([key, value] of Object.entries(availableTimeSlices)) {

            query = "SELECT `id`, `startTime`, `finishTime` FROM `TimeSlice` AS A LEFT JOIN "
            query +=
                "(SELECT `ClassId`, `timeSlouseId`, `classRoomId` FROM `Classes` INNER JOIN (SELECT * FROM `TimeClasses` WHERE weekday = '" +
                key + "') ON id = ClassId" +
                " WHERE classRoomId = '" + classRoomId + "') AS B"
            query += ' ON A.id = B.timeSlouseId WHERE B.timeSlouseId IS NULL'

            let freeTimes = await db().sequelize.query(query)
            freeTimes = freeTimes[0]
            availableTimeSlices[key] = freeTimes
        }
        return availableTimeSlices

    } catch (err) {
        log.record('error', err + ":in:" + __filename)
    }

}
