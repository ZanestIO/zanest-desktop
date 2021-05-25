const {ipcRenderer} = require('electron')
const confirm_alert = require('./../confirmAlert')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            deleteBox: {
                seen: false,
                title: 'آیا مطمئن هستید؟',
                desc: 'با تایید عملیات کلاس از سیستم حذف خواهد شد',
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
    inject: ['allClassRooms', 'currentlyEditing', 'currentlyShowing'],
    emits: ['refresh', 'edit-classRoom', 'delete-classRoom', 'show-classRoom'],
    components: {
        confirm_alert,
    },
    methods: {
        // ==================================================================================
        // requesting delete classRoom
        // ==================================================================================
        deleteClassRoom(name, id) {
            this.deleteBox.seen = true
            this.deleteBox.name = name
            this.deleteBox.id = id
            this.deleteBox.desc = `با تایید عملیات کلاس با نام  ${name} حذف خواهد شد`
        },
        confirm_delete() {
            this.deleteBox.seen = false
            ipcRenderer.send('classRoomDeletion',  {id: this.deleteBox.id})
            this.$emit('delete-classRoom', this.deleteBox.id)
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
              کلاس های فیزیکی موجود
            </h2>
            <hr class="mb-4">
            <div class="section-content">
              <p v-if="!allClassRooms.value[0]">تاکنون هیچ کلاسی اضافه نشده است.</p>
              <div  v-for="classRoom in allClassRooms.value" class="setting-item w-full cursor-pointer transition hover:bg-gray-400"
                    :class="{ 'setting-item-active'  : isClassActive( classRoom.id ) }">
                            <span class="flex-1" @click="$emit('show-classRoom', classRoom.id)">
                                {{ classRoom.name }}
                               - 
                              {{ classRoom.capacity }}
                            </span>
                <i class="far fa-edit text-2xl text-black ml-3 transform transition scale-100 hover:scale-125" @click="$emit('edit-classRoom', classRoom.id)"></i>
                <i class="far fa-times-circle text-pink-700 text-2xl transform transition scale-100 hover:scale-125"  @click="deleteClassRoom(classRoom.year, classRoom.id)"></i>
              </div>
            </div>
          </div>
          </section>
        `
}