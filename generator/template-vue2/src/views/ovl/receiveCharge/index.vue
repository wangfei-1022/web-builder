<template>
  <div class="pd-16" v-loading="loading">
    <TopSearchItemsSlot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
          <el-form-item :label='$t("receiveFms.order_no")' prop="entityNo">
            <el-input v-model="formData.entityNo" type="text" size="mini" clearable @keyup.enter.native="list" :placeholder="$t('receiveFms.order_no_input')" />
          </el-form-item>
          <el-form-item :label="$t('receiveFms.business_type')" prop="childBusinessTypeArr">
            <el-cascader
              size="mini"
              clearable
              v-model="formData.childBusinessTypeArr"
              :options="childBusinessTypeOptions"
              :props="{
                expandTrigger: 'hover',
                value: 'code',
                label: 'name'
              }"
              @change="list">
            </el-cascader>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
            <type-select v-model="formData.settlementCompanyId" type="settlementCompany" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}" @selected="list" />
          </el-form-item>
          <el-form-item :label="$t('receiveFms.warehouse_name')" prop="extendInfo1">
            <el-select v-model="formData.extendInfo1" size="mini"  @change="list" filterable clearable>
              <el-option v-for="(item, index) in warehouseList" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
            <el-form-item :label="$t('receiveFms.charge_name')" prop="feeItemCode">
            <type-select v-model="formData.feeItemCode" type="businessFee" :requestParams="{businessTypeCode: 'OVERSEAS_WAREHOUSE'}"  @selected="list" />
          </el-form-item>
            <el-form-item :label="$t('receiveFms.settlement_office_name')" prop="settlementOfficeId">
              <el-select v-model="formData.settlementOfficeId" size="mini" @change="list">
              <el-option :label="$t('contract.ALL')" value="" />
              <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.detail_status')" prop="entryState">
            <el-select v-model="formData.entryState" size="mini"  @change="list">
              <el-option :label="$t('receiveFms.ALL')" value="" />
              <el-option v-for="(item, index) in entryStateList" :key="index" :label="item.name" :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState">
            <el-select v-model="formData.invoiceState" size="mini"  @change="list">
              <el-option :label="$t('receiveFms.ALL')" value="" />
              <el-option v-for="(item, index) in invoiceStateList" :key="index" :label="item.name" :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.verification_status')" prop="clearState">
            <el-select v-model="formData.clearState" size="mini"  @change="list">
              <el-option :label="$t('receiveFms.ALL')" value="" />
              <el-option v-for="(item, index) in clearStateList" :key="index" :label="item.name" :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item :label='$t("receiveFms.bill_no")' prop="billNo">
            <el-input v-model="formData.billNo" type="text" :placeholder="$t('receiveFms.input_bill_no')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
      </el-form>
    </TopSearchItemsSlot>
    <div class="mb-10 mt-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="addCharge('ADD')"  v-permission="['ovl:receive:charge:add']">{{$t('receiveFms.add_charge')}}</el-button>
      <el-button size="mini" type="primary" @click="addCharge('CHANGE')"  v-permission="['ovl:receive:charge:adjust']">{{$t('receiveFms.change_charge')}}</el-button>
    </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list"/>
    <edit-charge ref="editChargeFormRef" :addChargeInfo="addChargeInfo"></edit-charge>
    <join-bill ref="joinBillRef" :order="orderItem" type='CHARGE' :id='currentItem.id' :list='list'></join-bill>
  </div>
</template>

<script>
import { getDictDataApi, getReceiveChargeListApi, receiveChargeUnallowApi, receiveChargeAllowApi, getOrderTypesApi } from "@/api/fmsReceiveOvl"
import optionBtn from "./optionBtn"
import editCharge from "../components/editCharge"
import joinBill from "../components/joinBill"
import { getYHTListApi } from '@/api/partner/base'
import { getWarehouseSelectionsApi } from '@/api/OverseasWarehouse/warehousePriceCard'
import { formatNumberToThousands } from '@/utils/index'
import { handlerTimeStr } from '@/utils'
export default {
	name: "OvlReceiveCharge",
	components: {
		optionBtn,
		editCharge,
		joinBill
	},
	data() {
		return {
			// 缺少仓库的查询使用字段确认
			formData: {
				childBusinessTypeArr: [],
				entityNo: '',
				extendInfo1: '', // 拓展字段放 仓库的查询id
				settlementCompanyId: '',
				settlementOfficeId: '', // 一海通结算公司
				childBusinessType: '',
				feeItemCode: '',
				entryState: '',
				invoiceState: '',
				clearState: '',
				billNo: ''
			},
			entryStateList: [],
			childBusinessTypeOptions: [],
			clearStateList: [],
			invoiceStateList: [],
			YHTList: [],
			warehouseList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			currentItem: '', // 当前选中行的id
			orderItem: {}, // 当前选中的行的实体订单数据
			addChargeInfo: {}, // 添加费用时候传递到dialog的信息
			// settlementCompanyName -> 一海通结算公司名字
			// settlementOfficeName -> 客户的结算主体
			columnFields: [{
				field: "entityNo",
				headerName: this.$t("receiveFms.order_no"),
				minWidth: 130
			}, {
				field: "billNo",
				headerName: this.$t("receiveFms.bill_no"),
				minWidth: 130
			}, {
				field: "childBusinessTypeName",
				headerName: this.$t("receiveFms.business_type"),
				minWidth: 100
			}, {
				field: "warehouseName",
				headerName: this.$t("receiveFms.warehouse_name"),
				minWidth: 100
			}, {
				field: "settlementCompanyName",
				headerName: this.$t("receiveFms.settlement_company_name"),
				minWidth: 130
			}, {
				field: "settlementOfficeName",
				headerName: this.$t("receiveFms.settlement_office_name"),
				minWidth: 130
			}, {
				field: "feeItemName",
				headerName: this.$t("receiveFms.charge_name"),
				minWidth: 110
			}, {
				field: "currency",
				headerName: this.$t("receiveFms.currency"),
				minWidth: 80
			}, {
				field: "price",
				headerName: this.$t("receiveFms.price"),
				minWidth: 80,
				cellRenderer(params) {
					return `<div style='text-align: right'>${formatNumberToThousands(params.value)}</div>`
				}
			}, {
				field: "chargeQuantity1",
				headerName: this.$t("receiveFms.number"),
				minWidth: 80
			}, {
				field: "estimateAmount",
				headerName: this.$t("receiveFms.calc_amount"),
				minWidth: 100,
				cellRenderer(params) {
					return `<div style='text-align: right'>${formatNumberToThousands(params.value)}</div>`
				}
			}, {
				field: "estimateOfferName",
				headerName: this.$t("receiveFms.estimateOfferName"),
				minWidth: 100
			}, {
				field: "entryAmount",
				headerName: this.$t("receiveFms.entry_amount"),
				minWidth: 100,
				cellRenderer(params) {
					return `<div style='text-align: right'>${formatNumberToThousands(params.value)}</div>`
				}
			}, {
				field: "offerName",
				headerName: this.$t("receiveFms.offerName"),
				minWidth: 100
			}, {
				field: "entryStateName",
				headerName: this.$t("receiveFms.detail_status"),
				minWidth: 100
			}, {
				field: "billStateName",
				headerName: this.$t("receiveFms.bill_status"),
				minWidth: 100
			}, {
				field: "invoiceStateName",
				headerName: this.$t("receiveFms.invoice_status"),
				minWidth: 100
			}, {
				field: "clearStateName",
				headerName: this.$t("receiveFms.verification_status"),
				minWidth: 100
			}, {
				field: "updateByName",
				headerName: this.$t("receiveFms.updateByName"),
				minWidth: 100
			}, {
				field: "updateContent",
				headerName: this.$t("receiveFms.updateContent"),
				minWidth: 100
			}, {
				field: "updateTimeStr",
				headerName: this.$t("receiveFms.updateTime"),
				minWidth: 220
			}, {
				field: "id",
				headerName: this.$t("receiveFms.operation"),
				cellRendererFramework: "optionBtn",
				pinned: 'right',
				minWidth: 210
			}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			loading: false,
			addType: '' //
		}
	},
	created() {
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getYHTListApi(), getDictDataApi(1), getDictDataApi(3), getDictDataApi(4), getWarehouseSelectionsApi(), getOrderTypesApi()]).then(results => {
				const YHTRes = results[0]
				const entryStateRes = results[1]
				const invoiceStateRes = results[2]
				const clearStateRes = results[3]
				const warehouseRes = results[4]
				const orderTypeRes = results[5]
				if (YHTRes.ok) {
					this.YHTList = YHTRes.content
				}
				if (entryStateRes.ok) {
					this.entryStateList = entryStateRes.content
				}
				if (invoiceStateRes.ok) {
					this.invoiceStateList = invoiceStateRes.content
				}
				if (clearStateRes.ok) {
					this.clearStateList = clearStateRes.content
				}
				if (warehouseRes.ok) {
					this.warehouseList = warehouseRes.content
				}
				if (orderTypeRes.ok) {
					orderTypeRes.content.forEach(v => {
						if (v.children && v.children.length === 0) {
							delete v.children
						}
					})
					this.childBusinessTypeOptions = orderTypeRes.content
				}
			})
		},
		onReady(params) {
			params.api.sizeColumnsToFit()
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		async list() {
			this.loading = true
			const _params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			if (this.formData.childBusinessTypeArr.length) {
				if (this.formData.childBusinessTypeArr.length === 1) {
					_params.entityType = this.formData.childBusinessTypeArr[0]
				} else {
					_params.entityType = this.formData.childBusinessTypeArr[0]
					_params.childBusinessType = this.formData.childBusinessTypeArr[1]
				}
			}
			delete _params.childBusinessTypeArr
			const res = await getReceiveChargeListApi(_params)
			if (res.ok) {
				this.total = parseInt(res.content.total, 10)
				res.content.list.forEach(v => {
					try {
						let updateTimeStr = handlerTimeStr(v.updateTime, 8)
						this.$set(v, 'updateTimeStr', updateTimeStr)
						let order = JSON.parse(v.entityContentJson)
						v.warehouseName = order.warehouseName
					} catch (err) {
						console.log(err)
					}
				})
				this.dataList = res.content.list
			} else {
				this.total = 0
				this.dataList = []
			}
			this.loading = false
		},
		handleSizeChange(size) {
			this.pageSize = size
			this.list()
		},
		handleCurrentChange(page) {
			this.pageNum = page
			this.list()
		},
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		},
		addCharge(type) {
			this.addChargeInfo = {
				addType: type,
				origin: 'OvlReceiveCharge'
			}
			this.$refs.editChargeFormRef.show()
		},
		// 单行的调整费用
		changeCharge(item) {
			this.$router.push({ name: `OvlAdjustCharge`, query: { entityNo: item.entityNo, id: item.id, origin: 'OvlReceiveCharge', type: 'CHANGE' } })
		},
		// 加入账单
		joinBill(item) {
			let order = {}
			try {
				order = JSON.parse(item.entityContentJson)
			} catch (err) {
				this.$message.error(this.$t('receiveFms.data_error_no_entity'))
				return
			}
			order.feeItemName = item.feeItemName
			order.entityNo = item.entityNo
			this.currentItem = item
			this.orderItem = order
			console.log(this.currentItem, this.orderItem)
			this.$refs.joinBillRef.show()
		},
		// 不再出账
		noBill(item) {
			this.$confirm(this.$t('receiveFms.bill_unallow_des'), this.$t('receiveFms.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				receiveChargeUnallowApi([item.id]).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('receiveFms.bill_unallow_success'))
						this.list()
					}
				})
			}).catch(() => {
			})
		},
		// 恢复出账
		recoverBill(item) {
			this.$confirm(this.$t('receiveFms.bill_allow_des'), this.$t('receiveFms.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				receiveChargeAllowApi([item.id]).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('receiveFms.bill_allow_success'))
						this.list()
					}
				})
			}).catch(() => {
			})
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'OvlAdjustCharge' || from.name === 'OvlAdjustChargeAdd') {
				vm.list()
			}
		})
	}
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	overflow: auto;
	padding: 20px 20px 0 20px;
}
.pagination-container {
	margin-top: 0px;
}
</style>
