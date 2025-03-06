<template>
  <div class="batch-no-label" @click="redirectBatchList">
    {{params.data.billNo}}
  </div>
</template>
<script>
  export default {
    name: 'RedirectBatchBoxList',
    data() {
      return {}
    },
    methods: {
      redirectBatchList() {
        this.$router.push({name: 'BatchManager', query: {billNo: this.params.data.billNo}})
      }
    },
    mounted() {}
  }
</script>
<style lang="scss" scoped>
  .batch-no-label{
    cursor: pointer;
    color: #1890ff;
  }
</style>
