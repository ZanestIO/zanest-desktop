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
            editingID: Vue.computed(() => this.editingID),
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
        },
        hideAdd() {
            this.adding = false
        },
        refreshUsers() {
            alert('refreshing')
            this.updateUsers()
        },
    }
}

let app = Vue.createApp(users).mount("#main")