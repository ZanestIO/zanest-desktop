module.exports = {
    data() {
        return {

        }
    },
    methods: {

    },
    template: `
      <div class="mt-5 flex flex-row flex-nowrap justify-between items-center">
      <div class="pagination flex-1 text-right">
        <ul>
          <li>
            <i class="fas fa-chevron-right"></i>
          </li>

          <li class="acitive">
            1
          </li>

          <li>
            2
          </li>

          <li>
            3
          </li>

          <li class="dots">
            ...
          </li>

          <li>
            18
          </li>

          <li>
            <i class="fas fa-chevron-left"></i>
          </li>
        </ul>

      </div>


      <div class="count-in-page">
                        <span>
                            تعداد نمایش در هر صحفه
                        </span>
        <input type="number" class="input-norm w-14 mx-2 p-2" value="10">
        <span class="text-xs">
                            حداکثر 50
                        </span>
      </div>
      </div>
    
    
    
    
    
    `
}