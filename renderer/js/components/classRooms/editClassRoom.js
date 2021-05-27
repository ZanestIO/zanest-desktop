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
            capacity: {
                err: false,
                value: '30',
                errMsg: '',
                success: false,
            }
        }

    },
    inject: ['currentlyEditing'],
    emit: ['cancel-edit-classRoom', 'refresh'],
    created() {
        ipcRenderer.send('getClassRoomInfo', {id: this.currentlyEditing.value})

        ipcRenderer.on('responseGetClassRoomInfo', (e, args) => {
            this.name.value = args.name
            this.id = args.id
            this.capacity.value = args.capacity
        })
    },
    components: {},
    methods: {
        // ==========================================================
        // process name
        processName() {
            let input = this.name
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (shorterThan(input, 30)) {
                this.valid = false

            } else {
                input.success = true
            }
        },

        processCapacity() {
            let input = this.capacity
            resetError(input)

            if (isEmpty(input)) {
                this.valid = false
            } else if (smallerThan(input, 1)) {
                this.valid = false
            } else if (biggerThan(input, 100)) {
                this.valid = false
            } else {
                input.success = true
            }
        },


        // ==========================================================
        // Add ClassRoom To Database
        editClassRoomInfo() {
            this.valid = true
            this.processName()
            this.processCapacity()

            if (this.valid) {
                let args = {
                    id: this.id,
                    name: this.name.value,
                    capacity: this.capacity.value,
                }

                ipcRenderer.send('classRoomUpdate', args)
                ipcRenderer.on('responseClassRoomUpdate', (e, args) => {
                    // if classRoom created successfully reset all fields
                    if (args) {
                        // refreshing the list of all classRooms
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
              ویرایش کلاس
            </h2>
            <hr class="mb-4">
          </div>

          <!--          name of the classRoom -->
          <div class="mb-4 flex-fullrow">
            <p class="text-sm text-gray-500 mb-2">نام کلاس *</p>
            <input v-bind:class="{fail: name.err, success: name.success}" type="text" class="p-4 common"
                   placeholder="" @change="processName" v-model="name.value" maxlength="30">
            <p class="input-error" v-if="name.err">{{ name.errMsg }}</p>
          </div>

          <div class="mb-4 flex-fullrow">
            <p class="text-sm text-gray-500 mb-2">ظرفیت کلاس *</p>
            <input v-bind:class="{fail: capacity.err, success: capacity.success}" type="number" class="p-4 common"
                   placeholder="" @change="processCapacity" v-model="capacity.value" min="1" max="100">
            <p class="input-error" v-if="capacity.err">{{ capacity.errMsg }}</p>
          </div>


          <div class="p-2 pt-2 flex">
            <a href="#"
               class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
               v-on:click="editClassRoomInfo">ویرایش کلاس</a>
            <a href="#"
               class="w-1/2 px-4 py-3 ml-2 mr-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm"
               v-on:click="$emit('cancel-edit-classRoom')">انصراف</a>
          </div>
          </div>
        `
}