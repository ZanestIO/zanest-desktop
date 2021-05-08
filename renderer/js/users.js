const all_users = require('./components/users/allUsers')
const add_user = require('./components/users/addUser')
const edit_user = require('./components/users/editUser')
const {ipcRenderer} = require('electron')
const Vue = require('vue')

let users = {
    data() {
        return {
            editing: false,
            adding: false,
            users: [],
            editingID: '',
            currentUser: '',
        }
    },
    provide() {
        return {
            allUsers: Vue.computed(() => this.users),
            curentUser: Vue.computed(() => this.currentUser),
            currentlyEditing: Vue.computed(() => this.editingID),
        }
    },
    components: {
        all_users,
        add_user,
        edit_user,
    },
    created() {
        ipcRenderer.send('requestUserSession')
        ipcRenderer.on('responseUserSession', (event, args) => {
            this.currentUser = args.userId
        })
        this.updateUsers()
    },
    methods: {
         updateUsers() {
            ipcRenderer.send('getBulk', {type: 'user'})
            ipcRenderer.on('responseUserGetBulk', (e, args) => {
                this.users = args.users
            })
        },
        showAddUser() {
            this.editing = false
            this.adding = true
            this.editingID = false
        },
        hideAdd() {
            this.adding = false
        },
        hideEdit() {
            this.editing = false
            this.editingID = ''
        },
        refreshUsers() {
            setTimeout(() => {
                this.updateUsers()
            }, 400)
        },
        userEdit(id) {
            this.editing = false
            this.editingID = ''
            setTimeout(() => {
                this.adding = false
                this.editing = true
                this.editingID = id
            }, 100)
        },
        userDelete(id) {
             if (this.editingID == id) {
                 this.editing = false
                 this.editingID = ''
             }
        }
    }
}

let app = Vue.createApp(users).mount("#main")