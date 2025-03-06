<template>
  <div class="option-btn-wrap">
    <el-button
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.download(params.data)"
      v-permission="['ovl:receive:bill:download']"
    >
       {{$t('receiveFms.download_bill')}}
    </el-button>
     <el-button
        v-if="params.data.billState === 5"
        type="text"
        size="mini"
        class="ml-10"
        @click="params.context.componentParent.confirm(params.data)"
        v-permission="['ovl:receive:bill:confirm']"
    >
      {{$t('receiveFms.ovl_bill_confirm')}}
    </el-button>
  </div>
</template>
<script>
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
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

