const {session} = require("electron")
// ===================================================================================================
// requesting the user information
// ===================================================================================================
module.exports = {
    reqUserSession: global.share.ipcMain.on('requestUserSession', async (e, args) => {
        let ses = session.defaultSession.cookies

        arguments = {}
        ses.get({url: 'https://zanest.io', name: 'userId'}).then(cookie => {
            arguments.userId = cookie[0].value
        }).catch(err => {
            console.log("ERROR IN SETTING COOKIE => " + err)
        })

        ses.get({url: 'https://zanest.io', name: 'userName'}).then(cookie => {
            arguments.userName = cookie[0].value
        }).catch(err => {
            console.log("ERROR IN SETTING COOKIE => " + err)
        })

        ses.get({url: 'https://zanest.io', name: 'userType'}).then(cookie => {
            arguments.userType = cookie[0].value
        }).catch(err => {
            console.log("ERROR IN SETTING COOKIE => " + err)
        })

        ses.get({url: 'https://zanest.io', name: 'fullName'}).then(cookie => {
            arguments.fullName = cookie[0].value
        }).catch(err => {
            console.log("ERROR IN SETTING COOKIE => " + err)
        })

        ses.get({}).then((cookies) => {
            e.sender.send('responseUserSession', arguments)
        }).catch(err => {
            console.log("ERROR IN SETTING COOKIE => " + err)
        })

    })
}