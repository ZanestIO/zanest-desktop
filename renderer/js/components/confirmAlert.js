const overlay = require('./overlay')
module.exports = {

    data() {
        return {

        }
    },
    inject: ['seen', 'error', 'error_desc'],
    emits: ['confirm', 'cancel-box'],
    components: {
        overlay
    },
    template: `
      <teleport to="#main">
      <div class="bg-white rounded-lg u-center-h top-20" v-if="seen.value" style="z-index: 2003">
        <overlay></overlay>
      <div class="w-96 border-t-8 border-pink-600 rounded-lg flex">
        <div class="w-full pt-9 pr-4">
          <h3 class="font-bold text-pink-700">{{error.value}}</h3>
          <p class="py-4 text-sm text-gray-400">{{error_desc.value}}</p>
        </div>
      </div>

      <div class="p-4 flex">
        <a href="#" class="w-1/2 px-4 py-3 ml-2 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm" v-on:click="$emit('cancel-box')">انصراف</a>
        <a href="#" class="w-1/2 px-4 py-3 text-center text-pink-100 bg-pink-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm" v-on:click="$emit('confirm')">حذف</a>
      </div>
      </div>
      </teleport>
    `
}










