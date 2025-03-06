<template>
  <div class="option-btn-wrap">
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.view(params.data)"
    >
      {{$t('fmsReceiveInvoice.view')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="(params.data.invoiceStateDefine == 'UN_SUBMIT' || params.data.invoiceStateDefine == 'EXCEPT') && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.editInvoiceFn(params.data)"
    >
      {{$t('fmsReceiveInvoice.edit')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.invoiceStateDefine == 'UN_SUBMIT' && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.cancelFn(params.data)"
    >
      <!--撤回-->
      {{$t('fmsReceiveInvoice.recall')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.taxSystemState == 14 && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.submitTaxFn(params.data)"
    >
      <!--重新提交-->
      {{$t('fmsReceiveInvoice.resubmitTax')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.notifyState == 3 && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.resendEmailFn(params.data)"
    >
      <!--重新推送-->
      {{$t('fmsReceiveInvoice.resendEmail')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.taxSystemState == 24 && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.nullifyFn(params.data)"
    >
      <!--重新作废-->
      {{$t('fmsReceiveInvoice.nullifyRe')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.taxSystemState == 24 && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.nullifyCancelFn(params.data)"
    >
      <!--取消作废-->
      {{$t('fmsReceiveInvoice.nullifyCancel')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.taxSystemState == 34 && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.reverseAgainFn(params.data)"
    >
      <!--重新红冲-->
      {{$t('fmsReceiveInvoice.reverseAgain')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.taxSystemState == 34 && params.data.role == 'FINANCE'"
      @click="params.context.componentParent.reverseInvocieCancelFn(params.data)"
    >
      <!--取消红冲-->
      {{$t('fmsReceiveInvoice.reverseInvocieCancel')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="false"
      @click="params.context.componentParent.viewInvoiceDetailFn(params.data)"
    >
      <!--发票明细-->
      {{$t('fmsReceiveInvoice.invoiceDetail')}}
    </el-button>
  </div>
</template>
<script>
export default {
	name: "OptionBtnInvoiceOper",
	data() {
		return {}
	},
	methods: {

	}
}
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

