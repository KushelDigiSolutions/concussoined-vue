<template>
    <main class="pagecontent">
		<div class="scroll">
			<header class="full-width">
				<h1>Edit Gallery</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateWidget()">
                        <font-awesome-icon icon="sync-alt" />
                        <span>Update</span>
                    </button>
                    <button class="btn btn-red icon" @click="$router.push({path:prevRoute})">
                        <font-awesome-icon icon="ban" />
                        <span>Cancel</span>
                    </button>
                </div>
			</header>
            <section class="edit-widget" v-if="widget.title_en">
                <div class="row">
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="titleen">Title(EN):</label>
                            <input type="text" id="titleen" v-model="widget.title_en" placeholder="Widget Title">
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6">
                        <div class="form-group">
                            <label for="titlefr">Title(FR):</label>
                            <input type="text" id="titlefr" v-model="widget.title_fr" placeholder="Widget Title">
                        </div>
                    </div>
                </div>
            </section>
            <header class="full-width mt-3">
				<h1>Gallery Images</h1>
			</header>
            <section class="edit-widget" v-if="images_en">
                <div class="row" id="widgetList">
                    <div class="col-6">
                        <label>Images(EN):</label>
                        <draggable v-model="images_en" group="widgets" @start="drag=true" @end="drag=false" class="list-group row-list">
                            <transition-group type="transition" :name="'flip-list'">
                                <div class="list-group-item" v-for="image in images_en" :key="image.id">
                                    <img :src="image.thumb_url">
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="col-6">
                        <label>Images(FR):</label>
                        <draggable v-model="images_fr" group="widgets" @start="drag=true" @end="drag=false" class="list-group row-list">
                            <transition-group type="transition" :name="'flip-list'">
                                <div class="list-group-item" v-for="image in images_fr" :key="image.id">
                                    <img :src="image.thumb_url">
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </section>
            <header class="full-width mt-3">
				<h1>Add Image (drag and drop image from the list)</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="updateWidget()">
                        <font-awesome-icon icon="sync-alt" />
                        <span>Upload New Image</span>
                    </button>
                </div>
			</header>
            <section class="edit-widget" v-if="images_en">
                <div class="row">
                    <div class="col-12">
                        <label>Server Images</label>
                        <draggable v-model="images" :options="{group:{ name:'widgets', store: null,  pull:'clone', revertClone: true }}" @start="drag=true" @end="drag=false" class="img-list-group">
                            <transition-group type="transition" :name="'flip-list'" class="scroll">
                                <div class="img-list-group-item" v-for="image in images" :key="image.id">
                                    <img :src="image.thumb_url">
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
			</section>
		</div>
    </main>
</template>
<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import draggable from 'vuedraggable'

library.add(faSyncAlt, faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
export default {
    name: 'editGallery',
    components: {
        draggable,
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from.path
        })
    },
	data: function () {
		return {
            ps:null,
            psgal:null,
            widget:[],
            images_en:[],
            images_fr:[],
            images:[],
            prevRoute: null
		}
	},
	mounted: function() {
        this.getWidgetData()
	},
	methods: {
        // getting widget
		getWidgetData: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'gallery/'+this.$route.params.id)
            .then(response => {
                this.widget = response.data
                this.axios.get(process.env.VUE_APP_URL+'gallery/'+this.$route.params.id+'/images')
                .then(response => {
                    response.data.map(image => {
                        image.pivot.language == 'en' ? this.images_en.push(image) : this.images_fr.push(image)
                    })
                })
            })
            this.getImages()
        },
        // getting all images available
        getImages: function() {
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'images')
            .then(response => {
                this.images = response.data
                this.$nextTick(() => {
                    this.perfectScrollInit()
                    this.perfectScrollInitGal()
                })
            })
        },
        // sending data to the server
        updateWidget: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'video/'+this.$route.params.id, {
                language: this.widget.language,
                title: this.widget.title,
                video: this.widget.video
            })
            .then(response => {
                this.showSuccess('Widget was Updated', 'Widget data was updated successfuly.')
            })
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
		},
		perfectScrollInitGal: function() { // perfect scroll init goes after dom update
			var container = document.querySelector('.img-list-group .scroll')
			if(!this.psgal && container) {
				this.psgal = new PerfectScrollbar(container)
			} else if(container) {
				this.psgal.destroy()
				this.psgal = null
				this.psgal = new PerfectScrollbar(container)
				container.scrollTop = 0
			}
		}
	}
}
</script>