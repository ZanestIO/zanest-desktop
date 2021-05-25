const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            name: '',
            capacity: '',
        }
    },
    inject: ['currentlyShowing'],
    emits: [],
    components: {},
    created() {
        ipcRenderer.send('getClassRoomInfo', {id: this.currentlyShowing.value})

        ipcRenderer.on('responseGetClassRoomInfo', (e, args) => {
            this.name = args.year
            this.capacity = args.capacity
        })
    },
    methods: {},
    template:
        `
          <!-- seeing single item -->
          <div class="main-section">
            <h2 class="mb-2">
              کلاس 
              {{ name }}
            </h2>
            <hr class="mb-4">

            <div class="section-content">
              <p>
                ظرفیت: 
                <span >{{ capacity }}</span>
              </p>
              
            </div>
          </div>
        `
}
