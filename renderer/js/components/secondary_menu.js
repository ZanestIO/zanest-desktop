const {ipcRenderer} = require('electron')

module.exports = {
    data() {
        return {
            expanded: true,
            userType: '',
            userColor: {
                name: 'purple',
                gradient: {
                    purple: 'from-purple-700 to-purple-900',
                    blue: 'from-blue-600 to-blue-900',
                    green: 'from-green-600 to-teal-900',
                    pink: 'from-pink-500 to-purple-900',
                },
                solid: {
                    purple: 'from-purple-700',
                    blue: 'from-blue-700',
                    green: 'from-green-600',
                    pink: 'from-pink-600',
                }
            }
        }
    },
    beforeCreate() {
        ipcRenderer.send('requestUserSession')
        const main = document.querySelector('#main')
        // _____________________________________________________
        // processing logged in user info
        ipcRenderer.on('responseUserSession', (event, args) => {
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

            if (args.userColor)
                this.userColor.name = args.userColor
        })

        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
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
          class="fixed right-0 bottom-0 hidden z-20 md:flex flex-col justify-start h-92v items-center bg-gradient-to-tr text-white"
          :class="{'w-56': expanded, 'w-16': !expanded}" :class="userColor.gradient[userColor.name]">
      <li class="side-nav-li" :class="{closed: !expanded}" @click="$emit('request-page', 'dashboard', currentPage)">
        <span class="second-nav-text">داشبورد</span>
        <i class="text-lg fas fa-tachometer-alt"></i>
      </li>

      <li class="side-nav-li" :class="{closed: !expanded}"  @click="$emit('request-page', 'classes', currentPage)">
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