<template>
  <div class="option-btn-wrap">

    <el-button type="text" size="mini" class="ml-10"
      @click="params.context.componentParent.makingCargoPlan(params.data)"
      v-permission="['air:airMakingCargoPlan:makingCargoPlan']">
      {{ $t("air.makingCargoPlan") }}
    </el-button>

  </div>
</template>
<script>

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

