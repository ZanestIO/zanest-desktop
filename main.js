const {app, BrowserWindow, ipcMain, session, ipcRenderer, webContents} = require("electron");
const db = require('./models/Db')

// ==================================================================================
// INITIALIZING DATABASE
// ==================================================================================
db().init()

// ================================================================================
// Main Window Creation
// ================================================================================
let mainWindow

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
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });

    // removing default menus
    // mainWindow.removeMenu()


    let hasManger = db().sequelize.models.User.userTypeExists('manager').then(res => {
        if (!res) {
            mainWindow.loadFile('renderer/firstLogin.html')
        } else {
            mainWindow.loadFile('renderer/login.html')
        }

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.show()
        })
    })

    //UnhandledPromiseRejectionWarning
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


//
global.share = { ipcMain ,session} 


// setter function for loading file to mainWindow
module.exports.setLoadFile = async (path) => {
    await mainWindow.loadFile(path)
}

// setter function of mainWindow event
module.exports.webContentsSend = async (value, objects) => {
    await mainWindow.webContents.send(value, objects)
}

module.exports.setCookies = async (loginSt) => {
    setCookie(loginSt)
}

// import all listener 
require('./controler/mainListener') 
