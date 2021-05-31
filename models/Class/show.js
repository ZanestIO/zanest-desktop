const db = require('../Db.js');
const {log} = require('./../../logger')
const message = require('./../../controler/massege');
const {TimeSlice} = require('../Timeslice/Timeslice.js');
const {Teacher} = require('../Teacher/Teacher.js');
const {ClassRoom} = require('../Classroom/Classroom.js');
const {Topic} = require('../Topic/Topic.js');
const {Student} = require('../Student/Student.js');
const {Person} = require('../Person/Person');

// ================================================================================
// RETURN INFO OF CLASS
// ================================================================================
module.exports = async (id) => {
    try {
        // find element with id 
        let info = await db().sequelize.models.Class.findAll({
            include: [
                {model: Teacher, attributes: ['socialID'], include: {model: Person, attributes: ['fullName']}},
                {model: Topic, attributes: ['name']},
                {model: ClassRoom, attributes: ['name']},
            ],
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

            let timeSlices = {saturday: '', sunday: '', monday: '', tuesday: '', wednesday: '', thursday: '',}
            for ([key,value] of Object.entries(timeSlices)) {
                let query = "SELECT * FROM TimeClasses WHERE ClassId = '" +
                    info.id + "' AND weekday = '" + key + "'"
                let res = await db().sequelize.query(query)
                res = res[0]

                try {
                    timeSlices[key] = res[0].TimeSlouseId
                } catch {}



            }

            let result =
            {
                    id: info.id,
                    topicId: info.topicId,
                    classRoomId: info.classRoomId,
                    semesterId: info.semesterId,
                    teacherId: info.teacherId,
                    type: info.type,
                    tuition: info.tuition,
                    topicName: info['Topic.name'],
                    teacherName: info['Teacher.Person.fullName'],
                    classRoomName: info['ClassRoom.name'],
                    timeSlices: timeSlices
                }
            return [true, result]

        } else {
            const msg = message.check(false, id)
            log.record('info', msg)
            return [false, msg]
        }
        // =======================================
    } catch (err) {
        log.record('error', err + ":in:" + __filename)
        return [false, err]
    }
}
