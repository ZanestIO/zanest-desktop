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
        }

        webContentsSend('responseSearch',  result)
    })
}

