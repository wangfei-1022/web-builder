import { AgGridVue } from "ag-grid-vue";
import { getBusinessReportTemplateList, getBusinessReportArrTemplateList } from "@/api/report";
import {
  getDictDataApi,
  getReceiveBillListApi,
  getReceiveBillListTotalApi,
  receiveBillConfirmApi,
  receiveBillRecallApi,
  downloadBillFileApi,
  receiveBillExportExcelApi,
  receiveBillRecallWithdrawApi,
  sendReceiveBillEmailBySearchApi,
  sendReceiveBillEmailByIdsApi
} from "@/api/financial/fmsReceive";
import {
  getPayableBillListApi,
  getPayableBillListTotalApi,
  payableBillExportExcelApi
} from "@/api/financial/fmsPayable";
import ReceiveInvoice from "../components/ReceiveInvoice";
import ReceiveCleard from "../components/ReceiveCleard";
import ApplyInvoiceDialog from "../components/ApplyInvoiceDialog";
import ApplyPaymentDialog from "../components/ApplyPaymentDialog";
import SendBillDialog from "../components/SendBillDialog";
import RecallBillInnerConfirm from "./components/RecallBillInnerConfirm";
import BillState from "./components/BillState";
import OptionBtnBill from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { businessOrderMap } from "../components/constants";

export default {
  components: {
    AgGridVue,
    OptionBtnBill,
    ReceiveInvoice,
    ReceiveCleard,
    ApplyInvoiceDialog,
    SendBillDialog,
    RecallBillInnerConfirm,
    BillState,
    ApplyPaymentDialog
  },
  props: {
    invoiceApplyState: {
      type: [String, Number],
      default: ""
    },
    billState: {
      type: [String, Number],
      default: ""
    },
    pushEmailState: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectedIds: [],
      billExportMap: {},
      exportTemplates: [],
      selectedInvoiceInfo: {},
      formData: {
        billNo: "",
        settlementCompanyId: "",
        settlementOfficeId: "",
        businessType: "",
        businessTypeList: [],
        entityTypeList: [],
        saleId: "",
        billState: "",
        pushEmailState: '',
        invoiceState: "",
        clearState: "",
        instructionState: "",
        confirmBy: "",
        createBy: "",
        billDateEstimatePeriod: [],
        billDateActualPeriod: [],
        confirmDateEstimatePeriod: [],
        confirmDateActualPeriod: [],
        periodName: ''
      },
      pageSizeRange: [10, 20, 30, 50],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      amountTotal: [], // 统计
      unClearedAmountTotal: [], // 未销合计

      columnFields: [],
      loading: false,

      entityTypeList: [],
      entityTypeListALL: [],
    };
  },
  created() {
    this.getList();
    this.getBaseDataFn()
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api;
    },
    getBaseDataFn() {
      Promise.all([getDictDataApi(35)]).then(results => {
        const entityTypeRes = results[0];
        if (entityTypeRes.ok) {
          this.entityTypeList = entityTypeRes.content;
          this.entityTypeListALL = entityTypeRes.content;
        }
      });
    },
    getParams() {
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      // 如果是待对账tab
      if (this.billState) {
        params.billState = this.billState;
      }
      if (this.pushEmailState) {
        params.pushEmailState = this.pushEmailState;
      }
      if (this.pushEmailState === 1) {
        params.excludeBillStates = [5]
      }
      if (this.invoiceApplyState) {
        params.invoiceApplyState = this.invoiceApplyState;
      }
      if (this.formData.billDateEstimatePeriod.length) {
        params.billDateEstimateStart = this.formData.billDateEstimatePeriod[0];
        params.billDateEstimateEnd = this.formData.billDateEstimatePeriod[1];
      }
      if (this.formData.billDateActualPeriod.length) {
        params.billDateActualStart = this.formData.billDateActualPeriod[0];
        params.billDateActualEnd = this.formData.billDateActualPeriod[1];
      }
      if (this.formData.confirmDateEstimatePeriod.length) {
        params.confirmDateEstimateStart = this.formData.confirmDateEstimatePeriod[0];
        params.confirmDateEstimateEnd = this.formData.confirmDateEstimatePeriod[1];
      }
      if (this.formData.confirmDateActualPeriod.length) {
        params.confirmDateActualStart = this.formData.confirmDateActualPeriod[0];
        params.confirmDateActualEnd = this.formData.confirmDateActualPeriod[1];
      }
      delete params.billDateEstimatePeriod;
      delete params.billDateActualPeriod;
      delete params.confirmDateEstimatePeriod;
      delete params.confirmDateActualPeriod;
      return params
    },
    async getList() {
      this.loading = true;
      let params = this.getParams()
      let totalFn = this.type === "AP" ? getPayableBillListTotalApi : getReceiveBillListTotalApi;
      let listFn = this.type === "AP" ? getPayableBillListApi : getReceiveBillListApi;
      this.$emit('refresh')
      this.amountTotal = []
      this.unClearedAmountTotal = []
      totalFn(params).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            if (v.amountName === "amount") {
              v.amounts.forEach(v => {
                v.value = formatNumberToThousands(v.value);
              });
              this.amountTotal = v.amounts;
            }
            if (v.amountName === "unClearedAmount") {
              v.amounts.forEach(v => {
                v.value = formatNumberToThousands(v.value);
              });
              this.unClearedAmountTotal = v.amounts;
            }
          });
        }
      });
      const res = await listFn(params);
      if (res.ok) {
        this.total = parseInt(res.content.total, 10);
        let currencyArr = [];
        res.content.list.forEach(v => {
          v.type = this.type
          v.billDateEstimate = parseTime(v.billDateEstimate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.billDateActual = parseTime(v.billDateActual, "{y}-{m}-{d} {h}:{i}:{s}");
          v.confirmDateEstimate = parseTime(v.confirmDateEstimate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.confirmDateActual = parseTime(v.confirmDateActual, "{y}-{m}-{d} {h}:{i}:{s}");

          let currency = v.currencyAmounts;
          currency.forEach(c => {
            v[c.currency] = formatNumberToThousands(c.value);
            if (c.currency && currencyArr.indexOf(c.currency) < 0) {
              currencyArr.push(c.currency);
            }
          });
        });
        this.dataList = res.content.list;
      } else {
        this.total = 0;
        this.dataList = [];
      }
      this.loading = false;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getList();
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getList();
    },
    reset() {
      this.$refs.formData.resetFields();
      this.getList();
    },
    // 发送账单-应付
    sendBillAP() {
      let selectedRows = this.gridApi.getSelectedRows();
      let arr = ["SEA_EXPORT", "AIR_EXPORT"];
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_then_bill"));
        return;
      }
      let ids = [];
      let MSG = "";
      let selectedSettlementId = [];
      let businessType = []
      selectedRows.forEach(v => {
        ids.push(v.id);
        if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
          selectedSettlementId.push(v.settlementCompanyId);
        }
        if (businessType.indexOf(v.businessType) < 0) {
          businessType.push(v.businessType);
        }
        if (arr.indexOf(v.businessType) < 0) {
          MSG = v.businessTypeName + this.$t("receiveFms.send_bill_desc_3");
        }
      });
      if (MSG) {
        this.$message.error(MSG);
        return;
      }
      if (selectedSettlementId.length > 1) {
        this.$message.error(this.$t("receiveFms.send_bill_desc_1"));
        return;
      }
      if (businessType.length > 1) {
        this.$message.error(this.$t("receiveFms.send_bill_desc_2"));
        return;
      }
      this.selectedIds = ids;
      this.$refs.sendBillDialogRef.show(selectedSettlementId[0], businessType[0]);
    },
    // 发送账单-AR
    sendBillAR() {
      let selectedRows = this.gridApi.getSelectedRows();
      // 此时表明是待推送列表，如果是不选中的则根据查询搜索的结果进行发送
      // 且没有选中的
      if (this.pushEmailState === 1 && selectedRows.length <= 0) {
        // 查询发送
        let params = this.getParams()
        this.sendBillConfrimFn(sendReceiveBillEmailBySearchApi, params, this.total)
        return
      }

      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_then_bill"));
        return;
      }
      let ids = [];
      let selectedSettlementId = [];
      let businessType = []
      selectedRows.forEach(v => {
        ids.push(v.id);
        if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
          selectedSettlementId.push(v.settlementCompanyId);
        }
        if (businessType.indexOf(v.businessType) < 0) {
          businessType.push(v.businessType);
        }
      });

      // 如果检测出勾选的包含多个结算抬头 或者多个业务类型
      if (selectedSettlementId.length > 1 || businessType.length > 1) {
        // ids发送
        let params = { billIds: ids }
        this.sendBillConfrimFn(sendReceiveBillEmailByIdsApi, params, selectedRows.length)
      } else {
        this.selectedIds = ids;
        this.$refs.sendBillDialogRef.show(selectedSettlementId[0], businessType[0]);
      }
    },
    // 使用查询发送和ids发送之前的弹窗确认
    sendBillConfrimFn(sendBillApi, params, count) {
      this.$confirm(this.$t("receiveFms.sendBillConfrimDes", { count: count }), this.$t("receiveFms.sendBillConfrim"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true;
        sendBillApi(params).then(res => {
          if (res.ok) {
            this.getList();
            this.$message.success(this.$t('receiveFms.sendBillSuccess'))
          }
          this.loading = false;
        })
      }).catch(() => { });
    },
    // 申请付款
    applyPayment() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let selectedSettlementId = [];
      let ids = [];
      for (let index = 0, len = selectedRows.length; index < len; index++) {
        let item = selectedRows[index]
        ids.push(item.id);
        if (selectedSettlementId.indexOf(item.settlementCompanyId) < 0) {
          selectedSettlementId.push(item.settlementCompanyId);
        }
        if (selectedSettlementId.length > 1) {
          // 不是同一家结算单位的不支持一起申请核销！
          this.$message.error(this.$t("receiveFms.clear_desc_3"));
          return;
        }
        if (item.clearState !== 1 && item.clearState !== 2) {
          this.$message.error(this.$t("receiveFms.clear_desc_1"));
          return;
        }
        if (item.instructionState !== 1 && item.instructionState !== 2) {
          this.$message.error(this.$t("receiveFms.clear_desc_2"));
          return;
        }
        if (item.billState !== 2) {
          // 只有账单状态为已对账才能进行核销操作
          this.$message.error(this.$t("receiveFms.clear_desc_5"));
          return;
        }
      }
      this.$refs.applyPaymentDialogRef.show(ids);
    },
    // 申请核销 或者 对冲
    applyOrHedgeClear(isHedge) {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let selectedSettlementId = [];
      let selectedOfficeId = []
      let ids = [];
      let MSG = "";
      selectedRows.forEach(v => {
        ids.push(v.id);
        if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
          selectedSettlementId.push(v.settlementCompanyId);
        }
        if (selectedOfficeId.indexOf(v.settlementOfficeId) < 0) {
          selectedOfficeId.push(v.settlementOfficeId);
        }
        // if (v.billState != 2) {
        // 	MSG = "只有账单状态为已对账才能进行核销操作";
        // }
        // 只有核销状态为未核销或者部分核销才能进行核销操作
        if (v.clearState !== 1 && v.clearState !== 2) {
          MSG = this.$t("receiveFms.clear_desc_1");
        }
        // 只有申请核销状态为未申请或者部分申请才能进行核销操作
        if (v.instructionState !== 1 && v.instructionState !== 2) {
          MSG = this.$t("receiveFms.clear_desc_2");
        }
      });
      if (selectedSettlementId.length > 1) {
        // 不是同一家结算单位的不支持一起申请核销！
        this.$message.error(this.$t("receiveFms.clear_desc_3"));
        return;
      }
      if (selectedOfficeId.length > 1) {
        // 不是同一账套的不支持一起申请核销！
        this.$message.error(this.$t("receiveFms.clear_desc_7"));
        return;
      }
      if (MSG) {
        this.$message.error(MSG);
        return;
      }
      // 未核销 已对账
      let name = isHedge ? "FmsReceiptOffsetClearPage" : "FmsReceiptApplyClearPage";
      if (this.type === 'AP') {
        name = isHedge ? "FmsPayableOffsetClearPage" : "FmsPayableApplyClearPage";
      }
      this.$router.push({
        name: name,
        query: {
          ids: ids.join(","),
          origin: "BILL",
          back: this.$route.name
        }
      });
    },
    // 申请开票
    applyInvoice() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_then_bill"));
        return;
      }
      let ids = [];
      let settlementCompanyIds = [];
      let businessTypes = [];
      let isPass = true; // 账单状态已对账 且 开票状态为部分开票 或者 未开票
      let isPiecePass = true;
      selectedRows.forEach(v => {
        if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
          settlementCompanyIds.push(v.settlementCompanyId);
        }
        if (businessTypes.indexOf(v.businessType) < 0) {
          businessTypes.push(v.businessType);
        }

        // 其他账期 -> 未开票 部分开票 已对账
        if ((v.invoiceState === 1 || v.invoiceState === 2) && v.billState === 2) {
          // 通过校验
        } else {
          isPass = false;
        }

        ids.push(v.id);
      });
      if (settlementCompanyIds.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_company"));
        return;
      }
      if (businessTypes.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_business_type"));
        return;
      }
      // 其他账期 -> 未开票 部分开票 已对账
      if (!isPass) {
        this.$message.error(this.$t("receiveFms.need_un_invoice_and_bill_check"));
        return;
      }
      this.selectedIds = ids;
      this.$refs.applyInvoiceDialogRef.show(ids);
    },
    businessTypeChange() {
      this.formData.entityTypeList = []
      if (this.formData.businessTypeList.length) {
        // 变更单据类型
        let arr = []
        this.formData.businessTypeList.forEach(v => {
          arr = arr.concat(businessOrderMap[v])
        })
        let entityTypeList = []
        arr.forEach(v => {
          let index = this.entityTypeListALL.findIndex(item => item.code === v)
          if (index >= 0) {
            entityTypeList.push(this.entityTypeListALL[index])
          }
        })
        this.entityTypeList = entityTypeList
      } else {
        this.entityTypeList = this.$extends({}, true, this.entityTypeListALL)
      }
    },
    // 当业务类型改变的时候 更新可以下拉的导出选项
    getExportTypeList(businessType) {
      let name = this.billExportMap[businessType];
      getBusinessReportArrTemplateList({ typeCodeList: name })
        .then(res => {
          if (res.content.length === 0) {
            // 当前业务类型未配置模板，暂时无法进行导出Excel
            this.$message.error(this.$t("receiveFms.no_template_can_not_export"));
            this.$refs.popoverRef.doToggle();
            return;
          }
          this.exportTemplates = res.content;
        })
        .catch(() => { });
    },
    // 导出Excel之前校验是否选择了业务类型
    exportExcelCheck() {
      let rows = this.gridApi.getSelectedRows();
      if (rows.length === 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_data"));
        this.$refs.popoverRef.doToggle();
        return;
      }
      let map = {};
      rows.forEach(v => {
        map[v.businessType] = v.businessType;
      });
      if (Object.keys(map).length > 1) {
        this.$message.error(this.$t("receiveFms.please_select_same_business_type_then_export"));
        this.$refs.popoverRef.doToggle();
        return;
      }

      if (!this.billExportMap[rows[0].businessType]) {
        // 当前业务类型未配置模板，暂时无法进行导出Excel
        this.$message.error(this.$t("receiveFms.no_template_can_not_export"));
        this.$refs.popoverRef.doToggle();
        return;
      }

      this.getExportTypeList(rows[0].businessType);
    },
    // 导出Excel
    exportExcel(code) {
      let fn = this.type === "AR" ? receiveBillExportExcelApi : payableBillExportExcelApi;
      let rows = this.gridApi.getSelectedRows();
      let billIds = [];
      rows.forEach(v => {
        billIds.push(v.id);
      });
      let data = {
        templateCode: code,
        billIds: billIds
      };
      fn(data).then(res => {
        if (res.ok) {
          // 导出操作成功，请稍后去任务列表查看导出结果
          this.$message.success(this.$t("receiveFms.export_operate_success"));
        }
      });
    },

    // 开票
    receiveInvoice() {
      let ids = [];
      let totalAmount = {};
      let rows = this.gridApi.getSelectedRows();
      let isInAdjust = false;
      if (rows.length === 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_data"));
        return;
      }
      rows.forEach(v => {
        ids.push(v.id);
        v.currencyAmounts.forEach(x => {
          totalAmount[x.currency] = Number(totalAmount[x.currency] || 0) + Number(x.value);
        });
        // 账单状态为调整中，不能进行该操作!
        if (v.billState === 11) {
          isInAdjust = true;
        }
      });

      if (isInAdjust) {
        this.$message.error(this.$t("receiveFms.can_not_operation_in_adjust"));
        return;
      }

      this.selectedInvoiceInfo = {
        ids: ids,
        totalAmount: totalAmount
      };
      this.$refs.receiveInvoiceRef.show();
    },
    // 核销
    receiveCleared() {
      let ids = [];
      let totalAmount = {};
      let rows = this.gridApi.getSelectedRows();
      if (rows.length === 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_data"));
        return;
      }
      let isInAdjust = false;
      let isCleared = false;
      rows.forEach(v => {
        ids.push(v.id);
        v.currencyAmounts.forEach(x => {
          totalAmount[x.currency] = Number(totalAmount[x.currency] || 0) + Number(x.value);
        });
        // 账单状态为调整中，不能进行该操作!
        if (v.billState === 11) {
          isInAdjust = true;
        }
        // 核销状态为已核销，不能进行该操作!
        if (v.clearState === 3) {
          isCleared = true;
        }
      });
      if (isCleared) {
        this.$message.error(this.$t("receiveFms.can_not_operation_is_cleared"));
        return;
      }
      if (isInAdjust) {
        this.$message.error(this.$t("receiveFms.can_not_operation_in_adjust"));
        return;
      }
      this.selectedInvoiceInfo = {
        ids: ids,
        totalAmount: totalAmount
      };
      this.$refs.receiveCleardRef.show();
    },
    // 下载账单
    downloadBillFile(item) {
      this.loading = true
      downloadBillFileApi(item.id).then(res => {
        if (res.ok) {
          if (!res.content) {
            this.$message.error(this.$t("receiveFms.download_file_wait"));
            return;
          }
          window.location.href = res.content.url;
        }
        this.loading = false
      });
    },
    // 查看
    view(item) {
      let name = this.type === "AP" ? "FmsPayableBillDetail" : "FmsReceiveBillDetail";
      this.$router.push({ name: name, query: { id: item.id } });
    },
    // Test
    // 对账确认
    confirm(item) {
      this.$confirm(this.$t("receiveFms.fms_bill_confirm_des"), this.$t("receiveFms.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true;
        receiveBillConfirmApi(item.id)
          .then(res => {
            if (res.ok) {
              this.$message.success(this.$t("receiveFms.fms_bill_confirm_success"));
              this.getList();
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }).catch(() => { });
    },
    // 撤回
    recall(item) {
      this.$confirm(this.$t("receiveFms.bill_recall_des"), this.$t("receiveFms.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.loading = true
          receiveBillRecallApi(item.id).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("receiveFms.bill_recall_success"));
              this.getList();
            }
            this.loading = false
          });
        })
        .catch(() => { });
    },
    // 撤回对账
    recallBillConfirm(item) {
      this.$confirm(item.billNo + this.$t("receiveFms.recall_bill_desc"), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.loading = true
          receiveBillRecallWithdrawApi(item.id).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("receiveFms.bill_recall_success"));
              this.getList();
            }
            this.loading = false
          });
        })
        .catch(() => { });
    },
    // 待内部确认 撤回确认
    recallBillInnerConfirm(item) {
      this.$refs.recallBillInnerConfirmRef.show(item)
    }
  }
};
