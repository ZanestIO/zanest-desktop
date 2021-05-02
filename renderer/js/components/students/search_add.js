const {ipcRenderer} = require('electron')
const overlay = require('../overlay')
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
    inject: ['addSeen'],
    emits: ['open-search-result', 'adding-students'],
    components: {
        overlay
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
            args = {sid: '', name: ''}
            if (this.searchType === 'sid')
                args.sid = this.searchValue
            else
                args.name = this.searchValue

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

    },

    // ==================================================================================
    // TEMPLATE STRING
    // ==================================================================================
    template: `
      <section class="search-and-button" :class="{join: addSeen.value}">
      <button class="h-28 focus:outline-none" v-on:click="$emit('adding-student')">
        <i class="fas fa-plus"></i>
        زبان آموز جدید
      </button>
      <div class="search-box" :class="{open: searching}">
        <div class="search-field">
          <input type="text" placeholder="جست و جو ..." v-model="searchValue" @input="search">
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
          <overlay></overlay>
          <ul>
            <li v-for="result in searchResults" @click="$emit('open-search-result', result.socialID)">
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
      </section>
    `
}