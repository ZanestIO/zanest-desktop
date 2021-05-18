const {ipcRenderer} = require('electron')
const confirm_alert = require('./../confirmAlert')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            deleteBox: {
                seen: false,
                title: 'آیا مطمئن هستید؟',
                desc: 'با تایید عملیات سرفصل از سیستم حذف خواهد شد',
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
    inject: ['allTopics', 'currentlyEditing', 'currentlyShowing'],
    emits: ['refresh', 'edit-topic', 'delete-topic', 'show-topic'],
    components: {
        confirm_alert,
    },
    methods: {
        // ==================================================================================
        // requesting delete topic
        // ==================================================================================
        deleteTopic(name, id) {
            this.deleteBox.seen = true
            this.deleteBox.name = name
            this.deleteBox.id = id
            this.deleteBox.desc = `با تایید عملیات سرفصل با نام  ${name} حذف خواهد شد`
        },
        confirm_delete() {
            this.deleteBox.seen = false
            ipcRenderer.send('topicDeletion',  {id: this.deleteBox.id})
            this.$emit('delete-topic', this.deleteBox.id)
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
              سرفصل های موجود
            </h2>
            <hr class="mb-4">
            <div class="section-content">
              <p v-if="!allTopics.value[0]">تاکنون سرفصلی اضافه نشده است.</p>
              <div  v-for="topic in allTopics.value" class="setting-item w-full cursor-pointer transition hover:bg-gray-400" :class="{ 'setting-item-active'  : isClassActive( topic.id ) }">
                            <span class="flex-1" @click="$emit('show-topic', topic.id)">
                                {{ topic.name }}
                            </span>
                <i class="far fa-edit text-2xl text-black ml-3 transform transition scale-100 hover:scale-125" @click="$emit('edit-topic', topic.id)"></i>
                <i class="far fa-times-circle text-pink-700 text-2xl transform transition scale-100 hover:scale-125"  @click="deleteTopic(topic.name, topic.id)"></i>
              </div>
            </div>
          </div>
          
          </section>
        `
}