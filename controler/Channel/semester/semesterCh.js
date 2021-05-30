const db = require('../../../models/Db')
const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')
// ===================================================================================================
// Create Semester
// ===================================================================================================
module.csem = {
    csem: global.share.ipcMain.on('semesterCreation', async (E, args) => {
        let verify
        let check
        try {
            // add new Semester to db
            check = await db().sequelize.models.Semester.add(args)
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
                    title: 'خطا در ' + message.title('create','ترم تحصیلی'),
                    message: check[1],
                    contactAdmin: false
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            verify = false
        }
        // send Response
        webContentsSend('responseSemesterCreation', verify)
    }),
}

// ===================================================================================================
// DELETE Semester
// ===================================================================================================
module.dsem = {
    dsem: global.share.ipcMain.on('semesterDeletion', async(e, args) => {
        try {
            let check = await db().sequelize.models.Semester.delete(args)
            if (check[0]) {

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'ترم تحصیلی'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'ترم تحصیلی'),
                message: err,
                contactAdmin: true
            })
        }
    }),
}


// ===================================================================================================
// UPDATEING Semester INFO
// ===================================================================================================
module.usem = {
    usem: global.share.ipcMain.on('semesterUpdate', async (e, args) => {
        try {
            const check = await db().sequelize.models.Semester.update(args)

            if (check[0]) {
                // process successfully done
                webContentsSend('responseSemesterUpdate', true)
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'ترم تحصیلی'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err + ":in:" + __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'ترم تحصیلی'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// READ Semester INFO
// ===================================================================================================
module.rsem = {
    rsem: global.share.ipcMain.on('getSemesterInfo', async (e, args) => {
        try {
            const check = await db().sequelize.models.Semester.show(args)
            if (check[0]) {
                return webContentsSend('responseGetSemesterInfo', check[1])
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
// READ Semester INFO
// ===================================================================================================
module.curtsem = {
    curtsem: global.share.ipcMain.on('getCurrentSemester', async (e) => {
        try {
            const flag = await db().sequelize.models.Semester.current()
            
            if ( flag != null ){
                const currentSem = await db().sequelize.models.Semester.get(flag)
                webContentsSend('responseCurrentSemester', {currentSem: currentSem})
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}