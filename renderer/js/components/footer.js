module.exports = {
    data() {
        return {

        }
    },
    template: `
      <footer>
      <p>
        تمامی حقوق متعلق به زانست می باشد
      </p>
      <div class="text-center md:text-right">
                    <span class="ml-4">
                        ترم تحصیلی
                    </span>
        <select name="semester" class="px-3 text-center py-1 rounded-md" id="semeseter">
          <option value="#">بهار 98-99</option>
          <option value="#">تابستان 98-99</option>
          <option value="#">پاییز 78-98</option>
        </select>
      </div>
      </footer>
    `
}