<template>
  <el-upload
    ref="excelUpload"
    :headers="uploadHeads"
    :action="fileUploadUrl"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :on-remove="removeFile"
    :on-preview="onPreview"
    :auto-upload="autoUpload"
    :accept="acceptArr"
    :show-file-list="true"
    multiple
    :limit="limit"
    :file-list="fileList"
    :style="styleText"
  >
    <div class="input-btn" :style="styleText">{{btnText}}</div>
<!--    <div slot="tip" class="file-name-tip">-->
<!--      <span v-show="currFile">{{ fileName }}</span>-->
<!--    </div>-->
  </el-upload>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'SeaExcelUpload',
	props: {
		uploadRadioType: {
			type: String,
			default: '1'
		},
		canBeUpload: {
			type: Boolean,
			default: false
		},
		btnText: {
			type: String,
			default: '点击选择导入文件'
		},
		uploadUrl: { type: String, default: '/api/mdm-service/web/upload/file' },
		styleText: { type: Object, default: () => { } },
		autoUpload: { type: Boolean, default: false },
		whiteList: { type: Array, default: () => ["jpg", "jpeg", "png", "pdf", "JPG", "JPEG", "PNG", "PDF", "xlsx", "xls", "docx", "txt"] },
		limitFileSize: { type: Number, default: 10 },
		fileList: { type: Array, default: () => [] },
		limit: { type: Number, default: 10 }
	},
	data() {
		return {
			currFile: null,
			acceptArr: null
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		fileUploadUrl() {
			return `${process.env.VUE_APP_BASE_API}${this.uploadUrl}`
		},
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		},
		fileName() {
			return this.currFile ? this.currFile.name : ''
		},
		getUploadFiles() {
			return this.$refs.excelUpload.uploadFiles
		}
	},
	created() {
		this.acceptArr = this.whiteList.join(',.')
		this.acceptArr = '.' + this.acceptArr
	},
	mounted() { },
	methods: {

		beforeUpload(file, fileList) {
			let isReturn
			const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1)
			if (this.whiteList.indexOf(fileSuffix) === -1) {
				this.$message.error(this.$t('sea.fileTypeError'))
				return false
			}
			const isLimit2M = file.size / 1024 / 1024 < this.limitFileSize
			if (!isLimit2M) {
				this.$message({
					type: 'warning',
					message: `${this.$t('sea.fileCannotExceed')}${this.limitFileSize}M`
				})
				return false
			}

			// if (this.canBeUpload === false) {
			this.currFile = file
			this.$emit('setUploadStatus', true)
			// }
		},
		handleSuccess(res, file, fileList) {
			if (res.ok) {
				if (this.$isNotEmpty(file) && this.$isNotEmpty(res.content)) {
					res.content.uid = file.uid
				}
				this.$emit('uploadSuccess', res)
			} else {
				this.$emit('uploadError', res.errors[0].message)
			}
		},
		// 删除已上传的文件
		removeFile(file) {
			this.$emit('removeFile', file)
			// let index = this.goodsPicCloudFileVoList.findIndex(item => item.uid === file.uid)
			// if (index !== -1) {
			//   this.goodsPicCloudFileVoList.splice(index, 1)
			// }
		},
		onPreview(file) {
			this.$emit('onPreview', file)
		},
		handleError(err, file, fileList) {
			this.$emit('uploadError', err.errors[0].message)
		},
		handleExceed(file, fileList) {
			this.$message.warning(`${this.$t('sea.numberFilesCannotExceed')}${this.limit}`)
		},
		submit() {
			this.$refs.excelUpload.submit()
		},
		clearUploadFiles() {
			this.currFile = null
			this.$refs.excelUpload.clearFiles()
		}

	}
}
</script>
<style lang="scss" scoped>
.input-btn {
	margin-left: 30px;
	padding: 0 20px;
	height: 32px;
	line-height: 32px;
	color: #fff;
	font-size: 12px;
	border-radius: 4px;
	width: 200px;
	text-align: center;
	background: #409eff;
	&:hover {
		background: rgb(102, 177, 255);
	}
}
.file-name-tip {
	font-size: 14px;
	text-align: right;
	height: 24px;
	line-height: 24px;
}
::v-deep .el-upload--text {
	width: 100%;
}
</style>
