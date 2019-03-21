<template>
    <main class="login">
        <div class="logo"></div>
        <div class="signin" v-if="!forgotPassword">
            <input class="mb-4" :class="{error: errEmail}" type="text" name="email" v-model="email" placeholder="Email">
            <input class="mb-4" :class="{error: errPassword}" type="password" name="password" v-model="password" placeholder="New Password">
            <input class="mb-4" :class="{error: errCPassword}" type="password" name="cpassword" v-model="password_confirmation" placeholder="Confirm Password" @keyup.enter="validateForm()">
            <button class="btn mt-1 mb-3" @click="validateForm()">Save</button>
        </div>
    </main>
</template>

<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

Vue.use(CxltToastr)

export default {
    name: 'reset',
    data: function () {
        return {
            email:'',
            token: '',
            password:'',
            password_confirmation:'',
            localStorage: localStorage,
            errEmail: false,
            errPassword: false,
            errCPassword: false,
            forgotPassword: false,
            errTitle: '',
            errMsg: '',
            reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
        }
    },
    mounted: function() {
        let t = window.location.pathname.split('/')
        this.token = t[2]
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
                if(this.password != this.password_confirmation) {
                    this.errPassword = true
                    this.errTitle = 'Login failure'
                    this.errMsg = this.errMsg + 'New password and password confirmation must be the same. '
                }
            }
            // sending data to server
            if(!this.errEmail && !this.errPassword && !this.errCpassword) {
                if(!this.signup) {
                    this.axios.post(process.env.VUE_APP_URL+'password/reset',{
                        email: this.email,
                        token: this.token,
                        password: this.password,
                        password_confirmation: this.password_confirmation
                    })
                    .then(response => {
                        this.$router.push({name:'login'})
                        // this.showSucces('Password Reset', 'Your password was updated. Now you can login with your new password.')
                    })
                    .catch(error => {
                        this.showError('Login Failure', 'Invalid email or token')
                    })
                }
            } else { // displaying validation error msg
                this.showError(this.errTitle, this.errMsg)
            }
        },
        showSuccess: function(title, msg) {
            this.$toast.success({
                title:title,
                message:msg,
                position: 'top right',
                timeOut: 5000
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
