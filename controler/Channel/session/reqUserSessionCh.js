const {webContentsSend} = require('../../../main')
const {log} = require('./../../../logger')
// ===================================================================================================
// requesting the user information
// ===================================================================================================
module.exports = {
    reqUserSession: global.share.ipcMain.on('requestUserSession', async (e, args) => {
        let ses = global.share.session.defaultSession.cookies

        arguments = {}
        ses.get({url: 'https://zanest.io', name: 'userId'}).then(cookie => {
            arguments.userId = cookie[0].value
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        ses.get({url: 'https://zanest.io', name: 'userName'}).then(cookie => {
            arguments.userName = cookie[0].value
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        ses.get({url: 'https://zanest.io', name: 'userType'}).then(cookie => {
            arguments.userType = cookie[0].value
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        ses.get({url: 'https://zanest.io', name: 'fullName'}).then(cookie => {
            arguments.fullName = cookie[0].value
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        // send menu type
        ses.get({url: 'https://zanest.io', name: 'menuDocked'}).then(cookie => {
            arguments.menuDocked = cookie[0].value

        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        // send user color
        ses.get({url: 'https://zanest.io', name: 'userColor'}).then(cookie => {
            arguments.userColor = cookie[0].value

        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        ses.get({}).then((cookies) => {
            webContentsSend('responseUserSession', arguments)
            webContentsSend('responseUserColor', arguments.userColor)
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })
    }),


    setMenuDocked: global.share.ipcMain.on('setMenuDocked', async (e, args) => {
        let ses = global.share.session.defaultSession.cookies

        // set menu type
        let cookie = {url: 'https://zanest.io', name: 'menuDocked', value: args}
        ses.set(cookie)
    }),


    requestUserColor: global.share.ipcMain.on('requestUserColor', async (e, args) => {
        let ses = global.share.session.defaultSession.cookies

        // send user color
        ses.get({url: 'https://zanest.io', name: 'userColor'}).then(cookie => {
            webContentsSend('responseUserColor', cookie[0].value)
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })
    }),
}