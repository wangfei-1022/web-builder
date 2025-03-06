<template>
  <el-upload
    class="comm-upload"
    drag
    :show-file-list="false"
    :action="fileUploadUrl"
    :headers="uploadHeads"
    :before-upload="handleImagesUpload"
    :on-success="handleImagesUploaded"
    :on-progress="handleProgress"
    :disabled="disabled">
    <template v-if="currentImage">
      <img  :src="currentImage" class="upload-img">
    </template>
    <template v-else-if="showLoading">
      <div class="loading-wrap">
        <i class="el-icon-loading"></i>
      </div>
    </template>
    <template v-else>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{$t('common.upload.uploadTitle')}}<em>{{$t('common.upload.uploadClickTitle')}}</em></div>
      <div class="el-upload__text">{{$t('common.upload.uploadSubTitle')}}</div>
    </template>
  </el-upload>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'ImageFileUpload',
	data() {
		return {
			disabled: false,
			currentImage: ''
		}
	},
	props: {
		editUrl: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		fileUploadUrl() {
			return `${process.env.VUE_APP_BASE_API}/api/mdm-service/web/upload/file`
		},
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		},
		showLoading() {
			return this.disabled
		}
	},
	methods: {
		// ...mapActions({
		//   setLanguage: 'app/setLanguage'
		// }),
		handleImagesUpload(file) {
			const isJPG = file.type === 'image/jpeg'
			const isPNG = file.type === 'image/png'
			const isLimit2M = file.size / 1024 / 1024 < 2

			if (!isJPG && !isPNG) {
				this.$message.error(this.$t('common.upload.imgTypeError'))
			}
			if (!isLimit2M) {
				this.$message.error(this.$t('common.upload.imgSizeError'))
			}

			return isLimit2M && (isJPG || isPNG)
		},
		handleProgress() {
			this.currentImage = ''
			this.disabled = true
		},
		handleImagesUploaded(res, file) {
			this.disabled = false
			this.currentImage = res.content.url
			this.$emit('input', res.content.cloudFileName)
		}
	},
	created() { },
	mounted() {
		this.currentImage = this.editUrl
	}
}
</script>
<style lang="scss" scoped>
.comm-upload {
	height: 180px;

	::v-deep .el-upload {
		width: 100%;
	}
	::v-deep .el-upload-dragger {
		width: 100%;
	}
}
.upload-img {
	width: 300px;
	height: 180px;
}
.loading-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	i {
		font-size: 20px;
	}
}
</style>
