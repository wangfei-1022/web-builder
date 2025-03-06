<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="showModifyDialog">{{$t('packageWarehouse.modifyWarehouse')}}</el-button>
    <el-button type="text" size="mini" @click="deleteDriverInfo">{{$t('common.deleteBtn')}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'DriverOpreationBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    showModifyDialog() {
      this.params.modifyDriver(this.params.data)
    },
    deleteDriverInfo() {
      this.params.deleteDriver(this.params.data.id)
    }
  },
  mounted() {},
  created() {}
}
</script>
<style>
</style>
