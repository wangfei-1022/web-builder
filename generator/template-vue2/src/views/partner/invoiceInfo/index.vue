<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" class="contract-search">
            <el-form-item :label="$t('customerManage.keyword')" prop="keyword">
              <el-input v-model="formData.keyword" size="mini" type="text" clearable :placeholder="$t('customerManage.enter_name_tax')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addInvoicing" >{{ $t("customerManage.add") }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="userList"
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

  </div>
</template>

<script>
import { getCustomerListApi, checkCustomerIsUniqueApi } from "@/api/partner/customerManage"
import { AgGridVue } from "ag-grid-vue"
import { getCountryListApi } from "@/api/country"
import optionBtn from "./optionBtn"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import {crmSettlementCompanyListApi} from "@/api/invoicingInfoManagement";

export default {
	name: "InformationInvoicing",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		const validateCompany = (rule, value, callback) => {
			if (value) {
				if (!this.addPreData.country) {
					callback()
					return
				}
				checkCustomerIsUniqueApi({ countryCode: this.addPreData.country, customerName: value }).then(
					res => {
						if (res && res.ok && res.content) {
							callback(this.$t("customerManage.customer_name_cannot_be_repeat"))
						} else {
							callback()
						}
					}
				)
			}
		}

		return {
			formData: {
        keyword: ''
			},
			statusList: [],
			salesList: [],
			countryList: [],
			addVisible: false,
			addPreData: {
				type: "2",
				country: "",
				isCN: true,
				customerName: ""
			},
			addPreDataRule: {
				type: [{
					required: true,
					message: this.$t("customerManage.member_type_cannot_be_null"),
					trigger: "change"
				}],
				country: [{
					required: true,
					message: this.$t("customerManage.register_country_cannot_be_null"),
					trigger: "change"
				}],
				customerName: [{
					required: true,
					message: this.$t("customerManage.customer_name_cannot_be_null"),
					trigger: "blur"
				}, {
					validator: validateCompany,
					trigger: "change"
				}]
			},
			pageSize: 50,
			pageNum: 0,
			total: 0,
			userList: [],
			columnFields: [{
				field: "settlementCompanyName",
				headerName: this.$t("customerManage.customer_name"),
				width: 150
			}, {
				field: "taxNum",
				headerName: this.$t("invoicingManage.taxNum"),
				width: 150
			}, {
				field: "address",
				headerName: this.$t("invoicingManage.address"),
				width: 200
			}, {
				field: "tel",
				headerName: this.$t("invoicingManage.tel"),
				width: 100
			}, {
				field: "bankAccounts",
				headerName: this.$t("invoicingManage.bankAccounts"),
				width: 220,
        cellRenderer: params => {
          let str = ``
          params.value.map(item => {
            str += `${item.bankName}`
            item.accounts.map(val => {
              str += ` ${val.bankAccount}(${val.rechargeCurrency})`
            })
          })
          return str
        }
			}, {
				field: "periodBegin",
				headerName: this.$t("invoicingManage.periodBegin"),
				width: 100,
        cellRenderer: params => params.value ? this.$moment(parseInt(params.value, 10)).format('YYYY-MM-DD HH:mm:ss') : ''
			}, {
				field: "id",
				headerName: this.$t("customerManage.operation"),
				cellRendererFramework: "optionBtn",
				minWidth: 100
			}],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true // 选中单元格后可以复制内容
			},
			loading: false,
			customerTypeList: [],
			businessTypeList: []
		}
	},
	activated() {
		this.list()
	},
	created() {
		this.list()
	},
	methods: {
    addInvoicing() {
      this.$router.push({ name: "InformationInvoicingAdd" })
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
			const res = await crmSettlementCompanyListApi(params)
			if (res.ok) {
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
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
		}
	}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.customer-input {
	width: 230px;
}
</style>
