const db = require('./../../../models/Db')
const {webContentsSend, setLoadFile} = require('./../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// ADDING TEACHER
// ===================================================================================================
module.ctch = {
    ctch: global.share.ipcMain.on('teacherCreation', async (e, args) => {

        try {
            const check = await db().sequelize.models.Teacher.add(args)

            if (check[0]) {
                // show success notification
                sendTeacherBulk(10, 1)

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // show fail notification
                return webContentsSend('errorNot', {
                    title: message.title('create', 'استاد'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('create', 'استاد'),
                message: err,
                contactAdmin: true
            })
        }
    })
}

// ===================================================================================================
// UPDATEING TEACHER INFO
// ===================================================================================================

module.utch = {
    utch: global.share.ipcMain.on('teacherUpdate', async(e, args) => {
        try {
            const check = await db().sequelize.models.Teacher.updateTch(args)

            if (check[0]) {
                // process successfully done
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('update', 'استاد'),
                    message: check[1],
                    contactAdmin: true
                })
            }

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'استاد'),
                message: err,
                contactAdmin: true
            })
        }
    })

}

// ===================================================================================================
// DELETE TEACHER
// ===================================================================================================

module.dtch = {
    dtch: global.share.ipcMain.on('teacherDeletion', async(e,args) => {
        try {

            let check = await db().sequelize.models.Teacher.deleteTch(args)
            if (check[0]) {

                await setLoadFile('./renderer/teachers.html');

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'استاد'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'استاد'),
                message: err,
                contactAdmin: true
            })
        }
    })
}

// ===================================================================================================
// READ TEACHER INFO
// ===================================================================================================
module.rtch = {
    rtch: global.share.ipcMain.on('readTeacher', (e, args) => {
        try {
            const check = db().sequelize.models.Teacher.show(args)
            if (check[0])
                webContentsSend('responseTeacherGetBulk', check[1])
            else
                return webContentsSend('normalNot', {
                    title: '',
                    message: message.notFound,
                    contactAdmin: false,
                })

        } catch (err) {
            log.record('error', err +":in:"+ __filename)
        }
    })
}

// ==================================================================================
// GETTING TEACHERS IN BULK FOR TEACHERS TABLE
// ==================================================================================
module.getBulk = {
    getBulk: global.share.ipcMain.on("teacherGetBulk", async (e, args) => {
        await sendteacherBulk(args.number, args.offset, e)
    })
}

async function sendTeacherBulk(number = 5, offset = 1) {
    let teachersHolder = await db().sequelize.models.Teacher.getTeachers(number, offset);
    let teachers = [];

    teachersHolder = JSON.parse(teachersHolder);
    teachersHolder.forEach(node => {
        let teacher = {
            socialID: node.socialID,
            credit: node.credit,
            degree: node.degree,
            fullName: node.Person.fullName,
            sex: node.Person.sex,
            phoneNumber: node.Person.phoneNumber,
            birthDate: node.Person.birthDate,
            address: node.Person.address,
        }
        teachers.push(teacher)
    })

    webContentsSend('responseTeacherGetBulk', {teachers: teachers})
}
