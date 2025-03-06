<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" @click="view(params.data)">
      {{$t('common.viewBtn')}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'AMSListOperationBtn',
  data() {
    return {

    }
  },
  beforeMount() {
  },
  methods: {
    view(data) {
      this.$router.push({ name: 'BillAMS', query: { billid: data.blId, hblid: data.id, blNo: data.blNo }})
    }
  }
}
</script>
<style>
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
