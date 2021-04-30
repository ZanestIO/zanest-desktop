const db = require('../../../models/Db')
const {webContentsSend, setCookies} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')
// ===================================================================================================
// Create User
// ===================================================================================================
module.exports = {

    cusr: global.share.ipcMain.on('userCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new user to db
            check = await db().sequelize.models.User.add(args)
            if (check[0]) {
                log.record('info', message.request('create', username, true))
                if (args.login === true) {
                    // SET COOKIES for login to Dashboard
                    setCookies(args)
                }
                verify = true

            } else {
                verify = false
                return webContentsSend('error', {
                    errorTitle: message.request('create', 'User', false),
                    errorMessage: check[1],
                    contactAdmin: true
                })
                
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            verify = false
        }
        // send Response
        webContentsSend('responseUserCreation', verify)
    }),

    dusr: global.share.ipcMain.on('userDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.User.deleteUser(args)
            if (check[0]) {
                await setLoadFile('./renderer/user.html');

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'کاربر'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'کاربر'),
                message: err,
                contactAdmin: true
            })
        }
    }),

}
