<template>
    <main class="pagecontent">
		<div class="scroll" v-if="!loading">
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
                        <draggable v-model="images_en" group="widgets" @start="drag=true" @end="drag=false" class="list-group row-list media-manager">
                            <transition-group type="transition" :name="'flip-list'">
                                <div class="list-group-item" v-for="image in images_en" :key="image.id" @click="imgsrc = image.url; $modal.show('imgviewer')">
                                    <img :src="image.thumb_url">
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="col-6">
                        <label>Images(FR):</label>
                        <draggable v-model="images_fr" group="widgets" @start="drag=true" @end="drag=false" class="list-group row-list for-delete">
                            <transition-group type="transition" :name="'flip-list'">
                                <div class="list-group-item" v-for="image in images_fr" :key="image.id" @click="imgsrc = image.url; $modal.show('imgviewer')">
                                    <img :src="image.thumb_url">
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </section>
            <header class="full-width mt-4">
				<h1>Add Image (drag and drop image from the list)</h1>
                <div class="actions">
                    <button class="btn icon mr-3" @click="$modal.show('imguploader')">
                        <font-awesome-icon icon="upload" />
                        <span>Upload New Image</span>
                    </button>
                </div>
			</header>
            <section class="edit-widget mb-5" v-if="images_en">
                <div class="row">
                    <div class="col-12">
                        <label>Server Images</label>
                        <draggable
                            v-model="images"
                            :options="{group:{ name:'widgets', store: null,  pull:'clone' }}"
                            @start="drag=true"
                            @end="drag=false"
                            @add="checkMove"
                            class="img-list-group">
                            <transition-group type="transition" :name="'flip-list'" class="scroll">
                                <div class="list-group-item" v-for="image in images" :key="image.id" @click="imgsrc = image.url; $modal.show('imgviewer')">
                                    <img :src="image.thumb_url">
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
			</section>
            <modal
                name="imgviewer"
                transition="nice-modal-fade"
                classes="image-viewer"
                :reset="true"
                width="60%"
                height="90%">
                <img :src="imgsrc">
            </modal>
            <modal
                name="imguploader"
                transition="nice-modal-fade"
                classes="image-uploader"
                :reset="true"
                width="350"
                height="350"
                @before-close="files = []">
                <div class="upload-drag">
                    <div class="upload">
                        <ul>
                            <td colspan="7">
                            <div class="text-center p-5">
                                <p v-if="files.length">{{files.length}} images selected.</p>
                                <p>Drop files anywhere to upload or</p>
                                <file-upload
                                class="btn icon mt-3 clickable"
                                accept="image/*"
                                name="image"
                                :post-action="upload_url"
                                :headers="axios.defaults.headers.common"
                                :multiple="true"
                                :drop="true"
                                :drop-directory="true"
                                v-model="files"
                                @input-file="inputFile"
                                ref="upload">
                                    <font-awesome-icon icon="plus" />
                                    <span>Select Images</span>
                                </file-upload>
                            </div>
                            </td>
                        </ul>
                        <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
                                <h3>Drop files to upload</h3>
                        </div>

                        <div class="upload-btn text-center">
                             <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                                <i class="fa fa-arrow-up" aria-hidden="true"></i>
                                Start Upload
                            </button>
                            <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
                                <i class="fa fa-stop" aria-hidden="true"></i>
                                 Stop Upload
                            </button>
                        </div>
                    </div>
                </div>
            </modal>
		</div>
        <div class="loading" v-if="loading"><img src="/img/loading.gif"></div>
    </main>
</template>
<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSyncAlt, faBan, faUpload, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import draggable from 'vuedraggable'
import VModal from 'vue-js-modal'
import FileUpload from 'vue-upload-component'

library.add(faSyncAlt, faBan, faUpload, faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
Vue.use(VModal, { componentName: "modal" })
export default {
    name: 'editGallery',
    components: {
        draggable,
        FileUpload
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
            delImages:[],
            images:[],
            imgsrc:'',
            image:null,
            files:[],
            upload_url:process.env.VUE_APP_URL+'image',
            prevRoute: null,
            loading: true
		}
	},
	mounted: function() {
        this.getWidgetData()
	},
	methods: {
        // getting widget
		getWidgetData: function() {
            this.images_en = []
            this.images_fr = []
            this.delImages = []
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'gallery/'+this.$route.params.id)
            .then(_ => {
                this.widget = response.data
                this.axios.get(process.env.VUE_APP_URL+'gallery/'+this.$route.params.id+'/images')
                .then(_ => {
                    response.data.map(image => {
                        image.pivot.language == 'en' ? this.images_en.push(image) : this.images_fr.push(image)
                    })
                })
            })
            this.getImages()
        },
        // getting all images available
        getImages: function() {
            this.images = []
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'images')
            .then(_ => {
                this.images = response.data
                this.loading = false
                this.$nextTick(() => {
                    this.perfectScrollInit()
                    this.perfectScrollInitGal()
                })
            })
        },
        // sending data to the server
        updateWidget: function(){
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.patch(process.env.VUE_APP_URL+'gallery/'+this.$route.params.id, {
                title_en: this.widget.title_en,
                title_fr: this.widget.title_fr
            })
            .then(_ => {
                this.delImages.map(img => {
                    this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                    this.axios.delete(process.env.VUE_APP_URL+'image/'+img.id+'/gallery/'+this.$route.params.id)
                })
                this.images_en.map((img, index) => {
                    index ++
                    let method = img.pivot ? 'patch' : 'post'
                    this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                    this.axios[method](process.env.VUE_APP_URL+'image/'+img.id+'/gallery/'+this.$route.params.id, {
                        language: 'en',
                        index: index
                    })
                })
                this.images_fr.map((img, index) => {
                    index ++
                    let method = img.pivot ? 'patch' : 'post'
                    this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                    this.axios[method](process.env.VUE_APP_URL+'image/'+img.id+'/gallery/'+this.$route.params.id, {
                        language: 'fr',
                        index: index
                    })
                })
                this.showSuccess('Widget was Updated', 'Widget data was updated successfuly.')
                this.getWidgetData()
            })
        },
        //adding removed image to the delete list
        checkMove (evt) {
            this.delImages.push(this.images[evt.newIndex])
        },
        // image uploader callbacks
        inputFile: function(newFile, oldFile) {
            if (newFile && oldFile) {
                // Start upload
                if (newFile.active !== oldFile.active) {
                    console.log('Start upload')
                }
                // Upload progress
                if (newFile.progress !== oldFile.progress) {
                    console.log('progress')
                }
                // Upload error
                if (newFile.error !== oldFile.error) {
                    console.log('error')
                    this.showError('Image upload', 'Something went wrong')
                }
                // Uploaded successfully
                if (newFile.success !== oldFile.success) {
                    console.log('success')
                    this.$modal.hide('imguploader')
                    this.showSuccess('Image upload', 'All images have been uploaded')
                    this.getImages()
                }
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