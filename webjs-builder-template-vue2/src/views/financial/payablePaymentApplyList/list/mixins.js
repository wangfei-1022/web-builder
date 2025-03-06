import { parseTime, formatNumberToThousands } from "@/utils/index";
import { AgGridVue } from "ag-grid-vue";
import OperationBtn from "../operationBtn";
import DownloadFileDialog from "@/views/financial/components/DownloadFileDialog";
import BatchDownloadFileDialog from "@/views/financial/payablePaymentApplyList/components/BatchDownloadFileDialog";
import { payablePaymentApprovalRecallApi, payablePaymentApprovalUrgingApi, paymentApprovalRepushApi } from "@/api/financial/fmsPayablePayment";

export default {
  components: {
    AgGridVue,
    OperationBtn,
    DownloadFileDialog,
    BatchDownloadFileDialog
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
      formData: {
        localServicePaymentTypes: [],
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
      gridApi: null,
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
      params.api.sizeColumnsToFit();
      this.gridApi = params.api
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });
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
        v.lastApprovalTime = parseTime(v.lastApprovalTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.paymentDueDate = parseTime(v.paymentDueDate, "{y}-{m}-{d}");

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
    // 下载文件
    downloadFn(item) {
      this.$refs.downloadFileDialogRef.show(item.id, 'PAYMENT')
    },
    copyApplyFn(row) {
        if(row.paymentType === 2) {
            this.$router.push({
                name: "FmsPayableApplyPrePayment",
                query: {
                  origin: "FmsPayablePaymentApplyList",
                  paymentType: 2,
                  id: row.id
                }
              });
        } else {
            this.$router.push({
                name: "FmsPayableApplyPayment",
                query: {
                  id: row.id,
                  origin: "PAYMENT_APPLY_COPY",
                  back: "FmsPayablePaymentApplyList"
                }
              });
        }
    },
    // 批量下载文件
    batchDownloadFn() {
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsPayablePayment.pleaseSelectOne'))
        return
      }
      this.$refs.batchDownloadFileDialogRef.show(rows)
    },
    recalForRepushFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length !== 1) {
        this.$message.error(this.$t('fmsPayablePayment.pleaseSelectOne'))
        return
      }
      if (rows[0].paymentState === 20 || rows[0].paymentState === 30) {

      } else {
        this.$message.error(this.$t('fmsPayablePayment.recalForRepushError'))
        return
      }
      let row = rows[0]
      this.$confirm(this.$t('fmsPayablePayment.recalForRepushInfo'), this.$t('fmsPayablePayment.recalForRepush'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        this.loading = true
        paymentApprovalRepushApi({ instructionId: row.id }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsPayablePayment.recalForRepushSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {
        // 取消
      });
    },
    // 查看
    viewFn(item) {
      this.$router.push({
        name: "FmsPayablePaymentApplyDetail",
        query: {
          id: item.id,
          origin: this.origin,
          operation: "DETAIL"
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
    // 撤回
    recallFn(row) {
      this.$confirm(this.$t('fmsPayablePayment.recallInfo'), this.$t('fmsPayablePayment.recall'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        this.loading = true
        payablePaymentApprovalRecallApi({ instructionId: row.id }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsPayablePayment.recallSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {
        // 取消
      });
    },
    // 催办
    urgingFn(row) {
      this.$confirm(this.$t('fmsPayablePayment.urgingInfo'), this.$t('fmsPayablePayment.urging'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        this.loading = true
        payablePaymentApprovalUrgingApi({ instructionId: row.id }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsPayablePayment.urgingSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {
        // 取消
      });
    },
    reset() {
      this.$refs.formData.resetFields();
      this.getList();
    }
  }
};
