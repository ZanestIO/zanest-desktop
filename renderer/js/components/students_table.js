const {studentMock} = require('./../utils/mocks')
const {ipcRenderer} = require('electron')
module.exports = {
    data() {
        return {
            students: [],
        }
    },
    created() {
      // get users information
        ipcRenderer.send('getBulk', {number: 10, offset: 1, type: 'Student'})
        ipcRenderer.on('responseStudentGetBulk',(e, args) => {
            // console.log(args.students)
            this.students = args.students
        })
    },
    inject: '',
    emits: ['open-search-result'],
    methods: {},

    // ==================================================================================
    // TEMPLATE
    // ==================================================================================
    template: `
      <div class="table-holder">
      <table class="table-norm">
        <tr class="header">
          <th>نام</th>
          <th>شماره تماس</th>
          <th>جنسیت</th>
          <th>کدملی</th>
          <th>تاریخ تولد</th>
          <th>نام والد</th>
          <th>شماره تماس والدین</th>
          <th>
            آدرس
          </th>
        </tr>
        <tr v-for="student in students" v-on:dblclick="$emit('open-search-result', student.socialID)">
          <td>{{student.fullName}}</td>
          <td>{{student.phoneNumber}}</td>
          <td>{{student.sex}}</td>
          <td>{{student.socialID}}</td>
          <td>{{student.birthDate}}</td>
          <td>{{student.parentsName}}</td>
          <td>{{student.parentNumber}}</td>
          <td>{{student.address}}</td>
        </tr>
      </table>
      </div>
    `
} // end of component
