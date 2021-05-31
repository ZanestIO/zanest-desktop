const {ipcRenderer} = require('electron')
const search_to_add = require('./students/search')
const all_students = require('./students/all')
module.exports = {
    data() {
        return {

        }
    },
    props: [],
    inject: ['classId',],
    emits: [],
    beforeCreate() {
    },
    created() {
    },
    components: {
        search_to_add,
        all_students,
    },
    methods: {
        addStudentToClass(stdId) {
            ipcRenderer.send('addStudentToClass', {studentId: stdId, classId: this.classId.value})
            this.refreshStudentsList()
        },
        deleteStudentFromClass(stdId) {
            ipcRenderer.send('deleteStudentFromClass', {studentId: stdId, classId: this.classId.value})
            this.refreshStudentsList()
        },
        refreshStudentsList() {
            setTimeout(() => {
                ipcRenderer.send('getStudentsInClass', {classId: this.classId.value})
            }, 200)

        }
    },
    template:
        `
          <section class="big-section bg-white p-10 flex flex-row flex-wrap justify-between items-start">
          
          <search_to_add @add-to-class="addStudentToClass"></search_to_add>
          
          <hr class="my-2 mt-4 flex-fullrow">
          
          <all_students @remove-from-class="deleteStudentFromClass" @refresh="refreshStudentsList"></all_students>
          
          </section>
        `
}