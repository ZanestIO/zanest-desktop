const {ipcRenderer} = require('electron')
module.exports = {
    data() {
        return {
            limit: 10,
            pageCount: 1,
            currentPage: 1,

        }
    },
    created() {
      this.getPageNumbers();
    },
    emits: ['refreshTable'],
    props: ['modelType'],
    methods: {
        getPageNumbers(refresh = false) {
            ipcRenderer.send('pageCount', {limit: this.limit, type: this.modelType})
            ipcRenderer.on('responsePageCount', (e,args) => {
                this.pageCount = args.result
            })

            if (refresh) {
                this.$emit('refreshTable', this.limit, 1, this.modelType)
            }
        },

        getPage(pageNumber) {
            if (pageNumber === this.currentPage) {
                return
            }
            this.currentPage = pageNumber
            this.$emit('refreshTable', this.limit, this.currentPage, this.modelType)
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage -= 1
                this.$emit('refreshTable', this.limit, this.currentPage, this.modelType)
            }
        },

        nextPage() {
            if (this.currentPage < this.pageCount) {
                this.currentPage += 1
                this.$emit('refreshTable', this.limit, this.currentPage, this.modelType)
            }
        }
    },
    template: `
      <div class="mt-5 flex flex-row flex-nowrap justify-between items-center" v-if="pageCount > 1">
      <div class="pagination flex-1 text-right">
        <ul >
          <li @click="previousPage">
            <i class="fas fa-chevron-right"></i>
          </li>

          <li v-if="currentPage != 1" @click="getPage(1)">
            1
          </li>

          <li class="dots" v-if="currentPage > 3">
            ...
          </li>

          <li v-if="currentPage - 1 > 1" @click="getPage(currentPage - 1)">
            {{ currentPage - 1 }}
          </li>
          
          <li class="active" @click="getPage(currentPage)">
            {{ currentPage }}
          </li>

          <li v-if="currentPage + 1 < pageCount" @click="getPage(currentPage+1)">
            {{ currentPage + 1 }}
          </li>

          <li class="dots" v-if="pageCount - currentPage > 2">
            ...
          </li>
          
          <li v-if="currentPage != pageCount" @click="getPage(pageCount)">
            {{ pageCount }}
          </li>

          <li @click="nextPage">
            <i class="fas fa-chevron-left"></i>
          </li>
        </ul>

      </div>


      <div class="count-in-page">
                        <span>
                            تعداد نمایش در هر صحفه
                        </span>
        <select class="input-norm w-14 mx-2 p-2" v-model="limit" @change="getPageNumbers(true)">
          <option value="3">3</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
      </div>
      </div>





    `
}