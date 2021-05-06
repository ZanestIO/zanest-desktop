const overlay = require("./overlay")
const {ipcRenderer} = require('electron')
const Vue = require('vue')
const {
    resetError,
    isEmpty,
    exact,
    smallerThan,
    biggerThan,
    isNumber,
    isLetter,
    longerThan,
    shorterThan
} = require('./../utils/validation')

module.exports = {
    data() {
        return {
            valid: false,
            fullname: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            username: {
                // if err is true class input.fail will be active
                err: false,
                value: '',
                errMsg: '',
                success: false,
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
            phone: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            birthDate: {
                year: {
                    err: false,
                    value: '',
                    success: false,
                    errMsg: ''
                },
                day: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
                month: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
            },
        }
    },
    created() {
        alert(this.loggedInUser.value)
        ipcRenderer.send('getUserInfo', {username: this.loggedInUser.value})

        ipcRenderer.on('responseGetUserInfo', (e, args) => {
            this.username.value = args.username
            this.fullname.value = args.fullName
            this.password.value = args.password
            this.passwordRepeat.value = args.password
            this.phone = args.phone

            // handling the date
            let date = args.birthDate.split('/')
            this.birthDate.year.value = date[0]
            this.birthDate.month.value = date[1]
            this.birthDate.day.value = date[2]
        })
    },
    inject: ['loggedInUser'],
    emit: ['cancel-user-edit'],
    components: {
        overlay,
    },
    methods: {
        // ==================================================================================
        // process full name
        // ==================================================================================
        processFullname() {
            let input = this.fullname
            resetError(input)

            if (longerThan(input, 3)) {
                this.valid = false
            } else if (isLetter(input)) {
                this.valid = false
            } else {
                input.success = true
            }
        },
        // ==================================================================================
        // process username for valid characters
        // ==================================================================================
        processUsername() {
            let regex = new RegExp('^[A-Za-z0-9_-]*$')
            let input = this.username
            resetError(input)

            if (!regex.test(this.username.value)) {
                this.username.err = true
                this.username.errMsg = "کاراکتر غیر مجاز"
                this.valid = false
            } else if (isEmpty(input)) {
                this.valid = false
            } else {
                // resetting the styles to no error
                this.username.err = false
                this.username.success = true
            }
        }, // process username


        processBirthDay() {
            let input = this.birthDate.day
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 31)) {
                this.valid = false
            } else {
                input.success = true
            }
        },

        processPhone() {
            let input = this.phone
            resetError(input)

            if (isNumber(input)) {
                this.valid = false
            } else if (exact(input, 11)) {
                this.valid = false
            } else
                input.success = true
        },

        processBirthMonth() {
            let input = this.birthDate.month
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 12)) {
                this.valid = false
            } else {
                input.success = true
            }
        },
        processBirthYear() {
            let input = this.birthDate.year
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1300)) {
                this.valid = false
            } else if (biggerThan(input, 1450)) {
                this.valid = false
            } else {
                input.success = true
            }
        },

        // ==================================================================================
        // process the password strength and updating the strength process bar
        // ==================================================================================
        processPassword() {
            // counts the strength of password from 1 to 4
            let strengthPoints = 1
            let input = this.password

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
                    this.valid = false
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
            this.processPassRep()
        }, // process password

        // ==================================================================================
        // check if the password and passwordRepeat are equal
        // ==================================================================================
        processPassRep() {
            if (this.password.value !== this.passwordRepeat.value) {
                this.passwordRepeat.err = true
                this.passwordRepeatErr.seen = true
                this.valid = false
                this.passwordRepeatErr.text = 'رمز عبور و تکرار آن یکسان نیستند'
            } else {
                this.passwordRepeat.err = false
                this.passwordRepeatErr.seen = false
            }
        }, // /processPassRep

        updateUserInfo() {

            this.valid = true
            this.processFullname()
            this.processUsername()
            this.processPhone()
            this.processBirthDay()
            this.processBirthMonth()
            this.processBirthYear()
            this.processPassword()
            this.processPassRep()

            if (this.password.value === '') {
                this.passwordRepeatErr.seen = true
                this.passwordRepeatErr.text = "رمز عبور نمی تواند خالی باشد"
                this.valid = false
            } else if (this.password.value.length < 8) {
                this.valid = false
                this.passwordRepeatErr.seen = true
                this.passwordRepeatErr.text = "رمز عبور نباید کمتر از 8 کاراکتر باشد"
            }

            // ==================================================================================
            // if there is no error send request
            if (this.valid) {
                ipcRenderer.send('userUpdate', {
                    fullName: this.fullname.value,
                    userName: this.username.value,
                    password: this.password.value,
                    userType: 'manager',
                    birthDate: `${this.birthDate.year.value}/${this.birthDate.month.value}/${this.birthDate.day.value}`,
                    phoneNumber: this.phone.value,
                })
            }
        }
    },
    template:
        `
          <overlay></overlay>
          <teleport to="#main">
          <div class="w-1/3 bg-white rounded-lg u-center-h top-20" style="z-index: 2003">
            <div
                class="p-8 w-full border-t-8 border-purple-700 rounded-lg flex flex-row flex-wrap justify-center items-center">
              <h3 class="text-xl text-right mb-4 font-bold text-gray-800">
                ویرایش کاربر
              </h3>

              <div class="mb-4 flex-fullrow">
                <span class="text-sm text-gray-500 mb-2">نام کاربری</span>
                <input v-bind:class="{fail: username.err, success: username.success}" type="text" class="p-4 common"
                       placeholder="نام کاربری" @change="processUsername" v-model="username.value" max="50">
                <p class="input-error" v-if="username.err">{{ username.errMsg }}</p>
                <p class="input-guide">نام کاربری می تواند شامل حروف انگلیسی، اعداد و _ باشد.</p>
              </div>
              
              <div class="mb-4 flex-fullrow flex flex-row flex-nowrap justify-start input-center">
              <div class="ml-2">
                <span class="text-sm text-gray-500 mb-2">نام شما</span>
                <input type="text" class="p-4 common" :class="{fail: fullname.err, success: fullname.success}"
                       placeholder="نام شما"
                       v-model="fullname.value" max="50" @change="processFullname">
                <p class="input-error" v-if="fullname.err">{{ fullname.errMsg }}</p>
              </div>

              <div>
                <span class="text-sm text-gray-500 mb-2">شماره تماس</span>

                <input type="number" class="common p-4" placeholder="شماره تماس" :class="{fail: phone.err, success: phone.success}"
                       v-model="phone.value"
                       v-on:change="processPhone">
                <p class="input-error" v-if="phone.err">{{ phone.errMsg }}</p>
              </div>
              </div>

              <div class="mb-4 flex-fullrow">
                <span class="text-sm text-gray-500 mb-2">تاریخ تولد</span>
                <div class="input-group">
                  <div>
                    <input type="number" class="common" placeholder="روز" min="1" max="31" :class="{fail: birthDate.day.err, success: birthDate.day.success}"
                           v-model="birthDate.day.value" @change="processBirthDay">
                    <p class="input-error" v-if="birthDate.day.err">{{ birthDate.day.errMsg }}</p>
                  </div>

                  <div>
                    <input class="common" type="number" placeholder="ماه" min="1" max="12" :class="{fail: birthDate.month.err, success: birthDate.month.success}"
                           v-model="birthDate.month.value" @change="processBirthMonth">
                    <p class="input-error" v-if="birthDate.month.err">{{ birthDate.month.errMsg }}</p>
                  </div>

                  <div>
                    <input class="common" type="number" placeholder="سال" min='1300' max="1450" :class="{fail: birthDate.year.err,  success: birthDate.year.success}"
                           v-model="birthDate.year.value" @change="processBirthYear">
                    <p class="input-error" v-if="birthDate.year.err">{{ birthDate.year.errMsg }}</p>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="h-4 relative max-w-xl rounded-full overflow-hidden mb-2 flex-fullrow" v-if="progress.seen">
                <div class="w-full h-full bg-gray-200 absolute"></div>
                <div id="pass-bar" class="progress h-full relative text-right text-white pr-4" style="font-size: 12px"
                     v-bind:class="progress.width">
                  {{ progress.text }}
                </div>
              </div>


              <div class="mb-2 flex-fullrow">
                <span class="text-sm text-gray-500 mb-2">رمز عبور</span>
                <input type="password" class="p-4 common"
                       placeholder="رمز عبور" v-on:input="processPassword" v-model="password.value">
              </div>

              <div class="flex-fullrow">
                <span class="text-sm text-gray-500 mb-2">
                  تکرار رمز عبور
                </span>
                <input :class="{fail: passwordRepeat.err}" type="password" class="p-4 common"
                       placeholder="تکرار رمز عبور" v-model="passwordRepeat.value" v-on:change="processPassRep">
                <p class="input-error" v-if="passwordRepeatErr.seen" id="pass-err">{{ passwordRepeatErr.text }}</p>
                <p class="input-guide">رمز عبور شما باید حداقل 8 کاراکتر باشد</p>
              </div>
            </div>

            <div class="p-4 flex">
              <a href="#"
                 class="w-1/2 px-4 py-3 ml-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
                 v-on:click="$emit('cancel-user-edit')">انصراف</a>
              <a href="#"
                 class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
                 v-on:click="updateUserInfo">ویرایش حساب</a>
            </div>
          </div>
          </teleport>
        `
}