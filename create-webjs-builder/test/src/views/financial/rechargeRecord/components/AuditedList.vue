<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData"  label-width="100px" size="mini" >
            <el-form-item :label='$t("rechargeRecord.rechargeNo")' prop="rechargeNo">
              <el-input v-model="formData.rechargeNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.customerName")' prop="entryId">
              <type-select v-model="formData.entryId" type="customer" @selected="getList" />
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.businessType")' prop="accountCode">
              <base-select v-model="formData.accountCode" type="businessType"  @selected="getList" addAll></base-select>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.entryAccountCurrency")' prop="entryAccountCurrency">
              <base-select v-model="formData.entryAccountCurrency" type="currency"  @selected="getList" addAll></base-select>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.rechargeStateName")' prop="rechargeState" v-if="status === 'ALL'">
              <el-select v-model="formData.rechargeState" style="width: 100%"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in rechargeStateList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.submitTime")' prop="submitTimePeriod">
              <search-date-picker v-model="formData.submitTimePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.confirmedTime")' prop="confirmedTimePeriod" v-if="status === 'ALL'">
              <search-date-picker v-model="formData.confirmedTimePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("rechargeRecord.confirmedByName")' prop="confirmedBy" v-if="status === 'ALL'">
              <type-select v-model="formData.confirmedBy" type="user" ></type-select>
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

    <el-dialog :title='$t("rechargeRecord.supplyFee")' :visible.sync="supplyVisible" width="666px">

      <el-form ref="supplyFormRef" :model="supplyForm" :rules="supplyFormRules" label-width="0px" label-position="right" size="mini">
        <div class="supply-container">
          <div class="supply-container-part">
            <el-row>
              <el-col :span="8">{{$t("rechargeRecord.entryAccountCurrency")}}</el-col>
              <el-col :span="4" class="center">{{selectedRow.entryAccountCurrency}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">{{$t("rechargeRecord.amount")}}</el-col>
              <el-col :span="4" class="center">{{selectedRow.currency}}</el-col>
              <el-col :span="4" class="blod">{{selectedRow.amount | numberToThousands}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">{{$t("rechargeRecord.transactionsAmount")}}</el-col>
              <el-col :span="4" class="center">{{selectedRow.transactionsCurrency}}</el-col>
              <el-col :span="4" class="blod">{{selectedRow.transactionsAmount | numberToThousands}}</el-col>
              <el-col :span="4">{{$t("rechargeRecord.entryRate")}}</el-col>
              <el-col :span="4">{{selectedRow.entryRate}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">{{$t("rechargeRecord.entryAmount")}}</el-col>
              <el-col :span="4" class="center">{{selectedRow.entryAccountCurrency}}</el-col>
              <el-col :span="4" class="blod">
                {{selectedRow.entryAmount | numberToThousands}}
                <el-tooltip effect="blue" placement="bottom" :visible-arrow="false">
                  <!-- 实际充值金额=(收款金额合计+手续费)*充值汇率 -->
                  <div slot="content">{{$t("rechargeRecord.entryAmountInfo")}}</div>
                  <span class="fee-info"><i class="iconfont icon-gantanhao-xianxingyuankuang" /></span>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>

          <div class="input-container">
            <el-row>
              <el-col :span="8" class="blod">{{$t("rechargeRecord.handleFee")}}</el-col>
              <el-col :span="4" class="center">{{selectedRow.currency}}</el-col>
              <el-col :span="12">
                <el-form-item label="" prop="handleFee" >
                  <el-input v-model="supplyForm.handleFee" style="width: 100px" @change="handleFeeChange"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- 手续费充值金额 -->
              <el-col :span="8" class="blod">{{$t("rechargeRecord.handleFeeAmount")}}</el-col>
              <el-col :span="4" class="center">{{selectedRow.entryAccountCurrency}}</el-col>
              <el-col :span="12">
                <el-form-item label="" prop="handleAmount">
                  <el-input v-model="supplyForm.handleAmount" disabled oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100px" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2" class="blod">{{$t("rechargeRecord.remark")}}</el-col>
              <el-col :span="22">
                <el-form-item label="" prop="confirmedRemarks">
                  <el-input v-model="supplyForm.confirmedRemarks" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="supplyVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="supplySubmitFn" :loading="supplyLoading" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getAuditRechargeRecordListApi, getAllRechargeRecordListApi, getRechargeRecordStateFinApi, getRechargeSuccessDetailListApi, supplyFeeApi } from "@/api/financial/rechargeRecord"
import AuditedBtn from "./AuditedBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { currencyAymbol } from '@/utils/constant'

export default {
	name: "RechargeRecordListAudit",
	components: {
		AgGridVue,
		AuditedBtn
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
    status: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
			formData: {
        rechargeState: '',
				entryId: '',
				rechargeNo: '',
				accountCode: '',
        entryAccountCurrency: '',
        submitTimePeriod: [],
        confirmedTimePeriod: [],
        confirmedBy: ''
			},
      rechargeStateList: [],
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

      supplyVisible: false,
      supplyLoading: false,
      supplyForm: {
        confirmedRemarks: '',
        handleFee: '',
        handleAmount: ''
      },
      supplyFormRules: {
        handleFee: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      },
      selectedRow: {} // 选中要操作的那一条
		}
	},
	created() {
		this.getList()
    this.initColumnFields()
    this.getBase()
	},
  activated() {
    if (this.$route.query.refresh) {
      this.getList()
    }
  },
	methods: {
    getBase() {
      Promise.all([getRechargeRecordStateFinApi()]).then(results => {
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
        minWidth: 140
			}, {
				field: "entryName",
				headerName: this.$t("rechargeRecord.customerName"),
        minWidth: 200
			}, {
				field: "entryAccountCodeName",
				headerName: this.$t("rechargeRecord.businessType"),
        minWidth: 120
			}, {
				field: "amount",
				headerName: this.$t("rechargeRecord.amount"),
        minWidth: 120,
        type: 'numericColumn',
        cellRenderer(params) {
          return `<span>${currencyAymbol[params.data.currency]} ${params.data.amount}</span>`
        }
			}, {
				field: "entryAccountCurrency",
				headerName: this.$t("rechargeRecord.entryAccountCurrency"),
        minWidth: 120
			}, {
				field: "submitTime",
				headerName: this.$t("rechargeRecord.submitTime"),
        minWidth: 150
			}, {
				field: "rechargeRemarks",
				headerName: this.$t("rechargeRecord.rechargeRemarks"),
        minWidth: 100
			}, {
				field: "rechargeStateName",
				headerName: this.$t("rechargeRecord.rechargeStateName"),
        minWidth: 150
			}, {
				field: "operation",
				headerName: this.$t("rechargeRecord.operation"),
				cellRendererFramework: "AuditedBtn",
				minWidth: 100,
        pinned: 'right'
			}]
      if (this.status === 'ALL') {
        arr.splice(4, 0, {
          field: "entryAmount",
          headerName: this.$t("rechargeRecord.entryAmount"),
          minWidth: 120,
          type: 'numericColumn',
          cellRenderer(params) {
            return params.data.entryAmount ? `<span>${currencyAymbol[params.data.entryAccountCurrency]} ${params.data.entryAmount}</span>` : ''
          }
        })
        arr.splice(8, 0, {
          field: "confirmedByName",
          headerName: this.$t("rechargeRecord.confirmedByName"),
          minWidth: 100
        }, {
          field: "confirmedTime",
          headerName: this.$t("rechargeRecord.confirmedTime"),
          minWidth: 150
        }, {
          field: "confirmedRemarks",
          headerName: this.$t("rechargeRecord.confirmedRemarks1"),
          minWidth: 150,
          cellRenderer(params) {
            return params.data.rechargeState === 30 ? params.data.confirmedRemarks : ''
          }
        },)
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
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
      if (this.formData.submitTimePeriod.length) {
				params.submitTimeStart = this.formData.submitTimePeriod[0] || '';
				params.submitTimeEnd = this.formData.submitTimePeriod[1] || '';
			}
      if (this.formData.confirmedTimePeriod.length) {
				params.confirmedTimeStart = this.formData.confirmedTimePeriod[0] || '';
				params.confirmedTimeEnd = this.formData.confirmedTimePeriod[1] || '';
			}
      let fn = this.status === 'AUDITED' ? getAuditRechargeRecordListApi : getAllRechargeRecordListApi
			const res = await fn(params)
			if (res.ok) {
				res.content.list.forEach((v, index) => {
          v.role = this.role
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
    auditFn(item) {
      this.$router.push({
        name: 'RechargeRecordAudit',
        query: {
          id: item.id,
          rechargeState: item.rechargeState,
          origin: this.origin
        }
      })
    },
    supplyFn(row) {
      this.supplyForm = {
        confirmedRemarks: '',
        handleFee: '',
        handleAmount: ''
      }
      getRechargeSuccessDetailListApi(row.id).then(res => {
        if (res.ok) {
          let item = {
            ...res.content
          }
          item.transactionsAmount = 0
          res.content.claims.forEach(v => {
            item.transactionsCurrency = v.transactionsCurrency
            item.transactionsAmount += Number(v.useAmount)
          })
          this.selectedRow = item
          this.supplyVisible = true
        }
      })
    },
    handleFeeChange() {
      this.supplyForm.handleAmount = (Number(this.supplyForm.handleFee || 0) * Number(this.selectedRow.entryRate)).toFixed(2)
    },
    supplySubmitFn() {
      this.$refs.supplyFormRef.validate(valid => {
        if (valid) {
          let VALUE_VALID = true
          let addAmount = (this.selectedRow.transactionsAmount + Number(this.supplyForm.handleFee || 0)).toFixed(2)
          if (this.selectedRow.currency === this.selectedRow.entryAccountCurrency) {
            // 同币种比较 实际充值金额 和 申请充值金额对比
            if (addAmount * this.selectedRow.entryRate > this.selectedRow.amount) {
              VALUE_VALID = false
            }
          } else {
            // 异币种比较 收款金额+手续费 和 申请充值金额对比
            if (addAmount > this.selectedRow.amount) {
              VALUE_VALID = false
            }
          }
          if (!VALUE_VALID) {
            this.$message.error(this.$t("rechargeRecord.entryAmountError"))
            return VALUE_VALID
          }

          let data = {
            rechargeId: this.selectedRow.id,
            ...this.supplyForm
          }
          supplyFeeApi(data).then(res => {
            if (res.ok) {
              // 补充手续费成功
              this.$message.success(this.$t("rechargeRecord.supplyFeeSuccess"))
              this.supplyVisible = false
              this.getList()
            }
          })
        }
      })
    }
	}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.supply-container{
  line-height: 28px;
  font-size: 13px;
  color: #777;

  .supply-container-part{
    background: rgb(232,242,252);
    padding: 15px;
    border-radius: 7px;
    .el-row{
      margin-bottom: 10px;
    }
  }
  .center{
    text-align: center;
    font-weight: 600;
    color: #000;
  }
  .blod{
    font-weight: 600;
    color: #000;
  }
  .input-container{
    padding: 15px;
  }
  .fee-info{
    margin-left:20px;
    color: #1890ff;
  }
}
</style>
