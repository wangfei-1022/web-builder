<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="sys-right-inner-wrap">
    <div>
      <el-button size="mini" type="primary" plain @click="goList">{{$t('common.backList')}}</el-button>
      {{bookingForm.statusName}}
    </div>
    <div v-if="pageShow < 3" class="public-box">
      <div v-show="pageShow == 1" class="page2">
        <div class="feed-head">
          <el-form :inline="true" :model="bookingForm" label-width="100px" class="booking-form" @submit.native.prevent>
            <el-form-item :label="$t('blInfo.pageFocus')">
              <el-input v-model="pageFocus" size="small" :placeholder="$t('blInfo.placeholderSO')" class="other-input" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-search" @click="goPageFocus()">{{ $t('common.searchBtn') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('blInfo.increaseContainer')">
              <el-input v-model="addContainerVal" size="small" :placeholder="$t('blInfo.placeholderSO')" class="other-input" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" :disabled="addSODisabled" @click="addSO('add')">{{ $t('blInfo.add') }}</el-button>
            </el-form-item>
          </el-form>
          <div class="total">
            <p>&nbsp;&nbsp;&nbsp;{{ $t('blInfo.containerVolume') }}：<span>{{ bookingForm.containerSizeTypeQty }}</span></p>
            <p>{{ $t('blInfo.totalNumber') }}：<span>{{ bookingForm.sumQuantity }}</span> {{ bookingForm.packageType }}</p>
            <p>{{ $t('blInfo.grossWeight') }}：<span>{{ towNumber(bookingForm.sumGrossWeight) }}</span> KGS</p>
            <p>{{ $t('blInfo.totalCapacity') }}：<span>{{ towNumber(bookingForm.sumVolume) }}</span> CBM</p>
          </div>
        </div>
        <div v-for="(item,index) of allTableDataList" :key="index" class="data-so-case">
          <el-form :model="item" :rules="rules" ref="formContainerNoAndSealNo" label-width="0px" class="booking-form" @submit.native.prevent>
            <div class="box-information" :ref="`${item.soNo}_${item.containerNo}`">
              <div>
                <p>SO</p>
                <p>{{ item.soNo }}</p>
              </div>
              <div>
                <p>{{ $t('blInfo.boxType') }}</p>
                <p>{{ item.containerType }}</p>
              </div>
              <div>
                <p><span class="red">*</span>{{ $t('blInfo.boxNumber') }}</p>
                <el-form-item label="" prop="containerNo" :rules="validateContainerNo(item.containerType)">
                  <!--                :disabled="!item.socFlag"-->
                  <el-input ref="refContainerNo" v-model="item.containerNo " @change="getContainerNo(item.containerNo,index)" @blur="socFlagBlur(index,item.containerNo)"  clearable></el-input>
                </el-form-item>
              </div>
              <div>
                <p><span class="red">*</span>{{ $t('blInfo.sealNumber') }}</p>
                <el-form-item label="" prop="sealNo">
                  <el-input ref="refSealNo" v-model="item.sealNo" clearable @blur="sealNoBlur(index,item.sealNo)" ></el-input>
                </el-form-item>

                <!--            <p v-show="!showEditSO[index].sealNo" class="sealNo">{{ item.sealNo }} <i class="el-icon-edit" @click="showEditSOFun(index,'refSealNo')" :title="$t('bookingList.edit')"></i></p>-->
                <!--            <p v-show="showEditSO[index].sealNo">-->

                <!--              <el-input ref="refSealNo" @blur="sealNoBlur(index,item.sealNo)" size="small" v-model="item.sealNo" class="other-input" :class="{'blinfo-error': !editScope.sealNo && isShowError }" :placeholder="$t('blInfo.placeholdSealNo')" ></el-input>-->
                <!--            </p>-->
              </div>
              <div>
                <el-button size="small" type="primary" class="features-btn" @click="removeSO(index)">{{ $t('blInfo.removeCabinet') }}</el-button>
              </div>
              <div>
                <el-button size="small" type="primary" class="features-btn" @click="addRow(index)">{{ $t('blInfo.addCargoDetails') }}</el-button>
              </div>
            </div>
          </el-form>
          <el-table class="case-data-table" :data="item.cargoDTOList">
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>{{$t('charteredBoat.hsCode')}}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-if="editable[index][scope.$index]"
                  v-model="editScope.hsCode"
                  size="mini"
                  maxlength="255"
                  minlength="4"
                  :placeholder="$t('charteredBoat.hsCode')"
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  :class="{'blinfo-error': (!editScope.hsCode || editScope.hsCode.length < 6) && editable[index][scope.$index] && isShowError }"
                />
                <span v-else>{{ scope.row.hsCode }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>{{ $t('blInfo.number') }}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-if="editable[index][scope.$index]"
                  v-model="editScope.quantity"
                  size="mini"
                  maxlength="5"
                  :placeholder="$t('blInfo.number')"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  :class="{'blinfo-error': !editScope.quantity && editable[index][scope.$index] && isShowError }"
                />
                <span v-else>{{ scope.row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('blInfo.unit') }}
              </template>
              <template slot-scope="scope">
                <el-select
                  v-if="editable[index][scope.$index]"
                  v-model="editScope.packageType"
                  filterable
                  :placeholder="$t('common.placeholder')"
                  size="mini"
                  :class="{'blinfo-error': !editScope.packageType && editable[index][scope.$index] && isShowError }"
                >
                  <el-option
                    v-for="item in packageTypeOption"
                    :key="item.englishName"
                    :label="item.englishName"
                    :value="item.englishName"
                  />
                </el-select>

                <span v-else>{{ scope.row.packageType }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('charteredBoat.grossWeight') }}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-if="editable[index][scope.$index]"
                  v-model="editScope.weight"
                  v-input-limit="[5,3]"
                  size="mini"
                  :placeholder="$t('charteredBoat.grossWeight')"
                  :class="{'blinfo-error': !editScope.weight && editable[index][scope.$index] && isShowError }"
                />
                <span v-else>{{ scope.row.weight }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('charteredBoat.volume') }}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-if="editable[index][scope.$index]"
                  v-model="editScope.volume"
                  v-input-limit="[3,3]"
                  size="mini"
                  :placeholder="$t('charteredBoat.volume')"
                  :class="{'blinfo-error': !editScope.volume && editable[index][scope.$index] && isShowError }"
                />
                <span v-else>{{ scope.row.volume }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('blInfo.cargoDescription') }}
              </template>
              <template slot-scope="scope">
                <el-input
                  v-if="editable[index][scope.$index]"
                  v-model="editScope.cargoDesc"
                  size="mini"
                  maxlength="255"
                  :placeholder="$t('blInfo.cargoDescription')"
                  :class="{'blinfo-error': !editScope.cargoDesc && editable[index][scope.$index] && isShowError }"
                  @blur="upper"
                />
                <span v-else class="ellipsis" :title="scope.row.cargoDesc">{{ scope.row.cargoDesc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode" :label="$t('common.operation')">
              <template slot-scope="scope">
                <div v-if="!editable[index][scope.$index]" class="operating">
                  <i class="el-icon-edit" @click="changeEdit(scope.row,index,scope.$index)" />
                  <i class="el-icon-delete" @click="deleteRow(index,scope.$index)" />
                  <!--                v-show="Object.keys(editScope).length === 0"-->
                </div>
                <div v-else class="operating">
                  <i class="el-icon-close operating-close" @click="closeEdit(index,scope.$index)" />
                  <i class="el-icon-check operating-save" @click="saveEdit(scope.row,index,scope.$index)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <BlInfoPage2 v-if="pageShow === 2" ref="BlInfoPage2" :initialValue="bookingForm" :containerList="allTableDataList" @retCustomerBlForm="retCustomerBlForm"></BlInfoPage2>
      <!--        待审核-->
      <!--        <i v-if="bookingForm.status === 2" class="iconfont icon-daishenhe approval-status" style="color: #ced0d2" />-->
      <!--        &lt;!&ndash;        已审核&ndash;&gt;-->
      <!--        <i v-if="bookingForm.status === 3" class="iconfont icon-yitongguo approval-status" style="color: #42b983" />-->
      <!--        &lt;!&ndash;        已驳回&ndash;&gt;-->
      <!--        <i v-if="bookingForm.status === 4" class="iconfont icon-butongguo approval-status" style="color: red" />-->
      <!--        <p class="title">{{ $t('blInfo.BLInfo') }}</p>-->
      <!--        <div class="booking-num">-->
      <!--          <div class="booking-num-text">{{ $t('blInfo.bookingNumber') }}</div>-->
      <!--          <div>{{ bookingForm.blNo }}</div>-->
      <!--        </div>-->
      <!--        <div class="flex" style="margin-bottom: 30px; line-height: 36px;">-->
      <!--          <el-checkbox v-model="otherChecked" @change="otherBookingDisabled = !otherBookingDisabled">{{ $t('blInfo.otherBL') }}</el-checkbox>-->
      <!--          <el-input v-model="otherBookingVal" :placeholder="$t('blInfo.placeholder')" :disabled="otherBookingDisabled" class="other-input" style="width: 200px; margin-left: 30px;" @blur="otherBookingBlur" />-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <el-form ref="bookingFormRule" :model="bookingForm" :rules="rules" label-width="100px" class="booking-form" @submit.native.prevent>-->
      <!--            <div class="type-group-box">-->
      <!--              <el-form-item :label="$t('blInfo.BLType')" prop="blType" class="blinfo-type-group2" label-width="70px">-->
      <!--                <el-radio-group v-model="bookingForm.blType">-->
      <!--                  <el-radio :label="1">{{ $t('blInfo.original') }}</el-radio>-->
      <!--                  <el-radio :label="2">{{ $t('blInfo.telex') }}</el-radio>-->
      <!--                </el-radio-group>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item :label="$t('charteredBoat.paymentMethod')" prop="paymentMode" class="blinfo-type-group2" label-width="70px">-->
      <!--                <el-radio-group v-model="bookingForm.paymentMode">-->
      <!--                  <el-radio :label="2">{{ $t('charteredBoat.toPay') }}</el-radio>-->
      <!--                  <el-radio :label="1">{{ $t('charteredBoat.prepaid') }}</el-radio>-->
      <!--                </el-radio-group>-->
      <!--              </el-form-item>-->
      <!--            </div>-->
      <!--            <div class="blinfo-logistics-info">-->
      <!--              <el-form-item :label="$t('blInfo.shipper')" prop="shipperAddress">-->
      <!--                <el-autocomplete-->
      <!--                  v-model="bookingForm.shipperAddress"-->
      <!--                  class="inline-input"-->
      <!--                  popper-class="my-autocomplete"-->
      <!--                  type="textarea"-->
      <!--                  :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'shipperAddress')})"-->
      <!--                  :placeholder="$t('blInfo.placeholderShipper')"-->
      <!--                  :autosize="{ minRows: 4, maxRows: 6}"-->
      <!--                  @select="selectShipper"-->
      <!--                >-->
      <!--                  <template slot-scope="{ item }">-->
      <!--                    <div class="major">{{ item.shipperAddress }}</div>-->
      <!--                    <div class="secondary">{{ $t('blInfo.income') }}：{{ item.consigneeAddress }}</div>-->
      <!--                    <div class="secondary">{{ $t('blInfo.through') }}：{{ item.notifyAddress }}</div>-->
      <!--                  </template>-->
      <!--                </el-autocomplete>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item :label="$t('blInfo.consignee')" prop="consigneeAddress">-->
      <!--                <el-autocomplete-->
      <!--                  v-model="bookingForm.consigneeAddress"-->
      <!--                  class="inline-input"-->
      <!--                  popper-class="my-autocomplete"-->
      <!--                  type="textarea"-->
      <!--                  :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'consigneeAddress')})"-->
      <!--                  :placeholder="$t('blInfo.placeholderConsignee')"-->
      <!--                  :autosize="{ minRows: 4, maxRows: 6}"-->
      <!--                  @select="selectShipper"-->
      <!--                >-->
      <!--                  <template slot-scope="{ item }">-->
      <!--                    <div class="major">{{ item.consigneeAddress }}</div>-->
      <!--                    <div class="secondary">{{ $t('blInfo.issue') }}：{{ item.shipperAddress }}</div>-->
      <!--                    <div class="secondary">{{ $t('blInfo.through') }}：{{ item.notifyAddress }}</div>-->
      <!--                  </template>-->
      <!--                </el-autocomplete>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item :label="$t('blInfo.alertOthers')" prop="notifyAddress">-->
      <!--                <el-button type="primary" size="mini" class="copy-consignee" @click="copyConsignee">{{ $t('blInfo.copyConsignee') }}</el-button>-->
      <!--                <el-autocomplete-->
      <!--                  v-model="bookingForm.notifyAddress"-->
      <!--                  class="inline-input"-->
      <!--                  popper-class="my-autocomplete"-->
      <!--                  type="textarea"-->
      <!--                  :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'notifyAddress')})"-->
      <!--                  :placeholder="$t('blInfo.placeholderAlertOthers')"-->
      <!--                  :autosize="{ minRows: 4, maxRows: 6}"-->
      <!--                  @select="selectShipper"-->
      <!--                >-->
      <!--                  <template slot-scope="{ item }">-->
      <!--                    <div class="major">{{ item.notifyAddress }}</div>-->
      <!--                    <div class="secondary">{{ $t('blInfo.issue') }}：{{ item.shipperAddress }}</div>-->
      <!--                    <div class="secondary">{{ $t('blInfo.income') }}：{{ item.consigneeAddress }}</div>-->
      <!--                  </template>-->
      <!--                </el-autocomplete>-->
      <!--              </el-form-item>-->
      <!--              <el-form-item :label="$t('blInfo.notifierSEmail')" prop="notifyEmail" class="blinfo-type-group">-->
      <!--                <el-input v-model="bookingForm.notifyEmail" :placeholder="$t('blInfo.placeholderAlertEmail')" class="other-input" />-->
      <!--              </el-form-item>-->
      <!--              <el-form-item :label="$t('blInfo.BLLading')" prop="marks" class="blinfo-type-group">-->
      <!--                <el-input v-model="bookingForm.marks" type="textarea" :placeholder="$t('blInfo.placeholderLading')" :autosize="{ minRows: 4, maxRows: 6}" class="other-input" />-->
      <!--              </el-form-item>-->
      <!--              <el-form-item :label="$t('blInfo.BLDescribe')" prop="blDesc" class="blinfo-type-group">-->
      <!--                <el-input v-model="bookingForm.blDesc" type="textarea" :placeholder="$t('blInfo.placeholderDescribe')" :autosize="{ minRows: 4, maxRows: 6}" class="other-input" />-->
      <!--              </el-form-item>-->
      <!--            </div>-->
      <!--          </el-form>-->

      <!--        </div>-->

    </div>
    <div v-show="pageShow<3" class="footer clearfix">

      <!--        <el-button v-else @click="back" size="mini">{{ $t('blInfo.cancel') }}</el-button>-->
      <el-button v-show="pageShow == 2" size="mini" type="primary" plain class="marL20" @click="pageShow = 1">{{$t('common.previousStep')}}</el-button>
      <el-button type="primary" class="marL20" size="mini" @click="nextStep">
        <span v-if="query.type === 'examine' && pageShow == 2">
          {{ $t('blInfo.examine') }}
        </span>
        <span v-else>
          <template v-if="pageShow == 1">
            {{ $t('common.nextStep') }}
          </template>
          <template v-else-if="pageShow == 2">
            {{ $t('common.submitBtn') }}
          </template>
        </span>
      </el-button>
      <el-button v-if="query.type === 'examine'" class="marL20" size="mini" type="danger" @click="rejectShow">{{ $t('common.rejectBill') }}</el-button>
      <el-dialog :title="$t('blInfo.examineInfoError')" :visible.sync="dialogFormVisible" width="30%" label-position="top">
        <el-form ref="rejectReasonForm" :model="rejectReasonForm">
          <el-form-item
            :label="$t('blInfo.reasonOfRejected')"
            class="reasons-rejection"
            prop="rejectReason"
            :rules="[
              { required: true, message: $t('blInfo.pleaseEnterRejection')},
            ]"
          >
            <el-input v-model="rejectReasonForm.rejectReason" autocomplete="off" type="textarea" :rows="4" :placeholder="$t('common.placeholder')" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{$t('common.cancelBtn')}}</el-button>
          <el-button type="primary" @click="rejectFun">{{$t('common.confirmBtn')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <!--    补料-->
    <success v-if="pageShow == 3" :return-b-l-data="returnBLData" />
    <el-dialog :title="$t('blInfo.changeMBL')" :visible.sync="dialogChangeMBL" width="30%" label-position="top">
      <div style="display: flex; margin-bottom: 30px">
        <div>{{$t('blInfo.currentMBL')}}：{{ bookingForm.mblNo }}</div>
        <div style="margin-left: 50px;">{{$t('blInfo.correlationBL')}}：{{ bookingForm.blNo }}</div>
      </div>
      <el-form ref="changeMBLForm" :model="changeMBLForm">
        <el-form-item :label="$t('blInfo.changeToMBL')" class="reasons-rejection" prop="mblNo" :rules="[ { required: true, message: $t('blInfo.MBLEmptyInvalid') }, ]">
          <el-input v-model="changeMBLForm.mblNo" :placeholder="$t('blInfo.MBLPlaceholder')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChangeMBL">{{$t('common.cancelBtn')}}</el-button>
        <el-button type="primary" @click="submitChangeMBL">{{$t('common.confirmBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  buildBillNo,
  getContainerDetailByIdsApi,
  billOfLoading,
  findContainerForBillOfLoading,
  getBillDetail, billDetailByBlNo, getLastScn, reject
} from '@/api/bl.js'
import Success from '@/views/cargo/v0/CharteredBoat/Success'
import { validContainerNo, validContainerNo53HC, validEmail } from '@/utils/validate'
import {
  blMerge,
  checkMblNoApi,
  dropdownlist,
  getContainerDetailByContainerNoApi, getContainerSailingDetailByIdsApi, partnerAdvancedApi,
  review,
  submitSaveEdit,
  updateMblNoApi
} from '@/api/bl'
import lodash from 'lodash'
import BlInfoPage2 from "@/views/cargo/v0/CharteredBoat/BlInfoPage2";

export default {
  name: 'BLInfo',
  components: { Success, BlInfoPage2 },
  data() {
    return {
      dialogFormVisible: false,
      query: this.$route.query,
      fullscreenLoading: false,
      isLoading: 0,
      pageShow: 1,
      otherChecked: false,
      otherBookingDisabled: true,
      otherBookingVal: '',
      bookingForm: {
        blNo: this.$route.query.blNo,
        blType: '', // 提单类型;1正本2电放
        paymentMode: '',
        shipperAddress: '', // 发货人
        consigneeAddress: '', // 收货人
        notifyAddress: '', // 通知人
        marks: '', // 唛头
        blDesc: '', // 提单货描
        notifyEmail: '' // 通知人邮箱地址
      },
      rules: {
        blType: [{ required: true, message: this.$t('blInfo.requiredBLType'), trigger: 'change' }],
        paymentMode: [{ required: true, message: this.$t('blInfo.requiredPaymentMode'), trigger: 'change' }],
        shipperAddress: [{ required: true, message: this.$t('blInfo.requiredShipperAddress'), trigger: 'change' }],
        consigneeAddress: [{ required: true, message: this.$t('blInfo.placeholderConsignee'), trigger: 'change' }],
        notifyAddress: [{ required: true, message: this.$t('blInfo.placeholderAlertOthers'), trigger: 'change' }],
        notifyEmail: [{ required: true, message: this.$t('blInfo.placeholderAlertEmail'), trigger: 'blur' }, { validator: this.validateEmail, trigger: 'blur' }],
        marks: [{ required: true, message: this.$t('blInfo.requiredBLLading'), trigger: 'blur' }],
        blDesc: [{ required: true, message: this.$t('blInfo.requiredShipperAddress'), trigger: 'blur' }],
        // containerNo: [{ required: true, message: this.$t('blInfo.requiredDescribe'), trigger: 'blur' }, { validator: this.validateContainerNo, trigger: 'blur' }],
        sealNo: [{ required: true, message: this.$t('blInfo.placeholdSealNo'), trigger: 'blur' }]
      },
      addContainerVal: '', // 增加集装箱
      allTableDataList: [],
      allTableDataListArray: [], // 记录集装箱初始数值
      tableList: [{
        test: 'aa',
        hsCode: 'test'
      }],
      editable: [],
      editScope: {}, // 编辑暂存数据,
      materielListKey: ['hsCode', 'quantity', 'packageType', 'weight', 'volume', 'cargoDesc'],
      orderContainerDetail: {}, // 箱子id 对应的箱型、装货港等信息
      packageTypeOption: [],
      containerType: {}, // 箱量 所有箱型
      returnBLData: {},
      isShowError: false, // 显示表格input报错
      showEditSO: [{}],
      pageFocus: '', // 页面聚焦
      restaurants: [], // 收发通联动,
      rejectReasonForm: {
        rejectReason: '' // 驳回理由
      },
      addSODisabled: this.$route.query.type === 'examine',
      removeSODisabled: this.$route.query.type === 'mergeFlag' || this.$route.query.type === 'examine',
      dialogChangeMBL: false,
      changeMBLForm: {},
      customerBlForm: {},
      customerBlFormValidate: false
    }
  },
  async created() {
    const paramsContainerIds = {
      containerIdList: this.$route.query.containerIds || this.$route.query.containersIds // 2021062505
    }
    this.fullscreenLoading = true
    if (this.$route.query.type === 'create') { // 创建
      // 提单补料时通过箱子id，生成提单号
      buildBillNo(paramsContainerIds).then(res => {
        if (res.ok) {
          this.bookingForm.blNo = res.content.blNo
          this.bookingForm.shipperAddress = res.content.shipperAddress
          this.bookingForm.consigneeAddress = res.content.consigneeAddress
          this.bookingForm.notifyAddress = res.content.notifyAddress
        }
      })

    }
    if (this.$route.query.type === 'edit' || this.$route.query.type === 'examine') { // 编辑\审核
      getBillDetail(this.$route.query.blid).then(res => {
        this.getPartnerAdvancedApi(res.content.dischargeAgentId)
        if (res.ok) {
          this.getLastScnFun(res.content.memberId) // 获取收发通list
          this.allTableDataList = res.content.containerList
          this.bookingForm = res.content
          this.rejectReasonForm.rejectReason = res.content.rejectReason
          this.allTableDataList.forEach(item => {
            this.editable.push([])
            this.showEditSO.push([{sealNo: false}])
          })
          this.allTableDataListArray = this.allTableDataList.map(item => item.containerId)
        }
        this.fullscreenLoading = false
      })
    }
    if (this.$route.query.type === 'mergeFlag' && this.$route.query.blid.toString() !== 'false') { // 拆合
      billDetailByBlNo(this.$route.query.blNo).then(res => {
        if (res.ok && res.content) {
          this.getLastScnFun(res.content.memberId) // 获取收发通list
          this.allTableDataList.map(item => {
            res.content.forEach((val, index) => {
              if (val.id === item.containerId) {
                res.content.splice(index, 1)
              }
            })
          })
          this.allTableDataList = [...this.allTableDataList, ...res.content.containerList]
          this.bookingForm = res.content
          this.allTableDataList.forEach(item => {
            this.editable.push([])
            this.showEditSO.push([{sealNo: false}])
          })
          this.allTableDataListArray = this.allTableDataList.map(item => item.containerId)
        }
        if (paramsContainerIds.containerIdList) {
          this.addContainerIds(paramsContainerIds)
        }
        this.fullscreenLoading = false
      })
    } else { // 创建
      if (paramsContainerIds.containerIdList) {
        this.addContainerIds(paramsContainerIds)
        const resSailing = await getContainerSailingDetailByIdsApi({containerIdList: paramsContainerIds.containerIdList})
        this.fullscreenLoading = false
        if (resSailing.ok) {
          this.bookingForm.receipt = resSailing.content.receipt
          this.bookingForm.vesselVoyageFormat = resSailing.content.vesselVoyageFormat
          this.bookingForm.pol = resSailing.content.pol
          if (resSailing.content.polCode === 'CNTAC') {
            this.bookingForm.issuePlace = 'SHANGHAI'
          } else if (resSailing.content.polCode === 'CNNSA') {
            this.bookingForm.issuePlace = 'SHENZHEN'
          } else {
            this.bookingForm.issuePlace = resSailing.content.polName
          }
          this.bookingForm.pod = resSailing.content.pod
          this.bookingForm.destination = resSailing.content.destination
          this.bookingForm.demurrage = resSailing.content.demurrage
        }
      }
    }
    // 提单补料时通过箱子id，查询箱子详情
    if (paramsContainerIds.containerIdList && this.$route.query.type === 'edit') {
      getContainerDetailByIdsApi(paramsContainerIds).then(res => {
        if (res.ok) {
          res.content.map(item => {
            if (!item.cargoDTOList || item.cargoDTOList.length === 0) {
              item.cargoDTOList = [{}]
            }
          })
          // this.allTableDataList = res.content
          // this.allTableDataList.push.apply(this.allTableDataList, [...res.content])
          this.allTableDataList = [...this.allTableDataList, ...res.content]
          this.orderContainerDetail = res.content[0]

          this.allTableDataList.forEach(item => {
            this.editable.push([])
            this.showEditSO.push([{sealNo: false}])
          })
          this.allTableDataListArray = this.allTableDataList.map(item => item.containerId)
          // 计算箱量
          this.calculateBoxVolume()
          //  this.editable[0][0] = true
          //  this.editScope.isEdit = true
          // 新建时判断箱子信息是否一致
          // let b = a.reduce((acc, cur) => {
          //   !acc.some(v => v.name === cur.name && v.age === cur.age) && acc.push(cur);
          //   return acc;
          // }, []);
          //
          // console.log(b);
        }
        this.fullscreenLoading = false
      })
    }
    // 获取基础数据
    dropdownlist({termCode: 'PACKTYPE'}).then(res => {
      this.fullscreenLoading = false
      if (res.ok) {
        this.packageTypeOption = res.content
      }
    })

  },
  mounted() {
    // this.allTableDataList.forEach(item => {
    //   this.editable.push([])
    // })
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    })
  },
  watch: {
    'bookingForm': {
      handler(newVal, oldVal) {
        this.bookingForm.shipperAddress = newVal.shipperAddress.toUpperCase()
        this.bookingForm.consigneeAddress = newVal.consigneeAddress.toUpperCase()
        this.bookingForm.notifyAddress = newVal.notifyAddress.toUpperCase()
        this.bookingForm.marks = newVal.marks.toUpperCase()
        this.bookingForm.blDesc = newVal.blDesc.toUpperCase()
      },
      deep: true
    },
    'allTableDataList': {
      handler(newVal, oldVal) {
        let packageTypeArr = []
        let sumQuantity = 0
        let sumGrossWeight = 0
        let sumVolume = 0
        this.allTableDataList.map(item => {
          if (!item.cargoDTOList) {return}
          item.cargoDTOList.map(val => {
            if (val.packageType) {
              packageTypeArr.push(val.packageType)
            }
            sumQuantity += isNaN(Number(val.quantity)) ? 0 : Number(val.quantity)
            sumGrossWeight += isNaN(Number(val.weight)) ? 0 : Number(val.weight)
            sumVolume += isNaN(Number(val.volume)) ? 0 : Number(val.volume)
          })
        })
        this.calculateBoxVolume()
        packageTypeArr = [...new Set(packageTypeArr)]
        if (packageTypeArr.length === 1) {
          this.$set(this.bookingForm, 'packageType', packageTypeArr[0])
        } else {
          this.$set(this.bookingForm, 'packageType', 'PACKAGES')
        }
        this.$set(this.bookingForm, 'sumQuantity', sumQuantity)
        this.$set(this.bookingForm, 'sumGrossWeight', sumGrossWeight.toFixed(3))
        this.$set(this.bookingForm, 'sumVolume', sumVolume.toFixed(3))
      },
      deep: true
    }
  },
  methods: {
    validateEmail(rule, value, callback) {
      if (!validEmail(value)) {
        callback(new Error(this.$t('blInfo.emailError')))
      } else {
        callback()
      }
    },
    validateContainerNo(item) { // 验证箱号
      const activeRules = {
        validator: (rule, value, callback) => {
          if (item === '53HC' ? !validContainerNo53HC(value) : !validContainerNo(value)) {
            callback(new Error(this.$t('blInfo.containerNoError')))
          } else {
            callback()
          }
        }
      }
      return activeRules
    },
    getLastScnFun(memberId) {
      const params = {
        memberId: memberId
      }
      getLastScn(params).then(res => {
        if (res.ok) {
          this.restaurants = res.content
        }
      })
    },
    querySearch(queryString, cb, index) {
      const restaurants = this.restaurants
      restaurants.forEach(item => {
        item.value = item[index]
      })
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    },
    selectShipper(val, type) { // 发货人
      this.bookingForm.shipperAddress = val.shipperAddress
      this.bookingForm.consigneeAddress = val.consigneeAddress
      this.bookingForm.notifyAddress = val.notifyAddress
    },
    copyConsignee() { // 同收货人信息按钮
      this.bookingForm.notifyAddress = this.bookingForm.consigneeAddress
    },

    rejectShow() {
      this.dialogFormVisible = true
    },
    goList() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/CharteredBoat/BlList')
    },
    rejectFun() { // 驳回
      this.$refs.rejectReasonForm.validate(valid => {
        if (valid) {
          const data = {
            blId: this.query.blid,
            rejectReason: this.rejectReasonForm.rejectReason
          }
          reject(data).then(res => {
            this.fullscreenLoading = false
            this.dialogFormVisible = false
            if (res.ok) {
              this.$message.success(this.$t('blInfo.successRejected'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push('/CharteredBoat/BlList')
            }
          })
        } else {
          return false
        }
      })
    },
    back() {
      this.$router.go(-1) // 返回上一层
    },
    async nextStep() { // 下一步
      if (this.pageShow === 1) {

        // 判断箱号 封号
        let isFormContainerNoAndSealNo
        for (const ref of this.$refs.formContainerNoAndSealNo) {
          ref.validate(valid => {
            if (!valid) {
              isFormContainerNoAndSealNo = true
              this.showEditSO.forEach(item => {
                item.socFlag = true
                item.sealNo = true
              })
              setTimeout(() => {
                const isError = document.getElementsByClassName('is-error')
                isError[0].scrollIntoView({block: 'center', behavior: 'smooth'})
              }, 100)
            }
          })
          if (isFormContainerNoAndSealNo) {
            break
          }
        }
        if (isFormContainerNoAndSealNo) {
          return false
        }
        this.isShowError = false
        for (const [indexAll, item] of this.allTableDataList.entries()) {
          for (const [indexList, listVal] of item.cargoDTOList.entries()) {
            for (const key of this.materielListKey) {
              if (!listVal[key]) {
                this.isShowError = true
                if (!this.editScope.isEdit) {
                  this.$set(this.editable[indexAll], indexList, true)
                  this.editScope = listVal
                }
                this.$message.error(this.$t('blInfo.pleaseAll'))
                const isError = document.getElementsByClassName('blinfo-error')
                if (isError.length) {
                  setTimeout(() => {
                    isError[0].scrollIntoView({block: 'center', behavior: 'smooth'})
                  }, 100)
                }
                break
              }
            }
            if (this.isShowError) {
              break
            }
          }
          if (this.isShowError) {
            break
          }
        }
        if (this.isShowError) {
          return false
        }
        this.$set(this.bookingForm, 'count', this.allTableDataList.length)
        let bookingNo = this.allTableDataList.map(item => item.soNo)
        this.$set(this.bookingForm, 'bookingNos', lodash.uniq(bookingNo))
        this.pageShow++


      } else if (this.pageShow === 2) { // 提交
        await this.$refs.BlInfoPage2.retCustomerBlForm()


      }
    },
    submitNextStepCconfirm() {
      if (this.query.type === 'edit' && (this.bookingForm.status === 5 || this.bookingForm.status === 7)) {
        let ret = this.allTableDataList.some(item => !this.allTableDataListArray.includes(item.containerId))
        if (!ret) {
          this.submitNextStep()
        } else {
          this.$confirm(this.$t('blInfo.unPaymentYet'), this.$t('common.tips'), {
            confirmButtonText: this.$t('common.confirmBtn'),
            cancelButtonText: this.$t('common.cancelBtn'),
            type: 'warning'
          }).then(() => {
            this.submitNextStep()
          })
        }
      } else {
        this.submitNextStep()
      }
    },
    async submitNextStep() {
      this.fullscreenLoading = true
      this.allTableDataList.forEach(item => {
        if (!item.containerId) {
          item.containerId = item.id
        }
      })
      this.bookingForm.containerList = this.allTableDataList
      this.bookingForm.memberId = this.allTableDataList[0].memberId
      // 收 发 通 去除前后空格
      let bookingForm = this.$extends({}, this.bookingForm)
      bookingForm.shipperAddress = bookingForm.shipperAddress.trim()
      bookingForm.consigneeAddress = bookingForm.consigneeAddress.trim()
      bookingForm.notifyAddress = bookingForm.notifyAddress.trim()
      bookingForm = lodash.merge(bookingForm, this.customerBlForm)
      console.log('bookingForm,', bookingForm, this.customerBlForm)
      if (this.query.type === 'examine') { // 审核
        review(bookingForm).then(res => {
          this.fullscreenLoading = false
          if (res.ok) {
            this.$message.success(this.$t('blInfo.successExamine'))
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push('/CharteredBoat/BlList')
          }
        })
      } else if (this.query.type === 'create') { // 创建
        billOfLoading(bookingForm).then(res => {
          this.fullscreenLoading = false
          if (res.ok) {
            this.$message.success(this.$t('blInfo.submitSuc'))
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push('/CharteredBoat/BlList')
          }
        })
      } else if (this.query.type === 'mergeFlag') { // 拆合
        blMerge(bookingForm).then(res => {
          this.fullscreenLoading = false
          if (res.ok) {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$message.success(this.$t('blInfo.submitBlMergeSuc'))
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push('/CharteredBoat/BlList')
          }
        })
      } else { // 编辑
        submitSaveEdit(bookingForm).then(res => {
          this.fullscreenLoading = false
          if (res.ok) {
            this.$message.success(this.$t('blInfo.submitSuc'))
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push('/CharteredBoat/BlList')
          }
        })
      }
    },
    async retCustomerBlForm(val, val2) {
      this.customerBlForm = val
      this.customerBlFormValidate = val2
      if (this.customerBlFormValidate) {
        if (this.query.type === 'examine') { // 审核
          const res = await checkMblNoApi(this.bookingForm.blId, {mblNo: this.bookingForm.mblNo})
          if (!res.ok) {
            this.dialogChangeMBL = true
            return
          }
        }
        this.submitNextStepCconfirm()
      } else {
        setTimeout(() => {
          const isError = document.getElementsByClassName('is-error')
          isError[0].scrollIntoView({block: 'center', behavior: 'smooth'})
        }, 100)
        return false
      }
    },
    calculateBoxVolume() {
      // 计算箱量
      const containerType = {}
      this.allTableDataList.forEach(item => {
        containerType[item.containerType] ? containerType[item.containerType]++ : containerType[item.containerType] = 1
      })
      const containerTypeArr = []
      for (const key in containerType) {
        containerTypeArr.push(`${containerType[key]}*${key}`)
      }
      this.$set(this.bookingForm, 'containerSizeTypeQty', containerTypeArr.join(';'))
      this.$set(this.bookingForm, 'containerSizeTypeQtyArr', containerType)
    },
    goPageFocus() { // 定位锚点
      for (const key in this.$refs) {
        if (key.indexOf(this.pageFocus) > -1) {
          this.$refs[key][0].scrollIntoView()
        }
      }
    },
    showEditSocFlagFun(index, ref) {
      this.$set(this.showEditSO[index], 'socFlag', true)
      this.$nextTick(() => {
        this.$refs[ref][index].focus()
      })
    },
    socFlagBlur(index, val) {
      if (!val) {
        return
      }
      this.$set(this.showEditSO[index], 'socFlag', false)
    },
    showEditSOFun(index, ref) {
      this.$set(this.showEditSO[index], 'sealNo', true)
      this.$nextTick(() => {
        this.$refs[ref][index].focus()
      })
    },
    sealNoBlur(index, val) {
      if (!val) {
        return
      }
      this.$set(this.showEditSO[index], 'sealNo', false)
    },
    getContainerNo(containerNo, index) {
      if (this.$route.query.type === 'create') {
        this.$refs.formContainerNoAndSealNo[index].validateField(['containerNo'], valid => {
          if (!valid) {
            this.addSO('cargo', containerNo, index)
          }
        })
      }
    },
    async addSO(type, containerNo, index) { // 增加一条SO
      if (!this.addContainerVal && type !== 'cargo') {
        this.$message.error(this.$t('blInfo.placeholderSO'))
        return
      }
      const params = {
        memberId: this.allTableDataList[0].memberId,
        podCode: this.allTableDataList[0].podCode,
        polCode: this.allTableDataList[0].polCode,
        queryKey: type === 'cargo' ? containerNo : this.addContainerVal,
        vessel: this.allTableDataList[0].vessel,
        voyage: this.allTableDataList[0].voyage
      }

      this.fullscreenLoading = true
      if (type === 'cargo') {
        const res = await getContainerDetailByContainerNoApi(params)
        this.fullscreenLoading = false
        if (res.ok) {
          let empty = 0
          this.allTableDataList[index].cargoDTOList.some((val, index) => {
            let arr = Object.values(val).filter(function (item) {
              return item
            })
            if (arr.length === 0) {
              empty++
            } else {
              return true
            }
          })
          this.allTableDataList[index].cargoDTOList.splice(0, empty)
          if (!res.content || res.content.cargoDTOList.length === 0) {
            this.allTableDataList[index].cargoDTOList.push({})
          } else {
            this.allTableDataList[index].cargoDTOList.push(...res.content.cargoDTOList)
            this.$set(this.allTableDataList[index], 'sealNo', res.content.sealNo)
          }
        }
      } else {
        findContainerForBillOfLoading(params).then(res => {
          this.fullscreenLoading = false
          if (res.ok) {
            if (res.content.length === 0) {
              this.$message.error(this.$t('blInfo.noBox'))
              return
            }
            if (this.query.type === 'mergeFlag') {
              // 判断箱子状态 是否全是已审核
              let blStatus
              const arr1 = res.content.filter(val => {
                if (val.blStatus === 3) {
                  blStatus = true
                }
                return val.blStatus === 3
              })
              res.content = arr1
              if (!blStatus) {
                this.$message.error(this.$t('blInfo.incorrectStatusAudited'))
                return
              }

            } else {
              // 判断箱子状态 是否全是待补料
              let blStatus
              const arr1 = res.content.filter(val => {
                if (val.blStatus === 1) {
                  blStatus = true
                }
                return val.blStatus === 1
              })
              res.content = arr1
              if (!blStatus) {
                this.$message.error(this.$t('blInfo.incorrectStatus'))
                return
              }
            }
            // 去重 去掉已经添加的箱子
            this.allTableDataList.map(item => {
              const arr1 = res.content.filter(val => val.containerId !== item.containerId)
              res.content = arr1
            })
            if (res.content.length === 0) {
              this.$message.error(this.$t('blInfo.addRepeatedly'))
              return
            }
            res.content.forEach((item, index) => {
              this.editable[this.allTableDataList.length + index] = []
              if (!item.cargoDTOList || item.cargoDTOList.length === 0) {
                if (!item.cargoDTOList || item.cargoDTOList.length === 0) {
                  item.cargoDTOList = []
                  item.cargoDTOList.push({})
                }
              }
            })
            this.allTableDataList = this.allTableDataList.concat(res.content)
          }
        })
      }

    },
    calculateTotal() {
      let packageTypeArr = []
      let sumQuantity = 0
      let sumGrossWeight = 0
      let sumVolume = 0
      this.allTableDataList.map(item => {
        if (!item.cargoDTOList) {
          return
        }
        item.cargoDTOList.map(val => {
          if (val.packageType) {
            packageTypeArr.push(val.packageType)
          }
          sumQuantity += isNaN(Number(val.quantity)) ? 0 : Number(val.quantity)
          sumGrossWeight += isNaN(Number(val.weight)) ? 0 : Number(val.weight)
          sumVolume += isNaN(Number(val.volume)) ? 0 : Number(val.volume)
        })
      })
      this.calculateBoxVolume()
      packageTypeArr = [...new Set(packageTypeArr)]
      if (packageTypeArr.length === 1) {
        this.$set(this.bookingForm, 'packageType', packageTypeArr[0])
      } else {
        this.$set(this.bookingForm, 'packageType', 'PACKAGES')
      }
      this.$set(this.bookingForm, 'sumQuantity', sumQuantity)
      this.$set(this.bookingForm, 'sumGrossWeight', sumGrossWeight.toFixed(3))
      this.$set(this.bookingForm, 'sumVolume', sumVolume.toFixed(3))
    },
    removeSO(index) {
      if (this.allTableDataList.length > 1) {
        this.allTableDataList.splice(index, 1)
        // 计算箱量
        this.calculateTotal()
      } else {
        this.$message.error(this.$t('blInfo.leftOneData'))
      }
    },
    changeEdit(scope, index, rowIndex) { // 编辑表单
      const arr = new Array(this.allTableDataList[index].length)
      arr[rowIndex] = true
      this.editable.forEach((item, i) => {
        this.$set(this.editable, i, [])
      })
      this.$set(this.editable, index, arr)
      this.editScope = JSON.parse(JSON.stringify(scope))
      this.editScope.isEdit = true
      if (rowIndex > 0) {
        this.$set(this.editScope, 'packageType', this.allTableDataList[index].cargoDTOList[rowIndex - 1].packageType)
      }
    },
    closeEdit(index, rowIndex) {
      this.$set(this.editable[index], rowIndex, false)
      this.editScope = {
        isEdit: false
      }
      this.isShowError = false
    },
    saveEdit(scope, index, rowIndex) {
      let isTrue
      for (const key of this.materielListKey) {
        if (!this.editScope[key]) {
          this.$message.error(this.$t('blInfo.pleaseAll'))
          this.isShowError = true
          isTrue = true
          break
        }
        if (key === 'hsCode' && this.editScope[key].length < 6) {
          this.$message.error(this.$t('blInfo.pleaseAllHSCODE'))
          this.isShowError = true
          isTrue = true
          break
        }
      }
      if (isTrue) {
        return
      }
      this.editScope.volume = Number(this.editScope.volume).toFixed(3)
      this.editScope.weight = Number(this.editScope.weight).toFixed(3)
      this.$set(this.allTableDataList[index].cargoDTOList, rowIndex, this.editScope)
      const arr = new Array(this.allTableDataList[index].length)
      this.$set(this.editable, index, arr)
      this.editScope = {}
      this.isShowError = false
      // 计算箱量
      this.calculateTotal()
    },
    addRow(index) {
      this.allTableDataList[index].cargoDTOList.push({})
      const len = this.allTableDataList[index].cargoDTOList.length - 1
      this.editable[index][len] = false
      // 添加行时 如果无正再编辑 默认最后一行编辑
      if (!this.editScope.isEdit) {
        this.$set(this.editable, index, [])
        const arr = new Array(this.allTableDataList[index].cargoDTOList.length)
        arr[arr.length - 1] = true
        this.$set(this.editable, index, arr)
        this.editScope.isEdit = true
        if (len > 0) {
          this.$set(this.editScope, 'packageType', this.allTableDataList[index].cargoDTOList[len - 1].packageType)
        }
      }
    },
    deleteRow(index, scopeIndex) {
      this.allTableDataList[index].cargoDTOList.splice(scopeIndex, 1)
      this.editable[index].splice(scopeIndex, 1)
      this.editScope = {}
      this.isShowError = false
      this.editScope.isEdit = false
    },
    upper() { // 大写
      if (this.editScope.cargoDesc) {
        this.editScope.cargoDesc = this.editScope.cargoDesc.toUpperCase()
      }
    },
    // 获取代理信息
    getPartnerAdvancedApi(id) {
      if (!id) {return}
      partnerAdvancedApi(id).then(res => {
        this.$set(this.bookingForm, 'agentInfo', res.content.blAddress)
      })
    },
    // 根据箱子id获取箱子信息
    addContainerIds(paramsContainerIds) {
      getContainerDetailByIdsApi(paramsContainerIds).then(res => {
        this.fullscreenLoading = false
        if (res.ok) {
          this.getPartnerAdvancedApi(res.content[0].dischargeAgentId)
          this.allTableDataList.map(item => {
            res.content.forEach((val, index) => {
              if (val.id === item.containerId) {
                res.content.splice(index, 1)
              }
            })
          })
          res.content.forEach((item, index) => {
            this.editable[this.allTableDataList.length + index] = []
            if (!item.cargoDTOList || item.cargoDTOList.length === 0) {
              item.cargoDTOList = []
              item.cargoDTOList.push({})
            }
          })
          this.allTableDataList = this.allTableDataList.concat(res.content)
          // 计算箱量
          this.calculateBoxVolume()
        }
      })
    },
    towNumber(val) {
      return Number(val).toFixed(3)
    },
    async submitChangeMBL() {
      this.$refs.changeMBLForm.validate(async valid => {
        if (valid) {
          this.fullscreenLoading = true
          const res = await updateMblNoApi(this.changeMBLForm, this.bookingForm.blId)
          this.fullscreenLoading = false
          if (res.ok) {
            this.cancelChangeMBL()
            this.submitNextStepCconfirm()
          }
        }
      })
    },
    cancelChangeMBL() {
      this.dialogChangeMBL = false
      this.$refs.changeMBLForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.flex{ display: flex;}
.sys-right-inner-wrap{ background: #fff; padding: 5px 20px 20px 20px; overflow: auto; height: 100%;}
.title{font-size: 16px; font-weight: 650; color: rgba(0, 0, 0, 0.8);}
.booking-num-text{font-size: 14px; color: rgba(0, 0, 0, 0.8); margin-right: 50px;}
.booking-num{ display: flex; line-height: 36px; color: #888; font-size: 14px; margin-bottom: 30px;
  .flex{ margin-left: 75px; }
  .other-input{ margin-left: 20px;}
}
.type-group-box{
  & div:first-child{
    margin-right: 42px;
  }
}
.blinfo-logistics-info{ display: flex; width: 70%; justify-content: space-between; flex-wrap: wrap}
.copy-consignee{position: absolute; top: -32px; left: 74px;}
.footer{line-height: 36px;  width: 95%; text-align: right; margin-top: 10px;}
.reason{ font-size: 14px; float: left; display: flex;
  .tit{ width: 95px; }
}
.feed-head{ display: flex;}
.total{ display: flex; flex-wrap: wrap; font-size: 14px; width: 400px; margin-left: 50px;
  p{ width: 200px; margin: 0;
    span{ color:rgba(255, 0, 0, 0.8) }
  }
}
.box-information{ display: flex; justify-content: space-between; width: 75%; font-size: 14px;
  .features-btn{ margin-top: 46px;}
  .mt-24 {
    margin-top: 24px;
  }

}
.data-so-case{
  margin-bottom: 40px;
}
.case-data-table{ width: 90%; height: 75%; margin-top: 1px;
  .operating{
    i{margin: 0 8px; font-size: 16px; cursor: pointer;
      &:hover{ transition: all 0.3s ease 0s; transform: scale(1.1)}
      &.operating-close{ color: red; font-weight: bold}
      &.operating-save{ color: rgb(91,221,91); font-weight: bold}
    }
  }
}
.red{ color: red}
.sealNo{
  i{ font-size: 14px; cursor: pointer; margin-left: 5px;
    &:hover{ transform: scale(1.1); transition: all 0.2s ease 0s;}
  }
}
.my-autocomplete {
  .secondary {
    font-size: 12px;
    color: #b4b4b4;
    line-height: 16px;
  }

  .highlighted .secondary {
    color: #ddd;
  }
}
.ellipsis{white-space: nowrap; text-overflow:ellipsis; overflow:hidden;}
.marL20{ margin-left: 15px;}
.reasons-rejection ::v-deep {
  .el-form-item__label{
    font-size: 14px !important; color: #666666;
  }
}
.public-box{
  background: #f5f7fa; border: #dcdfe6 solid 1px; width: 100%; padding: 20px; margin-top: 5px; height: calc(100% - 79px); overflow: auto;
  .page1,.page2{ background: #fff; padding: 23px; position: relative;}
}
.blinfo-type-group2 ::v-deep{
  .el-form-item__label{ margin-right: 20px;}
}
.approval-status{font-size: 100px; position: absolute; left: 800px;}
::v-deep .el-form-item__error {
  padding-top: 4px;
}


</style>

<style lang="scss" >
.blinfo-error input{ border-color: red!important}
.blinfo-type-group,.blinfo-logistics-info{
  .el-form-item{ width: 30%}
  .el-form-item__label{ float: none}
  .el-form-item__content{ margin-left: 0!important;}
  .el-autocomplete{ width: 100%}
}
.blinfo-logistics-info{
  .el-form-item{ width: 45%}
}


</style>
