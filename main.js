const {compareSync} = require("bcrypt");
const {app, BrowserWindow, ipcMain, session, ipcRenderer} = require("electron")
const db = require('./models/Db')

// ==================================================================================
// INITIALIZING DATABASE
// ==================================================================================
db().init()

// ================================================================================
// Main Window Creation
// ================================================================================
let mainWindow;

// Electron `app` is ready
/**
 * a function to create main window and
 * checks if this is the first time
 * we are using the app
 */
function createWindow() {

    // windows attributes
    mainWindow = new BrowserWindow({
        width: 1300, height: 800,
        minHeight: 500, minWidth: 1000,
        show: false,
        icon: './renderer/media/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // removing default menus
    // mainWindow.removeMenu()


    let hasManger = db().sequelize.models.User.userTypeExists('manager').then(res => {
        if (!res) {
            mainWindow.loadFile('renderer/students.html')
        } else {
            mainWindow.loadFile('renderer/students.html')
        }

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.show()
        })
    })

    UnhandledPromiseRejectionWarning
    // mainWindow.webContents.openDevTools({mode:"undocked"})
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// when the app is ready
app.on('ready', async () => {
    createWindow()
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

// ================================================================================
// requesting user Authentication
// ================================================================================
ipcMain.on('userAuth', async (e, args) => {
    let loggedIn = await db().sequelize.models.User.login(args.username, args.password)

    if (loggedIn[0]) {
        //setting cookies
        await setCookie(loggedIn[1])
        await mainWindow.loadFile('./renderer/dashboard.html')

    } else {
        // return error log
        e.sender.send('userAuthError', loggedIn[1])
    }

})

// ===================================================================================================
// requesting the user information
// ===================================================================================================
ipcMain.on('requestUserSession', async (e, args) => {
    let ses = session.defaultSession.cookies
    arguments = {}
    ses.get({url: 'https://zanest.io', name: 'userId'}).then(cookie => {
        arguments.userId = cookie[0].value
    }).catch(err => {
        console.log("ERROR IN SETTING COOKIE => " + err.msg)
    })

    ses.get({url: 'https://zanest.io', name: 'userName'}).then(cookie => {
        arguments.userName = cookie[0].value
    }).catch(err => {
        console.log("ERROR IN SETTING COOKIE => " + err.msg)
    })

    ses.get({url: 'https://zanest.io', name: 'userType'}).then(cookie => {
        arguments.userType = cookie[0].value
    }).catch(err => {
        console.log("ERROR IN SETTING COOKIE => " + err.msg)
    })

    ses.get({url: 'https://zanest.io', name: 'fullName'}).then(cookie => {
        arguments.fullName = cookie[0].value
    }).catch(err => {
        console.log("ERROR IN SETTING COOKIE => " + err.msg)
    })

    ses.get({}).then((cookies) => {
        e.sender.send('responseUserSession', arguments)
    }).catch(err => {
        console.log("ERROR IN SETTING COOKIE => " + err.msg)
    })

})

// ===================================================================================================
// LOGOUT
// ===================================================================================================
ipcMain.on('logout', (e, args) => {
    session.defaultSession.clearStorageData()
    mainWindow.loadFile('./renderer/login.html')
})

// ===================================================================================================
// Create User
// ===================================================================================================
ipcMain.on('userCreation', async (E, args) => {
    let verify
    let check
    try {
        // add new user to db
        check = await db().sequelize.models.User.add(args)
        if (check[0]) {
            if (args.login === true) {
                // login to Dashboard
                setCookie(args)
            }
            verify = true
        } else {
            verify = false
            return mainWindow.webContents.send('error', {
                errorTitle: 'خطا در ایجاد حساب کاربری',
                errorMessage: check[1],
                contactAdmin: 'لطفا نام کاربری دیگری را امتحان کنید'
            })
        }
    } catch (err) {
        console.log(`Error occurred: ${err}`)
        verify = false
    }
    // send Response
    E.sender.send('responseUserCreation', verify)
})

// ===================================================================================================
// load channel response
// ===================================================================================================
ipcMain.on('load', (e, args) => {

    // ==================================================================================
    // holds the last page for a reference
    let lastPage = {url: 'https://zanest.io', name: 'lastPage', value: "./renderer/" + args.currentPage + ".html"}
    session.defaultSession.cookies.set(lastPage)

    let verify = true
    let path = "./renderer/" + args.page + ".html"

    // ==================================================================================
    // if user cookie is staff just allow to access the some limited page.
    session.defaultSession.cookies.get({url: 'http://zanest.io'})
        .then( async(cookies) => {

            if (cookies) {
                // get userType
                let value
                cookies.forEach(node => {
                    if (node.name === 'userType') {
                        value = node.value
                    }
                })
                console.log(value + " request for " + path)


                if (value === 'staff') {
                    switch (args.page) {
                        case "firstLogin":
                            path = "./renderer/404.html"
                            break
                        case "createStudent":
                            path = "./renderer/404.html"
                            break
                    }
                }
            } else {
                path = "./renderer/404.html"
            }

            await mainWindow.loadFile(path)

            if (path !== "./renderer/404.html" ) {
                console.log(" start response Student ================================" + args.id)
                if (args.id) {
                    try {
                        const student = await db().sequelize.models.Student.show(args.id)

                        if (student[0]) {
                            console.log(student[1])
                            mainWindow.webContents.send('getInfo', student[1])
                        } else {
                            console.log(student[1])
                            mainWindow.webContents.send('errorNot', {
                                title: "خطای بازیابی",
                                message: "زبان آموز مورد نظر وجود ندارد"
                            })
                        }
                    } catch (err) {
                        console.log(err + "(( get Student Channel ))")
                    }
                }
            }


        }).catch((error) => {
        console.log(error.msg)
    })
})

// ===================================================================================================
// Cookies Function
// ===================================================================================================
/**
 * a function to set cookies after
 * @param loggedInStatus
 * @returns {Promise<void>} this promise contains a boolean and a message
 */
// TODO complete this explanation
async function setCookie(loggedInStatus) {
    // setting up cookies

    let cookieid = {url: 'https://zanest.io', name: 'userId', value: `${loggedInStatus.id}`}
    let cookie2 = {url: 'https://zanest.io', name: 'userName', value: loggedInStatus.userName}
    let cookie3 = {url: 'https://zanest.io', name: 'fullName', value: loggedInStatus.fullName}
    let cookie4 = {url: 'https://zanest.io', name: 'userType', value: loggedInStatus.userType}

    await session.defaultSession.cookies.set(cookieid)
    await session.defaultSession.cookies.set(cookie2)
    await session.defaultSession.cookies.set(cookie3)
    await session.defaultSession.cookies.set(cookie4)
}

/* 
    STUDENT CHANNELS
*/

// ===================================================================================================
// ADDING STUDENT 
// ===================================================================================================

ipcMain.on('studentCreation', async (e, args) => {
    console.log(args)
    try {
        const check = await db().sequelize.models.Student.add(args)
        if (check[0]) {
            // show success notification
            sendStudentBulk(10, 1)

            return mainWindow.webContents.send('successNot', {
                title: '',
                message: check[1],
                contactAdmin: false
            })


        } else {
            // show fail notification
            return mainWindow.webContents.send('errorNot', {
                title: 'خطا در ایجاد زبان آموز جدید',
                message: check[1],
                contactAdmin: true
            })
        }

    } catch (err) {
        console.log(err + "(( STUDENT CREATION ))")
        return mainWindow.webContents.send('errorNot', {
            title: 'خطا در ایجاد زبان آموز جدید',
            message: err.msg,
            contactAdmin: true
        })
    }
})

// ===================================================================================================
// UPDATEING STUDENT INFO 
// ===================================================================================================

ipcMain.on('studentUpdate', async(e, args) => {
    try {
        const check = await db().sequelize.models.Student.updateStd(args)

        if (check[0]) {
            // process successfully done
            return mainWindow.webContents.send('successNot', {
                title: '',
                message: check[1],
                contactAdmin: false
            })
        } else {
            // process failed
            return mainWindow.webContents.send('errorNot', {
                title: 'خطا در به روزرسانی اطلاعات',
                message: check[1],
                contactAdmin: true
            })
        }

    } catch (err) {
        console.log(err.msg + "(( STUDENT UPDATE ))")
        return mainWindow.webContents.send('errorNot', {
            title: 'خطا در به روزرسانی اطلاعات',
            message: err.msg,
            contactAdmin: true
        })
    }
})


// ===================================================================================================
// DELETE STUDENT 
// ===================================================================================================

ipcMain.on('studentDeletion', async(e,args) => {
    try {
        console.log(args)
        let check = await db().sequelize.models.Student.deleteStd(args)
        if (check[0]) {
            await mainWindow.loadFile('./renderer/students.html');
            return mainWindow.webContents.send('successNot', {
                title: '',
                message: check[1],
                contactAdmin: false
            })
        } else {
            // process failed

            return mainWindow.webContents.send('errorNot', {
                title: 'خطا در حذف ',
                message: check[1],
                contactAdmin: true
            })
        }
    } catch (err) {
        console.log(err.msg + "(( STUDENT DELETE ))")
        // 

        return mainWindow.webContents.send('errorNot', {
            title: 'خطا در حذف ',
            message: err.msg,
            contactAdmin: true
        })
    }
})


// ===================================================================================================
// READ STUDENT INFO
// ===================================================================================================
// TODO: canvert to send channel
ipcMain.on('readStudent', (e, args) => {
    try {
        const check = db().sequelize.models.Student.show(args)
        if (check[0])
            e.send.sender('responseStudentGetBulk', check[1])
        else
            return mainWindow.webContents.send('normalNot', {
                title: ' ناموفق',
                message: 'نتیجه ای یافت نشد',
                contactAdmin: 'لطفا مجدد سعی نمایید '
            })

    } catch (err) {
        console.log(err + "(( get Student Channel ))")
    }
})


// ==================================================================================
// HANDLING SEARCH RESULT
// ==================================================================================
ipcMain.on('search', async(e, args) => {
    /*
    Searches Are Done By Containment Not Equality
    ToDo: adding type checking in here for search
     */

    let result = []
    if (args.info.sid) {
        result = await db().sequelize.models.Student.search('id', args.info.sid)

    } else if (args.info.name) {
        result = await db().sequelize.models.Student.search('name', args.info.name)
    }


    mainWindow.webContents.send('responseSearch',  result)

})

// ==================================================================================
// GETTING STUDENTS IN BULK FOR STUDENTS TABLE
// ==================================================================================
ipcMain.on("studentGetBulk", async (e, args) => {
    sendStudentBulk(args.number, args.offset)
})

async function sendStudentBulk(number = 10, offset = 1) {
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

    mainWindow.webContents.send('responseStudentGetBulk', {students: students})
}
