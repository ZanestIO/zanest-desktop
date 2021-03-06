const {ipcRenderer} = require('electron')
const pagination = require('../pagination')
module.exports = {
    data() {
        return {
            students: [],
            userColor: {
                name: 'purple',
                gradient: {
                    purple: 'from-purple-700 to-purple-900',
                    blue: 'from-blue-600 to-blue-900',
                    green: 'from-green-600 to-teal-900',
                    pink: 'from-pink-500 to-purple-900',
                },
                solid: {
                    purple: 'bg-purple-700',
                    blue: 'bg-blue-700',
                    green: 'bg-green-600',
                    pink: 'bg-pink-600',
                }
            }
        }
    },
    created() {
      this.requestData(10, 1)
        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })
    },
    components: {
        pagination,
    },
    inject: '',
    emits: ['open-search-result'],
    methods: {
        requestData(number, offset, type='student') {

            // alert('request user data'+ number +'----'+ offset + "----" + type)
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
      <p v-if="!students[0]">هیچ زبان آموزی در سیستم ثبت نشده است</p>
      <table class="table-norm" v-if="students[0]">
        <tr class="header" :class="userColor.solid[userColor.name]">
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
          <td>{{ student.sex === 'female' ? 'زن' : 'مرد'}}</td>
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
