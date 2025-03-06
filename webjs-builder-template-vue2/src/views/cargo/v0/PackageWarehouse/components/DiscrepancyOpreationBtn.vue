<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="showModifyDialog">{{$t('packageWarehouse.modifyWarehouse')}}</el-button>
  </div>

</template>
<script>
export default {
  name: 'DiscrepancyOpreationBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    showModifyDialog() {
      this.params.showModifyDialog(this.params.data)
    }
  },
  created() {
  }
}
</script>
<style>
</style>
