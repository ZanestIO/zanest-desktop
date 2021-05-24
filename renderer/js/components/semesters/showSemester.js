const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            name: '',
            startDate: '',
            finishDate: '',
        }
    },
    inject: ['currentlyShowing'],
    emits: [],
    components: {},
    created() {
        ipcRenderer.send('getSemesterInfo', {id: this.currentlyShowing.value})

        ipcRenderer.on('responseGetSemesterInfo', (e, args) => {
            this.name = args.year
            this.startDate = args.startDate.split("-").reverse().join("-")
            this.finishDate = args.finishDate.split("-").reverse().join("-")
        })
    },
    methods: {},
    template:
        `
          <!-- seeing single item -->
          <div class="main-section">
            <h2 class="mb-2">
              {{ name }}
            </h2>
            <hr class="mb-4">

            <div class="section-content">
              <p>
                تاریخ شروع :
                <span >{{ startDate }}</span>
              </p>
              <p>
                تاریخ پایان :
                <span>{{ finishDate }}</span>
              </p>
              
            </div>
          </div>
        `
}
