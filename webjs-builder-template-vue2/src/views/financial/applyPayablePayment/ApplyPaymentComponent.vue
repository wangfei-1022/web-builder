<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
      <div class="module" style="padding: 20px;">
        <el-steps :active="active">
          <!--确认付款金额-->
          <el-step :title="$t('fmsPayablePayment.step_1')" :description="$t('fmsPayablePayment.step_1_des')"></el-step>
          <!--确认付款资料-->
          <el-step :title="$t('fmsPayablePayment.step_2')" :description="$t('fmsPayablePayment.step_2_des')"></el-step>
          <!--提交付款申请-->
          <el-step :title="$t('fmsPayablePayment.step_3')" :description="$t('fmsPayablePayment.step_3_des')"></el-step>
        </el-steps>
      </div>

      <div v-show="active === 1">
        <div class="module " style="padding:10px 20px 20px 20px;">
          <div class="blod name">
            <i class="icon iconfont icon-qiye"></i>
            {{$t('fmsPayablePayment.settlement_company_name')}}：{{settlementCompanyName}}
          </div>
          <div style="">
            <el-table ref="chargeTableRef" size="mini" :data="tableData" style="width: 100%;" row-key="id" border>
              <el-table-column prop="billNo" :label="$t('fmsPayablePayment.bill_no')" min-width="150"></el-table-column>
              <el-table-column prop="entityNo" :label="$t('fmsPayablePayment.entity_no')" min-width="150"></el-table-column>
              <el-table-column prop="businessTypeName" :label="$t('fmsPayablePayment.business_type')" min-width="100"></el-table-column>
              <el-table-column prop="feeItemName" :label="$t('fmsPayablePayment.charge_name')" min-width="100"></el-table-column>
              <el-table-column prop="chargeCurrency" :label="$t('fmsPayablePayment.currency')" min-width="80"></el-table-column>
              <el-table-column prop="entryAmount" :label="$t('fmsPayablePayment.amount')" min-width="120">
                <template slot-scope="scope">
                  <div style='text-align: right'>{{scope.row.unInstructionAmount | numberToThousands}}</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="total">
              <span>{{$t('fmsPayablePayment.amountTotal')}}：</span>
              <span>
                <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
                  <span class='value'>{{item.currency}}</span>
                  <span>{{item.value | numberToThousands}}</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!--开票配置-->
      <div v-show="active === 2">
        <apply-payment-config :paymentInfo="paymentInfo" :applyCopyInfo="applyCopyInfo" ref="applyPaymentConfigRef" role="OPERATORS" />
      </div>

      <div v-show="active === 3">
        <!-- 成功的提示信息 -->
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" plain @click="backList()" v-if="active === 1 || active === 2">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="mini" @click="next()" v-if="active === 1">{{$t('common.nextStep')}}</el-button>
      <el-button type="primary" size="mini" @click="pre()" v-if="active === 2">{{$t('common.previousStep')}}</el-button>
      <el-button type="primary" size="mini" @click="submitFn()" v-if="active === 2">{{$t('common.submit')}}</el-button>
    </div>
  </div>

</template>
<script>
import { parseTime, formatNumberToThousands, addFloatNum } from '@/utils/index';
import ApplyPaymentConfig from './components/ApplyPaymentConfig';

export default {
    name: 'ApplyPaymentComponent',
    components: {
        ApplyPaymentConfig
    },
    props: {
        config: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    data() {
        return {
            id: '',
            localServicePaymentType: '',
            isOverSea: false,
            origin: '',
            originName: '',
            active: 1,
            settlementOfficeId: '',
            settlementCompanyId: '',
            settlementCompanyName: '',
            tableData: [],
            loading: false,
            amountTotal: [],
            paymentInfo: {},
            successInfo: {},
            templateList: [],
            paymentType: '',
            clearingInfo: {}, // 付款相关的费用信息
            paymentDetail: {},
            applyCopyInfo: {} // 用作当复制付款申请时的查询统计费用的特殊处理
        };
    },
    created() {
        this.paymentType = this.$route.query.paymentType ? Number(this.$route.query.paymentType) : '';
        this.isOverSea = this.$route.query.isOverSea;
        this.localServicePaymentType = this.$route.query.localServicePaymentType;
        this.origin = this.$route.query.origin;
        this.id = this.$route.query.id;
        this.getChargeList();
    },
    methods: {
        async getChargeList() {
            let fn = this.config.paymentChargeInitFn;
            if (!fn) {
                return;
            }
            let res = null
            let chargeRes = null;
            if(this.origin === 'PAYMENT_APPLY_COPY') {
                res = await fn({ instructionId: this.id})
                if(res.ok) {
                    this.paymentType = res.content.paymentType;
                    this.isOverSea = res.content.isOverSea;
                    this.localServicePaymentType = res.content.localServicePaymentType;
                    chargeRes = res.content.settlementInfoForClearDTO
                    let data = {
                        ...res.content
                    }
                    if(res.content.settlementInfoForClearDTO.bills.length > 0) {
                        let ids = []
                        res.content.settlementInfoForClearDTO.bills.forEach(v => {
                            ids.push(v.id)
                        })
                        this.applyCopyInfo = {
                            origin: 'BILL',
                            ids: ids
                        }
                    } else if(res.content.settlementInfoForClearDTO.charges.length > 0) {
                        let ids = []
                        res.content.settlementInfoForClearDTO.charges.forEach(v => {
                            ids.push(v.chargeKeepId)
                        })
                        this.applyCopyInfo = {
                            origin: 'CHARGE',
                            ids: ids
                        }
                    }
                    delete data.settlementInfoForClearDTO
                    this.paymentDetail = data
                }
                // 重新构造回显选中的银行信息
                if(res.applyPayAmounts && res.applyPayAmounts.length) {
                    chargeRes.unInstructionAmounts.forEach(v => {
                        let index = res.applyPayAmounts.findIndex(item => item.applyCurrency === v.currency);
                        if(index >= 0) {
                            v.bankAccount = res.applyPayAmounts[index].bankAccount
                            v.bankAddress = res.applyPayAmounts[index].bankAddress
                            v.bankBranch = res.applyPayAmounts[index].bankBranch
                            v.bankName = res.applyPayAmounts[index].bankName
                            v.countryCode = res.applyPayAmounts[index].countryCode
                            v.countryName = res.applyPayAmounts[index].countryName
                            v.exchangeRate = res.applyPayAmounts[index].exchangeRate
                            v.swiftCode = res.applyPayAmounts[index].swiftCode
                        }
                    })
                }
            } else {
                res = await fn(this.config.ids)
                chargeRes = res.content
            }
            if (res.ok) {
                this.clearingInfo = chargeRes;
                let arr = [];
                if (chargeRes.bills.length > 0) {
                    chargeRes.bills.forEach(item => {
                        item.clearingCharges.forEach(v => {
                            arr.push(v);
                        });
                    });
                } else if (chargeRes.charges.length > 0) {
                    arr = chargeRes.charges;
                }

                let businessTypeList = [];
                arr.forEach(v => {
                    let index = businessTypeList.findIndex(item => item === v.businessType);
                    if (index < 0) {
                        businessTypeList.push(v.businessType);
                    }
                });
                this.businessTypeList = businessTypeList;
                this.settlementCompanyName = chargeRes.settlementCompanyName;
                this.settlementCompanyId = chargeRes.settlementCompanyId;
                this.settlementOfficeId = chargeRes.settlementOfficeId;
                this.tableData = arr;
                this.amountTotal = chargeRes.unInstructionAmounts;
            }
        },
        pre() {
            this.active = 1;
        },
        next() {
            if (this.tableData.length === 0) {
                // 没有相关的费用，不能进行下一步！
                this.$message.error(this.$t('fmsPayablePayment.nextError'));
                return false;
            }
            this.active = 2;
            this.paymentInfo = {
                id: this.id,
                ids: this.config.ids,
                origin: this.origin,
                businessTypes: this.businessTypeList,
                isOverSea: this.isOverSea,
                settlementCompanyId: this.settlementCompanyId,
                settlementCompanyName: this.settlementCompanyName,
                amountTotal: this.amountTotal,
                paymentType: this.paymentType,
                invoiceMedium: 2, // 默认电票
                ...this.paymentDetail
            };
        },
        // 提交
        submitFn() {
            if (this.$refs.applyPaymentConfigRef.validate()) {
                let data = this.$refs.applyPaymentConfigRef.getValue();
                data.clearingInfo = this.clearingInfo;
                data.settlementOfficeId = this.settlementOfficeId;
                data.localServicePaymentType = this.localServicePaymentType;
                let fn = this.config.submitApi;
                if (!fn) {
                    return;
                }
                this.loading = true;
                fn(data)
                    .then(res => {
                        if (res.ok) {
                            this.successInfo = {
                                ...res.content
                            };
                            this.submitSuccessFn();
                        }
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else {
                // 滚动到 校验未通过的位置
                this.mixinsFormScrollIntoView();
            }
        },
        submitSuccessFn() {
            const h = this.$createElement;
            this.$msgbox({
                title: this.$t('common.mention'),
                message: h('div', { class: 'create-bill' }, [
                    h('i', { class: 'iconfont icon-yanzhengchenggong' }),
                    h('div', { class: 'render' }, this.$t('fmsPayablePayment.submitSuccess')),
                    h('div', { class: 'bill-no-info' }, [
                        h('span', null, this.$t('fmsPayablePayment.applyPaymentNo')),
                        h(
                            'a',
                            { class: 'link', on: { click: this.applyInvoiceDetail } },
                            this.successInfo.instructionNo
                        )
                    ])
                ]),
                showCancelButton: false,
                confirmButtonText: this.$t('common.confirm'),
                beforeClose: (action, instance, done) => {
                    done();
                    this.backList();
                }
            });
        },
        // 开票申请提交之后 可查看申请详情
        applyInvoiceDetail() {
            let id = this.successInfo.id;
            this.$msgbox.close();
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push({
                name: 'FmsPayablePaymentApplyDetail',
                query: {
                    id: id,
                    origin: this.config.backPath
                }
            });
        },
        backList() {
            // 通过配置进行回调的
            if (this.config.backPath) {
                this.$store.dispatch('tagsView/delView', this.$route);
                this.$router.push({ name: this.config.backPath });
            }
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__header {
    background: #fff;
    padding: 0 20px;
}
::v-deep .el-tabs__content {
    padding: 0 20px;
}

::v-deep .el-tabs__item {
    height: 50px;
    line-height: 50px;
}

.total {
    background: rgba(16, 142, 233, 0.1);
    color: #108ee9;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding: 0px 10px;

    .value-item {
        display: inline-block;
        margin-right: 50px;
        .value {
            display: inline-block;
            margin-right: 5px;
        }
    }
}

::v-deep .el-table th {
    background: #f5f7fa;
    height: 50px;
}
.edit-container {
    border: 1px solid #dedede;
}
.tilte-line {
    line-height: 50px;
    height: 50px;
    background: #f5f7fa;
    margin-bottom: 15px;
    border-bottom: 1px solid #dedede;
    border-top: 1px solid #dedede;

    .title-name {
        padding-left: 40px;
    }
}

.module {
    overflow: hidden;
    padding: 20px 0px;
    background: #fff;
    margin-bottom: 20px;
    border-radius: 5px;

    .title {
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #f0f2f5;
        margin-bottom: 15px;
        padding: 0 20px 15px 20px;
    }
    .content {
        padding: 0 25px;
        overflow: hidden;
    }
    .img {
        display: block !important;
        border: 1px dashed #ccc;
        border-radius: 6px;
        width: 300px;
        height: 180px;
        line-height: 180px;
        text-align: center;
        cursor: pointer;
        padding: 0;
        float: left;

        img {
            width: 100%;
            height: 100%;
            -o-object-fit: cover;
            object-fit: cover;
        }
    }
    .item {
        width: 100%;
        float: left;
        display: flex;
        margin-bottom: 10px;
        height: 35px;
        line-height: 35px;

        label {
            width: 130px;
            display: block;
            text-align: right;
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
}

.set-padding {
    padding: 20px;
}

.blod {
    font-weight: 600 !important;
    font-style: normal;
    font-size: 16px !important;
    color: rgba(0, 0, 0, 0.8);
}

.name {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ddd;
}
.icon {
    color: #1890ff;
    font-size: 28px;
    margin-right: 5px;
}
.invoice-radio .el-radio {
    width: 100%;
    height: 36px;
    line-height: 36px;
}
.set-invoice-container {
    width: 250px;
}
.set-blue-color {
    color: #108ee9;
}
.has-select {
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    background: rgba(16, 142, 233, 0.1);
    font-size: 14px;
}

::v-deep .el-step__head.is-success {
    color: #fff;
    border-color: #1890ff;

    .el-step__icon.is-text {
        background: #1890ff;
    }
}
::v-deep .el-step__title.is-success,
::v-deep .el-step__description.is-success {
    color: #1890ff;
}
::v-deep .el-step__head.is-process {
    color: #c0c4cc;
    border-color: #c0c4cc;

    .el-step__icon.is-text {
        color: #c0c4cc;
    }
}
::v-deep .el-step__title.is-process {
    color: #c0c4cc;
}
::v-deep .el-step__description.is-process {
    color: #c0c4cc;
}

.create-bill {
    text-align: center;
    background: #fff;

    i {
        font-size: 40px;
        color: rgb(82, 196, 26);
    }
    .render {
        font-weight: 650;
        font-style: normal;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.847058823529412);
        line-height: 32px;
    }
    .bill-no-info {
        font-weight: 400;
        font-style: normal;
        text-align: center;
        line-height: 22px;
        margin-bottom: 40px;
    }
    .link {
        color: #108ee9;
        text-decoration: underline;
        margin-left: 10px;
    }
}
</style>

