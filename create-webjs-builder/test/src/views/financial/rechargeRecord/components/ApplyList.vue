<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData" size="mini"  label-width="100px" >
            <el-form-item :label='$t("rechargeRecord.rechargeNo")' prop="rechargeNo">
              <el-input v-model="formData.rechargeNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.customerName")' prop="entryId">
              <type-select v-model="formData.entryId" type="customer" @selected="getList" />
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.businessType")' prop="accountCode" v-if="!rechargeState && !businessType">
              <base-select v-model="formData.accountCode" type="businessType"  @selected="getList" addAll></base-select>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.entryAccountCurrency")' prop="entryAccountCurrency">
              <base-select v-model="formData.entryAccountCurrency" type="currency"  @selected="getList" addAll></base-select>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.rechargeStateName")' prop="rechargeState" v-if="!rechargeState">
              <el-select v-model="formData.rechargeState" style="width: 100%"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in rechargeStateList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.submitTime")' prop="submitTimePeriod">
              <search-date-picker v-model="formData.submitTimePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <!-- 全部/财务拒绝 -->
            <el-form-item :label='$t("rechargeRecord.confirmedTime")' prop="confirmedTimePeriod" v-if="!rechargeState || rechargeState === 30">
              <search-date-picker v-model="formData.confirmedTimePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
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
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList"/>
    </div>

    <el-dialog :title='$t("rechargeRecord.returnApply")' :visible.sync="returnVisible" width="500px">
      <el-form ref="returnFormRef" :model="returnForm" :rules="returnFormRules" label-width="120px" label-position="right">
        <el-form-item :label='$t("rechargeRecord.returnReason")' prop="confirmedFailedReason">
          <el-input v-model="returnForm.confirmedFailedReason" type="textarea"  />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="returnSubmitFn" :loading="returnLoading" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSaleRechargeApplyListApi, getOperatorRechargeApplyListApi, returnApplyApi, getRechargeRecordStateOperaApi } from "@/api/financial/rechargeRecord"
import OperationBtn from "./OperationBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { currencyAymbol } from '@/utils/constant'

export default {
	name: "RechargeRecordListAudit",
	components: {
		AgGridVue,
		OperationBtn
	},
  props: {
    origin: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    },
    rechargeState: {
      type: Number,
      default: null
    },
    businessType: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
			formData: {
				entryId: '',
				rechargeNo: '',
				accountCode: '',
        rechargeState: '',
        entryAccountCurrency: '',
        submitTimePeriod: [],
        confirmedTimePeriod: []
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [],
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
      rechargeStateList: [],

      currentItem: {},
      returnForm: {
        confirmedFailedReason: ''
      },
      returnFormRules: {
        confirmedFailedReason: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      },
      returnVisible: false,
      returnLoading: false
		}
	},
	activated() {
		this.getList()
	},
	created() {
		this.getList()
    this.initColumnFields()
    this.getBase()
	},
	methods: {
    getBase() {
      Promise.all([getRechargeRecordStateOperaApi()]).then(results => {
				const stateRes = results[0]
				if (stateRes.ok) {
					this.rechargeStateList = stateRes.content
				}
			})
		},
    initColumnFields() {
      let arr = [{
				field: "rechargeNo",
				headerName: this.$t("rechargeRecord.rechargeNo"),
        minWidth: 150
			}, {
				field: "entryName",
				headerName: this.$t("rechargeRecord.customerName"),
        minWidth: 150
			}, {
				field: "entryAccountCurrency",
				headerName: this.$t("rechargeRecord.entryAccountCurrency"),
        minWidth: 120
			}, {
				field: "amount",
				headerName: this.$t("rechargeRecord.amount"),
        minWidth: 150,
        type: 'numericColumn',
        cellRenderer(params) {
          return `<span>${currencyAymbol[params.data.currency]} ${params.data.amount}</span>`
        }
			}, {
				field: "submitTime",
				headerName: this.$t("rechargeRecord.submitTime"),
        minWidth: 150
			}, {
				field: "rechargeRemarks",
				headerName: this.$t("rechargeRecord.rechargeRemarks"),
        minWidth: 150
			}, {
				field: "operation",
				headerName: this.$t("rechargeRecord.operation"),
				cellRendererFramework: "OperationBtn",
				minWidth: 170,
        pinned: 'right'
			}]
      if (this.rechargeState === 30) {
        // 财务拒绝的列表 增加这三个字段
        arr.splice(5, 0, {
          field: "confirmedByName",
          headerName: this.$t("rechargeRecord.confirmedByName"),
          minWidth: 150
        }, {
          field: "confirmedTime",
          headerName: this.$t("rechargeRecord.confirmedTime"),
          minWidth: 150
        }, {
          field: "confirmedRemarks",
          headerName: this.$t("rechargeRecord.confirmedRemarks1"),
          minWidth: 150
        })
      }
      // 全部的列表 增加这三个字段
      if (this.rechargeState === null) {
        arr.splice(3, 0, {
          field: "entryAmount",
          headerName: this.$t("rechargeRecord.entryAmount"),
          minWidth: 150,
          type: 'numericColumn',
          cellRenderer(params) {
            return params.data.entryAmount ? `<span>${currencyAymbol[params.data.entryAccountCurrency]} ${params.data.entryAmount}</span>` : ''
          }
        })
        arr.splice(5, 0, {
          field: "rechargeStateName",
          headerName: this.$t("rechargeRecord.rechargeStateName"),
          minWidth: 150
        })
      }
      this.columnFields = arr
    },
		onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
		async getList() {
			this.loading = true
			let params = {
				...this.formData,
        accountCode: this.businessType,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
      if (this.rechargeState) {
        params.rechargeState = this.rechargeState
      }
      if (this.formData.submitTimePeriod.length) {
				params.submitTimeStart = this.formData.submitTimePeriod[0] || '';
				params.submitTimeEnd = this.formData.submitTimePeriod[1] || '';
			}
      if (this.formData.confirmedTimePeriod.length) {
				params.confirmedTimeStart = this.formData.confirmedTimePeriod[0] || '';
				params.confirmedTimeEnd = this.formData.confirmedTimePeriod[1] || '';
			}
      let fn = null
      if (this.role === 'OPERATOR') {
        fn = getOperatorRechargeApplyListApi
      } else if (this.role === 'SALE') {
        fn = getSaleRechargeApplyListApi
      }
			if (fn) {
        const res = await fn(params)
        if (res.ok) {
          res.content.list.forEach(function (v, index) {
            v.index = index + 1
            v.amount = formatNumberToThousands(v.amount)
            v.entryAmount = formatNumberToThousands(v.entryAmount)
            v.submitTime = parseTime(v.submitTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.associateTime = parseTime(v.associateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.confirmedTime = parseTime(v.confirmedTime, '{y}-{m}-{d} {h}:{i}:{s}')
          })
          this.total = parseInt(res.content.total, 10)
          this.userList = res.content.list
        } else {
          this.total = 0
          this.userList = []
        }
      }
			this.loading = false
		},
		reset() {
			this.$refs.formData.resetFields()
			this.getList()
		},
    detailFn(item) {
      this.$router.push({
        name: 'RechargeRecordDetail',
        query: {
          id: item.id,
          rechargeState: item.rechargeState,
          origin: this.origin
        }
      })
    },
    relativeTransFn(item) {
      this.$router.push({
        name: 'RechargeRecordRelativeTrans',
        query: {
          id: item.id,
          rechargeState: item.rechargeState,
          origin: this.origin
        }
      })
    },
    returnApplyFn(item) {
      this.currentItem = item
      this.returnForm = {
        confirmedFailedReason: ''
      }
      this.returnVisible = true
    },
    returnSubmitFn() {
      this.$refs.returnFormRef.validate(valid => {
        if (valid) {
          this.returnLoading = true
          let data = {
            id: this.currentItem.id,
            confirmedFailedReason: this.returnForm.confirmedFailedReason
          }
          returnApplyApi(data).then(res => {
            if (res.ok) {
              // 退回申请操作成功
              this.$message.success(this.$t("rechargeRecord.returnApplySuccess"))
              this.returnVisible = false
              this.getList()
            }
            this.returnLoading = false
          })
        }
      })
    }
	},
	mounted() {}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
