const {ipcRenderer} = require('electron')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            name: '',
            level: '',
            expectedTime: '',
            desc: '',
        }
    },
    inject: ['currentlyShowing'],
    emits: [],
    components: {},
    created() {
        ipcRenderer.send('getTopicInfo', {id: this.currentlyShowing.value})

        ipcRenderer.on('responseGetTopicInfo', (e, args) => {
            this.name = args.name
            // TODO: double check these names
            this.level = args.level
            this.expectedTime = args.expectedTime
            if (args.desc)
                this.desc = args.desc
        })
    },
    methods: {},
    template:
        `
          <section class="w-30p">
          <!-- seeing single item -->
          <div class="main-section">
            <h2 class="mb-2">
              {{ name }}
            </h2>
            <hr class="mb-4">

            <div class="section-content">
              <p>
                سطح :
                <span>{{ level }}</span>
              </p>
              <p>
                طول پیشنهادی :
                <span>
                                 {{ expectedTime }}
                            </span>
              </p>

              <p>
                توضیحات :
                <span>
                                {{ desc }}
                            </span>
              </p>
            </div>
          </div>
          </section>
        `
}
