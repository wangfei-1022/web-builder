<template>
	<el-upload
    action=""
    v-loading="loading"
		:drag="isDrag"
		:http-request="httpRequest"
		:before-upload="beforeUpload"
		:on-exceed="handleExceed"
		:on-remove="handleRemove"
		:file-list="fileList"
		:accept="accept"
		:show-file-list="isShowFileList"
		:multiple="multiple"
		:limit="limit"
		:disabled="disabled"
		v-bind="$attrs"
		v-on="$listeners"
		:on-preview="onPreview"
    class="upload-container"
	>
    <!-- 单独类型 证件上传使用的 证件有些特殊要求传PDF 如营业执照 -->
    <div v-if="type === 'SINGLE_FILE_PREVIEW'" class="preview-container">
			<template v-if="fileList.length > 0">
				<img v-if="fileList[0].isImage" :src="fileList[0].url" class="preview-img">
        <div v-else class="preview-file">
          <a @click="previewFile($event, fileList[0])" class="link">{{fileList[0].name}}</a>
        </div>
			</template>
			<template v-else>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">{{$t('common.upload.uploadTitle')}}<em>{{$t('common.upload.uploadClickTitle')}}</em></div>
				<div class="el-upload__text">{{$t('common.upload.uploadSubTitleAccept', { accept: accept })}}</div>
			</template>
		</div>
		<div v-else-if="drag" class="preview-container">
			<template>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">{{$t('common.upload.uploadTitle')}}<em>{{$t('common.upload.uploadClickTitle')}}</em></div>
				<div class="el-upload__text">{{$t('common.upload.uploadSubTitleAccept', { accept: accept })}}</div>
			</template>
		</div>
    <div v-else>
      <slot name="upload" v-if="$slots.upload"></slot>
			<span v-else>
        <el-button type="primary" size="mini"> {{$t('channelPriceCard.upload_file')}} </el-button>
        <div class="showAcceptInfo" v-if="showAcceptInfo && accept">{{$t('common.upload.uploadSubTitleAccept', { accept: accept })}}</div>
        <slot name="prompt" v-if="$slots.prompt"></slot>
      </span>
		</div>
		<slot name="tip"></slot>
	</el-upload>
</template>

<script>
import { ossUpload } from '@/utils/ossUpload'
import { isAssetTypeAnImage } from '@/utils/index'

export default {
	inheritAttrs: false,
	name: 'UploadFile',
	data() {
		return {
			fileList: [],
			loading: false,
			isDrag: false,
			isShowFileList: false
		}
	},
	props: {
		// 设置SINGLE_FILE_PREVIEW此类型为证件上传的时候，只能是单文件
		type: {
			type: String,
			default: ''
		},
		drag: {
			type: Boolean,
			default: false
		},
		showAcceptInfo: {
			type: Boolean,
			default: true
		},
		showFileList: {
			type: Boolean,
			default: true
		},
		value: {
			type: [Array, String],
			default: () => []
		},
		maxSize: {
			type: Number,
			default: 50
		},
		accept: {
			type: String,
			default: ''
		},
		// 导入之前的限制条件
		beforeUploadLimit: Function,
		uploadMethod: {
			type: Function
		},
		url: {
			type: String,
			default: 'api/mdm-service/web/upload/file'
		},
		multiple: {
			type: Boolean,
			default: false
		},
		limit: {
			type: Number,
			default: 9999
		},
		disabled: {
			type: Boolean,
			default: false
		},
		webkitdirectory: {
			type: Boolean,
			default: false
		}
	},
	created() {
		// 特定类型的单一图片预览
		if (this.type === 'SINGLE_FILE_PREVIEW') {
			this.isDrag = true
			this.isShowFileList = false
		} else {
			this.isDrag = this.drag
			this.isShowFileList = this.showFileList
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.webkitdirectory) {
				this.$refs.uploadFile.$children[0].$refs.input.webkitdirectory = true
			}
		})
	},
	watch: {
		value: {
			handler(val) {
				if (this.$isEmpty(val)) {
					this.fileList = []
					return
				}
				if (typeof val == 'string') {
					// 单个文件的上传 和 预览
					this.fileList = [{
						url: val,
						originFileName: val,
						name: val,
						isImage: isAssetTypeAnImage(val)
					}]
				} else if (Array.isArray(val)) {
					val.forEach(v => {
						v.name = v.name || v.originFileName || v.cloudFileName
						v.isImage = isAssetTypeAnImage(v.name)
					})
					this.fileList = val
				} else if (typeof val == 'object') {
					val.name = val.name || val.originFileName || val.cloudFileName
					val.isImage = isAssetTypeAnImage(val.name)
					this.fileList = [val]
				}
			},
			deep: true,
			immediate: true
		}
	},
	computed: {

	},
	methods: {
		httpRequest(data) {
			if (data.file.name && data.file.name.length > 150) {
				this.$message.error('文件名过长！')
				return
			}

			let callback = (res, data = null) => {
				if (!this.$isNotEmpty(res)) {
					return
				}
				// 当该组件被定义为单个图片上传预览时 需要把之前的清空，进行单一的文件覆盖
				if (this.type === 'SINGLE_FILE_PREVIEW') {
					this.fileList = []
				}

				// 当文件夹上传时
				if (this.webkitdirectory) {
					res.uid = data.file.uid
				}
				res.name = res.name || res.originFileName || res.cloudFileName
				res.isImage = isAssetTypeAnImage(res.originFileName)

				this.$emit('success', res)
				this.fileList.push(res)
				this.$emit('input', this.fileList)
				this.loading = false
			}
			this.loading = true
			// TODO
			// 上传接口需要FormData
			if (this.uploadMethod) {
				// 兼容ESIT提供的接口数据返回
				const formData = new FormData()
				formData.append('file', data.file)
				this.uploadMethod(formData).then(res => {
					if (res.ok) {
						callback(res.content)
					} else {
						// 上传失败 清除elment upload value
						this.fileList = []
						this.loading = false
						this.handleError(res)
						this.$emit('error')
					}
				}).catch(err => {
					this.$emit('error', err)
					this.loading = false
				})
			} else {
				// 兼容OSS
				ossUpload(data).then(res => {
					callback(res, data)
				}).catch(err => {
					this.$emit('error', err)
					this.loading = false
				})
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

		/**
		 * 上传限制体条件
		 */
		async beforeUpload(file) {
			const isLimit = file.size / 1024 / 1024 < this.maxSize
			if (!isLimit) {
				this.$message.error(`文件超出最大限制${this.maxSize}M`)
			}
			let limit = true
			if (this.$isNotEmpty(this.beforeUploadLimit)) {
				limit = this.beforeUploadLimit(file)
			}
			let index = file.name.lastIndexOf(".")
			let suffix = file.name.substring(index + 1)
			if (this.accept) {
				let acceptALL = this.accept + ',' + this.accept.toLocaleUpperCase()
				if (acceptALL && acceptALL.indexOf(suffix) < 0) {
					this.$message.error('上传文件格式不支持')
					return Promise.reject()
				}
			}
			return isLimit && limit ? Promise.resolve() : Promise.reject()
		},

		handleRemove(file, fileList) {
			this.fileList = fileList
			this.$emit('remove', file)
			this.$emit('input', fileList)
		},

		/**
		 * 文件超出个数限制
		 */
		handleExceed() {
			this.$message.error('文件上传个数超出限制')
		},
		onPreview(file) {
			this.$emit('preview', file)
		},
		previewFile(e, file) {
			e.preventDefault()
			e.stopPropagation()
			if (file.url) {
				let a = document.createElement('a')
				a.setAttribute('target', '_blank')
				a.setAttribute('href', file.url)
				a.click()
				document.removeChild(a)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.upload {
	::v-deep .el-upload {
		width: 100%;
	}
}
.preview-container {
	width: 100%;
	height: 100%;

	.preview-img {
		height: 100%;
	}
}
.preview-file {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
.link {
	color: #1890ff;
}
.showAcceptInfo {
	color: #333;
	font-size: 12px;
}
</style>
