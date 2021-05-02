const {studentMock} = require('../../utils/mocks')
const {ipcRenderer} = require('electron')
const pagination = require('../pagination')
module.exports = {
    data() {
        return {
            teachers: [],
            degrees: {
                'kardani': 'کاردانی',
                'karshenasi': 'کارشناسی',
                'karshenasi-arshad': 'کارشناسی ارشد',
                'doctora': 'دکتری و بالاتر'
            }
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

            // alert('request user data'+ number +'----'+ offset + "----" + type)
            // get users information
            ipcRenderer.send('getBulk', {number: number, offset: offset, type: type})
            ipcRenderer.on('responseTeacherGetBulk',(e, args) => {
                this.teachers = args.teachers
            })
        }
    },

    // ==================================================================================
    // TEMPLATE
    // ==================================================================================
    template: `
      <div class="table-holder" v-if="teachers">
      <table class="table-norm">
        <tr class="header">
          <th>نام</th>
          <th>شماره تماس</th>
          <th>جنسیت</th>
          <th>کدملی</th>
          <th>تاریخ تولد</th>
          <th>مدرک</th>
          <th>
            آدرس
          </th>
        </tr>
        <tr v-for="teacher in teachers" v-on:dblclick="$emit('open-search-result', teacher.socialID)">
          <td>{{teacher.fullName}}</td>
          <td>{{teacher.phoneNumber}}</td>
          <td>{{teacher.sex}}</td>
          <td>{{teacher.socialID}}</td>
          <td>{{teacher.birthDate}}</td>
          <td>{{degrees[teacher.degree]}}</td>
          <td>{{teacher.address}}</td>
        </tr>
      </table>
      <pagination model-type="teacher" @refresh-table="requestData"></pagination>
      </div>
    `
} // end of component
