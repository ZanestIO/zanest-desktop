const db = require("../../../models/Db")
const {webContentsSend} = require('./../../../main')

// ==================================================================================
// GETTING IN BULK
// ==================================================================================
module.getBulk = {
    /**
     * ARGS:
     *  number: limited number
     *  offset: offset number
     *  type: model name
     */
    getBulk: global.share.ipcMain.on("getBulk", async (e, args) => {
        if (args.type === 'student') {
            let students = await db().sequelize.models.Student.getStudents(args.number, args.offset);
            webContentsSend('responseStudentGetBulk', {students: students})

        } else if (args.type === 'teacher') {
            let teachers = await db().sequelize.models.Teacher.getTeachers(args.number, args.offset);
            webContentsSend('responseTeacherGetBulk', {teachers: teachers})

        } else if (args.type === 'user') {

            global.share.session.defaultSession.cookies.get({url: 'http://zanest.io'}
            ).then(async (cookies) => {
                // if cookies exist
                let name
                if (cookies !== null) {
                    // get userName
                    cookies.forEach(node => {
                        if (node.name === 'userName') {
                            name = node.value
                        }
                    })
                }
                    let users = await db().sequelize.models.User.getUsers(name);
                    webContentsSend('responseUserGetBulk', {users: users})
            })
            
        } else if (args.type === 'topic') {
            let topics = await db().sequelize.models.Topic.get();
            webContentsSend('responseTopicGetBulk', {topics: topics})

        } else if (args.type === 'semester') {
            let semesters = await db().sequelize.models.Semester.get();
            webContentsSend('responseSemesterGetBulk', {semesters: semesters})

        } else if (args.type === 'timeSlice') {
            let timeSlices = await db().sequelize.models.TimeSlice.get();
            webContentsSend('responseTimeSliceGetBulk', {timeSlices: timeSlices})

        } else if(args.type === 'classRoom') {
            let classRooms = await db().sequelize.models.ClassRoom.get();
            webContentsSend('responseClassRoomGetBulk', {classRooms: classRooms})

        } else if(args.type === 'class') {
            let classes = await db().sequelize.models.Class.get();
            webContentsSend('responseClassGetBulk', {classes: classes})
            
        } else {
            log.record('warn', `${args.type} is not found. check getBulk channel`)
            return
        }
    })
}
