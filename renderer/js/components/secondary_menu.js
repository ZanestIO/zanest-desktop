const {ipcRenderer} = require('electron')

module.exports = {
    data() {
        return {
            expanded: true,
            userType: '',
        }
    },
    beforeCreate() {
        ipcRenderer.send('requestUserSession')
        const main = document.querySelector('#main')
        // _____________________________________________________
        // processing logged in user info
        ipcRenderer.on('responseUserSession', (event, args) => {
            console.log(args)

            if (args.userType !== 'staff')
                this.userType = true

            if (args.menuDocked === 'true') {
                this.expanded = false
                main.style.transition = 'none'
                main.style.paddingRight = '4rem'
                setTimeout(() => {
                    main.style.transition = 'all ease .2s'
                }, 300)

            }
        })
    },
    created() {
        const menuToggle = document.querySelector('#menu-toggle')
        const main = document.querySelector('#main')

        // handles toggle button for secondary menu
        menuToggle.addEventListener('click', e => {

            // when it becomes smaller
            if (this.expanded) {
                this.expanded = false
                main.style.paddingRight = '4rem'
                ipcRenderer.send('setMenuDocked', 'true')

                // becoming Bigger
            } else {
                this.expanded = true
                main.style.paddingRight = '14rem'
                ipcRenderer.send('setMenuDocked', 'false')
            }
        })
    },
    props: ['currentPage'],
    emits: ['request-page'],
    template:
`
      <ul id="secondary-menu"
          class="fixed right-0 bottom-0 hidden z-20 md:flex flex-col justify-start h-92v items-center bg-gradient-to-tr text-white from-pink-500 to bg-purple-900"
          :class="{'w-56': expanded, 'w-16': !expanded}">
      <li class="side-nav-li" :class="{closed: !expanded}" @click="$emit('request-page', 'dashboard', currentPage)">
        <span class="second-nav-text">داشبورد</span>
        <i class="text-lg fas fa-tachometer-alt"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}">
        <span class="second-nav-text">کلاس ها</span>
        <i class="text-lg fas fa-chalkboard"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}"  @click="$emit('request-page', 'students', currentPage)">
        <span class="second-nav-text">زبان آموزان</span>
        <i class="text-lg fas fa-users"></i>
      </li>

      <li class="side-nav-li border-b-0" :class="{closed: !expanded}" @click="$emit('request-page', 'teachers', currentPage)">
        <span class="second-nav-text">اساتید</span>
        <i class="text-lg fas fas fas fa-user-tie"></i>
      </li>

      <div class="flex-1"></div>

      <li class=" side-nav-li" :class="{closed: !expanded}" v-if="userType" @click="$emit('request-page', 'settings', currentPage)">
        <span class="second-nav-text">تنظیمات</span>
        <i class="text-lg fas fa-cogs"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}" v-if="userType" @click="$emit('request-page', 'users', currentPage)">
        <span class="second-nav-text">کاربرها</span>
        <i class="text-lg fas fa-user-friends"></i>
      </li>
      </ul>
    `
}