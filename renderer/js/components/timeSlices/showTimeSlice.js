const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            name: '',
            startTime: '',
            finishTime: '',
        }
    },
    inject: ['currentlyShowing'],
    emits: [],
    components: {},
    created() {
        ipcRenderer.send('getTimeSliceInfo', {id: this.currentlyShowing.value})

        ipcRenderer.on('responseGetTimeSliceInfo', (e, args) => {
            this.startTime = this.convert24To12(args.startTime)
            this.finishTime = this.convert24To12(args.finishTime)

        })
    },
    methods: {
        convert24To12(time) {
            let [hour, minute] = time.split(":")
            hour = parseInt(hour)
            minute = parseInt(minute)
            let suffix = hour >= 12 ? "بعد از ظهر":"قبل از ظهر";
            hour = ((( hour + 11) % 12) + 1)
            return hour + ":" + minute + " " + suffix
        }
    },
    template:
        `
          <!-- seeing single item -->
          <div class="main-section">
            <div class="section-content"> 
              <p>
                زمان شروع :
                <span class="inline-block ltr">{{ startTime }}</span>
              </p>
              <p>
                زمان پایان :
                <span class="inline-block ltr">{{ finishTime }}</span>
              </p>
              
            </div>
          </div>
        `
}
