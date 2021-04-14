const db = require('./../../../models/Db')
const {webContentsSend, setLoadFile} = require('./../../../main')

// ===================================================================================================
// ADDING STUDENT 
// ===================================================================================================
module.cstd = {
    cstd: global.share.ipcMain.on('studentCreation', async (e, args) => {
        
        console.log(args)

        try {
            const check = await db().sequelize.models.Student.add(args)

            console.log(check[0] + '<.std.>')
            
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
                    title: 'خطا در ایجاد زبان آموز جدید',
                    message: check[1],
                    contactAdmin: true
                })
            }
    
        } catch (err) {
            console.log(err + "(( STUDENT CREATION ))")
            return webContentsSend('errorNot', {
                title: 'خطا در ایجاد زبان آموز جدید',
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
                    title: 'خطا در به روزرسانی اطلاعات',
                    message: check[1],
                    contactAdmin: true
                })
            }
    
        } catch (err) {
            console.log(+ "(( STUDENT UPDATE ))")
            return webContentsSend('errorNot', {
                title: 'خطا در به روزرسانی اطلاعات',
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
            console.log(args)
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
                    title: 'خطا در حذف ',
                    message: check[1],
                    contactAdmin: true
                })
            }
        } catch (err) {
            console.log(err+ "(( STUDENT DELETE ))")
            // 
    
            return webContentsSend('errorNot', {
                title: 'خطا در حذف ',
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
                    title: ' ناموفق',
                    message: 'نتیجه ای یافت نشد',
                    contactAdmin: 'لطفا مجدد سعی نمایید '
                })
    
        } catch (err) {
            console.log(err + "(( get Student Channel ))")
        }
    })
}

// ==================================================================================
// GETTING STUDENTS IN BULK FOR STUDENTS TABLE
// ==================================================================================
module.getBulk = {
    getBulk: global.share.ipcMain.on("studentGetBulk", async (e, args) => {
        await sendStudentBulk(args.number, args.offset, e)
    })
}

async function sendStudentBulk(number = 10, offset = 1, e) {
    let studentsHolder = await db().sequelize.models.Student.getStudents(number, offset);
    let students = [];

    // Todo: Move this to Student > get
    studentsHolder = JSON.parse(studentsHolder);
    studentsHolder.forEach(node => {
        let student = {
            fullName: node.Person.fullName,
            phoneNumber: node.Person.phoneNumber,
            sex: node.Person.sex,
            socialID: node.socialID,
            birthDate: node.Person.birthDate,
            parentNumber: node.parentNumber,
            address: node.Person.address,
            parentsName: node.parentName,
        }
        students.push(student)
    })

    webContentsSend('responseStudentGetBulk', {students: students})
}
