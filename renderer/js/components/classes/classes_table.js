const {ipcRenderer} = require('electron')
module.exports = {
    data() {
        return {
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
        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })
    },

    components: {},
    inject: '',
    emits: ['open-class'],
    methods: {},

    // ==================================================================================
    // TEMPLATE
    // ==================================================================================
    template: `
      <div class="table-holder">
        <table class="timetable">
          <tr :class="userColor.solid[userColor.name]">
            <th>روز/ساعت</th>
            <th class="min-w-64">8:00 <sub>A.M</sub> - 9:30 <sub>A.M</sub></th>
            <th>10:00 <sub>A.M</sub> - 11:30 <sub>A.M</sub></th>
            <th>2:00 <sub>P.M</sub> - 3:30 <sub>P.M</sub></th>
            <th>4:00 <sub>P.M</sub> - 5:30 <sub>P.M</sub></th>
            <th>6:00 <sub>P.M</sub> - 7:30 <sub>P.M</sub></th>
          </tr>
          <tr>
            <td>
              شنبه
            </td>
            <td>
              <div>
                <div class="timetable-item hover:bg-pink-700 cursor-pointer">
                  <p>Four Corners 1</p>
                  <div>
                    <span>
                      سیوان قانعی فرد
                    </span>
                    <br>
                    <span>
                      مجازی
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td></td>
            <td></td>
            <td>
              <div>
                <div class=" timetable-item">
                  <p>Four Corners 1</p>
                  <div>
                    <span>
                      سیوان قانعی فرد
                    </span>
                    <span>
                      مجازی
                    </span>
                  </div>
                </div>

                <div class=" timetable-item">
                  <p>Four Corners 1</p>
                  <div>
                    <span>
                      سیوان قانعی فرد
                    </span>
                    <br>
                    <span>
                      مجازی
                    </span>
                  </div>
                </div>
                
              </div>
            </td>
            <td></td>
          </tr>
          
          <tr>
            <td class="py-4">
              یکشنبه
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          
        </table>
      </div>
    `
} // end of component
