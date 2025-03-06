<template>
  <el-dialog
    :visible.sync="showDataImportDialog"
    :title="$t('sea.dataImport')"
    width="500px"
    :before-close="colseDialog"
    :close-on-click-modal="false"
    v-loading="loading"
  >
    <div class="opt-wrap">
      <el-button v-if="isDownloadExcel" size="small" @click="downloadExcel">{{$t('sea.templateDownload')}}</el-button>
      <SeaExcelUpload
        ref="excelUpload"
        :can-be-upload="canBeUpload"
        @uploadSuccess="uploadSuccess"
        @uploadError="uploadError"
        @setUploadStatus="setUploadStatus"
        @removeFile="removeFile"
        @onPreview="onPreview"
        :fileList="fileList"
        :btnText="btnText || $t('sea.dataImport')"
        :styleText="styleText"
        :autoUpload="autoUpload"
        :uploadUrl="uploadUrl"
        :whiteList="whiteList"
        :limit="limit"
      />
    </div>
    <div v-if="code == 'PROXY'" style="color: red">
      <div>注意：</div>
      <div>1、请确保导入装箱数据完整，箱量匹配</div>
      <div>2、NIL数据不支持导入，请在系统中维护</div>
      <div>3、任意装箱数据关联提单后，将无法导入更新</div>
    </div>
    <div class="footer-btn">
      <el-button size="small" @click="colseDialog">{{ $t('sea.close') }}</el-button>
      <el-button type="primary" size="small" @click="uploadFile">{{ $t('sea.upload') }}</el-button>
    </div>
  </el-dialog>

</template>

<script>

import { getToken } from "@/utils/auth"
import SeaExcelUpload from "@/views/cargo/v0/SeaExport/components/order/seaExcelUpload"
import { saveElectronicFile } from "@/api/seaExport"

export default {
	name: "DataImport",
	components: {
		SeaExcelUpload
	},
	props: {
		showDataImportDialog: { type: Boolean, default: false },
		isDownloadExcel: { type: Boolean, default: true },
		fileList: { type: Array, default: () => [] },
		btnText: { type: String, default: '' },
		code: { type: String, default: '' },
		name: { type: String, default: '' },
		autoUpload: { type: Boolean, default: true },
		uploadType: { type: String, default: null },
		uploadUrl: { type: String, default: '/api/mdm-service/web/upload/file' },
		limit: { type: Number, default: 10 },
		whiteList: { type: Array, default: () => ["jpg", "jpeg", "png", "pdf", "JPG", "JPEG", "PNG", "PDF", "xlsx", "xls", "docx", "txt"] },
		downLoadFileName: { type: String, default: 'destinationPortTemplate.xlsx' }
	},
	data() {
		return {
			loading: false,
			canBeUpload: false,
			styleText: {
				width: '80%',
				'margin': '0 auto'
			},
			cloudFileVOList: [],
			oneUpload: {
				entityId: this.$route.query.id,
				entityType: 'SEA_ORDER_EXPORT',
				documentTypeCode: '',
				documentTypeCodeName: '',
				documentTypeCodeDesc: ''
			}
		}
	},
	watch: {
		code(val) {
			this.oneUpload.documentTypeCode = this.code
		},
		name(val) {
			this.oneUpload.documentTypeCodeName = this.name
			this.oneUpload.documentTypeCodeDesc = this.name
		}
	},
	created() {
	},
	methods: {
		closeUploadDialog() {

		},
		colseDialog() {
			this.clearUploadFiles()
			this.$emit('close', false)
		},
		downloadExcel() {
			let _fileName = this.downLoadFileName
			const link = document.createElement('a')
			link.download = _fileName
			link.href = encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${_fileName}&Authorization=${getToken()}`)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		},
		async uploadFile() {
			if (this.uploadType === 'packing') {
				let files = this.$refs.excelUpload.getUploadFiles
				if (files.length > 0) {
					this.loading = true
					await this.$refs.excelUpload.submit()
				}

				return
			}
			if (!this.canBeUpload) {
				this.$message({
					type: 'warning',
					message: this.$t('sea.pleaseSelectAFile')
				})
				return false
			}
			this.loading = true
			const res = await saveElectronicFile(this.cloudFileVOList)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.fileUploadedSuccessfully'))
				this.clearUploadFiles()
				this.canBeUpload = false
				this.$emit('update:showDataImportDialog', false)
				this.cloudFileVOList = []
			}
			// this.$refs.excelUpload.submit()
		},
		uploadSuccess(res) {
			this.loading = false
			console.log('cloudFileVOList:', res)
			if (res.ok) {
				if (this.uploadType === 'packing') {
					this.$message.success(this.$t('sea.fileUploadedSuccessfully'))
					this.$emit('update:showDataImportDialog', false)
					this.$emit('packingUpdate')
					this.clearUploadFiles()
					return
				}
				const file = res.content
				file.name = file.cloudFileName
				this.cloudFileVOList.push({ ...res.content, ...this.oneUpload })
				console.log(this.cloudFileVOList)
			}
		},
		uploadError(message) {
			this.loading = false
			this.$message({
				type: 'error',
				dangerouslyUseHTMLString: true,
				message: message
			})
			this.clearUploadFiles()
			this.canBeUpload = false
			this.cloudFileVOList = []
		},
		uploadExceed() {
			this.loading = false
			this.$message({
				type: 'error',
				message: '超出文件上传个数'
			})
			this.clearUploadFiles()
			this.canBeUpload = false
		},
		setUploadStatus(val) {
			this.canBeUpload = val
		},
		removeFile(file) {
			console.log(file, file.response)
			if (file.status === "ready") {
				this.cloudFileVOList = this.cloudFileVOList.filter(f => f.uid !== file.uid)
			} else {
				if (!file.cloudFileName && file.response) {
					file.cloudFileName = file.response.content.cloudFileName
				}
				this.cloudFileVOList = this.cloudFileVOList.filter(f => f.cloudFileName !== file.cloudFileName)
			}

		},
		clearUploadFiles() {
			this.$emit('update:isDownloadExcel', false)
			this.cloudFileVOList = []
			this.$refs.excelUpload.clearUploadFiles()
		},
		onPreview(file) {
			// const jpg = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]
			// let cloudFileName, url
			// if (file.url) {
			//   cloudFileName = file.cloudFileName
			//   url = file.url
			//
			// } else {
			//   cloudFileName = file.response.content.cloudFileName
			//   url = file.response.content.url
			// }
			//
			// const fileSuffix = file.cloudFileName.substring(file.cloudFileName.lastIndexOf(".") + 1)
			// if (jpg.indexOf(fileSuffix) > -1) {
			//   // 是图片
			//   this.filepaths = []
			//   this.fileimageShow = true
			//   this.filepaths.push(url)
			// } else {
			//   window.open(url)
			// }

		}
	}

}
</script>
<style lang="less" scoped>
.opt-wrap {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-start;
}
.footer-btn {
	margin-top: 30px;
	text-align: right;
}
</style>
