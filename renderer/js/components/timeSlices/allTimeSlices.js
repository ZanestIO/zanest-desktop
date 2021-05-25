const {ipcRenderer} = require('electron')
const confirm_alert = require('./../confirmAlert')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            deleteBox: {
                seen: false,
                title: 'آیا مطمئن هستید؟',
                desc: 'با تایید عملیات بازه زمانی از سیستم حذف خواهد شد',
                id: '',
                name: ''
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
    inject: ['allTimeSlices', 'currentlyEditing', 'currentlyShowing'],
    emits: ['refresh', 'edit-timeSlice', 'delete-timeSlice', 'show-timeSlice'],
    components: {
        confirm_alert,
    },
    methods: {
        // ==================================================================================
        // requesting delete timeSlice
        // ==================================================================================
        deleteTimeSlice(name, id) {
            this.deleteBox.seen = true
            this.deleteBox.name = name
            this.deleteBox.id = id
            this.deleteBox.desc = `با تایید عملیات بازه زمانی با نام  ${name} حذف خواهد شد`
        },
        confirm_delete() {
            this.deleteBox.seen = false
            ipcRenderer.send('timeSliceDeletion',  {id: this.deleteBox.id})
            this.$emit('delete-timeSlice', this.deleteBox.id)
            this.$emit('refresh')
        },
        cancelDelete() {
            this.deleteBox.seen = false
        },
        isClassActive(id) {
            return id === this.currentlyEditing.value || id === this.currentlyShowing.value;
        }

    },
    template:
        `
          <confirm_alert @confirm="confirm_delete" @cancel-box="cancelDelete"></confirm_alert>
          <section class="w-30p">
          
          <div class="main-section">
            <h2 class="mb-2">
              بازه های زمانی موجود
            </h2>
            <hr class="mb-4">
            <div class="section-content">
              <p v-if="!allTimeSlices.value[0]">تاکنون هیچ بازه زمانی اضافه نشده است.</p>
              <div  v-for="timeSlice in allTimeSlices.value" class="setting-item w-full cursor-pointer transition hover:bg-gray-400"
                    :class="{ 'setting-item-active'  : isClassActive( timeSlice.id ) }">
                            <span class="flex-1" @click="$emit('show-timeSlice', timeSlice.id)">
                                {{ timeSlice.startTime }}
                               - 
                              {{ timeSlice.finishTime }}
                            </span>
                <i class="far fa-edit text-2xl text-black ml-3 transform transition scale-100 hover:scale-125" @click="$emit('edit-timeSlice', timeSlice.id)"></i>
                <i class="far fa-times-circle text-pink-700 text-2xl transform transition scale-100 hover:scale-125" 
                   @click="deleteTimeSlice(timeSlice.startTime + ' - ' + timeSlice.finishTime, timeSlice.id)"></i>
              </div>
            </div>
          </div>
          </section>
        `
}