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
        ipcRenderer.send('studentGetBulk', {number: 10, offset: 1})
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
        <tr v-for="student in students" v-on:dblclick="$emit('open-search-result')">
          <td @click="$emit('open-search-result', student.socialID)">{{student.fullName}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.phoneNumber}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.sex}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.socialID}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.birthDate}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.parentsName}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.parentNumber}}</td>
          <td @click="$emit('open-search-result', student.socialID)">{{student.address}}</td>
        </tr>
      </table>
      </div>
    `
} // end of component
