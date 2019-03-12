<template>
    <main id="login">
        <div class="logo"></div>
        <div class="signin">
            <input class="mb-4" :class="{error: errEmail}" type="text" name="email" v-model="email" placeholder="Email">
            <input class="mb-4" :class="{error: errPassword}" type="password" name="password" v-model="password" placeholder="Password">
            <button class="btn mt-1" @click="validateForm()">Login</button>
        </div>
    </main>
</template>

<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

Vue.use(CxltToastr)

export default {
    name: 'login',
    data: function () {
        return {
            email:'',
            password:'',
            passwordConfirm:'',
            localStorage: localStorage,
            errEmail: false,
            errPassword: false,
            errTitle: '',
            errMsg: '',
            reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
        }
    },
    beforeMount: function () {
        localStorage.lang.length == 0 ? localStorage.lang = 'en' : ''
        if(this.localStorage.token) { // token validation
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.checkAdmin()
        }
    },
    methods: {
        // form validation and submit
        validateForm: function(){
            this.errEmail = false
            this.errPassword = false
            this.errCpassword = false
            this.errTitle = ''
            this.errMsg = ''
            if(!this.signup) {
                if(this.email == '' || !this.reg.test(this.email)) {
                    this.errEmail = true
                    this.errTitle = 'Login failure'
                    this.errMsg = this.errMsg + 'Email is not valid. '

                }
                if(this.password == '') {
                    this.errPassword = true
                    this.errTitle = 'Login failure'
                    this.errMsg = this.errMsg + 'Enter your password. '
                }
            }
            // sending data to server
            if(!this.errEmail && !this.errPassword && !this.errCpassword) {
                if(!this.signup) {
                    this.axios.post(process.env.VUE_APP_URL+'login',{email: this.email, password: this.password})
                    .then(response => {
                        localStorage.token = 'Bearer ' + response.data.token
                        this.checkAdmin()
                    })
                    .catch(error => {
                        this.showError('Login Failure', 'Invalid email or password')
                    })
                }
            } else { // displaying validation error msg
                this.showError(this.errTitle, this.errMsg)
            }
        },
        // checking if user is admin
        checkAdmin: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'admin_check')
            .then(response => {
                if(response.data == '1') {
                    this.$router.push({path:'/'})
                } else {
                    localStorage.token = ''
                    this.axios.defaults.headers.common['Authorization'] = ''
                    this.showError('Login Failure', 'You are not authorized to access this site')
                }
            })
            .catch(error => {
                this.showError('Login Failure', 'Invalid email or password')
            })
        },
        showError: function(title, msg) {
            this.$toast.error({
                title:title,
                message:msg,
                position: 'top right',
                timeOut: 5000
            })
        }
    }
}

</script>
