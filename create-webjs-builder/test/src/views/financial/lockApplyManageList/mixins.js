
import {
    getFmsOrderLockListApi,
    getFmsOrderLockListAllApi,
    fmsOrderUnlockApi,
    fmsOrderLockApi,
    getOrderLockInfoApi
} from '@/api/financial/fmsLock';
import { parseTime, formatNumberToThousands } from '@/utils/index';
import OperationBtn from './operationBtn';
import BatchLockDialog from './components/BatchLockDialog';

export default {
    name: 'ReceiptClearListUn',
    components: {
        OperationBtn,
        BatchLockDialog
    },
    props: {
        lockOrderState: {
            type: [String, Number],
            default: ''
        },
        origin: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            infoVisible: false,
            infoMsg: '',
            infoData: {},

            activeName: 'first',
            applyPaymentTotal: [],
            unPaymentTotal: [],
            formData: {
                queryType: '1',
                multipleNos: '',
                mainOrderNo: '',
                orderNo: '',
                profitApplyNo: '',
                memberId: '',
                memberPrincipalId: '',
                businessType: '',
                businessDatePeriod: [],
                updateTimePeriod: [],
                unlockOrderTime: [],
                profitApplyType: ''
            },
            pageSize: 50,
            pageNum: 1,
            total: 0,
            dataList: [],
            columnFields: [],
            sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
            gridOptions: {
                rowSelection: 'multiple', // 设置多行可选
                animateRows: true,
                suppressRowClickSelection: true, // 选中单元格后可以复制内容
                context: {
                    componentParent: this
                }
            },
            gridApi: null,
            loading: false,
            columnFields: [
                {
                    field: 'index',
                    headerNameKey: '',
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
                    field: 'orderNo',
                    headerName: this.$t('fmsLock.orderNo'),
                    minWidth: 150
                },
                {
                    field: 'mainOrderNo',
                    headerName: this.$t('fmsLock.MBL'),
                    minWidth: 150
                },
                {
                    field: 'businessTypeName',
                    headerName: this.$t('fmsLock.businessType'),
                    minWidth: 110
                },
                {
                    field: 'memberName',
                    headerName: this.$t('fmsLock.memberName'),
                    minWidth: 180
                },
                {
                    field: 'totalAmountAr',
                    headerName: this.$t('fmsLock.totalAmountAr'),
                    minWidth: 130
                },
                {
                    field: 'totalAmountAp',
                    headerName: this.$t('fmsLock.totalAmountAp'),
                    minWidth: 130
                },
                {
                    field: 'totalAmountGrossProfit',
                    headerName: this.$t('fmsLock.totalAmountGrossProfit'),
                    minWidth: 130
                },
                {
                    field: 'totalAmountGrossProfitStandard',
                    headerName: this.$t('fmsLock.totalAmountGrossProfitStandard'),
                    minWidth: 130
                },
                {
                    field: 'orderAmountProfitRate',
                    headerName: this.$t('fmsLock.orderAmountProfitRate'),
                    minWidth: 150
                },
                {
                    field: 'businessDate',
                    headerName: this.$t('fmsLock.businessDate'),
                    minWidth: 150
                },
                {
                    field: 'unlockOrderTime',
                    headerName: this.$t('fmsLock.unlockOrderTime'),
                    minWidth: 150
                },
                {
                    field: 'lockAdjustTypeName',
                    headerName: this.$t('fmsLock.lockAdjustTypeName'),
                    minWidth: 150
                },
                {
                    field: 'adjustTotalAmountAr',
                    headerName: this.$t('fmsLock.arLastAdjustAmounts'),
                    minWidth: 150
                },
                {
                    field: 'adjustTotalAmountAp',
                    headerName: this.$t('fmsLock.apLastAdjustAmounts'),
                    minWidth: 150
                },
                {
                    field: 'unlockVersion',
                    headerName: this.$t('fmsLock.unlockVersion'),
                    minWidth: 100
                },
                {
                    field: 'createByName',
                    headerName: this.$t('fmsLock.createByName'),
                    minWidth: 100
                },
                {
                    field: 'updateTime',
                    headerName: this.$t('fmsLock.updateTime'),
                    minWidth: 150
                },
                {
                    field: 'lockOrderStateName',
                    headerName: this.$t('fmsLock.lockOrderStateName'),
                    minWidth: 150
                },
                {
                    field: 'operation',
                    headerName: this.$t('fmsLock.operation'),
                    cellRendererFramework: 'OperationBtn',
                    minWidth: 100,
                    pinned: 'right'
                }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        batchUnlockFn() {
            let selectedRows = this.gridApi.getSelectedRows();
            if (selectedRows.length <= 0) {
                this.$message.error(this.$t("fmsLock.please_select_one"));
                return;
            }
            let check = true
            selectedRows.forEach(v => {
                if(v.lockOrderState !== 50) {
                    check = false
                }
            })
            if(!check) {
                this.$message.error(this.$t("fmsLock.please_select_unlock"));
                return
            }
            this.loading = true
            this.$refs.batchLockDialogRef.show(selectedRows, false, () => {
                this.loading = false
            })
        },
        batchLockFn() {
            let selectedRows = this.gridApi.getSelectedRows();
            if (selectedRows.length <= 0) {
                this.$message.error(this.$t("fmsLock.please_select_one"));
                return;
            }
            let check = true
            selectedRows.forEach(v => {
                if(v.lockOrderState !== 40) {
                    check = false
                }
            })
            if(!check) {
                this.$message.error(this.$t("fmsLock.please_select_lock"));
                return
            }
            this.loading = true
            this.$refs.batchLockDialogRef.show(selectedRows, true, () => {
                this.loading = false
            })
        },
        // 一般查询和多单查询
        tabClick() {
            setTimeout(() => {
                if (this.activeName === 'third') {
                    this.$refs.searchFormRef3.triggerResize();
                } else {
                    this.$refs.searchFormRef1.triggerResize();
                }
            }, 0);
        },
        async getList() {
            let params = this.getParams();
            this.loading = true;
            let fn = !!this.lockOrderState ? getFmsOrderLockListApi : getFmsOrderLockListAllApi;
            fn(params).then(res => {
                if (res.ok) {
                    let arr = this.formDataList(res.content.list);
                    this.total = parseInt(res.content.total, 10);
                    this.dataList = arr;
                } else {
                    this.total = 0;
                    this.dataList = [];
                }
                this.loading = false;
            });
        },
        onReady(params) {
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
            window.addEventListener('resize', function () {
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
            if (this.lockOrderState) {
                params.lockOrderState = this.lockOrderState;
            }
            if (this.activeName === 'third') {
                let nos = this.formData.multipleNos ? this.formData.multipleNos.trim() : '';
                if (this.formData.queryType === '1' && nos) {
                    params.orderNos = nos.split(/,|，|\s+/);
                } else if (this.formData.queryType === '2' && nos) {
                    params.mainOrderNos = nos.split(/,|，|\s+/);
                } else {
                    params.orderNos = [];
                }
            } else {
                params = {
                    ...this.formData,
                    ...params
                };
                if (params.updateTimePeriod.length) {
                    params.updateTimeStart = this.formData.updateTimePeriod[0];
                    params.updateTimeEnd = this.formData.updateTimePeriod[1];
                }
                if (params.businessDatePeriod.length) {
                    params.businessDateBegin = this.formData.businessDatePeriod[0];
                    params.businessDateEnd = this.formData.businessDatePeriod[1];
                }
                if (params.unlockOrderTime.length) {
                    params.unlockOrderTimeStart  = this.formData.unlockOrderTime[0];
                    params.unlockOrderTimeEnd = this.formData.unlockOrderTime[1];
                }
                delete params.businessDatePeriod;
                delete params.updateTimePeriod;
                delete params.unlockOrderTime
            }
            return params;
        },
        formDataList(data) {
            data.forEach(v => {
                v.businessDate = parseTime(v.businessDate, '{y}-{m}-{d} {h}:{i}:{s}');
                v.updateTime = parseTime(v.updateTime, '{y}-{m}-{d} {h}:{i}:{s}');
                v.confirmDate = parseTime(v.confirmDate, '{y}-{m}-{d} {h}:{i}:{s}');
                v.unlockOrderTime = parseTime(v.unlockOrderTime, '{y}-{m}-{d} {h}:{i}:{s}');

                if (v.totalAmount && v.totalAmount.orderAmount) {
                    // 应收合计
                    v.totalAmountAr = '';
                    v.totalAmount.orderAmount.arTotalAmounts.forEach(xx => {
                        v.totalAmountAr += xx.currency + ' ' + formatNumberToThousands(xx.value) + ' ';
                    });

                    // 应付合计
                    v.totalAmountAp = '';
                    v.totalAmount.orderAmount.apTotalAmounts.forEach(xx => {
                        v.totalAmountAp += xx.currency + ' ' + formatNumberToThousands(xx.value) + ' ';
                    });

                     // 调整应收合计
                    v.adjustTotalAmountAr = '';
                    v.arLastAdjustAmounts.forEach(xx => {
                        v.adjustTotalAmountAr += xx.currency + ' ' + formatNumberToThousands(xx.value) + ' ';
                    });

                    // 调整应付合计
                    v.adjustTotalAmountAp = '';
                    v.apLastAdjustAmounts.forEach(xx => {
                        v.adjustTotalAmountAp += xx.currency + ' ' + formatNumberToThousands(xx.value) + ' ';
                    });

                    // 单票毛利
                    v.totalAmountGrossProfit = '';
                    v.totalAmount.orderAmount.totalProfitAmounts.forEach(xx => {
                        v.totalAmountGrossProfit += xx.currency + ' ' + formatNumberToThousands(xx.value) + ' ';
                    });

                    // 单票毛利本位币
                    v.totalAmountGrossProfitStandard = '';
                    if (
                        v.totalAmount.orderAmount.profitRate &&
                        v.totalAmount.orderAmount.profitRate.totalProfitAmount
                    ) {
                        let xx = v.totalAmount.orderAmount.profitRate.totalProfitAmount;
                        v.totalAmountGrossProfitStandard += xx.currency + ' ' + formatNumberToThousands(xx.value) + ' ';
                    }
                }

                if (v.totalAmount && v.totalAmount.orderAmount) {
                    // 当期毛利率
                    let rate = v.totalAmount.orderAmount.profitRate.rate;
                    v.orderAmountProfitRate = rate === null ? '-' : (rate * 100).toFixed(2) + '%';
                } else {
                    v.orderAmountProfitRate = '-';
                }

                if (v.profitApplyState !== 30) {
                    v.confirmRemark = '';
                }
            });
            return data;
        },
        // 查看
        viewFn(row) {
            this.$router.push({
                name: 'FmsLockApplyManageListDetail',
                query: {
                    orderId: row.orderId,
                    orderEntityType: row.orderEntityType,
                    origin: this.origin,
                    lockOrderState: row.lockOrderState,
                }
            });
        },
        reset() {
            this.$refs.formDataRef.resetFields()
            this.getList();
        },
        async unlockFn(row) {
            // let data = {
            //     orderId: row.orderId,
            //     orderEntityType: row.orderEntityType,
            //     isLock: false
            // };
            // let res = await getOrderLockInfoApi(data);
            // let msg = '';
            // if (res.ok && res.content && res.content.mainOrderNos && res.content.mainOrderNos.length > 0) {
            //     let MBL = res.content.mainOrderNos.join('\\');
            //     let orderNos = res.content.orderNos.join('\\');
            //     msg = this.$t('fmsLock.unlockInfoOrderMerge', { MBL: MBL, orderNos: orderNos });
            // } else {
            //     msg = this.$t('fmsLock.unlockInfo');
            // }
            // this.infoVisible = true
            // this.infoMsg = msg;
            // this.infoData = data;
            this.loading = true
            this.$refs.batchLockDialogRef.show([row], false, () => {
                this.loading = false
            })
        },
        confirmFn() {
            if (this.infoData.isLock === false) {
                fmsOrderUnlockApi(this.infoData).then(res => {
                    if (res.ok) {
                        this.$message.success(this.$t('fmsLock.unlockSuccess'));
                        this.getList();
                    }
                    this.infoVisible = false
                });
            } else {
                fmsOrderLockApi(this.infoData).then(res => {
                    if (res.ok) {
                        this.$message.success(this.$t('fmsLock.lockSuccess'));
                        this.getList();
                    }
                    this.infoVisible = false
                });
            }
        },
        async lockFn(row) {
            // let data = {
            //     orderId: row.orderId,
            //     orderEntityType: row.orderEntityType,
            //     isLock: true
            // };
            // let res = await getOrderLockInfoApi(data);
            // let msg = '';
            // if (res.ok && res.content && res.content.mainOrderNos && res.content.mainOrderNos.length > 0) {
            //     let MBL = res.content.mainOrderNos.join('\\');
            //     let orderNos = res.content.orderNos.join('\\');
            //     msg = this.$t('fmsLock.lockInfoOrderMerge', { MBL: MBL, orderNos: orderNos });
            // } else {
            //     msg = this.$t('fmsLock.lockInfo');
            // }
            // this.infoVisible = true
            // this.infoMsg = msg;
            // this.infoData = data;
            this.loading = true
            this.$refs.batchLockDialogRef.show([row], true, () => {
                this.loading = false
            })
        }
    }
};