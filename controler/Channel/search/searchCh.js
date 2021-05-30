const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')

// ==================================================================================
// HANDLING SEARCH RESULT
// ==================================================================================
module.exports = {
    searchEvent: global.share.ipcMain.on('search', async(e, args) => {
        /*
        Searches Are Done By Containment Not Equality
        ToDo: adding type checking in here for search
         */
        let result = []
        if(args.type === "student"){
            if (args.info.sid) {
                result = await db().sequelize.models.Student.search('id', args.info.sid)
            } else if (args.info.name) {
                result = await db().sequelize.models.Student.search('name', args.info.name)
            }
        } else if (args.type === "teacher"){
            if (args.info.sid) {
                result = await db().sequelize.models.Teacher.search('id', args.info.sid)
            } else if (args.info.name) {
                result = await db().sequelize.models.Teacher.search('name', args.info.name)
            }
        } else if (args.type === "class") {
            if (args.info.topic) {
                result = await db().sequelize.models.Class.search('topic', args.info.topic)
            } else if (args.info.teacher) {
                result = await db().sequelize.models.Class.search('teacher', args.info.teacher)
            }
        }

        webContentsSend('responseSearch',  result)
    })
}

