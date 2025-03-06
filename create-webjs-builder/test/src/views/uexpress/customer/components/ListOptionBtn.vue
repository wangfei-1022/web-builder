<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" class="ml-10" @click="configuration">
      {{$t('uexpressCustomer.businessConfiguration')}}
    </el-button>
    <el-button v-if="params.data.customerState == 2" type="text" size="mini" class="ml-10" @click="enableCustomer">
      {{$t('common.enableBtn')}}
    </el-button>
    <el-button v-if="params.data.customerState == 1" type="text" size="mini" class="ml-10" @click="disableCustomer">
      {{$t('common.disable')}}
    </el-button>
  </div>
</template>
<script>
import { enableCustomerApi, disableCustomerApi } from '@/api/uexpress/customerManager'
export default {
  name: "CustomerListOptionBtn",
  data() {
    return {};
  },
  created() {},
  beforeMount() {},
  methods: {
    configuration() {
      this.params.showConfigurationDailog(this.params.value)
    },
    async enableCustomer() {
      const res = await enableCustomerApi({customerId: this.params.value})
      if (res && res.ok) {
        this.$message.success(this.$t('uexpressCustomer.enabledSuccess'))
        this.params.refreshData()
      }
    },
    async disableCustomer() {
      const res = await disableCustomerApi({customerId: this.params.value})
      if (res && res.ok) {
        this.$message.success(this.$t('uexpressCustomer.disabledSuccess'))
        this.params.refreshData()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
  span {
    cursor: pointer;
  }
}
</style>

