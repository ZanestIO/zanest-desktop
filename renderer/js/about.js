const {ipcRenderer} = require('electron')

ipcRenderer.send('managerExists')
ipcRenderer.on('responseManagerExists', (e, args) => {
    const backLink = document.querySelector('#back-link')
    if (args) {
        backLink.setAttribute('href', 'login.html')
    } else {
        backLink.setAttribute('href', 'firstLogin.html')
    }
})