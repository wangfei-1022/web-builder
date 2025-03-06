<template>
  <span v-if="params.data.currentApprovalLog" :title="params.data.currentApprovalLog.nextApprovalUser">
    {{params.data.currentApprovalLog.nextApprovalUser}}
  </span>
</template>
<script>
export default {
	name: "NextApprovalUser",
	data() {
		return {};
	}
};
</script>
<style lang="scss" scoped>

</style>

