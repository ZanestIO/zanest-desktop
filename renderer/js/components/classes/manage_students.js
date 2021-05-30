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
          <section class="big-section bg-white p-10 flex flex-row flex-wrap justify-between items-start">
          <div class="flex-fullrow flex items-end">
            <div class="w-full">
              <p class="mb-3">
                اضافه کردن زبان آموزان موجود در سیستم
              </p>
              <div class="w-full flex flex-row rounded-sm flex-nowrap h-16 items-center border-2 p-3">
                <input type="text" placeholder="جست و جو ..." class="flex-1 h-full p-3">
                <span class="text-gray-500 text-sm p-3 border-l-2 border-black ml-2">
                                براساس
                            </span>
                <select name="" id="" class="" class="h-full p-3">
                  <option value="">نام</option>
                  <option value="">کدملی</option>
                </select>
              </div>
            </div>
          </div>

          <hr class="my-2 mt-4 flex-fullrow">

          <!-- student names -->
          <div class="w-8/12">
            <div class="student-names mt-5 mb-5 flex flexrow flex-wrap justify-between items-center">
              <div class="setting-item w-48p mb-5">
                            <span class="flex-1">
                                صهیب کهنه پوشی
                            </span>
                <span class="mr-4 text-sm text-gray-500 uppercase ml-3">
                                38104659875
                            </span>
                <i class="far fa-edit text-2xl text-black ml-3"></i>
                <i class="far fa-times-circle text-pink-700 text-2xl"></i>
              </div>
            </div>
          </div>
          
          </section>
        `
}