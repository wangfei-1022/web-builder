<template>
  <div class="app" v-loading="loading">
    <div>
      <div class="form-module-title" style="margin: 10px;">
        <span>{{ $t('seaQuotationExport.inquiryInformation') }}</span>
      </div>
      <div class="form-module-item" style="margin: 10px;">
        <div class="item">
          <label>{{ $t('seaQuotationExport.quotationNo') }}</label>
          <span>{{ confirmationDetail.quotationNo }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.sourceOrderNo') }}</label>
          <span>{{ confirmationDetail.sourceOrderNo }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.customerName') }} </label>
          <span> {{ confirmationDetail.customerName }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.transportationMode') }} </label>
          <span> {{ confirmationDetail.transportationModeDesc }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.quoteState') }}</label>
          <span> {{ confirmationDetail.quoteStateDesc }} </span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.pol') }}</label>
          <span> {{ confirmationDetail.pol }} / {{ confirmationDetail.polCode }} </span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.pod') }}</label>
          <span>{{ confirmationDetail.pod }} / {{ confirmationDetail.podCode }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.transportTerm') }}</label>
          <span>{{ confirmationDetail.polTransportTermCode }} - {{ confirmationDetail.podTransportTermCode }}</span>
        </div>
        <div class="item">
          <label> {{ $t('seaQuotationExport.ctnInfo') }}</label>
          <span> {{ confirmationDetail.ctnInfoDesc }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.targetPrice') }} </label>
          <span>{{ confirmationDetail.targetPrice }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.deliveryTime') }} </label>
          <span>{{ confirmationDetail.deliveryTime }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.inquiryTime') }} </label>
          <span>{{ confirmationDetail.inquiryTime }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.totalWeight') }} </label>
          <span>{{ confirmationDetail.totalWeight }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.dataSource') }} </label>
          <span>{{ confirmationDetail.dataSourceDesc }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.goodsName') }} </label>
          <span>{{ confirmationDetail.goodsName }}</span>
        </div>
        <div class="item">
          <label> {{ $t('seaQuotationExport.remarks') }} </label>
          <span style="color:red"> {{ confirmationDetail.remark }}</span>
        </div>
        <div class="item">
          <label>{{ $t('seaQuotationExport.attachmentInformation') }} </label>
          <span v-for="item in confirmationDetail.fileList" :key="item.id">
            <span @click="downloadElectronicFile(item)" style="color:dodgerblue;margin-left:10px;cursor:pointer;">
              {{ item.fileName }}
            </span>
          </span>
        </div>
      </div>
      <div class="form-module-title" style="margin: 10px;" v-if="editableTabs.length > 0">
        <span>{{ $t('seaQuotationExport.order') }}</span>
      </div>
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane v-for="(item) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
          <el-form ref="orderForm" :model="item.order" :rules="orderRules" label-width="95px" label-position="left"
            class="page-form">

            <div class="form-module-item">
              <!-- 船公司 -->
              <el-form-item :label="$t('seaQuotationExport.shippingCompany')"
                :rules="[{ required: true, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]"
                prop="carrierName">
                <el-input v-model="item.order.carrierName" size="mini" class="job-no-input" disabled>
                </el-input>
              </el-form-item>

              <!--  船期 -->
              <el-form-item :label="$t('seaQuotationExport.sailTime')" prop="etd">
                <el-row>
                  <el-col :span="19">
                    <CommonPicker disabled v-model="item.order.etd" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm"
                      size="mini" />
                  </el-col>
                  <span>{{ weekItem[item.order.etdWeek - 1] }}</span>
                </el-row>
              </el-form-item>

              <!-- 中转类型 -->
              <el-form-item :label="$t('seaQuotationExport.transType')" prop="transType" size="mini">
                <el-select v-model="item.order.transType" :placeholder="$t('seaQuotationExport.placeholder')"
                  @change="selectedTransType" disabled>
                  <el-option :label="$t('seaQuotationExport.through')" :value=10></el-option>
                  <el-option :label="$t('seaQuotationExport.transfer')" :value=20></el-option>
                </el-select>
              </el-form-item>
              <!-- 中转港 -->
              <el-form-item :label="$t('seaQuotationExport.trans')" prop="transCode"
                :rules="[{ required: Number(item.order.transType) === 20, message: $t('seaQuotationExport.placeholder'), trigger: 'change' }]">
                <el-row>
                  <el-col :span="10">
                    <type-select disabled v-model="item.order.transCode" type="seaport" @selected="selectedTrans"
                      size="mini" />
                  </el-col>
                  <el-col :span="14" style="padding-left: 10px;">
                    <el-input v-model="item.order.trans" class="job-no-input" size="mini" disabled />
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 航程 -->
              <el-form-item :label="$t('seaQuotationExport.voyageDays')" prop="voyageDays">
                <el-input v-model="item.order.voyageDays" size="mini" v-input-limit="[-9, 2]" class="job-no-input"
                  disabled>
                  <template slot="append">天</template>
                </el-input>
              </el-form-item>


              <!--  截关时间 -->
              <el-form-item :label="$t('seaQuotationExport.cutOffTime')" prop="cutOffTime">
                <el-row>
                  <el-col :span="19">
                    <CommonPicker disabled v-model="item.order.cutOffTime" pikcer-type="datetime"
                      pickerFormat="yyyy-MM-dd HH:mm" size="mini" />
                  </el-col>
                  <span>{{ weekItem[item.order.cutOffTimeWeek - 1] }}</span>
                </el-row>
              </el-form-item>

              <!-- 报价有效期 -->
              <el-form-item :label="$t('seaQuotationExport.quoteValidityTime')" prop="validTimeRange">
                <el-date-picker v-model="item.order.validTimeRange" value-format="timestamp" type="daterange" disabled
                  range-separator="-" start-placeholder="" end-placeholder="" style="width: 100%" size="mini">
                </el-date-picker>
              </el-form-item>

              <!-- 运力标识 -->
              <el-form-item :label="$t('seaQuotationExport.capacity')" prop="capacity">
                <el-input v-model="item.order.capacity" size="mini" disabled />
              </el-form-item>

              <!-- 注意事项 -->
              <el-form-item :label="$t('seaQuotationExport.attention')" style="width: 75%;" prop="attention">
                <el-input v-model="item.order.attention" class="job-no-input" size="mini" type="textarea" rows="3"
                  disabled />
              </el-form-item>
            </div>
          </el-form>

          <el-form ref="chargeForm" class="order-air-item" :model="item.order.chargeForm" label-position="left">
            <el-table size="mini" :border="true" :data="item.order.chargeForm.charges" style="width: 100%; " row-key="id">
              <el-table-column prop="feeName" :label="$t('receiveFms.charge_name')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].feeName`">
                    <type-select v-model="row.feeName" type="businessFee" disabled
                      :requestParams="{ businessTypeCode: 'SEA_EXPORT' }" @selected="selectedFee($event, $index)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].unit`">
                    <el-select v-model="row.unit" size="mini" disabled @change="unitlChange($event, $index)">
                      <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="currency" :label="$t('receiveFms.currency')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].currency`">
                    <el-select v-model="row.currency" size="mini" disabled>
                      <el-option v-for="item in currencyList" :key="item.code" :label="item.code" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="price" :label="$t('receiveFms.price')">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].price`">
                    <el-input v-model="row.price" size="mini" v-input-limit="[-9, 2]" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="twentyGP" label="20GP">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].twentyGP`">
                    <el-input v-model="row.twentyGP" size="mini" v-input-limit="[-9, 2]" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="fortyGP" label="40GP">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].fortyGP`">
                    <el-input v-model="row.fortyGP" size="mini" v-input-limit="[-9, 2]" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="fortyHQ" label="40HQ">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].fortyHQ`">
                    <el-input v-model="row.fortyHQ" size="mini" v-input-limit="[-9, 2]" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="fortyFiveHQ" label="45HQ">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].fortyFiveHQ`">
                    <el-input v-model="row.fortyFiveHQ" size="mini" v-input-limit="[-9, 2]" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="fortyNOR" label="40NOR">
                <template slot-scope="{row, $index}">
                  <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
                    :prop="`charges[${$index}].fortyNOR`">
                    <el-input v-model="row.fortyNOR" size="mini" v-input-limit="[-9, 2]" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="remark" :label="$t('air.remark')">
                <template slot-scope="{row, $index}">
                  <el-form-item :prop="`charges[${$index}].remark`">
                    <el-input v-model='row.remark' size="mini" disabled></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="operation-btn">
        <el-button @click="backList">{{ $t('seaQuotationExport.cancel') }}</el-button>
      </div>
      <ElImageViewer v-show="fileimageShow" :on-close="fileimageClose" :url-list="filepaths" />

    </div>
  </div>
</template>
<script>
import { downloadElectronicFileApi } from '@/api/seaExport'

import { getSeaQuotationExportDetailApi, quoteSeaQuotationExportApi, cancelQuoteSeaQuotationExportApi } from '@/api/seaQuotationExport'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'

import { parseTime } from '@/utils/index'
import { getDictDataApi } from '@/api/fmsReceiveAir'
import { getCurrenciesListApi } from "@/api/common"

export default {
  name: 'SeaQuotationExportQuote',
  components: {
    cargoLimitedSelect
  },

  data () {
    const defaultEditableTabs = [{
      title: this.$t('seaQuotationExport.order') + ' 1',
      name: '1',
      order: {
        carrierId: '', // 船公司
        carrierCode: '', // 船公司
        carrierName: '', // 船公司
        cutOffTime: '', // 截关时间
        etd: "", // 开航日期
        transType: "", // 中转类型:10直达、20中转

        trans: '', // 中转港/pod描述
        transCode: '', // 中转港/pod代码

        voyageDays: '', // 航程(单位：天)
        capacity: '', // 运力标识
        attention: '', // 注意事项
        quoteValidityStartTime: '', // 报价有效期
        quoteValidityEndTime: "", // 报价有效期

        chargeForm: {
          charges: [{
            "currency": "USD",
            "unit": 2005,
            "feeId": "1991111500490660",
            "feeName": this.$t('seaQuotationExport.oceanFreight'),
            "feeCode": "OFRT",
            "price": "",
            "twentyGP": "",
            "fortyGP": "",
            "fortyHQ": "",
            "fortyFiveHQ": "",
            "fortyNOR": "",
            "remark": ""
          }
          ]
        }
      }
    }];
    return {
      weekList: [7, 1, 2, 3, 4, 5, 6],
      weekItem: [this.$t('air.MON'), this.$t('air.TUE'), this.$t('air.WED'), this.$t('air.THUR'), this.$t('air.FRI'), this.$t('air.SAT'), this.$t('air.SUN')],

      fileimageShow: false,
      filepaths: [],
      unitList: [],
      currencyList: [],
      defaultEditableTabs: defaultEditableTabs,
      loading: false,
      quoteVisible: false,
      confirmationDetail: {
        ctnInfo: "",
        ctnInfoDesc: ""
      },
      editableTabsValue: '1',
      editableTabs: [{
        title: this.$t('seaQuotationExport.order') + ' 1',
        name: '1',
        order: {
          carrierId: '', // 船公司
          carrierCode: '', // 船公司
          carrierName: '', // 船公司
          cutOffTime: '', // 截关时间
          etd: "", // 开航日期
          transType: "", // 中转类型:10直达、20中转

          trans: '', // 中转港/pod描述
          transCode: '', // 中转港/pod代码

          voyageDays: '', // 航程(单位：天)
          capacity: '', // 运力标识
          attention: '', // 注意事项
          quoteValidityStartTime: '', // 报价有效期
          quoteValidityEndTime: "", // 报价有效期

          chargeForm: {
            charges: [{
              "currency": "",
              "unit": "",
              "feeId": "",
              "feeName": "",
              "feeCode": "",
              "price": "",
              "twentyGP": "",
              "fortyGP": "",
              "fortyHQ": "",
              "fortyFiveHQ": "",
              "fortyNOR": "",
              "remark": ""
            }]
          }
        }
      }],
      tabIndex: 1,
      orderRules: {
        "carrierName": [{ required: true, message: this.$t('seaQuotationExport.placeholder'), trigger: 'change' }],
        "etd": [{ required: true, message: this.$t('seaQuotationExport.placeholder'), trigger: 'change' }],
        "cutOffTime": [{ required: true, message: this.$t('seaQuotationExport.placeholder'), trigger: 'change' }],
        "transType": [{ required: true, message: this.$t('seaQuotationExport.placeholder'), trigger: 'change' }],
        "voyageDays": [{ required: true, message: this.$t('seaQuotationExport.placeholder2'), trigger: 'blur' }],
        "validTimeRange": [{ required: true, message: this.$t('seaQuotationExport.placeholder'), trigger: 'change' }]

      }
    }
  },
  watch: {
  },

  created () {
    this.init()
    this.loading = true
    getSeaQuotationExportDetailApi(this.$route.query.id).then(res => {
      this.loading = false
      try {
        res.content.deliveryTime = parseTime(res.content.deliveryTime, '{y}-{m}-{d} {h}:{i}:{s}')
        res.content.inquiryTime = parseTime(res.content.inquiryTime, '{y}-{m}-{d} {h}:{i}:{s}')
        // 柜型柜量
        let ctnInfos = ""
        res.content.ctnInfoList.forEach(info => {
          ctnInfos += info.ctnTypeDesc + "*" + info.ctnCount + ","
        })
        res.content.ctnInfoDesc = ctnInfos.substring(0, ctnInfos.length - 1);
      } catch (e) {
        console.log(e)
      }
      this.confirmationDetail = res.content
      this.editableTabs = []
      if (res.content.seaQuoteList.length > 0) {
        res.content.seaQuoteList.forEach((element, index) => {
          element.validTimeRange = [element.quoteValidityStartTime, element.quoteValidityEndTime]
          this.tabIndex = index + 1
          // element.id,
          let editableTab = {
            title: this.$t('seaQuotationExport.order') + this.tabIndex,
            name: index + 1 + "",
            order: element
          }
          if (element.seaQuoteChargeList.length > 0) {
            let seaQuoteChargeList = []
            element.seaQuoteChargeList.forEach(charge => {
              let chargeInfoList = charge.chargeInfo ? JSON.parse(charge.chargeInfo) : []
              let chargeInfo = {
                "price": "",
                "twentyGP": "",
                "fortyGP": "",
                "fortyHQ": "",
                "fortyFiveHQ": "",
                "fortyNOR": ""
              }
              chargeInfoList.forEach(chargePrice => {
                if (chargePrice.ctnType) {
                  switch (chargePrice.ctnType) {
                    case 1:
                      chargeInfo.twentyGP = chargePrice.price
                      break;
                    case 2:
                      chargeInfo.fortyGP = chargePrice.price
                      break;
                    case 3:
                      chargeInfo.fortyHQ = chargePrice.price
                      break;
                    case 4:
                      chargeInfo.fortyFiveHQ = chargePrice.price
                      break;
                    case 7:
                      chargeInfo.fortyNOR = chargePrice.price
                      break;
                    default:
                      break;
                  }
                } else {
                  chargeInfo.price = chargePrice.price
                }

              })
              if (chargeInfo) {
                charge = { ...charge, ...chargeInfo }
              }
              seaQuoteChargeList.push(charge)
            });
            editableTab.order.chargeForm = {
              charges: seaQuoteChargeList
            }
          }

          this.editableTabs.push(editableTab)

        });
      }
      console.log("editableTabs", this.editableTabs)

    })

  },

  methods: {

    disabledDate (item) {
      let that = this;
      // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
      return {
        disabledDate (date) {
          if (item.etd) {
            let currentDate = new Date(item.etd);

            // 将时间设置为当天的开始
            currentDate.setHours(0);
            currentDate.setMinutes(0);
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            return (
              date.getTime() >=
              currentDate.getTime()

            );
          }
        }
      };
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
    },
    checkRequired () {
      let that = this
      let flag = false
      this.editableTabs.forEach(function (v) {
        console.log(v)
        if (!v.order.carrierId || !v.order.etd || !v.order.cutOffTime || !v.order.transType || !v.order.voyageDays || !v.order.validTimeRange) {
          flag = true
        }
        if (Number(v.order.transType) === 20) {
          if (!v.order.transCode) {
            flag = true
          }
        }
        v.order.chargeForm.charges.forEach(item => {
          if (!item.feeName || !item.feeCode || !item.unit || !item.currency) {
            flag = true
          }
          if (item.feeCode !== "OFRT" || item.unit === 2004) {
            if (!item.price) {
              flag = true
            }
          }
          if (!that.editStatus(item, "20GP")) {
            if (!item.twentyGP) {
              flag = true
            }
          }
          if (!that.editStatus(item, "40GP")) {
            if (!item.fortyGP) {
              flag = true
            }
          }
          if (!that.editStatus(item, "40HQ")) {
            if (!item.fortyHQ) {
              flag = true
            }
          }
          if (!that.editStatus(item, "45HQ")) {
            if (!item.fortyFiveHQ) {
              flag = true
            }
          }
          if (!that.editStatus(item, "40NOR")) {
            if (!item.fortyNOR) {
              flag = true
            }
          }

        });

      })
      return flag
    },
    editStatus (row, item) {
      if (this.confirmationDetail.ctnInfoDesc.indexOf(item) !== -1 && row.unit === 2005) {
        // 存在
        return false
      } else {
        return true
      }

    },
    init () {
      Promise.all([getDictDataApi(8), getCurrenciesListApi()]).then(results => {
        const unitRes = results[0]
        const currencyRes = results[1]
        if (unitRes.ok) {
          let unit = [];
          unitRes.content.forEach(v => {
            if (v.code === 2004 || v.code === 2005) {
              unit.push(v)
            }
          })
          this.unitList = unit
        }
        if (currencyRes.ok) {
          this.currencyList = currencyRes.content
        }

      })
    },
    addOrder () {
      if (this.checkRequired()) {
        this.$message.warning(this.$t('seaQuotationExport.addWQVWarming'))
        return
      }
      let airBagOrderDTOList = []
      this.editableTabs.forEach(element => {
        element.order.quoteValidityStartTime = element.order.validTimeRange[0]
        element.order.quoteValidityEndTime = element.order.validTimeRange[1]

        element.order.offerType = 10

        element.order.chargeForm.charges.forEach(chage => {
          let chargeInfo = {
            "price": chage.price,
            "twentyGP": chage.twentyGP,
            "fortyGP": chage.fortyGP,
            "fortyHQ": chage.fortyHQ,
            "fortyFiveHQ": chage.fortyFiveHQ,
            "fortyNOR": chage.fortyNOR
          }
          chage.chargeInfo = JSON.stringify(chargeInfo)
        })

        element.order.seaQuoteChargeList = element.order.chargeForm.charges
        airBagOrderDTOList.push(element.order)
      });

      quoteSeaQuotationExportApi({
        seaQuotationExportId: this.$route.query.id,
        seaQuoteDTOList: airBagOrderDTOList
      }).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t("air.successSaved"));
          this.backList()
        }
        this.loading = false
      })
    },
    removeTab (targetName) {
      this.loading = true
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {

          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      this.loading = false
    },
    clickTab (targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
    },
    selectedCarrier (carrier) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.carrierId = carrier.id
      this.editableTabs[obj].order.carrierCode = carrier.scacCode
      this.editableTabs[obj].order.carrierName = carrier.englishShortname
    },
    selectedTrans (port) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.trans = port.englishName
    },
    selectedTransType (item) {
      if (Number(item) === 10) {
        let activeName = this.editableTabsValue;
        let obj = this.editableTabs.findIndex(item => item.name === activeName)
        this.editableTabs[obj].order.trans = ""
        this.editableTabs[obj].order.transCode = ""
      }
    },
    addTab () {
      if (this.checkRequired()) {
        this.$message.warning(this.$t('seaQuotationExport.addWQVWarming'))
        return
      }
      let newTabName = ++this.tabIndex + '';
      let editableTabsAdd = {
        title: this.$t('seaQuotationExport.order') + this.tabIndex,
        name: newTabName,
        order: {

          carrierId: '', // 船公司
          carrierCode: '', // 船公司
          carrierName: '', // 船公司
          cutOffTime: '', // 截关时间
          etd: "", // 开航日期
          transType: "", // 中转类型:10直达、20中转

          trans: '', // 中转港/pod描述
          transCode: '', // 中转港/pod代码

          voyageDays: '', // 航程(单位：天)
          capacity: '', // 运力标识
          attention: '', // 注意事项
          quoteValidityStartTime: '', // 报价有效期
          quoteValidityEndTime: "", // 报价有效期
          chargeForm: {
            charges: [{
              "currency": "USD",
              "unit": 2005,
              "feeName": this.$t('seaQuotationExport.oceanFreight'),
              "feeCode": "OFRT",
              "price": "",
              "twentyGP": "",
              "fortyGP": "",
              "fortyHQ": "",
              "fortyFiveHQ": "",
              "fortyNOR": "",
              "remark": ""
            }]
          }
        }
      }
      this.editableTabs.push(editableTabsAdd);
      this.editableTabsValue = newTabName;
    },
    // 取消报价
    unableQuote () {
      cancelQuoteSeaQuotationExportApi(this.$route.query.id).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t("seaQuotationExport.unableQuoteSuccess"));
          this.backList()
        }
        this.loading = false
      })
    },

    backList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `SeaQuotationExportList` })
    },

    deleteFn (index) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      this.editableTabs[obj].order.chargeForm.charges.push({
        "currency": "",
        "unit": "",
        "feeName": "",
        "feeCode": "",
        "price": "",
        "twentyGP": "",
        "fortyGP": "",
        "fortyHQ": "",
        "fortyFiveHQ": "",
        "fortyNOR": "",
        "remark": ""
      }
      )
    },
    selectedFee (charge, index) {
      console.log("charge", charge)
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      let item = this.editableTabs[obj].order.chargeForm.charges[index]
      if (charge.code === "OFRT") {
        item.feeId = ""
        item.feeName = ""
        item.feeCode = ""
        this.$message.warning(this.$t("seaQuotationExport.oceanFreightWarning"))
      } else {
        item.feeId = charge.id
        item.feeName = charge.chineseName
        item.feeCode = charge.code
      }
      this.$set(this.editableTabs[obj].order.chargeForm.charges, index, item)
    },
    unitlChange (charge, index) {
      let activeName = this.editableTabsValue;
      let obj = this.editableTabs.findIndex(item => item.name === activeName)
      let item = this.editableTabs[obj].order.chargeForm.charges[index]
      item.price = ""
      item.twentyGP = ""
      item.fortyGP = ""
      item.fortyHQ = ""
      item.fortyFiveHQ = ""
      item.fortyNOR = ""
      this.$set(this.editableTabs[obj].order.chargeForm.charges, index, item)
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
</style>
