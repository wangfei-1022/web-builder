<template>
  <div>
    <el-upload
      ref='uploadFile'
      action=""
      :http-request="httpRequest"
      :headers="uploadHeads"
      :on-success='successUpload'
      :on-error='onError'
      :on-remove='remove'
      :before-upload='beforeUpload'
      :on-progress='progress'
      multiple
      :file-list="fileList">
      <el-button size="mini" type="primary">{{getZH('upload.uploadClickTitle','common')}}</el-button>
      <div slot="tip" class="el-upload__tip">{{getZH('upload.uploadSubTip','common')}}</div>
    </el-upload>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ossUpload } from '@/utils/ossUpload'

export default {
	name: 'FolderUpload',
	data() {
		return {
			fileList: [],
			tempList: [],
			isErr: false
		}
	},
	created() {
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.uploadFile.$children[0].$refs.input.webkitdirectory = true
		})
	},
	methods: {
		/**
		 * 文件上传时钩子
		 */
		progress() {
			this.$emit('onProgress')
		},
		/**
		 * 文件上传之前钩子
		 */
		beforeUpload(file) {
			const isJPG = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'
			const isLt2M = file.size / 1024 / 1024 < 5
			let errMsg = ''
			if (!isJPG) {
				errMsg = this.getZH('upload.imgTypeErrTip', 'common')
			}
			if (!isLt2M) {
				errMsg = this.getZH('upload.imgSizeError5MB', 'common')
			}
			let arr = file.webkitRelativePath.split('/')
			const isFormat = arr.length === 3
			if (!isFormat) {
				errMsg = this.getZH('uploadErr')
			}
			if (!isFormat || !isJPG || !isLt2M) {
				if (!this.isErr) {
					this.$message.warning(errMsg)
					this.isErr = true
					setTimeout(() => {
						this.isErr = false
					}, 1000)
				}
				return false
			}
			arr.shift()
			file.skuCode = arr[0]
			this.tempList.push(file)
		},
		httpRequest(data) {
			if (data.file.name && data.file.name.length > 150) {
				this.$message.error(this.getZH('lengthOver'))
				return
			}
			let callback = res => {
				res.uid = data.file.uid
				this.successUpload(res)
			}
			ossUpload(data).then(res => {
				callback(res)
			})
		},
		/**
		 * 文件上传成功钩子
		 */
		successUpload(file) {
			let content = file
			let currentData = this.tempList.find(item => item.uid === file.uid)
			if (this.$isNotEmpty(currentData)) {
				let data = {
					cloudFileName: content.cloudFileName,
					originFileName: currentData.name,
					name: currentData.name,
					fileSize: content.fileSize,
					url: content.url,
					uid: file.uid,
					skuCode: currentData.skuCode
				}
				file.name = currentData.skuCode + '-' + file.name
				this.isErr = false
				this.$emit('success', data)
				this.fileList.push(data)
			}
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'goodsManagement'
			let str = obj + '.' + key
			return this.$t(str)
		},
		/**
		 * 文件上传失败时钩子
		 */
		onError() {
			this.isErr = false
			this.$emit('onError')
		},
		remove(file) {
			this.$emit('remove', file)
		}
	}
}
</script>

<style scoped lang="scss">
.download-text {
	color: #108efd;
	cursor: pointer;
}
</style>
