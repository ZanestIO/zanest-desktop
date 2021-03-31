const {ipcRenderer} = require('electron')

module.exports = {
    data() {
        return {
            addingStudent: false,
            searchValue: '',
            searching: false,
            searchLoading: false,
            searchType: 'name',
            searchResults: []
        }
    },
    inject: '',
    emits: 'open-search-result',
    methods: {

        // ==================================================================================
        // sends out search request
        search() {

            // only send search request if input is more than 3 chars
            if (this.searchValue.length < 3) {
                this.searchLoading = false
                return
            }

            // creating search object
            args = { sid: '', name: ''}
            if (this.searchType === 'sid')
                args.sid = this.searchValue
            else
                args.name = this.searchValue

            // sending search object
            ipcRenderer.send('search', {type: 'student', info: args})

            // spins the loading icon
            this.searchLoading = true

            this.renderSearch()
        },

        // ==================================================================================
        // listens for search results
        renderSearch() {
            ipcRenderer.on('responseSearch', (e,args) => {
                this.searchLoading = false
                this.searching = true
                console.log(args)
                this.searchResults = args
                console.log(this.searchResults)
            })
        }
    },

    // ==================================================================================
    // TEMPLATE STRING
    // ==================================================================================
    template: `
      <section class="search-and-button" :class="{join: addingStudent}">
      <button class="h-28">
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
          <ul>
            <li v-for="result in searchResults" @click="$emit('open-search-result', result.sid)">
              <span>
                {{ result.name }}
              </span>
              <span>
                {{ result.sid }}
              </span>
              <span>
                {{ result.phone }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      </section>
    `
}