const { compareSync } = require("bcrypt");
const {app, BrowserWindow, ipcMain, session} = require("electron")
const base = require('./models/base')
const add = require('./models/User/add')
const authenticateUser = require('./models/User/userAuth')

// ================================================================================
// Main Window Creation
// ================================================================================
let mainWindow;
let sequelize;

// Electron `app` is ready
function createWindow() {

    // creating user session
    let userSession = session.fromPartition('user')

    // windows attributes
    mainWindow = new BrowserWindow({
        width: 1300, height: 800,
        minHeight: 500, minWidth: 700,
        show: false,
        icon: './renderer/media/favicon.png',
        webPreferences: {
            nodeIntegration: true,
            session: userSession,
        }
    });

    // removing default menus
    mainWindow.removeMenu()

    // loading the login page
    // if login is the first login of User in the system and we don't have any manager in the 
    // Database, application should be load the first login page and alow user to create
    // The Manager.
    let findManager = authenticateUser.userTypeExists('manager')

    if (findManager.username === undefined && findManager.password === undefined){
        mainWindow.loadFile('renderer/firstLogin.html')
    } else {
        mainWindow.loadFile('renderer/login.html')
    }

    // to avoid the white loading screen
    mainWindow.webContents.on('did-finish-load', function () {
        mainWindow.show()
    })

    // mainWindow.webContents.openDevTools({mode:"undocked"})
    mainWindow.on('closed',  () => {
        mainWindow = null
    })
}

// when the app is ready
app.on('ready', () => {

    createWindow()
    dbHandle()
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
// Db Handler & Logging in
// ================================================================================
function dbHandle() {
    mainWindow.webContents.on('did-finish-load', ()=>{
        base.dbInit().then( res => {
            if (res[0] === false) {
                mainWindow.webContents.send('dbError', {error: res[1]})
            } else {
                sequelize = res[1]
            }
        })
    })
}

// ================================================================================
// requesting user Authentication
// ================================================================================
ipcMain.on('userAuth', async (e, args) => {
    let loggedIn = false
    if (sequelize) {
        loggedIn = await authenticateUser.authenticateUser(args.username, args.password, sequelize)
    }

    if (loggedIn[0]) {

        //setting cookies

        // TODO: convert to function 
        setCookie(loggedIn[1])

        mainWindow.loadFile('./renderer/dashboard.html')

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
    ses.get({url: 'https://zanest.io', name: 'userId'}).then( cookie => {
      arguments.userId =   cookie[0].value
    })

    ses.get({url: 'https://zanest.io', name: 'userName'}).then( cookie => {
        arguments.userName =   cookie[0].value
    })

    ses.get({url: 'https://zanest.io', name: 'userType'}).then( cookie => {
        arguments.userType =   cookie[0].value
    })

    ses.get({url: 'https://zanest.io', name: 'fullName'}).then( cookie => {
        arguments.fullName =   cookie[0].value
    })

    ses.get({}).then( (cookies) => {
        e.sender.send('responseUserSession', arguments)
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
ipcMain.on('userCreation', async (e, args) => {


    let verify
    let check
    try {
        //console.log(`${args.username} -----------------`)
        check = await add(args.fullname, args.username, args.password, args.userType, args.birthDate, args.phoneNumber)

        if(check[0]) {
            if ( args.login == true ) {
                // login to Dashboard
                //console.log(`value of login is ${args.login}`)
                setCookie(args)
            }
            //console.log(`success creation ${check[1]}`)
            verify = true
        } else{
            //console.log(`fail of creation`)
            verify = false
            return mainWindow.webContents.send('error', {error: check[1]})
        }
    } catch(err) {
        //console.log(`Error occurred: ${err}`)
        verify = false
    }

    e.sender.send('responseUserCreation', verify)
})

// ===================================================================================================
// load channel response
// ===================================================================================================
ipcMain.on('load', (e, args) => {

    let verify = true // Find User Page Exist and Return a List of Name if args.page have access then return True
    if(verify/*${args.page} Exists */)
        //
        mainWindow.loadFile(`${args.page}`)
    else {
        mainWindow.loadFile(`./renderer/404.html`)
    }
})

// ===================================================================================================
// Cookies Function
// ===================================================================================================
async function setCookie(loggedInStatus) {
    // setting up cookies

    let cookieid = {url: 'https://zanest.io', name:'userId', value: `${loggedInStatus.id}`}
    let cookie2 = {url: 'https://zanest.io', name:'userName', value: loggedInStatus.userName}
    let cookie3 = {url: 'https://zanest.io', name:'fullName', value: loggedInStatus.fullName}
    let cookie4 = {url: 'https://zanest.io', name:'userType', value: loggedInStatus.userType}

    await session.defaultSession.cookies.set(cookieid)
    await session.defaultSession.cookies.set(cookie2)
    await session.defaultSession.cookies.set(cookie3)
    await session.defaultSession.cookies.set(cookie4)
}