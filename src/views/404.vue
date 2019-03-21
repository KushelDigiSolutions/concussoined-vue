<template>
	<main class="login">
        <p class="notfound text-center">404 error</p>
        <p class="text-center">Sorry, this page was not found. In a few seconds, you will be redirected to the Home page.</p>
	</main>
</template>

<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

Vue.use(CxltToastr)

export default {
	name: 'sections',
	data: function () {
		return {
			ps:null,
			localStorage: localStorage,
			loading:true
		}
    },
    beforeMount: function () {
        if(this.localStorage.token) { // token validation
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.checkAdmin()
        }
    },
	mounted: function() {
        let router = this.$router
        setTimeout(function(){
            router.push({name:'sections'})
        }, 5000);
	},
	methods: {
        // checking if user is admin
        checkAdmin: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'admin_check')
            .then(response => {
                if(response.data != '1') {
                    localStorage.token = ''
                    this.axios.defaults.headers.common['Authorization'] = ''
                    this.showError('Login Failure', 'You are not authorized to access this site')
                    this.$router.push({path:'/login'})
                }
            })
        },
		perfectScrollInit: function() { // perfect scroll init goes after dom update
			var container = document.querySelector('.scroll')
			if(!this.ps && container) {
				this.ps = new PerfectScrollbar(container)
			} else if(container) {
				this.ps.destroy()
				this.ps = null
				this.ps = new PerfectScrollbar(container)
				container.scrollTop = 0
			}
		}
	}
}

</script>
