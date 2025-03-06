<template>
  <div class="charge-tab">
    <!-- 添加费用确认单 -->
    <div class="create-btn" @click="addOrder" v-if="[0, 30].includes(order.lockOrderState) &&  !editConfirmation && order.orderState !== 100"
      v-permission="['thk:order:pay:conf:add']"><i class="iconfont icon-add-outline"></i>{{ $t('air.addExpenseConfirmation') }}
    </div>
    <!-- ESIT-23612 -->
    <PayableEdit v-if="editConfirmation && order.orderState !== 100" :item="{settlementOfficeId: '1'}" type="ADD"
      @cancelFn="cancelFn" @saveFn="saveFn" :confirmationChargesSize="confirmationCharges.length"
      :memberId="order.customerId" :memberName="order.customerName" :etd="order.businessDate" :orderBusinessType="order.businessType" v-on="$listeners"></PayableEdit>
    <div v-for="(item, index) in confirmationCharges" :key="index">
      <PayableDetail v-if="!item.isEdit" :item="item" :order="order" :index="index" @editFn="editFn" :noList="noList"
        @init="init" v-on="$listeners">
      </PayableDetail>
      <PayableEdit v-if="item.isEdit && order.orderState !== 100" :item="item || {}" :index="index"
        @cancelFn="cancelFn" @saveFn="saveFn" type="EDIT" :memberId="order.customerId"
        :memberName="order.customerName" :etd="order.businessDate" :orderBusinessType="order.businessType" v-on="$listeners">
      </PayableEdit>
    </div>
  </div>
</template>
<script>
import { getPayConfirmationListApi, payConfirmationSubmitApi, payConfirmationCommonUpdateApi, confirmationPayAdjustApi } from '@/api/thirdKind'
import { formatNumberToThousands } from '@/utils/index'
import PayableDetail from './payableDetail'
import PayableEdit from './payableEdit'
import { getCustomerDetailApi } from '@/api/partner/customerManage'
export default {
	name: 'Payable',
	components: { PayableDetail, PayableEdit },
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
			default() {
				return ""
			}
		}
	},
	data() {
		return {
			editConfirmation: false,
			confirmationCharges: [],
			confirmationOrder: {},
			noList: []
		}
	},
	watch: {
		tabPane(newV) {
			if (newV === "payable") {
				// console.log("payTab", newV)
				this.editConfirmation = false
				this.init()
			}
		}
	},
	created() {
		this.init()
	},
	methods: {
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
		async init() {
			// console.log(this.order)
			this.$emit('triggerPayableLoading', true)
			const res = await getPayConfirmationListApi(this.order.id)
			if (res.ok) {
				let target = res.content
				if (!target) {
					this.$emit('triggerPayableLoading')
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
				const customerRes = await getCustomerDetailApi(this.order.customerId)
				if (customerRes.ok) {
					this.confirmationOrder.responsibleOfficeId = customerRes.content.customer.sellerOfficeId
					this.confirmationOrder.responsibleDepartmentId = customerRes.content.customer.sellerDepartmentId
				}
			}
			this.$emit('triggerPayableLoading')
		},
		editFn(index) {
			let item = this.confirmationCharges[index]
			item.isEdit = true
			this.$set(this.confirmationCharges, index, item)
		},
		cancelFn(index, type) {
			if (type === 'ADD') {
				this.editConfirmation = false
				return
			}
			let item = this.confirmationCharges[index]
			item.isEdit = false
			this.$set(this.confirmationCharges, index, item)
		},
		async saveFn(index, item, type) {
			this.$emit('triggerPayableLoading', true)
			let data = {
				entityId: this.order.id,
				entityNo: this.order.orderNo,
				...this.confirmationOrder,
				...item,
				memberId: this.order.customerId
			}

			let res = null
			if (type === 'EDIT') {
				// console.log("confirmationState", item.confirmationState)
				let fn = item.confirmationState === 11 ? confirmationPayAdjustApi : payConfirmationCommonUpdateApi

				res = await fn(item.confirmationId, data)
				if (res.ok) {
					let msg = item.confirmationState === 11 ? this.$t('air.adjustSuccess') : this.$t('air.updateSuccessfully')
					this.$message.success(msg)
					this.init()
					item.isEdit = false
					this.$set(this.confirmationCharges, index, item)
				} else {
					this.$emit('triggerPayableLoading')
				}
			} else {
				res = await payConfirmationSubmitApi(data)
				if (res.ok) {
					let msg = type === 'ADD' ? this.$t('air.newSuccess') : this.$t('air.updateSuccessfully')
					this.$message.success(msg)
					this.init()
					this.editConfirmation = false
					this.confirmationCharges.push(item)
				} else {
					this.$emit('triggerPayableLoading')
				}
			}
		},
		addOrder() {
			this.editConfirmation = true
		}
	}
}
</script>

<style scoped lang="scss">
.charge-tab {
	background: #fff;
	padding: 20px;
	height: calc(100vh - 326px);
	overflow: hidden;
	overflow-y: auto;
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

.create-btn {
	padding: 10px;
	margin-bottom: 20px;
	text-align: center;
	border: 1px dashed blue;
	color: #1890ff;
	box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
	cursor: pointer;
}
</style>
