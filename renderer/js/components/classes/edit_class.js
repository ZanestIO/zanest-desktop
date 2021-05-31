const {ipcRenderer} = require('electron')
const confirm_alert = require('./../confirmAlert')
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
} = require('../../utils/validation')
const {pWeekdays} = require('./../../utils/converts')

module.exports = {
    // ==================================================================================
    // -------------- DATA VALUES
    // ==================================================================================
    data() {
        return {
            valid: true,
            timeSelect: true,
            id: '',
            changed: false,
            deleteBox: {
                seen: false,
                title: 'آیا مطمئن هستید؟',
                desc: 'با تایید عملیات کلاس فعلی از سیستم حذف خواهد شد'
            },
            // ==================================================================================
            // basic fields
            topic: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            teacher: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            classType: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
            classRoom: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
                active: false
            },
            tuition: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },

            // ==================================================================================
            // weekday and timeSlice
            weekdays: {
                saturday: false,
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
            },
            timeSlices: {
                saturday: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
                sunday: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
                monday: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
                tuesday: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
                wednesday: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
                thursday: {
                    err: false,
                    value: '',
                    errMsg: '',
                    success: false
                },
            },
            persianWeekdays: pWeekdays,

            // ==================================================================================
            // Data taken from models
            allTopics: [],
            allTeachers: [],
            allClassrooms: [],
            availableTimeSlices: {
                saturday: [],
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
            },

            // ==================================================================================
            // coloring options
            userColor: {
                name: 'purple',
                gradient: {
                    purple: 'from-purple-700 to-purple-900',
                    blue: 'from-blue-600 to-blue-900',
                    green: 'from-green-600 to-teal-900',
                    pink: 'from-pink-500 to-purple-900',
                },
                solid: {
                    purple: 'bg-purple-700',
                    blue: 'bg-blue-700',
                    green: 'bg-green-600',
                    pink: 'bg-pink-600',
                }
            }
        }
    },
    provide() {
        return {
            // providing for notifications
            seen: Vue.computed(() => this.deleteBox.seen),
            error: Vue.computed(() => this.deleteBox.title),
            error_desc: Vue.computed(() => this.deleteBox.desc),
        }
    },
    components: {
        confirm_alert,
    },
    // ==================================================================================
    // -------------- INITIALIZATION
    // ==================================================================================
    beforeCreate() {
        // =============================================
        // changing the color of button
        ipcRenderer.send('requestUserColor')
        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })

        // =============================================
        // getTopics
        ipcRenderer.send('getBulk', {type: 'topic'})
        ipcRenderer.on('responseTopicGetBulk', (e, args) => {
            this.allTopics = args.topics
        })

        // =============================================
        // getTeachers
        ipcRenderer.send('getBulk', {type: 'teacher', offset: 1, number: 500})
        ipcRenderer.on('responseTeacherGetBulk', (e, args) => {
            this.allTeachers = args.teachers
        })

        // =============================================
        // getClasses
        ipcRenderer.send('getBulk', {type: 'classRoom'})
        ipcRenderer.on('responseClassRoomGetBulk', (e, args) => {
            this.allClassrooms = args.classRooms
        })

        // =============================================
        // GETTING INFO AND FILLING IN THE EDIT FORM
        ipcRenderer.on('getClassInfo', (e, args) => {

            this.id = args.id
            this.topic.value = args.topicId
            this.teacher.value = args.teacherId
            this.classType.value = args.type

            if (args.type === 'actual') {
                this.classRoom.value = args.classRoomId
                this.classRoom.active = true
            }

            this.tuition.value = args.tuition

            for ([key, value] of Object.entries(args.timeSlices)) {
                if (value) {
                    this.weekdays[key] = true
                    this.timeSlices[key].value = value
                }
            }
        })
    },

    created() {
        // ==================================================================================
        // GETTING TIMESLICES AT FIRST
        setTimeout(() => {
            if (this.classType.value === 'virtual') {
                ipcRenderer.send('getBulk', {type: 'timeSlice'})
                ipcRenderer.once('responseTimeSliceGetBulk', (e, args) => {
                    for ([key, value] of Object.entries(this.availableTimeSlices)) {
                        this.availableTimeSlices[key] = args.timeSlices
                    }
                })
                // Get All Time Slices For All Days
            } else {
                this.getTimeSliceForDay()

            }
        }, 100)

    },

    // ==================================================================================
    // -------------- METHODS
    // ==================================================================================
    methods: {
        // ==================================================================================
        // PROCESSING THE FIELDS
        processTopic() {
            let input = this.topic
            this.changed = true
            resetError(input)


            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },

        // TEACHER
        processTeacher() {
            let input = this.teacher
            this.changed = true
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },

        // CLASS TYPE
        processClassType() {
            let input = this.classType
            this.changed = true
            resetError(input)

            this.classRoom.active = input.value === 'actual';
            if (input.value === 'virtual') {
                ipcRenderer.send('getBulk', {type: 'timeSlice'})
                ipcRenderer.on('responseTimeSliceGetBulk', (e, args) => {
                    for ([key, value] of Object.entries(this.availableTimeSlices)) {
                        this.availableTimeSlices[key] = args.timeSlices
                    }
                })
            } // ./if virtual

            input.success = true
        },

        // CLASSROOM
        processClassRoom() {
            let input = this.classRoom
            this.changed = true
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else {
                input.success = true
                this.getTimeSliceForDay()
            }
        },

        // TUITION
        processTuition() {
            let input = this.tuition
            this.changed = true
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (shorterThan(input, 9)) {
                this.valid = false
            } else {
                input.success = true
            }
        },

        // TIMESLICES
        processTimeSlices(value) {
            let input = this.timeSlices[value]
            this.changed = true
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
            this.timeSelect = true
        },

        // ALL
        processAll() {
            this.valid = true
            this.processTopic()
            this.processTeacher()
            this.processClassType()

            // only process classroom if it is active
            if (this.classRoom.active)
                this.processClassRoom()

            this.processTuition()

            // only process active timeSlices
            flag = false
            for ([key, value] of Object.entries(this.timeSlices)) {
                if (this.weekdays[key]) {
                    flag = true
                    this.processTimeSlices(key)
                }
            }
            this.timeSelect = flag
            this.valid = flag
        },

        // ==================================================================================
        // FINAL SUBMIT and sending the values
        submit() {
            if (!this.changed)
                return

            // processing all of form
            this.valid = true
            this.processAll()

            if (this.valid) {

                // _____________________________________________________
                // arguments to be send to server
                let args = {
                    id: this.id,
                    topicId: this.topic.value,
                    teacherId: this.teacher.value,
                    type: this.classType.value,
                    classRoomId: this.classRoom.value,
                    tuition: this.tuition.value,
                    timeSlices: {}
                }
                if (!this.classRoom.active) {
                    args.classRoomId = ''
                }
                // only send timeSlices that are active
                for ([key, value] of Object.entries(this.weekdays)) {
                    if (value) {
                        args.timeSlices[key] = this.timeSlices[key].value
                    }
                }

                ipcRenderer.send('classUpdate', args)
                // resetting every field
                // resetError(this.topic)
                // resetError(this.teacher)
                // resetError(this.classRoom)
                // resetError(this.classType)
                // resetError(this.tuition)
                // for ([key, value] of Object.entries(this.timeSlices)) {
                //     resetError(this.timeSlices[key])
                // }

                // refreshing table
                setTimeout(() => {
                    ipcRenderer.send('getBulk', {type: 'class'})
                    this.processClassRoom()
                }, 200)
            }
        }, // ./submit

        // ==================================================================================
        // DELETING THE USER
        deleteUser() {
            this.deleteBox.seen = true
        },
        confirm_delete() {
            this.deleteBox.seen = false
            ipcRenderer.send('classDeletion', {id: this.id})
        },
        cancelDelete() {
            this.deleteBox.seen = false
        },

        // ==================================================================================
        // CONVERTS
        convertTime12to24(time12h) {
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes] = time.split(":");
            if (hours === "12") {
                hours = "00";
            }
            if (modifier === "pm") {
                hours = parseInt(hours, 10) + 12;
            }
            return `${hours}:${minutes}`;
        },

        convert24To12(time) {
            let [hour, minute] = time.split(":")
            hour = parseInt(hour)
            let suffix = hour >= 12 ? "PM" : "AM";
            hour = (((hour + 11) % 12) + 1)
            return `${hour}:${minute} ${suffix}`
        },

        // ==================================================================================
        // get time slices per day
        getTimeSliceForDay() {
            if (this.classType === 'virtual')
                return

            let args = {
                classRoomId: this.classRoom.value,
                currentClass: this.id
            }

            ipcRenderer.send('getAllFreeTimeSlice', args)
            ipcRenderer.once('responseGetAllFreeTimeSlice', (e, args) => {
                this.availableTimeSlices = args
                console.log(args)
            })
        }

    },

    // ==================================================================================
    // ------------- TEMPLATE
    // ==================================================================================
    template: `
      <confirm_alert @confirm="confirm_delete" @cancel-box="cancelDelete"></confirm_alert>

      <div class="full-edit-box">

      <!-- TOPICS -->
      <div class="flex-1/4">
          <span>
            عنوان
          </span>
        <select :class="{fail: topic.err, success: topic.success}" v-model="topic.value" @change="processTopic">
          <option value="">انتخاب کنید</option>
          <option v-for="topic in allTopics" :value="topic.id" lang="en">{{ topic.name }}</option>
        </select>
        <p class="input-error" v-if="topic.err">{{ topic.errMsg }}</p>
      </div>

      <!-- TEACHERS -->
      <div class="flex-1/4">
          <span>
            استاد
          </span>
        <select :class="{fail: teacher.err, success: teacher.success}" v-model="teacher.value"
                @change="processTeacher">
          <option value="">انتخاب کنید</option>
          <option v-for="teacher in allTeachers" :value="teacher.id">{{ teacher.fullName }}</option>
        </select>
        <p class="input-error" v-if="teacher.err">{{ teacher.errMsg }}</p>
      </div>

      <!-- CLASS TYPE -->
      <div class="flex-1/4">
          <span>
            نوع کلاس
          </span>
        <select :class="{fail: classType.err, success: classType.success}" v-model="classType.value"
                @change="processClassType">
          <option value="virtual">مجازی</option>
          <option value="actual">حضوری</option>
        </select>
        <p class="input-error" v-if="classType.err">{{ classType.errMsg }}</p>
      </div>

      <!-- CLASSROOM -->
      <div class="flex-1/4" v-if="classRoom.active">
          <span>
            مکان
          </span>
        <select :class="{fail: classRoom.err, success: classRoom.success}" v-model="classRoom.value"
                @change="processClassRoom">
          <option value="">انتخاب کنید</option>
          <option v-for="cls in allClassrooms" :value="cls.id">{{ cls.name }}</option>
        </select>
        <p class="input-error" v-if="classRoom.err">{{ classRoom.errMsg }}</p>
      </div>

      <!-- TUITION -->
      <div class="flex-1/4 flex-fullrow">
          <span>
            شهریه (تومان)
          </span>
        <input type="number" :class="{fail: tuition.err, success: tuition.success}" v-model="tuition.value"
               @change="processTuition" min="0" placeholder="مثلا 100000" step="10000">
        <p class="input-error" v-if="tuition.err">{{ tuition.errMsg }}</p>
      </div>
      </div> <!-- ./full-edit-box -->


      <!-- =======================================================================     -->
      <!-- SELECTING TIME FOR THE CLASS -->
      <div class="px-4 flex w-full flex-row justify-start items-start flex-wrap"
           v-if="(this.classRoom.value && this.classRoom.active) || this.classType.value === 'virtual'">
      <p class="text-sm flex-fullrow mb-4 border-b-2 pb-2 border-gray-300">
        زمان های برگذاری
        <span class="inline-block mr-4 input-error" v-if="!timeSelect">زمانی برای برگذاری کلاس تعیین کنید</span>
      </p>


      <div class="flex-fullrow class-time-select">

        <!--          Create Dynamic Weekday And TimeSlice Selectors-->
        <div v-for="(value, name) in weekdays" class="mb-4">
          <div class="mb-2 p-2 bg-gray-200 w-full rounded-lg flex flex-nowrap items-center justify-between">
            <label :for="name" class="flex-1 cursor-pointer">{{ persianWeekdays[name] }} </label>
            <input :id="name" class="h-6 w-10 cursor-pointer" type="checkbox"
                   v-model="weekdays[name]">
          </div>
          <div v-if="weekdays[name]">
            <span class="text-sm text-gray-600 mb-2 inline-block">بازه ی زمانی</span>
            <select class="common text-sm ltr" lang="en"
                    :class="{fail: timeSlices[name].err, success: timeSlices[name].success}"
                    v-model="timeSlices[name].value"
                    @change="processTimeSlices(name)">
              <option value="">انتخاب کنید</option>
              <option v-for="time in availableTimeSlices[name]" :value="time.id">
                {{ this.convert24To12(time.startTime) + ' - ' + this.convert24To12(time.finishTime) }}
              </option>
            </select>
            <p class="input-error" v-if="timeSlices[name].err">{{ timeSlices[name].errMsg }}</p>
          </div>
        </div>


      </div> <!-- /class-time-select -->
      </div> <!-- /wrapper for time select -->

      <!--      =================================================================================== SUBMITTING FORM-->
      <div class="px-4 w-full flex justify-between">
      <button class="btn-mid ml-10" :class="{'btn-success': changed, 'btn-muted': !changed}" v-on:click="submit">
        ویرایش
      </button>
      <button class="btn-delete btn-mid" v-on:click="deleteUser">
        حذف
      </button>
      </div>
    `
}