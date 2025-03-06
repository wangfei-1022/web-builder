import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi } from "@/api/partner/customerManage";
import { getDictDataApi, getReceiveChargeListApi, getReceiveChargeListTotalApi, receiveChargeExportExcelApi, receiveChargeExportSearchApi, getReceiveChargeMultipleSearchApi, getReceiveChargeMultipleTotalApi, getReceiveChargeListALlApi, cancelClearedReceiveChargeApi, receiveChargeRemoveFromBillApi } from "@/api/financial/fmsReceive";
import OptionBtnCharge from "./optionBtn";
import ClearStateCell from "./components/ClearStateCell";
import ChargeGoodsList from "./components/ChargeGoodsList";
import CreateBillSuccess from "../components/CreateBillSuccess";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getPayableChargeListApi, getPayableChargeListTotalApi, payableChargeExportSearchApi, payableChargeExportExcelApi, getPayableChargeMultipleSearchApi, getPayableChargeMultipleTotalApi, getPayableChargeListALlApi } from "@/api/financial/fmsPayable";
import ReceiveInvoice from "../components/ReceiveInvoice";
import ReceiveCleard from "../components/ReceiveCleard";
import ProfitAndLoss from "../components/ProfitAndLoss";
import ApplyInvoiceDialog from "../components/ApplyInvoiceDialog";
import ChangeConfirmSettlement from "../components/ChangeConfirmSettlement"; // 变更责任主体
import JoinBill from "../components/JoinBill";
import RemoveChargeFromBill from "../components/RemoveChargeFromBill";
import ChangeBillDate from "../components/ChangeBillDate";
import PartClear from "../components/PartClear";
import PartClearDetail from "../components/PartClearDetail";
import ApplyPaymentDialog from "../components/ApplyPaymentDialog";
import { getBusinessReportArrTemplateList } from "@/api/report";
import receiveTable from "./table/receiveTable";
import payableTable from "./table/payableTable";
import { arChargeExportMap, apChargeExportMap, businessOrderMap } from "../components/constants";

export default {
  components: {
    AgGridVue,
    OptionBtnCharge,
    CreateBillSuccess,
    ReceiveInvoice,
    ReceiveCleard,
    ProfitAndLoss,
    ApplyInvoiceDialog,
    PartClear,
    ClearStateCell,
    PartClearDetail,
    JoinBill,
    RemoveChargeFromBill,
    ChangeConfirmSettlement,
    ChangeBillDate,
    ChargeGoodsList,
    ApplyPaymentDialog
  },
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectedIds: [],
      activeName: "first",
      exportTemplates: [], // 导出的下拉
      selectedInvoiceInfo: {},
      formData: {
        queryType: "1", // 单号类型
        multipleNos: "", // 多单号
        settlementMode: "",
        entityNo: "",
        billNo: "",
        invoiceNo: '',
        responsiblePersonId: "",
        settlementCompanyId: "",
        settlementCompanyName: "",
        settlementOfficeId: "", // 一海通结算公司
        businessType: "",
        businessTypeList: [],
        entityType: "",
        entityTypeList: [],
        feeItemCode: "",
        entryState: "",
        invoiceState: "",
        clearState: "",
        instructionState: "",
        multipleInstructionState: [],
        multipleClearState: [],
        invoiceTaxRate: "",
        invoiceApplyState: "",
        profitState: "",
        periodBusiness: [],
        periodEntry: [],
        periodConfirmTime: [], // 费用提交时间
        periodLastClearDate: [], // 核销时间
        periodLastReceiptPayDate: [], // 实际到账日期
        currency: "", // 币种
        extendInfo11: "", // 拓展字段 用于存放业务编号
        extendInfo13: "", // 拓展字段 用于存放主单号
        extendInfo14: "", // 拓展字段 用于存放分单号
        confirmationNo: "", // 费用确认单流水号
        memberId: '', // 本地客户
        memberName: '',
        profitPeriod: '', // 盈亏月份
        profitAuditDatePeriod: [], // 盈亏审核时间
        etaPeriod: [], // eta
        entryStates: [],
        channelOrderNo: '',
        customerBillNo: '', // 客户提单号
        businessTagTypes: [] // 业务标签
      },

      entityTypeList: [],
      entityTypeListALL: [],
      pageSizeRange: [10, 20, 30, 50],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],

      createBillInfo: {}, // 生成账单所需信息
      amountTotal: [], // 应收应付统计
      unClearedAmountTotal: [], // 未销合计

      columnFields: [],
      chargeExportMap: {},
      gridApi: {},
      loading: false,
      businessTagCodeList: []
    };
  },
  created() {
    // this.getList()
    this.getBaseDataFn();
    // 根据应收应付类型 初始化对应的数据
    if (this.type === "AP") {
      this.chargeExportMap = apChargeExportMap;
      this.columnFields = payableTable;
    } else {
      this.chargeExportMap = arChargeExportMap;
      this.columnFields = receiveTable;
    }
  },
  methods: {
    settlementCompanyChange(item) {
      this.formData.settlementCompanyId = item.settlementCompanyId;
      this.formData.settlementCompanyName = item.settlementCompanyName;
    },
    memberCustomerChange(item) {
      this.formData.memberId = item.id;
      this.formData.memberName = item.chineseName;
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

        // 当业务类型改变的时候 更新可以下拉的导出选项
        let typeCodeList = []
        this.formData.businessTypeList.forEach(v => {
          let typeCodeArr = this.chargeExportMap[v]
          if (typeCodeArr) {
            typeCodeArr.forEach(xx => {
              if (typeCodeList.indexOf(xx) < 0) {
                typeCodeList.push(xx)
              }
            })
          }
        })
        // 先清除
        this.exportTemplates = [];
        if (typeCodeList.length > 0) {
          getBusinessReportArrTemplateList({ typeCodeList: typeCodeList }).then(res => {
            this.exportTemplates = res.content;
          }).catch(() => { });
        }
      } else {
        this.exportTemplates = [];
        this.entityTypeList = this.$extends({}, true, this.entityTypeListALL)
      }
    },
    allAddGoods() {
      if (this.total > 2000) {
        // 搜索结果超过2000条，不能进行全部加入操作
        this.$message.error(this.$t("receiveFms.addGoodsError2000"));
        return;
      }
      this.loading = true;
      let params = this.getSearchData();
      let listFn = this.type === "AP" ? getPayableChargeListALlApi : getReceiveChargeListALlApi;
      listFn(params).then(res => {
        if (res.ok) {
          this.$refs.chargeGoodsListRef.showGoodsFn();
          this.$refs.chargeGoodsListRef.addGoodsCommonFn(res.content);
        }
        this.loading = false;
      });
    },
    selectAddGoods() {
      let selRows = this.gridApi.getSelectedRows();
      this.$refs.chargeGoodsListRef.addGoodsCommonFn(selRows);
    },
    formatNumberToThousands(value) {
      return formatNumberToThousands(value);
    },
    getBaseDataFn() {
      Promise.all([getDictDataApi(35), getDictDataApi(48)]).then(results => {
        const entityTypeRes = results[0];
        const businessTagRes = results[1];
        if (entityTypeRes.ok) {
          this.entityTypeList = entityTypeRes.content;
          this.entityTypeListALL = entityTypeRes.content;
        }
        if (businessTagRes.ok) {
          this.businessTagCodeList = businessTagRes.content
        }
      });
    },
    onReady(params) {
      this.gridApi = params.api;
    },
    // 一般查询和多单查询
    tabClick() {
      setTimeout(() => {
        if (this.activeName === "third") {
          this.$refs.searchFormRef3.triggerResize();
        } else {
          this.$refs.searchFormRef1.triggerResize();
        }
      }, 0);
    },
    // 弹窗的成功回调
    successOperFn() {
      this.$refs.chargeGoodsListRef.clearGoodsList();
      this.getList();
    },
    // 获取搜索框的值
    getSearchData() {
      let params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      if (this.formData.periodBusiness.length) {
        params.bussinessDateStart = this.formData.periodBusiness[0] || "";
        params.bussinessDateEnd = this.formData.periodBusiness[1] || "";
      }
      if (this.formData.periodEntry.length) {
        params.entryDateStart = this.formData.periodEntry[0] || "";
        params.entryDateEnd = this.formData.periodEntry[1] || "";
      }
      if (this.formData.periodConfirmTime.length) {
        params.confirmTimeStart = this.formData.periodConfirmTime[0] || "";
        params.confirmTimeEnd = this.formData.periodConfirmTime[1] || "";
      }
      if (this.formData.periodLastReceiptPayDate.length) {
        params.lastReceiptPayDateStart = this.formData.periodLastReceiptPayDate[0] || "";
        params.lastReceiptPayDateEnd = this.formData.periodLastReceiptPayDate[1] || "";
      }

      if (this.formData.periodLastClearDate.length) {
        params.lastClearDateStart = this.formData.periodLastClearDate[0] || "";
        params.lastClearDateEnd = this.formData.periodLastClearDate[1] || "";
      }
      if (this.formData.profitAuditDatePeriod.length) {
        params.profitAuditDateStart = this.formData.profitAuditDatePeriod[0] || "";
        params.profitAuditDateEnd = this.formData.profitAuditDatePeriod[1] || "";
      }
      if (this.formData.etaPeriod.length) {
        params.startDateExtendInfo2 = this.formData.etaPeriod[0] || "";
        params.endDateExtendInfo2 = this.formData.etaPeriod[1] || "";
      }
      delete params.periodBusiness;
      delete params.periodEntry;
      delete params.periodConfirmTime;
      delete params.periodLastClearDate;
      delete params.periodLastReceiptPayDate;
      delete params.profitAuditDatePeriod;
      delete params.etaPeriod

      // 搜集值的时候 当为多单号查询的时候 处理一下
      if (this.activeName === "third") {
        // 多单号查询
      } else {
        delete params.queryType;
        delete params.multipleNos;
      }
      return params;
    },
    // 获取列表数据
    async getList() {
      this.loading = true;
      let params = this.getSearchData();
      let totalFn = null;
      let listFn = null;
      // 开始多单号查询
      if (this.activeName === "third") {
        listFn = this.type === "AP" ? getPayableChargeMultipleSearchApi : getReceiveChargeMultipleSearchApi;
        totalFn = this.type === "AP" ? getPayableChargeMultipleTotalApi : getReceiveChargeMultipleTotalApi;
      } else {
        totalFn = this.type === "AP" ? getPayableChargeListTotalApi : getReceiveChargeListTotalApi;
        listFn = this.type === "AP" ? getPayableChargeListApi : getReceiveChargeListApi;
      }
      this.amountTotal = []
      this.unClearedAmountTotal = []
      totalFn(params).then(res => {
        if (res.ok) {
          res.content = res.content || [];
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
        res.content.list = res.content.list || [];
        res.content.list.forEach(v => {
          v = v || {}; // 兼容null
          v.dateExtendInfo2 = parseTime(v.dateExtendInfo2, "{y}-{m}-{d} {h}:{i}:{s}");
          v.bussinessDate = parseTime(v.bussinessDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.entryDate = parseTime(v.entryDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.lastInvoiceDate = parseTime(v.lastInvoiceDate, "{y}-{m}-{d}");
          v.lastClearDate = parseTime(v.lastClearDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.confirmDateActual = parseTime(v.confirmDateActual, "{y}-{m}-{d} {h}:{i}:{s}");
          v.lastProfitDate = parseTime(v.lastProfitDate, "{y}-{m}-{d} {h}:{i}:{s}");
          v.confirmTime = parseTime(v.confirmTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.lastPayDateTime = parseTime(v.lastPayDateTime, "{y}-{m}-{d}");
          v.lastReceiptPayDate = parseTime(v.lastReceiptPayDate, "{y}-{m}-{d}");

          // js统一处理好之后进行展示 不影响利用原值进行计算
          v.priceText = formatNumberToThousands(v.price);
          v.taxAmountText = formatNumberToThousands(v.taxAmount);
          v.excludeTaxAmountText = formatNumberToThousands(v.excludeTaxAmount);
          v.entryAmountText = formatNumberToThousands(v.entryAmount);
          v.standardAmountText = formatNumberToThousands(v.standardAmount);
          v.clearingStandardAmountText = formatNumberToThousands(v.clearingStandardAmount);

          let clearInfoDTOs = v.clearInfoDTOs || [];
          let hasClearedAmount = 0;
          if (clearInfoDTOs.length) {
            clearInfoDTOs.forEach(x => {
              // 费用上只有一条核销币种
              // 所以不循环取值了
              if (x.clearAmounts[0] && x.clearAmounts[0].value) {
                hasClearedAmount += Number(x.clearAmounts[0].value);
              }
            });
          }
          // 已核销金额
          v.hasClearedAmount = formatNumberToThousands(hasClearedAmount);
          // 待核销金额
          v.unClearedAmount = formatNumberToThousands(Number(v.entryAmount) - Number(hasClearedAmount));

          // 客户提单
          v.customerBL = ""
          v.entityMultiValuesExtendInfos.forEach(xx => {
            if (xx.extendInfoType === 1) {
              v.customerBL = xx.extendInfoValues.join('、')
            }
          })
        });
        this.dataList = res.content.list;
      } else {
        this.total = 0;
        this.dataList = [];
      }
      this.loading = false;
    },
    resetFn() {
      if (this.activeName === "third") {
        this.$refs.formDataRef3.resetFields();
      } else {
        this.$refs.formDataRef1.resetFields();
        this.$refs.formDataRef2.resetFields();
      }
      this.formData.settlementCompanyId = '';
      this.formData.settlementCompanyName = '';
      this.getList();
    },
    // 申请付款
    applyPayment() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let selectedSettlementIdMap = [];
      let ids = [];
      for (let index = 0, len = selectedRows.length; index < len; index++) {
        let item = selectedRows[index]
        ids.push(item.id);
        selectedSettlementIdMap[item.settlementCompanyId] = item.settlementCompanyId

        // 不是同一家结算单位的不支持一起操作！
        if (Object.keys(selectedSettlementIdMap).length > 1) {
          this.$message.error(this.$t("receiveFms.clear_desc_3"));
          return;
        }

        // 非票结的只有账单状态为已对账才能进行操作
        if (item.settlementMode !== 1 && item.entryState !== 4) {
          this.$message.error(this.$t("receiveFms.clear_desc_5"));
          return;
        }

        // 只有部分核销或者未核销才能进行操作
        if (item.clearState !== 1 && item.clearState !== 2) {
          this.$message.error(this.$t("receiveFms.clear_desc_1"));
          return;
        }

        // 只有部分申请或者未申请才能进行操作
        if (item.instructionState !== 1 && item.instructionState !== 2) {
          this.$message.error(this.$t("receiveFms.clear_desc_2"));
          return;
        }
      }
      this.$refs.applyPaymentDialogRef.show(ids);
    },
    // 加入账单
    joinChargeToBill(type, goodsList) {
      let selectedRows = [];
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      // 结算单位 + 未入账 + 业务类型
      // 账单未对账 + 结算方式 一致
      let settlementCompanyIds = [];
      let businessTypes = [];
      selectedRows.forEach(v => {
        if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
          settlementCompanyIds.push(v.settlementCompanyId);
        }
        if (businessTypes.indexOf(v.businessType) < 0) {
          businessTypes.push(v.businessType);
        }
      });
      if (settlementCompanyIds.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_company"));
        return;
      }
      if (businessTypes.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_business_type"));
        return;
      }
      this.$refs.joinBillRef.show(selectedRows)
    },
    // 移出账单
    removeChargeFromBill(type, goodsList) {
      let selectedRows = [];
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let VALID_MSG = ''
      selectedRows.forEach(v => {
        // 应收的校验
        if (this.type === 'AR') {
          if (v.entryState !== 2 || v.instructionState !== 1 || v.invoiceApplyState !== 1) {
            // 只有未对账、未申请开票、未申请核销的费用才能移出账单
            VALID_MSG = this.$t("receiveFms.removeBillError1")
          }
        } else {
          if (v.entryState !== 2 || v.clearState !== 1) {
            // 只有未对账、未核销的费用才能移出账单
            VALID_MSG = this.$t("receiveFms.removeBillError2")
          }
        }
      })
      if (VALID_MSG) {
        this.$message.error(VALID_MSG);
        return;
      }
      this.$refs.removeChargeFromBillRef.show(selectedRows)
    },
    // 变更预计入账时间
    changeBillDateFn() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let settlementCompanyIds = [];
      let businessTypes = [];
      let settlementModeList = [];
      selectedRows.forEach(v => {
        if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
          settlementCompanyIds.push(v.settlementCompanyId);
        }
        if (businessTypes.indexOf(v.businessType) < 0) {
          businessTypes.push(v.businessType);
        }
        if (settlementModeList.indexOf(v.settlementMode) < 0) {
          settlementModeList.push(v.settlementMode);
        }
      });
      if (settlementCompanyIds.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_company"));
        return;
      }
      if (businessTypes.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_business_type"));
        return;
      }
      if (settlementModeList.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_mode"));
        return;
      }
      this.$refs.changeBillDateRef.show(selectedRows)
    },
    // 变更对账主体
    changeConfirmSettlementFn() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let ids = []
      selectedRows.forEach(v => {
        ids.push(v.settlementChargeId)
      })
      this.$refs.changeConfirmSettlementRef.show(ids);
    },
    // 申请开票
    applyInvoice(type, goodsList) {
      let selectedRows = []
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
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

        // 票结费用需要费用确认单已确认
        if (v.settlementMode === 1) {
          // if (v.confirmationState != 2) {
          // 	isPiecePass = false
          // }
        } else {
          // 其他账期 -> 未开票 部分开票 已对账
          if ((v.invoiceState === 1 || v.invoiceState === 2) && v.entryState === 4) {
            // 通过校验
          } else {
            isPass = false;
          }
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
      // 同样的业务类型之后 结算方式肯定相同
      // 票结费用需要费用确认单已确认
      if (!isPiecePass) {
        this.$message.error(this.$t("receiveFms.piece_need_confirm"));
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
    // 查看核销详情
    showClearDetail(item) {
      this.$refs.partClearDetailRef.show(item);
    },
    // 导出Excel之前校验是否选择了业务类型
    exportExcelCheck() {
      // if (!this.formData.businessType) {
      // 	this.$message.error(this.$t('receiveFms.please_select_business_type_then_export'))
      // 	this.$refs.popoverRef.doToggle()
      // 	return
      // }
      // if (!this.chargeExportMap[this.formData.businessType] || this.exportTemplates.length === 0) {
      // 	this.$message.error(this.$t('receiveFms.no_template_can_not_export'))
      // 	this.$refs.popoverRef.doToggle()
      // 	return
      // }
      return true;
    },
    // 导出Excel
    exportExcel(code) {
      let fn = this.type === "AR" ? receiveChargeExportExcelApi : payableChargeExportExcelApi;
      // 固定的导出
      if (code === "CHARGE_LIST_DETAIL") {
        fn = this.type === "AR" ? receiveChargeExportSearchApi : payableChargeExportSearchApi;
      }
      let params = this.getSearchData();
      let data = {
        templateCode: code,
        chargeEntryQueryReques: {
          ...params
        }
      };
      fn(data).then(res => {
        if (res.ok) {
          // 导出操作成功，请稍后去任务列表查看导出结果
          this.$message.success(this.$t("receiveFms.export_operate_success"));
        }
      });
    },
    // 申请核销 或者 对冲
    applyOrHedgeClear(isHedge, type, goodsList) {
      let selectedRows = []
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let selectedSettlementId = [];
      let selectedOfficeId = [];
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
        // if (v.entryState != 4) {
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
          origin: "CHARGE",
          back: this.$route.name
        }
      });
    },
    // 开票
    receiveInvoice(type, goodsList) {
      let ids = [];
      let totalAmount = {};
      let selectedRows = [];
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length === 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_data"));
        return;
      }
      let isInAdjust = false;
      selectedRows.forEach(v => {
        ids.push(v.id);
        totalAmount[v.currency] = Number(totalAmount[v.currency] || 0) + Number(v.entryAmount);
        // 账单状态为调整中，不能进行该操作!
        if (v.entryState === 11) {
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
    // 盈亏审核
    profitLoss() {
      this.$refs.profitAndLossRef.show();
    },
    // 部分核销
    partClear(item) {
      this.$refs.partClearRef.show(item);
    },
    // 核销
    receiveCleared(type, goodsList) {
      let ids = [];
      let totalAmount = {};
      let selectedRows = [];
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length === 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_data"));
        return;
      }
      let isInAdjust = false;
      let isCleared = false;
      selectedRows.forEach(v => {
        ids.push(v.id);
        totalAmount[v.currency] = Number(totalAmount[v.currency] || 0) + Number(v.entryAmount);

        // 账单状态为调整中，不能进行该操作!
        if (v.entryState === 11) {
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
    // 取消核销
    receiveCancelCleared(type, goodsList) {
      let ids = [];
      let totalAmount = {};
      let selectedRows = [];
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length === 0) {
        this.$message.error(this.$t("receiveFms.please_select_one_data"));
        return;
      }
      let isInAdjust = false;
      selectedRows.forEach(v => {
        ids.push(v.id);
        totalAmount[v.currency] = Number(totalAmount[v.currency] || 0) + Number(v.entryAmount);

        // 账单状态为调整中，不能进行该操作!
        if (v.entryState === 11) {
          isInAdjust = true;
        }
      });
      if (isInAdjust) {
        this.$message.error(this.$t("receiveFms.can_not_operation_in_adjust"));
        return;
      }
      this.$confirm(this.$t("receiveFms.confirmCancelClear"), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.loading = true
          cancelClearedReceiveChargeApi({ chargeIds: ids }).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("receiveFms.cancel_cleared_success"));
              this.getList();
            }
            this.loading = false
          });
        })
        .catch(() => { });
    },
    // 生成账单
    createBill(type, goodsList) {
      let selectedRows = [];
      // 通过购物车进行操作的
      if (type === "SELECTED") {
        selectedRows = goodsList;
      } else {
        selectedRows = this.gridApi.getSelectedRows();
      }
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"));
        return;
      }
      let ids = [];
      let settlementCompanyIds = [];
      let businessTypes = [];
      let isHasEntry = false;
      let settlementModeList = [];
      let arr = [];
      let MSG = "";
      selectedRows.forEach(v => {
        if (settlementModeList.indexOf(v.settlementMode) < 0) {
          settlementModeList.push(v.settlementMode);
        }
        if (settlementCompanyIds.indexOf(v.settlementCompanyId) < 0) {
          settlementCompanyIds.push(v.settlementCompanyId);
        }
        if (businessTypes.indexOf(v.businessType) < 0) {
          businessTypes.push(v.businessType);
        }
        // 并且已入账的
        if (v.entryState > 1) {
          isHasEntry = true;
        }
        if (v.businessType === "OVERSEAS_WAREHOUSE" && v.entityType !== 1614) {
          // 目前不支持在结算中心生成账单
          MSG = this.$t("receiveFms.unsupportCreateBill")
        }
        ids.push(v.id);
      });
      if (MSG) {
        this.$message.error(MSG);
        return;
      }
      if (isHasEntry) {
        this.$message.error(this.$t("receiveFms.this_confirm_has_entry"));
        return;
      }
      if (settlementCompanyIds.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_company"));
        return;
      }
      if (businessTypes.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_business_type"));
        return;
      }
      if (settlementModeList.length > 1) {
        this.$message.error(this.$t("receiveFms.need_same_settlement_mode"));
        return;
      }
      this.createBillInfo = {
        ids: ids,
        businessType: businessTypes[0],
        settlementMode: settlementModeList[0],
        settlementCompanyId: settlementCompanyIds[0]
      };
      // 弹出框
      this.$refs.createBillSuccessRef.show();
    }
  }
};
