const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const { TimeSlice } = require('../Timeslice/Timeslice.js');
const { Teacher } = require('../Teacher/Teacher.js');
const { ClassRoom } = require('../Classroom/Classroom.js');
const { Topic } = require('../Topic/Topic.js');
const { Student } = require('../Student/Student.js');

// ================================================================================
// RETURN INFO OF CLASS
// ================================================================================
module.exports = async (id) => {
    try {
        // find element with id 
        let info = await db().sequelize.models.Class.findAll({
            include: {
                model: [Topic, TimeSlice, Teacher, ClassRoom, Student]
            },
            where: {
                id: id
            },
            nest: false,
            raw: true
        })

        // if find info for those id then return all attribute
        if (info !== null) {
            log.record('info', message.request('read', true, info.id, 'class'))

            info = info[0]
            let result =
                {
                    id: info.id,
                    topic: info['Topic.name'],
                    teacherName: info['Teacher.name'],
                    type: info.type,
                    tuition: info.tuition,
                    from: info['TimeSlice.startTime'],
                    to: info['TimeSlice.finishTime'],
                    weekday: info.weekday,
                }
            return [true, result]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err +":in:"+ __filename)
        return [false, err]
    }
}
