<template>
  <el-dialog :title="$t('sea.uploadTheShippingCompanySBillOfLading')" :visible.sync="showDialog" :close-on-click-modal="false" :before-close="closeDialog" width="500px" class="dialog-box">

    <SeaExcelUpload
      ref="excelUpload"
      :can-be-upload="canBeUpload"
      @uploadSuccess="uploadSuccess"
      @uploadError="uploadError"
      @setUploadStatus="setUploadStatus"
      @removeFile="removeFile"
      :fileList="fileList"
      :btnText="$t('sea.uploadFiles')"
      :autoUpload="false"
      :uploadUrl="uploadUrl"
      :whiteList="whiteList"
      :limit="limit"
    />

    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>
<script>
import lodash from 'lodash'
import { getTerminologyListByTypeApi } from "@/api/common";
import SeaExcelUpload from "@/views/cargo/v0/SeaExport/components/order/seaExcelUpload";
import { saveElectronicFile } from "@/api/seaExport";
export default {
	name: 'replenishmentAccountNo',
	components: { SeaExcelUpload },
	props: {
		// value: { type: String, default: null },
		showDialog: { type: Boolean, default: false },
		data: { type: Boolean, default: false },
		uploadUrl: { type: String, default: '/api/mdm-service/web/upload/file' },
		whiteList: { type: Array, default: () => ["jpg", "jpeg", "png", "pdf", "JPG", "JPEG", "PNG", "PDF", "xlsx", "xls", "docx", "txt"] },
		downLoadFileName: { type: String, default: 'destinationPortTemplate.xlsx' }
	},
	data() {
		return {
			loading: false,
			dataForm: {
			},
			canBeUpload: false,
			styleText: {
				width: '80%',
				'margin': '0 auto'
			},
			fileList: [],
			cloudFileVOList: {},
			limit: 1
		}
	},
	computed: {
	},
	async created() {
	},
	methods: {
		async submit() {
			this.$refs.excelUpload.submit()
		},
		closeDialog() {
			this.$emit('update:showDialog', false)
		},

		uploadSuccess(res) {
			this.loading = false
			if (res.ok) {
				const file = res.content
				file.name = file.cloudFileName
				this.cloudFileVOList = res.content
				this.$emit('submitCallBack', res.content)
				this.closeDialog()
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
			this.cloudFileVOList = {}
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
			this.cloudFileVOList = {}
		},
		clearUploadFiles() {
			this.$emit('update:isDownloadExcel', false)
			this.cloudFileVOList = {}
			this.$refs.excelUpload.clearUploadFiles()
		},
	}
}
</script>
<style lang="scss" scoped>
.icon {
	font-size: 28px;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	user-select: none;
	&:hover {
		transform: scale(1.1);
	}
}
.blue {
	color: #1890ff;
}
.red {
	color: #ff4949;
}
.flex-bet {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
}
.box_title {
	border-left: solid 3px rgb(24, 144, 255);
	font-size: 18px;
	color: #199ed8;
	padding-left: 8px;
	height: 28px;
	line-height: 28px;
	margin: 5px 0 8px 0;
	display: flex;
	.operate-buttons-left {
		margin-left: 20px;
	}
}
.box {
	background-color: #f5f7f7;
	padding: 8px;
	::v-deep .el-form-item--medium {
		.el-form-item__content {
			line-height: 28px;
		}
		.el-form-item__label {
			line-height: 28px;
		}
	}
}
.box_child {
	border: solid 1px rgba(121, 121, 121, 1);
	padding: 20px 30px;
	background: #fff;
	margin-bottom: 15px;
	.box25 {
		width: 20%;
	}
}
::v-deep .el-form--inline .el-form-item {
	display: inline-block;
}
//**
.data-table {
	::v-deep {
		.el-form-item {
			margin: 10px 0;
		}
		.el-form-item__error {
			display: none;
		}
		.el-form-item__content {
			max-width: 100%;
		}
	}
}

.el-input__inner.disabled {
	background-color: #f5f7fa;
	border-color: #dfe4ed;
	color: #606266;
	cursor: not-allowed;
}
::v-deep {
	.el-form-item__label {
		width: auto !important;
	}
}
</style>
