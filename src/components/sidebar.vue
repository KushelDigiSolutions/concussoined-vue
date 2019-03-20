<template>
    <section id="sidebar">
        <div class="logo"></div>
        <div class="nav-block">
            <div class="block-title">App Content</div>
            <nav>
                <ul>
                    <li>
                        <a href="#" class="nav-link" :class="{'active': $route.name != 'mediaManager' && $route.name != 'symptoms' && $route.name != 'addAdmin'}" @click="$router.push({name:'sections'})">
                            <font-awesome-icon icon="list-alt" />
                            Sections
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link" :class="{'active': $route.name == 'symptoms'}" @click="$router.push({name:'symptoms'})">
                            <font-awesome-icon icon="sitemap" />
                            Symptoms
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link" :class="{'active': $route.name == 'mediaManager'}" @click="$router.push({name:'mediaManager'})">
                            <font-awesome-icon icon="images" />
                            Media manager
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="nav-block">
            <div class="block-title">Settings</div>
            <nav>
                <ul>
                    <li>
                        <a href="#" class="nav-link" :class="{'active': $route.name == 'addAdmin'}" @click="$router.push({name:'addAdmin'})">
                            <font-awesome-icon icon="user" />
                            Add Administrator
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </section>
</template>
<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faListAlt, faCubes, faSitemap, faUser, faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faListAlt, faCubes, faSitemap, faUser, faImages)

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