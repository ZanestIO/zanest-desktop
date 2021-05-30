const Vue = require('vue')
const edit_student = require('./components/students/edit_student')
const footer_el = require('./components/footer')

let students = {
    data() {
        return {}
    },
    components: {
        edit_student,
        footer_el,
    },
}

let app = Vue.createApp(students).mount("#main")
