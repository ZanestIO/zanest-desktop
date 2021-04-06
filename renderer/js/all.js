const {ipcRenderer} = require('electron')
const secondary_menu = require('./components/secondary_menu')
const primary_menu = require('./components/primary_menu')
const notification = require('./components/notification')
const notListener = require('./notListener')
const footer_el = require('./components/footer')
const Vue = require('vue')

// ==================================================================================
// MENU COMPONENT IN EVERY PAGE
// ==================================================================================
let menuComponent = {
    data() {
        return{
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
        primary_menu,
        secondary_menu,
        notification,
        footer_el
    },
    methods: {
        requestPage(pageName) {
            ipcRenderer.send('load', {page: pageName})
        },

        // handles hiding the notification
        closeNot() {
            this.notif.seen = false
        },
    }
}

let menuApp = Vue.createApp(menuComponent).mount('#menu-holder')


// setting up notification listeners
notListener(menuApp)