const {ipcRenderer} = require('electron')
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
const Vue = require('vue')

module.exports = {
    data() {
        return {
            changed: false,
            valid: true,
            name: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            address: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            },
            phone: {
                err: false,
                value: '',
                errMsg: '',
                success: false,
            }
        }
    },
    inject: [],
    emits: [],
    components: {},
    created() {
        ipcRenderer.send('getInstitutionInfo')
        ipcRenderer.on('responseGetInstitutionInfo', (e, args) => {
            this.name.value = args.name
            this.address.value = args.address
            this.phone.value = args.phoneNumber
        })
    },
    methods: {
        // ==========================================================
        // process name
        processName() {
            this.changed = true
            let input = this.name
            resetError(input)

            if (longerThan(input, 3)) {
                this.valid = false
            } else {
                input.success = true
            }
        },
        // ==========================================================
        processAddress() {
            this.changed = true
            let input = this.address
            resetError(input)

            if (input.value === '') {

            } else
                input.success = true
        },
        // ==========================================================
        processPhone() {
            this.changed = true
            let input = this.phone
            resetError(input)

            if (input.value === '') {

            } else if (isNumber(input)) {
                this.valid = false
            } else if (exact(input, 11)) {
                this.valid = false
            } else
                input.success = true
        },

        updateInstitution() {
            if (!this.changed)
                return

            this.valid = true
            this.processName()
            this.processAddress()
            this.processPhone()

            if (this.valid) {
                let args = {
                    name: this.name.value,
                    phoneNumber: this.phone.value,
                    address: this.address.value,
                }
                ipcRenderer.send('institutionUpdate', args)
            }

        }

    },
    template:
        `
          <div class="main-section">
          <div class="section-title-2">
            <h2>
              ???????????? ????????????????
            </h2>
            <hr>
          </div>

          <div class="section-content">
            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">
                ?????? ????????????????
              </p>
              <input type="text" class="common p-4" v-bind:class="{fail: name.err, success: name.success}"
                     v-model="name.value" placeholder="?????? ???????????????? ?????? ???? ?????????? ????????" max="100" @change="processName">
              <p class="input-error" v-if="name.err">{{ name.errMsg }}</p>
            </div>

            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">
                ????????
              </p>
              <input type="text" class="common p-4" v-bind:class="{fail: address.err, success: address.success}"
                     v-model="address.value" placeholder="???????? ?????????? ???????? ????????" max="255" @change="processAddress">
              <p class="input-error" v-if="address.err">{{ address.errMsg }}</p>
            </div>

            <div class="mb-4 flex-fullrow">
              <p class="text-sm text-gray-500 mb-2">
                ?????????? ????????
              </p>
              <input type="text" class="common p-4" v-bind:class="{fail: phone.err, success: phone.success}"
                     v-model="phone.value" placeholder="?????????? ?????????? ?????? ????????" max="255" @change="processPhone">
              <p class="input-error" v-if="phone.err">{{ phone.errMsg }}</p>
            </div>
          </div>

          <div class="p-2 pt-2 flex">
            <a href="#"
               class="w-1/2 px-4 py-3 text-center text-pink-100 bg-purple-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
               :class="{'bg-gray-300 hover:bg-gray-300 cursor-not-allowed': !changed}" @click="updateInstitution">
              ????????????
            </a>
          </div>
          </div>
        `
}

