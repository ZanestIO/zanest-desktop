const {ipcRenderer} = require('electron')
var Vue = require('vue/dist/vue.min')
const notListener = require('./notListener');
// setting up notification listeners
notListener()

loadingIcon = '<i class="fas fa-circle-notch fa-spin text-lg"></i>'

let userName = new Vue({
    el:'#sign-username',
    data: {
        err: false
    }
})

let password = new Vue( {
    el: '#sign-pass',
    data: {
        err: false,
    }
})

let passwordRepeat = new Vue( {
    el:'#sign-pass',
    data: {
        data: {
            err: false,
        }
    }
})

let button = new Vue({
    el:'#register',
    data: {
        text: 'ایجاد حساب کاربری'
    }
})

let progressHolder = new Vue({
    el: '#pass-bar-holder',
    data: {
        seen: false
    }
})

let progress = new Vue({
    el: '#pass-bar',
    data: {
        width: 'w0'
    }
})

let usernameErr = new Vue({
    el: '#username-err',
    data: {
        seen: false,
        text: ''
    }
})

let passErr = new Vue({
    el: '#pass-err',
    data: {
        seen: false,
        text: ""
    }
})