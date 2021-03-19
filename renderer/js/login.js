const {ipcRenderer} = require('electron')
var Vue = require('vue/dist/vue.min')
const notListener = require('./notListener');
// setting up notification listeners
notListener()

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
            error: '',
            seen: false
        }
    }),
    passwordErr: new Vue({
        el: '#error2',
        data: {
            error: '',
            seen: false,
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

    // removing class fail
    loginUsername.classList.remove('fail')
    loginPass.classList.remove('fail')

    // removing error indicators when submit is fired
    for (let [key, value] of Object.entries(errors)) {
        value.error = ''
        value.seen = false
    }

    // username and password validation
    if (!username) {
        loginUsername.classList.add('fail')
        errors.usernameErr.error = "نام کاربری نمی تواند خالی باشد"
        errors.usernameErr.seen = true
        formValid = false
    }
    if (!password) {
        loginPass.classList.add('fail')
        errors.passwordErr.error = "رمز عبور نمی تواند خالی باشد"
        errors.passwordErr.seen = true
        formValid = false
    } else if (password.length < 8) {
        loginPass.classList.add('fail')
        errors.passwordErr.error = "رمزعبور شما کمتر از 8 کاراکتر نیست"
        errors.passwordErr.seen = true
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
        loginUsername.classList.add('fail')
        errors.usernameErr.error = args.userName
        errors.usernameErr.seen = true

    } else if (args.password) {
        loginPass.classList.add('fail')
        errors.passwordErr.error = args.password
        errors.passwordErr.seen = true

    }
})


// ===================================================================================================