<template>
  <div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="viewBoxDetail">
      {{$t('uexpressBL.listLabel.viewDetailBtn')}}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="modifyBl">
      {{$t('uexpressBL.listLabel.modifyBtn')}}
    </el-button>
    <el-button type="text" size="mini" class="ml-10" @click="updateBl">
      {{$t('uexpressBL.listLabel.updateBtn')}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: "BLListOptionBtn",
  data() {
    return {};
  },
  created() {},
  beforeMount() {},
  methods: {
    viewBoxDetail() {
      this.$router.push({name: 'UexpressBLDetail', params: { blId: this.params.value }})
    },
    modifyBl() {
      this.params.showModifyBL(this.params.data)
    },
    updateBl() {
      this.params.context.componentParent.updateBl(this.params.data)
    }
    // unbindBlNo() {
    //   this.$confirm(this.$t('uexpressBL.listLabel.unbindBlWarnning'), this.$t('common.warnningText'), {
    //     confirmButtonText: this.$t('uexpressBL.listLabel.unbindBlBtn'),
    //     cancelButtonText: this.$t('planManager.thinkOver'),
    //     type: 'warning'
    //   }).then(async () => {
    //     const res = await unbindBlNoApi({outboundId: this.params.value, shardingKey: this.params.data.shardingKey})
    //     if (res && res.ok) {
    //       this.$message.success(this.$t('uexpressBL.listLabel.unbindBlSuccess'))
    //       this.params.refreshData()
    //     }
    //   }).catch(() => {})
    // }
  }
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
  span {
    cursor: pointer;
  }
}
</style>

