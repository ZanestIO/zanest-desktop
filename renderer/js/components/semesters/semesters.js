const all_semesters = require('./allSemesters')
const add_semester = require('./addSemester')
const edit_semester = require('./editSemester')
const show_semester = require('./showSemester')
const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            editing: false,
            adding: false,
            showing: false,
            semesters: [],
            editingID: '',
            showingID: '',
        }
    },
    provide() {
        return {
            allSemesters: Vue.computed(() => this.semesters),
            currentlyEditing: Vue.computed(() => this.editingID),
            currentlyShowing: Vue.computed(() => this.showingID)
        }
    },
    components: {
        all_semesters,
        add_semester,
        edit_semester,
        show_semester,
    },
    created() {
        this.updateSemesters()
    },
    methods: {
        updateSemesters() {
            ipcRenderer.send('getBulk', {type: 'semester'})
            ipcRenderer.on('responseSemesterGetBulk', (e, args) => {
                this.semesters = args.semesters
                console.log(this.semesters)
            })
        },
        showAddSemester() {
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
        refreshSemesters() {
            setTimeout(() => {
                this.updateSemesters()
            }, 400)
        },
        semesterEdit(id) {
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
        semesterDelete(id) {
            if (this.editingID == id) {
                this.editing = false
                this.editingID = ''
            } else if (this.showingID == id) {
                this.showing = false
                this.showingID = ''
            }
        },
        showSemester(id) {
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
          <button v-if="!adding" class="add-topic btn btn-secondary btn-small" @click="showAddSemester">
            ترم جدید
            <i class="fas fa-plus"></i>
          </button>
          </section>
          <all_semesters @refresh="refreshSemesters" @edit-semester="semesterEdit" @delete-semester="semesterDelete"
                         @show-semester="showSemester"></all_semesters>
          <section class="w-30p">
          <show_semester v-if="showing"></show_semester>
          <add_semester v-if="adding" @cancel-add-semester="hideAdd" @refresh="refreshSemesters"></add_semester>
          <edit_semester v-if="editing" @refresh="refreshSemesters" @cancel-edit-semester="hideEdit"></edit_semester>
          </section>
          <section class="w-30p"></section>
        `
}