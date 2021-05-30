const {ipcRenderer} = require('electron')
const Vue = require('vue')
const search_add = require('./components/teachers/search_add')
const add_teacher = require('./components/teachers/add_teacher')
const teachers_table = require('./components/teachers/teachers_table')
const footer_el = require('./components/footer')

let teachers = {
    data() {
        return {
            addBox: {
                seen: false
            }
        }
    },
    provide() {
        return {
            addSeen: Vue.computed(() => this.addBox.seen)
        }
    },
    components: {
        search_add,
        add_teacher,
        teachers_table,
        footer_el,
    },
    methods:  {

        // sends request to go to teacher edit page
        openEditPage(sid) {
            ipcRenderer.send('load', {page: 'teachers_edit', id: sid, type: 'teacher', currentPage: 'teachers'})
        },
        addTeacher() {
            this.addBox.seen = true
        },
        cancelAddTeacher() {
            this.addBox.seen = false
        }

    },
}

let app = Vue.createApp(teachers).mount("#main")
