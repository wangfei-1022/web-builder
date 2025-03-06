<template>
  <div class="charge-tab" v-loading="loading">
    <!-- 添加费用确认单 -->
    <div class="add" @click="addOrder" v-if="!editConfirmation && order.baseDTO.orderState !== 100 && memberIdFlag"
      v-permission="['air:order:exportToC:conf:add']">{{ $t('air.addExpenseConfirmation') }}
    </div>
    <edit-charge v-if="editConfirmation && order.baseDTO.orderState !== 100" :item="{}" type="ADD" @cancelFn="cancelFn"
      @saveFn="saveFn" :confirmationChargesSize="confirmationCharges.length" :memberId="order.baseDTO.customerId"
      :memberName="order.baseDTO.customerName" :etd="order.spaceDTO.etd"></edit-charge>
    <div v-for="(item, index) in confirmationCharges" :key="index">
      <detail v-if="!item.isEdit" :item="item" :order="order" :index="index" @editFn="editFn" :noList="noList"
        @init="init"></detail>
      <edit-charge v-if="item.isEdit && order.baseDTO.orderState !== 100" :item="item || {}" :index="index"
        @cancelFn="cancelFn" @saveFn="saveFn" type="EDIT" :memberId="order.baseDTO.customerId"
        :memberName="order.baseDTO.customerName" :etd="order.spaceDTO.etd"></edit-charge>
    </div>
  </div>
</template>
<script>
import { getReceiveConfirmationByOrderIdApi, receiveConfirmationRecordApi, receiveConfirmationAdjustApi } from '@/api/fmsReceiveAir'

import { confirmationAdjust } from '@/api/airExport'

import { parseTime, formatNumberToThousands } from '@/utils/index'
import detail from './detail'
import editCharge from './editCharge'
export default {
  name: 'ReceiveToCTab',
  components: {
    detail,
    editCharge
  },
  props: {
    order: {
      type: Object,
      default: function () {
        return {
          baseDTO: {}
        }
      }
    },
    tabPane: {
      type: String,
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      editConfirmation: false,
      confirmationCharges: [],
      confirmationOrder: {},
      noList: [],
      loading: false,
      memberIdFlag: false
    }
  },
  created () {
    console.log(this.order.baseDTO.customerId, this.order.baseDTO.customerName)

    if (!this.order.baseDTO.customerId || !this.order.baseDTO.customerName) {
      this.memberIdFlag = false
      this.$message.warning("请维护客户数据：深圳一海通全球供应链管理有限公司,否则应收应付无法录入");
      return
    } else {
      this.memberIdFlag = true
    }
    this.init()
  },
  watch: {
    tabPane (newV) {
      console.log("ReceiveToCTab", newV)
      if (newV === "ReceiveToCTab") {

        if (!this.order.baseDTO.customerId || !this.order.baseDTO.customerName) {
          this.memberIdFlag = false
          this.$message.warning("请维护客户数据：深圳一海通全球供应链管理有限公司,否则应收应付无法录入");
          return
        } else {
          this.memberIdFlag = true
        }
        this.editConfirmation = false
        this.init()
      }
    }
  },
  methods: {
    formatNumberToThousands (value) {
      return formatNumberToThousands(value)
    },
    init () {
      this.loading = true
      getReceiveConfirmationByOrderIdApi(this.order.id, 1102).then(res => {
        if (res.ok) {
          let target = res.content[0]
          if (!target) {
            return
          }
          let noList = []
          target.confirmationCharges.forEach(v => {
            noList.push({
              id: v.id,
              confirmationNo: v.confirmationNo
            })
          })
          this.noList = noList
          this.confirmationCharges = target.confirmationCharges
          delete target.confirmationCharges
          this.confirmationOrder = target
        }
      })
      this.loading = false
    },
    editFn (index) {
      let item = this.confirmationCharges[index]
      item.isEdit = true
      this.$set(this.confirmationCharges, index, item)
    },
    cancelFn (index, type) {
      if (type === 'ADD') {
        this.editConfirmation = false
        return
      }
      let item = this.confirmationCharges[index]
      item.isEdit = false
      this.$set(this.confirmationCharges, index, item)
    },
    saveFn (index, item, type) {
      this.loading = true
      let data = {
        entityId: this.order.id,
        ...this.confirmationOrder,
        confirmation: {
          arAp: 1,
          ...item
        },
        entityNo: this.order.baseDTO.orderNo,
        entityType: 1102
      }
      let fn = item.confirmationState === 11 ? confirmationAdjust : receiveConfirmationRecordApi

      fn(data).then(res => {
        if (res.ok) {
          let msg = type === 'ADD' ? this.$t('air.newSuccess') : this.$t('air.updateSuccessfully')
          if (item.confirmationState === 11) {
            msg = this.$t('air.adjustSuccess')
          }
          this.$message.success(msg)
          this.init()
          if (type === 'ADD') {
            this.editConfirmation = false
            this.confirmationCharges.push(item)
          } else {
            item.isEdit = false
            this.$set(this.confirmationCharges, index, item)
          }
        }
        this.loading = false
      })
    },
    addOrder () {
      this.editConfirmation = true
    }
  }
}
</script>

<style scoped lang="less">
.charge-tab {
  background: #fff;
  padding: 20px;
}

.order-item {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;

  .title {
    font-weight: 600;
    line-height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }

  .link {
    font-weight: 500;
    color: #1890ff;
  }

  .company {
    line-height: 40px;
    padding: 0 20px;
    overflow: hidden;

    label {
      font-weight: 500;
      margin-right: 20px;
    }
  }
}

.add {
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px dashed blue;
  color: #1890ff;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}
</style>
