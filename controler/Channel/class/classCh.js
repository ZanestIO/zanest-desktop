const db = require('../../../models/Db')
const {webContentsSend, setLoadFile} = require('../../../main')
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
                await setLoadFile('./renderer/classes.html');
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
            await log.record('error', err +":in:"+ __filename)
        }
    })
}

// ==================================================================================
// Add Students To Class
// ==================================================================================
module.addStdToClass = {
    addStdToClass: global.share.ipcMain.on('addStudentToClass', async (e, args) => {
        try {
            const check = await db().sequelize.models.Class.addToClass(args)
            if (check[0]) {
                return webContentsSend('successNot', {
                    title: '',
                    message: 'زبان آموز به کلاس اضافه شد',
                    contactAdmin: false,
                })
            } else {
                return webContentsSend('errorNot', {
                    title: 'خطا در افزودن زبان آموز',
                    message:'sqlite error in adding std',
                    contactAdmin: true,
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}

// ==================================================================================
// Delete Students From Class
// ==================================================================================
module.deleteStdFromClass = {
    deleteStdFromClass: global.share.ipcMain.on('deleteStudentFromClass', async (e, args) => {
        try {
            const check = await db().sequelize.models.Class.removeFromClass(args)
            if (check[0]) {
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false,
                })
            } else {
                return webContentsSend('errorNot', {
                    title: 'خطا در حذف زبان آموز',
                    message: 'sqlite error in adding std',
                    contactAdmin: true,
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}

// ==================================================================================
// Delete Students From Class
// ==================================================================================
module.getStudentsInClass = {
    getStudentsInClass: global.share.ipcMain.on('getStudentsInClass', async (e, args) => {
        try {
            const check = await db().sequelize.models.Class.getAllStds(args)
            if (check[0]) {
                return webContentsSend('responseGetStudentsInClass', check[1])
            } else {
                return webContentsSend('errorNot', {
                    title: "خطا در بارگذاری زبان آموزان",
                    message: 'sqlite error in loading all students',
                    contactAdmin: true,
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}


