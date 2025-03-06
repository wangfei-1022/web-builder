<template>
  <div class="box" v-loading="loading">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="dataForm">
      <div class="box_child ">
        <el-col :span="8" v-if="!viewBy">
          <!--          确认单编号-->
          <el-form-item :label="$t('sea.confirmationNo')" prop="confirmationNo" >
            <span>{{dataForm.confirmationNo}}</span>
          </el-form-item>
        </el-col>
        <el-row :gutter="20" class="title">
          <el-col :span="8">
            <!--          业务单号-->
            <el-form-item :label="$t('sea.businessNo')" prop="entityId"  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <!--              :disabled="isCconfirmed || confirmationProgress"-->
              <el-select v-if="viewBy" v-model="dataForm.entityId"  size="mini" @change="entityNoChange">
                <el-option v-for="item in getEntityNosOps" :key="item.entityId" :label="item.entityNoDisplay" :value="item.entityId"  :disabled="item.disabled"></el-option>
              </el-select>
              <span v-else>{{dataForm.entityNoDisplay}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!--            收款账套-->
            <el-form-item :label="$t('sea.collectionACSet')" prop="settlementOfficeId"  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-select v-if="viewBy" v-model="dataForm.settlementOfficeId" :disabled="isCconfirmed || confirmationProgress" size="mini">
                <el-option v-for="item in settlementOfficeOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <span v-else>{{dataForm.settlementOfficeName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!--应收结算单位 如果选择的结算单位为结算分公司（18000） 应收算结单位则显示分公司-->
            <el-form-item :label="Number(dataForm.partnerRole) === 18000 ? $t('sea.branch'): $t('sea.aRSettlementUnit')" prop="settlementCompanyId"  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
              <!--              <remoteSearchSelector v-if="viewBy" v-model="dataForm.settlementCompanyId" :disabled="isCconfirmed || confirmationProgress"  @selectorChange="setCustomerInfo" :optionsPorp="customerOptionsPorp" :defaultOps="dataForm.partnerRole === 21010?settlementCompanyOps:[]"/>-->
              <el-select v-if="viewBy" v-model="dataForm.settlementCompanyId" :disabled="isCconfirmed || confirmationProgress" size="mini" filterable @change="settlementCompanyChange">
                <el-option v-for="item in aRSettlementUnitOps"
                           :key="Number(dataForm.partnerRole) === 18000 ? item.id : item.settlementCompanyId"
                           :label="Number(dataForm.partnerRole) === 18000 ? item.chineseName : item.settlementCompanyName"
                           :value="Number(dataForm.partnerRole) === 18000 ? item.id : item.settlementCompanyId">
                </el-option>
              </el-select>
              <span v-else>{{dataForm.settlementCompanyName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="title">
          <el-col :span="8">
            <!--            结算单位类型-->
            <el-form-item :label="$t('sea.settlementUnitType')" prop="partnerRole" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-select v-if="viewBy" v-model="dataForm.partnerRole" :disabled="isCconfirmed || confirmationProgress" size="mini" @change="partnerRoleChange">
                <el-option :label="$t('sea.customer')" :value="21010"></el-option>
                <el-option :label="$t('sea.destinationAgent')" :value="13011"></el-option>
                <el-option :label="$t('sea.settlementBranch')" :value="18000"></el-option>
                <!--                <el-option :label="$t('sea.other')" :value="16012"></el-option>-->
              </el-select>
              <span v-else>{{dataForm.partnerRoleName}}</span>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!--            目的港代理-->
            <el-form-item v-if="Number(dataForm.partnerRole) === 13011" :label="$t('sea.destinationAgent')" prop="scmSupplierId" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <type-select  v-if="viewBy" v-model="dataForm.scmSupplierId" :defaultDisplay="dataForm.scmSupplierCnName" type="supplier" @selected="scmSupplierChange" :requestParams="partnerRoleParams" style="width: 180px" />
              <span v-else>{{dataForm.scmSupplierCnName}}</span>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!--            结算方式-->
            <el-form-item :label="$t('sea.settlementMethod')" prop="settlementMode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
              <el-select v-if="viewBy" v-model="dataForm.settlementMode" :disabled="isCconfirmed || confirmationProgress" size="mini">
                <el-option v-for="item in settlementModeOps"
                           :key="Number(dataForm.partnerRole) === 18000?item.code :item.settlementMode"
                           :label="Number(dataForm.partnerRole) === 18000?item.name :item.settlementModeName"
                           :value="Number(dataForm.partnerRole) === 18000?item.code :item.settlementMode"></el-option>
              </el-select>
              <span v-else>{{dataForm.settlementModeName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('sea.customerAddress')" prop="customerAddress" >
              <el-input v-if="viewBy" v-model="dataForm.customerAddress" size="mini" :disabled="confirmationProgress"></el-input>
              <span v-else>{{dataForm.customerAddress}}</span>
              <el-checkbox v-model="useRegisteredAddressCompany" @change="useRegisteredChange">{{ $t('sea.useRegisteredAddressCompany') }}</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="display: flex; position: relative;">
            <el-tooltip v-if="!dataForm.entityId" class="item" effect="dark" :content="$t('sea.pleaseSelectABusinessOrderNumberFirst')" placement="top-start">
              <el-checkbox v-model="isExpenseTemplate" :disabled="true" style="position: absolute; left: 25px;"></el-checkbox>
            </el-tooltip>
            <el-checkbox v-else v-model="isExpenseTemplate" style="position: absolute; left: 25px;"></el-checkbox>
            <el-form-item :label="$t('sea.expenseTemplate')" prop="expenseTemplate" >
                <el-select v-if="viewBy && isExpenseTemplate" v-model="expenseTemplateId" @change="expenseTemplateChange" :disabled="isCconfirmed || confirmationProgress" size="mini">
                  <el-option v-for="item in templateListOps" :key="item.id" :label="item.templateName" :value="item.id"></el-option>
                </el-select>
                <span v-else>{{dataForm.expenseTemplate}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-table class="data-table" :data="dataForm.charges">
          <el-table-column prop="name" :label="$t('sea.feeName')" align="center"  width="200px" >
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.feeItemName`"  :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <TypeSelect  v-if="row.isEdit" v-model="row.feeItemName" :disabled="confirmationProgress && !row.isNewAdd" type="businessFee" valueKey="chineseName" @selected="feeItemCodeChange($event,row)" :requestParams="{businessTypeCode: 'SEA_EXPORT'}"/>
                <span v-else>{{row.feeItemName}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <!--          计费方式-->
          <el-table-column prop="name" :label="$t('sea.billingMethod')" align="center" width="200px" >
            <template slot-scope="{ row,$index}">
              <div style="display: flex;    justify-content: center;">
                <el-form-item  label="" :prop="`charges.${$index}.unit1`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                  <el-select v-if="row.isEdit" v-model="row.unit1" size="mini" :disabled="confirmationProgress && !row.isNewAdd" clearable filterable remote :remote-method="dictListOpsRemoteMethod" @clear="dictListOpsClear" style="width: 100px"  @change="unit1Change($event,row)">
                    <el-option v-for="item in dictListOps" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                  <span v-else>{{row.unitName1}}</span>
                </el-form-item>
                <el-form-item v-if="Number(row.unit1) === 2005"  label="" :prop="`charges.${$index}.containerSizeType`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                  <el-select v-if="row.isEdit" :disabled="confirmationProgress && !row.isNewAdd" v-model="row.containerSizeType" @change="containerSizeTypeChange($event,row)" size="mini" filterable style="width: 90px">
                    <el-option v-for="item in getContainerSizeTypeOps" :key="item.containerType" :label="item.containerType" :value="item.containerType"></el-option>
                  </el-select>
                  <span v-else>{{row.containerSizeType}}</span>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('sea.currency')" align="center" width="130px" >
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.currency`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
                <el-select v-if="row.isEdit" v-model="row.currency" size="mini" filterable>
                  <el-option v-for="item in currenciesOps" :key="item.code" :label="item.code" :value="item.code"></el-option>
                </el-select>
                <span v-else>{{row.currency}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('sea.unitPrice')" align="center" width="130px" >
            <template slot-scope="{row,$index}">
              <el-form-item label=""  :prop="`charges.${$index}.price`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },{validator: validate0, trigger: 'change'}]" >
                <el-input v-if="row.isEdit" v-trim v-model="row.price" v-input-limit="[-9,2]" size="mini" @change="taxAmountCalculation(row)" />
                <span v-else>{{formatNumberToThousands(row.price)}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <!--          计费数量1-->
          <el-table-column prop="name" :label="$t('sea.quantity')" align="center" width="130px">
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.chargeQuantity1`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },{validator: validate0, trigger: 'change'}]" >
                <el-input v-if="row.isEdit && (row.unit1 == 1101 || row.unit1 == 1201 )" v-trim v-model="row.chargeQuantity1" v-input-limit="[9,3]" size="mini" @change="taxAmountCalculation(row)"  key="volumeKg"/>
                <el-input v-else-if="row.isEdit && row.unit1 !== 1101 && row.unit1 !== 1201 " v-trim v-model="row.chargeQuantity1" v-input-limit="[9,-1]" size="mini" @change="taxAmountCalculation(row)"  key="noVolumeKg"/>
                <span v-else>{{row.chargeQuantity1}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <!--          税率-->
          <el-table-column prop="name" :label="$t('sea.taxRate')" align="center"  width="130px" >
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.invoiceTaxRate`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]" >
                <el-select v-if="row.isEdit" v-model="row.invoiceTaxRate" size="mini" filterable @change="taxAmountCalculation(row)">
                  <el-option v-for="item in invoiceTaxOps" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
                <span v-else>{{row.invoiceTaxRateName}}</span>
              </el-form-item>
            </template>

          </el-table-column>
          <!--          税额-->
          <el-table-column :label="$t('sea.taxAmount')" align="center" width="130px">
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.taxAmount`" >
                <el-input :disabled="true" v-if="row.isEdit" v-trim v-model="row.taxAmount" size="mini" />
                <span v-else>{{formatNumberToThousands(row.taxAmount)}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="taxExcludedAmount" :label="$t('sea.amountExcludingTax')" align="center" width="130px">
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.excludeTaxAmount`">
                <el-input :disabled="true" v-if="row.isEdit" v-trim v-model="row.excludeTaxAmount" size="mini" />
                <span v-else>{{formatNumberToThousands(row.excludeTaxAmount)}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <!--          费用金额-->
          <el-table-column  :label="$t('sea.expenseAmount')" align="center" width="130px" >
            <template slot-scope="{row,$index}">
              <el-form-item label="" :prop="`charges.${$index}.amount`" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]" >
                <el-input v-if="row.isEdit" :disabled="true" v-trim v-model="row.amount" v-input-limit="[-20,2]" size="mini"/>
                <span v-else>{{formatNumberToThousands(row.amount)}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sea.remark')" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-form-item label="" prop="remark">
                <el-input v-if="row.isEdit" v-trim v-model="row.remark" :disabled="confirmationProgress && !row.isNewAdd" size="mini" />
                <span v-else>{{row.remark}}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('sea.operating')" align="center" fixed="right" width="150" >
            <template slot-scope="{ row, $index }">
              <template v-if="row.isEdit">
                <i class="icon el-icon-folder-checked blue" @click="saveRow(row,$index)" style="margin-right: 10px"></i>
                <i class="icon el-icon-folder-delete red" v-if="dataForm.charges.length > 1"  @click="noSave(row,$index)"></i>
              </template>
              <template v-else>
                <el-button :disabled="isEdit || !viewBy || (confirmationProgress && row.entryState!=11 && !row.isNewAdd)" type="text" icon="el-icon-edit-outline" class="icon blue"  @click="chargesEdit(row,$index )"></el-button>
                <el-button :disabled="isEdit || !viewBy" type="text" icon="el-icon-circle-plus" class="icon blue"  @click="addCharges" ></el-button>
                <el-button v-show="dataForm.charges.length>1" :disabled="isEdit || !viewBy || (confirmationProgress && row.entryState!=11 && !row.isNewAdd)" type="text" icon="el-icon-remove" class="icon red"  @click="delCharges($index)"></el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div style="font-size: 18px; margin: 15px auto; color: #333">
          {{ $t('sea.totalExpenses') }}：
          <span v-for="(item,key) in totalExpensesStr" :key="key" style="margin-right: 20px">
            {{key}} {{formatNumberToThousands(item)}}
          </span>
        </div>
        <div style="display: flex;">
          <div>
            <el-checkbox :disabled="!viewBy || confirmationProgress" v-model="dataForm.autoSendEmailFlag" style="margin-left: 35px">{{$t('sea.directEmail')}}</el-checkbox>
            <!--        接收邮箱-->
            <el-form-item :label="$t('sea.receivingMailbox')" prop="receiveEmails" :rules="[{ validator: validateEmail, trigger: 'blur' }]" >
              <el-input :disabled="!viewBy || confirmationProgress" v-model="dataForm.receiveEmails" size="mini" style="width: 500px" :placeholder="$t('sea.multipleMailboxPartitions')" maxlength="500" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('sea.mailNotes')" prop="emailRemark" >
              <el-input :disabled="!viewBy || confirmationProgress" v-model="dataForm.emailRemark" size="mini" style="width: 500px" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <div v-if="isShowSystemAutomaticDefault" style="color: red; margin: 15px auto">{{$t('sea.systemAutomaticDefault')}}</div>
          </div>
          <div style="padding:20px 0 0 17%; ">
            <el-checkbox v-model="dataForm.saveTemplateFlag" @change="saveTemplateFlagChange" style="margin-left: 30px">{{$t('sea.saveAsCurrentCustomerExpenseTemplate')}}</el-checkbox>
            <el-checkbox v-if="dataForm.saveTemplateFlag" v-model="dataForm.savePriceFlag">{{$t('sea.saveExpenseItemUnitPrice')}}</el-checkbox>
            <el-form-item v-if="dataForm.saveTemplateFlag" :label="$t('sea.templateName')" prop="templateName" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-input v-if="viewBy" v-model="dataForm.templateName" size="mini" :disabled="confirmationProgress" style="width: 300px"></el-input>
              <span v-else>{{dataForm.customerAddress}}</span>
            </el-form-item>
          </div>
        </div>
        <div style="text-align: right">
          <el-button :disabled="isEdit || !viewBy" type="primary" size="mini" @click="submit">{{$t('sea.save')}}</el-button>
          <el-button size="mini" @click="cancel">{{$t('sea.cancel')}}</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {validEmail} from "@/utils/validate"
import lodash from 'lodash'
import expenseArr from './json/expense'
import {
  businessTypeCodeApi,
  chargeAdjustUpdateApi,
  chargeCommonUpdateApi, chargeDuplicateCheckApi,
  chargeSpecialUpdateApi,
  chargeSubmitApi,
  confirmationChargeCommonDetailApi,
  confirmationChargeSpecialDetailApi,
  confirmationTemplateDetailApi,
  confirmationTemplateListApi,
  dictListApi,
  getContainerSizeTypeListApi, getContainerSumWeightAndVolumeApi, getEnterpriseBaseInfoApi,
  getEntityNosApi,
  getEntityNosByEntityApi,
  listOfSettlementUnitsApi,
  memberListApi,
  rechargeModeApi,
  seaBookingCancelApi,
  seaBookingDetailApi, settlementBranchUnitApi,
  settlementOfficeListApi
} from "@/api/seaExportOrder"
import {getUserInfo} from "@/api/login"
import {formatNumberToThousands} from "@/utils"
import remoteSearchSelector from "@/views/cargo/v0/CharteredBoat/components/remoteSearchSelector";
import {
  getCurrenciesListApi,
  getRechargeModeApi,
  getSettlementHeaderApi,
  memberRoleCustomerTitleApi
} from "@/api/common";
import orderMixin from './orderMixin'

export default {
  name: 'ExpensesCostDetails',
  mixins: [orderMixin],
  props: {
    viewBy: { type: Boolean, default: true}, // 默认编辑
    orderDetailsData: { type: Object, default: () => { } },
    confirmationId: { type: String, default: null },
    isSpecificUsers: { type: Boolean, default: false}, // 是否特定用户
    entityId: { type: String, default: null },
    entityType: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      bookingJobId: this.$route.query.bookingJobId,
      dataForm: {
        charges: [],
        partnerRole: 21010
      },
      getEntityNosOps: [],
      settlementModeOps: [], // 结算方式
      settlementModeOpsCopy: [], // 结算方式
      aRSettlementUnitOps: [], // 应收结算单位
      aRSettlementUnitOpsCopy: [], // 应收结算单位
      settlementOfficeOps: [], // 收款账套
      settlementCompanyOps: [], // 结算单位
      businessTypeCodeOps: [], // 费用名称
      dictListOps: [], // 计费方式
      dictListOpsCopy: [],
      dictListOpsAll: [],
      currenciesOps: [],
      invoiceTaxOps: [], // 税率
      getContainerSizeTypeOps: [], // 箱型
      isEdit: false,
      editCopy: {},
      totalExpensesStr: {},
      userInfo: {},
      isCconfirmed: false,
      confirmationProgress: false,
      partnerRoleOps: {
        21010: this.$t('sea.customer'),
        13011: this.$t('sea.destinationAgent'),
        16012: this.$t('sea.other')
      },
      customerOptionsPorp: [],
      isShowSystemAutomaticDefault: false,
      resBookingDetail:{},
      partnerRoleParams:{
        partnerRole: 13011,
        businessType: 'SEA_EXPORT'
      },
      settlementMode:null,
      templateListOps: [],
      expenseTemplateId: null,
      isExpenseTemplate:false,
      containerSumWeightAndVolume:{},
      rowQuantity:0,
      useRegisteredAddressCompany:false
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  components: {remoteSearchSelector},
  async created() {
    this.userInfo = await getUserInfo()
    this.id = this.orderDetailsData.id
    this.bookingJobId = this.orderDetailsData.bookingJobId
    // 初始化接口
    await this.init()
    if(this.viewBy){

    if(this.dataForm.partnerRole === 13011 && this.dataForm.scmSupplierId){ // 目的港代理
      this.scmSupplierChange({
        id:this.dataForm.scmSupplierId,
        chineseName:this.dataForm.scmSupplierCnName,
      })
    }
      if (this.$isNotEmpty(this.orderDetailsData) && this.orderDetailsData.id) {
        const resListOfSettlementUnits=await listOfSettlementUnitsApi({
          businessTime:this.partnerRoleParams.businessTime,
          memberId: this.orderDetailsData.customerId,
          businessType:'SEA_EXPORT'
        })
        if(resListOfSettlementUnits.ok){
          this.aRSettlementUnitOpsCopy = lodash.cloneDeep(resListOfSettlementUnits.content)
          if(this.dataForm.partnerRole === 21010){
            this.aRSettlementUnitOps =  lodash.cloneDeep(resListOfSettlementUnits.content)
            if(resListOfSettlementUnits.content.length === 1 && !this.dataForm.settlementCompanyId){
              this.$set(this.dataForm,'settlementCompanyId',resListOfSettlementUnits.content[0].settlementCompanyId)
              this.$set(this.dataForm,'settlementMode',resListOfSettlementUnits.content[0].rechargeMode)
            }
            if(this.dataForm.settlementCompanyId){
              this.settlementCompanyChange(this.dataForm.settlementCompanyId)
            }
          }
        }
      }
    }
    // this.setDefault()
    if (this.$isEmpty(this.dataForm.charges)) {
      this.addCharges()
    }
    if(!this.dataForm.settlementOfficeId){
      this.$set(this.dataForm,'settlementOfficeId',"1")
    }
    if (this.confirmationId){
      this.totalExpenses()
    }
    this.loading = false
  },
  methods: {
    async init() {
      const promiseAll = []
      // 业务单号
      if (this.entityId) {
        const getEntityNos = getEntityNosByEntityApi({
          entityId: this.entityId,
          entityType: this.entityType
        }).then(res => {
          if (res.ok) {
            this.getEntityNosOps = res.content
          }
        })
        promiseAll.push(getEntityNos)
      } else {
        const getEntityNos = getEntityNosApi(this.id).then(res => {
          if (res.ok) {
            this.getEntityNosOps = res.content
          }
        })
        promiseAll.push(getEntityNos)
      }

      // 收款账套
      const settlementOfficeList = settlementOfficeListApi({ids: [this.id]}).then(res => {
        if (res.ok) {
          this.settlementOfficeOps = res.content //.filter(val => Number(val.value) === 1)
        }
      })
      // promiseAll.push(settlementOfficeList)
      // // 结算方式
      // const rechargeMode = rechargeModeApi().then(res => {
      //   if (res.ok) {
      //     this.settlementModeOps = res.content
      //   }
      // })
      // promiseAll.push(rechargeMode)
      // 客户结算单位
      const memberList = memberListApi(this.orderDetailsData.customerId).then(res => {
        if (res.ok) {
          this.settlementCompanyOps = res.content.map(item => ({
            value: item.settlementCompanyId,
            label: item.settlementCompanyName
          }))
        }
      })
      promiseAll.push(memberList)
      // 费用名称
      const businessTypeCode = businessTypeCodeApi().then(res => {
        if (res.ok) {
          this.businessTypeCodeOps = res.content
        }
      })
      promiseAll.push(businessTypeCode)
      // 计费方式
      const dictList8 = dictListApi(8).then(res => {
        if (res.ok) {
          res.content.map(item => {
            if (item.code === 2004 || item.code === 2005 || item.code === 1101 || item.code === 1201|| item.code === 2003) {
              this.dictListOpsCopy.push(item)
            }
          })
          this.dictListOps = this.dictListOpsCopy
          this.dictListOpsAll = res.content
        }
      })
      promiseAll.push(dictList8)
      // 税率
      const dictList6 = dictListApi(6).then(res => {
        if (res.ok) {
          this.invoiceTaxOps = res.content
        }
      })
      promiseAll.push(dictList6)
      // 币种
      const currenciesList = getCurrenciesListApi().then(res => {
        if (res.ok) {
          this.currenciesOps = res.content
        }
      })
      promiseAll.push(currenciesList)
      // 箱型

      promiseAll.push(currenciesList)
      let resCommonDetail
      if (this.confirmationId) {
        let url
        if (this.isSpecificUsers) {
          url = confirmationChargeSpecialDetailApi
        } else {
          url = confirmationChargeCommonDetailApi
        }
        const commonDetail = url(this.confirmationId).then(res => {
          if (res.ok) {
            if (this.$isEmpty(res.content.charges)) {
              res.content.charges.push({isEdit: true})
              this.isEdit = true
            }
            if (res.content.confirmationState === 2) { // 已确认
              this.isCconfirmed = true
            }
            if (res.content.confirmationState === 11) { // 确认中
              this.confirmationProgress = true
            }
            this.customerOptionsPorp.push({
              value: res.content.settlementCompanyId,
              label: res.content.settlementCompanyName
            })
            // 设置分公司默认值
            if (res.content.partnerRole === 18000) {
              // this.aRSettlementUnitOps.push({
              //   id: res.content.settlementCompanyId,
              //   chineseName: res.content.settlementCompanyName
              // })
              this.internalSettlementMethod(res.content.partnerRole)
            }
            this.totalExpenses()
            resCommonDetail = res.content
            // 箱型
            let containerSize = {
              entityId: res.content.entityId,
              entityType: res.content.entityType
            }
            getContainerSizeTypeListApi(containerSize).then(res => {
              if (res.ok) {
                this.getContainerSizeTypeOps = res.content
              }
            })
          }
        })

        promiseAll.push(commonDetail)
      } else {
        this.isEdit = true
        this.isShowSystemAutomaticDefault = true
      }
      // 模板列表
      const templateList = confirmationTemplateListApi({
        customerId: this.orderDetailsData.customerId,
        type: 'AR' // 应收
      }).then(res => {
        if (res.ok) {
          this.templateListOps = res.content
        }
      })
      promiseAll.push(templateList)
      if(this.viewBy){
        const resBookingDetail =  seaBookingDetailApi(this.bookingJobId).then(resBooking=>{
          if(resBooking.ok){
            this.$set(this.partnerRoleParams,'businessTime',resBooking.content.etd)
            this.resBookingDetail = resBooking.content
          }
        })
        promiseAll.push(resBookingDetail)
      }
      await Promise.all(promiseAll)
      if (this.confirmationId) {
        let isEntityId=this.getEntityNosOps.some(val=>val.entityId === resCommonDetail.entityId)
        if(!isEntityId){
          this.getEntityNosOps.push({
            entityId:resCommonDetail.entityId,
            entityNoDisplay: resCommonDetail.entityNoDisplay,
            disabled: true
          })
        }
        this.dataForm = resCommonDetail
      }

    },

    validateEmail(rule, value, callback) {
      if (value) {
        let emailArr = value.split(';')
        let isSome = emailArr.some(item => {
          if (!validEmail(item)) {
            callback(new Error(item + this.$t('blInfo.emailError')))
            return true
          }
        })
        if (!isSome) {
          callback()
        }
      } else {
        callback()
      }
    },
    // 应收结算单位
    settlementCompanyChange(val){
      const data = this.aRSettlementUnitOps.find(item=> item.settlementCompanyId == val)
      if(data){
        this.$set(this.dataForm,'settlementMode',data.rechargeMode)
        this.settlementModeOps = [{
          settlementMode: data.rechargeMode,
          settlementModeName: data.rechargeModeName,
        }]
      }
    },
    // 远程搜索计费方式
    dictListOpsRemoteMethod(query) {
      if (query) {
        this.dictListOps = this.dictListOpsAll.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
      } else {
        this.dictListOps = this.dictListOpsCopy
      }
    },
    dictListOpsClear() {
      this.dictListOps = this.dictListOpsCopy
    },
    entityNoChange(val) {
      this.getEntityNosOps.some(item => {
        if (item.entityId === val) {
          this.$set(this.dataForm, 'entityType', item.entityType)
          this.$set(this.dataForm, 'entityNo', item.entityNo)

          let containerSize = {
            entityId: item.entityId,
            entityType: item.entityType
          }
          getContainerSizeTypeListApi(containerSize).then(res => {
            if (res.ok) {
              if (!lodash.isEqual(this.getContainerSizeTypeOps, res.content) && this.$isNotEmpty(this.getContainerSizeTypeOps)) {
                this.getContainerSizeTypeOps = res.content
                this.$message.warning(this.$t('sea.volumeChangeAfterBusinessOrderNoChange'))
              } else {
                this.getContainerSizeTypeOps = res.content
              }
            }
          })
          getContainerSumWeightAndVolumeApi(containerSize).then(res=>{
            if(res.ok){
              this.containerSumWeightAndVolume = res.content
            }
          })
          return true
        }
      })
    },
    // 计算税额
    taxAmountCalculation(row) {
      let invoiceTaxRate = 0
      this.invoiceTaxOps.some(item => {
        if (row.invoiceTaxRate === item.code) {
          this.$set(row, 'invoiceTaxRateName', item.name)
          invoiceTaxRate = parseFloat(item.name) || 0
          return true
        }
      })
      let percentageInvoiceTaxRate = invoiceTaxRate / 100
      let amount = (row.price || 0) * (row.chargeQuantity1 || 0) // 含税金额
      let num = amount * percentageInvoiceTaxRate / (1 + percentageInvoiceTaxRate) // 税额
      let amountExcludingTaxNum = amount - num // 不含税金额

      this.$set(row, 'taxAmount', num.toFixed(2))
      this.$set(row, 'excludeTaxAmount', amountExcludingTaxNum.toFixed(2))
      this.$set(row, 'amount', amount.toFixed(2))
    },
    // 费用名称change
    feeItemCodeChange(val, row) {
      this.$set(row, 'feeItemCode', val.code)
      const resFind = expenseArr.find(item => item.expenseCode === val.code)
      if (resFind && this.$isNotEmpty(resFind)) {
        if (resFind.defaultBillingMethod === '箱') { // 2004 票  2005箱
          this.$set(row, 'unit1', 2005)
          this.$set(row, 'unitName1', '箱')
          if (this.getContainerSizeTypeOps.length === 1) {
            this.$set(row, 'containerSizeType', this.getContainerSizeTypeOps[0].containerType)
            this.$set(row, 'chargeQuantity1', this.getContainerSizeTypeOps[0].containerCount)
          }
        } else if (resFind.defaultBillingMethod === '票') {
          this.$set(row, 'unit1', 2004)
          this.$set(row, 'unitName1', '票')
          if (!row.chargeQuantity1) {
            this.$set(row, 'chargeQuantity1', 1)
          }
        }else if (resFind.defaultBillingMethod === '件') {
          this.$set(row, 'unit1', 2003)
          this.$set(row, 'unitName1', '件')
          if (!row.chargeQuantity1) {
            this.$set(row, 'chargeQuantity1', this.containerSumWeightAndVolume.sumQuantity ? this.containerSumWeightAndVolume.sumQuantity : null)
          }
        }else if (resFind.defaultBillingMethod === '每立方米') {
          this.$set(row, 'unit1', 1201)
          this.$set(row, 'unitName1', '每立方米')
          // if (!row.chargeQuantity1) {
          //   this.$set(row, 'chargeQuantity1', 1)
          // }
        }
        this.currenciesOps.some(val => {
          if (val.code === resFind.defaultCurrency) {
            this.$set(row, 'currency', resFind.defaultCurrency)
            return true
          }
        })
        // 默认税率
        if(resFind.invoiceTaxRate){
          this.$set(row, 'invoiceTaxRate', resFind.invoiceTaxRate)
        }
      }

    },
    // 计费方式change
    unit1Change(val, row) {
      this.dictListOps.some(item => {
        if (item.code === val) {
          this.$set(row, 'unitName1', item.name)
          return true
        }
      })
      this.$set(row, 'containerSizeType', '')
      this.$set(row, 'chargeQuantity1', null)
      if (val === 2004 && !row.chargeQuantity1) {
        this.$set(row, 'chargeQuantity1', 1)
      } else if (val === 2005 && this.$isNotEmpty(this.getContainerSizeTypeOps) && this.getContainerSizeTypeOps.length === 1) {
        this.$set(row, 'containerSizeType', this.getContainerSizeTypeOps[0].containerType)
        this.$set(row, 'chargeQuantity1', this.getContainerSizeTypeOps[0].containerCount)
      }else if(val === 1101){
        // 重量KGS 1101
        // 体积CBM  1201
        if(this.$isNotEmpty(this.containerSumWeightAndVolume)){
          this.$set(row, 'chargeQuantity1', this.containerSumWeightAndVolume.sumGrossWeight ? this.containerSumWeightAndVolume.sumGrossWeight : null)
        }

      }else if(val === 1201){
        if(this.$isNotEmpty(this.containerSumWeightAndVolume)){
          this.$set(row, 'chargeQuantity1', this.containerSumWeightAndVolume.sumVolume ? this.containerSumWeightAndVolume.sumVolume : null)
        }
      }else if(val === 2003){ // 件
        if(this.$isNotEmpty(this.containerSumWeightAndVolume)){
          this.$set(row, 'chargeQuantity1', this.containerSumWeightAndVolume.sumQuantity ? this.containerSumWeightAndVolume.sumQuantity : null)
        }
      }
      this.taxAmountCalculation(row)
    },
    containerSizeTypeChange(val, row) {
      this.getContainerSizeTypeOps.some(item => {
        if (item.containerType === val) {
          this.$set(row, 'chargeQuantity1', item.containerCount)
          return true
        }
      })
      this.taxAmountCalculation(row)
    },
    partnerRoleChange(val){
      this.$set(this.dataForm,'settlementCompanyId',null) // 清空应收结算单位
      this.$set(this.dataForm,'settlementCompanyName',null)
      this.aRSettlementUnitOps = []
      this.settlementModeOps = []
      this.$set(this.dataForm,'scmSupplierId',null)
      this.$set(this.dataForm,'scmSupplierCnName',null)
      this.$set(this.dataForm,'settlementModeName',null)
      this.$set(this.dataForm,'settlementMode',null)
      if(Number(val) === 21010 ){
        this.aRSettlementUnitOps = this.aRSettlementUnitOpsCopy
        // this.$set(this.dataForm,'settlementMode',this.aRSettlementUnitOpsCopy[0].rechargeMode)
        // this.settlementModeOps = [{
        //   settlementMode: this.aRSettlementUnitOpsCopy[0].rechargeMode,
        //   settlementModeName: this.aRSettlementUnitOpsCopy[0].rechargeModeName,
        // }]

        // this.setDefault()
      } else if (Number(val) === 18000) {
        this.internalSettlementMethod(val)
      }
    },
    // 内部结算的结算方式
    async internalSettlementMethod(val){
      this.loading = true
      let settlementModeOpsRes = await rechargeModeApi()
      if (settlementModeOpsRes.ok) {
        this.settlementModeOps = settlementModeOpsRes.content
      }
      let res = await settlementBranchUnitApi(val)
      this.loading = false
      if (res.ok) {
        this.aRSettlementUnitOps = res.content
      }
    },
    // 目的港代理
    async scmSupplierChange(val){
      if(this.$isEmpty(val)){
        this.$set(this.dataForm,'settlementCompanyId',null)
        this.$set(this.dataForm,'settlementCompanyName',null)
        this.$set(this.dataForm,'settlementMode',null)
        this.$set(this.dataForm,'settlementModeName',null)
        this.$set(this.dataForm,'scmSupplierCnName',null)
        // this.$set(this.dataForm,'scmSupplierId',null)
        this.aRSettlementUnitOps = []
        this.settlementModeOps = []
      }else if(this.viewBy){
        this.$set(this.dataForm,'scmSupplierCnName',val.chineseName)
        this.loading = true
      //  const res =await getSettlementHeaderApi(val.id,this.resBookingDetail.etd)
        const res =await memberRoleCustomerTitleApi({
          businessTime:this.resBookingDetail.etd,
          businessType:'SEA_EXPORT',
          memberId:val.id,
          memberRole:20
        })
        this.loading = false
        if(res.ok){
          this.aRSettlementUnitOps =  lodash.cloneDeep(res.content)
          this.settlementCompanyChange(this.dataForm.settlementCompanyId)
          if(this.$isEmpty(res.content)){
            this.$set(this.dataForm,'settlementCompanyId',null)
            this.$set(this.dataForm,'settlementCompanyName',null)
            this.$set(this.dataForm,'settlementMode',null)
            this.$set(this.dataForm,'settlementModeName',null)
          }
          this.setDefault()
        }
      }
    },
    setDefault(){
      if(this.aRSettlementUnitOps.length === 1 && !this.dataForm.settlementCompanyId){
        this.$set(this.dataForm,'settlementCompanyId',this.aRSettlementUnitOps[0].settlementCompanyId)
        this.settlementCompanyChange(this.aRSettlementUnitOps[0].settlementCompanyId)
        // this.$set(this.dataForm,'settlementMode',this.settlementModeOps[0].settlementMode)
     }
    },
    // 费用合计
    totalExpenses() {
      let num = {}
      this.dataForm.charges.map(item => {
        if (!num[item.currency]) {
          num[item.currency] = 0
        }
        num[item.currency] += Number(item.amount)
      })
      this.totalExpensesStr = num
      // let str = ''
      // if (this.$isEmpty(num)) {
      //   this.totalExpensesStr = null
      // } else {
      //   for (let key in num) {
      //     str += `${num[key].toFixed(2)} ${key}       `
      //   }
      //   this.totalExpensesStr = str
      // }
    },
    addCharges() {
      this.dataForm.charges.push({
        isEdit: true,
        isNewAdd: true,
        isNewAddThisTime: true,
        invoiceTaxRate: this.invoiceTaxOps[0].code
      })
      this.isEdit = true
      this.isShowSystemAutomaticDefault = true
    },
    delCharges(i) {
      this.dataForm.charges.splice(i, 1)
      this.totalExpenses()
    },
    chargesEdit(row) {
      if (row.unit1 === 2004 || row.unit1 === 2005) {
        this.dictListOps = this.dictListOpsCopy
      } else {
        this.dictListOps = this.dictListOpsAll
      }
      this.editCopy = lodash.cloneDeep(row)
      this.$set(row, 'isEdit', true)
      this.isEdit = true
    },
    saveRow(row, $index) {
      let fieldName = [
        'charges.' + $index + '.feeItemName',
        'charges.' + $index + '.feeItemCode',
        'charges.' + $index + '.unit1',
        'charges.' + $index + '.currency',
        'charges.' + $index + '.price',
        'charges.' + $index + '.chargeQuantity1',
        'charges.' + $index + '.invoiceTaxRate',
        'charges.' + $index + '.amount'
      ]
      if (row.unit1 === 2005) {
        fieldName.push('charges.' + $index + '.containerSizeType')
      }
      let flag = true
      this.$refs.dataForm.validateField(fieldName, valid => {
        if (valid !== '') {
          flag = false

        }
      })
      if (flag) {
        this.dictListOps = this.dictListOpsCopy
        this.$set(row, 'isEdit', false)
        this.$set(row, 'isNewAddThisTime', false)
        this.isEdit = false
        this.totalExpenses()
        this.checkData()
      }
    },
    checkData(){
      this.dataForm.charges.some(val=>{
        if( (Number(val.unit1) === 2005 && !val.containerSizeType) || !val.chargeQuantity1 ){ // 箱
          this.$set(val, 'isEdit', true)
          this.isEdit = true
          return true
        }
      })
    },
    noSave(row, i) {
      this.$refs.dataForm.clearValidate()
      this.$set(this.dataForm.charges, i, this.editCopy)
      this.$set(row, 'isEdit', false)
      this.isEdit = false
      if (row.isNewAddThisTime) {
        this.dataForm.charges.splice(i, 1)
      }
      this.checkData()
    },
    submit() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.getChargeDuplicateCheck()
        }
      })
    },
    async submitApi(overwrite = 1){
      this.loading = true
      let url
      if(overwrite === 2){
        this.dataForm.saveTemplateFlag = false
      }
      if (this.dataForm.confirmationId) { // 编辑
        if (Number(this.dataForm.confirmationState) === 11) { // 调整中
          url = chargeAdjustUpdateApi
        } else {
          if (this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:update_special') > -1) { // 特定用户
            url = chargeSpecialUpdateApi
          } else { // 普通用户
            url = chargeCommonUpdateApi
          }
        }

      } else {
        url = chargeSubmitApi
      }
      const res = await url(this.dataForm)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('changePage', 1)
      }
    },
    async getChargeDuplicateCheck(){
      if(!this.dataForm.saveTemplateFlag){
        this.submitApi()
        return
      }
      let params = {
        customerId: this.orderDetailsData.customerId,
        type: 'AR',
        templateName: this.dataForm.templateName,
      }
      this.loading = true
      const res = await chargeDuplicateCheckApi(params)
      if(res.ok){
        if(res.code === '0'){
          this.submitApi()
        }else if(res.code === '560807'){  // 模板名称重复，是否覆盖原有模板？
            this.$confirm(this.$t('sea.duplicateTemplateName'), this.$t('sea.tips'), {
              showClose:false,
              confirmButtonText: this.$t('sea.true'),
              cancelButtonText: this.$t('sea.false'),
              type: 'warning'
            }).then(async() => {
              this.submitApi()
            }).catch(async() => {
              this.submitApi(2)
            })
          }
      }

    },
    cancel() {
      this.$emit('changePage', 1)
    },
    setCustomerInfo(id, name) {
      this.$set(this.dataForm, 'settlementCompanyId', id)
      this.$set(this.dataForm, 'settlementCompanyName', name)
    },
    formatNumberToThousands(value) {
      return formatNumberToThousands(value)
    },
    async expenseTemplateChange(id){
      this.loading = true
      const res = await confirmationTemplateDetailApi(id)
      this.loading = false
      if(res.ok){
        res.content.seaConfirmationChargeTemplateItemList.map(val=>{
          val.isNewAddThisTime = true
          if(Number(val.unit1) === 2005){
            if(this.getContainerSizeTypeOps.length === 1){
              val.containerSizeType = this.getContainerSizeTypeOps[0].containerType
              val.chargeQuantity1 = this.getContainerSizeTypeOps[0].containerCount
            }
          }else{
            val.chargeQuantity1 = 1
          }
          this.taxAmountCalculation(val)
        })
        let isSome =res.content.seaConfirmationChargeTemplateItemList.some(val=>{
          if( (Number(val.unit1) === 2005 && !val.containerSizeType ) || !val.chargeQuantity1 || !val.price){ // 箱
            val.isEdit = true
            this.isEdit = true
            return true
          }
        })
        if(!isSome){
          this.isEdit = false
        }
        this.$set(this.dataForm,'charges', res.content.seaConfirmationChargeTemplateItemList)
        this.totalExpenses()
      }
    },
    saveTemplateFlagChange(val){
      if(val){
        this.$set(this.dataForm,'templateName',`${lodash.cloneDeep(this.orderDetailsData.customerShortName)}-${this.orderDetailsData.polCode}-${this.orderDetailsData.podCode}-AR`)
      }else{
        this.$set(this.dataForm,'templateName',null)
      }
    },
    validate0(rule, value, callback){
      if (Number(value) === 0) {
        callback(new Error())
      } else {
        callback()
      }
    },
    async useRegisteredChange(val){
      if(val){
        this.loading= true
        const res = await getEnterpriseBaseInfoApi(this.orderDetailsData.customerId)
        this.loading = false
        if(res.ok){
          this.$set(this.dataForm,'customerAddress',res.content.registeredAddress)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
::v-deep {
  .el-form-item__label{ width: 95px}
}
.wrap{justify-content: space-between; flex-wrap: wrap}
.title ::v-deep{
  .el-form-item__content{ width: calc(93% - 95px); min-width: 100px;}
}
.case-data-table ::v-deep{
  .el-form-item{ margin: 10px 0}
}
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none; overflow: initial;
  &:hover{ transform: scale(1.1)}
}
.el-icon-circle-close{ font-size: 14px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
.data-table ::v-deep {
  .el-form-item__error{ display: none}
  .el-form-item{ margin: 10px 0;}
}
</style>
