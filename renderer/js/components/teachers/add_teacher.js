const {ipcRenderer} = require('electron')
const {
    resetError,
    isEmpty,
    exact,
    smallerThan,
    biggerThan,
    isNumber,
    isLetter,
    shorterThan,
    longerThan
} = require('../../utils/validation')

module.exports = {
    data() {
        return {
            valid: true,
            name: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            phone: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            sex: {
                err: false,
                value: 'male',
                errMsg: '',
                success: false
            },
            sid: {
                err: false,
                value: '',
                errMsg: '',
                success: false
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
            address: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            degree: {
                err: false,
                value: 'karshenasi',
                errMsg: '',
                success: false
            },
        }
    },
    inject: ['addSeen'],
    emits: ['cancelAdd'],
    methods: {

        // ==========================================================
        // process name

        processName() {
            let input = this.name
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (isLetter(input)) {
                this.valid = false
            } else if (longerThan(input, 3)) {
                this.valid = false
            } else if (shorterThan(input, 50)) {
                this.valid = false
            } else {
                input.success = true
            }
        },

        // ==========================================================
        // process phone number

        processPhone() {
            let input = this.phone
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (isNumber(input)) {
                this.valid = false
            } else if (exact(input, 11)) {
                this.valid = false
            } else
                input.success = true
        },

        // ==========================================================
        // process sex

        processSex() {
            let input = this.sex
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },

        // ==========================================================
        // process social id

        processSid() {
            let input = this.sid
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (isNumber(input)) {
                this.valid = false
            } else if (exact(input, 10)) {
                this.valid = false
            } else
                input.success = true
        },

        // ==========================================================
        // process birth date

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

        // ==========================================================
        // process address

        processAddress() {
            let input = this.address
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (shorterThan(255)) {
                this.valid = false
            } else
                input.success = true
        },

        // ==========================================================
        // process degree

        processDegree() {
            let input = this.degree
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },


        processAll() {
            this.valid = true
            this.processName()
            this.processPhone()
            this.processSid()
            this.processBirthDay()
            this.processBirthDay()
            this.processBirthMonth()
            this.processBirthYear()
            this.processAddress()
            this.processDegree()
        },

        // ==================================================================================
        // final submit and sending the values
        // ==================================================================================
        submit() {
            this.processAll()
            if (this.valid) {
                ipcRenderer.send('teacherCreation', {
                    fullName: this.name.value,
                    socialID: this.sid.value,
                    sex: this.sex.value,
                    degree: this.degree.value,
                    phoneNumber: this.phone.value,
                    birthDate: `${this.birthDate.year.value}/${this.birthDate.month.value}/${this.birthDate.day.value}`,
                    address: this.address.value
                })

                // clearing the fields for another creation
                // this.name.value = ''
                // this.phone.value = ''
                // this.sid.value = ''
                // this.degree.value = ''
                // this.address.value = ''
                // this.birthDate.day.value = ''
                // this.birthDate.month.value = ''
                // this.birthDate.year.value = ''

                // resetting every field
                resetError(this.name)
                resetError(this.phone)
                resetError(this.sid)
                resetError(this.degree)
                resetError(this.address)
                resetError(this.birthDate.day)
                resetError(this.birthDate.month)
                resetError(this.birthDate.year)
            }
        }


    },

    // ==================================================================================
    // Template
    // ==================================================================================
    template: `
      <section class="big-section rounded-tr-none" v-if="addSeen.value">

      <!--   name of the teacher   -->
      <div class="full-edit-box">
        <div>
          <span>
            نام
          </span>
          <input type="text" placeholder="نام و نام خانوادگی" :class="{fail: name.err, success: name.success}"
                 v-model="name.value"
                 v-on:change="processName" minlength="3" maxlength="50">
          <p class="input-error" v-if="name.err">{{ name.errMsg }}</p>
        </div>

        <!--    phone number    -->
        <div>
          <span>
            شماره تماس
          </span>
          <input type="number" placeholder="--" :class="{fail: phone.err, success: phone.success}" v-model="phone.value"
                 v-on:change="processPhone">
          <p class="input-error" v-if="phone.err">{{ phone.errMsg }}</p>
        </div>

        <!--   sex    -->
        <div>
          <span>
            جنسیت
          </span>
          <select :class="{fail: sex.err, success: sex.success}" v-model="sex.value" @change="processSex">
            <option value="male">مرد</option>
            <option value="female">زن</option>
            <option value="bisex">نامشخص</option>
          </select>
          <p class="input-error" v-if="sex.err">{{ sex.errMsg }}</p>
        </div>

        <!--   social id    -->
        <div>
          <span>
            کدملی
          </span>
          <input type="number" placeholder="--" :class="{fail: sid.err, success: sid.success}" v-model="sid.value"
                 @change="processSid">
          <p class="input-error" v-if="sid.err">{{ sid.errMsg }}</p>
        </div>

        <!--   birth date    -->
        <div class="mb-4 w-full flex-1/3">
          <span>
            تاریخ تولد
          </span>
          <div class="input-group">
            <div>
              <input type="number" placeholder="روز" min="1" max="31"
                     :class="{fail: birthDate.day.err, success: birthDate.day.success}"
                     v-model="birthDate.day.value" @change="processBirthDay">
              <p class="input-error" v-if="birthDate.day.err">{{ birthDate.day.errMsg }}</p>
            </div>

            <div>
              <input type="number" placeholder="ماه" min="1" max="12"
                     :class="{fail: birthDate.month.err, success: birthDate.month.success}"
                     v-model="birthDate.month.value" @change="processBirthMonth">
              <p class="input-error" v-if="birthDate.month.err">{{ birthDate.month.errMsg }}</p>
            </div>

            <div>
              <input type="number" placeholder="سال" min='1300' max="1450"
                     :class="{fail: birthDate.year.err,  success: birthDate.year.success}"
                     v-model="birthDate.year.value" @change="processBirthYear">
              <p class="input-error" v-if="birthDate.year.err">{{ birthDate.year.errMsg }}</p>
            </div>
          </div>
        </div>

        <!--   address    -->
        <div class="flex-1/3">
          <span>
            آدرس
          </span>
          <input type="text" placeholder="محل سکونت" :class="{fail: address.err, success: address.success}"
                 v-model="address.value"
                 @change="processAddress" maxlength="255">
          <p class="input-error" v-if="address.err">{{ address.errMsg }}</p>
        </div>

        <!--   degree    -->
        <div>
          <span>
            مدرک تحصیلی
          </span>
          <select :class="{fail: degree.err, success: degree.success}" v-model="degree.value" @change="processDegree">
            <option value="kardani">کاردانی</option>
            <option value="karshenasi">کارشناسی</option>
            <option value="karshenasi-arshad">کارشناسی ارشد</option>
            <option value="doctora">دکتری و بالاتر</option>
          </select>
          <p class="input-error" v-if="degree.err">{{ degree.errMsg }}</p>
        </div>
      </div>


      <div class="px-4 flex items-end">
        <button class="btn btn-mid btn-primary ml-8" v-on:click="submit">
          ایجاد استاد
        </button>
        <button class="btn btn-mid btn-cancel" v-on:click="$emit('cancelAdd')">
          انصراف
        </button>
      </div>
      </section>
    `
}