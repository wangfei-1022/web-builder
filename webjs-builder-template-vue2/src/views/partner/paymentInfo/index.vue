<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" class="contract-search">
            <el-form-item :label="$t('paymentInfoManage.keyword')" prop="keyword">
              <el-input v-model="formData.keyword" size="mini" type="text" clearable :placeholder="$t('paymentInfoManage.enter_name')" @keyup.enter.native="list" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn" >{{ $t("paymentInfoManage.add") }}</el-button>
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
import { AgGridVue } from "ag-grid-vue"
import optionBtn from "./optionBtn"
import { partnerPaymentInfoListApi } from "@/api/partner/paymentInfo";

export default {
	name: "PartnerPaymentInfoList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
			formData: {
        keyword: ''
			},
			pageSize: 50,
			pageNum: 0,
			total: 0,
			userList: [],
			columnFields: [{
				field: "indexNo",
				headerName: this.$t("paymentInfoManage.indexNo"),
				minWidth: 60
			}, {
				field: "settlementCompanyName",
				headerName: this.$t("paymentInfoManage.supplierName"),
				minWidth: 150
			}, {
				field: "address",
				headerName: this.$t("paymentInfoManage.address"),
				minWidth: 200
			}, {
				field: "bankAccounts",
				headerName: this.$t("paymentInfoManage.bankAccounts"),
				minWidth: 220,
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
				field: "optionBtn",
				headerName: this.$t("paymentInfoManage.operation"),
				cellRendererFramework: "optionBtn",
				minWidth: 100
			}],
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
		this.list()
	},
	methods: {
    addFn() {
      this.$router.push({ name: "PartnerPaymentInfoAdd" })
    },
    editFn(item) {
      this.$router.push({
        name: "PartnerPaymentInfoEdit",
        query: {
          id: item.id
        }
      })
    },
    viewFn(item) {
      this.$router.push({
        name: "PartnerPaymentInfoView",
        query: {
          id: item.id
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
			const res = await partnerPaymentInfoListApi(params)
			if (res.ok) {
        res.content.list.forEach((v, index) => {
          v.indexNo = index + 1
        })
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
			}
			this.loading = false
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
</style>
