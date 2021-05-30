const {ipcRenderer} = require('electron')
const Vue = require('vue')
const topics = require('./components/topics/topics')
const semesters = require('./components/semesters/semesters')
const time_slices = require('./components/timeSlices/timeSlices')
const class_rooms = require('./components/classRooms/classRooms')
const footer_el = require('./components/footer')

let settings = {
    data() {
        return {
            activeMenu : 'topics',
            userColor: {
                name: 'purple',
                gradient: {
                    purple: 'from-purple-700 to-purple-900',
                    blue: 'from-blue-600 to-blue-900',
                    green: 'from-green-600 to-teal-900',
                    pink: 'from-pink-500 to-purple-900',
                },
                solid: {
                    purple: 'bg-purple-700',
                    blue: 'bg-blue-700',
                    green: 'bg-green-600',
                    pink: 'bg-pink-600',
                }
            }
        }
    },
    provide() {
        return {

        }
    },
    components: {
        topics,
        semesters,
        time_slices,
        class_rooms,
        footer_el,
    },
    created() {
        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })
    },
    methods: {
        changeActiveMenu(menu) {
            this.activeMenu = menu
        }
    }
}

let app = Vue.createApp(settings).mount("#main")