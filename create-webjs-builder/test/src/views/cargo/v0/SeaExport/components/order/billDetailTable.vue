<template>
  <div class="box" v-loading="loading">
    <el-table :data="dataList" style="width: 100%; margin: 10px 0;" ref="multipleTable"  max-height="250" >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-if="type===1" prop="memberBlNo" :label="$t('sea.billNo')"></el-table-column>
      <el-table-column v-if="type===2" prop="carrierBlNo" :label="$t('sea.billNo')"></el-table-column>
      <el-table-column prop="containerTypeQty" :label="$t('sea.boxQuantity')"></el-table-column>
      <el-table-column v-if="type===1" prop="jobStateName" :label="$t('sea.oneToOneStatus')"></el-table-column>
      <el-table-column prop="blType" :label="$t('sea.billType')">
        <template slot-scope="{row}">
          <span v-if="row.blSignType === 1">MBL</span>
          <span v-if="row.blSignType === 2">HBL</span>
        </template>
      </el-table-column>

      <el-table-column v-if="type===2" prop="jobStateName" :label="$t('sea.billOfLadingStatus')"></el-table-column>
      <el-table-column prop="quantity" :label="$t('sea.number')"></el-table-column>
      <el-table-column prop="weight" :label="$t('sea.grossWeight')"></el-table-column>
      <el-table-column prop="volume" :label="$t('sea.volume')"></el-table-column>

      <el-table-column v-if="type===1" prop="carrierBlNo" :label="$t('sea.shipSBillNo')"></el-table-column>
      <el-table-column v-if="type===2" prop="memberBlNo" :label="$t('sea.customerBillNo')"></el-table-column>
      <el-table-column prop="releaseMode" :label="$t('sea.issuingMethod')"></el-table-column>
      <el-table-column :label="$t('sea.operating')">
        <template slot-scope="{row}">
          <template v-if="type === 1">
            <el-button  type="text" size="medium" v-if="orderDetailsData.isUnlocked" @click="editShip(row)" icon="el-icon-edit" class="icon blue"></el-button>
            <el-button  type="text" size="medium" v-if="row.blSignType === 1"  @click="batchPrint(row.id,'SEA_MBL')" icon="el-icon-download" class="icon blue"></el-button>
            <el-button  type="text" size="medium" v-if="row.blSignType === 2"  @click="batchPrint(row.id,'CUSTOMER_BL')" icon="el-icon-download" class="icon blue"></el-button>
            <el-button  type="text" size="medium" v-if="orderDetailsData.isUnlocked" @click="delCustomerBl(row)" icon="el-icon-delete" class="icon red"></el-button>
          </template>
          <template v-else>
<!--            COSCO-->
            <template v-if="Number(orderDetailsData.carrierId) === 5">
              <el-button  v-if="orderDetailsData.isUnlocked && row.jobState !==10" type="text" size="medium"   @click="editShip(row)" icon="el-icon-edit" class="icon blue"></el-button>
              <el-button  type="text" size="medium"   @click="batchPrint(row.id)" icon="el-icon-download" class="icon blue"></el-button>
              <!--            <el-button  type="text" size="medium"   @click="uploadCarrierBill()" icon="el-icon-upload" class="icon blue"></el-button>-->
              <!--      发送补料 草稿 -->
              <el-tooltip class="item" effect="dark" :content="$t('sea.sendReplenishment')" placement="top-start">
                <el-button v-if="orderDetailsData.isUnlocked && [-1,20].indexOf(row.jobState)>-1" type="text" @click="sendReplenishment(row.id)" size="medium" icon="el-icon-s-promotion" class="icon blue"></el-button>
              </el-tooltip>
              <!--      补料完成 草稿 [-1].indexOf(item.jobState)>-1 &&-->
              <el-tooltip class="item" effect="dark" :content="$t('sea.replenishmentCompleted')" placement="top-start">
                <el-button v-if="orderDetailsData.isUnlocked && [-1,10,20,30].indexOf(row.jobState)>-1" type="text" @click="replenishmentCompleted(row.id)" size="medium" icon="el-icon-upload" class="icon blue"></el-button>
              </el-tooltip>
            </template>
            <template v-else>
              <el-button  v-if="orderDetailsData.isUnlocked && row.jobState !==10" type="text" size="medium"   @click="editShip(row)" icon="el-icon-edit" class="icon blue"></el-button>
              <el-tooltip class="item" effect="dark" :content="$t('sea.replenishmentCompleted')" placement="top-start">
                <el-button v-if="orderDetailsData.isUnlocked && [-1,10,20,30].indexOf(row.jobState)>-1" type="text" @click="replenishmentCompleted(row.id)" size="medium" icon="el-icon-upload" class="icon blue"></el-button>
              </el-tooltip>
              <el-button  type="text" size="medium"   @click="batchPrint(row.id)" icon="el-icon-download" class="icon blue"></el-button>
            </template>

          </template>
        </template>
      </el-table-column>
    </el-table>
    <sendReplenishment v-if="sendReplenishmentDialog" :showDialog.sync="sendReplenishmentDialog"  @submitCallBack="sendReplenishmentCallBack"></sendReplenishment>
    <replenishmentAccountNo v-if="replenishmentAccountNoDialog" :showDialog.sync="replenishmentAccountNoDialog"  @submitCallBack="replenishmentAccountNoCallBack"></replenishmentAccountNo>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import {carrierBlUploadApi, sendSupplementaryApi} from "@/api/seaExportOrder";
import sendReplenishment from "@/views/cargo/v0/SeaExport/components/order/Popup/sendReplenishment";
import replenishmentAccountNo from "@/views/cargo/v0/SeaExport/components/order/Popup/replenishmentAccountNo";
import orderMixin from './orderMixin'

export default {
  name: 'BillDetailTable',
  mixins: [orderMixin],
  props: {
    dataList: { type: Array, default: () => [] },
    orderDetailsData: { type: Object, default: () => {
      return {}
    } },
    type: { type: Number, default: 1 }, // 1客户提单 2船司提单
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      sendReplenishmentDialog:false,
      replenishmentAccountNoDialog:false,
      nowBlJobId:null
    }
  },
  components:{sendReplenishment,replenishmentAccountNo},
  computed: {
    url() {
      return URL
    }
  },
  created() {},
  methods: {
    getSelect() {
      return this.$refs.multipleTable.selection
    },
    delCustomerBl(id) {
      this.$emit('delCustomerBl', id)
    },
    batchPrint(id, type) {
      this.$emit('batchPrint', id, type)
    },
    uploadCarrierBill() {
      this.$emit('uploadCarrierBill')
    },
    editShip(row) {
      this.$emit('editBl', row)
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
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.uploadCarrierBill()
        this.$emit('restOrderData')
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
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.uploadCarrierBill()
        this.$emit('restOrderData')
      }
    },
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
.blue{ color: #1890ff}
.red{color: #ff4949}

//**
</style>
