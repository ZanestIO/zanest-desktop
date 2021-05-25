const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')
// ===================================================================================================
// Create timeSlice
// ===================================================================================================
module.ctime = {
    ctime: global.share.ipcMain.on('timeSliceCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new TimeSlice to db
            check = await db().sequelize.models.TimeSlice.add(args)
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
                    title: 'خطا در ' + message.title('create','بازه زمانی'),
                    message: check[1],
                    contactAdmin: false
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            verify = false
        }
        // send Response
        webContentsSend('responseTimeSliceCreation', verify)
    }),
}

// ===================================================================================================
// DELETE timeSlice
// ===================================================================================================
module.dtime = {
    dtime: global.share.ipcMain.on('timeSliceDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.TimeSlice.delete(args)
            if (check[0]) {

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'بازه زمانی'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'بازه زمانی'),
                message: err,
                contactAdmin: true
            })
        }
    }),
}


// ===================================================================================================
// UPDATEING timeSlice INFO
// ===================================================================================================
module.utime = {
    utime: global.share.ipcMain.on('timeSliceUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.TimeSlice.update(args)

            if (check[0]) {
                // process successfully done
                webContentsSend('responseTimeSliceUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'بازه زمانی'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'بازه زمانی'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ TimeSlice INFO
// ===================================================================================================
module.rtime = {
    rtime: global.share.ipcMain.on('getTimeSliceInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.TimeSlice.show(args)
            if (check[0]) {
                return webContentsSend('responseGetTimeSliceInfo', check[1])
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
