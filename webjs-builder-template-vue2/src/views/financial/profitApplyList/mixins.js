import { parseTime, formatNumberToThousands } from "@/utils/index";
import { AgGridVue } from "ag-grid-vue";
import OperationBtn from "./operationBtn";
import OrderNo from "./components/OrderNo";
import BatchOperDialog from "./components/BatchOperDialog";
import DownloadFileDialog from "@/views/financial/components/DownloadFileDialog";
import { profitApplySubmitBatchApi, profitApplyRecallBatchApi } from "@/api/financial/fmsProfitApply";
import { profitApplyAuditBatchApi } from "@/api/financial/fmsProfitAudit";

export default {
  components: {
    AgGridVue,
    OperationBtn,
    DownloadFileDialog,
    BatchOperDialog,
    OrderNo
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
        orderNo: '',
        profitApplyNo: '',
        memberId: '',
        memberPrincipalId: '',
        businessType: '',
        businessDatePeriod: [],
        submitDatePeriod: [],
        profitApplyType: ''
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
      if (params.submitDatePeriod.length) {
        params.submitDateBegin = this.formData.submitDatePeriod[0];
        params.submitDateEnd = this.formData.submitDatePeriod[1];
      }

      if (params.businessDatePeriod.length) {
        params.businessDateBegin = this.formData.businessDatePeriod[0];
        params.businessDateEnd = this.formData.businessDatePeriod[1];
      }
      delete params.businessDatePeriod;
      delete params.submitDatePeriod;
      return params
    },
    formDataList(data) {
      data.forEach(v => {
        v.role = this.role;
        v.businessDate = parseTime(v.businessDate, "{y}-{m}-{d} {h}:{i}:{s}");
        v.submitDate = parseTime(v.submitDate, "{y}-{m}-{d} {h}:{i}:{s}");
        v.confirmDate = parseTime(v.confirmDate, "{y}-{m}-{d} {h}:{i}:{s}")

        if (v.totalAmount && v.totalAmount.orderAmount) {
          // 应收合计
          v.totalAmountAr = ''
          v.totalAmount.orderAmount.arTotalAmounts.forEach(xx => {
            v.totalAmountAr += xx.currency + " " + formatNumberToThousands(xx.value) + ' '
          })

          // 应付合计
          v.totalAmountAp = ''
          v.totalAmount.orderAmount.apTotalAmounts.forEach(xx => {
            v.totalAmountAp += xx.currency + " " + formatNumberToThousands(xx.value) + ' '
          })

          // 单票毛利
          v.totalAmountGrossProfit = ''
          v.totalAmount.orderAmount.totalProfitAmounts.forEach(xx => {
            v.totalAmountGrossProfit += xx.currency + " " + formatNumberToThousands(xx.value) + ' '
          })
        }

        if (v.totalAmount && v.totalAmount.historyAmount) {
          // 历史毛利率
          let rate = v.totalAmount.historyAmount.profitRate.rate
          v.historyAmountProfitRate = rate === null ? "-" : (rate * 100).toFixed(2) + '%'
        }

        if (v.totalAmount && v.totalAmount.orderAmount) {
          // 当期毛利率
          let rate = v.totalAmount.orderAmount.profitRate.rate
          v.orderAmountProfitRate = rate === null ? "-" : (rate * 100).toFixed(2) + '%'
        }

        if (v.totalAmount && v.totalAmount.submitAmount) {
          // 变化毛利率
          let rate = v.totalAmount.submitAmount.profitRate.rate
          v.submitAmountProfitRate = rate === null ? "-" : (rate * 100).toFixed(2) + '%'
        }

        if (v.profitApplyState !== 30) {
          v.confirmRemark = ""
        }

      });
      return data
    },
    // 下载文件
    downloadFn(item) {
      this.$refs.downloadFileDialogRef.show(item.id, 'PAYMENT')
    },
    // 查看
    viewFn(row) {
      this.$router.push({
        name: "FmsProfitApplyListDetail",
        query: {
          profitApplyId: row.id,
          origin: this.origin
        }
      });
    },
    // 提交
    submitFn(row) {
      this.$router.push({
        name: "FmsProfitApplyListSubmit",
        query: {
          orderId: row.orderId,
          entityType: row.orderEntityType,
          profitApplyId: row.id,
          origin: this.origin
        }
      });
    },
    auditFn(row) {
      this.$router.push({
        name: "FmsProfitAuditListAudit",
        query: {
          profitApplyId: row.id,
          origin: this.origin
        }
      });
    },
    reset() {
      this.$refs.formData.resetFields();
      this.getList();
    },
    // 批量提交
    batchSubmitFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length <= 0) {
        this.$message.error(this.$t("fmsProfit.pleaseSelectOne"));
        return;
      }
      this.$refs.batchOperDialogRef.show({
        oper: 'fmsProfit.batchSubmit',
        rows: rows,
        api: profitApplySubmitBatchApi
      })
    },
    checkRecallFn(row) {
      // 待审核 审核拒绝
      return row.profitApplyState === 10 || row.profitApplyState === 30
    },
    // 批量撤回
    batchRecallFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length <= 0) {
        this.$message.error(this.$t("fmsProfit.pleaseSelectOne"));
        return;
      }
      let check = true
      rows.forEach(v => {
        if (!this.checkRecallFn(v)) {
          check = false
        }
      })
      if (!check) {
        this.$message.error(this.$t("fmsProfit.batchRecallError"));
        return
      }
      this.$refs.batchOperDialogRef.show({
        oper: 'fmsProfit.batchRecall',
        rows: rows,
        api: profitApplyRecallBatchApi
      })
    },
    checkAgreeFn(row) {
      // 待审核
      return row.profitApplyState === 10
    },
    // 批量同意
    batchAgreeFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length <= 0) {
        this.$message.error(this.$t("fmsProfit.pleaseSelectOne"));
        return;
      }
      let check = true
      let ids = []
      rows.forEach(v => {
        ids.push(v.id)
        if (!this.checkAgreeFn(v)) {
          check = false
        }
      })
      if (!check) {
        this.$message.error(this.$t("fmsProfit.batchAgreeError"));
        return
      }
      this.$refs.profitApplyAuditDialogRef.show(ids)

    },
    submitAuditEmit(profitPeriods) {
      let rows = this.gridApi.getSelectedRows()
      this.$refs.profitApplyAuditDialogRef.hide()
      this.$refs.batchOperDialogRef.show({
        oper: 'fmsProfit.batchAgree',
        rows: rows,
        profitPeriods,
        api: profitApplyAuditBatchApi
      })
    }
  }
};
