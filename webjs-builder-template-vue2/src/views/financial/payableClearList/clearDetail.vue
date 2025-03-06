<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
      <el-tabs v-model="activeName">
        <!--核销详情/申请详情-->
        <el-tab-pane :label="totalData.clearNo ? $t('fmsPayableClear.clearDetail') : $t('fmsPayableClear.applyDetail')" name="first">
          <div class="section clear-title" style="margin-bottom: 0" v-if="operation === 'DETAIL'">
            <div v-if="totalData.instructionState === 3" class="title">
              <span>{{$t('fmsPayableClear.apply_clear_no')}}</span>
              <span style="margin-left: 15px;">{{totalData.instructionNo}}</span>
              <svg-icon className="clear-img" iconClass="icon-yichehui-huise" />
              <span class="no-transactions" v-if="totalData.instructionState === 5 || totalData.instructionState === 6">{{$t('fmsPayableClear.TRANSACTIONS_NO')}}</span>
            </div>
            <div v-else-if="totalData.clearNo" class="title">
              <span>{{$t('fmsPayableClear.clear_no')}}</span>
              <span style="margin-left: 15px;">{{totalData.clearNo}}</span>
              <svg-icon className="clear-img" iconClass="icon-yihexiao" />
              <span class="no-transactions" v-if="totalData.instructionState === 5 || totalData.instructionState === 6">{{$t('fmsPayableClear.TRANSACTIONS_NO')}}</span>
            </div>
            <div v-else-if="!totalData.clearNo" class="title">
              <span>{{$t('fmsPayableClear.apply_clear_no')}}</span>
              <span style="margin-left: 15px;">{{totalData.instructionNo}}</span>
              <svg-icon className="clear-img" iconClass="icon-weihexiao" />
              <span class="no-transactions" v-if="totalData.instructionState === 5 || totalData.instructionState === 6">{{$t('fmsPayableClear.TRANSACTIONS_NO')}}</span>
            </div>
          </div>
          <div style="padding: 20px;background: rgb(255, 255, 255);" v-if="totalData.id" >
            <PayableOrderChargeTotal 
              :instructionId="id" 
              :approvalSpecialInfo="totalData.approvalSpecialInfo"
              :contactAbsolute="false"
            />
          </div>
          <div class="clear-detail-container">
            <div class="section origin-container">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-weixiaozhangdan" v-if="clearingInfo.bills.length > 0" />
                  <svg-icon className="clear-module-icon" iconClass="icon-fapiaoguanli" v-else-if="clearingInfo.invoices.length > 0" />
                  <svg-icon className="clear-module-icon" iconClass="icon-weixiaofeiyong" v-else />
                  {{$t('fmsPayableClear.apply_clear_total_amount')}}
                </span>

                <span class="currency-value-des" v-for="(item, index) in totalData.sourceAmounts" :key="index">
                  <span style="margin-right: 10px" v-if="item.sourceValue != 0">{{item.sourceCurrency}} {{item.sourceValue | numberToThousands}}</span>
                </span>
              </div>
              <div class="section-content" v-if="clearingInfo.invoices.length || clearingInfo.bills.length">
                <!--应收发票-->
                <el-table :data="clearingInfo.invoices" v-if="clearingInfo.invoices.length" style="width: 100%" border>
                  <el-table-column prop="invoiceNo" :label="$t('fmsPayableClear.invoice_no')" min-width="150"></el-table-column>
                  <el-table-column prop="businessTypeNames" :label="$t('fmsPayableClear.business_type_name')" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span>{{row.businessTypeNames.join('、')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsPayableClear.settlement_company_name')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementCompanyName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="invoiceTotalAmounts" :label="$t('fmsPayableClear.currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.invoiceTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="clearTotalAmounts" :label="$t('fmsPayableClear.current_apply_currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>

                <!--应收账单-->
                <el-table :data="clearingInfo.bills" v-if="clearingInfo.bills.length" style="width: 100%" border>
                  <el-table-column prop="billNo" :label="$t('fmsPayableClear.bill_no')" min-width="150"></el-table-column>
                  <el-table-column prop="businessTypeName" :label="$t('fmsPayableClear.business_type_name')" min-width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsPayableClear.settlement_company_name')" min-width="150" show-overflow-tooltip>
                    <template>
                      <span>{{totalData.settlementCompanyName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="billTotalAmounts" :label="$t('fmsPayableClear.currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.billTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="clearTotalAmounts" :label="$t('fmsPayableClear.current_apply_currency_value')" align="right" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{row}">
                      <span v-for="(item, index) in row.clearTotalAmounts" :key="index">
                        <span>{{item.currency}}</span>
                        <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!--关联的付款-本次核销使用金额-->
            <div class="section containerrelative-container" v-if="transactionsList.length > 0">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
                  <!--本次核销使用金额-->
                  {{$t('fmsPayableClear.currentClearUseAmount')}}
                </span>
                <span class="currency-value-des" v-for="(item, index) in transactionsAmounts" :key="index">
                  <span style="margin-right: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
                </span>
              </div>
              <div class="section-content">
                <el-table :data="transactionsList" style="width: 100%" border>
                  <el-table-column prop="transactionsNo" :label="$t('fmsPayablePayment.transactionsNo')" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessTypeNames" :label="$t('fmsPayableClear.businessTypeName')" minWidth="200" :show-overflow-tooltip="true">
                      <template slot-scope="{row}">
                        <span>{{row.businessTypeNames.join('、')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="settlementCompanyName" :label="$t('fmsPayableClear.settlementCompanyName')" minWidth="220" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="settlementOfficeName" :label="$t('fmsPayableClear.settlementOfficeName')" minWidth="220" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="paymentCurrencyAmount" :label="$t('fmsPayablePayment.paymentCurrencyAmount')" align="right" min-width="180">
                      <template slot-scope="{row}">
                        <span>{{row.transactionsCurrency}}&nbsp;{{row.transactionsAmount | numberToThousands}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remainAmount" :label="$t('fmsPayablePayment.unTransactionsAmount')" align="right" min-width="110" >
                      <template slot-scope="{row}">
                        <span>{{row.remainAmount | numberToThousands}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="useAmount" :label="$t('fmsPayableClear.useAmount')" minWidth="150" align="right" fixed="right" >
                      <template slot-scope="{row}">
                        <span>{{row.useAmount | numberToThousands}}</span>
                      </template>
                    </el-table-column>
                </el-table>
              </div>
            </div>

            <!--余额核销-本次核销使用金额-->
            <div class="section containerrelative-container" v-if="instructionAccounts.length > 0">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
                  <!--本次核销使用金额-->
                  {{$t('fmsPayableClear.currentClearUseAmount')}}
                </span>
                <span class="currency-value-des" v-for="(item, index) in transactionsAmounts" :key="index">
                  <span style="margin-right: 10px">{{item.currency}} {{item.value | numberToThousands}}</span>
                </span>
              </div>
              <div class="section-content">
                <el-table :data="instructionAccounts" style="width: 100%" border>
                  <el-table-column prop="instructionTransactionTypeName" :label="$t('fmsPayableClear.type')" min-width="80"></el-table-column>
                  <el-table-column prop="accountCodeName" :label="$t('fmsPayableClear.businessTypeName')" min-width="120"></el-table-column>
                  <el-table-column prop="settlementCompanyName" :label="$t('fmsPayableClear.settlementCompanyName')" min-width="150" show-overflow-tooltip />
                  <el-table-column prop="settlementOfficeName" :label="$t('fmsPayableClear.settlementOfficeName')" min-width="150" show-overflow-tooltip />
                  <el-table-column prop="useAmount" :label="$t('fmsPayableClear.useAmount')" width="150" align="right" >
                    <template slot-scope="{row}">
                      <span>{{row.useAmount | numberToThousands}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="section offset-container" v-if="transactionsList.length || instructionAccounts.length">
              <div class="title">
                <div class="title-item">
                  <span class="title-item-des">
                    <svg-icon className="clear-module-icon" iconClass="icon-hexiaoxiangqing" />
                    <!--核销详情-->
                    {{$t('fmsPayableClear.clearDetail')}}
                    <span v-if="totalData.exchangeCurrency" class='YI ml-10'>
                      <!--异-->
                      {{$t('fmsPayableClear.DIFF')}}
                    </span>
                  </span>
                  <span class="title-item-des" v-if="false">
                    <!--剩余原币未销合计-->
                    {{$t('fmsPayableClear.remainSourceUnClearTotal')}}：
                  </span>
                  <span v-for="(item, index) in remainAmounts" :key="index">
                    <span>{{item.currency}}</span>
                    <span style="margin-right:10px">{{item.value | numberToThousands}}</span>
                  </span>
                </div>
              </div>

              <div class="section-content">
                <!--多对多-->
                <div class="text-container" v-if="isManyToMany">
                  <div class="amount-container">
                    <el-row v-for="(item, index) in totalData.sourceAmounts" :key="index + 'AP'" class="amount-row">
                      <el-col :span="4">
                        <div>
                          <span v-if="index === 0">
                            <!--应收-->
                            {{$t('fmsPayableClear.AP')}}
                          </span>
                          <span v-else>&nbsp;&nbsp;</span>
                        </div>
                      </el-col>
                      <el-col :span="16" class="currency-value">
                        <span class="currency">{{item.sourceCurrency}}</span>
                        <span class="value">{{item.sourceValue | numberToThousands}}</span>
                        <span class="symbol">x</span>
                        <span class="input">{{item.exchangeRate}}</span>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol">=</span>
                          <span class="total-transfer">{{item.targetValue | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="amount-container">
                    <el-row class="amount-row" v-for="(item, index) in transactionsAmounts" :key="index + 'AR'">
                      <el-col :span="4">
                        <div>
                          <span v-if="index === 0">
                            <!--本次付款使用金额-->
                            {{$t('fmsPayableClear.currentTransactionsUseAmount')}}
                          </span>
                          <span v-else>&nbsp;&nbsp;</span>
                        </div>
                      </el-col>
                      <el-col :span="16" class="currency-value">
                        <span class="currency">{{item.currency}}</span>
                        <span class="value">
                          {{item.value| numberToThousands}}
                        </span>
                        <span class="symbol">x</span>
                        <span class="input">
                          1
                        </span>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol">=</span>
                          <span class="total-transfer">{{item.value | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <el-row class="remain-row">
                    <el-col :span="6">
                      <div>
                        <!--剩余应收-->
                        {{$t('fmsPayableClear.remainReceipt')}}
                      </div>
                    </el-col>
                    <el-col :span="18" class="calc-total">
                      <div>
                        <span class="symbol"></span>
                        <span class="total-transfer">
                          <span v-for="(item, index) in diffCalcTotal" :key="index" style="margin-left: 20px;">{{item.currency}}&nbsp;&nbsp;{{item.value}}</span>
                        </span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <!-- 异币种 -->
                <div class="text-container" v-else-if="isDifferent">
                  <div class="amount-container">
                    <el-row v-for="(item, index) in totalData.sourceAmounts" :key="index + 'AP'" class="amount-row">
                      <el-col :span="4">
                        <div>
                          <span v-if="index === 0">
                            <!--应收-->
                            {{$t('fmsPayableClear.AP')}}
                          </span>
                          <span v-else>&nbsp;&nbsp;</span>
                        </div>
                      </el-col>
                      <el-col :span="16" class="currency-value">
                        <span class="currency">{{item.sourceCurrency}}</span>
                        <span class="value">{{item.sourceValue | numberToThousands}}</span>
                        <span class="symbol">x</span>
                        <span class="input">{{item.exchangeRate}}</span>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol">=</span>
                          <span class="total-transfer">{{item.targetValue | numberToThousands}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="amount-container">
                    <el-row class="amount-row">
                      <el-col :span="4">
                        <div>
                          <span>
                            <!--本次付款核销金额-->
                            {{$t('fmsPayableClear.currentTransactionsClearAmount')}}
                          </span>
                        </div>
                      </el-col>
                      <el-col :span="16" class="currency-value">
                        <span class="currency">{{totalData.instructionCurrency}}</span>
                        <span class="value">{{transactionsAmounts[0] ? formatNumberToThousands(transactionsAmounts[0].value) : ''}}</span>
                        <span class="symbol">&nbsp;</span>
                        <span class="input" style="visibility: hidden;">&nbsp;</span>
                      </el-col>
                      <el-col :span="4" class="calc-total">
                        <div>
                          <span class="symbol">=</span>
                          <span class="total-transfer">{{transactionsAmounts[0] ? formatNumberToThousands(transactionsAmounts[0].value) : ''}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <el-row class="remain-row remain-border">
                    <el-col :span="6">
                      <div>
                        <!--剩余金额-->
                        {{$t('fmsPayableClear.remainCalcAmount')}}
                      </div>
                    </el-col>
                    <el-col :span="14" class="total-currency">
                      <div>
                        <span v-if="totalData.instructionCurrency">{{totalData.instructionCurrency}}</span>
                        <span v-else>&nbsp;</span>
                      </div>
                    </el-col>
                    <el-col :span="4" class="calc-total">
                      <div>
                        <span class="symbol"></span>
                        <span class="total-transfer">{{diffCalcTotal[0] ? formatNumberToThousands(diffCalcTotal[0].value) : ''}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <!--只有同一个币种的展示-->
                <div class="same-curreny-result-container" v-else-if="!isDifferent">
                  <el-row class="amount-row">
                    <el-col :span="6">
                      <!--本次原币核销金额-->
                      {{$t('fmsPayableClear.currentSourceUnClearAmount')}}
                    </el-col>
                    <el-col :span="18">
                      <div class="currency-value">
                        <span class="currency">{{totalData.instructionCurrency}}</span>
                        <span class="value">{{totalData.sourceAmounts[0] ? formatNumberToThousands(totalData.sourceAmounts[0].sourceValue) : ''}} </span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="amount-row">
                    <el-col :span="6">
                      <!--本次付款核销金额-->
                      {{$t('fmsPayableClear.currentTransactionsClearAmount')}}
                    </el-col>
                    <el-col :span="18">
                      <div class="currency-value">
                        <span class="currency">{{totalData.instructionCurrency}}</span>
                        <span class="value">{{transactionsAmounts[0] ? formatNumberToThousands(transactionsAmounts[0].value) : ''}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="amount-row remain-calc-row">
                    <el-col :span="6">
                      <!--剩余金额-->
                      {{$t('fmsPayableClear.remainCalcAmount')}}
                    </el-col>
                    <el-col :span="18">
                      <div class="currency-value">
                        <span class="currency">{{totalData.instructionCurrency}}</span>
                        <span class="value">{{diffCalcTotal[0] ? formatNumberToThousands(diffCalcTotal[0].value) : ''}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>

            <div class="info-module remark-container">
              <div class="title">
                <span class="title-item-des">
                  <svg-icon className="clear-module-icon" iconClass="icon-zhuyishixiang" />
                    <!--其他-->
                    {{$t('fmsPayableClear.other')}}
                </span>
              </div>
              <div class="content">
                <div class="item full-line">
                  <label>{{$t('fmsPayableClear.localServicePaymentType')}}</label>
                  <span>{{totalData.localServicePaymentTypeName}}</span>
                </div>
                <div class="item full-line">
                  <label>{{$t('fmsPayableClear.invoiceMedium')}}</label>
                  <span>{{totalData.invoiceMediumName}}</span>
                </div>
                <div class="item full-line">
                  <label>{{$t('fmsPayableClear.invoiceFilesUpload')}}</label>
                  <span>
                    <div v-for="(item,index) in totalData.invoiceFiles" :key="index">
                      <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
                    </div>
                  </span>
                </div>
                <div class="item full-line">
                  <label>{{$t('fmsPayablePayment.billFiles')}}</label>
                  <span>
                    <div v-for="(item,index) in totalData.billFiles" :key="index">
                      <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
                    </div>
                  </span>
                </div>
                <div class="item full-line">
                  <label>{{$t('fmsPayableClear.otherFiles')}}</label>
                  <span>
                    <div v-for="(item,index) in totalData.otherFiles" :key="index">
                      <a class="link" :href="item.url" target="_blank">{{item.originFileName}}</a>
                    </div>
                  </span>
                </div>

                <div class="item">
                  <label>{{$t('fmsPayableClear.submitByName')}}</label>
                  <span>{{totalData.submitByName}}</span>
                </div>
                <div class="item">
                  <label>{{$t('fmsPayableClear.submitDate')}}</label>
                  <span>{{totalData.submitDate | parseTime}}</span>
                </div>
                <div class="item full-line">
                  <label>{{$t('fmsPayableClear.submitRemark')}}</label>
                  <span>{{totalData.remark}}</span>
                </div>
                <div class="item full-line">
                  <label>{{$t('fmsPayableClear.submitClearReason')}}</label>
                  <span>
                    {{totalData.clearDiffReason}}
                    {{totalData.clearDiffRemark ? ('：'+ totalData.clearDiffRemark) : ''}}
                  </span>
                </div>
                <div class="item" v-if="totalData.clearNo">
                  <label>{{$t('fmsPayableClear.clearByName')}}</label>
                  <span>{{totalData.clearByName}}</span>
                </div>
                <div class="item" v-if="totalData.clearNo">
                  <label>{{$t('fmsPayableClear.clearDate')}}</label>
                  <span>{{totalData.clearDate | parseTime}}</span>
                </div>
                <div class="item full-line" v-if="totalData.clearNo">
                  <label>{{$t('fmsPayableClear.clearReason')}}</label>
                  <span>
                    {{totalData.clearClearDiffReason}}
                    {{totalData.clearClearDiffRemark ? ('：'+ totalData.clearClearDiffRemark) : ''}}
                  </span>
                </div>
              </div>
            </div>

            <!-- 审批意见 -->
            <div class="info-module" v-if="(totalData.approvalType === 50) && operation === 'APPROVAL'">
              <div class="title">
                <svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
                {{$t('fmsPayablePayment.approvalInfo')}}
              </div>
              <div class="content">
                <el-form ref="approvalFormDataRef" :model="approvalFormData" size="mini" label-width="120px">
                  <el-form-item label="" prop="result" :rules="[{ required: true, message: $t('common.selectPlaceholder') }]">
                    <el-radio-group v-model="approvalFormData.result">
                      <el-radio :label="true">{{$t('fmsPayablePayment.agree')}}</el-radio>
                      <el-radio :label="false">{{$t('fmsPayablePayment.reject')}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('fmsPayablePayment.approvalRemark')" prop="approvalRemark" :rules="[{ required: !approvalFormData.result, message: $t('common.can_not_be_null') }]">
                    <el-input v-model="approvalFormData.approvalRemark" type="textarea" size="mini" />
                  </el-form-item>
                  <el-form-item :label="$t('fmsPayablePayment.approvalFiles')" prop="approvalFiles">
                    <upload-file v-model="approvalFormData.approvalFiles" multiple accept=".rar,.zip,.doc,.docx,.pdf,.xlsx,.xls"></upload-file>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('fmsPayableClear.approvalProgress')" name="second" lazy>
          <approval-progress :logList="logList"/>
        </el-tab-pane>
        <el-tab-pane :label="totalData.clearNo ? $t('fmsPayableClear.applyClearDetail') : $t('fmsPayableClear.clearDetail')" name="third" lazy>
          <clear-charge-detail :id="id" :totalData="totalData" type="AP"/>
        </el-tab-pane>
      </el-tabs>

			<clear-reason-modal ref="clearReasonModalRef" @ok="submitConfirmFn" />
		</div>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'DETAIL'">{{$t('common.close')}}</el-button>
			<el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'CLEAR'">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" :loading="rejectApplyLoading" @click="rejectApplyFn()" v-if="operation === 'CLEAR' && !totalData.clearNo">{{$t('fmsPayableClear.recallApply')}}</el-button>
			<el-button type="primary" size="mini" :loading="rejectLoading" @click="rejectFn()" v-if="operation === 'CLEAR' && totalData.clearNo">{{$t('fmsPayableClear.recallClear')}}</el-button>
			<el-button type="primary" size="mini" :loading="clearLoading" @click="confirmFn()" v-if="operation === 'CLEAR'">{{$t('common.confirm')}}</el-button>

      <el-button type="primary" size="mini" plain @click="backList()" v-if="operation === 'APPROVAL'">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="mini" @click="approvalFn()" v-if="(totalData.approvalType === 50) && operation === 'APPROVAL'">{{$t('fmsPayablePayment.submit')}}</el-button>
    </div>
	</div>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getPayableClearDetailApi, payableClearAuditApi, payableClearCancelApi, payableApplyClearCancelApi } from "@/api/financial/fmsPayableClear";
import ClearReasonModal from "@/views/financial/components/PayableClearReasonModal";
import ClearChargeDetail from "./components/clearChargeDetail";
import PayableOrderChargeTotal from "@/views/financial/components/PayableOrderChargeTotal";
import ApprovalProgress from "@/views/financial/payablePaymentApplyList/components/ApprovalProgress";
import { approvalApplyAgreeApi, approvalApplyRejectApi, approvalApplyAgreeV1Api, approvalApplyRejectV1Api } from "@/api/financial/fmsPayablePayment";

// 申请核销
export default {
	name: "FmsPayableClearDetail",
	components: {
		ClearReasonModal,
    ClearChargeDetail,
    PayableOrderChargeTotal,
    ApprovalProgress
	},
	data() {
		return {
      loading: false,
      approvalFormData: {
        result: null,
        approvalRemark: '',
        approvalFiles: []
      },
      logList: [],
      activeName: 'first',
			id: "",
			operation: "",
			origin: "",
			clearLoading: false,
      rejectApplyLoading: false,
      rejectLoading: false,
			formData: {},
			isDifferent: false,
      isManyToMany: false,
			remainAmounts: [], // 剩余原币未销合计
			isRelative: 1, // 是否关联付款

      diffCalcTotal: [], // 剩余应收合计
			transactionsList: [],
      instructionAccounts: [],
			transactionsAmounts: [], // 付款金额汇总
			totalData: {
				instructionTransactionType: "",
				businessType: "",
				settlementOfficeId: "",
				settlementCompanyId: "",
				arAp: "1",
				remark: "",
				instructionCurrency: "",
				sourceAmounts: [], // 编辑之后的合计

        // 传递给费用明细用的
        clearingInfo: {
          settlementSource: "",
          settlementSourceName: "",
          charges: [],
          bills: [],
          invoices: [],
          unInstructionAmounts: [] // 原有的合计
        }
			},
			clearingInfo: {
				settlementSource: "",
				settlementSourceName: "",
				charges: [],
				bills: [],
				invoices: [],
				unInstructionAmounts: [] // 原有的合计
			}
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.origin = this.$route.query.origin;
		this.operation = this.$route.query.operation;
		this.init();
	},
	methods: {
    // 审批
    approvalFn() {
      this.$refs.approvalFormDataRef.validate(valid => {
        if (valid) {
          let data = {
            applyType: 3, // 核销申请
            ...this.approvalFormData
          };
          data.applyId = this.totalData.id
          data.instructionId = this.totalData.id
          data.currentApplyApprovalNodeCode = this.totalData.currentApprovalLog.approvalNodeCode
          data.nextApprovalNode = this.totalData.currentApprovalLog.nextApprovalNode

          let fn = null
          if (this.totalData.workflowType === 10) {
            fn = data.result ? approvalApplyAgreeV1Api : approvalApplyRejectV1Api
          } else {
            fn = data.result ? approvalApplyAgreeApi : approvalApplyRejectApi
          }
          this.loading = true
          fn(data).then(res => {
            this.loading = false
            if (res.ok) {
              // 审批成功
              this.$message.success(this.$t('fmsPayablePayment.approvalOperSuccess'))
              this.backList(true)
            }
          })
        }
      });
    },
    formatNumberToThousands(val) {
      return formatNumberToThousands(val)
    },
		init() {
			getPayableClearDetailApi(this.id).then(res => {
				if (res.ok) {
          this.logList = res.content.approvalLogList
					this.totalData = {
						...this.totalData,
						...res.content
					};
          res.content.transactionsList = res.content.transactionsList || []
          res.content.instructionAccounts = res.content.instructionAccounts || []

          let transactionsAmountsMap = {}
          res.content.transactionsList.forEach(v => {
            v.instructionTransactionType = res.content.instructionTransactionTypeName
            v.instructionTransactionTypeName = res.content.instructionTransactionTypeName
            v.settlementCompanyName = res.content.settlementCompanyName
            v.settlementOfficeName = res.content.settlementOfficeName
            transactionsAmountsMap[v.transactionsCurrency] = Number(transactionsAmountsMap[v.transactionsCurrency] || 0) + Number(v.useAmount || 0)
          })
          let transactionsAmounts = []
          Object.keys(transactionsAmountsMap).forEach(currency => {
            transactionsAmounts.push({
              currency: currency,
              value: transactionsAmountsMap[currency]
            })
          })
          this.transactionsAmounts = transactionsAmounts
          res.content.instructionAccounts.forEach(v => {
            v.instructionTransactionType = res.content.instructionTransactionTypeName
            v.instructionTransactionTypeName = res.content.instructionTransactionTypeName
            v.settlementCompanyName = res.content.settlementCompanyName
            v.settlementOfficeName = res.content.settlementOfficeName
          })
					this.transactionsList = res.content.transactionsList;
          this.instructionAccounts = res.content.instructionAccounts
					this.totalData.sourceAmounts = res.content.chargeTotalAmounts;
					this.totalData.instructionCurrency = res.content.instructionCurrency;
					let unInstructionAmounts = res.content.clearSourceInfo.chargeTotalAmounts;
					this.clearingInfo = {
						...res.content.clearSourceInfo,
						unInstructionAmounts: unInstructionAmounts
					};

          let currencyList = {}
          this.totalData.sourceAmounts.forEach(v => {
            currencyList[v.sourceCurrency] = v.sourceCurrency
          })
          this.transactionsAmounts.forEach(v => {
            currencyList[v.currency] = v.currency
          })

          if (unInstructionAmounts.length > 1 && transactionsAmounts.length > 1) {
            this.isManyToMany = true
            let diffCalcTotal = []
            Object.keys(currencyList).forEach(currency => {
              let index1 = this.totalData.sourceAmounts.findIndex(item => item.sourceCurrency === currency)
              let index2 = this.transactionsAmounts.findIndex(item => item.currency === currency)
              let item1 = this.totalData.sourceAmounts[index1]
              let item2 = this.transactionsAmounts[index2]
              let value1 = index1 >= 0 ? Number(item1.sourceValue) : 0
              let value2 = index2 >= 0 ? Number(item2.value) : 0
              diffCalcTotal.push({
                currency: currency,
                value: (value1 - value2).toFixed(2)
              })
            })
            this.diffCalcTotal = diffCalcTotal
          } else {
            this.isManyToMany = false
            // 多币种
            if (
              unInstructionAmounts.length > 1 ||
              transactionsAmounts.length > 1 ||
              unInstructionAmounts[0].currency !== transactionsAmounts[0].currency) {
              this.isDifferent = true;
            } else {
              this.isDifferent = false;
            }
            let receiptTransactionTotal = 0;
            let arr = []
            if (this.transactionsList.length) {
              arr = this.transactionsList
            } else if (this.instructionAccounts.length) {
              arr = this.instructionAccounts
            }
            arr.forEach(v => {
              receiptTransactionTotal += Number(v.useAmount || 0);
            });
            let receiptSourceAmountsTotal = 0;
            this.totalData.sourceAmounts.forEach(v => {
              receiptSourceAmountsTotal += Number(v.targetValue || 0);
            });

            this.diffCalcTotal = [{
              currency: res.content.instructionCurrency,
              value: Number(receiptSourceAmountsTotal - receiptTransactionTotal).toFixed(2)
            }];
          }
				}
			});
		},
		submitConfirmFn(reason) {
			let data = {
				instructionId: this.id
			};
			// 如果是弹窗选原因
			if (reason) {
        let diffCalcTotal = 0
        this.diffCalcTotal.forEach(v => {
          diffCalcTotal += Number(v.value)
        })
				data.clearDiffRemark = reason.remark;
				if (Number(diffCalcTotal) > 0) {
					data.clearUnderReason = reason.reason;
				} else {
					data.clearOverReason = reason.reason;
				}
			}
			this.clearLoading = true;
			payableClearAuditApi(data).then(res => {
        if (res.ok) {
          this.backList(true);
          this.$message.success(this.$t('fmsPayableClear.clearSuccess'));
        }
        this.clearLoading = false;
      }).catch(() => {
        this.clearLoading = false;
      });
		},
		confirmFn() {
			if (this.totalData.instructionTransactionType === 5) {
				// 完全平账
				this.submitConfirmFn();
			} else if (this.totalData.instructionTransactionType === 6) {
				// 余额平账
				this.$refs.clearReasonModalRef.show(true);
			} else if (this.totalData.instructionTransactionType === 4 || this.totalData.instructionTransactionType === 2) {
				// 关联付款
        let diffCalcTotal = 0
        this.diffCalcTotal.forEach(v => {
          diffCalcTotal += Number(v.value)
        })
				if (Number(diffCalcTotal) !== 0) {
					let flag = Number(diffCalcTotal) > 0;
					this.$refs.clearReasonModalRef.show(flag);
				} else {
					this.submitConfirmFn();
				}
			}
		},
		rejectApplyFn() {
			this.$confirm(this.$t('fmsPayableClear.recallApplyInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.rejectApplyLoading = true
					payableApplyClearCancelApi({ instructionId: this.id }).then(res => {
						if (res.ok) {
							this.backList(true);
							this.$message.success(this.$t('fmsPayableClear.recallApplySuccess'));
						}
            this.rejectApplyLoading = false
					});
				})
				.catch(() => {});
		},
		rejectFn() {
			this.$confirm(this.$t('fmsPayableClear.recallClearInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
          this.rejectLoading = true
					payableClearCancelApi({ instructionId: this.id }).then(res => {
						if (res.ok) {
							this.backList(true);
							this.$message.success(this.$t('fmsPayableClear.recallClearSuccess'));
						}
            this.rejectLoading = false
					});
				})
				.catch(() => {});
		},
		backList(refresh) {
			if (this.origin) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.origin, query: { refresh: refresh } });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../styles/clear.scss";
.page-edit-container .page-edit-content {
	padding: 0;
}
.clear-detail-container {
	padding: 20px;
}
.clear-title {
	font-size: 15px;
	font-weight: 600;
	height: 50px;
	line-height: 50px;
	background: #fff;
	position: relative;

	.clear-img {
		position: absolute;
		right: 100px;
		top: 0px;
		font-size: 110px;
	}
}
.same-curreny-result-container {
	overflow: hidden;
	clear: both;
	font-size: 14px;
	font-weight: 600;
	padding: 0 20px;

	.amount-row {
		margin-bottom: 20px;

		.currency-value {
			text-align: right;
			.value {
				width: 120px;
				margin-left: 10px;
				display: inline-block;
			}
		}
	}

	.remain-calc-row {
		padding-top: 20px;
		border-top: 1px dashed #dedede;
	}
}

.no-transactions {
	float: right;
	padding-right: 20px;
	color: red;
}

.YI {
  color: #fff;
  background: #1890ff;
  display: inline-block;
  border-radius: 2px;
  height: 22px;
  line-height: 22px;
  width: 22px;
  text-align: center;
  font-size: 12px;
}

::v-deep .el-tabs__header{
  background: #fff;
  padding-left: 20px;
  line-height: 50px;
}
</style>
