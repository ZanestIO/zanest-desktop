module.exports = {
    data() {
        return {
            expanded: true,

        }
    },
    created() {
        const menuToggle = document.querySelector('#menu-toggle')
        const main = document.querySelector('#main')

        // handles toggle button for secondary menu
        menuToggle.addEventListener('click', e=> {

            // when it becomes smaller
            if (this.expanded) {
                this.expanded = false
                main.style.paddingRight = '4rem'

                // becoming Bigger
            } else {
                this.expanded = true
                main.style.paddingRight = '14rem'
            }
        })
    },

    emits: ['request-page'],
    template: `
      <ul id="secondary-menu"
          class="fixed right-0 bottom-0 hidden z-20 md:flex flex-col justify-start h-92v items-center bg-gradient-to-tr text-white from-purple-900 to bg-black"
          :class="{'w-56': expanded, 'w-16': !expanded}">
      <li class="side-nav-li" :class="{closed: !expanded}" @click="$emit('request-page', 'dashboard')">
        <span class="second-nav-text">داشبورد</span>
        <i class="text-lg fas fa-tachometer-alt"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}">
        <span class="second-nav-text">کلاس ها</span>
        <i class="text-lg fas fa-chalkboard"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}"  @click="$emit('request-page', 'students')">
        <span class="second-nav-text">زبان آموزان</span>
        <i class="text-lg fas fa-users"></i>
      </li>

      <li class="side-nav-li border-b-0" :class="{closed: !expanded}">
        <span class="second-nav-text">اساتید</span>
        <i class="text-lg fas fas fas fa-user-tie"></i>
      </li>

      <div class="flex-1"></div>

      <li class=" side-nav-li" :class="{closed: !expanded}">
        <span class="second-nav-text">تنظیمات</span>
        <i class="text-lg fas fa-cogs"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}">
        <span class="second-nav-text">کاربرها</span>
        <i class="text-lg fas fa-user-friends"></i>
      </li>
      </ul>
    `
}