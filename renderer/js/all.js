const {ipcRenderer} = require('electron')
const secondary_menu = require('./components/secondary_menu')
const Vue = require('vue')

const fullNameHolder = document.querySelector('#fullNameHolder')
const userTypeHolder = document.querySelector('#userTypeHolder')
const logout = document.querySelector('#logout')
// const notListener = require('./notListener');
// setting up notification listeners
// notListener()

// TODO create component for top nav and add it to menu holder
// ===================================================================================================
// send request for logged in user information
ipcRenderer.send('requestUserSession')

// ===================================================================================================
// processing logged in user info
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

// ===================================================================================================
// adding click to logout
// ===================================================================================================
logout.addEventListener('click', e => {
    ipcRenderer.send('logout')
})



// ==================================================================================
// MENU COMPONENT IN EVERY PAGE
// ==================================================================================
let menuComponent = {
    data() {
        return{
            seen: false
        }
    },
    components: {
        secondary_menu,
    },
    methods: {
        requestPage(pageName) {
            ipcRenderer.send('load', {page: pageName})
        }
    }
}

let menuApp = Vue.createApp(menuComponent).mount('#menu-holder')
