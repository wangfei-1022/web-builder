<template>
  <div v-loading="loading" class="right-main-wrapper">
    <div class="upload" style="width: 200px;">
        <upload-file :drag="true" @success="fileChange"/>
        <upload-file @success="fileChange"/>
    </div>
  </div>
</template>
<script>

export default {
	name: 'Demo',
	data() {
		return {
			loading: false
		}
	},
	methods: {
		fileChange(file) {
			console.log(file)
		}
	}
}
</script>
<style lang="scss" scoped>
.upload {
	margin: 10px;
}
</style>
