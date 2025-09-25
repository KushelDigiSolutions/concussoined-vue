<template>
    <header>
        <div class="dropdown">
            <a href="#" class="nav-link dropdown-toggle" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                {{user.email}}
            </a>
            <ul class="dropdown-menu" aria-labelledby="userMenu">
                <li><a class="dropdown-item" href="#" @click.prevent="userLogout">Logout</a></li>
            </ul>
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
        // Initialize Bootstrap dropdown
        this.$nextTick(() => {
            if (window.bootstrap) {
                const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
                dropdownElementList.forEach(dropdownToggleEl => {
                    new window.bootstrap.Dropdown(dropdownToggleEl)
                })
            }
        })
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