const {ipcRenderer} = require('electron')
const Vue = require('vue')
const notListener = require('./notListener');
const notification = require('./components/notification')

// main vue element containing all the others
let loginBox = {
    data() {
        return {
            username: {
                err: false,
                value: ''
            },
            usernameErr: {
                seen: false,
                text: ''
            },
            password: {
                err: false,
                value: ''
            },
            passwordErr: {
                seen: false,
                text: ''
            },
            submitButton: {
                text: 'ورود به پنل',
            }
        }
    },
    methods: {
        // ==================================================================================
        // when the submit button is clicked
        // ==================================================================================
        submitForm() {
            let formValid = true

            // ==================================================================================
            // Resetting The Error Properties
            // removing class fail
            this.username.err = false
            this.password.err = false
            // hiding error boxes
            this.usernameErr.seen = false
            this.passwordErr.seen = false

            // ==================================================================================
            // username and password validation
            if (!this.username.value) {
                this.username.err = true
                this.usernameErr.text = "نام کاربری نمی تواند خالی باشد"
                this.usernameErr.seen = true
                formValid = false
            }
            if (!this.password.value) {
                this.password.err = true
                this.passwordErr.seen = true
                this.passwordErr.text = "رمز عبور نمی تواند خالی باشد"
                formValid = false
            }

            // ==================================================================================
            // sending the login info to the server
            let username = this.username.value
            let password = this.password.value
            let send = ipcRenderer.send;
            if (formValid) {
                this.submitButton.text = '<i class="fas fa-circle-notch fa-spin text-lg"></i>'
                send('userAuth', {username, password})
            }
        }
    }
}

let app = Vue.createApp(loginBox).mount('#loginBox')
notListener(app)
// ==================================================================================
// firing submitForm with Enter
document.querySelector('#loginBox').addEventListener('keyup', async e => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter')
        app.submitForm()
})

// ==================================================================================
// // getting response of user authentication from main
// ==================================================================================

ipcRenderer.on(`userAuthError`, (e, args) => {

    app.submitButton.text = 'ورود به پنل'
    if (args.userName) {
        app.username.err = true
        app.usernameErr.text = args.userName
        app.usernameErr.seen = true

    } else if (args.password) {
        app.password.err = true
        app.passwordErr.text = args.password
        app.passwordErr.seen = true

    }
})