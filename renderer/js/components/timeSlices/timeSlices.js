const all_timeSlices = require('./allTimeSlices')
const add_timeSlice = require('./addTimeSlice')
const edit_timeSlice = require('./editTimeSlice')
const show_timeSlice = require('./showTimeSlice')
const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            editing: false,
            adding: false,
            showing: false,
            timeSlices: [],
            editingID: '',
            showingID: '',
        }
    },
    provide() {
        return {
            allTimeSlices: Vue.computed(() => this.timeSlices),
            currentlyEditing: Vue.computed(() => this.editingID),
            currentlyShowing: Vue.computed(() => this.showingID)
        }
    },
    components: {
        all_timeSlices,
        add_timeSlice,
        edit_timeSlice,
        show_timeSlice,
    },
    created() {
        this.updateTimeSlices()
    },
    methods: {
        updateTimeSlices() {
            ipcRenderer.send('getBulk', {type: 'timeSlice'})
            ipcRenderer.on('responseTimeSliceGetBulk', (e, args) => {
                this.timeSlices = args.timeSlices
                console.log(this.timeSlices)
            })
        },
        showAddTimeSlice() {
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
        refreshTimeSlices() {
            setTimeout(() => {
                this.updateTimeSlices()
            }, 400)
        },
        timeSliceEdit(id) {
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
        timeSliceDelete(id) {
            if (this.editingID == id) {
                this.editing = false
                this.editingID = ''
            } else if (this.showingID == id) {
                this.showing = false
                this.showingID = ''
            }
        },
        showTimeSlice(id) {
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
          <button v-if="!adding" class="add-topic btn btn-secondary btn-small" @click="showAddTimeSlice">
            بازه زمانی جدید
            <i class="fas fa-plus"></i>
          </button>
          </section>
          <all_timeSlices @refresh="refreshTimeSlices" @edit-timeSlice="timeSliceEdit" @delete-timeSlice="timeSliceDelete"
                         @show-timeSlice="showTimeSlice"></all_timeSlices>
          <section class="w-30p">
          <show_timeSlice v-if="showing"></show_timeSlice>
          <add_timeSlice v-if="adding" @cancel-add-timeSlice="hideAdd" @refresh="refreshTimeSlices"></add_timeSlice>
          <edit_timeSlice v-if="editing" @refresh="refreshTimeSlices" @cancel-edit-timeSlice="hideEdit"></edit_timeSlice>
          </section>
          <section class="w-30p"></section>
        `
}