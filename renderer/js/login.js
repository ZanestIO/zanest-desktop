const {ipcRenderer} = require('electron')
var Vue = require('vue/dist/vue.min')
const {errorNot} = require("./notification");

// getting page elements
const loginForm = document.querySelector('.login-box')
const loginUsername = document.querySelector('#login-username')
const loginPass = document.querySelector('#login-pass')
const loginButton = document.querySelector('#login-button')


// creating Vue components
let errors = {
    usernameErr: new Vue({
        el: '#error1',
        data: {
            error: ''
        }
    }),
    passwordErr: new Vue({
        el: '#error2',
        data: {
            error: ''
        }
    })
}

// adding eventHandler for clicking and hitting enter
loginButton.addEventListener('click', async e => {
    sendLoginInfo()
})
loginForm.addEventListener('keyup', async e => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter')
        sendLoginInfo()
})

// ===================================================================================================
// Sending User Login Information Happens Here
function sendLoginInfo() {
    let username = loginUsername.value
    let password = loginPass.value
    let formValid = true

    // removing error indicators when submit is fired
    for (let [key, value] of Object.entries(errors)) {
        value.error = ''
    }

    // username and password validation
    if (!username) {
        errors.usernameErr.error = "نام کاربری نمی تواند خالی باشد"
        formValid = false
    }
    if (!password) {
        errors.passwordErr.error = "رمز عبور نمی تواند خالی باشد"
        formValid = false
    } else if (password.length < 8) {
        errors.passwordErr.error = "رمزعبور شما کمتر از 8 کاراکتر نیست"
        formValid = false
    }

    let send = ipcRenderer.send;
    if (formValid) {
        loginButton.innerHTML = '<i class="fas fa-circle-notch fa-spin text-lg"></i>'
        send('userAuth', {username, password})
    }

}

// ===================================================================================================
// getting response of user authentication from main
ipcRenderer.on(`userAuthError`, (e, args) => {
    loginButton.innerHTML = 'ورود به پنل'
    if (args.userName) {
        errors.usernameErr.error = args.userName
    } else if (args.password) {
        errors.passwordErr.error = args.password
    }
})


// ===================================================================================================
// showing db error if happening
// listens for db errors
ipcRenderer.on('dbError', (e, args) => {
    errorNot("خطای پایگاه داده", args.error, true)
})