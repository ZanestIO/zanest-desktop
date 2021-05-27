const {ipcRenderer} = require('electron')
const userModal = require('./userModal')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            usertype: '',
            fullName: '',
            username: '',
            userID: '',
            themesMenu: false,
            userMenu: false,
            notifyMenu: false,
            editUser: false,
            institutionName: '',
            institutionEdit: false,
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
    created() {

        // ========================================================
        // requesting user session
        // ========================================================
        ipcRenderer.send('requestUserSession')
        this.userType = 'undefined';
        this.fullName = 'undefined';

        // processing logged in user info
        ipcRenderer.on('responseUserSession', (event, args) => {
            switch (args.userType) {
                case "admin":
                    this.userType = 'ادمین'
                    break
                case "manager":
                    this.userType = 'مدیر'
                    break
                case "staff":
                    this.userType = 'کارمند'
                    break
            }
            this.username = args.userName
            this.fullName = args.fullName
            this.userID = args.userId

            if (args.userColor)
                this.userColor.name = args.userColor
        })


        // ========================================================
        // UPDATING COLOR CHANGES
        // ========================================================

        ipcRenderer.on('responseUserColor', (e, args) => {
            if (args)
                this.userColor.name = args
        })

        // ========================================================
        // GETTING INSTITUTION NAME
        // ========================================================
        ipcRenderer.send('getInstitutionInfo')
        ipcRenderer.on('responseGetInstitutionInfo', (e, args) => {
            this.institutionName = args.name
        })
    },
    provide() {
        return {
            loggedInUser: Vue.computed(() => this.username),
            loggedInID: Vue.computed(() => this.userID)
        }
    },
    emits: [],
    inject: [],
    components: {
        userModal,
    }
    ,
    methods: {
        logout() {
            ipcRenderer.send('logout');
        },
        showMenu(menu) {
            this[menu] = true
        },
        hideMenu(menu) {
            this[menu] = false
        },
        openEditUser() {
            this.editUser = true
        },
        closeEditUser() {
            this.editUser = false
        },
        changeUserColor(color) {
            ipcRenderer.send('changeUserColor', {id: this.userID, userColor: color})
        },
        setInstitutionName() {
            this.institutionEdit = true
        },
        changeInstitutionName() {
            ipcRenderer.send('setInstitutionName', this.institutionName)
            this.institutionEdit = false
        },
        changeOnEnter(e) {
            if (e.keyCode === 13)
                this.changeInstitutionName()
        }
    },
    template: `
      <user-modal v-if="editUser" @cancel-user-edit="closeEditUser"></user-modal>

      <nav class="top-nav fixed top-0 right-0 bg-gradient-to-r" :class="userColor.gradient[userColor.name]">
      <ul class="main-nav h-8v shadow-lg w-screen">
        <li id="menu-toggle" class="border-l-2 h-inherit flex flex-row items-center border-white px-5 w-16">
          <i class="fas fa-bars cursor-pointer text-2xl"></i>
        </li>
        <li class="flex-1 text-center">
          <span v-if="institutionName !== '' && institutionEdit === false" @click="setInstitutionName" class="cursor-text">آموزشگاه {{ institutionName }}</span>
          <span v-if="institutionName === '' && institutionEdit === false" @click="setInstitutionName">
            نام آموزشگاه خود را وارد کنید
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </span>
          <div v-if="institutionEdit">
            آموزشگاه: 
            <input type="text" max="50" autofocus class="w-64 bg-transparent underline focus:outline-none bg-opacity-0 p-4 cursor-blink" v-model="institutionName"
                   @focusout="changeInstitutionName" @keypress="changeOnEnter" placeholder="نام آموزشگاه خود را وارد کنید"
            style="background: transparent">
          </div>
        </li>
        <li class="dropdown-holder flex flex-row items-center border-white h-inherit border-r-2 px-5 hover:bg-gray-700"
            @mouseover="showMenu('themesMenu')" @mouseleave="hideMenu('themesMenu')">
          <i class="fas fa-paint-roller text-2xl"></i>

          <ul class="main-dropdown" v-if="themesMenu" :class="userColor.solid[userColor.name]">
            <li class="main-dropdown-li cursor-pointer" @click="changeUserColor('purple')">
              پیش فرض
              <i class="fas fa-check-circle mr-1" v-if="userColor.name === 'purple'"></i>
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-purple-700 to-purple-900 rounded-3xl h-8 m-2">
              </div>
            </li>
            <li class="main-dropdown-li cursor-pointer" @click="changeUserColor('blue')">
              آبی 
              <i class="fas fa-check-circle mr-1" v-if="userColor.name === 'blue'"></i>
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-blue-600 to-blue-900 rounded-3xl h-8 m-2">
              </div>
            </li>
            <li class="main-dropdown-li cursor-pointer" @click="changeUserColor('green')">
              سبز 
              <i class="fas fa-check-circle mr-1" v-if="userColor.name === 'green'"></i>
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-green-600 to-teal-900 rounded-3xl h-8 m-2">
              </div>
            </li>
            <li class="main-dropdown-li cursor-pointer" @click="changeUserColor('pink')">
              صورتی
              <i class="fas fa-check-circle mr-1" v-if="userColor.name === 'pink'"></i>
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-pink-500 to-purple-900 rounded-3xl h-8 m-2">
              </div>
            </li>
          </ul>
        </li>

        <li class="border-white h-inherit flex flex-row items-center border-r-2 px-5 hover:bg-gray-700 dropdown-holder"
            @mouseover="showMenu('notifyMenu')" @mouseleave="hideMenu('notifyMenu')">
          <i class="fas fa-bullhorn text-xl"></i>

          <ul class="main-dropdown" v-if="notifyMenu"  :class="userColor.solid[userColor.name]">
            <a href="themeUpdate.html"><li
                class="main-dropdown-li flex-col text-right p-2 justify-start border-b-2 border-gray-400 items-start cursor-pointer">
              <p class="font-bold">تغییرات نسحه جدید</p>
              <p class="text-xs mb-2">اکنون می توانید رنگ منوها را در پنل ادمین عوض کنید</p>
              <a class="text-xs underline">
                بیشتر بخوانید
                <i class="fas fas fa-angle-double-left"></i>
              </a>
            </li>
            </a>
            
          </ul>
        </li>
        <li class="border-white border-r-2 flex flex-row items-center pl-10 pr-5 h-inherit hover:bg-gray-700 dropdown-holder"
            @mouseover="showMenu('userMenu')" @mouseleave="hideMenu('userMenu')">
          <i class="fas fa-user-circle text-xl"></i>


          <ul class="main-dropdown w-40 text-right" v-if="userMenu"  :class="userColor.solid[userColor.name]">
            <li class="p-2 pl-8 main-dropdown-li flex-col justify-center text-gray-400 flex-wrap border-b-2 border-gray-500 py-5 hover:bg-opacity-0">
                        <span id="fullNameHolder">
                            {{ fullName }}
                        </span>

              <span id="userTypeHolder">
                                {{ userType }}
                            </span>
            </li>
            <li class="p-2 pl-8 main-dropdown-li justify-end border-b-2 border-gray-500 py-5 cursor-pointer" @click="openEditUser">
              <a>
                ویرایش پروفایل
              </a>
            </li>
            <li class="p-2 pl-8 main-dropdown-li justify-end py-5 cursor-pointer" @click="logout" id="logout">
              <i class="fas fa-sign-out-alt ml-2"></i>
              <a href="#">
                خروج
              </a>
            </li>
          </ul>
        </li>
      </ul>
      </nav>
    `
}