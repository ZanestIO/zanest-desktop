const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege')

// ================================================================================
//  UPDATE CLASS INFO 
// ================================================================================
/**
 * @param topicId
 * @param teacherId
 * @param type
 * @param tuition
 * @param weekday
 * @param timId
 * @returns {Promise<(boolean|string)[]|(boolean|*)[]>}
 */
 module.exports = async (id, topicId, timeId, teacherId, classRoomId, semesterId, tuition, weekday, type) => {
    try {
        let check = null

        // find class room with id
        const course = await db().sequelize.models.Class.findOne({
            where: {
                id: id 
            }
        })

        // check 
        if(course.timeId != timeId || course.classRoomId != classRoomId || course.weekday != weekday){
            check = await db().sequelize.models.Class.findOne({
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
        }

        // if new class room info desn't have conflict, updated with new value
        if ( check == null ){
            course.update({topicId: topicId, teacherId: teacherId, classRoomId: classRoomId, 
                        semesterId: semesterId, type: type, tuition: tuition, weekday: weekday, timeId: timeId});

            const msg = message.request('update', true, id, 'class')
            log.record('info', msg)
            return [true, message.show(true, 'update', 'کلاس ')]
            
        } else {
            // else show already exist message
            const msg = message.check(true, course.id)
            log.record('info', msg)
            return [false, msg]
        }
        
    } catch (err) {
        log.record('error', err)
        return [false, err]
    }
}
