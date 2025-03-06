<template>
	<div>
    <!--付款单位与结算单位不一致-->
    <el-tooltip
      class="item"
      effect="light"
      :content="$t('fmsReceiveClear.payerNameSameAsSettlementCompanyFlag')"
      placement="top"
      popper-class="is-blue"
      v-if="!params.data.payerNameSameAsSettlementCompanyFlag"
    >
      <i class="info-icon el-icon-warning-outline" />
    </el-tooltip>
    {{params.data.payerNameGroupStr}}
	</div>
</template>
<script>
export default {
	name: "PayerNameGroupComponent",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.info-icon{
    color: red;
    font-size: 16px;
    margin-left: 5px;
}
</style>

