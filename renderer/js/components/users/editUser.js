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
} = require('./../../utils/validation')

module.exports = {
    data() {
        return {
            id : '',
            changed: false,
            valid: false,
            fullname: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            username: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            userType: {
                err: false,
                value: 'staff',
                errMsg:'',
                success: false
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
    computed: {
        isDisabled() {
            // evaluate whatever you need to determine disabled here...
            return this.currentlyEditing.value == this.curentUser.value
        }
    },
    created() {
        ipcRenderer.send('getUserInfo', {id: this.currentlyEditing.value})

        ipcRenderer.on('responseGetUserInfo', (e, args) => {
            this.username.value = args.userName
            this.fullname.value = args.fullName
            this.userType.value = args.userType
            this.id = args.userID

            if (args.phoneNumber) {
                this.phone.value = args.phoneNumber
            }

            // handling the date
            if (args.birthDate) {
                let date = args.birthDate.split('/')
                console.log(date)
                this.birthDate.year.value = date[0]
                this.birthDate.month.value = date[1]
                this.birthDate.day.value = date[2]
            }

        })
    },
    inject: ['currentlyEditing', 'curentUser'],
    emit: ['cancel-edit-user', 'refresh'],
    components: {
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
                this.changed = true
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
                this.changed = true
            }
        }, // process username


        processBirthDay() {
            let input = this.birthDate.day
            resetError(input)
            if (input.value === '') {

            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 31)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },

        processPhone() {
            let input = this.phone
            resetError(input)
            if (input.value === '') {

            } else if (isNumber(input)) {
                this.valid = false
            } else if (exact(input, 11)) {
                this.valid = false
            } else
                input.success = true
            this.changed = true
        },

        processBirthMonth() {
            let input = this.birthDate.month
            resetError(input)
            if (input.value === '') {

            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 12)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },
        processBirthYear() {
            let input = this.birthDate.year
            resetError(input)
            if (input.value === '') {

            } else if (smallerThan(input, 1300)) {
                this.valid = false
            } else if (biggerThan(input, 1450)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },

        // ==================================================================================
        // process the password strength and updating the strength process bar
        // ==================================================================================
        processPassword() {
            if(this.password.value === "")
            {
                this.progress.seen = false
                return
            }
            this.changed = false
            // counts the strength of password from 1 to 4
            let strengthPoints = 1
            let input = this.password

            // if password length is more than 8
            if (this.password.value.length >= 8) {
                strengthPoints = 2
                let smallLetters = new RegExp('[a-z]')
                let capitalLetters = new RegExp('[A-Z]')
                let numbers = new RegExp('[0-9]')
                let symbols = new RegExp('[-!@#$%^&*()_+|~=`{}\\[\\]:";\'<>?,.\\/]')

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
                    this.changed = true
                    break
                case 3:
                    this.progress.width = 'w-3/4'
                    this.progress.text = 'امن'
                    this.changed = true
                    break
                case 4:
                    this.progress.width = 'w-full'
                    this.progress.text = 'بسیار امن'
                    this.changed = true
            }
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

            if (this.birthDate.day.value || this.birthDate.month.value || this.birthDate.year.value) {
                if (!this.birthDate.day.value) {
                    this.birthDate.day.err = true
                    this.birthDate.day.errMsg = "نباید خالی باشد"
                    this.valid = false
                }
                if (!this.birthDate.month.value) {
                    this.birthDate.month.err = true
                    this.birthDate.month.errMsg = "نباید خالی باشد"
                    this.valid = false
                }
                if (!this.birthDate.year.value) {
                    this.birthDate.year.err = true
                    this.birthDate.year.errMsg = "نباید خالی باشد"
                    this.valid = false
                }
            }

            this.processPassword()
            this.processPassRep()
            //
            // if (this.password.value === '') {
            //     this.passwordRepeatErr.seen = true
            //     this.passwordRepeatErr.text = "رمز عبور نمی تواند خالی باشد"
            //     this.valid = false
            // } else if (this.password.value.length < 8) {
            //     this.valid = false
            //     this.passwordRepeatErr.seen = true
            //     this.passwordRepeatErr.text = "رمز عبور نباید کمتر از 8 کاراکتر باشد"
            // }
            //

            // ==================================================================================
            // if there is no error send request
            if (this.valid) {
                let bday
                if(this.birthDate.day.value && this.birthDate.month.value && this.birthDate.year.value) {
                    bday = `${this.birthDate.year.value}/${this.birthDate.month.value}/${this.birthDate.day.value}`
                } else {
                    bday = null
                }
                let args = {
                    id: this.id,
                    fullName: this.fullname.value,
                    userName: this.username.value,
                    password: this.password.value ? this.password.value : null,
                    userType: this.userType.value,
                    birthDate: bday,
                    phoneNumber: this.phone.value ? this.phone.value : null,
                }
                ipcRenderer.send('userUpdate', args)

                ipcRenderer.on('responseUserUpdate', (e, args) => {
                    if (args)
                        this.$emit('refresh')
                })
            }
        }
    },
    template:
        `
          <section class="w-40p">
          <div class="main-section">
              <div class="section-title-2">
                <h2>
                  ویرایش کاربر
                </h2>
                <hr>
              </div>

              <div class="mb-4 flex-fullrow flex flex-row flex-nowrap justify-start input-center">
                <div class="ml-2 flex-1">
                <span class="text-sm text-gray-500 mb-2">نام کاربری*</span>
                <input v-bind:class="{fail: username.err, success: username.success}" type="text" class="p-4 common"
                       placeholder="نام کاربری" @change="processUsername" v-model="username.value" max="50">
                <p class="input-error" v-if="username.err">{{ username.errMsg }}</p>
                <p class="input-guide">نام کاربری می تواند شامل حروف انگلیسی، اعداد و _ باشد.</p>
                </div>

                <div>
                  <span class="text-sm text-gray-500 mb-2">نقش*</span>
                  <select :disabled="isDisabled" v-bind:class="{fail: userType.err, success: userType.success}" class="p-4 common" v-model="userType.value" @focusout="userType.success=true">
                    <option value="manager">مدیر</option>
                    <option value="staff">منشی</option>
                  </select>
                  <p class="input-error" v-if="userType.err">{{ userType.errMsg }}</p>
                </div>
              </div>

              <div class="mb-4 flex-fullrow flex flex-row flex-nowrap justify-start input-center">
                <div class="ml-2">
                  <span class="text-sm text-gray-500 mb-2">نام شما*</span>
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
              <span class="text-sm text-gray-500 mb-2">رمزعبور(رمزعبور زیر جایگزین رمز قبلی می شود)</span>
              <input type="password" class="p-4 common"
                     placeholder="رمز عبور جدید را وارد کنید" v-on:input="processPassword" v-model="password.value">
            </div>

            <div class="flex-fullrow">
              <input :class="{fail: passwordRepeat.err}" type="password" class="p-4 common"
                     placeholder="تکرار رمز عبور جدید" v-model="passwordRepeat.value" v-on:change="processPassRep">
              <p class="input-error" v-if="passwordRepeatErr.seen" id="pass-err">{{ passwordRepeatErr.text }}</p>
              <p class="input-guide">رمز عبور شما باید حداقل 8 کاراکتر باشد</p>
            </div>
            
            <div class="p-2 pt-2 flex">
              <a href="#"
                 class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
                 v-on:click="updateUserInfo">ویرایش</a>
              <a href="#"
                 class="w-1/2 px-4 py-3 ml-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
                 v-on:click="$emit('cancel-edit-user')">انصراف</a>
              
            </div>
          </div>
          </section>
          <section class="w-10p"></section>
        `
}