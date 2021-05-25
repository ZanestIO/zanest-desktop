const {ipcRenderer} = require('electron')
const Vue = require('vue')
const topics = require('./components/topics/topics')
const semesters = require('./components/semesters/semesters')
const time_slices = require('./components/timeSlices/timeSlices')
const class_rooms = require('./components/classRooms/classRooms')
let settings = {
    data() {
        return {
            activeMenu : 'topics',
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
    },
    created() {

    },
    methods: {
        changeActiveMenu(menu) {
            this.activeMenu = menu
        }
    }
}

let app = Vue.createApp(settings).mount("#main")