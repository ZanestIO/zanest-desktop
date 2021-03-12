const {ipcRenderer} = require('electron')
const fullNameHolder = document.querySelector('#fullNameHolder')
const userTypeHolder = document.querySelector('#userTypeHolder')
const logout = document.querySelector('#logout')

ipcRenderer.send('requestUserSession')

ipcRenderer.on('responseUserSession', (event, args) => {
    let userType
    switch (args.userType) {
        case "admin":
            userType = 'ادمین'
            break
        case "manager":
            userType = 'مدیر'
            break
        case "staff":
            userType = 'کارمند'
            break
    }
    fullNameHolder.innerText = args.fullName
    userTypeHolder.innerText = userType
})

// listen for db errors
ipcRenderer.on('dbError', (e, args) => {
    errorNot(args.error)
})

logout.addEventListener('click', e => {
    ipcRenderer.send('logout')
})