<template>
  <div>
    <!-- 销售报价详情
          v-permission="['air:order:export:salesOfferDetails']" -->
    <div class="charge" v-permission="['air:order:export:salesOfferDetails']">
      <div class="title" style="color:#03B615">
        <!-- 销售报价  -->
        <span style="margin-right:20px"> {{ $t('air.salesQuotation') }}</span>
        <!-- 金额合计： -->
        <span> {{ $t('air.costEstimate') }}： </span>
        <div style="display: inline;margin-right:25px" v-for="(item, index) in orderDetail.arAmountDtos" :key="index">
          <span style="margin-right:3px">{{ item.currency }}</span>
          <span>{{ formatNumberToThousands(item.totalPrice) }}</span>
        </div>
      </div>
      <div class="order-air-item">
        <div class="company">
          <el-row>
            <!-- 头程分泡(客户) -->
            <el-col :span="5"><label> {{ $t('air.customerSplitBubbleHead') }}
              </label>{{ orderDetail.firstVolumetric ? orderDetail.firstVolumetric : $t('air.nothing') }}</el-col>
            <!-- 尾程分泡(客户) -->
            <el-col :span="5"><label>{{ $t('air.customerSplitBubbleTrail') }}
              </label>{{ orderDetail.lastVolumetric ? orderDetail.lastVolumetric : $t('air.nothing') }}</el-col>
            <!-- 服务项 -->
            <el-col :span="6"><label>{{ $t('air.servicesAvailable') }}</label> {{
              orderDetail.serviceItemName ?
              orderDetail.serviceItemName : $t('air.nothing')
            }}
            </el-col>
            <!-- 特价申请书 -->
            <el-col :span="8"> <label>{{ $t('air.applicationForSpecialPrice') }} </label>
              <span v-for="item in orderDetail.fileSpecialList" :key="item.id">
                <span @click="downloadElectronicFile(item)"
                  v-if="item.documentTypeCode === 'special_offer_application_doc'"
                  style="color:dodgerblue;margin-left:10px;cursor:pointer;">
                  {{ item.fileName }}
                </span>
              </span>
              <span v-if="orderDetail.fileSpecialList.length === 0">
                {{ $t('air.nothing') }}
              </span>
            </el-col>
          </el-row>
        </div>
        <el-table size="mini" :data="orderDetail.arChargeDtoList" style="width: 99%;margin: 10px; " row-key="id"
          :border="true">
          <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="150"></el-table-column>
          <el-table-column prop="unit1Name" :label="$t('receiveFms.unit_name')" min-width="100"></el-table-column>
          <el-table-column prop="currency" :label="$t('receiveFms.currency')" min-width="100"></el-table-column>
          <el-table-column prop="price" :label="$t('receiveFms.price')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.price) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('air.remark')" min-width="100"></el-table-column>
        </el-table>
      </div>

    </div>
    <!-- 产品报价详情
          v-permission="['air:order:export:productQuotationDetails']" -->
    <div class="charge" style="margin:30px 0;" v-permission="['air:order:export:productQuotationDetails']">
      <div class="title" style="color:#E0001B">
        <!-- 产品报价  -->
        <span style="margin-right:20px"> {{ $t('air.productQuotation') }} </span>
        <!-- 费用预估 -->
        <span>{{ $t('air.costEstimate') }}： </span>
        <div style="display: inline;margin-right:25px" v-for="(item, index) in orderDetail.apAmountDtos" :key="index">
          <span style="margin-right:3px">{{ item.currency }}</span>
          <span>{{ formatNumberToThousands(item.totalPrice) }}</span>
        </div>
        <!-- 产品报价编辑
          v-permission="['air:order:export:productQuotationEdit']" -->
        <el-button type="primary" style="float: right;"
          v-if="(order.baseDTO.orderState === 5 || order.baseDTO.orderState === 10 || order.baseDTO.orderState === 30 || order.baseDTO.orderState === 30)"
          @click="productQuotationEdit" size="mini">{{
            $t('air.productQuotationEdit')
          }} </el-button>
      </div>
      <div class="order-air-item">
        <div class="company">
          <el-row>
            <!-- 头程分泡(客户) -->
            <el-col :span="5"><label>{{ $t('air.headPartOfTheBubble2') }}</label>{{
              orderDetail.firstProductVolumetric ? orderDetail.firstProductVolumetric : $t('air.nothing')
            }}</el-col>
            <!-- 尾程分泡(客户) -->
            <el-col :span="8"><label>{{ $t('air.tailSeparationBubble2') }}</label>{{
              orderDetail.lastProductVolumetric ? orderDetail.lastProductVolumetric : $t('air.nothing')
            }}</el-col>
            <!-- 产品备注 -->
            <el-col :span="10"><label>{{ $t('air.productNote') }}</label> {{
              orderDetail.productRemark
              ? orderDetail.productNote : $t('air.nothing')
            }} </el-col>
          </el-row>
        </div>
        <el-table size="mini" :data="orderDetail.apChargeDtoList" style="width: 99%;margin: 10px; " row-key="id" border>
          <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="150"></el-table-column>
          <el-table-column prop="unit1Name" :label="$t('receiveFms.unit_name')" min-width="100"></el-table-column>
          <el-table-column prop="currency" :label="$t('receiveFms.currency')" min-width="100"></el-table-column>
          <el-table-column prop="price" :label="$t('receiveFms.price')" min-width="100">
            <template slot-scope="scope">
              <div style='text-align: right'>{{ formatNumberToThousands(scope.row.price) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('air.remark')" min-width="100"></el-table-column>
        </el-table>
      </div>

    </div>
    <!-- 预估销售利润
          v-permission="['air:order:export:estimatedProfitOnSales']" -->
    <div class="title" style="color:#497BF0" v-permission="['air:order:export:estimatedProfitOnSales']">
      <!-- 预估销售利润： -->
      <span>{{ $t('air.estimatedProfitOnSales') }}： </span>
      <div style="display: inline;margin-right:25px" v-for="(item, index) in orderDetail.profitAmountDtos" :key="index">
        <span style="margin-right:3px">{{ item.currency }}</span>
        <span>{{ formatNumberToThousands(item.totalPrice) }}</span>
      </div>
    </div>

    <orderConfirmationDialog @refresh="refreshFn" :visible="productQuotationFormVisible"
      @close="productQuotationEditClose" :id="id" :order="orderDetail"></orderConfirmationDialog>

    <ElImageViewer v-show="fileimageShow" :on-close="fileimageClose" :url-list="filepaths" />

  </div>
</template>
<script>
import { getAirOrderAffirmInfo } from '@/api/airExport'
import { downloadElectronicFileApi } from '@/api/seaExport'

import { parseTime, formatNumberToThousands } from '@/utils/index'
import orderConfirmationDialog from './operation/orderConfirmationDialog'
import ElImageViewer from "element-ui/packages/image/src/image-viewer"

export default {
  name: 'Charge',
  components: {
    orderConfirmationDialog, ElImageViewer
  },
  props: {
    order: { type: Object, default: () => { } },
    tabPane: {
      type: String,
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      id: "",
      productQuotationFormVisible: false,
      orderDetail: {
        serviceItemName: "",
        arChargeDtoList: [],
        apChargeDtoList: [],
        fileList: [],
        fileSpecialList: [],
        arAmountDtos: [],
        apAmountDtos: [],
        profitAmountDtos: []
      },
      fileimageShow: false,
      filepaths: [],
      charges: [],
      arCharges: [],
      arTotal: [],
      apCharges: [],
      apTotal: [],
      sourceProfits: []
    }
  },
  watch: {
    tabPane (newV) {
      if (newV === "quotationInformation") {
        this.init()
      }
    }
  },

  methods: {
    productQuotationEdit () {
      this.productQuotationFormVisible = true
    },
    productQuotationEditClose () {
      this.productQuotationFormVisible = false
    },
    refreshFn () {
      this.init()
    },
    init () {
      this.id = this.$route.query.id
      this.loading = true;
      getAirOrderAffirmInfo(this.id).then(res => {
        if (res.content) {

          let serviceItemName = ""
          if (res.content.serviceItem) {
            let serviceItemList = res.content.serviceItem.split(",") // 服务项多个逗号隔开:1、自报自交2、拖车服务3、报关服务

            serviceItemList.forEach(v => {
              if (v === 1) {
                serviceItemName += this.$t('air.selfReportAndSelfSubmit') + ","
              } else if (v === 2) {
                serviceItemName += this.$t('air.trailersService') + ","
              } else if (v === 3) {
                serviceItemName += this.$t('air.customsDeclarationService') + ","
              }
            })
            serviceItemName = serviceItemName.substring(0, serviceItemName.lastIndexOf(','))

          }
          res.content.serviceItemName = serviceItemName
          res.content.fileSpecialList = []
          // 特价文件处理
          res.content.fileList.forEach(v => {
            try {
              if (v.documentTypeCode === "special_offer_application_doc") {
                v.name = v.fileName
                v.originFileName = v.fileName
                res.content.fileSpecialList.push(v)
              }
            } catch (e) {
              console.log(e)
            }
          })
          if (res.content.arChargeDtoList.length > 0) {
            res.content.arChargeDtoList.forEach(v => {
              try {
                let chargeUnit = ""
                if (v.unit1 === 1101) {
                  chargeUnit = this.$t('air.kg')
                } else if (v.unit1 === 2004) {
                  chargeUnit = this.$t('air.ticket')
                }
                v.unit1Name = chargeUnit
              } catch (e) {
                console.log(e)
              }
            })
          }
          if (res.content.apChargeDtoList.length > 0) {
            res.content.apChargeDtoList.forEach(v => {
              try {
                let chargeUnit = ""
                if (v.unit1 === 1101) {
                  chargeUnit = this.$t('air.kg')
                } else if (v.unit1 === 2004) {
                  chargeUnit = this.$t('air.ticket')
                }
                v.unit1Name = chargeUnit
              } catch (e) {
                console.log(e)
              }
            })
          }
          this.orderDetail = res.content
        }
        this.loading = false;
      })
    },
    formatNumberToThousands (value) {
      return formatNumberToThousands(value)
    },
    downloadElectronicFile (obj) {
      downloadElectronicFileApi(obj.id).then(res => {
        if (res.ok) {
          this.onPreview(res.content)
        }
      })
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
.title {
  margin: 15px 0;
}

.order-air-item {
  background-color: #FFF;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;

  .company {
    padding: 12px 20px;
    overflow: hidden;

    label {
      font-weight: 500;
      margin-right: 20px;
    }
  }
}
</style>
