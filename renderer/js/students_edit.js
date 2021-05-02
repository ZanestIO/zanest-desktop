const Vue = require('vue')
const edit_student = require('./components/students/edit_student')

let students = {
    data() {
        return {}
    },
    components: {
        edit_student,
    },
}

let app = Vue.createApp(students).mount("#main")
