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
                value: 'virtual',
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
                value: '100000',
                errMsg: '',
                success: false
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

        },
        processClassType() {
            let input = this.classType
            resetError(input)

            this.classRoom.active = input.value === 'actual';
            input.success = true
        },
        processClassRoom() {

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


        processAll() {
            this.valid = true
            // this.processName()
        },

        // ==================================================================================
        // final submit and sending the values
        // ==================================================================================
        submit() {
            this.processAll()
            if (this.valid) {
                ipcRenderer.send('classCreation', {
                    fullName: this.name.value,

                })

                // clearing the fields for another creation
                // this.name.value = ''

                // resetting every field
                resetError(this.topic)

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
            <option value="">Family and Friends 1</option>
          </select>
          <p class="input-error" v-if="topic.err">{{ topic.errMsg }}</p>
        </div>

        <div class="flex-1/4">
          <span>
            استاد
          </span>
          <select :class="{fail: teacher.err, success: teacher.success}" v-model="teacher.value"
                  @change="processTeacher">
            <option value="">صادق شیخی</option>
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
            <option value="virtual">A0</option>
          </select>
          <p class="input-error" v-if="classRoom.err">{{ classRoom.errMsg }}</p>
        </div>


        <div class="flex-1/4 flex-fullrow">
          <span>
            شهریه (تومان)
          </span>
          <input type="number" :class="{fail: tuition.err, success: tuition.success}" v-model="tuition.value"
                 @change="processTuition" min="100000">
          <p class="input-error" v-if="tuition.err">{{ tuition.errMsg }}</p>
        </div>
      </div> <!-- ./full-edit-box -->

      <div class="px-4 flex w-full flex-row justify-start items-start flex-wrap">
        <p class="text-sm flex-fullrow mb-4 border-b-2 pb-2 border-gray-300">
          زمان های برگذاری
        </p>
        
        <div class="flex-fullrow class-time-select">
          <div>
            <div class="mb-2 p-2 bg-gray-200 w-full rounded-lg flex flex-nowrap items-center justify-between">
              <label for="saturday" class="flex-1">شنبه</label>
              <input id="saturday" class="h-6 w-10" type="checkbox" value="saturday">
            </div>
            <select class="common text-sm" :class="{fail: tuition.err, success: tuition.success}" v-model="tuition.value"
                    @change="processTuition">
              <option value="1" selected>8:00 am - 9:30 am</option>
            </select>
            <p class="input-error" v-if="tuition.err">{{ tuition.errMsg }}</p>
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