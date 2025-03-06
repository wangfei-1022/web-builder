<template>
  <div class="container-pool-box">
    <i class="el-icon-close" @click="closeWindow" />
    <h4>
      {{ $t('air.expenseList') }}
    </h4>
    <div class="pool-item-wrap">
      <el-tag v-for="(item, index) in pools" :key="index" size="medium" closable effect="dark" @close="deleteNo(item)">
        {{ item.entityNoDisplay }}({{ item.feeItemName }} {{ item.currency }} {{ formatNumberToThousands(item.amount)
        }})
      </el-tag>
    </div>
    <div class="next-btn">
      <el-button size="mini" type="primary" :disabled="pools.length === 0" @click="nextStep">
        {{ $t('common.nextStep') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { formatNumberToThousands } from "@/utils"
export default {
  name: 'EntryPools',
  props: {
    type: {
      type: String,
      default: ''
    },
    pools: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      checkContainerList: []
    }
  },
  computed: {
    formatNumberToThousands () {
      return formatNumberToThousands
    },
    containersList () {
      return this.pools
    },
    checkEntryState () { // 待入账
      const compareObj = this.pools[0] || false
      if (compareObj) {
        return this.pools.some(item => item.entryState !== 1)
      }
      return false
    },
    checkSameMemberId () { // 是否属于同一客户的同一结算单位
      const compareObj = this.pools[0] || false
      if (compareObj) {
        if (this.type === "pay") {
          return this.pools.some(item => item.settlementCompanyId !== compareObj.settlementCompanyId)

        } else {
          return this.pools.some(item => item.memberId !== compareObj.memberId || item.settlementCompanyId !== compareObj.settlementCompanyId)
        }
      }
      return false
    },
    // 结算方式是否一致
    checkSomeSettlementMode () {
      const compareObj = this.pools[0] || false
      if (compareObj) {
        return this.pools.some(item => item.settlementMode !== compareObj.settlementMode)
      }
      return false
    },
    checkSettlementModeNot1 () {
      const compareObj = this.pools[0] || false
      if (compareObj) {
        return this.pools.some(item => item.settlementMode === 1)
      }
      return false
    }
  },
  created () { },
  mounted () { },
  methods: {
    deleteNo (_obj) {
      // const _id = this.pools.findIndex(item => item.id === _obj.id)
      // this.containersList.splice(_id, 1)
      this.$emit('deleteNo', _obj)
    },
    closeWindow () {
      this.$emit('closeWindow')
    },
    async nextStep () {
      if (this.checkEntryState) {
        this.$message({
          type: 'warning',
          message: this.$t('air.expenseHasBeenAssociatedWithBill')
        })
        return false
      }
      if (this.checkSameMemberId) {
        this.$message({
          type: 'warning',
          message: this.type === "pay" ? this.$t('air.pleaseSelectTheSameCustomerPay') : this.$t('air.pleaseSelectTheSameCustomer')
        })
        return false
      }
      if (this.checkSomeSettlementMode) {
        this.$message({
          type: 'warning',
          message: this.$t('air.inconsistentExpenseSettlementMethods')
        })
        return false
      }
      // if (this.checkSettlementModeNot1) {
      //   this.$message({
      //     type: 'warning',
      //     message: this.$t('air.theTicketSettlementFeeHasBeenConfirmed')
      //   })
      //   return false
      // }
      this.$emit('passValidation')
      this.checkContainerList = []
    }
  }
}
</script>
<style scoped lang="scss">
.container-pool-box {
  display: block;
  position: relative;
  padding: 10px;
  height: 100%;

  .el-icon-close {
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

.pool-item-wrap {
  padding: 10px 0;
  height: calc(100% - 60px);
  overflow: auto;

  ::v-deep .el-tag {
    margin: 5px 0;
  }
}

.next-btn {
  text-align: right;
}
</style>
