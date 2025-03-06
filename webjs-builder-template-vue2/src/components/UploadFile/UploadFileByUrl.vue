<template>
	<el-upload
		:action="fileUploadUrl"
		:headers="uploadHeads"
		:before-upload="beforeUpload"
		:on-exceed="handleExceed"
		:on-success="handleSuccess"
		:on-remove="handleRemove"
		:file-list="fileList"
		:accept="accept"
		ref="upload"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<slot name="upload">
			<el-button type="primary" size="mini">
				{{ $t("common.upload.uploadFile") }}
			</el-button>
		</slot>
		<slot name="tip"></slot>
	</el-upload>
</template>

<script>
import { mapState } from 'vuex'
export default {
	inheritAttrs: false,
	name: 'UploadFileByUrl',
	data() {
		return {
			fileList: []
		}
	},
	props: {
		value: Array,
		accept: {
			type: String,
			default: ''
		},
		maxSize: {
			type: Number,
			default: 10
		},
		// 导入之前的限制条件
		beforeUploadLimit: Function,
		url: {
			type: String,
			required: true
		}
	},
	watch: {
		value: {
			handler(val) {
				if (this.$isEmpty(val)) {
					this.fileList = []
					return
				}
				if (!Array.isArray(val)) {
					val = [val]
				}
				val.forEach(v => {
					v.name = v.name || v.originFileName
				})
				this.fileList = val
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		fileUploadUrl() {
			return `${process.env.VUE_APP_BASE_API}/${this.url}`
		},
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		}
	},
	methods: {
		/**
		 * 上传限制体条件
		 */
		async beforeUpload(file) {
			const isLimit2M = file.size / 1024 / 1024 < this.maxSize
			if (!isLimit2M) {
				this.$message.error(this.$t('common.upload.imgSizeErrorMax'))
			}
			let limit = true
			if (this.$isNotEmpty(this.beforeUploadLimit)) {
				limit = this.beforeUploadLimit()
			}

			let index = file.name.lastIndexOf(".")
			let suffix = file.name.substring(index + 1)
			if (this.accept && this.accept.indexOf(suffix) < 0) {
				this.$message.error(this.$t('common.upload.uploadFileUnMatchedType'))
				return Promise.reject()
			}
			return isLimit2M && limit ? Promise.resolve() : Promise.reject()
		},
		/**
		 * 上传成功时文件
		 */
		handleSuccess(res, file, fileList) {
			if (res.ok) {
				this.$emit('success', res.content || {})
				let arr = []
				fileList.forEach(item => {
					let file = item.content ? item.content : item.response && item.response.content ? item.response.content : item
					file.name = file.name || file.originFileName
					arr.push(file || {})
				})
				this.$emit('input', arr)
			} else {
				this.handleError(res)
				this.$emit('error', res)
			}
		},
		/**
		 * 上传文件错误
		 */
		handleError(err) {
			let msg = ''
			err.errors.forEach((v, index) => {
				msg += index > 0 ? '、' : ''
				msg += v.message
			})
			this.$message.error(msg)
		},

		handleRemove(file, fileList) {
			this.$emit('remove', file)
			this.$emit('input', fileList)
		},

		/**
		 * 文件超出个数限制
		 */
		handleExceed() {
			this.$message.error(this.$t('common.upload.uploadLimitTip'))
		}
	},
	created() {
	},
	mounted() {
	}
}
</script>
<style lang="scss" scoped>
</style>
