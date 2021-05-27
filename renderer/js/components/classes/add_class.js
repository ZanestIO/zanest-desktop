const {ipcRenderer} = require('electron')
const { resetError, isEmpty, exact, smallerThan, biggerThan, isNumber, isLetter, shorterThan, longerThan} = require('../../utils/validation')
const {pWeekdays} = require('./../../utils/converts')

module.exports = {
    data() {
        return {
            valid: true,
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
                value: 'actual',
                errMsg: '',
                success: false
            },
            classRoom: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
                active: true
            },
            tuition: {
                err: false,
                value: '',
                errMsg: '',
                success: false
            },
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

            // all the info to be retrieved
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
    inject: ['addSeen'],
    emits: ['cancelAdd'],
    created() {
        // =============================================
        // changing the color of button
        ipcRenderer.send('requestUserColor')
        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })

        // =============================================
        // getTopics
        ipcRenderer.send('getBulk', {type:'topic'})
        ipcRenderer.on('responseTopicGetBulk', (e,args) => {
            this.allTopics = args.topics
        })

        // =============================================
        // getTeachers
        ipcRenderer.send('getBulk', {type:'teacher', offset:1, number:500})
        ipcRenderer.on('responseTeacherGetBulk', (e,args) => {
            this.allTeachers = args.teachers
        })

        // =============================================
        // getClasses
        ipcRenderer.send('getBulk', {type: 'classRoom'})
        ipcRenderer.on('responseClassRoomGetBulk', (e,args) => {
            this.allClassrooms = args.classRooms
        })
    },
    methods: {
        processTopic() {
            let input = this.topic
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },
        processTeacher() {
            let input = this.teacher
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },
        processClassType() {
            let input = this.classType
            resetError(input)

            this.classRoom.active = input.value === 'actual';
            input.success = true
        },
        processClassRoom() {
            let input = this.classRoom
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },
        processTuition() {
            let input = this.tuition
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (shorterThan(input, 9)) {
                this.valid = false
            } else {
                input.success = true
            }
        },

        // process timeSlices
        processTimeSlices(value) {
            let input = this.timeSlices[value]
            resetError(input)
            if (isEmpty(input)) {
                this.valid = false
            } else
                input.success = true
        },


        processAll() {
            this.valid = true
            this.processTopic()
            this.processTeacher()
            this.processClassType()

            // only process classroom if it is active
            if (this.classRoom.active)
                this.processClassRoom()

            this.processTuition()

            for ([key, value] of Object.entries(this.timeSlices)) {
                if (this.weekdays[key]) {
                    this.processTimeSlices(key)
                }
            }
        },

        // ==================================================================================
        // final submit and sending the values
        // ==================================================================================
        submit() {
            this.processAll()
            if (this.valid) {

                let args = {
                    topic: this.topic.value,
                    teacher: this.teacher.value,
                    type: this.classType.value,
                    classRoom: this.classRoom.value,
                    tuition: this.tuition.value,
                    times: {

                    }
                }
                for ([key, value] of Object.entries(this.weekdays)) {
                    if (value) {
                        args.times[key] = this.timeSlices[key].value
                    }
                }

                console.log(args)

                ipcRenderer.send('classCreation', args)

                // clearing the fields for another creation
                // this.topic.value = ''
                // this.teacher.value = ''
                // this.classType.value = ''
                // this.classRoom.value = ''
                // this.tuition.value = ''
                // for ([key, value] of Object.entries(this.timeSlices)) {
                //     this.timeSlices[key].value = ''
                // }

                // resetting every field
                resetError(this.topic)
                resetError(this.teacher)
                resetError(this.classRoom)
                resetError(this.classType)
                resetError(this.tuition)
                for ([key, value] of Object.entries(this.timeSlices)) {
                    resetError(this.timeSlices[key])
                }

            }
        }


    },

    // ==================================================================================
    // Template
    // ==================================================================================
    template: `
      <section class="big-section rounded-tr-none" v-if="addSeen.value">
      <div class="full-edit-box">
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
      <!-- SELECTING TIME FOR THE CLASS     -->
      <!-- =======================================================================     -->
      <div class="px-4 flex w-full flex-row justify-start items-start flex-wrap" 
           v-if="(this.classRoom.value && this.classRoom.active) || this.classType.value === 'virtual'">
        <p class="text-sm flex-fullrow mb-4 border-b-2 pb-2 border-gray-300">
          زمان های برگذاری
        </p>

        <div class="flex-fullrow class-time-select">
          
          <div v-for="(value, name) in weekdays" class="mb-4">
            <div class="mb-2 p-2 bg-gray-200 w-full rounded-lg flex flex-nowrap items-center justify-between">
              <label :for="name" class="flex-1 cursor-pointer">{{ persianWeekdays[name] }} </label>
              <input :id="name" class="h-6 w-10 cursor-pointer" type="checkbox" value="saturday" v-model="weekdays[name]">
            </div>
            <div v-if="weekdays[name]">
              <span class="text-sm text-gray-600 mb-2 inline-block">بازه ی زمانی</span>
              <select class="common text-sm ltr" lang="en"
                      :class="{fail: timeSlices[name].err, success: timeSlices[name].success}"
                      v-model="timeSlices[name].value"
                      @change="processTimeSlices(name)">
                <option value="">انتخاب کنید</option>
                <option value="10" selected>8:00 am - 9:30 am</option>
              </select>
              <p class="input-error" v-if="timeSlices[name].err">{{ timeSlices[name].errMsg }}</p>
            </div>
          </div>


        </div>
      </div>
      <div class="px-4 flex items-end mt-10">
        <button class="btn btn-mid btn-primary ml-8" :class="'bg-'+ userColor.name +'-700'" v-on:click="submit">
          ایجاد کلاس
        </button>
        <button class="btn btn-mid btn-cancel" v-on:click="$emit('cancelAdd')">
          انصراف
        </button>
      </div>

      </section>
    `
}