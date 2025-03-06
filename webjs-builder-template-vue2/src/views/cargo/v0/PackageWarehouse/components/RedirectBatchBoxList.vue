<template>
  <div class="batch-no-label" @click="redirectBatchBoxList">
    {{params.data.batchNo}}
  </div>
</template>
<script>
  export default {
    name: 'RedirectBatchBoxList',
    data() {
      return {}
    },
    methods: {
      redirectBatchBoxList() {
        this.$router.push({name: 'BatchBoxList', params: {batchId: this.params.data.id}})
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
