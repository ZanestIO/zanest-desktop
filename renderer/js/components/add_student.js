const {ipcRenderer} = require('electron')
const errors = {
    empty: 'نمی تواند خالی باشد',
    max(num) {
        return `نباید از ${num} بزرگتر باشد`
    },
    min(num) {
        return `نباید از ${num} کوچکتر باشد`
    },
    exact(num) {
        return `باید ${num} رقم باشد.`
    },
    invalid: "کاراکتر غیرمجاز",
    onlyNum: 'فقط استفاده از اعداد مجاز',
    onlyLetter: 'فقط استفاده از حروف مجاز'

}

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
            parentName: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            parentPhone: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            address: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
        }
    },
    inject: ['addSeen'],
    emits: ['cancelAdd'],
    methods: {
        processName() {
            let input = this.name
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (isLetter(input)) {
                this.valid = false
            } else
                input.success = true
        },
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
        processSex() {
            let input = this.sex
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },

        processSid() {
            let input = this.sid
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (exact(input, 10)) {
                this.valid = false
            } else
                input.success = true
        },


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
        processParentName() {
            let input = this.parentName
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (isLetter(input)) {
                this.valid = false
            } else {
                input.success = true
            }
        },
        processParentPhone() {
            let input = this.parentPhone
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
        processAddress() {
            let input = this.address
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
            this.processParentName()
            this.processParentPhone()
            this.processAddress()
        },

        // ==================================================================================
        // final submit and sending the values
        // ==================================================================================
        submit() {
            this.processAll()
            if (this.valid) {
                ipcRenderer.send('studentCreation', {
                    fullName: this.name.value,
                    socialID: this.sid.value,
                    parentsName: this.parentName.value,
                    parentNumber: this.parentPhone.value,
                    sex: this.sex.value,
                    phoneNumber: this.phone.value,
                    birthDate: `${this.birthDate.year.value}/${this.birthDate.month.value}/${this.birthDate.day.value}`,
                    address: this.address.value
                })

                // clearing the fields for another creation
                this.name.value = ''
                this.phone.value = ''
                this.sid.value = ''
                this.parentName.value = ''
                this.parentPhone.value = ''
                this.address.value = ''
                this.birthDate.day.value = ''
                this.birthDate.month.value = ''
                this.birthDate.year.value = ''

                // resetting every field
                resetError(this.name)
                resetError(this.phone)
                resetError(this.sid)
                resetError(this.parentName)
                resetError(this.parentPhone)
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
      <section class="big-section" v-if="addSeen.value">
      <div class="full-edit-box">
        <div>
          <span>
            نام
          </span>
          <input type="text" placeholder="نام و نام خانوادگی" :class="{fail: name.err, success: name.success}" v-model="name.value"
                 v-on:change="processName">
          <p class="input-error" v-if="name.err">{{ name.errMsg }}</p>
        </div>

        <div>
          <span>
            شماره تماس
          </span>
          <input type="number" placeholder="(زبان آموز)" :class="{fail: phone.err, success: phone.success}" v-model="phone.value"
                 v-on:change="processPhone">
          <p class="input-error" v-if="phone.err">{{ phone.errMsg }}</p>
        </div>

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

        <div>
          <span>
            کدملی
          </span>
          <input type="number" placeholder="--" :class="{fail: sid.err, success: sid.success}" v-model="sid.value" @change="processSid">
          <p class="input-error" v-if="sid.err">{{ sid.errMsg }}</p>
        </div>

        <div class="mb-4 w-full flex-1/3">
          <span>
            تاریخ تولد
          </span>
          <div class="input-group">
            <div>
              <input type="number" placeholder="روز" min="1" max="31" :class="{fail: birthDate.day.err, success: birthDate.day.success}"
                     v-model="birthDate.day.value" @change="processBirthDay">
              <p class="input-error" v-if="birthDate.day.err">{{ birthDate.day.errMsg }}</p>
            </div>

            <div>
              <input type="number" placeholder="ماه" min="1" max="12" :class="{fail: birthDate.month.err, success: birthDate.month.success}"
                     v-model="birthDate.month.value" @change="processBirthMonth">
              <p class="input-error" v-if="birthDate.month.err">{{ birthDate.month.errMsg }}</p>
            </div>

            <div>
              <input type="number" placeholder="سال" min='1300' max="1450" :class="{fail: birthDate.year.err,  success: birthDate.year.success}"
                     v-model="birthDate.year.value" @change="processBirthYear">
              <p class="input-error" v-if="birthDate.year.err">{{ birthDate.year.errMsg }}</p>
            </div>
          </div>
        </div>

        <div>
          <span>
            نام والد
          </span>
          <input type="text" placeholder="(پدر یا مادر)" :class="{fail: parentName.err, success: parentName.success}" v-model="parentName.value"
                 @change="processParentName">
          <p class="input-error" v-if="parentName.err">{{ parentName.errMsg }}</p>
        </div>

        <div>
          <span>
            شماره تماس والد
          </span>
          <input type="number" placeholder="(پدر یا مادر)" :class="{fail: parentPhone.err , success: parentPhone.success}" v-model="parentPhone.value"
                 @change="processParentPhone">
          <p class="input-error" v-if="parentPhone.err">{{ parentPhone.errMsg }}</p>
        </div>

        <div class="flex-1/3">
          <span>
            آدرس
          </span>
          <input type="text" placeholder="محل سکونت" :class="{fail: address.err, success: address.success}" v-model="address.value"
                 @change="processAddress">
          <p class="input-error" v-if="address.err">{{ address.errMsg }}</p>
        </div>
      </div>

      <div class="px-4 flex items-end">
        <button class="btn btn-mid btn-primary ml-8" v-on:click="submit">
          ایجاد زبان آموز
        </button>
        <button class="btn btn-mid btn-cancel" v-on:click="$emit('cancelAdd')">
          انصراف
        </button>
      </div>
      </section>
    `
}


// ==================================================================================
// utility functions to use
// ==================================================================================
function resetError(input) {
    input.err = false
    input.success = false
}

function isEmpty(input) {
    if (input.value.length === 0) {
        input.err = true
        input.errMsg = errors.empty
        return true
    }
    return false
}

function exact(input, num) {
    if (input.value.length !== num) {
        input.err = true
        input.errMsg = errors.exact(num)
        return true
    }
    return false
}

function smallerThan(input, num) {
    if (input.value < num) {
        input.err = true
        input.errMsg = errors.min(num)
        return true
    }
    return false
}

function biggerThan(input, num) {
    if (input.value > num) {
        input.err = true
        input.errMsg = errors.max(num)
        return true
    }
    return false
}

function isNumber(input) {
    let numbers = new RegExp(/^\d+$/)
    if (!numbers.test(input.value)) {
        input.err = true
        input.errMsg = errors.onlyLetter
        return true
    }
    return false
}

function isLetter(input) {
    let numbers = new RegExp('[0-9]')
    let symbols = new RegExp('[-!#$%^&*()_+|~=`{}\\[\\]:";\'<>?,.\\/]')

    if (numbers.test(input.value) || symbols.test(input.value)) {
        input.err = true
        input.errMsg = errors.onlyLetter
        return true
    }
    return false
}