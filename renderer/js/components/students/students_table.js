const {ipcRenderer} = require('electron')
const pagination = require('../pagination')
module.exports = {
    data() {
        return {
            students: [],
        }
    },
    created() {
      this.requestData(10, 1)
    },
    components: {
        pagination,
    },
    inject: '',
    emits: ['open-search-result'],
    methods: {
        requestData(number, offset, type='student') {

            alert('request user data'+ number +'----'+ offset + "----" + type)
            // get users information
            ipcRenderer.send('getBulk', {number: number, offset: offset, type: type})
            ipcRenderer.on('responseStudentGetBulk',(e, args) => {
                this.students = args.students
                console.log("this is me --- " + this.students)
            })
        }
    },

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
      <pagination model-type="student" @refresh-table="requestData"></pagination>
      </div>
    `
} // end of component
