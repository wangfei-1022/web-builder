<template>
	<div class="page-edit-container full-page">
		<div class="custmer-detail page-edit-content">
      <base-info :recordItem="recordItem"></base-info>
      <trans-info :recordItem="recordItem" :claimList="claimList" v-if="recordItem.rechargeState === 20 || recordItem.rechargeState === 30 || recordItem.rechargeState === 40"></trans-info>
      <audited-info :recordItem="recordItem" type="DETAIL" v-if="recordItem.rechargeState === 30 || recordItem.rechargeState === 40"></audited-info>
		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList">{{$t('common.close')}}</el-button>
		</div>
	</div>
</template>

<script>
import BaseInfo from './components/BaseInfo'
import TransInfo from './components/TransInfo'
import AuditedInfo from './components/AuditedInfo'
import mixin from './components/detailMixin'

export default {
	name: "RechargeRecordDetail",
	components: {
		BaseInfo,
    TransInfo,
    AuditedInfo
	},
  mixins: [mixin],
	data() {
		return {
			loading: false
		}
	},
	created() {

	}
}
</script>
<style lang="scss" scoped>
</style>
