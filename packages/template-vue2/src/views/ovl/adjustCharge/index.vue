<template>
  <div class="page-edit-container full-page">
    <div class="page-edit-content" v-loading="confirmLoading">
      <div class="info-container"> 
        <div class="info-item">
          <label>{{$t('receiveFms.entity_no')}}</label>
          <span>{{order.entityNo}}</span>
        </div>
        <div class="info-item">
          <label>{{$t('receiveFms.customer_name')}}</label>
          <span>{{order.memberName || '-'}}</span>
        </div>
        <div class="info-item">
          <label>{{$t('receiveFms.warehouse_name')}}</label>
          <span>{{order.warehouseName}}</span>
        </div>
        <div class="info-item">
          <label>{{$t('receiveFms.settlement_office_name')}}</label>
          <span>{{confirmationOrder.settlementOfficeName || '-'}}</span>
        </div>
        <div class="info-item">
          <label>{{$t('receiveFms.currency')}}</label>
          <span>{{confirmationOrder.currency || '-'}}</span>
        </div>
      </div>
      <el-table size="mini" :data="tableData" style="margin-bottom: 20px;" row-key="id" border :summary-method="getSummaries" show-summary :row-class-name="tableRowClassName">
        <el-table-column  prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="150"></el-table-column>
        <el-table-column  prop="price" :label="$t('receiveFms.price')" min-width="60"></el-table-column>
        <el-table-column  prop="currency" :label="$t('receiveFms.currency')" min-width="80"></el-table-column>
        <el-table-column  prop="chargeQuantity1" :label="$t('receiveFms.number')" min-width="60"></el-table-column>
        <el-table-column  prop="unitName1" :label="$t('receiveFms.unit_name')" min-width="100"></el-table-column>
        <el-table-column  prop="estimateAmount" :label="$t('receiveFms.calc_amount')" min-width="100">
              <template slot-scope="scope">
                <div style='text-align: right'>{{formatNumberToThousands(scope.row.estimateAmount)}}</div>
            </template>
        </el-table-column>
        <el-table-column  prop="estimateOfferName" :label="$t('receiveFms.estimateOfferName')" min-width="100" v-if="addType === 'CHANGE'"></el-table-column>
        <!--addType = ADD -> 添加费用-->
        <!--addType = CHANGE -> 调整费用-->
        <el-table-column  prop="amount" :label=" addType === 'ADD' ? $t('receiveFms.entry_amount') : $t('receiveFms.old_entry_amount')" min-width="100">
            <template slot-scope="scope">
                <div style='text-align: right'>{{formatNumberToThousands(scope.row.amount)}}</div>
            </template>
        </el-table-column>
        <el-table-column  prop="offerName" :label="$t('receiveFms.offerName_origin')" min-width="100" v-if="addType === 'CHANGE'"></el-table-column>
        <el-table-column  prop="changeAmount" :label="$t('receiveFms.after_change_entry_amount')" min-width="120" v-if="addType == 'CHANGE'">
            <template slot-scope="{row}">
                <el-input v-model="row.changeAmount" v-if="(row.entryState === 2 && row.billState === 5)|| row.entryState === 1" size="mini"/>
                <span v-else>{{row.changeAmount}}</span>
            </template>
        </el-table-column>
        <el-table-column  prop="billNo" :label="$t('receiveFms.bill_no')" min-width="130"></el-table-column>
        <el-table-column  prop="entryStateName" :label="$t('receiveFms.detail_status')" min-width="80"></el-table-column>
        <el-table-column  prop="billStateName" :label="$t('receiveFms.bill_status')" min-width="110"></el-table-column>
        <el-table-column  prop="invoiceStateName" :label="$t('receiveFms.invoice_status')" min-width="80"></el-table-column>
        <el-table-column  prop="clearStateName" :label="$t('receiveFms.verification_status')" min-width="80"></el-table-column>
        <el-table-column  prop="oper" :label="$t('receiveFms.operation')" fixed="right" width="80">
          <template slot-scope="{row, $index}">
            <el-button @click="deleteFn($index)" v-if="!row.id" type="text" class="fc-red" size="mini" >
              {{$t('receiveFms.delete')}}
            </el-button>
            <el-button v-if="row.entryState === 1 && row.id" type="text" size="mini" @click="joinBill(row)" v-permission="['ovl:receive:charge:put:bill']" >
              {{$t('receiveFms.join_bill')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form ref="multipleForm" :inline="true" :model="addForm" :rules="addFormRule" label-width="100px" class="addForm">
          <el-form-item :label="$t('receiveFms.add_charge_item')" prop="feeItemCode">
              <type-select v-model="addForm.feeItemCode" type="businessFee" @selected="selectedFee" :requestParams="{businessTypeCode: 'OVERSEAS_WAREHOUSE'}" />
          </el-form-item>
          <span v-if="addForm.feeItemCode">
              <el-form-item :label="$t('receiveFms.price')" prop="price">
                  <el-input v-model.trim="addForm.price" size="mini" oninput="value=value.replace(/[^\d.]/g,'')" @change='calcAmout()'/>
              </el-form-item>
              <el-form-item :label="$t('receiveFms.currency')" prop="unit1">
                  <el-select v-model="addForm.currency" size="mini">
                      <el-option v-for="(item, index) in currencyList" :key="index" :label="item.code" :value="item.code"/>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('receiveFms.number')" prop="chargeQuantity1">
                  <el-input v-model.trim="addForm.chargeQuantity1" size="mini" oninput="value=value.replace(/[^\d.]/g,'')" @change='calcAmout()'/>
              </el-form-item>
              <el-form-item :label="$t('receiveFms.unit_name')" prop="unit1">
                  <el-select v-model="addForm.unit1" size="mini" @change="unitSelected()">
                      <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code"/>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('receiveFms.calc_amount')" prop="estimateAmount">
                  <el-input v-model.trim="addForm.estimateAmount" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')"/>
              </el-form-item>
              <el-form-item :label="$t('receiveFms.entry_amount')" prop="amount">
                  <el-input v-model.trim="addForm.amount" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')"/>
              </el-form-item>
              <el-button size="mini" type="primary" @click="addFee()">{{$t('receiveFms.add')}}</el-button>
          </span>
          <!-- 费用及费用确认单加入账单 -->
          <join-bill ref="joinBillRef" :order="orderItem" type='CHARGE' :id='activeId' :list='getDetail'></join-bill>
      </el-form>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" @click="backList()">{{$t('common.cancel')}}</el-button>
      <el-button size="mini" type="primary" @click="confirm()" :loading="confirmLoading">{{$t('common.confirm')}}</el-button>
    </div>
  </div>

</template>
<script>
import { getReceiveConfirmationDetailApi, getDictDataApi, receiveConfirmationAdjustApi, addOrderConfirmationChargeApi } from "@/api/fmsReceiveOvl"
import { getCurrenciesListApi } from "@/api/common"
import { formatNumberToThousands } from '@/utils/index'
import joinBill from "../components/joinBill"
let defaultForm = {
	feeItemCode: '',
	feeItemName: '',
	chargeQuantity1: '',
	price: '',
	estimateAmount: '',
	amount: '',
	changeAmount: '',
	invoiceTaxRate: 4, // 默认免税
	stepSize1: 1,
	unit1: '',
	currency: ''
}
export default {
	name: "OvlAdjustCharge",
	components: { joinBill },
	data() {
		return {
			addType: '',
			confirmLoading: false,
			loading: false,
			options: [],
			unitList: [],
			currencyList: [],
			confirmationDto: {}, // 获取到的费用确认单对象
			title: '',
			visvible: false,
			tableData: [],
			confirmationOrder: {}, // 费用确认单
			order: {}, // 对应的订单
			orderItem: {}, // 当前选中的行的实体订单数据
			form: {
				entityNo: ''
			},
			formRule: {
				entityNo: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "change" }]
			},
			addForm: {
				...defaultForm
			},
			addFormRule: {
				feeItemCode: [{ required: true, message: this.$t("receiveFms.please_select"), trigger: "change" }],
				currency: [{ required: true, message: this.$t("receiveFms.please_select"), trigger: "change" }],
				unit1: [{ required: true, message: this.$t("receiveFms.please_select"), trigger: "blur" }],
				chargeQuantity1: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "blur" }],
				price: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "blur" }],
				estimateAmount: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "blur" }],
				amount: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "blur" }]
			},
			activeId: null // 记录操作费用的账单id
		}
	},
	created() {
		this.form.entityNo = this.$route.query.entityNo
		this.addType = this.$route.query.type
		this.getBaseDataFn()
		if (this.addType === 'ADD' && this.$route.query.origin === 'OvlReceiveConfirmation') {
			this.init()
		} else {
			this.getDetail()
		}
	},
	methods: {
		init() {
			this.order.entityNo = this.form.entityNo
			this.order.memberName = this.$route.query.customerName
			this.order.warehouseName = this.$route.query.warehouseName
		},
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
		getBaseDataFn() {
			Promise.all([getDictDataApi(8), getCurrenciesListApi()]).then(results => {
				const unitRes = results[0]
				const currencyRes = results[1]
				if (unitRes.ok) {
					this.unitList = unitRes.content
				}
				if (currencyRes.ok) {
					this.currencyList = currencyRes.content
				}
			})
		},
		calcAmout() {
			if (this.addForm.price && this.addForm.chargeQuantity1) {
				let v = (Number(this.addForm.price) * Number(this.addForm.chargeQuantity1)).toFixed(2)
				this.addForm.amount = v
				this.addForm.estimateAmount = v
			}
		},
		tableRowClassName({ row, rowIndex }) {
			if (!row.id) {
				return 'info-row'
			}
			return ''
		},
		getSummaries(param) {
			let sums = []
			const { columns, data } = param
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = this.$t("receiveFms.sum")
					return
				}
				if (column.property === 'estimateAmount' || column.property === 'amount' || column.property === 'changeAmount') {
					let x = 0
					data.forEach(item => {
						x += Number(item[column.property])
					})
					sums[index] = formatNumberToThousands(x)
				} else {
					sums[index] = ''
				}
			})
			return sums
		},
		selectedFee(item) {
			this.addForm.feeItemName = item.chineseName
		},
		unitSelected() {
			this.unitList.forEach(v => {
				if (v.code === this.addForm.unit1) {
					this.addForm.unitName1 = v.name
				}
			})
		},
		show() {
			this.visvible = true
		},
		getDetail() {
			this.confirmLoading = true
			getReceiveConfirmationDetailApi(this.form.entityNo).then(res => {
				if (res.ok) {
					this.confirmationDto = res.content
					this.confirmationOrder = res.content.confirmationCharges[0]
					let entity = {}
					try {
						entity = JSON.parse(res.content.entityContentJson)
					} catch (err) {
						console.log(err)
					}
					this.order = {
						entityNo: res.content.entityNo,
						memberName: res.content.memberName,
						warehouseName: entity.warehouseName
					}
					let charges = []
					this.confirmationOrder.charges.forEach(v => {
						// 结算对应的账单状态 只会有一条
						v.billState = this.$isEmpty(v.keepCharges) ? null : v.keepCharges[0].billState

						v.billStateName = this.$isEmpty(v.keepCharges) ? null : v.keepCharges[0].billStateName
						v.billState =
							charges.push({
								...v,
								changeAmount: v.amount
							})
					})
					this.tableData = charges
				}
				this.confirmLoading = false
			})
		},
		addFee() {
			this.$refs.multipleForm.validate(valid => {
				if (valid) {
					this.addForm.changeAmount = this.addForm.amount
					this.tableData.push(this.addForm)
					this.addForm = {
						...defaultForm
					}
					this.$nextTick(() => {
						this.$refs.multipleForm.clearValidate()
					})
				}
			})
		},
		deleteFn(index) {
			this.tableData.splice(index, 1)
		},
		changeAmount(index) {
			let item = this.tableData[index]
			this.tableData[index] = item
		},
		confirm() {
			let data = this.confirmationDto
			let list = this.$extends(true, [], this.tableData)
			list.forEach(v => {
				v.amount = v.changeAmount
			})
			data.confirmation = {
				...this.confirmationOrder,
				charges: list
			}
			delete data.confirmationCharges
			if (this.addType === 'ADD' && this.$route.query.origin === 'OvlReceiveConfirmation') {
				let saveData = {
					bizNo: this.form.entityNo,
					bizType: this.$route.query.childBusinessType,
					charges: list
				}
				this.addConfirmationCharge(saveData)
				console.log(saveData)
				return
			}
			this.confirmLoading = true
			receiveConfirmationAdjustApi(data).then(res => {
				if (res.ok) {
					if (this.addType === 'ADD') {
						this.$message.success(this.$t("receiveFms.add_charge_success"))
					} else {
						this.$message.success(this.$t("receiveFms.change_charge_success"))
					}
					this.backList()
				}
				this.confirmLoading = false
			})
		},
		//新增费用确认单
		async addConfirmationCharge(data) {
			this.confirmLoading = true
			let res = await addOrderConfirmationChargeApi(data)
			if (res.ok) {
				this.$message.success(this.$t("receiveFms.add_charge_info_success"))
				this.backList()
			}
			this.confirmLoading = false
		},
		// 加入账单
		joinBill(item) {
			let order = {}
			try {
				order = JSON.parse(this.confirmationDto.entityContentJson)
			} catch (err) {
				this.$message.error(this.$t('receiveFms.data_error_no_entity'))
				return
			}
			order.feeItemName = item.feeItemName
			order.entityNo = this.confirmationDto.entityNo
			this.orderItem = order
			// 取账单id
			this.activeId = this.$isEmpty(item.keepCharges) ? null : item.keepCharges[0].id
			this.$refs.joinBillRef.show()
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: this.$route.query.origin })
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-table__footer-wrapper .cell {
	text-align: right;
}

.info-container {
	overflow: hidden;
	margin-bottom: 10px;
	font-size: 15px;

	.info-item {
		width: 33%;
		float: left;
		margin-bottom: 20px;

		label {
			font-weight: 500;
			margin-right: 10px;
			width: 100px;
			text-align: right;
			display: inline-block;
		}
	}
}
.el-form-item {
	margin-bottom: 10px;
}

.page-edit-container {
	background: #fff;
}
</style>

