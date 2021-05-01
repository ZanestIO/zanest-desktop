const {ipcRenderer} = require('electron')
const Vue = require('vue')
const search_add = require('./components/search_add')
const add_student = require('./components/add_student')
const students_table = require('./components/students_table')

let students = {
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
        add_student,
        students_table,
    },
    methods:  {

        // sends request to go to student edit page
        openEditPage(sid) {
          ipcRenderer.send('load', {page: 'students_edit', id: sid, type: 'student', currentPage: 'students'})
        },
        addStudent() {
            this.addBox.seen = true
        },
        cancelAddStudent() {
            this.addBox.seen = false
        }

    },
}

let app = Vue.createApp(students).mount("#main")
