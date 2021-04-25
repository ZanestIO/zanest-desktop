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
        if(args.type === 'Student') {
            let students = await db().sequelize.models.Student.getStudents(args.number, args.offset);
            webContentsSend('responseStudentGetBulk', {students: students})

        } else if ( args.type === 'Teacher') { 
            let teachers = await db().sequelize.models.Teacher.getTeachers(args.number, args.offset);
            webContentsSend('responseTeacherGetBulk', {teachers: teachers})

        } else if ( args.type === 'User') {
            let users = await db().sequelize.models.User.getUsers(args.number, args.offset);
            webContentsSend('responseUserGetBulk', {users: users})

        } else {
            log.record('warn', `${args.type} is not found. check sender channel`)
            return 
        }
    })
}


