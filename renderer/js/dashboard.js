const Vue = require('vue')
const footer_el = require('./components/footer')

let students = {
    data() {
        return {}
    },
    components: {
        footer_el
    },
}

let app = Vue.createApp(students).mount("#main")
