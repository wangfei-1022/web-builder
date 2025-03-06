<template>
  <div class="option-btn-wrap">
    <div v-if="params.data.invoiceCopyState != 2">{{params.data.invoiceCopyStateName}}</div>
    <el-popover v-else trigger="hover" width="50" popper-class="el-popover-file-upload">
      <div>
        <div class="item">
          <span @click="params.context.componentParent.uploadFile(params.data, 4)">
            {{$t('fmsReceiveInvoice.upload')}}
            <i class="iconfont icon-cloud-download-outline" />
          </span>
        </div>
      </div>
      <span slot="reference">
        {{params.data.invoiceCopyStateName}}
        <span v-if="params.data.invoiceFile && params.data.invoiceFile.invoiceFileCount != 0">
          ({{params.data.invoiceFile.invoiceCopyCount}}/{{params.data.invoiceFile.invoiceFileCount}})
        </span>
      </span>
  </el-popover>
  </div>
</template>
<script>
// 上传发票扫描件
export default {
	name: "OptionBtnReceiveBill",
	data() {
		return {}
	},
	methods: {

	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-popover {
	min-width: 50px;
}
.item {
	cursor: pointer;
	line-height: 28px;
}
.item:hover {
	background: rgba(24, 144, 255, 0.1);
}
</style>

