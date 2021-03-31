const {ipcRenderer} = require('electron')
const Vue = require('vue')
const notListener = require('./notListener');
const notification = require('./components/notification')
const edit_student = require('./components/edit_student')


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
            },
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
        edit_student,
    },
    methods:  {
        // handles hiding the notification
        closeNot() {
            this.notif.seen = false
        },
    },
}

let app = Vue.createApp(students).mount("#main")

// setting up notification listeners
notListener(app)