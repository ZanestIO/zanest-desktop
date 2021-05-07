const {ipcRenderer} = require('electron')
const confirm_alert = require('./../confirmAlert')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            deleteBox: {
                seen: false,
                title: 'آیا مطمئن هستید؟',
                desc: 'با تایید عملیات کاربر با نام از سیستم حذف خواهد شد',
                userName: '',
            },
        }
    },
    provide() {
        return {
            seen: Vue.computed(() => this.deleteBox.seen),
            error: Vue.computed(() => this.deleteBox.title),
            error_desc: Vue.computed(() => this.deleteBox.desc),
        }
    },
    inject: ['allUsers', 'curentUser'],
    emits: ['refresh'],
    components: {
        confirm_alert,
    },
    created() {
    },
    methods: {
        // ==================================================================================
        // requesting delete user
        // ==================================================================================
        deleteUser(userName) {
            this.deleteBox.seen = true
            this.deleteBox.userName = userName
            this.deleteBox.desc = `با تایید عملیات کاربر با نام کاربری ${userName} حذف خواهد شد`
        },
        confirm_delete() {
            this.deleteBox.seen = false
            alert(this.deleteBox.userName)
            ipcRenderer.send('userDeletion',  {userName: this.deleteBox.userName})
            this.$emit('refresh')
        },
        cancelDelete() {
            this.deleteBox.seen = false
        }

    },
    template:
        `
          <confirm_alert @confirm="confirm_delete" @cancel-box="cancelDelete"></confirm_alert>
          <section class="w-40p ml-4">
          <div class="main-section">
            <div class="section-title-2">
              <h2>
                کاربرهای فعلی
              </h2>
              <hr>
            </div>
            <div class="section-content">
              
              <div v-for="user in allUsers.value" class="setting-item w-full setting-item-active">
                            <span>
                               {{ user.fullName }}
                              <span v-if="user.curentUser">(شما)</span>
                            </span>
                <span class="flex-1 mr-4 text-gray-500" v-if="user.userType === 'manager'">
                  مدیر
                </span>
                <span class="flex-1 mr-4 text-gray-500" v-else>
                  منشی
                </span>
                <i class="far fa-edit text-2xl text-black ml-3" @click="$emit('editUser', user.id)"></i>
                <i class="far fa-times-circle text-pink-700 text-2xl" v-if="user.id != curentUser.value" @click="deleteUser(user.userName)"></i>
              </div>
              
            </div>
          </div>
          </section>



        `
}