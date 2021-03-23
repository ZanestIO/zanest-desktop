const {errorNot} = require('./notification')
const {ipcRenderer} = require('electron')

module.exports = () => {

    // listen for db errors
    ipcRenderer.on('dbError', (e, args) => {
        errorNot("خطای پایگاه داده", args.error, true)
    })

    ipcRenderer.on('error', (e, args) => {
        errorNot(args.errorTitle, args.errorMessage, args.contactAdmin)
    })
}