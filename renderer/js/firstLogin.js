const {ipcRenderer} = require('electron')
const Vue = require('vue')
const notification = require('./components/notification')
const notListener = require('./notListener');

// main vue element associated with #signup-box
const signupBox = {
    data() {
        return {
            fullname: {
              err: false,
              value: '',
            },
            fullnameErr: {
                seen: false,
                value: ''
            },
            username: {
                // if err is true class input.fail will be active
                err: false,
                value: ''
            },
            usernameErr: {
                seen: false,
                text: ''
            },
            progress: {
                seen: false,
                width: 'w-1/4',
                text: '',
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
                text: 'ایجاد حساب کاربری',
                success: false
            }
        }
    },
    components: {
        notification
    },
    methods: {
        // ==================================================================================
        // process full name
        // ==================================================================================
        processFullname() {
            if (this.fullname.value.length > 2) {
                this.fullname.err = false
                this.fullnameErr.seen = false
            }
        },
        // ==================================================================================
        // process username for valid characters
        // ==================================================================================
        processUsername() {
            let regex = new RegExp('^[A-Za-z0-9_-]*$')

            if (!regex.test(this.username.value)) {
                this.username.err = true
                this.usernameErr.seen = true
                this.usernameErr.text = "کاراکتر غیر مجاز"
            } else {
                // resetting the styles to no error
                this.username.err = false
                this.usernameErr.seen = false
            }
        }, // process username

        // ==================================================================================
        // process the password strength and updating the strength process bar
        // ==================================================================================
        processPassword() {
            // counts the strength of password from 1 to 4
            let strengthPoints = 1

            // if password length is more than 8
            if (this.password.value.length >= 8) {
                strengthPoints = 2
                let smallLetters = new RegExp('[a-z]')
                let capitalLetters = new RegExp('[A-Z]')
                let numbers = new RegExp('[0-9]')
                let symbols = new RegExp('[-!#$%^&*()_+|~=`{}\\[\\]:";\'<>?,.\\/]')

                if (capitalLetters.test(this.password.value) || symbols.test(this.password.value)) {
                    strengthPoints++
                }

                if (numbers.test(this.password.value) && smallLetters.test(this.password.value)) {
                    strengthPoints++
                }
            }

            this.progress.seen = true
            switch (strengthPoints) {
                case 1:
                    // these are tailwind css classes for different widths
                    this.progress.width = 'w-1/4'
                    this.progress.text = 'غیرقابل قبول'
                    break
                case 2:
                    this.progress.width = 'w-1/2'
                    this.progress.text = 'قابل قبول اما ضعیف'
                    break
                case 3:
                    this.progress.width = 'w-3/4'
                    this.progress.text = 'امن'
                    break
                case 4:
                    this.progress.width = 'w-full'
                    this.progress.text = 'بسیار امن'
            }
        }, // process password

        // ==================================================================================
        // check if the password and passwordRepeat are equal
        // ==================================================================================
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

        // ==================================================================================
        // the logic when submitButton is clicked
        // ==================================================================================
        submitForm() {

            // not being able to click the button multiple times if successfull
            if (this.submitButton.success)
                return

            // holds the verification result
            let fail = false
            this.processPassRep()
            if (this.username.err || this.passwordRepeat.err)
                fail = true

            // ==================================================================================
            // check for empty values
            if(this.fullname.value === '') {
                this.fullname.err = true
                this.fullnameErr.seen = true
                this.fullnameErr.text = 'نام نمی تواند کمتر از 3 حرف باشد'
            }

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

            // ==================================================================================
            // if there is no error send request
            if (!fail) {
                this.submitButton.text = '<i class="fas fa-circle-notch fa-spin text-lg"></i>'
                ipcRenderer.send('userCreation', {
                    fullName: this.fullname.value,
                    userName: this.username.value,
                    password: this.password.value,
                    userType: 'manager',
                    birthDate: null,
                    phoneNumber: null,
                    login: true,
                })
            }
        }
    }
}
let app = Vue.createApp(signupBox).mount('#signup-box')

notListener(app)
// ==================================================================================
// listening for the response from server
// ==================================================================================
ipcRenderer.on('responseUserCreation', verify => {
    // if user is created
    if (verify) {
        // display to user and then go to next page
        app.submitButton.text =
            `
            <span class="text-gray-600">
            حساب کاربری ایجاد شد
        </span>
            `
        app.submitButton.success = true
        // _____________________________________________________
        // the timeout is for simulating
        setTimeout(() => {
            ipcRenderer.send('load', {page: 'dashboard', currentPage: 'firstLogin'})
        }, 500)

    } else {
        app.submitButton.text = "ایجاد حساب کاربری"
    }
})