const {ipcRenderer} = require('electron')
const Vue = require('vue')
const topics = require('./components/topics/topics')
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