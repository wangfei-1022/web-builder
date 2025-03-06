<template>
  <div class="pd-16" v-loading="loading">
    <TopSearchItemsSlot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
          <el-form-item :label='$t("receiveFms.bill_no")' prop="billNo">
            <el-input v-model="formData.billNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyId">
            <type-select v-model="formData.settlementCompanyId" type="settlementCompany" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}"  @selected="list" />
          </el-form-item>
            <el-form-item :label="$t('receiveFms.settlement_office_name')" prop="settlementOfficeId">
              <el-select v-model="formData.settlementOfficeId" size="mini" @change="list">
              <el-option :label="$t('contract.ALL')" value="" />
              <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.bill_status')" prop="billState">
            <el-select v-model="formData.billState" size="mini"  @change="list">
              <el-option :label="$t('receiveFms.ALL')" value="" />
              <el-option v-for="(item, index) in billStateList" :key="index" :label="item.name" :value="item.code"/>
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
          <el-form-item :label="$t('receiveFms.sales_names')" prop="responsiblePersonId">
            <el-select filterable clearable v-model="formData.responsiblePersonId" size="mini" @change="list">
              <el-option v-for="(item, index) in salesList" :key="index" :label="item.userName" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.bill_date')" prop="period">
            <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']"	v-model="formData.period"	@change="list" clearable></common-picker>
          </el-form-item>
      </el-form>
    </TopSearchItemsSlot>
      <div class="mb-10"></div>
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

  </div>
</template>

<script>
import { getSalesListApi } from "@/api/partner/customerManage"
import optionBtn from "./optionBtn"
import { getYHTListApi } from '@/api/partner/base'
import { getReceiveBillListApi, getDictDataApi, downloadBillFileApi } from "@/api/fmsReceiveOvl"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import progressContent from './components/progressContent'
import billState from './components/billState'

export default {
	name: "OvlReceiveBill",
	components: { optionBtn, progressContent, billState },
	data() {
		return {
			formData: {
				billNo: '',
				settlementCompanyId: '',
				settlementOfficeId: '',
				childBusinessType: '',
				responsiblePersonId: '',
				billState: '',
				invoiceState: '',
				clearState: '',
				billDateActualStart: '',
				billDateActualEnd: '',
				period: []
			},
			billStateList: [],
			businessTypeList: [],
			clearStateList: [],
			invoiceStateList: [],
			salesList: [],
			YHTList: [],
			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [{
				field: "billNo",
				headerName: this.$t("receiveFms.bill_no"),
				minWidth: 100
			}, {
				field: "settlementCompanyName",
				headerName: this.$t("receiveFms.settlement_company_name"),
				minWidth: 100
			}, {
				field: "settlementOfficeName",
				headerName: this.$t("receiveFms.settlement_office_name"),
				minWidth: 100
			}, {
				field: "warehouseName",
				headerName: this.$t("receiveFms.warehouse_name"),
				minWidth: 100
			}, {
				field: "salesName",
				headerName: this.$t("receiveFms.sales_names"),
				minWidth: 80
			}, {
				field: "currency",
				headerName: this.$t("receiveFms.curreny"),
				minWidth: 80
			}, {
				field: "billAmount",
				headerName: this.$t("receiveFms.bill_amount"),
				minWidth: 100,
				cellRenderer(params) {
					return `<div style='text-align: right'>${formatNumberToThousands(params.value)}</div>`
				}
			}, {
				field: "period",
				headerName: this.$t("receiveFms.period"),
				minWidth: 120
			}, {
				field: "billDateActual",
				headerName: this.$t("receiveFms.bill_date"),
				minWidth: 150
			}, {
				field: "billStateName",
				headerName: this.$t("receiveFms.bill_status"),
				minWidth: 100,
				cellRendererFramework: 'billState'
			}, {
				field: "invoiceStateName",
				headerName: this.$t("receiveFms.invoice_status"),
				minWidth: 100
			}, {
				field: "clearStateName",
				headerName: this.$t("receiveFms.verification_status"),
				minWidth: 100
			}, {
				field: "billFileStateName",
				headerName: this.$t("receiveFms.file_status"),
				minWidth: 100
			}, {
				field: "id",
				headerName: this.$t("receiveFms.operation"),
				cellRendererFramework: "optionBtn",
				pinned: 'right',
				minWidth: 180
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
			loading: false
		}
	},
	created() {
		this.getBaseDataFn()
	},
	computed: {
		innerGridHeight: function () {
			return { width: '100%', ...this.gridHeight }
		}
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getYHTListApi(), getDictDataApi(7), getDictDataApi(3), getDictDataApi(4), getSalesListApi()]).then(results => {
				const YHTRes = results[0]
				const billStateRes = results[1]
				const invoiceStateRes = results[2]
				const clearStateRes = results[3]
				const salesRes = results[4]
				if (YHTRes.ok) {
					this.YHTList = YHTRes.content
				}
				if (billStateRes.ok) {
					this.billStateList = billStateRes.content
				}
				if (invoiceStateRes.ok) {
					this.invoiceStateList = invoiceStateRes.content
				}
				if (clearStateRes.ok) {
					this.clearStateList = clearStateRes.content
				}
				if (salesRes.ok) {
					this.salesList = salesRes.content
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
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			if (this.formData.period.length) {
				params.billDateActualStart = this.formData.period[0]
				params.billDateActualEnd = this.formData.period[1]
			}
			delete params.period
			const res = await getReceiveBillListApi(params)
			if (res.ok) {
				this.total = parseInt(res.content.total, 10)
				res.content.list.forEach(v => {
					v.billDateActual = parseTime(v.billDateActual, '{y}-{m}-{d} {h}:{i}:{s}')
					try {
						let order = JSON.parse(v.extendInfo9)
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
		// 下载账单
		download(item) {
			downloadBillFileApi(item.id).then(res => {
				if (res.ok) {
					if (!res.content) {
						this.$message.error(this.$t('receiveFms.download_file_wait'))
						return
					}
					window.location.href = res.content.url
				}
			})
		},
		// 对账确认
		confirm(item) {
			this.$confirm(this.$t('receiveFms.ovl_bill_confirm_des'), this.$t('receiveFms.mention'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				this.progressContent(item.id)
			}).catch(() => {

			})
		},
		// 加载进度条
		progressContent(id) {
			let h = this.$createElement
			let msg = h('div', null, [
				h(progressContent, {
					props: { id: id },
					ref: 'progressContent',
					on: {
						end: () => {
							setTimeout(() => {
								this.list()
								this.$msgbox.close()
								this.$message.success(this.$t('receiveFms.ovl_bill_confirm_success'))
							}, 200)
						}
					}
				})
			])
			this.$msgbox({
				title: this.$t('authorization.msg'),
				message: msg,
				showConfirmButton: false
			}).then(() => {
			}).catch(() => {
				this.$refs.progressContent.clearTimer()
			})
		}
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
