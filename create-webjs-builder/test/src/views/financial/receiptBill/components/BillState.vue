<template>
  <div class="option-btn-wrap flex-box">
   <span>{{params.data.billStateName}}</span>
    <el-tooltip v-if="params.data.billConfirmWithdrawRemark" class="fs-18 fc-yellow ml-10" effect="dark" :content="`${$t('receiveFms.billConfirmWithdrawRemark')}：${params.data.billConfirmWithdrawRemark}`" placement="top-start">
      <span class="el-icon-warning"></span>
    </el-tooltip>
  </div>
</template>
<script>
export default {
	name: "BillFileState",
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

