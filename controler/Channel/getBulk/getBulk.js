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
        if(args.type === 'student') {
            let students = await db().sequelize.models.Student.getStudents(args.number, args.offset);
            webContentsSend('responseStudentGetBulk', {students: students})

        } else if ( args.type === 'teacher') {
            let teachers = await db().sequelize.models.Teacher.getTeachers(args.number, args.offset);
            webContentsSend('responseTeacherGetBulk', {teachers: teachers})

        } else if ( args.type === 'user') {
            let users = await db().sequelize.models.User.getUsers(currentUser());
            webContentsSend('responseUserGetBulk', {users: users})
            console.log(users)
        } else {
            log.record('warn', `${args.type} is not found. check sender channel`)
            return 
        }
    })
}


function currentUser() {
    global.share.session.defaultSession.cookies.get({url: 'http://zanest.io'})
        .then( async(cookies) => {
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
        return name
    })
}