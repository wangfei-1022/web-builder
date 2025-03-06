<template>
  <div class="charge-tab">
    <!-- 添加费用确认单 -->
    <div class="create-btn" @click="addOrder" v-if="[0, 30].includes(order.lockOrderState) && !editConfirmation && order.orderState !== 100"
      v-permission="['thk:order:conf:add']"><i class="iconfont icon-add-outline"></i>{{ $t('air.addExpenseConfirmation') }}
    </div>
    <ReceivableEdit v-if="editConfirmation && order.orderState !== 100" :item="{}" type="ADD" @cancelFn="cancelFn"
      @saveFn="saveFn" :confirmationChargesSize="confirmationCharges.length" :customerId="order.customerId" :orderBusinessType="order.businessType" :etd="order.businessDate" v-on="$listeners"></ReceivableEdit>
    <div v-for="(item, index) in confirmationCharges" :key="index">
      <ReceivableDetail v-if="!item.isEdit" :back="back" :item="item" :order="order" :index="index" @editFn="editFn" :noList="noList"
        @init="init" v-on="$listeners"></ReceivableDetail>
      <ReceivableEdit v-if="item.isEdit && order.orderState !== 100" :item="item || {}" :index="index"
        @cancelFn="cancelFn" @saveFn="saveFn" type="EDIT" :customerId="order.customerId"
        :customerName="order.customerName" :orderBusinessType="order.businessType" :etd="order.businessDate" v-on="$listeners"></ReceivableEdit>
    </div>
    <!-- <edit-charge v-if="editConfirmation && order.orderState !== 100" :item="{}" type="ADD" @cancelFn="cancelFn"
      @saveFn="saveFn" :confirmationChargesSize="confirmationCharges.length" :customerId="order.customerId" :etd="order.spaceDTO.etd" :orderBusinessType="order.businessType"></edit-charge>
    <div v-for="(item, index) in confirmationCharges" :key="index">
      <detail v-if="!item.isEdit" :item="item" :order="order" :index="index" @editFn="editFn" :noList="noList"
        @init="init"></detail>
      <edit-charge v-if="item.isEdit && order.orderState !== 100" :item="item || {}" :index="index"
        @cancelFn="cancelFn" @saveFn="saveFn" type="EDIT" :memberId="order.customerId"
        :customerName="order.customerName" :etd="order.spaceDTO.etd" :orderBusinessType="order.businessType"></edit-charge>
    </div> -->
  </div>
</template>
<script>
import { getThiReceiveListApi, confirmationAdjustApi, receiveConfirmationRecordApi } from '@/api/thirdKind'
import { formatNumberToThousands } from '@/utils/index'
import ReceivableDetail from './receivableDetail'
import ReceivableEdit from './receivableEdit'

export default {
	name: 'Receivable',
	components: { ReceivableDetail, ReceivableEdit },
	props: {
		order: {
			type: Object,
			default: () => null
		},
		tabPane: {
			type: String,
			default() {
				return ""
			}
		},
		back: {
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
	created() { },
	mounted() {
		this.init()
	},
	watch: {
		tabPane(newV) {
			if (newV === "receivable") {
				// console.log("receiveTab", newV)
				this.editConfirmation = false
				this.init()
			}
		},
		'$route'(to, from) {
			// console.log("tabPane44", this.tabPane)
			if (to.name === 'AirOrderManagementOrderDetail' && this.tabPane === "receiveTab") {
				this.init()
			}
		}
	},
	methods: {
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
		async init() {
			this.$emit('triggerReceiveLoading', true)
			const _params = {
				orderId: this.order.id
			}
			const res = await getThiReceiveListApi(_params)
			if (res.ok) {
				let target = res.content[0]
				if (!target) {
					this.$emit('triggerReceiveLoading')
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
			this.$emit('triggerReceiveLoading')
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
			this.$emit('triggerReceiveLoading', true)
			let data = {
				entityId: this.order.id,
				...this.confirmationOrder,
				confirmation: {
					arAp: 1,
					...item
				},
				entityNo: this.order.orderNo
			}

			let fn = item.confirmationState === 11 ? confirmationAdjustApi : receiveConfirmationRecordApi

			const res = await fn(data)

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
			} else {
				// 保存成功，由init关闭 loading。 保存失败时关闭loading
				this.$emit('triggerReceiveLoading')
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
