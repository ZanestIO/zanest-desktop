const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const {Semester} = require('../Semester/Semester.js');
const {pWeekdays} = require('../../renderer/js/utils/converts')

// ================================================================================
// ADD NEW CLASS
// ================================================================================
/**
 * add CLASS to DB
 * @param topicId
 * @param teacherId
 * @param type
 * @param tuition
 * @param classRoomId
 * @param timeSlices
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (topicId, teacherId, classRoomId, tuition, type, timeSlices) => {
    try {
        // ==================================================================================
        // FIND CURRENT SEMESTER
        let currentSemesterId = await Semester.current()
        if(currentSemesterId === 0) {
                    const msg = message.request('create', true, currentSemesterId, 'class')
                    log.record('info', msg)
                    return [false, message.currentSemesterError]
        }

        // ==================================================================================
        // CHECK IF ANOTHER CLASS WITH THIS TEACHER EXISTS IN THE SPECIFIED TIMES
        let query = 'SELECT `weekday`, `timeSlouseId` FROM ' +
            '(`TimeClasses` INNER JOIN (SELECT `id` FROM `classes` WHERE `teacherId` = +' + teacherId + ') ' +
            'ON id = ClassId)'
        let teacherTimes = await db().sequelize.query(query)
        teacherTimes = teacherTimes[0]

        let errMsg
        if (teacherTimes) {
            for ([key, value] of Object.entries(timeSlices)) {

                teacherTimes.forEach(time => {
                    if (time.hasOwnProperty('weekday')) {
                        if (time.weekday === key) {
                            if (time.TimeSlouseId === value) {
                                errMsg = 'تداخل کاری استاد:'
                                errMsg += 'استاد انتخابی در ساعت انتخابی روز '
                                errMsg += pWeekdays[key] + ' کلاس دیگری دارد '
                            }
                        }
                    }

                }) // end second for
            } // end first for
        }
        if (errMsg)
            return [false, errMsg]


        // ==================================================================================
        // choose a different approach based on classRoomId
        let holder
        if (classRoomId) {
            holder = await db().sequelize.models.Class.create({
                topicId: topicId, teacherId: teacherId, classRoomId: classRoomId,
                semesterId: currentSemesterId, type: type, tuition: tuition
            });
        } else {
            holder = await db().sequelize.models.Class.create({
                topicId: topicId, teacherId: teacherId,
                semesterId: currentSemesterId, type: type, tuition: tuition
            });
        }
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        console.log(timeSlices)
        // ==================================================================================
        // saving times and weekdays in db
        for ([key, value] of Object.entries(timeSlices)) {
            console.log(key, value)
            await db().sequelize.models.TimeClass.create({TimeSlouseId: value, weekday: key, ClassId: holder.id})
        }


        // ==================================================================================
        // setting logs and return
        const msg = message.request('create', true, holder.id, 'class')
        log.record('info', msg)

        return [true, message.show(true, 'create', 'کلاس ')]

    } catch (err) {
        log.record('error', err + ":in:" + __filename)
        return [false, err]
    }
}
