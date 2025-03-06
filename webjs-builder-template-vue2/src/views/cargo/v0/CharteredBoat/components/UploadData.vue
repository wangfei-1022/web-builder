<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('common.importData')" width="400px">
      <div class="flex-box">
        <el-button size="mini" class="mr-10" @click="downloadExcel">{{$t('boatBlList.downloadTemplete')}}</el-button>
        <upload-file accept=".xls,.xlsx" :upload-method="importMasterBlApi" @success="successUpload">
          <template slot="upload">
            <el-button size="mini" type="primary">{{$t('common.importData')}}</el-button>
          </template>
        </upload-file>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- v-permission="['sys:template:update']" -->
        <el-button size="mini" @click="dialogVisible = false">{{$t('common.closed')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { importMasterBlApi } from '@/api/bl'
import { getToken } from '@/utils/auth'
export default {
	name: 'UploadData',
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			importMasterBlApi: importMasterBlApi,
			dialogVisible: false
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 下载模板
		 */
		downloadExcel() {
			const _fileName = 'masterBLExport.xlsx'
			const link = document.createElement('a')
			link.download = _fileName
			link.href = encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${_fileName}&Authorization=${getToken()}`)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		},
		/**
	 * 上传成功
	 */
		successUpload() {
			this.$message.success(this.$t('common.importSuccess'))
			this.dialogVisible = false
		}
	}

}
</script>
<style lang="scss" scoped>
.noVisible {
	display: none;
}
</style>
