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
            this.axios.get(process.env.VUE_APP_URL+'profiles')
            .then(response => {
                this.$router.push({path:'/'})
            })
            .catch(error => {
                this.localStorage.token = ''
            });
        }
    },
    methods: {
        validateForm: function(){
            this.errEmail = false
            this.errPassword = false
            this.errCpassword = false
            this.errTitle = ''
            this.errMsg = ''
            // form validation
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
                        this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                        this.$router.push({path:'/'})
                    })
                    .catch(error => {
                        this.$toast.error({
                            title:'Login Failure',
                            message: 'Invalid email or password',
                            position: 'top right',
                            timeOut: 5000
                        })
                    })
                }
            } else { // displaying validation error msg
                this.$toast.error({
                    title:this.errTitle,
                    message: this.errMsg,
                    position: 'top right',
                    timeOut: 5000
                })
            }
        }
    }
}

</script>
