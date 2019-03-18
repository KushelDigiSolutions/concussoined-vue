<template>
    <section id="sidebar">
        <div class="logo"></div>
        <div class="nav-block">
            <div class="block-title">App</div>
            <nav>
                <ul>
                    <li>
                        <a href="#" class="nav-link" :class="{'active': $route.name != 'mediaManager'}" @click="$router.push({name:'sections'})">
                            <font-awesome-icon icon="list-alt" />
                            Sections
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link" :class="{'active': $route.name == 'mediaManager'}" @click="$router.push({name:'mediaManager'})">
                            <font-awesome-icon icon="images" />
                            Media manager
                        </a>
                    </li>
                    <!--<li>
                        <a href="#" class="nav-link">
                            <font-awesome-icon icon="sitemap" />
                            Menu
                        </a>
                    </li>
                     <li>
                        <a href="#" class="nav-link">
                            <font-awesome-icon icon="users" />
                            Users
                        </a>
                    </li> -->
                </ul>
            </nav>
        </div>
    </section>
</template>
<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faListAlt, faCubes, faSitemap, faUsers, faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faListAlt, faCubes, faSitemap, faUsers, faImages)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

export default {
    name: 'pagesidebar',
    data: function () {
        return {

        }
    },
    mounted: function() {

    },
    methods: {

    }
}
</script>