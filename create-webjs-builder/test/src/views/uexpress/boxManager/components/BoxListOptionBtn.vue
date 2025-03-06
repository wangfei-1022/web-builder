<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="viewBoxDetail">
      {{$t('uexpressBox.listLabel.viewDetailBtn')}}
    </el-button>
  </div>
</template>
<script>
import { enableCustomerApi, disableCustomerApi } from '@/api/uexpress/customerManager'
export default {
  name: "BoxListOptionBtn",
  data() {
    return {};
  },
  created() {},
  beforeMount() {},
  methods: {
    viewBoxDetail() {
      this.$router.push({name: 'UexpressBoxDetail', params: {boxId: this.params.value, shardingKey: this.params.data.shardingKey}})
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

