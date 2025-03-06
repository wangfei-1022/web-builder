<template>
  <div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="activeName" @tab-click="tabClick" class="top-tabs">
      <el-tab-pane :label='$t("receiveFms.nomarlSearch")' name="first"></el-tab-pane>
      <el-tab-pane :label='$t("receiveFms.moreNoSearch")' name="third"></el-tab-pane>
    </el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="resetFn" ref="searchFormRef1" v-show="activeName === 'first'">
      <!--普通搜索-较少的查询条件-->
      <el-form slot="singleSearch" ref="formDataRef1" :inline="true" :model="formData" label-width="115px" size="mini" class="fms-search-form">
        <div>
          <el-form-item :label='$t("receiveFms.entity_no")' prop="entityNo">
            <el-input v-model="formData.entityNo" type="text" size="mini" clearable />
          </el-form-item>
          <el-form-item :label='$t("receiveFms.business_no")' prop="extendInfo11">
            <el-input v-model="formData.extendInfo11" type="text" size="mini" clearable />
          </el-form-item>
          <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyName">
            <type-select v-model="formData.settlementCompanyName" type="settlementCompany" @selected="settlementCompanyChange" />
          </el-form-item>
          <el-form-item :label="$t('receiveFms.business_type')" prop="businessTypeList">
            <base-select v-model="formData.businessTypeList" type="businessType" collapse-tags @change="businessTypeChange" multiple></base-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.entityTypeName')" prop="entityTypeList" v-if="formData.businessTypeList.length">
            <el-select v-model="formData.entityTypeList" size="mini" multiple collapse-tags>
              <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.settlement_mode')" prop="settlementMode">
            <base-select v-model="formData.settlementMode" type="settlementMode" addAll></base-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.bill_status')" prop="entryStates">
            <fms-select v-model="formData.entryStates" type="entryState" multiple collapse-tags></fms-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.invoice_apply_state_name')" prop="invoiceApplyState" v-if="type === 'AR'">
            <fms-select v-model="formData.invoiceApplyState" type="invoiceApplyState" addAll></fms-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.apply_clear_status')" prop="instructionState" v-if="type === 'AR'">
            <fms-select v-model="formData.instructionState" type="applyClearState" addAll></fms-select>
          </el-form-item>
          <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="multipleInstructionState" v-if="type === 'AP'">
            <fms-select v-model="formData.multipleInstructionState" type="applyClearState" multiple collapse-tags></fms-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.clear_status')" prop="multipleClearState" class="multipleClearState">
            <fms-select v-model="formData.multipleClearState" type="clearState" multiple></fms-select>
          </el-form-item>
          <el-form-item :label="$t('receiveFms.business_date')" prop="periodBusiness">
            <search-date-picker v-model="formData.periodBusiness" clearable></search-date-picker>
          </el-form-item>
        </div>
      </el-form>

      <!--普通搜索-更多的查询条件-->
      <el-form slot="multipleSearch" ref="formDataRef2" :inline="true" :model="formData" label-width="115px" size="mini" class="fms-search-form">
        <el-form-item :label='$t("receiveFms.entity_no")' prop="entityNo">
          <el-input v-model="formData.entityNo" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.business_no")' prop="extendInfo11">
          <el-input v-model="formData.extendInfo11" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.bill_no")' prop="billNo">
          <el-input v-model="formData.billNo" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.invoiceNo")' prop="invoiceNo" v-if="type === 'AR'">
          <el-input v-model="formData.invoiceNo" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.MBL")' prop="extendInfo13">
          <el-input v-model="formData.extendInfo13" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.HBL")' prop="extendInfo14">
          <el-input v-model="formData.extendInfo14" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.confirmation_no")' prop="confirmationNo">
          <el-input v-model="formData.confirmationNo" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.channelOrderNo")' prop="channelOrderNo" v-if="type === 'AR'">
          <el-input v-model="formData.channelOrderNo" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.customerBL")' prop="customerBillNo">
          <el-input v-model="formData.customerBillNo" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.business_type')" prop="businessTypeList">
          <base-select v-model="formData.businessTypeList" type="businessType" collapse-tags @selected="businessTypeChange" multiple></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.entityTypeName')" prop="entityTypeList" v-if="formData.businessTypeList.length">
          <el-select v-model="formData.entityTypeList" size="mini" multiple collapse-tags>
            <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyName">
          <type-select v-model="formData.settlementCompanyName" type="settlementCompany" @selected="settlementCompanyChange" />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.settlement_mode')" prop="settlementMode">
          <base-select v-model="formData.settlementMode" type="settlementMode" addAll></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.sales_names')" prop="responsiblePersonId">
          <base-select v-model="formData.responsiblePersonId" type="sale" filterable clearable></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.charge_name')" prop="feeItemCode">
          <type-select v-model="formData.feeItemCode" type="fmsFee" :tips='false' />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.settlement_office_name')" prop="settlementOfficeId">
          <base-select v-model="formData.settlementOfficeId" type="settlementOffice" addAll></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.bill_status')" prop="entryStates">
          <fms-select v-model="formData.entryStates" type="entryState" multiple collapse-tags />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.invoice_status')" prop="invoiceState" v-if="type === 'AR'">
          <fms-select v-model="formData.invoiceState" type="invoiceState" addAll></fms-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.profit_state')" prop="profitState">
          <fms-select v-model="formData.profitState" type="profitState" addAll />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.invoice_apply_state_name')" prop="invoiceApplyState" v-if="type === 'AR'">
          <fms-select v-model="formData.invoiceApplyState" type="invoiceApplyState" addAll></fms-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.tax_rate')" prop="invoiceTaxRate">
          <fms-select v-model="formData.invoiceTaxRate" type="invoiceTaxRate" addAll />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.currency')" prop="currency">
          <base-select v-model="formData.currency" type="currency" addAll></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.apply_clear_status')" prop="instructionState" v-if="type === 'AR'">
          <fms-select v-model="formData.instructionState" type="applyClearState" addAll></fms-select>
        </el-form-item>
        <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="multipleInstructionState" v-if="type === 'AP'">
          <fms-select v-model="formData.multipleInstructionState" type="applyClearState" multiple collapse-tags></fms-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.verification_status')" prop="multipleClearState" class="multipleClearState">
          <fms-select v-model="formData.multipleClearState" type="clearState" multiple collapse-tags></fms-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.memberLocalName')" prop="memberId">
          <type-select :value="formData.memberId" type="customer" :defaultDisplay="[{id: formData.memberId, chineseName: formData.memberName }]" @selected="memberCustomerChange">
          </type-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.businessTag')" prop="businessTagTypes">
          <el-select v-model="formData.businessTagTypes" size="mini" collapse-tags multiple>
            <el-option v-for="item in businessTagCodeList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.profit_and_loss_period')" prop="profitPeriod">
          <el-date-picker v-model="formData.profitPeriod" type="month" value-format="yyyyMM"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.business_date')" prop="periodBusiness">
          <search-date-picker v-model="formData.periodBusiness" clearable></search-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.entry_date_estimate')" prop="periodEntry">
          <search-date-picker v-model="formData.periodEntry" clearable></search-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.submit_time')" prop="periodConfirmTime">
          <search-date-picker v-model="formData.periodConfirmTime" clearable></search-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.receipt_pay_date')" prop="periodLastReceiptPayDate">
          <search-date-picker v-model="formData.periodLastReceiptPayDate" clearable></search-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.clear_date')" prop="periodLastClearDate">
          <search-date-picker v-model="formData.periodLastClearDate" clearable></search-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.profit_date')" prop="profitAuditDatePeriod">
          <search-date-picker v-model="formData.profitAuditDatePeriod" clearable></search-date-picker>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.eta')" prop="etaPeriod">
          <search-date-picker v-model="formData.etaPeriod" clearable></search-date-picker>
        </el-form-item>
      </el-form>
    </top-search-items-slot>

    <top-search-items-slot :searchFun="getList" :resetFun="resetFn" ref="searchFormRef3" v-show="activeName === 'third'">
      <!--多单号搜索-->
      <el-form slot="singleSearch" ref="formDataRef3" class="multipleNoSearch fms-search-form" :inline="true" :model="formData" label-width="115px" size="mini">
        <el-form-item label="" prop="multipleNos" class='multiple-no-item'>
          <template slot="label">
            <el-select v-model="formData.queryType" style="width: 115px;">
              <el-option :label="$t('receiveFms.business_no')" value="1" />
              <el-option :label="$t('receiveFms.MBL')" value="2" />
              <el-option :label="$t('receiveFms.charge_no')" value="3" />
              <el-option :label="$t('receiveFms.entity_no')" value="4" v-if="type === 'AR'" />
              <el-option :label="$t('receiveFms.channelOrderNo')" value="5" v-if="type === 'AR'" />
              <el-option :label="$t('receiveFms.HBL')" value="6" />
              <el-option :label="$t('receiveFms.customerBL')" value="7" />
            </el-select>
          </template>
          <el-input v-model="formData.multipleNos" type="textarea" rows="3" resize="none" clearable :placeholder="$t('receiveFms.multipleNosInfo')" />
        </el-form-item>

        <div style="clear:both;"></div>
        <el-form-item :label="$t('receiveFms.settlement_company_name')" prop="settlementCompanyName">
          <type-select v-model="formData.settlementCompanyName" type="settlementCompany" @selected="settlementCompanyChange" />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.currency')" prop="currency">
          <base-select v-model="formData.currency" type="currency" addAll></base-select>
        </el-form-item>
        <el-form-item :label="$t('receiveFms.bill_status')" prop="entryStates">
          <fms-select v-model="formData.entryStates" type="entryState" multiple collapse-tags />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.verification_status')" prop="multipleClearState" class="multipleClearState">
          <fms-select v-model="formData.multipleClearState" type="clearState" multiple collapse-tags />
        </el-form-item>
        <el-form-item :label="$t('receiveFms.memberLocalName')" prop="memberId">
          <type-select :value="formData.memberId" type="customer" :defaultDisplay="[{id: formData.memberId, chineseName: formData.memberName }]" @selected="memberCustomerChange"></type-select>
        </el-form-item>
        <el-form-item :label="$t('payableFms.instructionStateNamePayable')" prop="multipleInstructionState" v-if="type === 'AP'">
          <fms-select v-model="formData.multipleInstructionState" type="applyClearState" multiple collapse-tags></fms-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>

    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button size="mini" type="primary" @click="allAddGoods()" v-permission="['fms:receive:charge:allin', 'fms:payable:charge:allin']">{{$t('receiveFms.all_in')}}</el-button>
        <el-button size="mini" type="primary" @click="selectAddGoods()" v-permission="['fms:receive:charge:selectin', 'fms:payable:charge:selectin']">{{$t('receiveFms.select_in')}}</el-button>
        <el-button size="mini" type="primary" @click="createBill()" v-permission="['fms:receive:charge:create:bill', 'fms:payable:charge:create:bill']">{{$t('receiveFms.create_bill')}}</el-button>
        <el-button size="mini" type="primary" @click="receiveInvoice()" v-if="type === 'AR' && false">{{$t('receiveFms.receive_invoice')}}</el-button>
        <el-button size="mini" type="primary" @click="receiveCleared()" v-permission="['fms:payable:charge:clear']" v-if="type === 'AP'">{{$t('receiveFms.receive_cleared')}}</el-button>
        <el-button size="mini" type="primary" @click="receiveCancelCleared()" v-permission="['fms:payable:charge:revert:clear']"
                   v-if="type === 'AP'">{{$t('receiveFms.receive_cancel_cleared')}}</el-button>
        <el-button size="mini" type="primary" @click="applyPayment()" v-permission="['fms:payable:charge:apply:pay']" v-if="type === 'AP'">{{$t('receiveFms.applyPayment')}}</el-button>
        <el-button size="mini" type="primary" @click="profitLoss()"
                   v-permission="['fms:receive:charge:profit:audit', 'fms:payable:charge:profit:audit']">{{$t('receiveFms.profit_and_loss_audit')}}</el-button>
        <!--移出账单-->
        <el-button size="mini" type="primary" @click="removeChargeFromBill()"
                   v-permission="['fms:receive:charge:remove:bill', 'fms:payable:charge:remove:bill']">{{$t('receiveFms.removeBill')}}</el-button>
        <!--加入账单-->
        <el-button size="mini" type="primary" @click="joinChargeToBill()" v-permission="['fms:receive:charge:join:bill', 'fms:payable:charge:join:bill']">{{$t('receiveFms.join_bill')}}</el-button>
        <!--申请开票-->
        <el-button size="mini" type="primary" @click="applyInvoice()" v-permission="['fms:receive:charge:appoint:invoice']" v-if="type === 'AR'">{{$t('receiveFms.applyInvoice')}}</el-button>
        <!--申请核销-->
        <el-button size="mini" type="primary" @click="applyOrHedgeClear(false)"
                   v-permission="['fms:receive:charge:appoint:clear', 'fms:payable:charge:appoint:clear']">{{$t('receiveFms.applyClear')}}</el-button>
        <!--对冲核销-->
        <el-button size="mini" type="primary" @click="applyOrHedgeClear(true)" v-permission="['fms:receive:charge:offset:clear']" v-if="type === 'AR'">{{$t('receiveFms.hedgeClear')}}</el-button>
        <!--变更预计入账时间-->
        <el-button size="mini" type="primary" @click="changeBillDateFn()" v-permission="['fms:receive:charge:change:entry']" v-if="type === 'AR'">{{$t('receiveFms.changeEstimateEntryDate')}}</el-button>
        <!--变更对账-->
        <el-button size="mini" type="primary" @click="changeConfirmSettlementFn()" v-permission="['fms:receive:charge:change:state']" v-if="type === 'AR'">{{$t('receiveFms.changePrincipalType')}}</el-button>
        <el-popover placement="bottom" trigger="click" ref="popoverRef">
          <el-button slot="reference" size="mini" type="primary" v-permission="['fms:receive:charge:export:excel', 'fms:payable:charge:export:excel']" style="margin-left: 10px;" @click="exportExcelCheck()">{{$t('receiveFms.export_excel')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <template>
            <div>
              <div style="">
                <el-link type="primary" @click="exportExcel('CHARGE_LIST_DETAIL')">{{type === 'AR' ? '应收' : "应付"}}{{$t('receiveFms.charge_detail')}}</el-link>
              </div>
              <div v-for="item in exportTemplates" :key="item.code" style="margin-top: 6px;">
                <el-link type="primary" @click="exportExcel(item.code)">{{item.chineseName}}</el-link>
              </div>
            </div>
          </template>
        </el-popover>
      </div>

      <ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />

      <div class="page-total">
        <span class="page-total-item">
          <span>{{type === 'AR' ? $t('receiveFms.receive_sum'): $t('payableFms.payable_sum')}}：</span>
          <span>
            <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
              <span class='value'>{{item.currency}}</span>
              <span>{{item.value}}</span>
            </span>
          </span>
        </span>

        <span class="page-total-item">
          <span>{{$t('receiveFms.un_clear_amount_total')}}：</span>
          <span>
            <span class="value-item" v-for="(item, index) in unClearedAmountTotal" :key='index'>
              <span class='value'>{{item.currency}}</span>
              <span>{{item.value}}</span>
            </span>
          </span>
        </span>
      </div>

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
    </div>

    <apply-invoice-dialog ref="applyInvoiceDialogRef" origin="CHARGE" :ids="selectedIds" toPath='FmsApplyForInvoice'></apply-invoice-dialog>
    <create-bill-success ref="createBillSuccessRef" type="CHARGE" :arap="type" :createBillInfo="createBillInfo" @success='successOperFn'></create-bill-success>
    <receive-invoice ref="receiveInvoiceRef" :info='selectedInvoiceInfo' type='CHARGE' @success='successOperFn'></receive-invoice>
    <receive-cleard ref="receiveCleardRef" :info='selectedInvoiceInfo' type='CHARGE' @success='successOperFn' :arap="type"></receive-cleard>
    <profit-and-loss ref="profitAndLossRef"></profit-and-loss>
    <part-clear ref="partClearRef" @success="getList" :arap="type"></part-clear>
    <part-clear-detail ref="partClearDetailRef" @success="getList" :arap="type"></part-clear-detail>
    <join-bill ref="joinBillRef" @success="getList" :arap="type"></join-bill>
    <remove-charge-from-bill ref="removeChargeFromBillRef" @success="getList" :arap="type"></remove-charge-from-bill>
    <change-confirm-settlement ref="changeConfirmSettlementRef" @success="getList" type="CHARGE"></change-confirm-settlement>
    <change-bill-date ref="changeBillDateRef" @success="getList" :arap="type"></change-bill-date>
    <apply-payment-dialog ref="applyPaymentDialogRef" origin="CHARGE" toPath="FmsPayableApplyPayment" />
    <charge-goods-list ref="chargeGoodsListRef" :arap="type" @createBill="createBill" @receiveCancelCleared="receiveCancelCleared" @applyInvoice="applyInvoice" @receiveCleared="receiveCleared"
                       @applyOrHedgeClear="applyOrHedgeClear" @removeChargeFromBill="removeChargeFromBill" @joinChargeToBill="joinChargeToBill"></charge-goods-list>
  </div>
</template>

<script>
import mixins from './mixins';

export default {
    name: 'FmsChargeList',
    mixins: [mixins],
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.right-main-wrapper {
    overflow: auto;
    padding: 0px 20px 0 20px;
}
.pagination-container {
    margin-top: 0px;
}

.link {
    color: #1890ff;
    cursor: pointer;
}

.multipleNoSearch {
    width: 100%;
    .multiple-no-item {
        width: 100%;
        ::v-deep .el-input {
            width: 115px;
        }
        ::v-deep .el-form-item__content {
            width: calc(100% - 120px);
        }
        ::v-deep .el-textarea {
            width: 100%;
        }
    }
}
.multipleClearState {
    ::v-deep .el-select {
        width: 250px;
    }
}
.remove-bill-title {
    font-size: 16px;
    margin-bottom: 15px;
    line-height: 20px;

    .m-icon {
        color: #1890ff;
        margin-right: 8px;
        font-size: 20px;
        float: left;
    }
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 180px;
}
.fms-search-form {
    ::v-deep .el-input,
    ::v-deep .el-select {
        width: 207px;
    }
}
</style>
