const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const { Op } = require('sequelize/types');
const { Semester } = require('../Semester/Semester.js');

// ================================================================================
// ADD NEW CLASS
// ================================================================================
/**
 * add CLASS to DB
 * @param topicId
 * @param teacherId
 * @param type
 * @param tuition
 * @param weekday
 * @param timId
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
module.exports = async (topicId, timeId, teacherId, classRoomId, tuition, weekday, type) => {
    let newClass
    // get Current Semester ID
    let currentSemesterId = await Semester.current()


    try {

        // search in database
        newClass = await db().sequelize.models.Class.findOne({
            where: {
                [Op.and]: [
                    {
                        timeId: timeId
                    },
                    {
                        teacherId: teacherId
                    },
                    {
                        weekday: weekday
                    }
                ] 
            }
        })

        if(currentSemesterId == 0) {
            const msg = message.request('create', true, holder.id, 'class')
            log.record('info', msg)

            return [false, message.currentSemesterError]
        }
        // if newClass is null then create it. 
        if (!newClass) {
            const holder = await db().sequelize.models.Class.create({topicId: topicId, teacherId: teacherId, classRoomId: classRoomId, 
                                semesterId: currentSemesterId, type: type, tuition: tuition, weekday: weekday, timeId: timeId});

            const msg = message.request('create', true, holder.id, 'class')
            log.record('info', msg)

            return [true, message.show(true, 'create', 'کلاس ')]

        } else {
            const msg = message.check(false, newClass.id)
            log.record('error', msg)
            return [false, msg]
        }

    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
