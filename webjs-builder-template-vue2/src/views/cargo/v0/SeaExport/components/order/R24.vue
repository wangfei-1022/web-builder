<template>
  <div>
  <div class="box_title">{{$t('sea.R24')}}</div>
  <div class="box_child" v-for="(item,i) in dataForm.seaBlJobR24SaveDTOList" :key="i">
    <div class="font16">{{$t('sea.masterBill')}}</div>
    <template v-if="podCode === 'US' || podCode === 'CA'">
      <div style="margin: 8px 0; display: flex">

        <div v-for="(val,index) in item.r24Types" :key="i+index">
          <span style="margin-right: 50px">{{ val.r24TypeName }}</span>
          <el-checkbox v-model="val.declareBlFlag" @change="declareBlFlagChange($event,i,true,val.r24TypeName)" style="margin-right: 200px">{{$t('sea.whetherToDeclareFreightForwarding')}}</el-checkbox>
        </div>
<!--        <div v-for="">-->
<!--          <span style="margin-right: 50px">{{ item.r24TypeName }}</span>-->
<!--          <el-checkbox v-model="item.declareBlFlag" @change="declareBlFlagChange($event,i)">{{$t('sea.whetherToDeclareFreightForwarding')}}</el-checkbox>-->
<!--        </div>-->
      </div>
      <div v-if="declareBlFlagBtn">
        <span class="font16">{{$t('sea.freightBillOfLading')}}</span>
        <el-button type="primary" size="mini" style="margin-left: 20px" class="addTo" @click="addTo(i)">{{$t('sea.addTo')}}</el-button>
      </div>
      <el-table v-if="declareBlFlagBtn" :data="item.seaBlJobR24HblSaveDTOList" style="width: 100%; margin: 10px 0;">
        <el-table-column prop="nvoccHblNo" :label="$t('sea.nvoccFreightForwarderBillOfLadingNumber')"></el-table-column>
        <el-table-column prop="scacCode" :label="$t('sea.scacCode')"></el-table-column>
        <el-table-column prop="ca8000Code" :label="$t('sea._8000Code')"></el-table-column>
        <el-table-column prop="actualShipper" :label="$t('sea.actualShipper')"></el-table-column>
        <el-table-column prop="actualConsignee" :label="$t('sea.actualConsignee')"></el-table-column>
        <el-table-column prop="actualNotify" :label="$t('sea.actualFirstNotifyingParty')"></el-table-column>
        <el-table-column prop="actualSecondNotify" :label="$t('sea.actualSecondNotifyingParty')"></el-table-column>
        <el-table-column prop="actualSecondNotify" :label="$t('sea.actualSecondNotifyingParty')"></el-table-column>
        <el-table-column>
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini" @click="delRow($index)">
              <i  class="icon el-icon-remove red" ></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
<!--    土耳其 -->
    <template v-if="podCode === 'TR'">
      <div v-for="(val,index) in item.r24Types" :key="i+index" style="margin: 8px 0">
        <span style="margin-right: 50px">{{ val.r24TypeName }}</span>
      </div>
      <div style="display: flex">
        <el-form-item :label="$t('sea.taxIDType')" prop="taxType" size="mini" >
          <el-select  v-model="item.taxType" size="mini" clearable>
            <el-option label="Consignee" value="Consignee"></el-option>
            <el-option label="Notify Party" value="Notify Party"></el-option>
            <el-option label="To Order Of Bank" value="To Order Of Bank"></el-option>
          </el-select>
          <div v-if="item.taxType === 'Notify Party' || item.taxType === 'To Order Of Bank'" style="color: #E6A23C">建议根据收货人信息来选择</div>
        </el-form-item>
        <el-form-item :label="$t('sea.consigneeTaxId')" prop="consigneeTaxId" size="mini" >
          <el-input size="mini" v-model="item.consigneeTaxId"></el-input>
        </el-form-item>
      </div>

    </template>
    <template v-if="podCode === 'JP'">
      <div v-for="(val,index) in item.r24Types" :key="i+index" style="margin: 8px 0">
        <span style="margin-right: 50px">{{ val.r24TypeName }}</span>
        <el-checkbox v-model="val.declareBlFlag" @change="declareBlFlagChange($event,i)"></el-checkbox>
      </div>
    </template>

  </div>
  <houseBillLading v-if="houseBillLadingDialog" :showDialog.sync="houseBillLadingDialog" :podCode="podCode" @submitCallBack="submitCallBack" :checkboxR24TypeName="checkboxR24TypeName"></houseBillLading>
  </div>
</template>
<script>
import lodash from 'lodash'
import houseBillLading from "@/views/cargo/v0/SeaExport/components/order/Popup/houseBillLading";
export default {
  name: 'R24',
  components: {houseBillLading },
  props: {
    // value: { type: String, default: null },
    showDialog: { type: Boolean, default: false },
    packingDataList: { type: Object, default: ()=>{} },
    bookingJobId: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      dataForm: {
      },
      nowIndex:0,
      houseBillLadingDialog: false,
      countryList:{
        CA: '加拿大报关',
        US: '美国报关',
        TR: '土耳其报关',
        JP: '日本报关',
      },
      declareBlFlagBtn:false,
      checkboxR24TypeName:[]
    }
  },
  computed: {
    podCode(){
      if(this.packingDataList.podCode){
        return this.packingDataList.podCode.toUpperCase().substr(0,2)
      }
    }
  },
  created() {
    if(!this.packingDataList.seaBlJobR24SaveDTOList || this.$isEmpty(this.packingDataList.seaBlJobR24SaveDTOList)){
      let seaBlJobR24SaveDTOList = []
      if(this.podCode === 'US' || this.podCode === 'CA'){
        seaBlJobR24SaveDTOList.push({
          r24Types:[
            {
              r24TypeName: this.countryList['US'],
              r24Type:'US',
              declareBlFlag: false
            },
            {
              r24TypeName: this.countryList['CA'],
              r24Type:'CA',
              declareBlFlag: false
            }
        ]})

      } else {
        seaBlJobR24SaveDTOList.push({
          r24Types:[
            {
              r24TypeName: this.countryList[this.podCode],
              r24Type:this.podCode,
              declareBlFlag: false
            }
          ]})
      }
      this.$set(this.packingDataList,'seaBlJobR24SaveDTOList',seaBlJobR24SaveDTOList)
    }
    this.dataForm = this.packingDataList
    this.declareBlFlagChange(null,0,false)
  },
  methods: {
    addTo(i){
      this.nowIndex = i
      this.houseBillLadingDialog = true
    },
    declareBlFlagChange(val,i,rest = true){
      let isVal=this.packingDataList.seaBlJobR24SaveDTOList[i].r24Types.some(item=> !!item.declareBlFlag)
      if(!isVal && rest){
        this.$set(this.dataForm.seaBlJobR24SaveDTOList[i], 'seaBlJobR24HblSaveDTOList' ,[])
      }
      this.declareBlFlagBtn = isVal
      this.$emit('declareBlFlagChange',isVal)
      this.checkboxR24TypeName = []
      this.packingDataList.seaBlJobR24SaveDTOList[i].r24Types.map(item=>{
        if(item.declareBlFlag){
          this.checkboxR24TypeName.push(item.r24Type)
        }
      })

    },
    submitCallBack(val){
      if(!this.dataForm.seaBlJobR24SaveDTOList[this.nowIndex] || !this.dataForm.seaBlJobR24SaveDTOList[this.nowIndex].seaBlJobR24HblSaveDTOList){
        this.dataForm.seaBlJobR24SaveDTOList[this.nowIndex].seaBlJobR24HblSaveDTOList = []
      }
      this.dataForm.seaBlJobR24SaveDTOList[this.nowIndex].r24Type = this.podCode
      this.dataForm.seaBlJobR24SaveDTOList[this.nowIndex].seaBlJobR24HblSaveDTOList.push(val)
      this.seaBlJobR24SaveDTOListChange()
    },
    delRow(i){
      this.dataForm.seaBlJobR24SaveDTOList[this.nowIndex].seaBlJobR24HblSaveDTOList.splice(i,1)
      this.seaBlJobR24SaveDTOListChange()
    },
    seaBlJobR24SaveDTOListChange(){
      console.log(this.dataForm.seaBlJobR24SaveDTOList)
      this.$emit('seaBlJobR24SaveDTOListChange',this.dataForm.seaBlJobR24SaveDTOList)
    }

  }
}
</script>
<style lang="scss" scoped>
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
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
::v-deep .el-form--inline .el-form-item{ display: inline-block}
//**
.data-table{
  ::v-deep {
    .el-form-item{ margin: 10px 0}
    .el-form-item__error{ display: none}
    .el-form-item__content{
      max-width: 100%;
    }
  }
}

.el-input__inner.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #606266 ;
  cursor: not-allowed;
}
::v-deep {
  .el-form-item__label{ width: auto}
}
</style>
