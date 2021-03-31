const {ipcRenderer} = require('electron')
module.exports = app => {
    // ==================================================================================
    // listen for db errors
    ipcRenderer.on('dbError', (e, args) => {
        app.notif.seen = true
        app.notif.type = 'error'
        app.notif.title = 'خطای پایگاه داده'
        app.notif.body = args.err
        app.notif.contactAdmin = true

    })

    // ==================================================================================
    // common errors
    ipcRenderer.on('errorNot', (e, args) => {
        app.notif.seen = true
        app.notif.type = 'error'
        app.notif.title = args.title
        app.notif.body = args.message
        app.notif.contactAdmin = args.contactAdmin
    })

    // ==================================================================================
    // normal information notifications
    ipcRenderer.on('normalNot', (e, args) => {
        app.notif.seen = true
        app.notif.type = 'normal'
        app.notif.title = args.title
        app.notif.body = args.message
        app.notif.contactAdmin = args.contactAdmin
    })

    // ==================================================================================
    // reinforce notifications
    ipcRenderer.on('successNot', (e, args) => {
        app.notif.seen = true
        app.notif.type = 'success'
        app.notif.title = args.title
        app.notif.body = args.message
        app.notif.contactAdmin = args.contactAdmin
        setTimeout(() => {
            app.notif.seen = false
        }, 2000)
    })
}