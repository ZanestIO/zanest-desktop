const {ipcRenderer} = require('electron')

module.exports = {
    data() {
        return {
            searchValue: '',
            searching: false,
            searchLoading: false,
            searchType: 'name',
            searchResults: [],
            noResult: false,
        }
    },
    props: [],
    inject: [],
    emits: ['add-to-class'],
    components: {},
    created() {
    },
    methods: {

        // ==================================================================================
        // sends out search request
        search() {
            // only send search request if input is more than 3 chars
            if (this.searchValue.length < 3) {
                this.searchLoading = false
                this.searching = false
                return
            }

            // creating search object
            args = {name: '', sid: ''}
            if (this.searchType === 'name')
                args.name = this.searchValue
            else
                args.sid = this.searchValue

            // sending search object
            ipcRenderer.send('search', {type: 'student', info: args})

            // spins the loading icon
            this.searchLoading = true


            ipcRenderer.on('responseSearch', (e, result) => {
                if (result) {
                    this.noResult = false
                    this.searchResults = result
                    this.searchLoading = false
                    this.searching = true
                } else {
                    this.searchResults = []
                    this.searchLoading = false
                    this.searching = true
                    this.noResult = true
                }

            })
        },

        addClose(sid) {
            this.searching = false
            this.searchLoading = false
            this.searchValue = ''
            this.$emit('add-to-class', sid)
        }

    },
    template:
        `
          <div class="flex-fullrow flex items-end">
          <div class="w-full flex flex-row flex-wrap justify-start">
            <p class="mb-3 flex-fullrow">
              اضافه کردن زبان آموزان به کلاس
            </p>
            <div class="search-box border-2 border-gray-500" :class="{open: searching}">
              <div class="search-field">
                <input type="text" placeholder="جست و جو ..." v-model="searchValue" @input="search" maxlength="50">
                <i class="fa fa-circle-notch fa-spin inline-block ml-2" v-if="searchLoading"></i>
                <span>
                            براساس
                        </span>
                <select v-model="searchType">
                  <option value="name">نام</option>
                  <option value="sid">کدملی</option>
                </select>
              </div>

              <div class="search-result" v-if="searching">
                <ul>
                  <li v-for="result in searchResults" @click="addClose(result.socialID)">
              <span>
                {{ result.fullName }}
              </span>
                    <span>
                {{ result.socialID }}
              </span>
                    <span>
                {{ result.phoneNumber }}
              </span>
                  </li>
                  <li v-if="noResult">
              <span>
                نتیجه ای برای جست و جو یافت نشد
              </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        `
}