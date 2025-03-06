<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.view(params.data)"
      v-permission="['air:confirm:pay:view']">
      {{ $t("receiveFms.view") }}
    </el-button>
    <el-button v-if="params.data.confirmationState === 1" type="text" size="mini" class="ml-10"
      @click="params.context.componentParent.confirmCharge(params.data)" v-permission="['air:confirm:pay:confirm']">
      {{ $t("receiveFms.charge_confirm") }}
    </el-button>
  </div>
</template>
<script>
// 1 待入账
// 2 已入账
// 3 部分入账
// 10 不再入账

export default {
  name: "OptionBtnPayCharge",
  data () {
    return {

    }
  },
  methods: {
    noBill () {

    },
    recoverBill () {

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

