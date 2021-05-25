const all_classRooms = require('./allClassRooms')
const add_classRoom = require('./addClassRoom')
const edit_classRoom = require('./editClassRoom')
const show_classRoom = require('./showClassRoom')
const institution = require('./institution')
const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            editing: false,
            adding: false,
            showing: false,
            classRooms: [],
            editingID: '',
            showingID: '',
        }
    },
    provide() {
        return {
            allClassRooms: Vue.computed(() => this.classRooms),
            currentlyEditing: Vue.computed(() => this.editingID),
            currentlyShowing: Vue.computed(() => this.showingID)
        }
    },
    components: {
        all_classRooms,
        add_classRoom,
        edit_classRoom,
        show_classRoom,
        institution,
    },
    created() {
        this.updateClassRooms()
    },
    methods: {
        updateClassRooms() {
            ipcRenderer.send('getBulk', {type: 'classRoom'})
            ipcRenderer.on('responseClassRoomGetBulk', (e, args) => {
                this.classRooms = args.classRooms
                console.log(this.classRooms)
            })
        },
        showAddClassRoom() {
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
        refreshClassRooms() {
            setTimeout(() => {
                this.updateClassRooms()
            }, 400)
        },
        classRoomEdit(id) {
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
        classRoomDelete(id) {
            if (this.editingID == id) {
                this.editing = false
                this.editingID = ''
            } else if (this.showingID == id) {
                this.showing = false
                this.showingID = ''
            }
        },
        showClassRoom(id) {
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
          <button v-if="!adding" class="add-topic btn btn-secondary btn-small" @click="showAddClassRoom">
            کلاس فیزیکی جدید
            <i class="fas fa-plus"></i>
          </button>
          </section>
          <all_classRooms @refresh="refreshClassRooms" @edit-classRoom="classRoomEdit" @delete-classRoom="classRoomDelete"
                         @show-classRoom="showClassRoom"></all_classRooms>
          <section class="w-30p">
          <show_classRoom v-if="showing"></show_classRoom>
          <add_classRoom v-if="adding" @cancel-add-classRoom="hideAdd" @refresh="refreshClassRooms"></add_classRoom>
          <edit_classRoom v-if="editing" @refresh="refreshClassRooms" @cancel-edit-classRoom="hideEdit"></edit_classRoom>
          </section>
          <section class="w-30p">
          <institution></institution>
          </section>
        `
}