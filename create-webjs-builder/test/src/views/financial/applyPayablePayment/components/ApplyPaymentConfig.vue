<template>
  <div class="apply-invoice-config">
    <div class="info-section-module edit-container">
      <div class="info-title">
        <span>
          <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
          <!--申请付款信息-->
          {{$t('fmsPayablePayment.applyPaymentInfo')}}
        </span>
      </div>
      <div class="info-content">
        <PayableOrderChargeTotal :origin="paymentInfo.origin" :ids="paymentInfo.ids" v-if="paymentInfo.ids && paymentInfo.ids.length" :applyCopyInfo="applyCopyInfo" />
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" size="mini" label-position="right" style="padding: 20px;padding-right: 70px;">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('fmsPayablePayment.paymentType')" prop="paymentType">
                <fms-select v-model="form.paymentType" type="paymentType" size="mini" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('fmsPayablePayment.settlementCompanyName')" prop="settlementCompanyName">
                <el-input v-model="form.settlementCompanyName" size="mini" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="$t('fmsPayablePayment.registerAddress')" prop="registerAddress">
            <!-- ESIT-20920 -->
            <el-input :value="(form.isOverSea && form.countryCode ? form.countryCode + '，' : '') + form.registerAddress" size="mini" disabled />
          </el-form-item>

          <pay-amount ref="payAmountRef" :isOverSea="form.isOverSea" :amountTotal="amountTotal" :bankAccountList="bankAccountList" :paymentInfo="paymentInfo"
                      :settlementCompanyId="form.settlementCompanyId" @payAmountChange="payAmountChange" />

          <el-row v-if="form.isOverSea">
            <el-col :span="12">
              <el-form-item :label="$t('fmsPayablePayment.contact')" prop="contact">
                <el-input v-model="form.contact" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('fmsPayablePayment.tel')" prop="tel">
                <el-input v-model="form.tel" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="$t('fmsPayablePayment.paymentDesc')" prop="paymentDesc">
            <el-input v-model="form.paymentDesc" size="mini" type="textarea" :placeholder="$t('fmsPayablePayment.paymentDescInfo')" :rows="3" />
          </el-form-item>
          <div class="mention-info">{{$t('fmsPayablePayment.paymentDescInfo1')}}</div>

          <div style="border-bottom: 1px dashed #aaa;margin: 30px;"></div>

          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('fmsPayablePayment.businessTypes')" prop="businessTypes">
                <base-select v-model="form.businessTypes" type="businessType" multiple />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('fmsPayablePayment.paymentDueDate')" prop="paymentDueDate">
                <common-picker v-model="form.paymentDueDate" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="$t('fmsPayablePayment.costDepartment')" prop="costDepartmentId" v-if="false">
            <base-select v-model="form.costDepartmentId" type="department" />
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.commissionMode')" prop="commissionMode" v-if="form.isOverSea">
            <el-radio-group v-model="form.commissionMode">
              <el-radio v-for="item in commissionModeList" :label="item.code" :key="item.code">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.commissionFiles')" prop="commissionFiles" v-if="form.commissionMode === 2">
            <upload-file v-model="form.commissionFiles" multiple :limit="1" accept=".png,.jpg" drag style="width: 330px;">
              <template slot="prompt">
                <div style="color: red;">{{$t('fmsPayablePayment.commissionFilesInfo')}}</div>
              </template>
            </upload-file>
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.invoiceMedium')" prop="invoiceMedium">
            <el-radio-group v-model="form.invoiceMedium">
              <el-radio v-for="item in invoiceMaterialTypeList" :label="item.code" :key="item.code">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.invoiceFiles')" prop="invoiceFiles" :rules='[{ required: form.invoiceFilesCheck, message: this.$t("common.can_not_be_null"), trigger: "blur" }]'>
            <invoice-files ref="invoiceFilesRef" :applyPayAmounts="applyPayAmounts" :check="form.invoiceFilesCheck" />
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.billFiles')" prop="billFiles" v-if="form.paymentType === 1">
            <upload-file v-model="form.billFiles" multiple accept=".pdf" drag style="width: 330px;">
              <template slot="prompt">
                <div style="color: red;">{{$t('fmsPayablePayment.billFilesInfo')}}</div>
              </template>
            </upload-file>
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.otherFiles')" prop="otherFiles">
            <upload-file v-model="form.otherFiles" multiple accept=".xls,.xlsx,.doc,.docx,.pdf,.jpg,.png" drag style="width: 330px;"></upload-file>
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.otherRemark')" prop="remark">
            <el-input v-model="form.remark" size="mini" type="textarea" :rows="3" />
          </el-form-item>
          <div class="mention-info">{{$t('fmsPayablePayment.otherRemarkInfo')}}</div>

          <div style="padding-left: 130px;">
            <!-- 付款通知书 -->
            <el-checkbox :value="true" v-if="form.paymentType === 1">{{$t('fmsPayablePayment.paymentNotifyBo')}}</el-checkbox>
            <!-- 付款报告 -->
            <el-checkbox :value="true">{{$t('fmsPayablePayment.paymentReport')}}</el-checkbox>
          </div>
          <div style="padding-left: 130px;margin: 8px 0;">
            <!-- 财务回传水单后直接发送到供应商指定邮箱 -->
            <el-checkbox v-model="form.paymentMemoSubscriberFlag">{{$t('fmsPayablePayment.paymentMemoSubscriberFlag')}}</el-checkbox>
          </div>

          <el-form-item :label="$t('fmsPayablePayment.memoEmailSubscribers')" prop="memoEmailSubscribers" v-if="form.paymentMemoSubscriberFlag">
            <send-batch-email-select type="PAYMENT" size="mini" v-model="form.memoEmailSubscribers" :placeholder='$t("fmsPayablePayment.receiveEmailsPlaceholder")'
                                     :settlementId="form.settlementCompanyId" />
          </el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.memoEmailSubscriberRemark')" prop="memoEmailSubscriberRemark" v-if="form.paymentMemoSubscriberFlag">
            <el-input v-model="form.memoEmailSubscriberRemark" size="mini" type="textarea" :rows="3" />
          </el-form-item>

        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getDictDataApi } from '@/api/financial/base';
import {
    getMemberBankInfoApi,
    getMemberContactApi,
    getPaymentMemonotifyEmailApi
} from '@/api/financial/fmsPayablePayment';
import { validateEmail } from '@/utils/validate';
import PayAmount from './PayAmount';
import InvoiceFiles from './InvoiceFiles';
import SendBatchEmailSelect from '@/views/financial/components/SendBatchEmailSelect';
import PayableOrderChargeTotal from '@/views/financial/components/PayableOrderChargeTotal';

export default {
    name: 'ApplyPaymentConfig',
    components: {
        PayAmount,
        InvoiceFiles,
        SendBatchEmailSelect,
        PayableOrderChargeTotal
    },
    props: {
        paymentInfo: {
            type: Object,
            default: function () {
                return {};
            }
        },
        applyCopyInfo: {
            type: Object,
            default: function () {
                return {};
            }
        },
        type: {
            type: String,
            default: ''
        }
    },
    watch: {
        paymentInfo: {
            async handler(val) {
                if (val && val.settlementCompanyId) {
                   const bankRes = await getMemberBankInfoApi(val.settlementCompanyId)
                    if (bankRes.ok) {
                        this.bankAccountList = bankRes.content.bankAccounts;
                        this.form.countryCode = bankRes.content.countryCode || '';
                        this.form.countryName = bankRes.content.countryName || '';
                        this.form.registerAddress = bankRes.content.address;
                    }
                }
                if (val.copyInfo) {
                    this.copyInfo = copyInfo;
                }
                this.form = {
                    ...this.form,
                    ...val
                };
                if (val.isOverSea === 'false') {
                    this.form.isOverSea = false;
                } else if (val.isOverSea === 'true') {
                    this.form.isOverSea = true;
                } else {
                    this.form.isOverSea = val.isOverSea;
                }
                this.amountTotal = val.amountTotal || [];

                if (val.fileInfoWithCurrencyDTOS && val.fileInfoWithCurrencyDTOS.length > 0) {
                    val.amountTotal.forEach((v, xx) => {
                        let index = val.fileInfoWithCurrencyDTOS.findIndex(item => item.currencyCode === v.currency);
                        if (index >= 0) {
                            v.files = val.fileInfoWithCurrencyDTOS[index].files;
                        }
                    });
                }
                if (val.applyPayAmounts && val.applyPayAmounts.length > 0) {
                    val.amountTotal.forEach((v, xx) => {
                        let index = val.applyPayAmounts.findIndex(item => item.currency === v.currency);
                        if (index >= 0) {
                            v.bankAccount = val.applyPayAmounts[index].bankAccount;
                            v.bankAddress = val.applyPayAmounts[index].bankAddress;
                            v.bankBranch = val.applyPayAmounts[index].bankBranch;
                            v.bankName = val.applyPayAmounts[index].bankName;
                            v.countryCode = val.applyPayAmounts[index].countryCode;
                            v.countryName = val.applyPayAmounts[index].countryName;
                            v.swiftCode = val.applyPayAmounts[index].swiftCode;
                            v.key = val.applyPayAmounts[index].key;
                        }
                    });
                }
                this.applyPayAmounts = val.amountTotal || [];
                
                if (val && val.isOverSea) {
                    getMemberContactApi(val.settlementCompanyId).then(res => {
                        if (res.ok && res.content) {
                            this.form.tel = res.content.tel;
                            this.form.contact = res.content.contact;
                        }
                    });
                }
                let flag = !(this.form.paymentType === 2 && !this.form.isOverSea);
                this.formRules.invoiceMedium = [
                    { required: flag, message: this.$t('common.can_not_be_null'), trigger: 'blur' }
                ];
            },
            deep: true,
            immediate: true
        },
        'form.invoiceMedium': {
            handler(val) {
                let flag = false;
                if (this.form.paymentType === 2) {
                    if (this.form.isOverSea) {
                        flag = true;
                    }
                } else {
                    flag = val === 2;
                }
                this.form.invoiceFilesCheck = flag;
                this.form.invoiceFiles = [{}];
            }
        }
    },
    data() {
        const validateEmailFn = (rule, value, callback) => {
            if (this.form.no) {
                callback();
                return;
            }
            if (value) {
                if (validateEmail(value)) {
                    callback();
                } else {
                    return callback(this.$t('fmsPayablePayment.emailError'));
                }
            } else {
                callback();
            }
        };
        return {
            bankAccountList: [],
            invoiceMaterialTypeList: [],
            commissionModeList: [],
            id: '',
            loading: false,
            amountTotal: [],
            applyPayAmounts: [], // 用作上传文件的时候显示用 不与amountTotal混合是因为不想触发
            form: {
                paymentType: '', // 付款类型
                settlementCompanyId: '', // 收款单位
                settlementCompanyName: '', // 收款单位
                registerAddress: '', // 公司注册地址
                paymentDesc: '', // 付款说明
                contact: '', // 联系人
                tel: '', // 联系电话
                businessTypes: [], // 业务类型
                paymentDueDate: '', // 付款期限
                costDepartmentId: '', // 部门
                commissionMode: '', // 手续费承担模式
                commissionFiles: [], // 我司全额承担证明
                invoiceMedium: '', // 发票材质
                invoiceFiles: [], // 上传发票
                invoiceFilesCheck: false,
                billFiles: [], // 账单文件
                otherFiles: [], // 其他文件
                remark: '', // 其他备注
                paymentMemoSubscriberFlag: false,
                memoEmailSubscriberRemark: '', // 邮件备注
                memoEmailSubscribers: ''
            },
            formRules: {
                settlementCompanyName: [
                    { required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }
                ],
                registerAddress: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                paymentDesc: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                businessTypes: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                contact: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                tel: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                paymentDueDate: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                commissionMode: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                commissionFiles: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                billFiles: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }],
                memoEmailSubscribers: [
                    { required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' },
                    { validator: validateEmailFn, trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.init();
    },
    methods: {
        payAmountChange() {
            if (this.$refs.payAmountRef) {
                let applyPayAmounts = this.$refs.payAmountRef.getValue();
                if (this.form.fileInfoWithCurrencyDTOS && this.form.fileInfoWithCurrencyDTOS.length > 0) {
                    applyPayAmounts.forEach((v, xx) => {
                        let index = this.form.fileInfoWithCurrencyDTOS.findIndex(
                            item => item.currencyCode === v.currency
                        );
                        if (index >= 0) {
                            applyPayAmounts[xx].files = this.form.fileInfoWithCurrencyDTOS[index].files;
                        }
                    });
                }
                this.applyPayAmounts = applyPayAmounts;
            }
        },
        init() {
            Promise.all([getDictDataApi(39), getDictDataApi(13)]).then(results => {
                const commissionModeRes = results[0];
                const invoiceMaterialTypeRes = results[1];

                if (commissionModeRes.ok) {
                    this.commissionModeList = commissionModeRes.content;
                }
                if (invoiceMaterialTypeRes.ok) {
                    let arr = [];
                    invoiceMaterialTypeRes.content.forEach(v => {
                        if (v.code !== 3) {
                            arr.push(v);
                        }
                    });
                    this.invoiceMaterialTypeList = arr;
                }
            });
        },
        show() {
            this.visible = true;
        },
        validate() {
            let VALID = true;
            this.$refs.formRef.validate(valid => {
                VALID = valid;
            });
            if (!VALID) {
                return false;
            }
            if (!this.form.registerAddress) {
                // 公司注册地址信息不全，请先补充基础数据。
                this.$message.error(this.$t('fmsPayablePayment.registerAddressError1'));
                return false;
            }
            if (this.$refs.payAmountRef && !this.$refs.payAmountRef.validate()) {
                return false;
            }
            if (this.$refs.invoiceFilesRef && !this.$refs.invoiceFilesRef.validate()) {
                return false;
            }
            return true;
        },
        getValue() {
            let data = {
                ...this.form
            };
            if (this.$refs.payAmountRef) {
                // 申请金额信息
                data.applyPayAmounts = this.$refs.payAmountRef.getValue();
                delete data.amountTotal;
            }
            if (this.$refs.invoiceFilesRef) {
                // 上传发票文件
                data.fileInfoWithCurrencyDTOS = this.$refs.invoiceFilesRef.getValue();
                delete data.invoiceFiles;
            }
            if (!data.paymentMemoSubscriberFlag) {
                data.memoEmailSubscriberRemark = '';
                data.memoEmailSubscribers = '';
            }
            return data;
        }
    }
};
</script>
<style lang="scss" scoped>
.apply-invoice-config {
    .edit-container {
        font-size: 15px;
    }
}

.mention-info {
    padding-left: 120px;
    font-size: 13px;
    color: red;
    margin-bottom: 8px;
}
</style>

