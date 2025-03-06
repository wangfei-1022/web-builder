<template>
  <div class="option-btn-wrap">
    <div v-if="params.data.otherFilesState != 2">{{params.data.otherFilesStateName}}</div>
    <el-popover v-else trigger="hover" width="50" popper-class="el-popover-file-upload">
      <div>
        <div class="item">
          <span @click="params.context.componentParent.uploadFile(params.data, 6)">
            {{$t('fmsReceiveInvoice.upload')}}
            <i class="iconfont icon-cloud-download-outline" />
          </span>
        </div>
      </div>
      <span slot="reference">
        {{params.data.otherFilesStateName}}
        <span v-if="params.data.invoiceFile && params.data.invoiceFile.otherFileCount != 0 ">
          ({{params.data.invoiceFile.otherCopyCount}}/{{params.data.invoiceFile.otherFileCount}})
        </span>
      </span>
  </el-popover>
  </div>
</template>
<script>
// 上传其他附近扫描件
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
.item {
	cursor: pointer;
	line-height: 28px;
}
.item:hover {
	background: rgba(24, 144, 255, 0.1);
}
</style>

