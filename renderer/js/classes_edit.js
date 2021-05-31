const Vue = require('vue')
const edit_class = require('./components/classes/edit_class')
const footer_el = require('./components/footer')
const classes_table = require('./components/classes/classes_table')
const manage_students = require('./components/classes/manage_students')
const manage_tuition = require('./components/classes/manage_tuition')
const manage_grades = require('./components/classes/manage_grades')
const {ipcRenderer} = require('electron')
let classes_edit = {
    data() {
        return {
            activeSetting: '',
            id: '',
        }
    },
    provide() {
        return {
            classId: Vue.computed(() => this.id),
        }
    },
    created() {
        ipcRenderer.on('getClassInfo', (e, args) => {
            this.id = args.id
        })
    },
    components: {
        edit_class,
        footer_el,
        classes_table,
        manage_students,
        manage_tuition,
        manage_grades,
    },
    methods: {
        changeSetting(value) {
            this.activeSetting = value
        }
    }
}

let app = Vue.createApp(classes_edit).mount("#main")