const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// Create class 
// ===================================================================================================
module.cclss = {
    cclss: global.share.ipcMain.on('classCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new Class to db
            check = await db().sequelize.models.Class.add(args)
            if (check[0]) {

                webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

                verify = true

            } else {
                verify = false
                return webContentsSend('errorNot', {
                    title: 'خطا در ' + message.title('create','کلاس'),
                    message: check[1],
                    contactAdmin: false
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            verify = false
        }
        // send Response
        webContentsSend('responseClassCreation', verify)
    }),
}

// ===================================================================================================
// DELETE class
// ===================================================================================================
module.dclss = {
    dclss: global.share.ipcMain.on('classDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.Class.delete(args)
            if (check[0]) {

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'کلاس فیزیکی'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'کلاس فیزیکی'),
                message: err,
                contactAdmin: true
            })
        }
    }),
}


// ===================================================================================================
// UPDATEING class
// ===================================================================================================
module.uclss = {
    uclss: global.share.ipcMain.on('classUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.Class.update(args)

            if (check[0]) {
                // process successfully done
                webContentsSend('responseClassUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'کلاس'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'کلاس'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ Class 
// ===================================================================================================
module.rclss = {
    rclss: global.share.ipcMain.on('getClassInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.Class.show(args)
            if (check[0]) {
                return webContentsSend('responseGetClassInfo', check[1])
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
