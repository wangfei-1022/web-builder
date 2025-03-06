<template>
  <div>
    <span class="batch-no-label" @click="redirectOrderDetail" v-show="params.data.parcelId">{{params.data.orderNo}}</span>
    <span v-show="!params.data.parcelId">{{params.data.orderNo}}</span>
  </div>
</template>
<script>
  export default {
    name: 'DistrainLabel',
    data() {
      return {}
    },
    methods: {
      redirectOrderDetail() {
        this.$router.push({name: 'PackageOrderDetail', params: {id: this.params.data.parcelId}})
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
