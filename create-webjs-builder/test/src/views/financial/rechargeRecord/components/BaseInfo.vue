<template>
  <div class="info-module">
    <div class="title">
      {{$t("rechargeRecord.applyInfo")}}
      <span style="margin-left: 30px;font-size: 15px;">{{$t("rechargeRecord.rechargeNo")}} {{recordItem.rechargeNo}}</span>
    </div>
    <div class="content">
      <div class="item">
        <label>{{$t("rechargeRecord.customerName")}}：</label>
        <span>{{recordItem.entryName}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.businessType")}}：</label>
        <span>{{recordItem.entryAccountCodeName}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.receiverAccountName")}}：</label>
        <span>{{recordItem.receiverAccountName}} {{recordItem.receiverAccount}}{{recordItem.receiverCurrency}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.amount")}}：</label>
        <span>{{recordItem.currency}}&nbsp;{{recordItem.amount | numberToThousands}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.entryAccountCurrency")}}：</label>
        <span>{{recordItem.entryAccountCurrency}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.payingTime")}}：</label>
        <span>{{recordItem.payingTime | parseTime}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.submitTime")}}：</label>
        <span>{{recordItem.submitTime | parseTime}}</span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.voucherCloudFileUrl")}}：</label>
        <span v-if="recordItem.voucherCloudFileUrl">
          <PreviewImageList :imgList="[{url: recordItem.voucherCloudFileUrl}]" imgWidth="200px"></PreviewImageList>
        </span>
      </div>
      <div class="item">
        <label>{{$t("rechargeRecord.rechargeRemarks")}}：</label>
        <span>{{recordItem.rechargeRemarks}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import PreviewImageList from '@/components/ImagePreview/PreviewImageList'
export default {
	name: "RechargeRecordBaseInfo",
  components: {
    PreviewImageList
  },
  props: {
    recordItem: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
	data() {
		return {

		};
	},
	created() {

	},
	methods: {

	}
};
</script>
<style scoped lang="scss">

</style>
