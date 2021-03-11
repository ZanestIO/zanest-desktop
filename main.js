const {app, BrowserWindow, ipcMain} = require("electron")
const base = require('./models/base')
const authenticateUser = require('./userAuth')

// ================================================================================
// Main Window Creation
// ================================================================================
let mainWindow;
let sequelize;

// Electron `app` is ready
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100, height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('renderer/login.html')

    mainWindow.webContents.openDevTools({mode:"undocked"})
    mainWindow.on('closed',  () => {
        mainWindow = null
    })
}

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
// Db Connection Handler
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


ipcMain.on('userAuth', async (e, args) => {
    let loggedIn = false
    if (sequelize) {
        loggedIn = await authenticateUser(args.username, args.password, sequelize)
    }
    e.sender.send('userAuthResponse', loggedIn)
})

