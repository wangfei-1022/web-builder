<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="showModifyDialog">{{$t('packageWarehouse.modifyWarehouse')}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'EmployeeOpreationBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    showModifyDialog() {
      this.params.modifyEmployee(this.params.data)
    }
  },
  mounted() {},
  created() {}
}
</script>
<style>
</style>
