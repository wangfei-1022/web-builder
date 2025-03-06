<template>
  <div class="batch-no-label" @click="redirectBatchOrderList">
    {{params.data.boxNo}}
  </div>
</template>
<script>
  export default {
    name: 'RedirectBatchOrderList',
    data() {
      return {}
    },
    methods: {
      redirectBatchOrderList() {
        this.$router.push({name: 'BatchOrderList', params: {boxId: this.params.data.id}})
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
