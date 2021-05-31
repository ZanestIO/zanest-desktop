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
            },
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
        requestData(number, offset, type='teacher') {

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
      <p v-if="!teachers[0]">هیچ استادی در سیستم ثبت نشده است</p>
      <table class="table-norm" v-if="teachers[0]">
        <tr class="header" :class="userColor.solid[userColor.name]">
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
          <td>{{ teacher.sex === 'female' ? 'زن' : 'مرد'}}</td>
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
