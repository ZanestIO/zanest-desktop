
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
            console.log('********************************************************************')
            console.log(cookie[0].value)
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })

        ses.get({}).then((cookies) => {
            e.sender.send('responseUserSession', arguments)
        }).catch(err => {
            log.record('error', err +":in:"+ __filename)
        })
    }),
    setMenuDocked: global.share.ipcMain.on('setMenuDocked', async (e, args) => {
        let ses = global.share.session.defaultSession.cookies

        // set menu type
        let cookie = {url: 'https://zanest.io', name: 'menuDocked', value: args}
        ses.set(cookie)
    })
}