const {setLoadFile} = require('./../../../main')

// ===================================================================================================
// LOGOUT
// ===================================================================================================
module.exports = {
    logout: global.share.ipcMain.on('logout', (e, args) => {
        global.share.session.defaultSession.clearStorageData()
        setLoadFile('./renderer/login.html')
    })
}