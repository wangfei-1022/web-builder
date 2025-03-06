<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.editFn(params.data)">
      {{ $t("paymentInfoManage.edit") }}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.viewFn(params.data)">
      {{ $t("paymentInfoManage.view") }}
    </el-button>

  </div>
</template>
<script>
export default {
	name: "OptionBtn",
	data() {
		return {}
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

