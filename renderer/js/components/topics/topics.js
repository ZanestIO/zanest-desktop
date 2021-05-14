const all_topics = require('./allTopics')
const add_topic = require('./addTopic')
const edit_topic = require('./editTopic')
const show_topic = require('./showTopic')
const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            editing: false,
            adding: false,
            showing: false,
            topics: [],
            editingID: '',
            showingID: '',
        }
    },
    provide() {
        return {
            allTopics: Vue.computed(() => this.topics),
            currentlyEditing: Vue.computed(() => this.editingID),
            currentlyShowing: Vue.computed(() => this.showingID)
        }
    },
    components: {
        all_topics,
        add_topic,
        edit_topic,
        show_topic,
    },
    created() {
        this.updateTopics()
    },
    methods: {
        updateTopics() {
            ipcRenderer.send('getBulk', {type: 'topic'})
            ipcRenderer.on('responseTopicGetBulk', (e, args) => {
                this.topics = args.topics
            })
        },
        showAddTopic() {
            this.editing = false
            this.showing = false
            this.adding = true
            this.editingID = false

        },
        hideAdd() {
            this.adding = false
        },
        hideEdit() {
            this.editing = false
            this.editingID = ''
        },
        refreshTopics() {
            setTimeout(() => {
                this.updateTopics()
            }, 400)
        },
        topicEdit(id) {
            this.editing = false
            this.editingID = ''
            setTimeout(() => {
                this.adding = false
                this.showing = false
                this.showingID = false
                this.editing = true
                this.editingID = id
            }, 100)
        },
        topicDelete(id) {
            if (this.editingID == id) {
                this.editing = false
                this.editingID = ''
            } else if (this.showingID == id) {
                this.showing = false
                this.showingID = ''
            }
        },
        showTopic(id) {
            this.showingID = ''
            this.showing = false

            setTimeout(() => {
                this.editing = false
                this.editingID = ''
                this.adding = false
                this.showingID = id
                this.showing = true
            }, 100)

        }
    },
    template:
    `
      <section class="flex-fullrow relative bottom-6 pr-12">
      <button v-if="!adding" class="add-topic btn btn-secondary btn-small" @click="showAddTopic">
        سرفصل جدید
        <i class="fas fa-plus"></i>
      </button>
      </section>
    <all_topics @refresh="refreshTopics" @edit-topic="topicEdit" @delete-topic="topicDelete" @show-topic="showTopic"></all_topics>
    <section class="w-30p">
    <show_topic v-if="showing"></show_topic>
    <add_topic v-if="adding" @cancel-add-topic="hideAdd" @refresh="refreshTopics"></add_topic>
    <edit_topic v-if="editing" @refresh="refreshTopics" @cancel-edit-topic="hideEdit"></edit_topic>
    </section>
      <section class="w-30p"></section>
    
    `
}