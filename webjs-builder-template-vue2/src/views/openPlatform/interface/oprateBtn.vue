<template>
  <div class="option-btn-wrap">
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.viewFn(params.data)"
    >
      {{$t("openPlatform.view")}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.status == 1"
      @click="params.context.componentParent.publishFn(params.data)"
    >
      {{$t("openPlatform.publish")}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.status == 2"
      @click="params.context.componentParent.newVersionFn(params.data)"
    >
      {{$t("openPlatform.addVersion")}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      v-if="params.data.status == 2"
      @click="params.context.componentParent.offlineFn(params.data)"
    >
      {{$t("openPlatform.offline")}}
    </el-button>
  </div>
</template>
<script>
export default {
	name: "OpenPlatformProductOptionBtn",
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

