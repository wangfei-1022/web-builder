<template>
  <div class="partner-electronic-file-operation-button-in-aggrid">
    <el-button size="mini" type="text" @click="invokeToDownloadPartnerElectronicFile">下载</el-button>
    <el-button size="mini" type="text" style="color:#f78989" @click="invokeToDeletePartnerElectronicFile">删除</el-button>
  </div>
</template>
<script>
export default {
  name: 'PartnerElectronicFileOperationButton',
  methods: {
    invokeToDeletePartnerElectronicFile() {
      this.params.context.componentParent.toDeletePartnerElectronicFile(this.params.data.id)
    },
    invokeToDownloadPartnerElectronicFile() {
      this.params.context.componentParent.toDownloadPartnerElectronicFile(this.params.data.url)
    }
  }
}
</script>
<style>
  .partner-electronic-file-operation-button-in-aggrid .el-button{
    padding: 0;
  }
</style>
