import { parseTime, formatNumberToThousands } from "@/utils/index";
import { AgGridVue } from "ag-grid-vue";
import OperationBtn from "../operationBtn";
import DownloadFileDialog from "@/views/financial/components/DownloadFileDialog";
import PageTotal from '../components/PageTotal'
import { approvalApplyAgreeBatchApi, approvalApplyAgreeBatchV1Api } from "@/api/financial/fmsPayablePayment";

export default {
  components: {
    PageTotal,
    AgGridVue,
    OperationBtn,
    DownloadFileDialog
  },
  props: {
    role: {
      type: String,
      default: ""
    },
    origin: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      applyPaymentTotal: [],
      unPaymentTotal: [],
      applyClearTotal: [],
      unClearTotal: [],
      formData: {
        localServicePaymentTypes: [],
        paymentApplyType: '',
        transactionsNo: '',
        instructionNo: "",
        businessType: "", // 缺一个业务类型
        settlementCompanyId: "",
        paymentDueDatePeriod: [],
        settlementOfficeId: "",
        submitById: "",
        submitDatePeriod: [],
        paymentState: '',
        paymentType: ''
      },
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      columnFields: [],
      sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
      gridOptions: {
        rowSelection: "multiple", // 设置多行可选
        animateRows: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      gridApi: {},
      loading: false
    };
  },
  created() {
    this.getList();
  },
  activated() {
    if (this.$route.query.refresh === true) {
      this.getList()
    }
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api;
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });
    },
    batchAgreeFn() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("fmsPayablePayment.please_select_one"));
        return;
      }
      let ids = []
      let dataV1 = {
        clearInstructionIds: [],
        paymentInstructionIds: []
      }
      let check = true
      selectedRows.forEach(v => {
        // V1 版本的申请
        if (v.workflowType === 10) {
          if (v.paymentApplyType === 3) {
            dataV1.clearInstructionIds.push(v.id)
          } else {
            dataV1.paymentInstructionIds.push(v.id)
          }
        } else {
          ids.push(v.id)
        }
        if (v.approvalType !== 50) {
          check = false
        }
      })
      if (!check) {
        this.$message.error(this.$t("fmsPayablePayment.batchAgreeError"));
        return;
      }
      const len = ids.length + dataV1.clearInstructionIds.length + dataV1.paymentInstructionIds.length
      this.$refs.batchOperDialogRef.show({
				oper: 'fmsPayablePayment.batchAgree',
				rows: selectedRows,
			})
      
      // this.$confirm(this.$t("fmsPayablePayment.batchAgreeInfo", { count: len }), this.$t("common.mention"), {
      //   confirmButtonText: this.$t("common.confirm"),
      //   cancelButtonText: this.$t("common.cancel"),
      //   type: "warning"
      // }).then(() => {
      //   this.loading = true;
      //   Promise.all([
      //     ids.length > 0 ? approvalApplyAgreeBatchApi({ applyIds: ids }) : null,
      //     dataV1.clearInstructionIds.length > 0 || dataV1.paymentInstructionIds.length > 0 ? approvalApplyAgreeBatchV1Api(dataV1) : null,
      //   ]).then(values => {
      //     let v0Res = values[0]
      //     let v1Res = values[1]
      //     let countMap = {
      //       sc: 0,
      //       fc: 0
      //     }
      //     if (v0Res && v0Res.ok) {
      //       countMap = {
      //         sc: v0Res.content.agreeResults.length,
      //         fc: v0Res.content.failApplyIds.length
      //       }
      //     } else {
      //       countMap = {
      //         sc: 0,
      //         fc: ids.length
      //       }
      //     }
      //     if (v1Res && v1Res.ok) {
      //       countMap = {
      //         sc: countMap.sc + v1Res.content.successInstructionIds.length,
      //         fc: countMap.fc + v1Res.content.failInstructionIds.length
      //       }
      //     } else {
      //       countMap = {
      //         sc: countMap.sc + 0,
      //         fc: countMap.fc + dataV1.clearInstructionIds.length + dataV1.paymentInstructionIds.length
      //       }
      //     }
      //     this.$alert(this.$t('fmsPayablePayment.batchAgreeResInfo', countMap), {
      //       confirmButtonText: this.$t('common.confirm')
      //     })
      //     this.getList()
      //     this.loading = false;
      //   })
      // }).catch(() => { });
    },
    getParams() {
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      if (params.paymentDueDatePeriod.length) {
        params.paymentDueDateStart = this.formData.paymentDueDatePeriod[0];
        params.paymentDueDateEnd = this.formData.paymentDueDatePeriod[1];
      }

      if (params.submitDatePeriod.length) {
        params.submitDateStart = this.formData.submitDatePeriod[0];
        params.submitDateEnd = this.formData.submitDatePeriod[1];
      }
      delete params.submitDatePeriod;
      delete params.paymentDapaymentDueDatePeriodtePeriod;
      return params
    },
    formDataList(data) {
      data.forEach(v => {
        v.role = this.role;
        v.submitDate = parseTime(v.submitDate, "{y}-{m}-{d} {h}:{i}:{s}");
        v.paymentDueDate = parseTime(v.paymentDueDate, "{y}-{m}-{d}");
        v.settlementHandlerApprovalDate = parseTime(v.settlementHandlerApprovalDate, "{y}-{m}-{d}");

        v.applyCurrencyAmountGroupStr = ''
        v.chargeTotalAmounts.forEach(xx => {
          v.applyCurrencyAmountGroupStr += xx.sourceCurrency + formatNumberToThousands(xx.sourceValue) + ' '
        })

        v.unpayCurrencyAmountGroupStr = ''
        v.unClearTotalAmounts.forEach(xx => {
          v.unpayCurrencyAmountGroupStr += xx.currency + formatNumberToThousands(xx.value) + ' '
        })

        v.payCurrencyAmountGroupStr = ''
        v.clearTotalAmounts.forEach(xx => {
          v.payCurrencyAmountGroupStr += xx.currency + formatNumberToThousands(xx.value) + ' '
        })

        if (v.currentApprovalLog && v.currentApprovalLog.nextApprovalUsers) {
          let nextApprovalUser = []
          v.currentApprovalLog.nextApprovalUsers.forEach(v => {
            nextApprovalUser.push(v.userName)
          })
          v.currentApprovalLog.nextApprovalUser = nextApprovalUser.join(',')
        }
      });
      return data
    },
    formatTotalRes(res) {
      res.content.forEach(v => {
        if (v.amountName === 'applyPayAmount') {
          this.applyPaymentTotal = v.amounts
        }
        if (v.amountName === 'unPayAmount') {
          this.unPaymentTotal = v.amounts
        }
        if (v.amountName === 'applyClearAmount') {
          this.applyClearTotal = v.amounts
        }
        if (v.amountName === 'unClearAmount') {
          this.unClearTotal = v.amounts
        }
      })
    },
    // 下载文件
    downloadFn(item) {
      this.$refs.downloadFileDialogRef.show(item.id, 'PAYMENT')
    },
    // 审批
    approvalFn(item) {
      // （1付款和2预付 3核销）
      let name = item.paymentApplyType === 3 ? "FmsPayableClearDetail" : "FmsPayablePaymentApplyDetail"
      this.$router.push({
        name: name,
        query: {
          id: item.id,
          origin: this.origin,
          operation: "APPROVAL"
        }
      });
    },
    // 查看
    viewFn(item) {
      let name = item.paymentApplyType === 3 ? "FmsPayableClearDetail" : "FmsPayablePaymentApplyDetail"
      this.$router.push({
        name: name,
        query: {
          id: item.id,
          origin: this.origin,
          operation: "APPROVAL"
        }
      });
    },
    // 付款
    payFn(item) {
      this.$router.push({
        name: "FmsPayablePaymentApplyDetail",
        query: {
          id: item.id,
          origin: this.origin,
          operation: "PAY"
        }
      });
    },
    reset() {
      this.$refs.formData.resetFields();
      this.getList();
    }
  }
};
