const Vue = require('vue')
const edit_teacher = require('./components/teachers/edit_teacher')
const footer_el = require('./components/footer')

let teachers = {
    data() {
        return {}
    },
    components: {
        edit_teacher,
        footer_el
    },
}

let app = Vue.createApp(teachers).mount("#main")
