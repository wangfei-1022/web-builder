<template>
  <div class="box" v-loading="loading">
<!--    客户提单 第一页-->
    <CustomerBlEditA
      v-if="editPage ===1 && $isNotEmpty(dataForm) && Number(editableTabsValue) === 4"
      @changePage="changePage"
      @returnBillDetails="returnBillDetails"
      @updateForm="updateForm"
      :blId="blId"
      :orderDetailsData="orderDetailsData"
      :editableTabsValue="editableTabsValue"
      :dataForm="dataForm">
    </CustomerBlEditA>
    <!--    客户提单 第二页HBL-->
    <CustomerBlEdit2HBL
      v-if="editPage ===2 && $isNotEmpty(dataForm) && dataForm.blSignType ===2 && Number(editableTabsValue) === 4"
      @changePage="changePage"
      @returnBillDetails="returnBillDetails"
      :blId="blId" :cargoIds="cargoIds"
      :editableTabsValue="editableTabsValue"
      @updateForm="updateForm"
      :orderDetailsData="orderDetailsData"
      :dataForm="dataForm"
      v-on="$listeners"
      :type="type">
    </CustomerBlEdit2HBL>
<!--    客户提单 第二页MBL-->
    <CustomerBlEdit2MBL
      v-if="editPage ===2 && $isNotEmpty(dataForm) && dataForm.blSignType ===1 && Number(editableTabsValue) === 4"
       @changePage="changePage"
       @returnBillDetails="returnBillDetails"
       :blId="blId" :cargoIds="cargoIds"
       :editableTabsValue="editableTabsValue"
       @updateForm="updateForm"
       :orderDetailsData="orderDetailsData"
       :dataForm="dataForm"
       :type="type">
    </CustomerBlEdit2MBL>
    <!--    船司提单 第一页-->
    <CarrierBlEdit
      v-if="editPage ===1 && $isNotEmpty(dataForm) && Number(editableTabsValue) === 5"
      @changePage="changePage"
      :blId="blId"
      @returnBillDetails="returnBillDetails"
      @updateForm="updateForm"
      :orderDetailsData="orderDetailsData"
      :editableTabsValue="editableTabsValue"
      :dataForm="dataForm">
    </CarrierBlEdit>
<!--   船司提单第二页 MBL-->
    <carrierBlEdit2MBL
      v-if="editPage ===2 && $isNotEmpty(dataForm)&& dataForm.blSignType ===1 && Number(editableTabsValue) === 5"
      @changePage="changePage"
      @returnBillDetails="returnBillDetails"
      :blId="blId" :cargoIds="cargoIds"
      :editableTabsValue="editableTabsValue"
      @updateForm="updateForm"
      :orderDetailsData="orderDetailsData"
      :dataForm="dataForm"
      :type="type">
    </carrierBlEdit2MBL>
    <!--   船司提单第二页 HBL-->
    <carrierBlEdit2HBL
      v-if="editPage ===2 && $isNotEmpty(dataForm)&& dataForm.blSignType ===2 && Number(editableTabsValue) === 5"
      @changePage="changePage"
      @returnBillDetails="returnBillDetails"
      :blId="blId" :cargoIds="cargoIds"
      :editableTabsValue="editableTabsValue"
      @updateForm="updateForm"
      :orderDetailsData="orderDetailsData"
      :dataForm="dataForm"
      :type="type"
    >
    </carrierBlEdit2HBL>

  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import CustomerBlEditA from './customerBlEditA'
import CarrierBlEdit from './carrierBlEdit'
import CustomerBlEdit2MBL from './customerBlEdit2MBL'
import CustomerBlEdit2HBL from './customerBlEdit2HBL'
import carrierBlEdit2MBL from './carrierBlEdit2MBL'
import carrierBlEdit2HBL from './carrierBlEdit2HBL'
import {seaBlDetailApi, seaBlInitializeApi, seaCarrierDetailApi, seaOrderInfoApi} from "@/api/seaExportOrder"
import lodash from 'lodash'
export default {
  name: 'CustomerBlEditBox',
  components: {CustomerBlEditA, CarrierBlEdit, CustomerBlEdit2MBL, CustomerBlEdit2HBL, carrierBlEdit2MBL,carrierBlEdit2HBL},
  props: {
    uploadRadioType: { type: String, default: null },
    orderDetailsData: { type: Object, default: () => {} },
    type: { type: String, default: null },
    blId: { type: String, default: null },
    customSelect: { type: Array, default: () => [] },
    editableTabsValue: { type: String, default: '4' }
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      dataForm: {},
      editPage: 1,
      customerInformationForm: {},
      cargoIds: []
    }
  },
  computed: {
    url() {
      return URL
    },
    withoutAnimation () {
      return this.$store.state.app.sidebar.opened // 需要监听的数据
    }
  },
  created() {
    if (this.blId) { // 编辑
      this.getSeaBlDetailApi()
    } else {
      // 根据订单id初始化客户提单
      this.getSeaOrderInfoApi()
    }

  },
  methods: {
    async getSeaOrderInfoApi() {
      let res
      if (Number(this.editableTabsValue) === 4) { // 根据订单id初始化客户提单
        res = await seaOrderInfoApi(this.id)
      } else {
        let ids = this.customSelect.map(item => item.id)
        let blIds = {
          blIds: ids.join(',')
        }
        res = await seaBlInitializeApi(this.id, blIds)
      }
      if (res.ok) {
        let cargoIds = res.content.cargoList.map(item => item.id)
        this.cargoIds = lodash.cloneDeep(cargoIds)
        if (Number(this.editableTabsValue) === 4) { // 根据订单id初始化客户提单
          res.content.mblNo = res.content.soNo
          res.content.issuePlace = 'SHENZHEN'

        }
        this.dataForm = res.content
        if (Number(this.editableTabsValue) === 5) { // blNo
          // let hblNos = this.customSelect.map(item => eval(item.bookingNo).join(','))
          let hblIds = this.customSelect.map(item => item.id)
          // this.dataForm.hblNos = hblNos
          this.dataForm.hblIds = hblIds
       }
      }
    },
    async getSeaBlDetailApi() {
      let url
      if (Number(this.editableTabsValue) === 4) {
        url = seaBlDetailApi
      } else {
        url = seaCarrierDetailApi
      }
      const res = await url(this.blId)
      if (res.ok) { //
        let cargoIds = res.content.cargoList.map(item => item.id)
        this.cargoIds = lodash.cloneDeep(cargoIds)

        if (res.content.blSignType === 2 && Number(this.editableTabsValue) === 4) {
          res.content.mblNo = res.content.blNo
        }

        this.dataForm = res.content
        console.log('data', this.dataForm)

      }
    },
    returnBillDetails() {
      this.$emit('returnBillDetails')
    },
    changePage(val) {
      this.editPage = val
    },
    updateForm(val) {
      this.dataForm = val
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px 8px 50px 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
//::v-deep .el-form--inline .el-form-item{ display: block}
//**
.oneToOne{font-size: 28px; font-weight: 500; transform: rotate(25deg); padding: 8px 12px; border-radius: 15px; margin-top: 30px;}
.unmatched{ border:4px solid rgb(255,204,102); color:rgb(255,204,102)  }
.matched{ border:4px solid rgb(255,255,255); color:rgb(255,255,255) }
</style>
