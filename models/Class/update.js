const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')
const {pWeekdays} = require('./../../renderer/js/utils/converts')
// ================================================================================
//  UPDATE CLASS INFO 
// ================================================================================
/**
 * @param topicId
 * @param teacherId
 * @param classRoomId
 * @param semesterId
 * @param type
 * @param tuition
 * @param id
 * @param timeSlices
 */
 module.exports = async (id, topicId, teacherId, classRoomId, tuition, type, timeSlices) => {
    try {
        // ==================================================================================
        // find class room with id
        const course = await db().sequelize.models.Class.findOne({
            where: {
                id: id 
            }
        })


        // ==================================================================================
        // CHECK IF ANOTHER CLASS WITH THIS TEACHER EXISTS IN THE SPECIFIED TIMES
        let query = 'SELECT `weekday`, `timeSlouseId` FROM ' +
            '(`TimeClasses` INNER JOIN (SELECT `id` FROM `classes` WHERE `teacherId` ="' + teacherId + '" AND id != "' + id + '") ' +
            'ON id = ClassId)'
        let teacherTimes
        teacherTimes = await db().sequelize.query(query)
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


        // check 
        // ==================================================================================
        // choose a different approach based on classRoomId
        if (classRoomId) {
            course.update({
                topicId: topicId, teacherId: teacherId, classRoomId: classRoomId, type: type, tuition: tuition
            });
        } else {
            course.update({
                topicId: topicId, teacherId: teacherId, type: type, tuition: tuition
            });
        }
        course.save()

        // ==================================================================================
        // saving times and weekdays in db
        let deleteQuery = "DELETE FROM TimeClasses WHERE ClassId ='" + id + "'"
        await db().sequelize.query(deleteQuery)
        for ([key, value] of Object.entries(timeSlices)) {
            await db().sequelize.models.TimeClass.create({TimeSlouseId: value, weekday: key, ClassId: id})
        }


        const msg = message.request('update', true, id, 'class')
        await log.record('info', msg)
        return [true, message.show(true, 'update', 'کلاس ')]

        
    } catch (err) {
        await log.record('error', err)
        return [false, err]
    }
}
