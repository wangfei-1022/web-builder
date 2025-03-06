<template>
  <div class="option-btn-wrap">
    <el-button
      v-if="params.data.entryState < 4"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.changeCharge(params.data)"
      v-permission="['ovl:receive:charge:adjust']"
    >
      {{$t('receiveFms.change_charge')}}
    </el-button>
    <el-button
      v-if="params.data.entryState === 1"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.joinBill(params.data)"
      v-permission="['ovl:receive:charge:put:bill']"
    >
       {{$t('receiveFms.join_bill')}}
    </el-button>
    <el-button
      v-if="params.data.entryState === 1"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.noBill(params.data)"
      v-permission="['ovl:receive:charge:wont:bill']"
    >
       {{$t('receiveFms.bill_unallow')}}
    </el-button>
    <el-button
      v-if="params.data.entryState === 10"
      type="text"
      size="mini"
      class="ml-10"
      @click="params.context.componentParent.recoverBill(params.data)"
      v-permission="['ovl:receive:charge:restore:bill']"
    >
       {{$t('receiveFms.bill_allow')}}
    </el-button>

  </div>
</template>
<script>
// 1 待入账
// 2 已入账
// 3 部分入账
// 10 不再入账

export default {
	name: "OptionBtnReceiveCharge",
	data() {
		return {}
	},
	methods: {
		noBill() {

		},
		recoverBill() {

		}
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

