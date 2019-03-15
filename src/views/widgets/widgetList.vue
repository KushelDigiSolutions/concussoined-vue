<template>
	<section id="widgetList" v-if="sectionWidgets">
        <draggable v-model="sectionWidgets" group="widgets" @start="drag=true" @end="drag=false" class="list-group">
            <transition-group type="transition" :name="'flip-list'">
                <div class="list-group-item" v-for="w in sectionWidgets" :key="w.index">
                    <div class="info">
                        <div class="widget-type">
                            <template v-if="w.type == 'textcontent'">
                                <font-awesome-icon icon="font" />
                                <span>Text</span>
                            </template>
                            <template v-if="w.type == 'videowidget'">
                                <font-awesome-icon icon="video" />
                                <span>Video</span>
                            </template>
                            <template v-if="w.type == 'gallerywidget'">
                                <font-awesome-icon icon="images" />
                                <span>Gallery</span>
                            </template>
                            <template v-if="w.type == 'subsectionwidget'">
                                <font-awesome-icon icon="clone" />
                                <span>Subsec</span>
                            </template>
                            <template v-if="w.type == 'accordionwidget'">
                                <font-awesome-icon icon="clone" />
                                <span>Accordion</span>
                            </template>
                        </div>
                        <div class="widget-info">
                            {{w.title}}
                        </div>
                    </div>
                    <span class="action">
                        <button class="btn btn-blue icon mr-3" @click="$router.push({name:'edit-'+w.type, params:{type:w.type,id:w.id}})">
                            <font-awesome-icon icon="pencil-alt" />
                            <span>Edit</span>
                        </button>
                        <button class="btn btn-red icon">
                            <font-awesome-icon icon="trash-alt" />
                            <span>Delete</span>
                        </button>
                    </span>
                </div>
            </transition-group>
        </draggable>
    </section>
</template>

<script>
import Vue from "vue"
import CxltToastr from 'cxlt-vue2-toastr'
import draggable from 'vuedraggable'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClone, faFont, faVideo, faImages, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faClone, faFont, faVideo, faImages, faPencilAlt, faTrashAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CxltToastr)

export default {
    name: 'widgetlist',
    props:['widgets', 'update'],
    components: {
        draggable,
    },
    watch: {
        update(val) {
            this.updateWidgets()
        }
    },
	data: function () {
		return {
            sectionWidgets: this.widgets
		}
	},
	mounted: function() {

	},
	methods: {
        // updating widgets indexes
		updateWidgets: function() {
            this.sectionWidgets.map((widget, index) => {
                index ++
                var url = ''
                switch(widget.type) {
                    case 'textcontent':
                        url = 'text_content'
                        break;
                    case 'accordionwidget':
                        url = 'accordion'
                        break;
                    case 'gallerywidget':
                        url = 'gallery'
                        break;
                    case 'subsectionwidget':
                        url = 'subsection'
                        break;
                    case 'videowidget':
                        url = 'video'
                        break;
                }
                this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                this.axios.patch(process.env.VUE_APP_URL+url+'/'+param,{index:index})
            })
        }
	}
}

</script>
