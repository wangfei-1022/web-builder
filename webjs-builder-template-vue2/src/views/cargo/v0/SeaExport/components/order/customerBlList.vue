<template>
  <div class="box" v-loading="loading">
    <el-button type="primary" v-if="orderDetailsData.isUnlocked && Number(editableTabsValue) === 4" @click="addCustomerBill" size="medium"  icon="el-icon-plus" class="addCustomerBill">{{$t('sea.addCustomerBill')}}</el-button>

    <el-empty v-if="$isEmpty(listData)" :description="$t('sea.noData')"></el-empty>
    <el-form v-else :inline="true" :model="dataForm" @submit.native.prevent ref="customerInformationForm">
      <div v-for="(item,index) in listData" :key="index">

        <div class="box_title" v-if="Number(editableTabsValue) === 4">{{ item.memberBlNo }}</div>
        <div class="box_title" v-if="Number(editableTabsValue) === 5">{{ item.carrierBlNo }}</div>
        <div class="box_child">
          <div class="flex-bet" style=" flex-wrap:nowrap; position: relative">
            <div class="bookingStatus" v-if="Number(editableTabsValue) === 5" :class="'bookingStatus'+item.jobState">{{ item.jobStateName }}</div>
            <div class="flex-bet bill-list" style=" flex-wrap:wrap;justify-content: flex-start;">
<!--              1-->
              <el-form-item :label="$t('sea.BlType')" prop="receiptCode" size="mini">
                <span v-if="item.blSignType === 1">MBL</span>
                <span v-else-if="item.blSignType === 2">HBL</span>
              </el-form-item>
              <el-form-item :label="$t('sea.issuingMethod')" prop="receiptCode" size="mini">{{item.releaseMode}}</el-form-item>
              <el-form-item :label="$t('sea.payMethod')" prop="receiptCode" size="mini">{{item.freightTerm}}</el-form-item>
<!--              2-->
              <el-form-item :label="$t('sea.pol2')" prop="polCode" >{{item.pol}}</el-form-item>
              <el-form-item :label="$t('sea.pod')" prop="pod" class="pod">{{item.pod}}</el-form-item>
              <el-form-item v-if="item.jobState === 20" :label="$t('sea.reasonForFailure')" prop="supplementaryFailReason" class="pod">{{item.supplementaryFailReason}}</el-form-item>
              <el-form-item v-else-if="item.jobState === 40" :label="$t('sea.carrierBlNo')" prop="originFileName" class="pod">
                <el-button type="text" @click="viewcarrierBlNo(item.url)">{{item.originFileName}}</el-button>
              </el-form-item>
              <el-form-item v-else label=""></el-form-item>
<!--              <el-form-item v-if="Number(editableTabsValue) === 5 && item.memberBlSignType === 2" :label="$t('sea.soNoSon')" prop="receiptCode" size="mini">-->
<!--&lt;!&ndash;              <el-form-item v-if="Number(editableTabsValue) === 5 && item.memberBlSignType === 2" :label="$t('sea.masterOrderNumber')" prop="receiptCode" size="mini">&ndash;&gt;-->
<!--                <div v-for="memberBlNo in item.memberBlNo" :key="memberBlNo">{{memberBlNo}}</div>-->
<!--              </el-form-item>-->
<!--              客户提单类型为HBL时，需显示主单号字段-->
<!--              <el-form-item v-else-if="Number(editableTabsValue) === 4 && item.blSignType === 2" :label="$t('sea.masterOrderNumber')" prop="receiptCode" size="mini">-->
<!--                {{item.carrierBlNo}}-->
<!--              </el-form-item>-->
<!--              <el-form-item v-else label=""></el-form-item>-->
<!--              3-->
              <el-form-item :label="$t('sea.boxQuantity')" prop="podCode">{{item.containerTypeQty}}</el-form-item>
              <el-form-item :label="$t('sea.number')" prop="podCode">{{item.quantity}} {{item.packageType}}</el-form-item>
              <el-form-item label=""></el-form-item>
              <!--4-->
              <el-form-item :label="$t('sea.weight')" prop="contactCnName" size="mini">{{item.weight.toFixed(3)}} KGS</el-form-item>
              <el-form-item :label="$t('sea.volume2')" prop="contactCnName" size="mini">{{formatNumberToThousands(item.volume)}} CBM</el-form-item>
              <el-form-item label=""></el-form-item>

              <el-form-item :label="$t('sea.contact')" prop="transportTermCode" size="mini" class="shipping_method notifyAddress">{{item.shipperAddress}}</el-form-item>
              <el-form-item :label="$t('sea.consignee')" prop="transportTermCode" size="mini" class="shipping_method notifyAddress">{{item.consigneeAddress}}</el-form-item>
              <el-form-item :label="$t('sea.alertOthers')" prop="polCode" class="notifyAddress">{{item.notifyAddress}}</el-form-item>
            </div>
          </div>
<!--          <div class="flex-bet" style=" flex-wrap:nowrap">-->
<!--            <div style="width: 430px">-->
<!--              <el-form-item :label="$t('sea.BlType')" prop="receiptCode" size="mini">-->
<!--                <span v-if="item.blSignType === 1">MBL</span>-->
<!--                <span v-else-if="item.blSignType === 2">HBL</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item :label="$t('sea.pol2')" prop="polCode" >{{item.pol}}</el-form-item>-->
<!--              <el-form-item :label="$t('sea.boxQuantity')" prop="podCode">{{item.containerTypeQty}}</el-form-item>-->
<!--              <el-form-item :label="$t('sea.weight')" prop="contactCnName" size="mini">{{item.weight.toFixed(3)}} KGS</el-form-item>-->
<!--              <el-form-item :label="$t('sea.contact')" prop="transportTermCode" size="mini" class="shipping_method">{{item.shipperAddress}}</el-form-item>-->
<!--            </div>-->
<!--            <div style="width: 430px">-->
<!--              <el-form-item :label="$t('sea.issuingMethod')" prop="receiptCode" size="mini">{{item.releaseMode}}</el-form-item>-->
<!--              <el-form-item :label="$t('sea.pod')" prop="polCode" class="pod">{{item.pod}}</el-form-item>-->
<!--              <el-form-item :label="$t('sea.number')" prop="podCode">{{item.quantity}} {{item.packageType}}</el-form-item>-->
<!--              <el-form-item :label="$t('sea.volume2')" prop="contactCnName" size="mini">{{formatNumberToThousands(item.volume)}} CBM</el-form-item>-->
<!--              <el-form-item :label="$t('sea.consignee')" prop="transportTermCode" size="mini" class="shipping_method">{{item.consigneeAddress}}</el-form-item>-->
<!--            </div>-->
<!--            <div  style="width: 430px">-->
<!--              <el-form-item :label="$t('sea.payMethod')" prop="receiptCode" size="mini">{{item.freightTerm}}</el-form-item>-->
<!--              <el-form-item v-if="Number(editableTabsValue) === 5" :label="$t('sea.soNoSon')" prop="receiptCode" size="mini">-->
<!--                <div v-for="memberBlNo in item.memberBlNo" :key="memberBlNo">{{memberBlNo}}</div>-->
<!--              </el-form-item>-->
<!--              <el-form-item :label="$t('sea.alertOthers')" prop="polCode" >{{item.notifyAddress}}</el-form-item>-->
<!--            </div>-->
<!--&lt;!&ndash;            未对单 已对单&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="unmatched oneToOne">{{$t('sea.unmatched')}}</div>&ndash;&gt;-->
<!--          </div>-->
<!--          cocos-->
          <div v-if="Number(orderDetailsData.carrierId) === 5" class="operate-buttons-left" style="text-align: right">
            <!--{{ dynamicHeightFactor }}, {{ isShowingMoreSearchCondition }}, {{ searchItemHeight }}-->
<!--            80订单处理中-->
            <el-button v-if="orderDetailsData.isUnlocked && [30,40,50,80].indexOf(orderDetailsData.orderState)>-1 && Number(editableTabsValue) === 4" type="primary"  size="mini" @click="edit(item.id)">{{$t('sea.edit')}}</el-button>

            <el-button v-else-if="orderDetailsData.isUnlocked && [-1,20,30,40].indexOf(item.jobState)>-1 && Number(editableTabsValue) === 5" type="primary"  size="mini" @click="edit(item.id)">{{$t('sea.edit')}}</el-button>
<!--            <el-button v-if="Number(editableTabsValue) === 5" type="primary"  size="mini" @click="uploadCarrierBill(item.id)">{{$t('sea.uploadBl')}}</el-button>-->
            <el-button v-if="Number(editableTabsValue) === 4 && item.blSignType === 1 && orderDetailsData.orderState != 100" type="primary"  size="mini" @click="printSample(item.id,'SEA_MBL')">{{$t('sea.printSample')}}</el-button>
<!--            HBL-->
            <el-button v-if="Number(editableTabsValue) === 4 && item.blSignType === 2 && orderDetailsData.orderState != 100" type="primary"  size="mini" @click="printSample(item.id,'CUSTOMER_BL')">{{$t('sea.printSample')}}</el-button>
            <!--      发送补料 -->
            <el-button v-if="orderDetailsData.isUnlocked && [-1,20].indexOf(item.jobState)>-1 && Number(editableTabsValue) === 5" type="primary" @click="sendReplenishment(item.id)" size="mini">{{ $t('sea.sendReplenishment') }}</el-button>
            <!--      补料完成 草稿 [-1].indexOf(item.jobState)>-1 &&-->
            <el-button v-if="orderDetailsData.isUnlocked && [-1,10,20,30].indexOf(item.jobState)>-1 && Number(editableTabsValue) === 5" type="primary" @click="replenishmentCompleted(item.id)" size="mini">{{ $t('sea.replenishmentCompleted') }}</el-button>

            <el-button v-if="Number(editableTabsValue) === 5" type="primary"  size="mini" @click="printSample(item.id,'EB_PACKING_INFORMATION')">{{$t('sea.exportPackingData')}}</el-button>

<!--            <el-button v-if="[30,40,50].indexOf(orderDetailsData.orderState)>-1" type="primary"  size="mini" @click="invitationSingle(item.id)">{{$t('sea.invitationSingle')}}</el-button>-->
          </div>
          <div v-else class="operate-buttons-left" style="text-align: right">
            <!--            80订单处理中-->
            <el-button v-if="orderDetailsData.isUnlocked && [30,40,50,80].indexOf(orderDetailsData.orderState)>-1 && Number(editableTabsValue) === 4" type="primary"  size="mini" @click="edit(item.id)">{{$t('sea.edit')}}</el-button>

            <el-button v-else-if="orderDetailsData.isUnlocked && [-1,20,30,40].indexOf(item.jobState)>-1 && Number(editableTabsValue) === 5" type="primary"  size="mini" @click="edit(item.id)">{{$t('sea.edit')}}</el-button>
            <!--            <el-button v-if="Number(editableTabsValue) === 5" type="primary"  size="mini" @click="uploadCarrierBill(item.id)">{{$t('sea.uploadBl')}}</el-button>-->
            <el-button v-if="Number(editableTabsValue) === 4 && item.blSignType === 1 && orderDetailsData.orderState != 100" type="primary"  size="mini" @click="printSample(item.id,'SEA_MBL')">{{$t('sea.printSample')}}</el-button>
            <!--            HBL-->
            <el-button v-if="Number(editableTabsValue) === 4 && item.blSignType === 2 && orderDetailsData.orderState != 100" type="primary"  size="mini" @click="printSample(item.id,'CUSTOMER_BL')">{{$t('sea.printSample')}}</el-button>
            <!--      补料完成 草稿 [-1].indexOf(item.jobState)>-1 &&-->
            <el-button v-if="orderDetailsData.isUnlocked && [-1,10,20,30].indexOf(item.jobState)>-1 && Number(editableTabsValue) === 5" type="primary" @click="replenishmentCompleted(item.id)" size="mini">{{ $t('sea.replenishmentCompleted') }}</el-button>
            <el-button v-if="Number(editableTabsValue) === 5" type="primary"  size="mini" @click="printSample(item.id,'EB_PACKING_INFORMATION')">{{$t('sea.exportPackingData')}}</el-button>

          </div>

        </div>
      </div>

    </el-form>
    <DataImport  v-if="Number(editableTabsValue) === 5" :btnText="updateMsg.btnText" :code="updateMsg.code" :name="updateMsg.name" :showDataImportDialog.sync="showDataImportDialog" @close="colseDialog"
                :isDownloadExcel.sync="isDownloadExcel">
    </DataImport>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />
    <sendReplenishment v-if="sendReplenishmentDialog" :showDialog.sync="sendReplenishmentDialog"  @submitCallBack="sendReplenishmentCallBack"></sendReplenishment>
    <replenishmentAccountNo v-if="replenishmentAccountNoDialog" :showDialog.sync="replenishmentAccountNoDialog"  @submitCallBack="replenishmentAccountNoCallBack"></replenishmentAccountNo>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {
  carrierBlUploadApi,
  seaBlListApi,
  seaCarrierBlListApi, sendSupplementaryApi,
  supplementaryCompleted,
  updateAndSendSupplementary
} from "@/api/seaExportOrder"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import {deepCloneMethod} from "@/utils"
import { formatNumberToThousands } from '@/utils'
import DataImport from "@/components/DataImport"
import sendReplenishment from "@/views/cargo/v0/SeaExport/components/order/Popup/sendReplenishment";
import replenishmentAccountNo from "@/views/cargo/v0/SeaExport/components/order/Popup/replenishmentAccountNo";
import orderMixin from "./orderMixin"
export default {
  name: 'CustomerBlInfo',
  mixins: [orderMixin ],
  props: {
    uploadRadioType: { type: String, default: null },
    orderDetailsData: { type: Object, default: () => {} },
    editableTabsValue: { type: String, default: '4' }
  },
  components: {reportListDialog, DataImport,sendReplenishment,replenishmentAccountNo},
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      dataForm: {},
      listData: {},
      reportDialog: { // 打印报表对话框
        isShow: false,
        typeCode: '',
        data: {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: ''
        }
      },
      batchPrintMultipleForm: {}, // 批量打印用的条件
      showDataImportDialog: false,
      updateMsg: {},
      isDownloadExcel: false,
      sendReplenishmentDialog:false,
      replenishmentAccountNoDialog:false,
      nowBlJobId:null
    }
  },
  computed: {
    url() {
      return URL
    },
    getListData() {
      return this.listData
    }
  },
  watch: {
    orderDetailsData(val) {
      this.dataForm = val
    }
  },
  created() {
    this.dataForm = this.orderDetailsData
    this.list(this.dataForm.id)
  },
  methods: {
    addCustomerBill() {
      this.$emit('addCustomerBill')
    },
    formatNumberToThousands(val) {
      return formatNumberToThousands(val, false)
    },
    async list(id) {
      this.loading = true
      let url = Number(this.editableTabsValue) === 4 ? seaBlListApi : seaCarrierBlListApi
      const res = await url(id)
      if (Number(this.editableTabsValue) === 4) {
        const resCarrier = await seaCarrierBlListApi(id)
        this.$emit('returnshipBossBlListLen', this.$isNotEmpty(resCarrier.content))
      }
      this.loading = false
      if (res.ok) {
        if (Number(this.editableTabsValue) === 5) {
          res.content.map(item => {
            item.memberBlNo = item.memberBlNo.split(',')
          })
        }
        this.listData = res.content
      }
    },
    edit(id) {
      this.$emit('changePage', 2, id)
    },
    // 上传船司提单
    uploadCarrierBill() {
      this.updateMsg = {
        btnText: this.$t('sea.uploadBill'),
        code: 'AE_CARRIER_BL',
        name: '船司提单'
      }
      this.showDataImportDialog = true
    },
    colseDialog() {
      this.updateMsg = {
        btnText: '',
        code: '',
        name: ''
      }
      this.showDataImportDialog = false
    },
    invitationSingle() {},
    // * 打印
    printSample(id, type) {
      this.reportDialog.typeCode = type // 'SEA_MBL' 打印客户提单 EB_PACKING_INFORMATION 导出装箱数据
      const entityIdList = [id]
      // sampleFlag = 1 // 打印样单按钮仅用于输出样单
      const queryConditionJson = {sampleFlag: 1}
      this.reportDialog.data = { jobId: '', queryConditionJson: queryConditionJson, entityIdList }
      this.reportDialog.isShow = true
    },
    // 发送补料
    sendReplenishment(id){
      this.nowBlJobId = id
      this.sendReplenishmentDialog = true
    },
    async sendReplenishmentCallBack(val){
      let data = {
        supplementaryAccount:val.supplementaryAccount,
        blJobId:this.nowBlJobId
      }
      this.loading = true
      let res = await sendSupplementaryApi(data)
      this.loading = false
      if(res.ok){
        this.list(this.dataForm.id)
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('returnBillDetails')
      }

    },
    // 补料完成
    replenishmentCompleted(id){
      this.nowBlJobId = id
      this.replenishmentAccountNoDialog = true
    },
    async replenishmentAccountNoCallBack(val){
      let data = val
      this.loading = true
      let res = await carrierBlUploadApi(data,this.nowBlJobId)
      this.loading = false
      if(res.ok){
        this.list(this.dataForm.id)
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('returnBillDetails')
      }
    },
    viewcarrierBlNo(url){
      window.open(url)
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
//**
.oneToOne{font-size: 28px; font-weight: 500; transform: rotate(25deg); padding: 8px 12px; border-radius: 15px; margin-top: 30px;}
.unmatched{ border:4px solid rgb(255,204,102); color:rgb(255,204,102)  }
.matched{ border:4px solid rgb(255,255,255); color:rgb(255,255,255) }
.addCustomerBill{ width: 100%; margin: 12px auto}
::v-deep {
  //.el-form-item__label{ width: 95px; text-align: right}
}
.pod{
  ::v-deep .el-form-item__content{ width: calc(100% - 95px);}
}
.bill-list{
  ::v-deep .el-form-item{ margin-right: 0; width: 33.33%}
}
.notifyAddress{
  ::v-deep .el-form-item__content{ width: 100%;}
}
.bookingStatus {
  position: absolute;
  width: 200px;
  height: 80px;
  line-height: 80px;
  transform: rotate(20deg);
  top: 100px;
  //left: 0px;
  right: 20%;
  margin: auto;
  font-size: 34px;
  text-align: center;
  border-radius: 12px;
  pointer-events: none;
}
.bookingStatus40 {
  border: 2px solid #67c23a;
  color: #67c23a;
}
.bookingStatus-1,.bookingStatus100,.bookingStatus0 {
  border: 2px solid #909399;
  color: #909399;
}
.bookingStatus10 {
  border: 2px solid #e6a23c;
  color: #e6a23c;
}
.bookingStatus20 {
  border: 2px solid red;
  color: red;
}
.bookingStatus30 {
  border: 2px solid #1890ff;
  color: #1890ff;
}
.bookingStatus100 {
  border: 2px solid red;
  color: red;
}
.bookingStatus110 {
  border: 2px solid red;
  color: red;
}
</style>
