const db = require('./../../../models/Db')
const {setCookies, setLoadFile, webContentsSend} = require('./../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')
// ================================================================================
// requesting user Authentication
// ================================================================================
module.exports = {
    userAuth: global.share.ipcMain.on('userAuth', async (e, args) => {
        let loggedIn = await db().sequelize.models.User.login(args.username, args.password)
    
        if (loggedIn[0]) {
            //setting cookies
            log.record('info', message.successUserAuth(args.username))
            await setCookies(loggedIn[1])
            await setLoadFile('./renderer/dashboard.html')
        } else {
            // return error log
            log.record('info', message.failUserAuth(args.username))
            webContentsSend('userAuthError', loggedIn[1])
        }
    })
    
}
