const {ipcRenderer} = require('electron')
const {pWeekdays} = require('./../../utils/converts')

module.exports = {
    data() {
        return {
            weekdays:  pWeekdays,
            timeline: [],
            timeSlices: [],
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
        // ==================================================================================
        // colors management
        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })


        // ==================================================================================
        // getTimeLine
        ipcRenderer.send('getBulk', {type: 'class'})
        ipcRenderer.on('responseClassGetBulk', (e, args) => {
            this.timeline = args.classes
        })


        // ==================================================================================
        // get all TimeSlices
        ipcRenderer.send('getBulk', {type: 'timeSlice'})
        ipcRenderer.on('responseTimeSliceGetBulk', (e, args) => {
            this.timeSlices = args.timeSlices
        })
    },

    components: {},
    inject: '',
    emits: ['open-class'],
    methods: {
        convertTime12to24(time12h) {
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes] = time.split(":");
            if (hours === "12") {
                hours = "00";
            }
            if (modifier === "pm") {
                hours = parseInt(hours, 10) + 12;
            }
            return `${hours}:${minutes}`;
        },

        convert24To12(time) {
            let [hour, minute] = time.split(":")
            hour = parseInt(hour)
            let suffix = hour >= 12 ? "PM" : "AM";
            hour = (((hour + 11) % 12) + 1)
            return `${hour}:${minute} ${suffix}`
        },
    },

    // ==================================================================================
    // TEMPLATE
    // ==================================================================================
    template: `
      <div class="table-holder">
        <table class="timetable">
          <tr :class="userColor.solid[userColor.name]">
            <th>روز/ساعت</th>
            <th v-for="time in timeSlices">{{ convert24To12(time.startTime) }} - {{ convert24To12(time.finishTime) }}</th>
          </tr>
          <tr v-for="(value, name) in weekdays">
            <td>
              {{ value }}
            </td>
            <td v-for="time in timeSlices">
              <div>
                <div v-for="cls in timeline[name]">
                  <div class="timetable-item hover:bg-pink-700 cursor-pointer" v-if="time.id === cls.time"
                  @dblclick="$emit('open-class', cls.id)">
                    <p>{{ cls.topic }}</p>
                    <div>
                    <span>
                      {{ cls.teacher }}
                    </span>
                      <br>
                      <span>
                      {{ cls.classRoom }}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          
        </table>
      </div>
    `
} // end of component
