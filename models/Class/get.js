const { ClassRoom } = require('../Classroom/Classroom');
const { Teacher } = require('../Teacher/Teacher');
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
            include: {
              model: [TimeSlice,Topic, ClassRoom, Teacher]
            },
            order: [
                ['createdAt', 'ASC']
            ],
            nest: false
        })

        // converts info to a JSON string
        const strInfo = JSON.stringify(info)
        const holder = JSON.parse(strInfo)
        
        holder.forEach(node => {
            let course = {
                id: node.id,
                weekday: node.weekday,
                from: node.TimeSlice.startTime,
                to: node.TimeSlice.finishTime,
                teacherName: node.Teacher.Person.fullName,
                topic: node.Topic.name,
                classRoom: node.ClassRoom.name
            }
            classes.push(course)
        })

        return classes

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}