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
    let classes = {saturday: [], sunday: [], monday: [], tuesday: [], wednesday: [], thursday: []}
    try {
        // get info 
        info = await db().sequelize.models.Class.findAll({
            include: [
                { model: Teacher, attributes: ['socialID'], include: { model: Person, attributes:['fullName']},},
                { model: Topic,  attributes: ['name']},
                { model: ClassRoom,  attributes: ['name']},
            ],
            attributes: ['id', 'type'],
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
        for (const node of holder) {
            try {
                classRoomName = node.ClassRoom.name
            } catch {
                classRoomName = 'مجازی'
            }

            console.log(classRoomName)

            let session

            // getting all the timeSlices
            let query = "SELECT id, startTime, finishTime, weekday FROM TimeSlice INNER JOIN (SELECT * FROM TimeClasses WHERE ClassId ='" +
                node.id + "') ON id = timeSlouseId"
            let times = await db().sequelize.query(query)
            times = times[0]

            times.forEach(time => {
                session = {
                    time: time.id,
                    topic: node.Topic.name,
                    id: node.id,
                    teacher: node.Teacher.Person.fullName,
                    classRoom: classRoomName
                }
                classes[time.weekday].push(session)
            })
        }

        // console.log(classes)
        return classes

    } catch(err) {
        log.record('error', err +":in:"+ __filename)
    }
}