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
            name: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            level: {
                err: false,
                value: 'Elementary',
                errMsg: '',
                success: false,
            },
            length: {
                err: false,
                value: '1',
                errMsg: '',
                success: false,
            },
            desc: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            }
        }

    },
    emit: ['cancel-add-topic', 'refresh'],
    components: {},
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
        // processLevel
        processLevel() {
            let input = this.level
            resetError(input)
            input.success = true
        },
        // ==========================================================
        // process length
        processLength() {
            let input = this.length
            resetError(input)
            input.success = true
        },
        // ==========================================================
        // process desc
        processDesc() {
            let input = this.desc
            resetError(input)

            if (shorterThan(input, 256)) {
                this.valid = false
            } else {
                input.sucess = true
            }
        },

        // ==========================================================
        // Add Topic To Database
        addTopicInfo() {
            this.valid = true
            this.processName()
            this.processLevel()
            this.processLength()
            this.processDesc()


            if (this.valid) {
                let args = {
                    name: this.name.value,
                    level: this.level.value,
                    length: this.length.value,
                    desc: this.desc.value,
                }

                ipcRenderer.send('topicCreation', args)
                ipcRenderer.on('responseTopicCreation', (e, args) => {
                    if (args) {
                        this.name.value = ''
                        this.name.success = false

                        this.level.value = ''
                        this.level.success = false

                        this.length.value = ''
                        this.length.success = false

                        this.desc.value = ''
                        this.desc.success = false

                        // refreshing the list of all topics
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
              ایجاد سرفصل جدید
            </h2>
            <hr class="mb-4">
          </div>

          <div class="section-content">
            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">نام سرفصل *</p>
              <input lang="en" v-bind:class="{fail: name.err, success: name.success}" type="text" class="p-4 common"
                      placeholder="نام شما" @change="processName" v-model="name.value" max="50">
              <p class="input-error" v-if="name.err">{{ name.errMsg }}</p>
            </div>
            
            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">سطح *</p>
              <select v-bind:class="{fail: level.err, success: level.success}" class="p-4 common" 
                      @focusout="processLevel" v-model="level.value">
                <option value="Pre-Elementary">Pre-Elementary</option>
                <option value="Elementary">Elementary</option>
                <option value="Pre-Intermediate">Pre-Intermediate</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Proficient">Proficient</option>
              </select>
              <p class="input-error" v-if="level.err">{{ level.errMsg }}</p>
            </div>
            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">طول پیشنهادی (ترم) *</p>
              <select v-bind:class="{fail: length.err, success: length.success}" class="p-4 common"
                      @focusout="processLength" v-model="length.value">
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              <p class="input-error" v-if="length.err">{{ length.errMsg }}</p>
            </div>

            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">
                توضیحات :
              </p>
              <br>
              <textarea v-bind:class="{fail: desc.err, success: desc.success}" class="p-4 common w-full"
                        @focusout="processDesc" v-model="desc.value" >
                            </textarea>
              <p class="input-error" v-if="desc.err">{{ desc.errMsg }}</p>
            </div>

            <div class="p-2 pt-2 flex">
              <a href="#"
                 class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
                 v-on:click="addTopicInfo">ایجاد سرفصل</a>
              <a href="#"
                 class="w-1/2 px-4 py-3 ml-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
                 v-on:click="$emit('cancel-add-topic')">انصراف</a>

            </div>
          </div>
          </div>

        `
}