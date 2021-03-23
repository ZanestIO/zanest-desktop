const {ipcRenderer} = require('electron')
const Vue = require('vue')
const notListener = require('./notListener');
// setting up notification listeners
notListener()

loadingIcon = '<i class="fas fa-circle-notch fa-spin text-lg"></i>'

const signupBox = {
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
            progress: {
                seen: false,
                width: 'w-1/4'
            },
            password: {
                value: ''
            },
            passwordRepeat: {
                value: '',
                err: false
            },
            passwordRepeatErr: {
                seen: false,
                text: ''
            },
            submitButton: {
                disabled: false,
                text: 'ایجاد حساب کاربری'
            }
        }
    },
    methods: {
        processUsername() {
            let regex = new RegExp('^[A-Za-z0-9_-]*$')
            if (!regex.test(this.username.value)) {
                this.username.err = true
                this.usernameErr.seen = true
                this.usernameErr.text = "کاراکتر غیر مجاز"
            } else {
                this.username.err = false
                this.usernameErr.seen = false
            }
        }, // process username
        processPassword() {
            let count = 1
            if (this.password.value.length >= 8) {
                count = 2
                let smallLetters = new RegExp('[a-z]')
                let capitalLetters = new RegExp('[A-Z]')
                let numbers = new RegExp('[0-9]')
                let symbols = new RegExp('[-!#$%^&*()_+|~=`{}\\[\\]:";\'<>?,.\\/]')

                if (capitalLetters.test(this.password.value) || symbols.test(this.password.value)) {
                    count++
                }

                if (numbers.test(this.password.value) && smallLetters.test(this.password.value)) {
                    count++
                }
            }

            this.progress.seen = true
            switch (count) {
                case 1:
                    this.progress.width = 'w-1/4'
                    break
                case 2:
                    this.progress.width = 'w-1/2'
                    break
                case 3:
                    this.progress.width = 'w-3/4'
                    break
                case 4:
                    this.progress.width = 'w-full'

            }
        }, // process password
        processPassRep() {
            if (this.password.value !== this.passwordRepeat.value) {
                this.passwordRepeat.err = true
                this.passwordRepeatErr.seen = true
                this.passwordRepeatErr.text = 'رمز عبور و تکرار آن یکسان نیستند'
            } else {
                this.passwordRepeat.err = false
                this.passwordRepeatErr.seen = false
            }
        }, // /processPassRep
        submitForm() {
            let fail = false
            if (this.username.err || this.passwordRepeat.err)
                fail = true
            // check for empty values

            if (!this.username.err) {
                if (this.username.value === '') {
                    this.username.err = true
                    this.usernameErr.seen = true
                    this.usernameErr.text = "نام کاربری نمی تواند خالی باشد"
                    fail = true
                }
            }
            if (this.password.value === '') {
                this.passwordRepeatErr.seen = true
                this.passwordRepeatErr.text = "رمز عبور نمی تواند خالی باشد"
                fail = true
            } else if (this.password.value.length < 8) {
                fail = true
                this.passwordRepeatErr.seen = true
                this.passwordRepeatErr.text = "رمز عبور نباید کمتر از 8 کاراکتر باشد"
            }

            // if there is no error send request
            if (!fail) {
                this.submitButton.text = loadingIcon
                ipcRenderer.send('createUser', {
                    fullname: null,
                    username: this.username.value,
                    password: this.password.value,
                    userType: 'manager',
                    birthDate: null,
                    phoneNumber: null
                })
            }
        }
    }
}
Vue.createApp(signupBox).mount('#signin-box')


ipcRenderer.on('createUserResponse', args => {
    // if user is created
    if (args.status) {
        // display to user and then go to next page
        signupBox.submitButton.text =
            `
            <span class="text-green-500">
            حساب کاربری ایجاد شد
</span>
            `
        setTimeout(()=> {
            ipcRenderer.send('load', {page: 'dashboard'})
        }, 500)

    } else {
        signupBox.submitButton.text="ایجاد حساب کاربری"
    }
})

// validate inputs in