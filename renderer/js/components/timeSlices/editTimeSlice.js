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
            startTime: {
                hour: {
                    value: '8',
                },
                minute: {
                    value: '00',
                },
                am: {
                    value: 'am'
                }
            },
            finishTime: {
                hour: {
                    value: '9',
                },
                minute: {
                    value: '30',
                },
                am: {
                    value: 'am'
                }
            },
        }

    },
    inject: ['currentlyEditing'],
    emit: ['cancel-edit-timeSlice', 'refresh'],
    created() {
        ipcRenderer.send('getTimeSliceInfo', {id: this.currentlyEditing.value})

        ipcRenderer.on('responseGetTimeSliceInfo', (e, args) => {
            this.id = args.id

            // dismantling times
            let stime = this.convert24To12(args.startTime)
            let ftime = this.convert24To12(args.finishTime)

            this.startTime.hour.value = stime[0]
            this.startTime.minute.value = stime[1]
            this.startTime.am.value = stime[2]

            this.finishTime.hour.value = ftime[0]
            this.finishTime.minute.value = ftime[1]
            this.finishTime.am.value = ftime[2]


        })
    },
    components: {},
    methods: {
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
            let suffix = hour >= 12 ? "pm" : "am";
            hour = (((hour + 11) % 12) + 1)
            return [hour, minute, suffix]
        },

        // ==========================================================
        // Add TimeSlice To Database
        editTimeSliceInfo() {
            this.valid = true
            if (this.valid) {

                // assembling times
                let sTime = `${this.startTime.hour.value}:${this.startTime.minute.value} ${this.startTime.am.value}`
                let fTime = `${this.finishTime.hour.value}:${this.finishTime.minute.value} ${this.finishTime.am.value}`
                // converting to 24h format
                sTime = this.convertTime12to24(sTime)
                fTime = this.convertTime12to24(fTime)

                let args = {
                    id: this.id,
                    startTime: sTime,
                    finishTime: fTime,
                }

                ipcRenderer.send('timeSliceUpdate', args)
                ipcRenderer.on('responseTimeSliceUpdate', (e, args) => {
                    // if timeSlice created successfully reset all fields
                    if (args) {
                        // refreshing the list of all timeSlices
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
              ایجاد بازه زمانی جدید
            </h2>
            <hr class="mb-4">
          </div>

          <div class="section-content">

            <!-- start of the timeSlice -->
            <div class="mb-4 flex-fullrow">
              <span class="text-sm text-gray-500 mb-4">زمان شروع *</span>
              <div class="w-70 px-2 bg-white rounded-lg text-center mt-2" style="border-bottom: 4px solid #8a8a8a;">
                <div class="flex flex-row-reverse">
                  <select name="hours" class="bg-transparent text-xl p-4 appearance-none hover:bg-gray-200 outline-none"
                          v-model="startTime.hour.value">
                    <option v-for="n in 12" :value="n">{{ n }}</option>
                  </select>
                  <span class="text-xl mr-3 p-4">:</span>
                  <select name="minutes"
                          class="bg-transparent p-4 text-xl appearance-none hover:bg-gray-200 outline-none mr-4"
                          v-model="startTime.minute.value">
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <select name="ampm" class="bg-transparent p-4 text-xs appearance-none hover:bg-gray-200 outline-none"
                          v-model="startTime.am.value">
                    <option value="am">قبل از ظهر</option>
                    <option value="pm">بعد از ظهر</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- start of the timeSlice -->
            <div class="mb-4 flex-fullrow">
              <span class="text-sm text-gray-500 mb-4">زمان پایان *</span>
              <div class="w-70 px-2 bg-white rounded-lg text-center mt-2" style="border-bottom: 4px solid #8a8a8a;">
                <div class="flex flex-row-reverse">
                  <select name="hours" class="bg-transparent text-xl p-4 appearance-none hover:bg-gray-200 outline-none"
                          v-model="finishTime.hour.value">
                    <option v-for="n in 12" :value="n">{{ n }}</option>
                  </select>
                  <span class="text-xl mr-3 p-4">:</span>
                  <select name="minutes"
                          class="bg-transparent p-4 text-xl appearance-none hover:bg-gray-200 outline-none mr-4"
                          v-model="finishTime.minute.value">
                    <option value="0">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <select name="ampm" class="bg-transparent p-4 text-xs appearance-none hover:bg-gray-200 outline-none"
                          v-model="finishTime.am.value">
                    <option value="am">قبل از ظهر</option>
                    <option value="pm">بعد از ظهر</option>
                  </select>
                </div>
              </div>
            </div>


            <div class="p-2 pt-2 flex">
              <a href="#"
                 class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
                 v-on:click="editTimeSliceInfo">ایجاد بازه</a>
              <a href="#"
                 class="w-1/2 px-4 py-3 ml-2 mr-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
                 v-on:click="$emit('cancel-edit-timeSlice')">انصراف</a>
            </div>
          </div>
          </div>
        `
}