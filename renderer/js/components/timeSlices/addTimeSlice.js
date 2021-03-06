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
    emit: ['cancel-add-timeSlice', 'refresh'],
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

        // ==========================================================
        // Add TimeSlice To Database
        addTimeSliceInfo() {
            this.valid = true
            if (this.valid) {

                // assembling times
                let sTime = `${this.startTime.hour.value}:${this.startTime.minute.value} ${this.startTime.am.value}`
                let fTime = `${this.finishTime.hour.value}:${this.finishTime.minute.value} ${this.finishTime.am.value}`
                // converting to 24h format
                sTime = this.convertTime12to24(sTime)
                fTime = this.convertTime12to24(fTime)

                let args = {
                    startTime: sTime,
                    finishTime: fTime,
                }

                ipcRenderer.send('timeSliceCreation', args)
                ipcRenderer.on('responseTimeSliceCreation', (e, args) => {
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
              ?????????? ???????? ?????????? ????????
            </h2>
            <hr class="mb-4">
          </div>

          <div class="section-content">

            <!-- start of the timeSlice -->
            <div class="mb-4 flex-fullrow">
              <span class="text-sm text-gray-500 mb-4">???????? ???????? *</span>
              <div class="w-70 px-2 bg-white rounded-lg text-center mt-2" style="border-bottom: 4px solid #8a8a8a;">
                <div class="flex flex-row-reverse">
                  <select name="hours" class="bg-transparent text-xl p-4 appearance-none hover:bg-gray-200 outline-none"
                          v-model="startTime.hour.value">
                    <option v-for="n in 12" :value="n">{{ n }}</option>
                  </select>
                  <span class="text-xl mr-3 p-4">:</span>
                  <select name="minutes" class="bg-transparent p-4 text-xl appearance-none hover:bg-gray-200 outline-none mr-4"
                          v-model="startTime.minute.value">
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <select name="ampm" class="bg-transparent p-4 text-xs appearance-none hover:bg-gray-200 outline-none"
                  v-model="startTime.am.value">
                    <option value="am">?????? ???? ??????</option>
                    <option value="pm">?????? ???? ??????</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- start of the timeSlice -->
            <div class="mb-4 flex-fullrow">
              <span class="text-sm text-gray-500 mb-4">???????? ?????????? *</span>
              <div class="w-70 px-2 bg-white rounded-lg text-center mt-2" style="border-bottom: 4px solid #8a8a8a;">
                <div class="flex flex-row-reverse">
                  <select name="hours" class="bg-transparent text-xl p-4 appearance-none hover:bg-gray-200 outline-none"
                          v-model="finishTime.hour.value">
                    <option v-for="n in 12" :value="n">{{ n }}</option>
                  </select>
                  <span class="text-xl mr-3 p-4">:</span>
                  <select name="minutes" class="bg-transparent p-4 text-xl appearance-none hover:bg-gray-200 outline-none mr-4"
                          v-model="finishTime.minute.value">
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <select name="ampm" class="bg-transparent p-4 text-xs appearance-none hover:bg-gray-200 outline-none"
                          v-model="finishTime.am.value">
                    <option value="am">?????? ???? ??????</option>
                    <option value="pm">?????? ???? ??????</option>
                  </select>
                </div>
              </div>
            </div>
            
            


              <div class="p-2 pt-2 flex">
                <a href="#"
                   class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
                   v-on:click="addTimeSliceInfo">?????????? ????????</a>
                <a href="#"
                   class="w-1/2 px-4 py-3 ml-2 mr-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
                   v-on:click="$emit('cancel-add-timeSlice')">????????????</a>
              </div>
            </div>
          </div>
        `
}