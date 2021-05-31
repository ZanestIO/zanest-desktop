const {ipcRenderer} = require('electron')

module.exports = {
    data() {
        return {
            allStudents: [],
        }
    },
    props: [],
    inject: [],
    emits: ['remove-from-class'],
    components: {},
    created() {
        this.$emit('refresh')
        ipcRenderer.on('responseGetStudentsInClass', (e,args) => {
            this.allStudents = args
        })
    },
    methods: {
        removeFrom(sid) {
            this.$emit('remove-from-class', sid)
        }
    },
    template:
        `
          <!-- student names -->
          <div class="w-full">
          <div class="student-names mt-5 mb-5 flex flexrow flex-wrap justify-start items-center">

            <div v-for="std in allStudents" class="setting-item flex-1/3 flex ml-8 flex-wrap mb-5">
                            <span class="flex-1">
                                {{ std.fullName }}
                            </span>
              <span class="mr-4 text-sm text-gray-500 uppercase ml-3">
                                {{ std.socialID }}
                            </span>
              <i class="far fa-times-circle text-pink-700 text-2xl transform transition scale-100 hover:scale-125"
              @click="removeFrom(std.socialID)"></i>
            </div>
            
            

            
          </div>
          </div>
        `
}