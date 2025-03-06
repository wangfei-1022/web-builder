<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" :disabled="params.data.operationYard === ''" @click="viewSubDetail">{{$t('common.viewBtn')}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'SubDetailBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    viewSubDetail() {
      this.$router.push({name: 'ViewDynamicSubDetail', params: {
        type: this.params.viewType,
        yard: this.params.data.operationYard,
        code: this.params.data.operationCode
      }})
    }
  },
  created() {
  }
}
</script>
<style>
</style>
