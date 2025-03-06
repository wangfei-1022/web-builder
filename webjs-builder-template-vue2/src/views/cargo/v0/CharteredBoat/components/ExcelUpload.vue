<template>
  <el-upload
    ref="excelUpload"
    :headers="uploadHeads"
    :action="fileUploadUrl"
    :on-change="handleFileAdded"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :auto-upload="false"
    :show-file-list="true"
    :limit="1"
    :file-list="fileList"
  >
    <div class="input-btn">{{btnText}}</div>
<!--    <div slot="tip" class="file-name-tip">-->
<!--      <span v-show="currFile">{{ fileName }}</span>-->
<!--    </div>-->
  </el-upload>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'ExcelUpload',
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
		uploadUrl: { type: String, default: '' }
	},
	data() {
		return {
			currFile: null,
			fileList: []
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		fileUploadUrl() {
			if (this.uploadUrl) {return this.uploadUrl}
			let urlStr
			switch (this.uploadRadioType) {
				case '1':
					urlStr = '/api/cas-service/omc/cas/order/container/importContainerNoData'
					break
				case '2':
					urlStr = '/api/cas-service/omc/cas/order/container/importFullReturnTimeData'
					break
				default:
					urlStr = '/api/cas-service/omc/cas/order/container/importContainerNodeData'
			}
			return `${process.env.VUE_APP_BASE_API}${urlStr}`
		},
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		},
		fileName() {
			return this.currFile ? this.currFile.name : ''
		}
	},
	created() { },
	mounted() { },
	methods: {
		handleFileAdded(file, fileList) {
			const isText = file.raw.type === 'application/vnd.ms-excel'
			const isTextComputer = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			let isReturn
			if (!isText && !isTextComputer) {
				this.$message({
					type: 'warning',
					message: this.$t('charteredBoat.excelUpload.fileTypeError')
				})
				isReturn = true
			}

			const isLimit2M = file.size / 1024 / 1024 < 2
			if (!isLimit2M) {
				this.$message({
					type: 'warning',
					message: this.$t('charteredBoat.excelUpload.fileLimited2M')
				})
				isReturn = true
			}
			if (isReturn) {
				let index = fileList.indexOf(file)
				if (index > -1) {
					fileList.splice(index, 1)
				}
				return false
			}
			// if (this.canBeUpload === false) {
			this.currFile = file
			this.$emit('setUploadStatus', true)
			// }
		},
		handleSuccess(res, file, fileList) {
			if (res.ok) {
				this.$emit('uploadSuccess')
			} else {
				this.$emit('uploadError', res.errors[0].message)
			}
		},
		handleError(err, file, fileList) {
			this.$emit('uploadError', err.errors[0].message)
		},
		handleExceed(file, fileList) {
			this.$emit('uploadExceed')
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
</style>
