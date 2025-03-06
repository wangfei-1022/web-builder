<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="viewDetail" v-show="showDetailBtn">{{$t('packageWarehouse.viewDetailBtn')}}</el-button>
  </div>

</template>
<script>
export default {
  name: 'LargePackageOpreatorBtn',
  data() {
    return {}
  },
  computed: {
    showDetailBtn() {
      return this.params.data.id && this.params.data.id.length > 0
    }
  },
  methods: {
    viewDetail() {
      this.$router.push({name: 'LargePackageDetail', params: {
        id: this.params.data.id
      }})
    }
  },
  created() {
  }
}
</script>
<style>
</style>
