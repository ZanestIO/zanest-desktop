const {ipcRenderer} = require('electron')
const Vue = require('vue')
const notListener = require('./notListener');
const notification = require('./components/notification')
const search_add = require('./components/search_add')

let students = {
    data() {
        return {

            // notification data
            notif: {
                seen: false,
                type: 'normal',
                title: '',
                body: '',
                contactAdmin: false
            }
        }
    },
    provide() {
        return {
            // providing for notifications
            title: Vue.computed(() => this.notif.title),
            seen: Vue.computed(() => this.notif.seen),
            type: Vue.computed(() => this.notif.type),
            body: Vue.computed(() => this.notif.body),
            contactAdmin: Vue.computed(() => this.notif.contactAdmin),
        }
    },
    components: {
        notification,
        search_add,

    },
    methods:  {
        // handles hiding the notification
        closeNot() {
            this.notif.seen = false
        },

        // sends request to go to student edit page
        openEditPage(sid) {
          ipcRenderer.send('load', {page: 'students_edit', id: sid, type: 'student'})
        }

    },
}

let app = Vue.createApp(students).mount("#main")

// setting up notification listeners
notListener(app)