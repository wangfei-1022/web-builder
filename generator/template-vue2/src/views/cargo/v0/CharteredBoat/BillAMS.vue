<template>
  <div v-loading="loading" class="sys-right-inner-wrap">
    <el-form ref="whetherCommissionForm" :inline="true" :model="forwarderBillForm" :rules="forwarderBillFormRule" @submit.native.prevent>
      <el-form-item :label="$t('billAMS.whetherCommission')" prop="yhtProxyFlag" class="change-label-calss">
        <el-radio-group v-model="forwarderBillForm.yhtProxyFlag" :disabled="inviteLoading" @change="yhtProxyFlagChange">
          <el-radio :label="true">{{ $t('common.trueText') }}</el-radio>
          <el-radio :label="false">{{ $t('common.falseText') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="forwarderBillForm.yhtProxyFlag === false" :label="$t('billAMS.issueBlFlag')" prop="issueBlFlag" class="change-label-calss">
        <el-radio-group v-model="forwarderBillForm.issueBlFlag">
          <el-radio :label="true">{{ $t('common.trueText') }}</el-radio>
          <el-radio :label="false">{{ $t('common.falseText') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="forwarderBillForm.issueBlFlag && forwarderBillForm.yhtProxyFlag === false">
        <el-form-item :label="$t('billAMS.NVOCC')" prop="hblNo" class="change-label-calss">
          <el-input v-model="hblNo" maxlength="12" :placeholder="$t('billAMS.forwarderBillPlaceholder')" :disabled="inviteLoading" />
        </el-form-item>
        <el-form-item :label="$t('billAMS.SCACCode')" prop="scacCode" class="change-label-calss">
          <el-input v-model="scacCode" :placeholder="$t('billAMS.SCACCodePlaceholder')" :disabled="inviteLoading" />
        </el-form-item>
      </div>
    </el-form>
    <el-form v-if="forwarderBillForm.yhtProxyFlag" ref="isCommissionForm" :inline="true" :model="forwarderBillForm" :rules="forwarderBillFormRule" label-width="80px" @submit.native.prevent>
      <div>
        <el-form-item :label="$t('billAMS.attributionBillNo')" prop="hblOwn" class="change-label-calss">
          <el-radio-group v-model="forwarderBillForm.hblOwn" :disabled="inviteLoading" @change="hblOwnChange">
            <el-radio label="0" @keyup.space.native="hblOwnChange(0)">{{ $t('billAMS.YHT') }}</el-radio>
            <el-radio label="1" @keyup.space.native="hblOwnChange(1)">{{ $t('billAMS.own') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item :label="$t('billAMS.NVOCC')" prop="hblNo" class="change-label-calss">
        <el-input v-model="hblNo" maxlength="12" :disabled="inviteLoading" :placeholder="$t('billAMS.forwarderBillPlaceholder')" />
      </el-form-item>
      <div class="billForm">
        <!--            发货人  -->
        <ul style="width: 50%">
          <li class="title"><span>*</span>{{ $t('billAMS.actualShipper') }}</li>
          <li>
            <el-form-item :label="$t('billAMS.name')" prop="shipper.contact">
              <el-input v-model="forwarderBillForm.shipper.contact" :disabled="inviteLoading" maxlength="35" :placeholder="$t('billAMS.companyNamePlaceholder')" @blur="contact($event,'shipper','contact')" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.address')" prop="shipper.street">
              <el-input v-model="forwarderBillForm.shipper.street" :disabled="inviteLoading" min maxlength="105" :placeholder="$t('billAMS.addressPlaceholder')" @blur="contact($event,'shipper','street')" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.phone')" prop="shipper.contactPhone">
              <div class="phoneCon">
                <el-input v-model="forwarderBillForm.shipper.contactPhone[0]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.countryPlaceholder')" class="phone" style="width: 27%" />
                <el-input v-model="forwarderBillForm.shipper.contactPhone[1]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.areaCodePlaceholder')" class="phone" style="width: 26%" />
                <el-input v-model="forwarderBillForm.shipper.contactPhone[2]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.localPlaceholder')" class="phone" style="width: 40%" />
              </div>
            </el-form-item>
          </li>
        </ul>
        <!--            实际收货人-->
        <ul style="width: 50%">
          <li class="title"><span>*</span>{{ $t('billAMS.actualConsignee') }}</li>
          <li>
            <el-form-item :label="$t('billAMS.name')" prop="consignee.contact">
              <el-input v-model="forwarderBillForm.consignee.contact" :disabled="inviteLoading" maxlength="35" :placeholder="$t('billAMS.companyNamePlaceholder')" @blur="contact($event,'consignee','contact')" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.address')" prop="consignee.street">
              <el-input v-model="forwarderBillForm.consignee.street" :disabled="inviteLoading" minlength="35" maxlength="105" :placeholder="$t('billAMS.addressPlaceholder')" @blur="contact($event,'consignee','street')" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.phone')" prop="consignee.contactPhone">
              <div class="phoneCon">
                <el-input v-model="forwarderBillForm.consignee.contactPhone[0]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.countryPlaceholder')" class="phone" style="width: 27%" />
                <el-input v-model="forwarderBillForm.consignee.contactPhone[1]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.areaCodePlaceholder')" class="phone" style="width: 26%" />
                <el-input v-model="forwarderBillForm.consignee.contactPhone[2]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.localPlaceholder')" class="phone" style="width: 40%" />
              </div>
            </el-form-item>
          </li>
        </ul>
        <!--            实际第一通知方-->
        <ul style="width: 50%">
          <li class="title"><span>*</span>{{ $t('billAMS.actualFirstNotifyParty') }}</li>
          <li>
            <el-form-item :label="$t('billAMS.name')" prop="notify.contact">
              <el-input v-model="forwarderBillForm.notify.contact" :disabled="inviteLoading" maxlength="35" :placeholder="$t('billAMS.companyNamePlaceholder')" @blur="contact($event,'notify','contact')" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.address')" prop="notify.street">
              <el-input v-model="forwarderBillForm.notify.street" :disabled="inviteLoading" minlength="35" maxlength="105" :placeholder="$t('billAMS.addressPlaceholder')" @blur="contact($event,'notify','street')" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.phone')" prop="notify.contactPhone">
              <div class="phoneCon">
                <el-input v-model="forwarderBillForm.notify.contactPhone[0]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.countryPlaceholder')" class="phone" style="width: 27%" />
                <el-input v-model="forwarderBillForm.notify.contactPhone[1]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.areaCodePlaceholder')" class="phone" style="width: 26%" />
                <el-input v-model="forwarderBillForm.notify.contactPhone[2]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.localPlaceholder')" class="phone" style="width: 40%" />
              </div>
            </el-form-item>
          </li>
        </ul>
        <!--            实际第二通知方-->
        <ul style="width: 50%">
          <li class="title">{{ $t('billAMS.actualSecondInformant') }}</li>
          <li>
            <el-form-item :label="$t('billAMS.name')">
              <el-input v-model="forwarderBillForm.secNotify.contact" :disabled="inviteLoading" :placeholder="$t('billAMS.companyNamePlaceholder')" onblur="value=value.toUpperCase()" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.address')">
              <el-input v-model="forwarderBillForm.secNotify.street" :disabled="inviteLoading" :placeholder="$t('billAMS.addressPlaceholder')" onblur="value=value.toUpperCase()" />
            </el-form-item>
            <el-form-item :label="$t('billAMS.phone')" prop="secNotify.contactPhone">
              <div class="phoneCon">
                <el-input v-model="forwarderBillForm.secNotify.contactPhone[0]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.countryPlaceholder')" class="phone" style="width: 27%" />
                <el-input v-model="forwarderBillForm.secNotify.contactPhone[1]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.areaCodePlaceholder')" class="phone" style="width: 26%" />
                <el-input v-model="forwarderBillForm.secNotify.contactPhone[2]" :disabled="inviteLoading" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('billAMS.localPlaceholder')" class="phone" style="width: 40%" />
              </div>
            </el-form-item>
          </li>
        </ul>
      </div>
      <!--        空箱申报  -->
      <section v-show="forwarderBillForm.containerDTOList.length === 0 || forwarderBillForm.isEmptyDeclare" style="padding-left: 40px">
        <el-form-item :label="$t('billAMS.isEmptyDeclare')">
          <el-checkbox v-model="forwarderBillForm.isEmptyDeclare" :disabled="inviteLoading" />
        </el-form-item>
        <template v-if="forwarderBillForm.isEmptyDeclare">
          <div>
            <el-form-item :label="$t('billAMS.boxQuantity')">
              <span>{{ containerQty }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :prop="'containerDTOListEmpty.hsCode'"
              label="HS CODE"
              label-width="100px"
              :rules="[{ required: true, message: $t('charteredBoat.hsCodeEmptyInvalid'), trigger: 'blur' },{ min: 6, message: $t('billAMS.HSCodeless6'), trigger: 'blur' }]"
            >
              <el-input
                v-trim v-model="forwarderBillForm.containerDTOListEmpty.hsCode"
                :disabled="inviteLoading"
                size="mini"
                maxlength="255"
                minlength="6"
                placeholder="HS CODE"
                oninput="value=value.replace(/[^\d.]/g,'')"
              />
            </el-form-item>
            <el-form-item
              :prop="'containerDTOListEmpty.weight'"
              :label="$t('billAMS.aBoxWeight')"
              label-width="100px"
              :rules="[{ required: true, message: $t('billAMS.grossWeightEmptyInvalid'), trigger: 'blur' },]"
            >
              <el-input
                v-trim v-model="forwarderBillForm.containerDTOListEmpty.weight"
                v-input-limit="[5,3]"
                :disabled="inviteLoading"
                size="mini"
                :placeholder="$t('charteredBoat.grossWeight')"
              />
            </el-form-item>
            <el-form-item
              :prop="'containerDTOListEmpty.volume'"
              :label="$t('billAMS.aBoxVolume')"
              label-width="100px"
              :rules="[{ required: true, message: $t('billAMS.volumeEmptyInvalid'), trigger: 'blur' },]"
            >
              <el-input
                v-trim v-model="forwarderBillForm.containerDTOListEmpty.volume"
                v-input-limit="[3,3]"
                :disabled="inviteLoading"
                size="mini"
                :placeholder="$t('charteredBoat.volume')"
              />
            </el-form-item>
          </div>

          <el-form-item
            :prop="'containerDTOListEmpty.marks'"
            :label="$t('billAMS.mark')"
            label-width="100px"
            :rules="[{ required: true, message: $t('billAMS.markEmptyInvalid'), trigger: 'blur' },]"
          >
            <el-input
              v-trim v-model="forwarderBillForm.containerDTOListEmpty.marks"
              :disabled="inviteLoading"
              size="mini"
              maxlength="255"
              minlength="4"
              :placeholder="$t('billAMS.remarkPlaceholder')"
              @blur="upperEmpty(forwarderBillForm.containerDTOListEmpty.marks,forwarderBillForm.containerDTOListEmpty,'marks')"
            />
          </el-form-item>
          <el-form-item
            :prop="'containerDTOListEmpty.cargoDesc'"
            :label="$t('billAMS.goodsDesc')"
            label-width="100px"
            :rules="[{ required: true, message: $t('billAMS.goodsDescEmptyInvalid'), trigger: 'blur' },]"
          >
            <el-input
              v-trim v-model="forwarderBillForm.containerDTOListEmpty.cargoDesc"
              :disabled="inviteLoading"
              size="mini"
              maxlength="255"
              minlength="4"
              style="width: 467px"
              :placeholder="$t('billAMS.goodsDescPlaceholder')"
              @blur="upperEmpty(forwarderBillForm.containerDTOListEmpty.cargoDesc,forwarderBillForm.containerDTOListEmpty,'cargoDesc')"
            />
          </el-form-item>
        </template>

      </section>
      <div v-if="!forwarderBillForm.isEmptyDeclare" class="containerInformation">
        <div class="title"><span style="color: red">*</span>{{$t('billAMS.containerInfo')}}</div>
        <el-button class="add-container" :disabled="inviteLoading" @click="addContainer">{{$t('billAMS.createContainerInfo')}}</el-button>
        <div class="point">
          {{$t('billAMS.createContainerNotice')}}
        </div>
      </div>
      <div v-if="!forwarderBillForm.isEmptyDeclare" style="margin-top: 50px; padding-left: 40px">
        <div v-for="(item,index) of forwarderBillForm.containerDTOList" :key="index" style="margin-bottom: 50px;">
          <div class="feed-head">
            <div class="case-number"><span class="cred">*</span>{{$t('charteredBoat.containerNo')}} {{ item.containerNo }}</div>
            <el-button size="mini" type="primary" class="features-btn" :disabled="inviteLoading" @click="removeSO(index)">{{$t('billAMS.removeContainer')}}</el-button>
            <div class="total">
              <p>{{$t('billAMS.totalQuantity')}}<span>{{ item.sumQuantity }}</span></p>
              <p>{{$t('billAMS.packageType')}}<span>{{ item.packageType }}</span></p>
              <p>{{$t('billAMS.sumGrossWeight')}}<span>{{ item.sumGrossWeight }}</span> KGS</p>
              <p>{{$t('billAMS.sumVolume')}}<span>{{ item.sumVolume }}</span> CBM</p>
            </div>
            <el-button size="small" type="primary" class="features-btn" :disabled="inviteLoading" @click="addRow(index)">{{$t('billAMS.addRow')}}</el-button>
          </div>
          <el-table class="case-data-table" :data="item.containerCargoDTOList" row-key="id">
            <el-table-column>
              <template slot="header"><span class="red">*</span>{{$t('charteredBoat.hsCode')}}</template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.hsCode'"
                  label=""
                  :rules="[{ required: true, message: $t('billAMS.hsCodeEmptyInvalid'), trigger: 'blur' },{ min: 6, message: $t('billAMS.HSCodeless6'), trigger: 'blur' }]"
                >
                  <el-input
                    v-trim v-model="row.hsCode"
                    size="mini"
                    maxlength="255"
                    minlength="6"
                    placeholder="HS CODE"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <span v-else>{{ row.hsCode }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="red">*</span>{{ $t('billAMS.pieceQutity') }}
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.quantity'"
                  label=""
                  :rules="[{ required: true, message: `${$t('billAMS.pieceEmptyInvalid')}`, trigger: 'blur' },]"
                >
                  <el-input
                    v-if="row.edit"
                    v-trim v-model="row.quantity"
                    size="mini"
                    maxlength="5"
                    :placeholder="$t('billAMS.pieceQutity')"
                    oninput="value=value.replace(/[^\d]/g,'')"
                  />
                </el-form-item>
                <span v-else>{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('billAMS.unit') }}
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.packageType'"
                  label=""
                  :rules="[{ required: true, message: $t('billAMS.unitEmptyInvalid'), trigger: 'change' },]"
                >
                  <el-select
                    v-if="row.edit"
                    v-model="row.packageType"
                    filterable
                    :placeholder="$t('common.placeholder')"
                    size="mini"
                  >
                    <el-option
                      v-for="item in packageTypeOption"
                      :key="item.englishName"
                      :label="item.englishName"
                      :value="item.englishName"
                    />
                  </el-select>
                </el-form-item>
                <span v-else>{{ row.packageType }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('charteredBoat.grossWeight') }}
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.weight'"
                  label=""
                  :rules="[{ required: true, message: $t('billAMS.grossWeightEmptyInvalid'), trigger: 'blur' },]"
                >
                  <el-input
                    v-if="row.edit"
                    v-trim v-model="row.weight"
                    v-input-limit="[5,3]"
                    size="mini"
                    :placeholder="$t('charteredBoat.grossWeight')"
                  />
                </el-form-item>
                <span v-else>{{ row.weight }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('charteredBoat.volume') }}
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.volume'"
                  label=""
                  :rules="[{ required: true, message: $t('billAMS.volumeEmptyInvalid'), trigger: 'blur' },]"
                >
                  <el-input
                    v-if="row.edit"
                    v-trim v-model="row.volume"
                    v-input-limit="[3,3]"
                    size="mini"
                    :placeholder="$t('charteredBoat.volume')"
                  />
                </el-form-item>
                <span v-else>{{ row.volume }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode">
              <template slot="header">
                <span class="red">*</span>{{ $t('billAMS.goodsDesc') }}
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.cargoDesc'"
                  label=""
                  :rules="[{ required: true, message: $t('billAMS.goodsDescEmptyInvalid'), trigger: 'blur' },]"
                >
                  <el-input
                    v-if="row.edit"
                    v-trim v-model="row.cargoDesc"
                    size="mini"
                    maxlength="255"
                    minlength="4"
                    :placeholder="$t('billAMS.goodsDesc')"
                    @blur="upper(row.cargoDesc)"
                  />
                </el-form-item>
                <span v-else class="ellipsis" :title="row.cargoDesc">{{ row.cargoDesc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="marks">
              <template slot="header">
                <span class="red">*</span>{{$t('billAMS.mark')}}
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item
                  v-if="row.edit"
                  :prop="'containerDTOList.'+index+'.containerCargoDTOList.'+$index + '.marks'"
                  label=""
                  :rules="[{ required: true, message: $t('billAMS.markEmptyInvalid'), trigger: 'blur' },]"
                >
                  <el-input
                    v-if="row.edit"
                    v-trim v-model="row.marks"
                    size="mini"
                    maxlength="255"
                    minlength="4"
                    :placeholder="$t('billAMS.remarkPlaceholder')"
                    @blur="upper(row.cargoDesc)"
                  />
                </el-form-item>
                <span v-else class="ellipsis" :title="row.marks">{{ row.marks }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode" :label="$t('common.operation')">
              <template slot-scope="scope">
                <div v-if="!scope.row.edit" class="operating ">
                  <el-button type="text" :disabled="inviteLoading" icon="el-icon-edit" @click="changeEdit(index,scope)" />
                  <el-button type="text" :disabled="inviteLoading" icon="el-icon-delete" @click="deleteRow(index,scope.$index)" />
                </div>
                <div v-else class="operating operating2">
                  <i class="el-icon-close operating-close" @click="closeEdit(index,scope.$index)" />
                  <i class="el-icon-check operating-save" @click="saveEdit(index,scope.$index)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </el-form>
    <div class="footer" style="position: relative; z-index: 9999">
      <router-link to="/CharteredBoat/AMSList"><el-button @click="closeTab()">{{$t('common.backList')}}</el-button></router-link>
    </div>
    <el-dialog :title="$t('billAMS.containerInfo')" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="closeInviteDialog" width="500px" class="dialog-box">
      <div style="height: 300px; overflow: hidden">
        <div><span>{{$t('charteredBoat.blNo')}}</span> {{ blNo }}</div>
        <div class="dialog-title"><span>{{$t('billAMS.bindContainerNo')}}</span></div>
        <el-checkbox-group v-model="dialogCheckList">
          <el-checkbox v-for="(item,index) in containersList" :key="index" :disabled="inviteLoading" :label="item">{{ item.containerNo }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitAudit()">{{$t('billAMS.bindBtn')}}</el-button>
        <el-button size="mini" @click="closeInviteDialog()">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  houseBlDetailApi,
  saveHouseBleApi,
  updateHouseBleApi,
  validContainerRepeatApi
} from '@/api/charteredBoat/AMSList'

export default {
  name: 'BillAMS',
  data() {
    const checkEmail = (rule, value, callback) => {
      if (value) {
        if (!this.$validator.validEmail(value)) {
          return callback(new Error(this.$t('validateError.emailErr')))
        }
      } else {
        return callback(new Error(this.$t('validateError.emailErr')))
      }
      callback()
    }
    const checkPhone = (rule, value, callback) => {
      if (value) {
        if (!this.$validator.validPhoneSeaHousekeeper(value)) {
          return callback(new Error(this.$t('validateError.validPhoneSeaHousekeeperError')))
        }
      }
      callback()
    }
    return {
      loading: true,
      dialogVisible: false,
      dialogCheckList: [],
      isEdit: false,
      onEditOldVal: {},
      bookingForm: {},
      forwarderBillForm: { // 货代信息表单
        yhtProxyFlag: '',
        shipper: {
          contactPhone: []
        }, // 实际发货人
        consignee: {
          contactPhone: []
        }, // 实际收货人
        notify: {
          contactPhone: []
        }, // 实际第一通知方
        secNotify: {
          contactPhone: []
        }, // 实际第二通知方,
        hblOwn: '',
        containerDTOList: [],
        containerDTOListEmpty: [],
        isEmptyDeclare: false
      },
      forwarderBillFormRule: {
        yhtProxyFlag: [{ required: true, message: this.$t('billAMS.whetherCommissionPlaceholder'), trigger: 'change' }],
        hblNo: [{ required: true, message: this.$t('billAMS.forwarderBillError'), trigger: 'chnage' }],
        scacCode: [{ required: true, message: this.$t('billAMS.SCACCodePlaceholder'), trigger: 'blur' }],
        'shipper.contact': [{ required: true, message: this.$t('billAMS.companyNameError'), trigger: 'blur' }],
        'shipper.street': [{ required: true, message: this.$t('billAMS.addressError'), trigger: 'blur' },
          { min: 36, max: 105, message: this.$t('billAMS.addressError') }],
        'shipper.city': [{ required: true, message: this.$t('billAMS.cityPlaceholder'), trigger: 'blur' }],
        'shipper.postCode': [{ required: true, message: this.$t('billAMS.zipCodePlaceholder'), trigger: 'blur' }],
        'shipper.contactPhone': [{ required: false, validator: checkPhone, message: this.$t('billAMS.validPhoneSeaHousekeeperError'), trigger: 'blur' }],

        'consignee.contact': [{ required: true, message: this.$t('billAMS.companyNameError'), trigger: 'blur' }],
        'consignee.street': [{ required: true, message: this.$t('billAMS.addressError'), trigger: 'blur' },
          { min: 36, max: 105, message: this.$t('billAMS.addressError') }],
        'consignee.city': [{ required: true, message: this.$t('billAMS.cityPlaceholder'), trigger: 'blur' }],
        'consignee.postCode': [{ required: true, message: this.$t('billAMS.zipCodePlaceholder'), trigger: 'blur' }],
        'consignee.contactPhone': [{ required: false, validator: checkPhone, message: this.$t('billAMS.validPhoneSeaHousekeeperError'), trigger: 'blur' }],

        'notify.contact': [{ required: true, message: this.$t('billAMS.companyNameError'), trigger: 'blur' }],
        'notify.street': [{ required: true, message: this.$t('billAMS.addressError'), trigger: 'blur' },
          { min: 36, max: 105, message: this.$t('billAMS.addressError') }],
        'notify.city': [{ required: true, message: this.$t('billAMS.cityPlaceholder'), trigger: 'blur' }],
        'notify.postCode': [{ required: true, message: this.$t('billAMS.zipCodePlaceholder'), trigger: 'blur' }],
        'notify.contactPhone': [{ required: false, validator: checkPhone, message: this.$t('billAMS.validPhoneSeaHousekeeperError'), trigger: 'blur' }],

        'secNotify.contact': [{ required: true, message: this.$t('billAMS.companyNameError'), trigger: 'blur' }],
        'secNotify.street': [{ required: true, message: this.$t('billAMS.addressError'), trigger: 'blur' }],
        'secNotify.city': [{ required: true, message: this.$t('billAMS.cityPlaceholder'), trigger: 'blur' }],
        'secNotify.postCode': [{ required: true, message: this.$t('billAMS.zipCodePlaceholder'), trigger: 'blur' }],
        'secNotify.contactPhone': [{ required: false, validator: checkPhone, message: this.$t('billAMS.validPhoneSeaHousekeeperError'), trigger: 'blur' }],
        issueBlFlag: [{ required: true, message: this.$t('billAMS.whetherCommissionPlaceholder'), trigger: 'change' }],
        email: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        hblOwn: [{ required: true, message: this.$t('billAMS.hblOwnPlaceholder'), trigger: 'blur' }]

      },
      inviteLoading: true,
      vm: this,
      VUE_APP_BASE_API: '',
      yhtProxyFlagdisabled: false,
      editHblNo: '',
      editHblOwn: '',
      billid: this.$route.query.billid,
      hblid: this.$route.query.hblid,
      blNo: this.$route.query.blNo,
      editScope: {},
      packageTypeOption: [],
      containersList: [],
      isNewAdd: false,
      containerQty: '' // 箱型箱量
    }
  },
  created() {
    this.editAMS(this.hblid)
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    }),
    hblNo: {
      get: function() {
        return this.forwarderBillForm.hblNo
      },
      set: function(val) {
        this.$set(this.forwarderBillForm, 'hblNo', val.replace(/[^A-Za-z0-9]/g, '').toUpperCase())
      }
    },
    scacCode: {
      get: function() {
        return this.forwarderBillForm.scacCode
      },
      set: function(val) {
        this.$set(this.forwarderBillForm, 'scacCode', val.replace(/[^A-Za-z]/g, '').toUpperCase())
      }
    }
  },
  methods: {
    closeTab() {
      this.$store.dispatch('tagsView/delView', this.$route)
    },
    contact(e, val1, val2) {
      // eslint-disable-next-line no-control-regex
      const val = e.target.value.replace(/[^\x00-\xff]/g, '').toUpperCase()
      this.$set(this.forwarderBillForm[val1], val2, val)
    },
    closeInviteDialog() {
      this.dialogCheckList = []
      this.dialogVisible = false
    },
    addContainer() { // 打开添加集装箱信息
      this.containersList.map(item => {
        const some = this.forwarderBillForm.containerDTOList.some(function(computer) {
          return computer.containerId === item.containerId
        })
        if (some) {
          this.$set(item, 'disable', true)
        } else {
          this.$set(item, 'disable', false)
        }
      })
      this.dialogVisible = true
    },
    submitAudit() { // 添加集装箱信息
      if (this.dialogCheckList.length === 0) {
        this.$message.warning(this.$t('billAMS.unlessOneSelected'))
        return
      }
      this.dialogCheckList.map(item =>
        item.containerCargoDTOList.map(val => this.$set(val, 'edit', false))
      )
      this.forwarderBillForm.containerDTOList.push(...this.dialogCheckList)
      this.dialogCheckList = []
      this.dialogVisible = false
    },
    upper(val) { // 大写
      val = val ? val.toUpperCase() : ''
    },
    addRow(index) {
      this.forwarderBillForm.containerDTOList[index].containerCargoDTOList.push({ edit: true })
      this.isEdit = true
    },
    changeEdit(index, scope) {
      this.isEdit = true
      this.onEditOldVal = {}
      this.onEditOldVal = this.$extends(true, {}, this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[scope.$index])
      //   this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[scope.$index].edit = true
      this.$set(this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[scope.$index], 'edit', true)
    },
    closeEdit(index, rowIndex) {
      this.isEdit = false
      console.log(this.forwarderBillForm.containerDTOList[index])
      //   this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[rowIndex] = this.onEditOldVal
      this.$nextTick(() => {
        this.$set(this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[rowIndex], 'edit', false)
      })
      console.log(this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[rowIndex])
    },
    deleteRow(index, rowIndex) {
      if (this.forwarderBillForm.containerDTOList[index].containerCargoDTOList.length === 1) {
        this.$message.warning('至少保留一条信息！')
      } else {
        this.forwarderBillForm.containerDTOList[index].containerCargoDTOList.splice(rowIndex, 1)
        this.calculateTotal()
      }
    },
    saveEdit(index, $index) {
      const validatVal = [
        `containerDTOList.${index}.containerCargoDTOList.${$index}.hsCode`,
        `containerDTOList.${index}.containerCargoDTOList.${$index}.quantity`,
        `containerDTOList.${index}.containerCargoDTOList.${$index}.packageType`,
        `containerDTOList.${index}.containerCargoDTOList.${$index}.weight`,
        `containerDTOList.${index}.containerCargoDTOList.${$index}.volume`,
        `containerDTOList.${index}.containerCargoDTOList.${$index}.cargoDesc`
      ]
      const _self = this
      Promise.all(validatVal.map(item => {
        const p = new Promise(function(resolve, reject) {
          _self.$refs.isCommissionForm.validateField(item, error => {
            resolve(error)
          })
        })
        return p
      })).then(data => {
        data = data.filter(item => item)
        console.log(data)
        if (!data.length) {
          this.isEdit = false
          this.$set(this.forwarderBillForm.containerDTOList[index].containerCargoDTOList[$index], 'edit', false)
          this.onEditOldVal = {}
          this.calculateTotal()
        } else {
          console.log('验证不通过')
        }
      })
    },
    removeSO(index) {
      if (this.forwarderBillForm.containerDTOList.length >= 1) {
        this.forwarderBillForm.containerDTOList.splice(index, 1)
        // 计算箱量
        this.calculateTotal()
      }
    },
    calculateTotal() { // 总计
      this.forwarderBillForm.containerDTOList.map(item => {
        if (!item.containerCargoDTOList) {return}
        let packageTypeArr = []
        let sumQuantity = 0
        let sumGrossWeight = 0
        let sumVolume = 0
        item.containerCargoDTOList.map(val => {
          if (val.packageType) {
            packageTypeArr.push(val.packageType)
          }
          sumQuantity += isNaN(Number(val.quantity)) ? 0 : Number(val.quantity)
          sumGrossWeight += isNaN(Number(val.weight)) ? 0 : Number(val.weight)
          sumVolume += isNaN(Number(val.volume)) ? 0 : Number(val.volume)
          packageTypeArr = [...new Set(packageTypeArr)]
          if (packageTypeArr.length === 1) {
            this.$set(item, 'packageType', packageTypeArr[0])
          } else {
            this.$set(item, 'packageType', 'PACKAGES')
          }
          this.$set(item, 'sumQuantity', sumQuantity)
          this.$set(item, 'sumGrossWeight', sumGrossWeight.toFixed(3))
          this.$set(item, 'sumVolume', sumVolume.toFixed(3))
        })
      })
    },
    async editAMS(id) {
      const res = await houseBlDetailApi(id)
      this.loading = false
      if (res.ok) {
        this.forwarderBillForm = res.content
        //  this.forwarderBillForm.containerDTOList = this.containerDTOList
        if (res.content.yhtProxyFlag) {
          this.$set(this.forwarderBillForm, 'consignee', JSON.parse(res.content.consigneeInfo))
          this.$set(this.forwarderBillForm, 'notify', JSON.parse(res.content.notifyInfo))
          this.$set(this.forwarderBillForm, 'shipper', JSON.parse(res.content.shipperInfo))
          this.$set(this.forwarderBillForm, 'secNotify', JSON.parse(res.content.secNotifyInfo))
          this.$set(this.forwarderBillForm, 'hblOwn', res.content.hblOwn || res.content.hblOwn === 0 ? res.content.hblOwn.toString() : '')
          this.forwarderBillForm.shipper.contactPhone = this.forwarderBillForm.shipper.contactPhone.split('-')
          this.forwarderBillForm.consignee.contactPhone = this.forwarderBillForm.consignee.contactPhone.split('-')
          this.forwarderBillForm.notify.contactPhone = this.forwarderBillForm.notify.contactPhone.split('-')
          this.forwarderBillForm.secNotify.contactPhone = this.forwarderBillForm.secNotify.contactPhone.split('-')
          if (res.content.isEmptyDeclare) { // 是空箱
            this.$set(this.forwarderBillForm, 'containerDTOListEmpty', res.content.containerDTOList[0].containerCargoDTOList[0])

            // 根据箱子计算中箱型箱量
            const containerQty = {}
            res.content.containerDTOList.map(item => {
              if (item.containerType === '53HC') {
                containerQty[item.containerType] ? containerQty[item.containerType]++ : containerQty[item.containerType] = 1
              }
            })
            const containerQtyArr = []
            for (const key in containerQty) {
              containerQtyArr.push(`${key}*${containerQty[key]}`)
            }
            this.containerQty = containerQtyArr.join(';')
          }
        }

        this.yhtProxyFlagdisabled = true
        if (this.forwarderBillForm.yhtProxyFlag) {
          if (!this.forwarderBillForm.hblNo) {
            this.$set(this.forwarderBillForm, 'hblNo', this.$t('billAMS.forwarderBillPlaceholderYHT'))
          } else {
            this.editHblNo = res.content.hblNo
            this.editHblOwn = res.content.hblOwn
          }
        }
      }
    },
    yhtProxyFlagChange(val) {
      if (val === false) {
        this.forwarderBillForm.hblNo = ''
      } else if (this.forwarderBillForm.hblOwn === '0') {
        this.$set(this.forwarderBillForm, 'hblNo', this.$t('billAMS.forwarderBillPlaceholderYHT'))
      }
    },
    hblOwnChange(val) {
      if (val === 0 || val === '0') {
        if (this.forwarderBillForm.id && this.editHblNo) {
          if (this.editHblOwn === 0) {
            this.forwarderBillForm.hblNo = this.editHblNo
          } else {
            this.$set(this.forwarderBillForm, 'hblNo', this.$t('billAMS.forwarderBillPlaceholderYHT'))
          }
        } else {
          this.$set(this.forwarderBillForm, 'hblNo', this.$t('billAMS.forwarderBillPlaceholderYHT'))
        }
      } else {
        if (this.forwarderBillForm.id && this.editHblNo) {
          if (this.editHblOwn === 1) {
            this.forwarderBillForm.hblNo = this.editHblNo
          } else {
            this.$set(this.forwarderBillForm, 'hblNo', '')
          }
        } else {
          this.$set(this.forwarderBillForm, 'hblNo', '')
        }
      }
    },
    async saveHouseBl() {
      if (this.forwarderBillForm.yhtProxyFlag) {
        this.$refs.isCommissionForm.validate(async valid => {
          if (valid) {
            const data = JSON.parse(JSON.stringify(this.forwarderBillForm))
            delete data.scacCode
            data.shipper.contactPhone = this.forwarderBillForm.shipper.contactPhone.join('-')
            data.consignee.contactPhone = this.forwarderBillForm.consignee.contactPhone.join('-')
            data.notify.contactPhone = this.forwarderBillForm.notify.contactPhone.join('-')
            data.secNotify.contactPhone = this.forwarderBillForm.secNotify.contactPhone.join('-')
            if (this.forwarderBillForm.hblOwn === 0 && !this.forwarderBillForm.id) {
              this.forwarderBillForm.hblNo = ''
            }
            this.fullscreenLoading = true
            this.inviteLoading = true
            if (this.hblid && this.forwarderBillForm.yhtProxyFlag === true) {
              const resRepeat = await validContainerRepeatApi(data)
              if (resRepeat.ok) {
                this.submitHBL(data)
              } else {
                this.messageBox(resRepeat.content, data)
                this.fullscreenLoading = false
                this.inviteLoading = false
              }
            } else {
              this.submitHBL(data)
            }
          }
        })
      } else {
        this.$refs.whetherCommissionForm.validate(async valid => {
          if (valid) {
            let data = {}
            if (this.forwarderBillForm.issueBlFlag) {
              data = {
                yhtProxyFlag: this.forwarderBillForm.yhtProxyFlag,
                issueBlFlag: this.forwarderBillForm.issueBlFlag,
                blId: this.forwarderBillForm.blId,
                hblNo: this.forwarderBillForm.hblNo,
                scacCode: this.forwarderBillForm.scacCode
              }
            } else {
              data = {
                yhtProxyFlag: this.forwarderBillForm.yhtProxyFlag,
                issueBlFlag: this.forwarderBillForm.issueBlFlag,
                blId: this.forwarderBillForm.blId
              }
            }
            this.fullscreenLoading = true
            this.inviteLoading = true
            if (this.hblid && this.forwarderBillForm.yhtProxyFlag === true) {
              const resRepeat = await validContainerRepeatApi(data)
              if (resRepeat.ok) {
                this.submitHBL(data)
              } else {
                this.messageBox(resRepeat.content, data)
                this.fullscreenLoading = false
                this.inviteLoading = false
              }
            } else {
              this.submitHBL(data)
            }
          }
        })
      }
    },
    async submitHBL(data) {
      let url
      if (this.hblid) {
        url = updateHouseBleApi
      } else {
        url = saveHouseBleApi
      }
      const res = await url(data, this.hblid)
      this.fullscreenLoading = false
      this.inviteLoading = false
      if (res.ok) {
        this.$message.success(res.content)
        this.getList()
      }
    },
    messageBox(msg, data) {
      this.$confirm(msg, this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        confirmButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.fullscreenLoading = true
        this.inviteLoading = true
        this.submitHBL(data)
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-right-inner-wrap{ padding: 20px; background: #fff}
.cred{ color: red}
.footer{ text-align: right; padding-right: 10%}
.feed-head{ display: flex;
  .case-number{ line-height: 50px; margin-right: 50px;}
  .total{ display: flex; flex-wrap: wrap; font-size: 14px; width: 400px; margin-left: 50px;
    p{ width: 200px; margin: 0 0 10px 0;
      span{ color:rgba(255, 0, 0, 0.8) }
    }
  }
}
.features-btn {
  margin-top: 10px; height: 30px;
}
.containerInformation{
  padding-left: 40px; display: flex;
  .title{
    font-family: 'Arial Negreta', 'Arial';
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    line-height: 40px;
    span{ color: red}
  }
  .add-container{ margin: 0 20px}
  .point{ font-size: 12px; color: red; width: 500px; line-height: 18px}
}
.dataTable {
  margin-top: 15px;
}

.invite-work-url {
  width: 80%;
  height: 50px;
  line-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.operating { display: flex;
  i {
    font-size: 16px;
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      transition: all 0.2s ease 0s;
    }
  }
}

.status-text {
  &.info-text {
    color: #909399;
  }

  &.warning-text {
    color: #E6A23C;
  }

  &.success-text {
    color: #67C23A;
  }

  &.danger-text {
    color: #F56C6C;
  }

  &.primary-text {
    color: #409EFF;
  }
}
.primary-text {
  color: #409EFF;
}
.billForm {
  display: flex; flex-wrap: wrap;
  .title{
    font-family: 'Arial Negreta', 'Arial';
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
    span{ color: red}
  }
  .phoneCon{
    display: flex; justify-content: space-between;
  }
  .phone{ width: 30%;}
}
.go-ams{  margin-right: 8px;}
.el-icon-click,.el-icon-edit,.el-icon-download{cursor: pointer; transition: all 0.2s ease 0s;
  &:hover{ transform: scale(1.1)}
}
.change-label-calss ::v-deep .el-form-item__label{
  width: 200px !important;
}

.billForm ::v-deep {
  .el-form-item--medium .el-form-item__content {
    width: 70% ;
  }
  .el-form-item{
    width: 100%;
  }
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
.operating2{ margin-bottom: 15px;}
.dialog-box{
  text-align: center; margin-top: 30px;
  ::v-deep label { display: block; position: relative; width: 45%; margin: 10px auto;
    .el-checkbox__input{ float: right;}
    .el-checkbox__label{ float: left}
    &::after{  content:"";
      display:block;
      clear:both;}
  }
}
.dialog-title{
  display: flex; justify-content: space-between; width: 220px; margin: 30px auto 20px auto; font-size: 14px; font-weight: bold;
  span:nth-child(1){ margin-left: 30px}
}
</style>
