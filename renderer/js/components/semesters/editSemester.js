const {ipcRenderer} = require('electron')
require('vue');
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
            id: '',
            valid: false,
            name: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            startDate: {
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
            finishDate: {
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
            }
        }

    },
    inject: ['currentlyEditing'],
    emit: ['cancel-edit-semester', 'refresh'],
    components: {},
    created() {
        ipcRenderer.send('getSemesterInfo', {id: this.currentlyEditing.value})

        ipcRenderer.on('responseGetSemesterInfo', (e, args) => {
            this.name.value = args.year
            this.id = args.id

            // dismantling dates
            sdate = args.startDate.split("-")
            fdate = args.finishDate.split("-")
            this.startDate.day.value = sdate[2]
            this.startDate.month.value = sdate[1]
            this.startDate.year.value = sdate[0]
            this.finishDate.day.value = fdate[2]
            this.finishDate.month.value = fdate[1]
            this.finishDate.year.value = fdate[0]

        })
    },
    methods: {
        // ==========================================================
        // process name
        processName() {
            let input = this.name
            resetError(input)

            if (longerThan(input, 3)) {
                this.valid = false
            } else {
                input.success = true
            }
        },

        // ==========================================================
        // process StartDate
        processStartDay() {
            let input = this.startDate.day
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 31)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },

        processStartMonth() {
            let input = this.startDate.month
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 12)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },
        processStartYear() {
            let input = this.startDate.year
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1300)) {
                this.valid = false
            } else if (biggerThan(input, 1450)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },



        // ==========================================================
        // process finishDate
        processFinishDay() {
            let input = this.finishDate.day
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 31)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },

        processFinishMonth() {
            let input = this.finishDate.month
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 12)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },
        processFinishYear() {
            let input = this.finishDate.year
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1300)) {
                this.valid = false
            } else if (biggerThan(input, 1450)) {
                this.valid = false
            } else {
                input.success = true
                this.changed = true
            }
        },


        // ==========================================================
        // Update Semester in Database
        addSemesterInfo() {
            this.valid = true
            this.processName()

            this.processStartDay()
            this.processStartMonth()
            this.processStartYear()

            this.processFinishDay()
            this.processFinishMonth()
            this.processFinishYear()

            if (this.valid) {

                // assembling dates
                let sDate = `${this.startDate.year.value}-${this.startDate.month.value}-${this.startDate.day.value}`
                let fDate = `${this.finishDate.year.value}-${this.finishDate.month.value}-${this.finishDate.day.value}`

                let args = {
                    id: this.id,
                    year: this.name.value,
                    startDate: sDate,
                    finishDate: fDate,
                }

                ipcRenderer.send('semesterUpdate', args)
                ipcRenderer.on('responseSemesterUpdate', (e, args) => {

                    if (args) {
                        // refreshing the list of all semesters
                        this.$emit('refresh')
                    }
                })
            }
        },


    },
    template:
        `
          <div class="main-section">
          <div class="section-title-2">
            <h2 class="mb-2">
              ویرایش ترم تحصیلی
            </h2>
            <hr class="mb-4">
          </div>

          <div class="section-content">

            <!-- start of the semester -->
            <div class="mb-4 flex-fullrow">
              <span class="text-sm text-gray-500 mb-2">تاریخ شروع ترم *</span>
              <div class="input-group">
                <div>
                  <input type="number" class="common" placeholder="روز" min="1" max="31"
                         :class="{fail: startDate.day.err, success: startDate.day.success}"
                         v-model="startDate.day.value" @change="processStartDay">
                  <p class="input-error" v-if="startDate.day.err">{{ startDate.day.errMsg }}</p>
                </div>

                <div>
                  <input class="common" type="number" placeholder="ماه" min="1" max="12"
                         :class="{fail: startDate.month.err, success: startDate.month.success}"
                         v-model="startDate.month.value" @change="processStartMonth">
                  <p class="input-error" v-if="startDate.month.err">{{ startDate.month.errMsg }}</p>
                </div>

                <div>
                  <input class="common" type="number" placeholder="سال" min='1300' max="1450"
                         :class="{fail: startDate.year.err,  success: startDate.year.success}"
                         v-model="startDate.year.value" @change="processStartYear">
                  <p class="input-error" v-if="startDate.year.err">{{ startDate.year.errMsg }}</p>
                </div>
              </div>
            </div>

            <!--          name of the semester -->
            <div class="mb-4 flex-fullrow">
              <span class="text-sm text-gray-500 mb-2">تاریخ پایان ترم *</span>
              <div class="input-group">
                <div>
                  <input type="number" class="common" placeholder="روز" min="1" max="31"
                         :class="{fail: finishDate.day.err, success: finishDate.day.success}"
                         v-model="finishDate.day.value" @change="processFinishDay">
                  <p class="input-error" v-if="finishDate.day.err">{{ finishDate.day.errMsg }}</p>
                </div>

                <div>
                  <input class="common" type="number" placeholder="ماه" min="1" max="12"
                         :class="{fail: finishDate.month.err, success: finishDate.month.success}"
                         v-model="finishDate.month.value" @change="processFinishMonth">
                  <p class="input-error" v-if="finishDate.month.err">{{ finishDate.month.errMsg }}</p>
                </div>

                <div>
                  <input class="common" type="number" placeholder="سال" min='1300' max="1450"
                         :class="{fail: finishDate.year.err,  success: finishDate.year.success}"
                         v-model="finishDate.year.value" @change="processFinishYear">
                  <p class="input-error" v-if="finishDate.year.err">{{ finishDate.year.errMsg }}</p>
                </div>
              </div>
            </div>

            <!--          name of the semester -->
            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">نام ترم *</p>
              <input v-bind:class="{fail: name.err, success: name.success}" type="text" class="p-4 common"
                     placeholder="" @change="processName" v-model="name.value" max="50">
              <p class="input-error" v-if="name.err">{{ name.errMsg }}</p>
            </div>


            <div class="p-2 pt-2 flex">
              <a href="#"
                 class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
                 v-on:click="addSemesterInfo">ویرایش</a>
              <a href="#"
                 class="w-1/2 px-4 py-3 ml-2 mr-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
                 v-on:click="$emit('cancel-edit-semester')">انصراف</a>
            </div>
          </div>
          </div>

        `
}