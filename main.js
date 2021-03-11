const {app, BrowserWindow, ipcMain} = require("electron")
let mainWindow;

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

// Electron `app` is ready
app.on('ready', createWindow)


// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

