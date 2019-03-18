<template>
	<main id="pagecontent">
		<div class="scroll">
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
                        <draggable v-model="images" :options="{group:{ name:'widgets', store: null,  pull:'clone' }}" @start="drag=true" @end="drag=false" class="img-list-group">
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
	</main>
</template>

<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VModal from 'vue-js-modal'
import FileUpload from 'vue-upload-component'

library.add(faPlus, faPencilAlt, faTrashAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)
Vue.use(VModal, { componentName: "modal" })

export default {
    name: 'mediaManager',
    components: {
        FileUpload
    },
	data: function () {
		return {
			psgal:null,
            images: [],
            image:null,
            files:[],
            upload_url:process.env.VUE_APP_URL+'image'
		}
	},
	mounted: function() {
		this.getImages()
	},
	methods: {
		// getting all images available
        getImages: function() {
            this.images = []
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
            this.axios.get(process.env.VUE_APP_URL+'images')
            .then(response => {
                this.images = response.data
                this.$nextTick(() => {
                    this.perfectScrollInitGal()
                })
            })
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
