const {ipcRenderer} = require('electron')
const userModal = require('./userModal')
const Vue = require('vue')

module.exports = {
    data() {
        return {
            usertype: '',
            fullName: '',
            username: '',
            themesMenu: false,
            userMenu: false,
            notifyMenu: false,
            editUser: false,
        }
    },
    created() {
        ipcRenderer.send('requestUserSession')
        this.userType = 'undefined';
        this.fullName = 'undefined';
        // _____________________________________________________
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
            this.userId = args.userId
        })
    },
    provide() {
        return {
            loggedInUser: Vue.computed(() => this.username)
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
    },
    template: `
      <user-modal v-if="editUser" @cancel-user-edit="closeEditUser"></user-modal>

      <nav class="top-nav fixed top-0 right-0 bg-gradient-to-r from-pink-500 to bg-purple-900">
      <ul class="main-nav h-8v shadow-lg w-screen">
        <li id="menu-toggle" class="border-l-2 h-inherit flex flex-row items-center border-white px-5 w-16">
          <i class="fas fa-bars cursor-pointer text-2xl"></i>
        </li>
        <li class="flex-1 text-center">آموزشگاه جهان</li>
        <li class="dropdown-holder flex flex-row items-center border-white h-inherit border-r-2 px-5 hover:bg-gray-700"
            @mouseover="showMenu('themesMenu')" @mouseleave="hideMenu('themesMenu')">
          <i class="fas fa-paint-roller text-2xl"></i>

          <ul class="main-dropdown" v-if="themesMenu">
            <li class="main-dropdown-li">
              پیش فرض
              <i class="fas fa-check-circle mr-1"></i>
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-purple-700 to-purple-900 rounded-3xl h-8 m-2">
              </div>
            </li>
            <li class="main-dropdown-li">
              آبی تیره
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-blue-600 to-blue-900 rounded-3xl h-8 m-2">
              </div>
            </li>
            <li class="main-dropdown-li">
              سبز تیره
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-green-600 to-teal-900 rounded-3xl h-8 m-2">
              </div>
            </li>
            <li class="main-dropdown-li">
              صورتی
              <div
                  class="w-20 bg-gradient-to-r border-white border mr-4 from-pink-500 to-purple-900 rounded-3xl h-8 m-2">
              </div>
            </li>
          </ul>
        </li>

        <li class="border-white h-inherit flex flex-row items-center border-r-2 px-5 hover:bg-gray-700 dropdown-holder"
            @mouseover="showMenu('notifyMenu')" @mouseleave="hideMenu('notifyMenu')">
          <i class="fas fa-bullhorn text-xl"></i>

          <ul class="main-dropdown p-2" v-if="notifyMenu">
            <li
                class="main-dropdown-li flex-col text-right justify-start border-b-2 border-gray-400 items-start">
              <p class="font-bold">تغییرات نسحه جدید</p>
              <p class="text-xs mb-2">اکنون می توانید رنگ منوها را در پنل ادمین عوض کنید</p>
              <a href="#" class="text-xs underline">
                بیشتر بخوانید
                <i class="fas fas fa-angle-double-left"></i>
              </a>
            </li>

            <li class="main-dropdown-li flex-col text-right justify-start border-white items-start">
              <p class="font-bold">تغییرات نسحه جدید</p>
              <p class="text-xs mb-2">اکنون می توانید رنگ منوها را در پنل ادمین عوض کنید</p>
              <a href="#" class="text-xs underline">
                بیشتر بخوانید
                <i class="fas fas fa-angle-double-left"></i>
              </a>
            </li>
          </ul>
        </li>
        <li class="border-white border-r-2 flex flex-row items-center pl-10 pr-5 h-inherit hover:bg-gray-700 dropdown-holder"
            @mouseover="showMenu('userMenu')" @mouseleave="hideMenu('userMenu')">
          <i class="fas fa-user-circle text-xl"></i>


          <ul class="p-2 pl-5 main-dropdown w-40 text-right" v-if="userMenu">
            <li class="main-dropdown-li flex-col justify-center text-gray-200 flex-wrap border-b-2 border-gray-500 py-5">
                        <span id="fullNameHolder">
                            {{ fullName }}
                        </span>

              <span id="userTypeHolder">
                                {{ userType }}
                            </span>
            </li>
            <li class="main-dropdown-li justify-end border-b-2 border-gray-500 py-5" @click="openEditUser">
              <a>
                ویرایش پروفایل
              </a>
            </li>
            <li class="main-dropdown-li justify-end py-5" @click="logout" id="logout">
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