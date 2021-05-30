const {ipcRenderer} = require('electron')
module.exports = {
    data() {
        return {
            semester: '',
            currentSem: {},
            allSems: [],
        }
    },
    emits: [],
    components: {},
    beforeCreate() {
        // =============================================
        // getSemesters
        ipcRenderer.send('getBulk', {type: 'semester'})
        ipcRenderer.on('responseSemesterGetBulk', (e, args) => {
            this.allSems = args.semesters
        })

        // =============================================
        // getCurrentSemester
        ipcRenderer.send('getCurrentSemester')
        ipcRenderer.on('responseCurrentSemester', (e, args) => {
            this.semester = args.id
            this.currentSem = args
        })
    },
    props: ['showCheckBox'],
    methods: {},
    template: `
      <p>
      تمامی حقوق متعلق به زانست می باشد
      </p>
      <div class="text-center md:text-right">
      <span class="ml-4">
                        ترم تحصیلی:
                    </span>
      <span v-if="semester && !showCheckBox">
          {{ currentSem.year }}
        </span>
      <span v-if="!semester && !showCheckBox" class="text-sm text-gray-700">
          هیچ ترم فعالی در تاریخ فعلی نداریم
        </span>

      <select v-if="showCheckBox" class="px-3 text-center py-1 rounded-md"
              v-model="semester">
        <option v-for="semester in allSems" :value="semester.id">
          {{ semester.year }}
        </option>
      </select>
      </div>
    `
}