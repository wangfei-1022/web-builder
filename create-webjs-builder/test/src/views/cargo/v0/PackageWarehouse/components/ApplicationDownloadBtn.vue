<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="downloadApp">{{$t('packageWarehouse.applicationManager.downloadAppBtn')}}</el-button>
  </div>

</template>
<script>
export default {
  name: 'ApplicationDownloadBtn',
  data() {
    return {}
  },
  computed: {},
  methods: {
    async downloadApp() {
      this.params.downloadApp(this.params.value)
    }
  },
  created() {
  }
}
</script>
<style>
</style>
