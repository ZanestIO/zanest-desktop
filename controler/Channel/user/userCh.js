const db = require('../../../models/Db')
const {webContentsSend, setCookies} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')
const {ipcRenderer} = require('electron')
// ===================================================================================================
// Create User
// ===================================================================================================
module.cuser = {
    cuser: global.share.ipcMain.on('userCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new user to db
            check = await db().sequelize.models.User.add(args)
            if (check[0]) {
                if (args.login === true) {
                    // SET COOKIES for login to Dashboard after first login
                    setCookies(args)
                }
                
                webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

                verify = true

            } else {
                verify = false
                return webContentsSend('error', {
                    errorTitle: message.title('create','کاربر'),
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
}

// ===================================================================================================
// DELETE USER
// ===================================================================================================
module.duser = {
    duser: global.share.ipcMain.on('userDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.User.delete(args)
            if (check[0]) {

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

// ===================================================================================================
// UPDATEING USER INFO
// ===================================================================================================
module.uuser = {
    uuser: global.share.ipcMain.on('userUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.User.update(args)

            if (check[0]) {
                // process successfully done
                webContentsSend('responseUserUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'کاربر'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'کاربر'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ USER INFO
// ===================================================================================================
module.ruser = {
    ruser: global.share.ipcMain.on('getUserInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.User.show(args)
            if (check[0]) {
                return webContentsSend('responseGetUserInfo', check[1])
            } else {
                return webContentsSend('normalNot', {
                    title: '',
                    message: message.notFound,
                    contactAdmin: false,
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}

// ===================================================================================================
// CHECK IF MANAGER EXISTS
// ===================================================================================================
module.muser = {
    muser: global.share.ipcMain.on('managerExists', async (e, args) => {
        try {
            let hasManger = db().sequelize.models.User.userTypeExists('manager').then(res => {
                return webContentsSend('responseManagerExists', res)
                })
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}

// ===================================================================================================
// Change User Color
// ===================================================================================================
module.coloruser = {
    coloruser: global.share.ipcMain.on('changeUserColor', async (e, args) => {
        try {
            const check = await db().sequelize.models.User.updateUserColor(args)

            if (check[0]) {
                // process successfully done
                let ses = global.share.session.defaultSession.cookies
                let cookie = {url: 'https://zanest.io', name: 'userColor', value: args.userColor}
                ses.set(cookie)
                webContentsSend('responseUserColor', args.userColor)
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: 'خطا در تغییر رنگ',
                    message: 'تغییر رنگ در دیتابیس با موفقیت انجام نشد',
                    contactAdmin: true,
                })
            }
        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'رنگ'),
                message: err,
                contactAdmin: true
            })
        }
    })
}