<template>
	<div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="searchActiveName" class="top-tabs" v-if="type !== 'FINANCE_WAIT_PAY' && type !== 'FINANCE_WAIT_OFFSET'">
			<el-tab-pane :label='$t("uexpressClaim.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressClaim.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="searchActiveName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressClaim.no")' prop="queryType" style="width: 100px;float: left;"></el-form-item>
            <el-form-item label='' prop="nos" class="multiple-no-item">
              <el-input v-model="formData.nos" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressClaim.noPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

		<top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="searchActiveName === 'BASE_SEARCH'">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label='$t("uexpressClaim.chancel_order_no")' prop="chancelOrderNo">
							<el-input v-model="formData.chancelOrderNo" type="text" size="mini"  clearable @keyup.enter.native="getList" />
						</el-form-item>
						<el-form-item :label='$t("uexpressClaim.sales_order_no")' prop="salesOrderNo">
							<el-input v-model="formData.salesOrderNo" type="text" size="mini"  clearable @keyup.enter.native="getList" />
						</el-form-item>
            <el-form-item :label='$t("uexpressClaim.apply_claim_date")' prop="applyClaimDatePeriod">
              <search-date-picker v-model="formData.applyClaimDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.pay_date")' prop="payDatePeriod">
              <search-date-picker v-model="formData.payDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.offset_date")' prop="offsetDatePeriod">
              <search-date-picker v-model="formData.offsetDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
						<el-form-item :label='$t("uexpressClaim.claim_state")' prop="claimState" v-if="type !== 'FINANCE_WAIT_PAY' && type !== 'FINANCE_WAIT_OFFSET'">
							<el-select v-model="formData.claimState" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in claimStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressClaim.claim_reason")' prop="claimReason">
							<el-select v-model="formData.claimReason" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in claimReasonList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressClaim.claim_push_state")' prop="claimPushState">
							<el-select v-model="formData.claimPushState" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in claimPushStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.customer")' prop="customerId">
							<type-select v-model="formData.customerId" type="customer" @selected="getList" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"></type-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressClaim.claim_type")' prop="claimType">
							<el-select v-model="formData.claimType" size="mini" @change="getList">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in claimTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressClaim.settlement_mode')" prop="settlementMode">
              <base-select v-model="formData.settlementMode" type="settlementMode" addAll @selected="getList" />
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="addFn" v-if="role != 'FINANCE'">{{$t("uexpressClaim.add")}}</el-button>
        <el-button type="primary" size="mini" @click="batchImportFn" v-if="role != 'FINANCE'">{{$t("uexpressClaim.batch_import")}}</el-button>
        <el-button type="primary" size="mini" @click="batchAuditFn" v-if="role != 'FINANCE'">{{$t("uexpressClaim.batchAudit")}}</el-button>
        <!-- 推送太保理赔 -->
        <el-button type="primary" size="mini" @click="pushFn"  v-if="role != 'FINANCE'">{{$t("uexpressClaim.pushTAIBAOClaim")}}</el-button>
        <el-button type="primary" size="mini" @click="batchPayFn" v-if="type == 'FINANCE_WAIT_PAY' || type == 'FINANCE_ALL'">{{$t("uexpressClaim.batch_pay")}}</el-button>
        <el-button type="primary" size="mini" @click="batchOffsetFn" v-if="type == 'FINANCE_WAIT_OFFSET' || type == 'FINANCE_ALL'">{{$t("uexpressClaim.batch_offset")}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn">{{$t("uexpressClaim.export")}}</el-button>
      </div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />

      <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressClaim.batch_import_claim")'>
        <el-form ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
          <div style="text-align: center;margin-bottom: 20px;">
            <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressClaim.claim_import_template")}}</el-button>
          </div>
          <div class="claim-mention">{{$t("uexpressClaim.claimExportMentionInfo")}}</div>
          <el-form-item label='excel' prop="claimFile">
            <upload-file v-model="importForm.claimFile" accept=".xls,.xlsx" />
          </el-form-item>
          <el-form-item :label='$t("uexpressClaim.img_file")' prop="supportingFiles">
            <upload-file v-model="importForm.supportingFiles" :webkitdirectory="true" :limit="1000" :multiple="true" class="supporting-files"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="option-btn-wrap">
          <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button size="mini" type="primary" @click="batchImportConfirmFn">{{ $t("common.confirm") }}</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="500px" title='新建理赔单'>
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRule" label-width="100px" size="mini">
          <el-form-item :label='$t("uexpressClaim.sales_order_no")' prop="salesOrderNo">
            <el-input v-model="addForm.salesOrderNo" type="text" size="mini"  clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="option-btn-wrap">
          <el-button size="mini" @click="addVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button size="mini" type="primary" @click="addConfirmFn">{{ $t("common.confirm") }}</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="batchAuditVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressClaim.batchAudit")'>
        <el-form v-if="batchAuditVisible" ref="batchAuditFormRef" :model="batchAuditForm" :rules="batchAuditFormRule" label-width="100px" size="mini">
          <div style="padding-left: 38px;margin-bottom: 20px;">
            <span v-html="$t('uexpressClaim.batchAuditInfo', {ALL_COUNT: ALL_COUNT, PE_COUNT: PE_COUNT, BILL_COUNT: BILL_COUNT })"></span>
          </div>
          <el-form-item :label='$t("uexpressClaim.audit_res")' prop="auditType">
              <el-radio-group v-model="batchAuditForm.auditType">
                <el-radio :label="1">{{$t("uexpressClaim.audited")}}</el-radio>
                <el-radio :label="2">{{$t("uexpressClaim.rejected")}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label='$t("uexpressClaim.rejected_reason")' prop="failReason" v-if="batchAuditForm.auditType === 2">
              <el-input v-model="batchAuditForm.failReason" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="option-btn-wrap">
          <el-button size="mini" @click="batchAuditVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button size="mini" type="primary" @click="batchAuditConfirmFn" :loading="batchAuditLoading">{{ $t("common.confirm") }}</el-button>
        </div>
      </el-dialog>
		</div>
	</div>
</template>

<script>
import {
  getClaimCustomerListApi,
  getClaimCustomerListNosApi, // 单号查询
  cancelClaimCustomerApi,
  importClaimCustomerApi,
  batchOffsetClaimCustomerApi,
  batchPayClaimCustomerApi,
  getClaimCustomerToPayListApi,
  getClaimCustomerToOffsetListApi,
  cusomerPushInsuranceClaimApi,
  checkClaimDetailByOrderNoApi,
  claimCustomerExportByIdsApi,
  claimCustomerExportByConditionsApi,
  claimCustomerExportByNosApi,
  batchCSAuditClaimCustomerApi,
  batchProductAuditClaimCustomerApi
} from "@/api/uexpress/claimCustomerList";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";
import OperationBtn from './operationBtn'
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";

export default {
	name: "UExpressClaimCustomerList",
	components: {
		AgGridVue,
    OperationBtn,
    OrderNoComponent,
    MemberOrderNoComponent,
    OrderChannelNoComponent
	},
  props: {
    type: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    }
  },
	data() {
    const validateOrderNo = async (rule, value, callback) => {
			if (!value) {
				callback(this.$t("common.cannot_be_null"));
			} else {
        if (this.id) {
          callback()
          return
        }
				let res = await checkClaimDetailByOrderNoApi({orderNo: value})
        if (res && res.ok) {
          callback()
        } else {
          let msg = res.errors[0].message
          callback(msg)
        }
			}
		};
		return {
      searchActiveName: 'BASE_SEARCH',
			formData: {
        nos: '',
        claimState: '',
        customerId: '',
        salesOrderNo: '',
        chancelOrderNo: '',
        applyClaimDatePeriod: [],
        payDatePeriod: [],
        offsetDatePeriod: [],
        insuranceState: '',
        claimPushState: '',
        claimType: '',
        claimReason: '',
        settlementMode: ''
			},
			claimStateList: [],
      claimReasonList: [],
      claimPushStateList: [],
      claimTypeList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [{
        field: 'index',
        headerName: '',
        width: 55,
        pinned: 'left',
        suppressSorting: true,
        checkboxSelection: true,
        suppressMenu: true,
        suppressSizeToFit: true,
        suppressResize: true,
        headerCheckboxSelection: true
      },
      {
        field: "salesOrderNo",
        headerName: this.$t("uexpressClaim.sales_order_no"),
        minWidth: 150,
        cellRendererFramework: "OrderNoComponent"
      },
      {
        field: "chancelOrderNo",
        headerName: this.$t("uexpressClaim.chancel_order_no"),
        minWidth: 150,
        cellRendererFramework: "OrderChannelNoComponent"
      },
      {
        field: "customerName",
        headerName: this.$t("uexpressClaim.customer_name"),
        minWidth: 150
      },
      {
        field: "settlementModeName",
        headerName: this.$t("uexpressClaim.settlement_mode"),
        minWidth: 100
      },
      {
        field: "claimStateName",
        headerName: this.$t("uexpressClaim.claim_state"),
        minWidth: 100
      },
      {
        field: "claimPushStateName",
        headerName: this.$t("uexpressClaim.claim_push_state"),
        minWidth: 120
      },
      {
        field: "outboundTime",
        headerName: this.$t("uexpressClaim.order_outbound_time"),
        minWidth: 150
      },
      {
        field: "applyClaimDate",
        headerName: this.$t("uexpressClaim.apply_claim_date"),
        minWidth: 150
      },
      {
        field: "claimReasonName",
        headerName: this.$t("uexpressClaim.claim_reason"),
        minWidth: 150
      },
      {
        field: "claimTypeName",
        headerName: this.$t("uexpressClaim.claim_type"),
        minWidth: 100
      },
      {
        field: "declareAmount/declareCurrency",
        headerName: this.$t("uexpressClaim.declare_amount"),
        minWidth: 100,
        type: 'numericColumn',
        cellRenderer(params) {
          return `<span>${params.data.declareAmount} ${params.data.declareCurrency}</span>`
        }
      },
      {
        field: "goodsApplyClaimAmountsAll",
        headerName: this.$t("uexpressClaim.goods_apply_claim_amounts"),
        minWidth: 120,
        type: 'numericColumn',
        cellRenderer(params) {
          return `<span>${params.data.goodsApplyClaimAmountsAll} ${params.data.goodsApplyClaimAmountsCurrency}</span>`
        }
      },
      {
        field: "claimAmountsAll",
        headerName: this.$t("uexpressClaim.claim_amounts_all"),
        minWidth: 120,
        type: 'numericColumn',
        cellRenderer(params) {
          return `<span>${params.data.claimAmountsAll} ${params.data.claimAmountsCurrency}</span>`
        }
      },
      {
        field: "specialApplyClaimAmountsAll",
        headerName: this.$t("uexpressClaim.special_apply_claim_amounts"),
        minWidth: 120,
        type: 'numericColumn',
        cellRenderer(params) {
          return `<span>${params.data.specialApplyClaimAmountsAll} ${params.data.specialApplyClaimAmountsCurrency}</span>`
        }
      },
      {
        field: "specialClaimItemNames",
        headerName: this.$t("uexpressClaim.special_claim_item_names"),
        minWidth: 100
      },
      {
        field: "offsetDate",
        headerName: this.$t("uexpressClaim.offset_date"),
        minWidth: 150
      },
      {
        field: "payDate",
        headerName: this.$t("uexpressClaim.pay_date"),
        minWidth: 150
      }, {
        field: "OperationBtn",
        headerName: this.$t("uexpressClaim.operation"),
        cellRendererFramework: "OperationBtn",
        minWidth: 130,
        pinned: 'right'
      }],
			sideBarDefs: { toolPanels: ["columns", "filters"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
					componentParent: this
				}
			},
			loading: false,
      gridApi: {},

      // 批量导入
      batchImportVisible: false,
      importForm: {
        claimFile: [],
        supportingFiles: []
      },
      importFormRule: {
        claimFile: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        supportingFiles: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      addVisible: false,
      addForm: {
        salesOrderNo: ''
      },
      addFormRule: {
        salesOrderNo: [
          {	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"},
          {
            validator: validateOrderNo,
            trigger: "blur"
          }]
      },

      batchAuditVisible: false,
      batchAuditLoading: false,
      batchAuditForm: {
        auditType: '',
				failReason: ''
      },
      batchAuditFormRule: {
        auditType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
				failReason: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
      PE_COUNT: 0,
      BILL_COUNT: 0,
      ALL_COUNT: 0
		};
	},
	created() {
		this.getList();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
      /* 第三个 */
			Promise.all([getDictListApi(22), getDictListApi(20), getDictListApi(26), getDictListApi(21)]).then(results => {
				const claimStateRes = results[0];
        const claimReasonRes = results[1];
        const claimPushStateRes = results[2];
        const claimTypeRes = results[3];
				if (claimStateRes.ok) {
					this.claimStateList = claimStateRes.content;
				}
				if (claimReasonRes.ok) {
					this.claimReasonList = claimReasonRes.content;
				}
        if (claimPushStateRes.ok) {
					this.claimPushStateList = claimPushStateRes.content;
				}
        if (claimTypeRes.ok) {
					this.claimTypeList = claimTypeRes.content;
				}
			});
		},
    downloadTemplateFn() {
      getTemplateFileApi(1).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
		onReady(params) {
			params.api.sizeColumnsToFit();
      this.gridApi = params.api
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
    getParams() {
      let params = {
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
      if (this.searchActiveName === 'NO_SEARCH') {
        params.nos = this.formData.nos ? this.formData.nos.split(/,|，|\s+/) : []
      } else {
        params = {
          ...params,
          ...this.formData
        }

        if (this.formData.applyClaimDatePeriod.length) {
          params.applyClaimDateStart = this.formData.applyClaimDatePeriod[0] || "";
          params.applyClaimDateEnd = this.formData.applyClaimDatePeriod[1] || "";
        }
        if (this.formData.payDatePeriod.length) {
          params.payDateStart = this.formData.payDatePeriod[0] || "";
          params.payDateEnd = this.formData.payDatePeriod[1] || "";
        }
        if (this.formData.offsetDatePeriod.length) {
          params.offsetDateStart = this.formData.offsetDatePeriod[0] || "";
          params.offsetDateEnd = this.formData.offsetDatePeriod[1] || "";
        }

        delete params.applyClaimDatePeriod
        delete params.payDatePeriod
        delete params.offsetDatePeriod
      }
      return params
    },
		async getList() {
			this.loading = true;
			let params = this.getParams()
      let fn = ''
      if (this.type === 'FINANCE_WAIT_PAY') {
        fn = getClaimCustomerToPayListApi
      } else if (this.type === 'FINANCE_WAIT_OFFSET') {
        fn = getClaimCustomerToOffsetListApi
      } else {
        fn = this.searchActiveName === 'NO_SEARCH' ? getClaimCustomerListNosApi : getClaimCustomerListApi
      }
			const res = await fn(params);
			if (res.ok && res.content) {
				res.content.list.forEach(v => {
          v.role = this.role
					v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.applyClaimDate = parseTime(v.applyClaimDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.offsetDate = parseTime(v.offsetDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.payDate = parseTime(v.payDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.declareAmount = formatNumberToThousands(v.declareAmount)

          // 特殊理赔金额
          let specialApplyClaimAmountsAll = 0
          v.specialApplyClaimAmounts.forEach(curreny => {
            specialApplyClaimAmountsAll = addFloatNum(specialApplyClaimAmountsAll, curreny.value)
          })
          v.specialApplyClaimAmountsCurrency = ''
          v.specialApplyClaimAmountsAll = formatNumberToThousands(specialApplyClaimAmountsAll)
          if (v.specialApplyClaimAmounts[0]) {
            v.specialApplyClaimAmountsCurrency = v.specialApplyClaimAmounts[0].currency
          }

          // 商品理赔金额
          let goodsApplyClaimAmountsAll = 0
          v.goodsApplyClaimAmounts.forEach(curreny => {
            goodsApplyClaimAmountsAll = addFloatNum(goodsApplyClaimAmountsAll, curreny.value)
          })
          v.goodsApplyClaimAmountsCurrency = ''
          v.goodsApplyClaimAmountsAll = formatNumberToThousands(goodsApplyClaimAmountsAll)
           if (v.goodsApplyClaimAmounts[0]) {
            v.goodsApplyClaimAmountsCurrency = v.goodsApplyClaimAmounts[0].currency
          }

          // 总计理赔金额
          v.claimAmountsAll = formatNumberToThousands(addFloatNum(v.goodsApplyClaimAmountsAll, v.specialApplyClaimAmountsAll))
          v.claimAmountsCurrency = v.goodsApplyClaimAmountsCurrency
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    addFn() {
      this.addVisible = true
      this.addForm.salesOrderNo = ''
		},
    addConfirmFn() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.addVisible = false
          this.$router.push({
            name: "UExpressClaimCustomerListAdd",
            query: {
              salesOrderNo: this.addForm.salesOrderNo
            }
          });
        }
      })
    },
    editFn(item) {
			this.$router.push({
				name: "UExpressClaimCustomerListEdit",
				query: {
					id: item.id,
          shardingKey: item.shardingKey,
          salesOrderNo: item.salesOrderNo
				}
			});
		},
    auditFn(item) {
			this.$router.push({
				name: "UExpressClaimCustomerListAudit",
				query: {
					id: item.id,
          shardingKey: item.shardingKey
				}
			});
		},
    viewFn(item) {
      this.$router.push({
				name: "UExpressClaimCustomerListDetail",
				query: {
					id: item.id,
          shardingKey: item.shardingKey
				}
			});
    },
    cancelFn(item) {
      let data = [{
        claimId: item.id,
        claimShardingKey: item.shardingKey
      }]
      this.$confirm(this.$t('uexpressClaim.cancel_confirm'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        cancelClaimCustomerApi({claimIds: data}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressClaim.cancel_success'))
            this.getList()
          }
        })
      }).catch(() => {})
    },
    batchAuditFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length === 0) {
        this.$message.error(this.$t('uexpressClaim.needOne'))
        return
      }
      let PE_COUNT = 0; let BILL_COUNT = 0
      for (let i = 0, len = rows.length; i < len; i++) {
        if (rows[i].claimState !== 20 && rows[i].claimState !== 30) {
          this.$message.error(this.$t('uexpressClaim.batchAuditError1'))
          return
        }
        if (rows[i].settlementMode === 1) {
          PE_COUNT++
        } else {
          BILL_COUNT++
        }
      }
      const groupedArray = rows.reduce((res, item) => {
        res[item.claimState] = res[item.claimState] || []
        res[item.claimState].push(item)
        return res
      }, {})
      console.log(groupedArray)
      if (Object.keys(groupedArray).length > 1) {
        this.$message.error(this.$t("uexpressClaim.batchAuditError2"))
        return
      }
      this.PE_COUNT = PE_COUNT
      this.BILL_COUNT = BILL_COUNT
      this.ALL_COUNT = rows.length
      this.batchAuditForm = {
        auditType: '',
				failReason: ''
      }
      this.batchAuditVisible = true
    },
    batchAuditConfirmFn() {
      this.$refs.batchAuditFormRef.validate(valid => {
        if (valid) {
          let rows = this.gridApi.getSelectedRows()
          let fn = rows[0].claimState === 20 ? batchCSAuditClaimCustomerApi : batchProductAuditClaimCustomerApi
          let claimCustomerCmdList = []
          rows.forEach(v => {
            claimCustomerCmdList.push({
              claimId: v.id,
              claimShardingKey: v.shardingKey
            })
          })
          let data = {
            flag: this.batchAuditForm.auditType === 1,
            failReason: this.batchAuditForm.failReason,
            claimCustomerCmdList: claimCustomerCmdList
          }
          this.batchAuditLoading = true
          fn(data).then(res => {
            if (res.ok) {
              this.batchAuditVisible = false
              let msg = this.batchAuditForm.auditType === 1 ? this.$t("uexpressClaim.audit_success") : this.$t("uexpressClaim.reject_success");
							this.$message.success(msg);
							this.getList();
						}
            this.batchAuditLoading = false
          })
        }
      })
    },
    batchImportFn() {
      this.importForm = {
        claimFile: [],
        supportingFiles: []
      }
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.claimFile = data.claimFile[0]
          importClaimCustomerApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressClaim.batch_import_success'))
              this.importForm = {
                claimFile: [],
                supportingFiles: []
              }
            }
          })
        }
      })
    },
    batchOffsetFn() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let data = []
      let billCheck = true
      selectedRows.forEach(v => {
        data.push({
          claimId: v.id,
          claimShardingKey: v.shardingKey
        })
        if (v.settlementMode === 1) {
          billCheck = false
        }
      })
      if (!billCheck) {
        this.$message.error(this.$t('uexpressClaim.batch_offset_error_info'))
        return false
      }
      let msg = this.$t('uexpressClaim.batch_offset_info', {
        selectedRowsLength: selectedRows.length
      })
      this.$confirm(msg, this.$t('uexpressClaim.batch_offset'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        batchOffsetClaimCustomerApi({claimIds: data}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressClaim.batch_offset_success'))
            this.getList()
          }
        })
      }).catch(() => {})
    },
    batchPayFn() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let data = [];
      let piece = [];
      let bill = [];
      selectedRows.forEach(v => {
        data.push({
          claimId: v.id,
          claimShardingKey: v.shardingKey
        })
        if (v.settlementMode === 1) {
          piece.push(v)
        } else {
          bill.push(v)
        }
      })

      let msg = this.$t('uexpressClaim.batch_pay_info', {
        selectedRowsLength: selectedRows.length,
        pieceLength: piece.length,
        billLength: bill.length
      })
      this.$confirm(msg, this.$t('uexpressClaim.batch_pay'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        batchPayClaimCustomerApi({claimIds: data}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressClaim.batch_pay_success'))
            this.getList()
          }
        })
      }).catch(() => {})
    },
    pushFn() {
      let data = []
      let selRows = this.gridApi.getSelectedRows();
      selRows.forEach(v => {
        data.push({
          claimId: v.id,
          claimShardingKey: v.shardingKey
        })
      })

      this.$confirm(this.$t('uexpressClaim.customer_push_insuranceClaim', { orderLength: selRows.length }), this.$t('common.mention'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        cusomerPushInsuranceClaimApi({claimIds: data}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressClaim.push_oper_success'))
            this.getList()
          }
        })
      }).catch(() => {})
    },
    exportFn() {
      let fn = null
      let arr = this.gridApi.getSelectedRows()
      let params = this.getParams()
      if (arr.length > 0) {
        fn = claimCustomerExportByIdsApi
        let ids = []
        arr.forEach(v => {
          ids.push({
            id: v.id,
            claimShardingKey: v.shardingKey
          })
        })
        params = {
          claimIdDtos: ids
        }
      } else if (this.searchActiveName === 'NO_SEARCH') {
        fn = claimCustomerExportByNosApi
      } else if (this.searchActiveName === 'BASE_SEARCH') {
        fn = claimCustomerExportByConditionsApi
      }
      fn(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressOrder.exportSuccess"));
        }
      })
    },
		reset() {
			this.formData = {
        nos: '',
        claimState: '',
        customerId: '',
        salesOrderNo: '',
        chancelOrderNo: '',
        applyClaimDatePeriod: [],
        payDatePeriod: [],
        offsetDatePeriod: [],
        insuranceState: '',
        claimPushState: '',
        claimType: '',
        claimReason: '',
        settlementMode: ''
			}
			this.getList();
		}
	}
};
</script>

<style lang="scss" scoped>
.right-main-wrapper {
  padding: 0 20px 0px 20px;
  height: 100%;
  overflow: hidden;
}

.multiple-no-wrap{
  width: 100%;
  overflow:hidden;

  .multiple-no-item {
    width: calc(100% - 150px);
    float: left;

    ::v-deep .el-form-item__content {
      width: 100%;
    }
    .el-select {
      float: left;
      width: 80px;
    }
    .el-textarea {
      width: 100%;
      float: left;
    }
  }
}

.pagination-container {
	margin-top: 0px;
}

.supporting-files{
  ::v-deep .el-upload-list{
    max-height: 200px;
    overflow-y: scroll;
  }
}
.claim-mention{
  text-align: center;
  color: red;
  margin-bottom: 15px;
}
</style>
