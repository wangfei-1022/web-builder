<template>
  <div class="option-btn-wrap">

    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.publish(params.data)"
      v-permission="['air:airProductLineManagement:publish']" v-if="params.data.productStatus == 1">
      {{ $t("air.publish") }}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.cancellation(params.data)"
      v-permission="['air:airProductLineManagement:cancellation']" v-if="params.data.productStatus == 2">
      {{ $t("air.cancellation") }}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.view(params.data)"
      v-permission="['air:airProductLineManagement:view']">
      {{ $t("air.view") }}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.copy(params.data)"
      v-permission="['air:airProductLineManagement:copy']">
      {{ $t("air.copy") }}
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

