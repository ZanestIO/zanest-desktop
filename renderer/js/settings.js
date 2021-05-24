const {ipcRenderer} = require('electron')
const Vue = require('vue')
const topics = require('./components/topics/topics')
const semesters = require('./components/semesters/semesters')
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