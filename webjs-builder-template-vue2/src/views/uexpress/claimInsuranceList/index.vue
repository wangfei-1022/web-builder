<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item label='' prop="searchNo">
							<el-input v-model="formData.searchNo" type="text" size="mini"  clearable >
                <el-select v-model="formData.noType" size="mini" slot="prepend" style="width: 100px;">
                  <el-option :label="$t('uexpressClaim.claim_no')" :value="1" />
                  <el-option :label="$t('uexpressClaim.insurance_no')" :value="2" />
                  <el-option :label="$t('uexpressClaim.sales_order_no')" :value="3" />
                  <el-option :label="$t('uexpressClaim.chancel_order_no')" :value="4" />
                </el-select>
              </el-input>
						</el-form-item>
            <el-form-item label="" prop="searchTimePeriod">
              <el-select v-model="formData.timeType" size="mini" class="search-item-1">
                <el-option :label="$t('uexpressClaim.push_date')" :value="1" />
                <el-option :label="$t('uexpressClaim.audit_date')" :value="2" />
                <el-option :label="$t('uexpressClaim.pay_date')" :value="3" />
              </el-select>
              <search-date-picker v-model="formData.searchTimePeriod" clearable  class="search-item-2"></search-date-picker>
            </el-form-item>
            <el-form-item :label="$t('uexpressClaim.claim_reason')" prop="claimReason">
              <el-select v-model="formData.claimReason" size="mini" @change="list">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in claimReasonList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label="$t('uexpressClaim.claim_state')" prop="claimState">
							<el-select v-model="formData.claimState" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in claimStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label="$t('uexpressClaim.insurance_company')" prop="supplierId">
							<type-select v-model="formData.supplierId" type="supplier" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: 16011}"></type-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressClaim.customer')" prop="customerId">
							<type-select v-model="formData.customerId" type="customer" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"></type-select>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="pushFn">{{$t('uexpressClaim.push_claim')}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>

    <el-dialog :visible.sync="viewVisible" :close-on-click-modal="false" width="900px" :title="$t('uexpressClaim.insurer_company_claim_detail')">
			<div class="record-container">
				<div class="record-container-content">
					<div class="record-item"><label>{{$t('uexpressClaim.claim_no')}}：</label><span>{{viewIem.claimNo}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.insurance_no')}}：</label><span>{{viewIem.insuranceNo}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.chancel_order_no')}}：</label><span>{{viewIem.chancelOrderNo}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.sales_order_no')}}：</label><span>{{viewIem.salesOrderNo}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.customer_name')}}：</label><span>{{viewIem.customerName}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.state')}}：</label><span>{{viewIem.claimStateName}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.insurer_company')}}：</label><span>{{viewIem.supplierName}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.apply_claim_time')}}：</label><span>{{viewIem.applyClaimDate | parseTime}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.audit_date')}}：</label><span>{{viewIem.acceptTime | parseTime}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.claim_time')}}：</label><span>{{viewIem.claimTime | parseTime}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.customer_declare_amount')}}：</label><span>{{viewIem.declareAmount}}{{viewIem.declareCurrency}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.insure_amount')}}：</label><span>{{viewIem.insureAmount}}{{viewIem.insureCurrency}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.claim_amount')}}：</label><span>{{viewIem.claimAmountsAll}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.claim_reason')}}：</label><span>{{viewIem.claimReasonName}}</span></div>
          <div class="record-item"><label>{{$t('uexpressClaim.claim_push_fail_message')}}：</label><span>{{viewIem.claimPushFailMessage}}</span></div>
					<div class="record-item"><label>{{$t('uexpressClaim.claim_refuse_message')}}：</label><span>{{viewIem.claimRefuseMessage}}</span></div>
				</div>
			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" type="primary" plain @click="viewVisible = false">{{ $t("common.close")}}</el-button>
			</div>
		</el-dialog>

    <el-dialog :visible.sync="pushFormVisible" :close-on-click-modal="false" width="500px" :title="$t('uexpressClaim.push_claim')">
        <el-form class="contact-form" ref="pushFormRef" :model="pushForm" :rules="pushFormRule" label-width="100px" size="mini">
          <div style="padding-left: 38px;margin-bottom: 20px;">
            <span v-html='$t("uexpressClaim.claim_select_info", { selectArr:selectArr.length })'></span>
          </div>
          <el-form-item :label='$t("uexpressClaim.img_file")' prop="addonFiles">
            <upload-file v-model="pushForm.addonFiles" :multiple="true" class="supporting-files"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="option-btn-wrap">
          <el-button size="mini" @click="pushFormVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button size="mini" type="primary" @click="pushConfirmFn">{{ $t("common.confirm") }}</el-button>
        </div>
      </el-dialog>
	</div>
</template>

<script>
import { getInsuranceClaimListApi, pushInsuranceClaimApi, pushInsuranceClaimFixedApi } from "@/api/uexpress/claimInsuranceList";
import { getDictListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";
import operationBtn from './operationBtn'

export default {
	name: "UExpressClaimInsuranceList",
	components: {
		AgGridVue,
    operationBtn
	},
	data() {
		return {
			formData: {
        noType: 1,
        searchNo: '',
        timeType: 1,
        searchTimePeriod: [],

        customerId: '',
        claimReason: '',
        insuranceState: ''
			},
      claimStateList: [],
			claimReasonList: [],
      insuranceStateList: [],
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
					field: "claimNo",
					headerName: this.$t('uexpressClaim.claim_no'),
					minWidth: 150
				},
				{
					field: "insuranceNo",
					headerName: this.$t('uexpressClaim.insurance_no'),
					minWidth: 150
				},
				{
					field: "supplierName",
					headerName: this.$t('uexpressClaim.insurer_company'),
					minWidth: 150
				},
				{
					field: "salesOrderNo",
					headerName: this.$t('uexpressClaim.sales_order_no'),
					minWidth: 150
				},
				{
					field: "chancelOrderNo",
					headerName: this.$t('uexpressClaim.chancel_order_no'),
					minWidth: 150
				},
				{
					field: "customerName",
					headerName: this.$t('uexpressClaim.owner_customer'),
					minWidth: 150
				},
				{
					field: "compositeClaimStateName",
					headerName: this.$t('uexpressClaim.state'),
					minWidth: 100
				},
				{
					field: "applyClaimDate",
					headerName: this.$t('uexpressClaim.apply_claim_time'),
					minWidth: 150
				},
				{
					field: "acceptTime",
					headerName: this.$t('uexpressClaim.audit_date'),
					minWidth: 150
				},
				{
					field: "claimReasonName",
					headerName: this.$t('uexpressClaim.claim_reason'),
					minWidth: 100
				},
				{
					field: "insureAmount",
					headerName: this.$t("uexpressClaim.insure_amount") + '(CNY)',
					minWidth: 100
				},
				{
					field: "claimAmountsAll",
					headerName: this.$t("uexpressClaim.claim_amount"),
					minWidth: 100
				},
				{
					field: "claimDate",
					headerName: this.$t("uexpressClaim.claim_time"),
					minWidth: 150
				},
        {
					field: "OB",
					headerName: this.$t("uexpressClaim.operation"),
					cellRendererFramework: "operationBtn",
					minWidth: 100,
          pinned: 'right'
				}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
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

      // 详情
			viewVisible: false,
      viewIem: {},

      // 推送
      selectArr: [],
      pushFormVisible: false,
      pushForm: {
        addonFiles: []
      },
      pushFormRule: {
        addonFiles: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(20), getDictListApi(23), getDictListApi(28)]).then(results => {
				const claimReasonRes = results[0];
        const insuranceStateRes = results[1];
        const claimStateRes = results[2];
				if (claimReasonRes.ok) {
					this.claimReasonList = claimReasonRes.content;
				}
				if (insuranceStateRes.ok) {
					this.insuranceStateList = insuranceStateRes.content;
				}
				if (claimStateRes.ok) {
					this.claimStateList = claimStateRes.content;
				}
			});
		},

		onReady(params) {
      this.gridApi = params.api
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
		async list() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};

      if (params.noType === 1) {
        params.claimNo = params.searchNo
      } else if (params.noType === 2) {
        params.insuranceNo = params.searchNo
      } else if (params.noType === 3) {
        params.salesOrderNo = params.searchNo
      } else if (params.noType === 4) {
        params.chancelOrderNo = params.searchNo
      }

      if (params.timeType === 1) {
        params.claimPushDateStart = this.formData.searchTimePeriod[0] || "";
				params.claimPushDateEnd = this.formData.searchTimePeriod[1] || "";
      } else if (params.timeType === 2) {
        params.acceptTimeStart = this.formData.searchTimePeriod[0] || "";
				params.acceptTimeEnd = this.formData.searchTimePeriod[1] || "";
      } else if (params.timeType === 3) {
        params.claimDateStart = this.formData.searchTimePeriod[0] || "";
				params.claimDateEnd = this.formData.searchTimePeriod[1] || "";
      }

      delete params.searchTimePeriod

			const res = await getInsuranceClaimListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.claimDate = parseTime(v.claimDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.acceptTime = parseTime(v.acceptTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.applyClaimDate = parseTime(v.applyClaimDate, "{y}-{m}-{d} {h}:{i}:{s}");

          let claimAmountsAll = 0
          v.claimAmounts.forEach(curreny => {
            claimAmountsAll = addFloatNum(claimAmountsAll, curreny.value)
          })
          v.claimAmountsAll = formatNumberToThousands(claimAmountsAll)
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    viewFn(item) {
      this.viewVisible = true
      this.viewIem = item
    },
    pushFn() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}

      // 只能勾选【推送失败】或【补充材料】状态的理赔单进行推送；
      let idsList = []
      let stateMAp = {}
      let check = true
      selectedRows.forEach(v => {
         stateMAp[v.compositeClaimState] = v
         idsList.push({
          claimId: v.id,
          claimShardingKey: v.shardingKey
        })
        // 未推送 10
        // 推送失败 15
        // 补充资料 35
        if (v.compositeClaimState !== 10 && v.compositeClaimState !== 15 && v.compositeClaimState !== 35) {
          check = false
        }
      })

      let arr = Object.keys(stateMAp)
      let comp = arr.indexOf(35) >= 0 && arr.length > 1; // 只能单独选中【推送失败】或单独选中【补充材料】
      if (!check || comp) {
        // 只能勾选【推送失败】或【补充材料】状态的理赔单进行推送；
        this.$message.error(this.$t('uexpressClaim.only_send_desc'));
        return
      }

      if (arr[0] === 35) {
        // 补充材料
        this.selectArr = selectedRows
        this.pushForm = {
          addonFiles: []
        }
        this.pushFormVisible = true

      } else {
        // 推送失败 未推送
        let data = {
          claimIds: idsList
        }
        pushInsuranceClaimApi(data).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressClaim.push_oper_success'))
            this.list()
          }
        })
      }
    },
    pushConfirmFn() {
      let arr = []
      let selRows = this.gridApi.getSelectedRows();
      selRows.forEach(v => {
        arr.push({
          claimId: v.id,
          claimShardingKey: v.shardingKey
        })
      })

      this.$refs.pushFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.pushForm,
            claimIds: arr,
            addonFiles: []
          }
          data.addonFiles = this.pushForm.addonFiles
          pushInsuranceClaimFixedApi(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('uexpressClaim.push_oper_success'))
              this.list()
              this.pushFormVisible = false
            }
          })
        }
      })
    },
		reset() {
			this.$refs.formData.resetFields();
			this.list();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.search-item-1{
  width:100px;
  float: left;
  z-index: 6;
}
.search-item-2{
  padding-left: 100px;
  display: block;
}
.record-container{
  .title {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 600;
    line-height: 50px;
    border-bottom: 1px solid #eee;
  }

.record-container-content {
		overflow: hidden;

		.record-item {
			float: left;
			width: 50%;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 120px;
				min-width: 120px;
				display: block;
				text-align: right;
				margin-bottom: 15px;
				font-weight: 500;
				font-size: 14px;
				float: left;
				margin-right: 6px;
			}
			span {
				font-weight: 500;
				font-size: 14px;
				display: inline;
				flex: 1;
			}
		}

		.title-important-item.record-item {
			width: 33%;
			label {
				font-weight: 600 !important;
			}
			span {
				font-weight: 600 !important;
			}
		}
	}
}
</style>
