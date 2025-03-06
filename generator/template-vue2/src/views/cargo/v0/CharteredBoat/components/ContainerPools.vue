<template>
  <div class="container-pool-box">
    <i class="el-icon-close" @click="closeWindow" />
    <h4>
      {{$t('boatContainerList.containerPool')}}
    </h4>
    <div class="pool-item-wrap">
      <el-tag
        v-for="item in pools"
        :key="item.id"
        size="medium"
        closable
        effect="dark"
        @close="deleteNo(item)"
      >
        {{ item.containerNo }}
      </el-tag>
    </div>
    <div class="next-btn">
      <el-button size="mini" type="primary" :disabled="pools.length === 0" @click="nextStep">
        {{$t('common.nextStep')}}
      </el-button>
    </div>
  </div>
</template>
<script>
import { checkContainerDeclareByIdsApi, checkContainerStatusApi } from '@/api/containerList'
export default {
  name: 'ContainerPools',
  props: {
    pools: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkContainerList: []
    }
  },
  computed: {
    containersList() {
      return this.pools
    },
    checkSameOrigin() {
      const compareObj = this.checkContainerList[0] || false
      if (compareObj) {
        return this.checkContainerList.every(item => item.memberId === compareObj.memberId && item.vessel === compareObj.vessel &&
             item.voyage === compareObj.voyage && item.polCode === compareObj.polCode &&
             item.podCode === compareObj.podCode)
      }

      return false
    },
    // 提单状态是否全为已审核
    checkBLStatus() {
      return this.checkContainerList.some(item => item.blStatus === 1 || item.blStatus === 2 || item.blStatus === 4)
    },
    // 申请放单状态
    checkBLStatus6() {
      return this.checkContainerList.some(item => item.blStatus === 6)
    },
    checkSameStatus() {
      const compareObj = this.checkContainerList[0] || false
      if (compareObj) {
        return this.checkContainerList.every(item => item.blStatus === compareObj.blStatus)
      }

      return false
    },
    // 集装箱已删除 containerStatus/ 2
    checkContainerIsDel() {
      const compareObj = this.checkContainerList[0] || false
      if (compareObj) {
        return this.checkContainerList.some(item => item.containerStatus === 2)
      }
      return false
    },
    checkContainerStatus3() {
      const compareObj = this.checkContainerList[0] || false
      if (compareObj) {
        return this.checkContainerList.some(item => item.containerStatus === 3)
      }
      return false
    }
  },
  created() {},
  mounted() {},
  methods: {
    deleteNo(_obj) {
      // const _id = this.pools.findIndex(item => item.id === _obj.id)
      // this.containersList.splice(_id, 1)
      this.$emit('deleteNo', _obj)
    },
    closeWindow() {
      this.$emit('closeWindow')
    },
    async checkContainerStatus() {
      this.loading = true
      const _containerIdList = this.pools.map(item => item.id)
      const _status = await checkContainerStatusApi(this.$querystring.stringify({ containerIdList: _containerIdList }))
      const resDeclare = await checkContainerDeclareByIdsApi(this.$querystring.stringify({ containerIdList: _containerIdList }))
      this.loading = false
      if (!resDeclare.ok) {
        return false
      }
      if (_status.ok && _status.content.length > 0) {
        this.checkContainerList = _status.content
        return true
      }
    },
    async nextStep() {
      const res = await this.checkContainerStatus()
      if (!res) {return}
      if (this.checkBLStatus) {
        this.$message({
          type: 'warning',
          message: this.$t('boatContainerList.containerVerifiedError')
        })
        return false
      }
      if (this.checkBLStatus6) {
        this.$message({
          type: 'warning',
          message: this.$t('boatContainerList.containerStatusError')
        })
        return false
      }
      if (this.checkContainerIsDel) {
        this.$message({
          type: 'warning',
          message: this.$t('boatContainerList.containerRemovedError')
        })
        return false
      }
      if (this.checkContainerStatus3) {
        this.$message({
          type: 'warning',
          message: this.$t('boatContainerList.containerClearanceError')
        })
        return false
      }

      if (!this.checkSameOrigin) {
        this.$message({
          type: 'warning',
          message: this.$t('boatContainerList.memberDifferentError')
        })

        return false
      }
      if (!this.checkSameStatus) {
        this.$message({
          type: 'warning',
          message: this.$t('boatContainerList.statusDifferentError')
        })

        return false
      }

      this.$emit('openMergeDialog')
      this.checkContainerList = []
    }
  }
}
</script>
<style scoped lang="scss">
  .container-pool-box{
    display: block;
    position: relative;
    padding: 10px;
    height: 100%;
    .el-icon-close{
      position: absolute;
      font-size: 20px;
      cursor: pointer;
      right: 10px;
    }
    h4 {
      margin: 0;
      padding: 0;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .pool-item-wrap{
    padding: 10px 0;
    height: calc(100% - 60px);
    overflow: hidden;
    overflow-y: auto;
    ::v-deep .el-tag{
      margin: 5px 0;
    }
  }
  .next-btn{
    text-align: right;
  }
</style>
