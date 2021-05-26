const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// Create class room 
// ===================================================================================================
module.croom = {
    croom: global.share.ipcMain.on('classRoomCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new ClassRoom to db
            check = await db().sequelize.models.ClassRoom.add(args)
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
                    title: 'خطا در ' + message.title('create','کلاس فیزیکی'),
                    message: check[1],
                    contactAdmin: false
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            verify = false
        }
        // send Response
        webContentsSend('responseClassRoomCreation', verify)
    }),
}

// ===================================================================================================
// DELETE class room
// ===================================================================================================
module.droom = {
    droom: global.share.ipcMain.on('classRoomDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.ClassRoom.delete(args)
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
// UPDATEING class room INFO
// ===================================================================================================
module.uroom = {
    uroom: global.share.ipcMain.on('classRoomUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.ClassRoom.update(args)

            if (check[0]) {
                // process successfully done
                webContentsSend('responseClassRoomUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'کلاس فیزیکی'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'کلاس فیزیکی'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ Class Room INFO
// ===================================================================================================
module.rroom = {
    rroom: global.share.ipcMain.on('getClassRoomInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.ClassRoom.show(args)
            if (check[0]) {
                return webContentsSend('responseGetClassRoomInfo', check[1])
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
