<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews" :exclude="unCachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div v-show="$route.meta.showIframe" id="ifmReport1Div" style="width:100%;height: 100%" />
  </section>
</template>

<script>
export default {
	name: 'AppMain',
	computed: {
		cachedViews() {
			return this.$store.state.tagsView.cachedViews
		},
		unCachedViews() {
			return ['MessageList']
		},
		key() {
			return this.$route.fullPath
		}
	}
}
</script>

<style lang="scss" scoped>
.app-main {
	/* 50= navbar  50  */
	min-height: calc(100% - 84px);
	width: 100%;
	position: relative;
	overflow: hidden;
}

// .fixed-header+.app-main {
//   padding-top: 50px;
// }

.hasTagsView {
	.app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		height: calc(100% - 84px);
		overflow: hidden;
		overflow-y: auto;
	}

	// .fixed-header+.app-main {
	//   padding-top: 84px;
	// }
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
	.fixed-header {
		padding-right: 15px;
	}
}
.right-main-wrapper {
	padding: 20px;
	height: 100%;
	overflow: hidden;
}
</style>

