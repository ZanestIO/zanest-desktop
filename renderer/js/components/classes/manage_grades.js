const {ipcRenderer} = require('electron')

module.exports = {
    data() {
        return {}
    },
    props: [],
    inject: [],
    emits: [],
    components: {},
    created() {
    },
    methods: {},
    template:
        `
          <section class="big-section">
          <div class="section-title flex flex-row flex-nowrap items-center">
            <h2>
              نمرات پایان ترم زبان آموزان
            </h2>

            <button class="btn btn-secondary bg-green-300 mr-4
">
              ذخیره
            </button>
          </div>

          <div class="section-content pb-10">
            <ul class="w-full flex flex-wrap items-center justify-between">
              <li class="setting-item py-0 p-3 w-30p">
                            <span class="flex-1">
                                مبین شهبازی
                            </span>
                <input type="number" class="input-norm w-28" placeholder="نمره" min="1" max="100">
              </li>

              <li class="setting-item py-0 p-3 w-30p">
                            <span class="flex-1">
                                مبین شهبازی
                            </span>
                <input type="number" class="input-norm w-28" placeholder="نمره" min="1" max="100">
              </li>
              <li class="setting-item py-0 p-3 w-30p">
                            <span class="flex-1">
                                مبین شهبازی
                            </span>
                <input type="number" class="input-norm w-28" placeholder="نمره" min="1" max="100">
              </li>

              <li class="setting-item py-0 p-3 w-30p">
                            <span class="flex-1">
                                ریبین کهنه پوشی
                            </span>
                <input type="number" class="input-norm w-28" placeholder="نمره" min="1" max="100">
              </li>
            </ul>
          </div>
          </section>
        `
}