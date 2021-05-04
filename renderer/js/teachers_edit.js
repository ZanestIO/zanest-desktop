const Vue = require('vue')
const edit_teacher = require('./components/teachers/edit_teacher')

let teachers = {
    data() {
        return {}
    },
    components: {
        edit_teacher,
    },
}

let app = Vue.createApp(teachers).mount("#main")
