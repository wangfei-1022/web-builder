<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('outInStorageManage.updateOutboundInfo')" width="1400px"
      :close-on-click-modal="false">
      <div class="dialog-content" v-loading="loading">
        <div class="info-title">{{ getZH("baseInfo") }}</div>
        <div class="page-content mt-20 mb-10 flex-box">
          <div class="mr-20">
            <span>{{ getZH('orderNo') }}：</span>
            <span>{{ detailContent.outboundNo || '-' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('customerOutboundNo') }}：</span>
            <span>{{ detailContent.customerOutboundNo || '-' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('containerNumber') }}：</span>
            <span>{{ detailContent.containerNumber || '-' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('warehouseName') }}：</span>
            <span>{{ detailContent.warehouseName || '-' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('traceAppoint') }}：</span>
            <span>{{ detailContent.traceAppointFlag ? 'Y' : 'N' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('unpackFlag') }}：</span>
            <span>{{ detailContent.unpackFlag ? 'Y' : 'N' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('isPickup') }}：</span>
            <span>{{ detailContent.pickup ? 'Y' : 'N' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('trayCount') }}：</span>
            <span>{{ detailContent.trayCount || '-' }}</span>
          </div>
          <div class="mr-20">
            <span>{{ getZH('goods') }}：</span>
            <span>{{ detailContent.productTypeName || '-' }}</span>
          </div>
        </div>
        <div class="info-title">
          {{ getZH("outBoundInfo") }}
          <span class="el-icon-info fs-12 ml-20"></span>
          <span class="fs-12 ml-4">{{ getZH('mergeCallbackTips') }}</span>
        </div>

        <el-form label-width="70px" label-position="left" :inline="true" :model="formData" :rules="rules" ref="formData"
          v-if="dialogVisible">
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane v-for="(item, index) in formData.outboundDetailList || []" :key="item.orderNo"
              :label="item.orderNo" :name="item.orderNo">
              <div class="page-content mt-20 mb-10 flex-box">
                <div class="mr-20">
                  <span>{{ getZH('status') }}：</span>
                  <span>{{ item.statusName || '-' }}</span>
                </div>
                <div class="mr-20">
                  <span>{{ getZH('trayNum') }}：</span>
                  <span>{{ item.actualPalletQuantity || '-' }}</span>
                </div>
                <div class="mr-20">
                  <span>{{ getZH('numberPackages') }}：</span>
                  <span>{{ item.skuQuantity || '-' }}</span>
                </div>
                <div class="mr-20">
                  <span>{{ getZH('netWeightTotal') }}：</span>
                  <span>{{ item.totalWeight || '-' }}</span>
                </div>
              </div>
              <el-table border v-if="activeName === item.orderNo" :data="item.outboundConfirmGoodsList || []"
                size="mini" stripe style="width: 100%" class="mb-20">
                <el-table-column :label="getZH('number')" width="50">
                  <template slot-scope="{$index}">
                    <span>{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <!-- v-if="detailContent.productType === 1 && !detailContent.traceAppointFlag" -->
                <el-table-column :label="getZH('containerNumber')" min-width="150" show-overflow-tooltip>
                  <template slot-scope="{row,$index}">
                    <el-form-item label-width="0px" label="" class="mb-0"
                      v-if="item.status === 215 && detailContent.productType === 1 && detailContent.dockingWay && detailContent.dockingWay.indexOf('4') > -1"
                      :prop="`outboundDetailList[${index}].outboundConfirmGoodsList[${$index}].containerNumber`"
                      :rules="[{ required: detailContent.productType === 1 && activeName === operateItem.orderNo, message: inputZH('traceId') }]">
                      <el-input size="mini" v-model="row.containerNumber"
                        :placeholder="getZH('placeholder', 'common')"></el-input>
                    </el-form-item>
                    <span v-else>{{ row.containerNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('trayNo')" min-width="150" show-overflow-tooltip>
                  <template slot-scope="{row,$index}">
                    <el-form-item label-width="0px" label="" class="mb-0"
                      v-if="item.status === 215 && detailContent.productType === 1 && detailContent.dockingWay && detailContent.dockingWay.indexOf('4') > -1"
                      :prop="`outboundDetailList[${index}].outboundConfirmGoodsList[${$index}].traceId`"
                      :rules="[{ required: detailContent.productType === 1 && activeName === operateItem.orderNo, message: inputZH('trayNo') }]">
                      <el-input size="mini" @blur="getOutboundGoodsInfo(row)" v-model="row.traceId"
                        :placeholder="getZH('placeholder', 'common')"></el-input>
                    </el-form-item>
                    <span v-else>{{ row.traceId }}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="110"
                  :label="detailContent.productType === 2 ? getZH('materielCode') : getZH('specifications')">
                  <template slot-scope="{row}">
                    <div>{{ detailContent.productType === 2 ? (row.productCode || '-') : (row.specifications || '-') }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" :label="getZH('blockNum')" width="110">
                  <template slot-scope="{row}">
                    {{ row.quantity || '-' }}
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('location')" min-width="110" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    <span>{{ row.stockLocation || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="SN" min-width="120" show-overflow-tooltip>
                  <!--  -->
                  <template slot-scope="{row,$index}">
                    <el-form-item v-if="!operateItem.callBackFlag" label-width="0px" label="" class="mb-0"
                      :prop="`outboundDetailList[${index}].outboundConfirmGoodsList[${$index}].sn`"
                      :rules="[{ required: detailContent.unpackFlag && detailContent.productType === 1 && activeName === operateItem.orderNo, message: getZH('select_sn_no') }]">
                      <el-input v-model="row.sn" size="mini" :placeholder="getZH('placeholder', 'common')"></el-input>
                    </el-form-item>
                    <span v-else>{{ row.sn || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('ownerCode')" min-width="110" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    <span>{{ row.ownerName || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeightPallet" :label="getZH('grossWeightPallet')" width="130">
                  <template slot-scope="{row}">
                    {{ row.palletWeight || '-' }}
                  </template>
                </el-table-column>
                <el-table-column :label="getZH('damageFlag')" width="110" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    <span>{{ row.damageFlag ? 'Y' : 'N' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div v-if="$isEmpty(formData.outboundDetailList)" class="empty-data fc-red">
            暂无可出库的出库单，请检查
          </div>
          <el-form-item :label="getZH('outTime')" prop="outTime">
            <el-date-picker value-format="timestamp" v-model="formData.outTime" type="datetime" placeholder="选择日期时间"
              size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item :label="getZH('pickTime')">
            <CommonPicker v-model="formData.pickTime" pikcer-type="datetime" :disabled="operateItem.callBackFlag"
              pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
          </el-form-item>
          <el-form-item :label="getZH('loadingTime')">
            <CommonPicker v-model="formData.loadingTime" pikcer-type="datetime" :disabled="operateItem.callBackFlag"
              pickerFormat="yyyy-MM-dd HH:mm:ss" parentOption="betweenDependence"
              :startDependence="todayTime - 14 * 24 * 60 * 60 * 1000 + 1" size="mini" />
          </el-form-item>
          <el-form-item :label="getZH('carNo')">
            <el-input v-model="formData.carNo" maxlength="20" size="mini" :disabled="operateItem.callBackFlag"
              :placeholder="inputZH('carNo')"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini"
          :disabled="operateItem.callBackFlag || $isEmpty(formData.outboundDetailList)" @click="submitForm()">{{
            $t("common.confirmBtn") }}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{ $t("common.cancelBtn") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detailTaskOutboundBackApi, saveTaskCallBackOutboundApi, callTaskOutboundApi, getOutboundGoodsInfoApi } from '@/api/OverseasWarehouse/outInStorageManage.js'
import getZHMixin from './getZHMixin'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
export default {
  name: 'UpdateOutboundInfoDialog',
  mixins: [getZHMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String
  },
  data() {
    let defaultForm = {
      id: null,
      outboundId: null,
      outTime: null,
      pickTime: null,
      loadingTime: null,
      carNo: null,
      outboundDetailList: [],
      batchGoodsList: []
    }
    return {
      detailContent: {},
      dialogVisible: false,
      loading: false,
      mergeCallbackFlag: false,
      activeName: null,
      todayTime: null,
      operateItem: {},
      defaultForm,
      rules: {
        outTime: [{ required: true, message: this.getZH('please_select_outTime'), trigger: 'blur' }]
      },
      formData: this.$extends({}, defaultForm)
    }
  },
  created() {
    let time = new Date()
    time.setHours(0)
    time.setMinutes(0)
    time.setSeconds(0)
    time.setMilliseconds(0)
    this.todayTime = time.getTime()
  },
  methods: {
    // 提交数据
    submitForm() {
      // 非自提情况下
      if (!this.detailContent.pickup) {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let saveForm = this.$extends(true, {}, this.formData)
            saveForm.optZone = -new Date().getTimezoneOffset() / 60
            delete saveForm.batchGoodsList
            delete saveForm.outboundId
            this.loading = true
            callTaskOutboundApi(saveForm).then(res => {
              if (res.ok) {
                this.$message.success(this.$t('common.saveSuccess'))
                this.$emit('saved')
                this.dialogVisible = false
              }
              this.loading = false
            })
          } else {
            this.mixinsFormScrollIntoView()
          }
        })

      } else {
        this.saveForm('formData')
      }
    },
    async saveForm(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          let saveForm = this.$extends(true, {}, this.formData)
          saveForm.batchGoodsList = this.operateItem.outboundConfirmGoodsList
          saveForm.outboundId = this.operateItem.id
          delete saveForm.outboundDetailList
          saveForm.batchGoodsList.forEach(item => {
            if (this.$isEmpty(item.sn)) {
              item.sn = '*'
            }
          })
          saveForm.optZone = -new Date().getTimezoneOffset() / 60
          this.loading = true
          saveTaskCallBackOutboundApi(saveForm).then(res => {
            if (res.ok) {
              // 添加日志 记录数据
              this.logBtnSend({
                origin: logOrigin.SYSTEM_OPERATION,
                logCode: pointOvl.OVL_OUTBOUND_TASK_CONFIRM,
                serviceName: logServiceName.OVL_SERVICE,
                businessType: pointOvl.OVL_OUTBOUND_TASK_CONFIRM,
                content: {
                  ...saveForm
                }
              })
              this.$message.success(this.$t('common.saveSuccess'))
              this.$emit('saved')
              this.dialogVisible = false
            }
            this.loading = false
          })
        } else {
          this.mixinsFormScrollIntoView()
        }
      })
    },
    // 校验托盘数据
    async getOutboundGoodsInfo(row) {
      if (this.$isEmpty(row.traceId)) {
        return
      }
      let data = {
        taskId: this.detailContent.id,
        traceId: row.traceId,
        specifications: row.taskId,
        productCode: row.productCode
      }

      let res = await getOutboundGoodsInfoApi(data)
      if (res.ok) {
        row.stockLocation = res.content.stockLocationCode
        row.damageFlag = res.content.damageFlag
        row.ownerName = res.content.ownerName
        row.ownerId = res.content.ownerId
      } else {
        row.traceId = null
      }
    },
    tabClick() {
      let operateItem = this.formData.outboundDetailList.find(item => item.orderNo === this.activeName)
      this.operateItem = operateItem
      // 已经回调 或者云仓非自提取接口数据
      if (operateItem.callBackFlag || (!this.detailContent.pickup && this.detailContent.dockingWay.indexOf('4') > -1)) {
        this.$copyProps(this.formData, operateItem, 'id')
      } else {
        this.$copyProps(this.formData, this.defaultForm, ['outboundDetailList', 'id'])
        this.formData.outTime = this.todayTime
      }
    },
    /**
     * 获取详情
     */
    async getDetail(id) {
      this.loading = true
      let res = await detailTaskOutboundBackApi(id)
      if (res.ok) {
        this.$copyProps(this.formData, res.content, 'outTime')
        this.formData.outboundDetailList = res.content.outboundDetailList
        this.detailContent = res.content
        if (this.$isNotEmpty(res.content.outboundDetailList)) {
          this.activeName = res.content.outboundDetailList[0].orderNo
          this.tabClick()
        }
      }
      this.loading = false

    }

  },
  watch: {
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    visible(val) {
      if (val) {
        this.formData = this.$extends({}, this.defaultForm)
        this.formData.outTime = this.todayTime
        if (this.$isNotEmpty(this.id)) {
          this.getDetail(this.id)
        }
      }
      this.dialogVisible = val
    }
  }

}
</script>

<style scoped lang="less">
.page-content {
  color: #606266;
  font-size: 12px;
  flex-wrap: wrap;

  &>div {
    white-space: nowrap;
    margin-bottom: 10px;
  }
}

.empty-data {
  width: 500px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 16px;
}
</style>
