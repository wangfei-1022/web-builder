<template>
  <div class="charge-tab" v-loading="loading">
    <!-- 添加费用确认单 -->
    <div class="add" @click="addOrder" v-if="order.isUnlocked && !editConfirmation && order.baseDTO.orderState !== 100"
      v-permission="['air:order:export:conf:add']">{{ $t('air.addExpenseConfirmation') }}
    </div>
    <pay-edit-charge v-if="editConfirmation && order.baseDTO.orderState !== 100" :item="{}" type="ADD"
      @cancelFn="cancelFn" @saveFn="saveFn" :confirmationChargesSize="confirmationCharges.length"
      :memberId="order.baseDTO.customerId" :memberName="order.baseDTO.customerName" :etd="order.spaceDTO.etd"></pay-edit-charge>
    <div v-for="(item, index) in confirmationCharges" :key="index">
      <pay-detail v-if="!item.isEdit" :item="item" :order="order" :index="index" @editFn="editFn" :noList="noList"
        @init="init">
      </pay-detail>
      <pay-edit-charge v-if="item.isEdit && order.baseDTO.orderState !== 100" :item="item || {}" :index="index"
        @cancelFn="cancelFn" @saveFn="saveFn" type="EDIT" :memberId="order.baseDTO.customerId"
        :memberName="order.baseDTO.customerName" :etd="order.spaceDTO.etd">
      </pay-edit-charge>
    </div>
  </div>
</template>
<script>
import { getPayConfirmationListApi, payConfirmationSubmitApi, payConfirmationCommonUpdateApi, confirmationPayAdjust } from '@/api/payAir'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import payDetail from './payDetail'
import payEditCharge from './payEditCharge'
import { getCustomerDetailApi } from '@/api/partner/customerManage'
import orderMixin from '../orderMixin'

export default {
  name: 'PayTab',
  components: {
    payDetail,
    payEditCharge
  },
  mixins: [orderMixin],
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
      loading: false
    }
  },
  watch: {
    tabPane (newV) {
      if (newV === "payTab") {
        console.log("payTab", newV)
        this.editConfirmation = false
        this.init()
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    formatNumberToThousands (value) {
      return formatNumberToThousands(value)
    },
    init () {
      this.loading = true
      getPayConfirmationListApi(this.order.id, { "entityType": 1101 }).then(res => {
        if (res.ok) {
          let target = res.content
          if (!target) {
            return
          }
          let noList = []
          target.forEach(v => {
            noList.push({
              id: v.confirmationId,
              confirmationNo: v.confirmationNo
            })
          })
          this.noList = noList
          this.confirmationCharges = target
          // 获取委托单位 所属部门信息
          getCustomerDetailApi(this.order.baseDTO.customerId).then(res => {
            if (res.ok) {
              this.confirmationOrder.responsibleOfficeId = res.content.customer.sellerOfficeId
              this.confirmationOrder.responsibleDepartmentId = res.content.customer.sellerDepartmentId
            }
          })
          this.loading = false
        }
      })


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

      let data = {
        entityId: this.order.id,
        entityNo: this.order.baseDTO.orderNo,
        entityType: "ORDER",
        ...this.confirmationOrder,
        ...item,
        memberId: this.order.baseDTO.customerId
      }
      this.loading = true
      if (type === 'EDIT') {
        console.log("confirmationState", item.confirmationState)
        let fn = item.confirmationState === 11 ? confirmationPayAdjust : payConfirmationCommonUpdateApi

        fn(item.confirmationId, data).then(res => {
          if (res.ok) {
            let msg = item.confirmationState === 11 ? this.$t('air.adjustSuccess') : this.$t('air.updateSuccessfully')
            this.$message.success(msg)
            this.init()
            item.isEdit = false
            this.$set(this.confirmationCharges, index, item)
            this.adjustConfirmFn(this.order)
          }
          this.loading = false
        })
      } else {
        payConfirmationSubmitApi(data).then(res => {
          if (res.ok) {
            let msg = type === 'ADD' ? this.$t('air.newSuccess') : this.$t('air.updateSuccessfully')
            this.$message.success(msg)
            this.init()
            this.editConfirmation = false
            this.confirmationCharges.push(item)
            this.adjustConfirmFn(this.order)
          }
          this.loading = false
        })
      }
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
