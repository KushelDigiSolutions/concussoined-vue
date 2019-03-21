<template>
    <header>
        <div class="dropdown">
            <a href="#" class="nav-link dropdown-toggle" id="userMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{user.email}}
            </a>
            <div class="dropdown-menu" aria-labelledby="userMenu">
                <a class="dropdown-item" href="" @click="userLogout">Logout</a>
            </div>
        </div>
    </header>
</template>
<script>
export default {
    name: 'pageheader',
    data: function () {
        return {
            user:[]
        }
    },
    mounted: function() {
        this.getUser()
    },
    methods: {
        getUser: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'me')
            .then(response => {
                this.user = response.data
            })
            .catch(error => {
                this.$router.push({path:'/login'})
            })
        },
        userLogout: function() {
            localStorage.token = ''
            this.axios.defaults.headers.common['Authorization'] = ''
            this.$router.push({path:'/login'})
        }
    }
}
</script>