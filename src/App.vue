<template>
	<div class="page">
		<pageheader v-if="$route.name != 'login'"/>
		<main v-if="$route.name != 'login'">
			<pagesidebar/>
			<router-view/>
		</main>
		<main v-if="$route.name == 'login'">
			<router-view/>
		</main>
		<pagefooter v-if="$route.name != 'login'"/>
	</div>
</template>
<script>
import Vue from "vue"
import pageheader from "./components/header"
import pagefooter from "./components/footer"
import pagesidebar from "./components/sidebar"
export default {
	components: {
		pageheader,
		pagefooter,
		pagesidebar
	}
}
</script>