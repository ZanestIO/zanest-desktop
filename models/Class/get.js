const { ClassRoom } = require('../Classroom/Classroom');
const { Person } = require('../Person/Person');
const { Semester } = require('../Semester/Semester');
const { Teacher } = require('../Teacher/Teacher');
const { TimeClass } = require('../TimeClass/TimeClass');
const { TimeSlice } = require('../Timeslice/Timeslice');
const { Topic } = require('../Topic/Topic');
const {log} = require('./../../logger')
const db = require('./../Db');

// ================================================================================
// RETURN INFO OF SOME CLASS
// ================================================================================
module.exports = async () => {
    let info
    let classes = []
    try {
        // get info 
        info = await db().sequelize.models.Class.findAll({
            include: [
                { model: Teacher, include: { model: Person}},
                { model: TimeSlice },
                { model: Semester},
                { model: Topic},
                { model: ClassRoom}
            ],
            order: [
                ['createdAt', 'ASC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)

        let classRoomName
        let i = 0
        holder.forEach(node => {
            if(node.classRoom == null) {
                classRoomName = 'مجازی'
            } else {
                classRoomName = node.ClassRoom.name
            }

            let course = {
                weekday: node.TimeSlice[0].TimeClass.weekday,
                time: node.TimeSlice[0].startTime +':'+node.TimeSlice[0].finishTime,
                topic: node.Topic.name,
                id: node.id,
                teacher: node.Teacher.Person.fullName,
                classRoom: classRoomName
            }

            classes.push(course)
        })

        return classes

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}