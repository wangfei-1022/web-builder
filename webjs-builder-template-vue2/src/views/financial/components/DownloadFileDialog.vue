<template>
  <div>
    <el-dialog :visible.sync="visible"  width="815px">
      <div slot="title">
        <el-checkbox v-model="checkedALL" style="float: left;margin-right:8px;" @change="allChange"></el-checkbox>
        <div style="text-indent: 0px;">{{$t('fmsPayablePayment.fileList')}}</div>
      </div>
      <div>
        <el-tabs v-if="tabs.length" v-model="activeName" tab-position="left" style="min-height: 400px;max-height: 400px;overflow-y: auto;">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.fileTypeName" :name="item.fileTypeCode + ''">
            <span slot="label">
              <div style="text-align: left;">
                <el-checkbox v-model="item.checked" style="float: left;margin-right:8px;"></el-checkbox>
                <span>{{item.fileTypeName}}({{item.cloudFileVOList.length}})</span>
              </div>
            </span>
            <div class="img-container">
              <div class="img-block" v-for="(file, index) in item.cloudFileVOList" :key='index'>
                <file-preview :file-list="[file]" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="fileDownload" v-if="tabs.length" style="float: left;">{{$t("fmsReceiveInvoice.batchDownload")}}</el-button>
        <el-button @click="visible = false" size="mini">{{$t('common.close')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPaymentFileApi, downloadFileBatchByApplyApi } from "@/api/financial/fmsPayablePayment";

export default {
	name: "DownloadFileDialog",
	props: {

	},
	data() {
		return {
      id: '',
      type: '',
      checkedALL: false,
      activeName: "first",
			visible: false,
			tabs: []
		};
	},
	created() {

	},
	methods: {
    // type
    // PAYABLE_CLEAR 应付核销
    // PAYMENT 付款
    show(id, type) {
      this.id = id
      this.type = type
      this.checkedALL = false
      this.visible = true
      this.getDetail()
    },
    allChange() {
      this.tabs.forEach(v => {
        this.$set(v, 'checked', this.checkedALL)
      })
    },
    fileDownload() {
      let data = {
        instructionId: this.id,
        instructionFileTypes: []
      }
			this.tabs.forEach(v => {
				if (v.checked) {
					data.instructionFileTypes.push(v.fileTypeCode);
				}
			});
			if (data.instructionFileTypes.length === 0) {
        // 请先选一个下载的文件类型
				this.$message.error(this.$t("fmsReceiveInvoice.pleaseSelectFileType"));
				return;
			}

			downloadFileBatchByApplyApi(data).then(res => {
				if (res.ok) {
					window.location.href = res.content.url;
				}
			});
		},
		getDetail() {
			let map = {};
			this.tabs = [];
      let fn = this.type === 'PAYMENT' ? getPaymentFileApi : getPaymentFileApi
			fn(this.id).then(res => {
				if (res.ok) {
					this.activeName = res.content.fileInfoDTOs[0].fileTypeCode + '';
					this.tabs = res.content.fileInfoDTOs;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header{
  padding-left: 0px;
}
::v-deep .el-dialog__header{
  background: #fff;
  border-bottom: 1px solid #ddd;
  ::v-deep .el-dialog__title{
    color: #303133;
  }
  ::v-deep .el-dialog__headerbtn .el-dialog__close{
    color: #909399!important;
  }
}

.img-container {
	.img-block {
		float: left;
		margin-right: 15px;
		margin-bottom: 15px;
    text-align: center;
	}
}
</style>

