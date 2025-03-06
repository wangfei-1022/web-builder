<template>
  <div class="edit-btn-wrap">
    <!-- <el-button type="text" size="mini" v-permission="['ctn:container:view']" @click="viewDetail">查看</el-button>
    <el-button type="text" size="mini" v-permission="['ctn:container:update']" @click="modifyDetail">修改</el-button> -->
    <el-button type="text" size="mini" @click="viewDetail" v-show="showDetailBtn">{{$t('packageWarehouse.viewDetailBtn')}}</el-button>
  </div>

</template>
<script>
export default {
  name: 'OrderListOpreatorBtn',
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
      this.$router.push({name: 'PackageOrderDetail', params: {
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
