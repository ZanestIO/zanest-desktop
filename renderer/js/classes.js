const {ipcRenderer} = require('electron')
const Vue = require('vue')
const search_add = require('./components/classes/search_add')
const add_class = require('./components/classes/add_class')
const classes_table = require('./components/classes/classes_table')

let classes = {
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
        add_class,
        classes_table,
    },
    methods:  {

        // sends request to go to class edit page
        openEditPage(sid) {
            ipcRenderer.send('load', {page: 'classes_edit', id: sid, type: 'class', currentPage: 'classes'})
        },
        addClass() {
            this.addBox.seen = true
        },
        cancelAddClass() {
            this.addBox.seen = false
        }

    },
}

let app = Vue.createApp(classes).mount("#main")
