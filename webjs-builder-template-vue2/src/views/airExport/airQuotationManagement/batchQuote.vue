<template>
  <div class="app" v-loading="loading">
    <div style="margin-left:10px;margin-top: 14px;">

      <div class="form-module-title ">
        <span>{{ $t('air.customerMandateInformation') }}</span>
      </div>

      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane v-for="(orderDetail) in orderDetailList" :key="orderDetail.orderNo" :label="orderDetail.orderNo"
          :name="orderDetail.orderNo">
          <div class="form-module-item">
            <div class="item">
              <label>{{ $t('air.orderNumber') }}</label>
              <span>{{ orderDetail.orderNo }}</span>
            </div>
            <div class="item">
              <label>{{ $t('air.requester') }} </label>
              <span> {{ orderDetail.customerName }}</span>
            </div>
            <div class="item">
              <label>{{ $t('air.cargoType') }} </label>
              <span> {{ orderDetail.cargoTypeDesc }}</span>
            </div>
            <div class="item">
              <label>{{ $t('air.tradeTerms') }}</label>
              <span> {{ orderDetail.tradeTerms }} </span>
            </div>
            <div class="item">
              <label>{{ $t('air.orderQuantity') }}</label>
              <span> {{ orderDetail.orderQuantity }}</span>
            </div>
            <div class="item">
              <label>{{ $t('air.orderGrossWeight') }}</label>
              <span>{{ orderDetail.orderGrossWeight }} KGS</span>
            </div>

            <div class="item">
              <label> {{ $t('air.orderVolume') }}</label>
              <span> {{ orderDetail.orderVolume }} CBM</span>
            </div>
            <div class="item">
              <label>{{ $t('air.entrustedChargingWeight') }} </label>
              <span>{{ orderDetail.orderChargeableWeight }} M/T</span>
            </div>
            <div class="item">
              <label> {{ $t('air.delivery') }} </label>
              <span>{{ orderDetail.delivery }} / {{ orderDetail.deliveryCode }} </span>
            </div>
            <div class="item">
              <label> {{ $t('air.pol') }} </label>
              <span>{{ orderDetail.pol }} / {{ orderDetail.polCode }} </span>
            </div>
            <div class="item">
              <label> {{ $t('air.pod2') }} </label>
              <span> {{ orderDetail.pod }} / {{ orderDetail.podCode }}</span>
            </div>
            <div class="item">
              <label> {{ $t('air.receipt') }} </label>
              <span> {{ orderDetail.receipt }} / {{ orderDetail.receiptCode }}</span>
            </div>
            <!-- 货型比例 -->
            <div class="item">
              <label> {{ $t('air.typeRatio') }} </label>
              <span style="color:red"> {{ orderDetail.cargoTypeRatio }}</span>
            </div>
            <div class="item">
              <label> {{ $t('air.etd') }} </label>
              <span> {{ parseTime(orderDetail.etd) }} （ {{ orderDetail.etdWeek }} ）</span>
            </div>
            <div class="item">
              <label> {{ $t('air.cargoCnName') }} </label>
              <span> {{ orderDetail.cargoCnName }}</span>
            </div>
            <div class="item">
              <label> {{ $t('air.palletSizes') }} </label>
              <span> {{ orderDetail.palletSizes }}</span>
            </div>
            <div class="item">
              <label> {{ $t('air.remarks') }} </label>
              <span style="color:red"> {{ orderDetail.bookingRemark }}</span>
            </div>

            <div class="item">
              <label> {{ $t('air.clientOrder') }} </label>
              <span v-for="item in orderDetail.fileList" :key="item.id">
                <span @click="downloadElectronicFile(item)" v-if="item.documentTypeCode === 'customer_power_attorney'"
                  style="color:dodgerblue;margin-left:10px;cursor:pointer;">
                  {{ item.fileName }}
                </span>
              </span>
            </div>
            <div class="item" style="width:100%" v-if="orderDetail.orderState === 4">
              <label> {{ $t('air.refusingBookSpace') }} </label>
              <span style="color:red"> {{ orderDetail.affirmRemark }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 报价信息 -->
      <div class="form-module-title">{{ $t('air.quotationInformation') }}</div>

      <div class="company" style="margin: 10px;">
        <el-form ref="editForm" :model="order" label-width="95px" label-position="left" style="margin-top: -5px;">
          <el-row>
            <el-col :span="16">
              <el-col :span="6">
                <el-form-item :label="$t('air.associatedCostPrice')" prop="associatedCostPrice">
                  <el-input v-model="order.associatedCostPrice" :disabled="editStatus()" class="job-no-input" size="mini"
                    v-input-limit="[-10, 4]" style="width:95%" />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-col :span="4">
                  <el-form-item :label="$t('air.customerSplitBubbleHead')" prop="firstVolumetricFlag">
                    <el-checkbox v-model="firstVolumetricFlag" @change="firstVolumetricFlagChange">
                      <span style="font-size:13px">
                        {{ firstVolumetricFlag ? $t('air.yes') : $t('air.no') }}
                      </span></el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item prop="firstVolumetric"
                    :rules="[{ required: firstVolumetricFlag, message: $t('receiveFms.can_not_be_null') }]">
                    <el-select v-model="order.firstVolumetric" size="mini" :disabled="!firstVolumetricFlag"
                      style="width:90%;margin-left: 5px;">
                      <el-option v-for="item in customerSplitList" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>

              <el-col :span="6">
                <el-col :span="4">
                  <el-form-item :label="$t('air.customerSplitBubbleTrail')" prop="lastVolumetricFlag">
                    <el-checkbox v-model="lastVolumetricFlag" @change="lastVolumetricFlagChange">
                      <span style="font-size:13px"> {{ lastVolumetricFlag ? $t('air.yes') : $t('air.no') }}</span>
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item prop="lastVolumetric"
                    :rules="[{ required: lastVolumetricFlag, message: $t('receiveFms.can_not_be_null') }]">
                    <el-select v-model="order.lastVolumetric" size="mini" :disabled="!lastVolumetricFlag"
                      style="width:90%;margin-left: 5px;">
                      <el-option v-for="item in customerSplitList" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>

            </el-col>

            <el-col :span="24" style="margin-top: -12px;">
              <el-form-item :label="$t('air.servicesAvailable')" prop="serviceItemList">
                <el-checkbox-group v-model="order.serviceItemList">
                  <el-checkbox label="1"><span style="font-size:13px">{{ $t('air.selfReportAndSelfSubmit') }}</span>
                  </el-checkbox>
                  <el-checkbox label="2"><span style="font-size:13px">{{ $t('air.trailersService') }}</span>
                  </el-checkbox>
                  <el-checkbox label="3"><span style="font-size:13px">{{ $t('air.customsDeclarationService') }}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-top: -19px;">
              <el-form-item :label="$t('air.isSpecialPrice')" prop="specialFlag">
                <el-checkbox v-model="order.specialFlag" @change="specialFlagChange">
                  <span style="font-size:13px"> {{ order.specialFlag ? $t('air.yes') : $t('air.no') }}</span>
                </el-checkbox>

                <AirExcelUpload v-if="order.specialFlag" ref="excelUpload" :can-be-upload="canBeUpload"
                  @uploadSuccess="uploadSuccess" @uploadError="uploadError" @setUploadStatus="setUploadStatus"
                  @removeFile="removeFile" @onPreview="onPreview" :fileList="order.fileList"
                  :btnText="$t('air.applicationForSpecialPrice')" :styleText="styleText" :autoUpload="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-form ref="chargeForm" class="order-air-item" :model="order.chargeForm" label-position="left"
        style="margin-top:-10px">
        <el-table size="mini" :border="true" :data="order.chargeForm.charges" style="width: 100%; " row-key="id">
          <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].feeItemName`">
                <!-- :method="dmnBusinessApi" -->
                <type-select v-model="row.feeItemName" type="businessFee" :disabled="editStatus()"
                  :requestParams="{ businessTypeCode: 'AIR_EXPORT' }" @selected="selectedFee($event, $index)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].unit1`">
                <el-select v-model="row.unit1" size="mini" :disabled="editStatus()">
                  <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="currency" :label="$t('receiveFms.currency')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].currency`">
                <el-select v-model="row.currency" size="mini" :disabled="editStatus()">
                  <el-option v-for="item in currencyList" :key="item.code" :label="item.code" :value="item.code" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('receiveFms.price')">
            <template slot-scope="{row, $index}">
              <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                :prop="`charges[${$index}].price`">
                <!-- oninput="value=value.replace(/[^\d.]/g,'')" -->
                <el-input v-model="row.price" size="mini" v-input-limit="[-9, 2]" :disabled="editStatus()"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column prop="remark" :label="$t('air.remark')">
            <template slot-scope="{row, $index}">
              <el-form-item :prop="`charges[${$index}].remark`">
                <el-input v-model='row.remark' size="mini" :disabled="editStatus()"></el-input>
              </el-form-item>
            </template>
          </el-table-column>


          <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
            <template slot-scope="{$index }">
              <i class="iconfont icon-minus-circle" v-if="order.chargeForm.charges.length > 1 && !editStatus()"
                @click="deleteFn($index)"></i>
              <i class="iconfont icon-add-circle" v-if="$index === 0 && !editStatus()" @click="addFn($index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <ElImageViewer v-show="fileimageShow" :on-close="fileimageClose" :url-list="filepaths" />

      <div class="operation-btn">
        <el-button type="primary" @click="addOrder">{{ $t('air.save') }}</el-button>
        <el-button @click="cancel">{{ $t('air.cancel') }}</el-button>
      </div>
    </div>
    <el-dialog :title="$t('air.cancellationOfOrder')" :visible.sync="cancellationOfOrderVisible" width="400px">
      <div>
        <el-form ref="cancellationForm" :model="cancellation" label-width="95px" label-position="left"
          style="margin-top: -5px;">
          <el-form-item :label="$t('air.cancellationReason')" prop="cancelReasonType"
            :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]">
            <el-select v-model="cancellation.cancelReasonType" placeholder="请选择" size="mini">
              <el-option v-for="item in cancellationList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div>{{ $t('air.cancellationOfOrderTip') }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationOfOrderVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationOfOrderFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { downloadElectronicFileApi } from '@/api/seaExport'

import { getAirOrderExportBatchDetail, addAirOrderOffer, cancelAirExportApi } from '@/api/airExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { airLineListApi, airportListApi } from '@/api/common'
import { getDictDataApi } from '@/api/fmsReceiveAir'
import {
  getCustomerDropDownListApi, getTaxRateListApi
} from '@/api/common'
import { getCurrenciesListApi } from "@/api/common"
import { getYHTListApi } from '@/api/partner/base'

import { parseTime } from '@/utils/index'
import AirExcelUpload from '../components/airExcelUpload'
import ElImageViewer from "element-ui/packages/image/src/image-viewer"

export default {
  name: 'AirQuotationManagementBatchQuote',
  components: {
    cargoLimitedSelect, AirExcelUpload, ElImageViewer
  },

  data () {

    return {
      cancellation: {
        cancelReasonType: ""
      },
      cancellationList: [{
        value: '10',
        label: this.$t('air.priceProblem')
      }, {
        value: '20',
        label: this.$t('air.deliveryTimeProblem')
      }, {
        value: '30',
        label: this.$t('air.shippingSpaceProblem')
      }, {
        value: '99',
        label: this.$t('air.otherProblem')
      }],
      firstVolumetricFlag: false,
      lastVolumetricFlag: false,
      editableTabsValue: "1",
      cancellationOfOrderVisible: false,
      customerSplitList: [{
        value: '10%',
        label: '10%'
      }, {
        value: '20%',
        label: '20%'
      }, {
        value: '30%',
        label: '30%'
      }, {
        value: '40%',
        label: '40%'
      }, {
        value: '50%',
        label: '50%'
      }, {
        value: '60%',
        label: '60%'
      }, {
        value: '70%',
        label: '70%'
      }, {
        value: '80%',
        label: '80%'
      }, {
        value: '90%',
        label: '90%'
      }, {
        value: '1/3',
        label: '1/3'
      }, {
        value: '2/3',
        label: '2/3'
      }],
      canBeUpload: false, // 托书
      fileimageShow: false,
      filepaths: [],
      styleText: {
        width: '30%',
        'margin-left': 0
        // display: 'inline-block'
      },
      loading: false,
      unitList: [],
      currencyList: [],
      orderDetailList: [],
      order: {
        orderIdList: [],
        fileList: [], // 特价申请书
        firstVolumetricFlag: "", // 是否头程分泡
        firstVolumetric: "", // 头程分泡值
        lastVolumetricFlag: "", // 是否尾程分泡
        lastVolumetric: "", // 尾程分泡值
        specialFlag: "", // 是否特价
        serviceItemList: [],
        serviceItem: "", // 服务项多个逗号隔开:1、自报自交2、拖车服务3、报关服务
        airOrderExportChargeDtoList: "", // 成本费用列表

        associatedCostPrice: "", // 关联成本价

        chargeForm: {
          charges: [{}]
        }
      },
      orderRules: {
        // "orderQuantity": [{ required: true, message: this.$t('air.requiredOrderQuantity'), trigger: 'blur' }],
      }
    }
  },
  watch: {
  },

  created () {
    this.getDetail()

    this.init()
  },

  methods: {
    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },
    firstVolumetricFlagChange (flag) {
      if (!flag) {
        this.order.firstVolumetric = "" // 头程分泡值
      }
    },
    lastVolumetricFlagChange (flag) {
      if (!flag) {
        this.order.lastVolumetric = "" // 尾程分泡值
      }
    },
    specialFlagChange (flag) {
      if (!flag) {
        this.order.fileList = [] // 特价申请书
      }
    },
    getDetail () {
      let id = this.$route.query.ids
      this.loading = true;
      getAirOrderExportBatchDetail(id).then(res => {
        if (res.content) {
          this.editableTabsValue = res.content.orderDetailDTOList[0].orderNo

          this.orderDetailList = res.content.orderDetailDTOList

          // 起运港=PVG，30，=CAN，50，=NTG，20
          let polPrice = ""
          if (res.content.orderDetailDTOList[0].polCode === 'PVG') {
            polPrice = 30
          } else if (res.content.orderDetailDTOList[0].polCode === 'CAN') {
            polPrice = 50
          } else if (res.content.orderDetailDTOList[0].polCode === 'NTG') {
            polPrice = 20
          }
          this.order.chargeForm = {
            charges: [{
              "currency": "CNY",
              "unit1": 1101,
              "feeItemName": this.$t('air.airFreight'),
              "feeItemCode": "AF",
              "unit1Name": this.$t('air.kg')
            }, {
              "currency": "CNY",
              "unit1": 2004,
              "feeItemName": this.$t('air.documentCharge'),
              "feeItemCode": "DOC",
              "price": 50,
              "unit1Name": this.$t('air.ticket')
            }, {
              "currency": "CNY",
              "unit1": 2004,
              "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
              "feeItemCode": "OEDI",
              "price": polPrice,
              "unit1Name": this.$t('air.ticket')
            }]
          }

        }
        this.loading = false;
      })
    },
    downloadElectronicFile (obj) {
      downloadElectronicFileApi(obj.id).then(res => {
        if (res.ok) {
          // res.content.fileName = obj.fileName
          this.onPreview(res.content)
        }
      })
    },
    cancellationOfOrder () {
      this.cancellation.cancelReasonType = ""
      this.cancellationOfOrderVisible = true;
    },
    submitCancellationOfOrderFn () {
      this.$refs.cancellationForm.validate(valid => {
        if (valid) {
          this.cancellationOfOrderVisible = false;
          let param = {
            "id": this.$route.query.ids,
            "cancelReasonType": this.cancellation.cancelReasonType
          }
          // 取消接口
          cancelAirExportApi(param).then(res => {
            if (res && res.ok) {
              this.backList();
              this.$message.success(this.$t('air.cancellationOfOrderEnd'));
            }
          });
        }
      })
    },
    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirQuotationManagement` })
    },
    // 订单状态为 5 【待配舱】10【待外配】 30 【待入仓】40 【待起飞】时允许用户对订单进行修改
    editStatus (item) {
      return false

    },
    // 保存
    addOrder () {
      // this.loading = true
      let vb = false; let ve = false;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          vb = valid
        }
      })
      this.$refs.chargeForm.validate(valid => {
        if (valid) {
          ve = valid
        }
      })
      if (this.order.specialFlag) {
        if (this.order.fileList.length === 0) {
          this.$message.warning(this.$t('air.uploadApplicationForSpecialPriceWarning'))
          return
        }
      }
      if (ve && vb) {
        this.loading = true
        if (this.order.serviceItemList.length > 0) {
          this.order.serviceItem = this.order.serviceItemList.join()
        }

        if (!this.order.specialFlag) {
          this.order.specialFlag = false
        }

        this.order.orderIdList = this.$route.query.ids.split(",")
        this.order.airOrderExportChargeDtoList = this.order.chargeForm.charges
        this.order.airOrderExportChargeDtoList.forEach(v => {
          try {
            v.unit1Name = this.unitList.find(item => item.code === v.unit1).name
          } catch (e) {
            console.log(e)
          }
        })
        addAirOrderOffer(this.order).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t('air.successSaved'))
            this.backList()
          }
          this.loading = false
        })
      }

    },
    cancel () {
      this.$confirm(this.$t('air.cancelTip'), this.$t('air.tips'), {
        confirmButtonText: this.$t('air.determine'),
        cancelButtonText: this.$t('air.cancel'),
        type: 'warning'
      }).then(() => {
        this.backList()
      }).catch(() => {
      })
    },

    init () {
      Promise.all([getDictDataApi(8), getTaxRateListApi(), getCurrenciesListApi()]).then(results => {
        const unitRes = results[0]
        const taxRateRes = results[1]
        const currencyRes = results[2]

        if (unitRes.ok) {
          let unit = [];
          unitRes.content.forEach(v => {
            if (v.code === 1101 || v.code === 2004) {
              unit.push(v)
            }
          })
          this.unitList = unit
        }
        if (taxRateRes.ok) {
          this.taxRateList = taxRateRes.content
        }
        if (currencyRes.ok) {
          this.currencyList = currencyRes.content
        }
      })

    },
    deleteFn (index) {
      this.order.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      this.order.chargeForm.charges.unshift({
        "currency": "CNY"
      })
    },
    selectedFee (charge, index) {
      let item = this.order.chargeForm.charges[index]
      item.feeItemName = charge.chineseName
      item.feeItemCode = charge.code
      this.$set(this.order.chargeForm.charges, index, item)
    },
    // 上传托书
    uploadFile () {
      if (!this.canBeUpload) {
        this.$message({
          type: 'warning',
          message: '请选择一个文件'
        })
        return false
      }
      this.loading = true
      this.$refs.excelUpload.submit()
    },
    uploadSuccess (res) {
      this.loading = false
      this.canBeUpload = false
      // res.content.name = res.content.originFileName
      // this.order.fileList.push(res)
      this.order.fileList = res
    },
    uploadError (message) {
      this.loading = false
      this.$message({
        type: 'error',
        message: message
      })
      this.clearUploadFiles()
      this.canBeUpload = false
    },

    setUploadStatus (val) {
      this.canBeUpload = val
    },
    removeFile (file) {
      // cloudFileName
      let index = this.order.fileList.findIndex(item => item.uid === file.uid || item.cloudFileName === file.cloudFileName)
      if (index !== -1) {
        this.order.fileList.splice(index, 1)
      }
    },
    async onPreview (file) {
      const jpg = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]
      let cloudFileName, url
      if (file.url) {
        cloudFileName = file.cloudFileName
        url = file.url
      } else {
        if (file.id) {
          this.downloadElectronicFile(file)
          return
        }
      }
      const fileSuffix = cloudFileName.substring(cloudFileName.lastIndexOf(".") + 1)
      if (jpg.indexOf(fileSuffix) > -1) {
        // 是图片
        this.filepaths = []
        this.fileimageShow = true
        this.filepaths.push(url)
      } else {
        window.open(url)
      }
    },
    fileimageClose () {
      this.fileimageShow = false
    }
  }
}
</script>

<style scoped lang="less">
.app-main-inner {
  width: 100%;
  background: #f5f7fa;
}

.page-form {
  width: 100%;
  // max-width: 1200px;
  padding: 20px 10px;
  background: #f5f7fa;
}

.form-module-title {
  font-size: 15px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
  height: 28px;
  line-height: 28px;
}

.form-module-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    width: 25%;
    float: left;
    padding: 0 20px;
    margin-bottom: 10px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }


  ::v-deep .el-form-item {
    width: 25%;
    float: left;
    padding: 0 20px;
    min-height: 37px;
  }

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-form-item__label {
    text-align: right;
  }
}

.charge-list-data {
  margin: 20px 0;
}

.operation-btn {
  padding: 20px;
  text-align: right;
  background: #fff;
}

.order-btn {
  margin-left: 12px;
}

.shipping-info .item label {
  display: block;
  margin-bottom: 8px;
}

.shipping-info .item span {
  display: inline-block;
  min-height: 200px;
  width: 100%;
  border-radius: 5px;

  ::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    font-size: 12px;
    color: #000;
  }
}

.dialog-footer {
  text-align: center;
}

.order-air-item {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;
  margin: 10px;

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  .title {
    font-weight: 600;
    line-height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }

  .link {
    font-weight: 500;
    color: #1890ff;
  }

  .company {
    padding: 12px 20px;
    overflow: hidden;

    label {
      font-weight: 500;
      margin-right: 20px;
    }
  }
}

.company {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
