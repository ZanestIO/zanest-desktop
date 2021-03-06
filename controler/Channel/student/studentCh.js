const db = require('./../../../models/Db')
const {webContentsSend, setLoadFile} = require('./../../../main')
const {log} = require('./../../../logger')
const message = require('./../../massege')

// ===================================================================================================
// ADDING STUDENT 
// ===================================================================================================
module.cstd = {
    cstd: global.share.ipcMain.on('studentCreation', async (e, args) => {

        try {
            const check = await db().sequelize.models.Student.add(args)
            
            if (check[0]) {
                // show success notification
                sendStudentBulk(10, 1)
                
                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })
    
            } else {
                // show fail notification
                return webContentsSend('errorNot', {
                    title: message.title('create', 'زبان اموز'),
                    message: check[1],
                    contactAdmin: true
                })
            }
    
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('create', 'زبان اموز'),
                message: err,
                contactAdmin: true
            })
        }
    })
}

// ===================================================================================================
// UPDATEING STUDENT INFO 
// ===================================================================================================
    
module.ustd = {
    ustd: global.share.ipcMain.on('studentUpdate', async(e, args) => {
        try {
            const check = await db().sequelize.models.Student.updateStd(args)
    
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
                    title: message.title('update', 'زبان اموز'),
                    message: check[1],
                    contactAdmin: true
                })
            }
    
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('update', 'زبان اموز'),
                message: err,
                contactAdmin: true
            })
        }
    })
    
}

// ===================================================================================================
// DELETE STUDENT 
// ===================================================================================================
    
module.dstd = {
    dstd: global.share.ipcMain.on('studentDeletion', async(e,args) => {
        try {
    
            let check = await db().sequelize.models.Student.deleteStd(args)
            if (check[0]) {

                await setLoadFile('./renderer/students.html');

                return webContentsSend('successNot', {
                    title: '',
                    message: check[1],
                    contactAdmin: false
                })

            } else {
                // process failed
                return webContentsSend('errorNot', {
                    title: message.title('delete', 'زبان آموز'),
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            log.record('error', err +":in:"+ __filename)
            return webContentsSend('errorNot', {
                title: message.title('delete', 'زبان آموز'),
                message: err,
                contactAdmin: true
            })
        }
    })
}

// ===================================================================================================
// READ STUDENT INFO
// ===================================================================================================
module.rstd = {
    rstd: global.share.ipcMain.on('readStudent', (e, args) => {
        try {
            const check = db().sequelize.models.Student.show(args)
            if (check[0])
                webContentsSend('responseStudentGetBulk', check[1])
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

async function sendStudentBulk(number = 10, offset = 1) {
    let students = await db().sequelize.models.Student.getStudents(number, offset);
    webContentsSend('responseStudentGetBulk', {students: students})

}