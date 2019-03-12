<template>
	<div class="page">
		<template v-if="$route.name != 'login'">
			<pagesidebar/>
			<section class="content">
				<pageheader/>
				<router-view/>
			</section>
		</template>
		<template v-if="$route.name == 'login'">
			<router-view/>
		</template>
	</div>
</template>
<script>
import Vue from "vue"
import pageheader from "./components/header"
import pagesidebar from "./components/sidebar"
export default {
	components: {
		pageheader,
		pagesidebar
	}
}
</script>