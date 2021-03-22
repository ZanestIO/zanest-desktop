const {ipcRenderer} = require('electron')
const Vue = require('vue')
const notListener = require('./notListener');
// setting up notification listeners
notListener()

loadingIcon = '<i class="fas fa-circle-notch fa-spin text-lg"></i>'

const signinBox = {
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
            }
        }
    },
    methods: {
        processUsername() {
            let regex = new RegExp('^[A-Za-z0-9_-]*$')
            if (! regex.test(this.username.value) ) {
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
            if(this.password.value.length >= 8) {
                count = 2
                let smallLetters = new RegExp('[a-z]')
                let capitalLetters = new RegExp('[A-Z]')
                let numbers = new RegExp('[0-9]')
                let symbols = new RegExp('[-!#$%^&*()_+|~=`{}\\[\\]:";\'<>?,.\\/]')

                if(capitalLetters.test(this.password.value) || symbols.test(this.password.value)) {
                    count++
                }

                if(numbers.test(this.password.value) && smallLetters.test(this.password.value)) {
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
            if ( this.password.value !== this.passwordRepeat.value) {
                this.passwordRepeat.err = true
                this.passwordRepeatErr.seen = true
                this.passwordRepeatErr.text = 'رمز عبور و تکرار آن یکسان نیستند'
            } else {
                this.passwordRepeat.err = false
                this.passwordRepeatErr.seen = false
            }
        },
    }
}

Vue.createApp(signinBox).mount('#signin-box')




// validate inputs in