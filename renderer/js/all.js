// shared js file between all pages
const {ipcRenderer} = require('electron')

// listens for db errors
ipcRenderer.on('dbError', (e, args) => {
    alert(args.error)
})
