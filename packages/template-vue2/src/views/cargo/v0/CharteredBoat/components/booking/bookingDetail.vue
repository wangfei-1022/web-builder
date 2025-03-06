<!--订舱详情页-->
<template>
  <div class="booking-detail">
    <div>
      <el-scrollbar style="height: calc(100vh - 134px);overflow-x:hidden">
        <!--      船期信息-->
        <div class="detail-chunk">
          <div class="chunk-header">
            <div class="chunk-header-left">{{$t('boatBookingDetail.sailingInfo')}}</div>
            <div class="flex-center flex-grow">
              <div v-for="(node,index) in shippingGrid.graphData" :key="index" class="flex">
                <div style="display: flex;flex-direction: column">
                  <img :src="shipImg" style="width: 100px">
                  <div style="align-self: center;padding-top: 5px;">{{ node.name }}</div>
                </div>
                <div v-if="!node.end" style="display: flex;flex-direction: column;align-items: center;margin: 0px 5px;">
                  <span>{{$t('boatBookingDetail.routeLine')}}{{ index + 1 }}</span>
                  <div style="display: flex;">
                    <span class="arrow-link" />
                    <el-icon class="el-icon-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
            <div class="chunk-header-left" />
          </div>
          <div class="chunk-body">
            <el-table
              header-row-class-name="el-grid-header"
              :data="shippingGrid.data.slice(1)"
              stripe
              class="grid-list"
              style="width: 100%"
            >
              <el-table-column
                prop="shippingDate"
                :label="$t('boatBookingDetail.estimateDuration')"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.shippingDate }}{{$t('boatBookingDetail.dayText')}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="cyCutDate"
                align="center"
                :label="$t('boatBookingDetail.carryingDuration')"
              >
                <template slot-scope="scope">
                  <span v-if="scope.$index<1">
                    {{ $moment(Number(scope.row.cyCutDate)).format('YYYY-MM-DD HH:mm') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="etd"
                align="center"
                :label="$t('boatBookingDetail.estimateLeave')"
              >
                <template slot-scope="scope">
                  <span v-if="scope.$index<1">
                    {{ $moment(Number(scope.row.etd)).format('YYYY-MM-DD HH:mm') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="eta"
                align="center"
                :label="$t('boatBookingDetail.estimateArrive')"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $moment(Number(scope.row.eta)).format('YYYY-MM-DD HH:mm') }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                :label="$t('boatBookingDetail.polToPod')"
                align="center"
              >
                <template slot-scope="{row}">
                  <span>
                    {{ row.enPolName }}-{{ row.enPodName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                align="center"
                :label="$t('boatBookingDetail.vessel')"
              >
                <template slot-scope="{row,$index}">
                  <span v-if="$index<1">
                    {{ row.vessel }}/{{ row.voyage }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--      货运信息-->
        <div class="detail-chunk">
          <div class="chunk-header">
            <div class="chunk-header-left">{{$t('boatBookingDetail.deliveryInfo')}}</div>
            <div v-if="originalFormData.status===3" style="color:red;font-size: 14px;">
              {{$t('common.reasonOfRejected')}} : {{ originalFormData.rejectReason }}
            </div>
          </div>
          <div class="chunk-body">
            <el-form
              ref="shipperForm"
              :disabled="!allowModify"
              :status-icon="false"
              label-width="100px"
              :model="formOtherInfo.shipper"
            >
              <el-form-item
                :label="$t('boatBookingDetail.consigner')"
                style="width: 100%;"
                required
                prop="contact"
                :rules="[{required:true,validator:(r,v,c)=>checkCompanyName(r,v,c,'shipper')}]"
              >
                <el-autocomplete
                  v-model="formOtherInfo.shipper.contact"
                  :fetch-suggestions="querySearch"
                  :placeholder="$t('common.placeholder')"
                  size="mini"
                  class="w-full"
                  @change="onChangeCompanyName($event,'shipper')"
                  @select="querySearchChange($event,'shipper')"
                >
                  <template slot-scope="{ item }">
                    <span class="addr">{{ item.contact }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item
                :label="$t('boatBookingDetail.street')"
                required
                prop="street"
                :rules="[{required:true,validator:(r,v,c)=>checkStreet(r,v,c,'shipper')}]"
              >
                <el-input
                  v-model="formOtherInfo.shipper.street"
                  size="mini"
                  :placeholder="$t('boatBookingDetail.streetPlaceholder')"
                />
              </el-form-item>
              <el-form-item
                :label="$t('boatBookingDetail.city')"
                required
                prop="city"
                :rules="[{required:true,validator:(r,v,c)=>checkCity(r,v,c,'shipper')}]"
              >
                <div style="display: flex;justify-content: flex-start">
                  <el-input
                    v-model="formOtherInfo.shipper.city"
                    size="mini"
                    :placeholder="$t('boatBookingDetail.cityPlaceholder')"
                  />
                  <el-input v-model="formOtherInfo.shipper.county" size="mini" :placeholder="$t('boatBookingDetail.areaText')" />
                  <el-input v-model="formOtherInfo.shipper.province" size="mini" :placeholder="$t('boatBookingDetail.province')" />
                  <el-input v-model="formOtherInfo.shipper.country" size="mini" :placeholder="$t('boatBookingDetail.country')" />
                  <el-input v-model="formOtherInfo.shipper.postCode" size="mini" :placeholder="$t('boatBookingDetail.postCode')" />
                </div>

              </el-form-item>
              <div style="display: flex">
                <el-form-item :label="$t('boatBookingDetail.shipper')" prop="lastName" :rules="[{validator:(r,v,c)=>checkContact(r,v,c,'shipper')}]">
                  <el-input
                    v-model="formOtherInfo.shipper.lastName"
                    size="mini"
                    :placeholder="$t('boatBookingDetail.lastName')"
                    style="width: 200px"
                  />
                </el-form-item>
                <el-form-item
                  label=""
                  label-width="0px"
                  prop="firstName"
                  :rules="[{validator:(r,v,c)=>checkContact(r,v,c,'shipper')}]"
                >
                  <el-input
                    v-model="formOtherInfo.shipper.firstName"
                    size="mini"
                    :placeholder="$t('boatBookingDetail.firstName')"
                    style="width: 300px"
                  />
                </el-form-item>
                <el-form-item
                  style="flex-grow: 2;"
                  class="muti-form-item"
                  :label="$t('boatBookingDetail.contactPhone')"
                  prop="contactPhone"
                  :rules="[{validator:(r,v,c)=>checkTel(r,v,c,'shipper')}]"
                >
                  <el-input
                    v-model="formOtherInfo.shipper.contactPhone1"
                    size="mini"
                    placeholder=""
                    style="flex-grow: 1"
                  />
                  <span>-</span>
                  <el-input
                    v-model="formOtherInfo.shipper.contactPhone2"
                    size="mini"
                    placeholder=""
                    style="flex-grow: 1"
                  />
                  <span>-</span>
                  <el-input
                    v-model="formOtherInfo.shipper.contactPhone3"
                    size="mini"
                    placeholder=""
                    style="flex-grow: 1"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <!--      其他货运信息-->
        <div class="detail-chunk">
          <el-collapse accordion>
            <el-collapse-item>
              <div slot="title" class="chunk-header">
                <div class="chunk-header-left">{{$t('boatBookingDetail.otherDeliveryInfo')}}</div>
              </div>
              <div class="chunk-body">
                <el-form
                  ref="consigneeForm"
                  :disabled="!allowModify"
                  :status-icon="false"
                  label-width="100px"
                  :model="formOtherInfo.consignee"
                >
                  <el-form-item
                    :label="$t('boatBookingDetail.consignee')"
                    style="width: 100%;"
                    prop="contact"
                    :rules="[{validator:(r,v,c)=>checkCompanyName(r,v,c,'consignee')}]"
                  >
                    <el-autocomplete
                      v-model="formOtherInfo.consignee.contact"
                      :fetch-suggestions="querySearch1"
                      :placeholder="$t('common.placeholder')"
                      size="mini"
                      class="w-full"
                      @change="onChangeCompanyName($event,'consignee')"
                      @select="querySearchChange($event,'consignee')"
                    >
                      <template slot-scope="{ item }">
                        <span class="addr">{{ item.contact }}</span>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item :label="$t('boatBookingDetail.street')" prop="street" :rules="[{validator:(r,v,c)=>checkStreet(r,v,c,'consignee')}]">
                    <el-input
                      v-model="formOtherInfo.consignee.street"
                      size="mini"
                      :placeholder="$t('boatBookingDetail.streetPlaceholder')"
                    />
                  </el-form-item>
                  <el-form-item :label="$t('boatBookingDetail.city')" prop="city" :rules="[{validator:(r,v,c)=>checkCity(r,v,c,'consignee')}]">
                    <div style="display: flex;justify-content: flex-start">
                      <el-input
                        v-model="formOtherInfo.consignee.city"
                        size="mini"
                        :placeholder="$t('boatBookingDetail.cityPlaceholder')"
                      />
                      <el-input v-model="formOtherInfo.consignee.county" size="mini" :placeholder="$t('boatBookingDetail.areaText')" />
                      <el-input v-model="formOtherInfo.consignee.province" size="mini" :placeholder="$t('boatBookingDetail.province')" />
                      <el-input v-model="formOtherInfo.consignee.country" size="mini" :placeholder="$t('boatBookingDetail.country')" />
                      <el-input v-model="formOtherInfo.consignee.postCode" size="mini" :placeholder="$t('boatBookingDetail.postCode')" />
                    </div>

                  </el-form-item>
                  <div style="display: flex">
                    <el-form-item
                      :label="$t('boatBookingDetail.shipper')"
                      prop="lastName"
                      :rules="[{validator:(r,v,c)=>checkContact(r,v,c,'consignee')}]"
                    >
                      <el-input
                        v-model="formOtherInfo.consignee.lastName"
                        size="mini"
                        :placeholder="$t('boatBookingDetail.lastName')"
                        style="width: 200px"
                      />
                    </el-form-item>
                    <el-form-item
                      label=""
                      label-width="0px"
                      prop="firstName"
                      :rules="[{validator:(r,v,c)=>checkContact(r,v,c,'consignee')}]"
                    >
                      <el-input
                        v-model="formOtherInfo.consignee.firstName"
                        size="mini"
                        :placeholder="$t('boatBookingDetail.firstName')"
                        style="width: 300px"
                      />
                    </el-form-item>
                    <el-form-item
                      style="flex-grow: 2;"
                      class="muti-form-item"
                      :label="$t('boatBookingDetail.contactPhone')"
                      prop="contactPhone"
                      :rules="[{validator:(r,v,c)=>checkTel(r,v,c,'consignee')}]"
                    >
                      <el-input
                        v-model="formOtherInfo.consignee.contactPhone1"
                        size="mini"
                        placeholder=""
                        style="flex-grow: 1"
                      />
                      <span>-</span>
                      <el-input
                        v-model="formOtherInfo.consignee.contactPhone2"
                        size="mini"
                        placeholder=""
                        style="flex-grow: 1"
                      />
                      <span>-</span>
                      <el-input
                        v-model="formOtherInfo.consignee.contactPhone3"
                        size="mini"
                        placeholder=""
                        style="flex-grow: 1"
                      />
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div class="chunk-body">
                <el-form
                  ref="notifyForm"
                  :disabled="!allowModify"
                  :status-icon="false"
                  label-width="100px"
                  :model="formOtherInfo.notify"
                >
                  <el-form-item
                    :label="$t('boatBookingDetail.notifier')"
                    style="width: 100%;"
                    prop="contact"
                    :rules="[{validator:(r,v,c)=>checkCompanyName(r,v,c,'notify')}]"
                  >
                    <el-autocomplete
                      v-model="formOtherInfo.notify.contact"
                      :fetch-suggestions="querySearch2"
                      :placeholder="$t('common.placeholder')"
                      size="mini"
                      class="w-full"
                      @change="onChangeCompanyName($event,'consignee')"
                      @select="querySearchChange($event,'notify')"
                    >
                      <template slot-scope="{ item }">
                        <span class="addr">{{ item.contact }}</span>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item :label="$t('boatBookingDetail.street')" prop="street" :rules="[{validator:(r,v,c)=>checkStreet(r,v,c,'notify')}]">
                    <el-input
                      v-model="formOtherInfo.notify.street"
                      size="mini"
                      :placeholder="$t('boatBookingDetail.streetPlaceholder')"
                    />
                  </el-form-item>
                  <el-form-item :label="$t('boatBookingDetail.city')" prop="city" :rules="[{validator:(r,v,c)=>checkCity(r,v,c,'notify')}]">
                    <div style="display: flex;justify-content: flex-start">
                      <el-input
                        v-model="formOtherInfo.notify.city"
                        size="mini"
                        :placeholder="$t('boatBookingDetail.cityPlaceholder')"
                      />
                      <el-input v-model="formOtherInfo.notify.county" size="mini" :placeholder="$t('boatBookingDetail.areaText')" />
                      <el-input v-model="formOtherInfo.notify.province" size="mini" :placeholder="$t('boatBookingDetail.province')" />
                      <el-input v-model="formOtherInfo.notify.country" size="mini" :placeholder="$t('boatBookingDetail.country')" />
                      <el-input v-model="formOtherInfo.notify.postCode" size="mini" :placeholder="$t('boatBookingDetail.postCode')" />
                    </div>

                  </el-form-item>
                  <div style="display: flex">
                    <el-form-item
                      :label="$t('boatBookingDetail.shipper')"
                      prop="lastName"
                      :rules="[{validator:(r,v,c)=>checkContact(r,v,c,'notify')}]"
                    >
                      <el-input
                        v-model="formOtherInfo.notify.lastName"
                        size="mini"
                        :placeholder="$t('boatBookingDetail.lastName')"
                        style="width: 200px"
                      />
                    </el-form-item>
                    <el-form-item
                      label=""
                      label-width="0px"
                      prop="firstName"
                      :rules="[{validator:(r,v,c)=>checkContact(r,v,c,'notify')}]"
                    >
                      <el-input
                        v-model="formOtherInfo.notify.firstName"
                        size="mini"
                        :placeholder="$t('boatBookingDetail.firstName')"
                        style="width: 300px"
                      />
                    </el-form-item>
                    <el-form-item
                      style="flex-grow: 2;"
                      class="muti-form-item"
                      :label="$t('boatBookingDetail.contactPhone')"
                      prop="contactPhone"
                      :rules="[{validator:(r,v,c)=>checkTel(r,v,c,'notify')}]"
                    >
                      <el-input
                        v-model="formOtherInfo.notify.contactPhone1"
                        size="mini"
                        placeholder=""
                        style="flex-grow: 1"
                      />
                      <span>-</span>
                      <el-input
                        v-model="formOtherInfo.notify.contactPhone2"
                        size="mini"
                        placeholder=""
                        style="flex-grow: 1"
                      />
                      <span>-</span>
                      <el-input
                        v-model="formOtherInfo.notify.contactPhone3"
                        size="mini"
                        placeholder=""
                        style="flex-grow: 1"
                      />
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!--      货物信息-->
        <div class="detail-chunk">
          <div class="chunk-header">
            <div class="chunk-header-left">{{$t('boatBookingDetail.goodsInfo')}}</div>
          </div>
          <div class="chunk-body">
            <el-form
              ref="cargoGridForm"
              :disabled="!allowModify"
              label-width="0px"
              label-position="left"
              :model="cargoGrid"
            >
              <el-table
                :data="cargoGrid.data"
                stripe
                class="grid-list"
                style="width: 100%"
                header-row-class-name="el-grid-header el-grid-header-required"
                row-class-name="el-grid-row-no-error-msg"
                :cell-style="{padding:'0px'}"
              >
                <el-table-column
                  prop="goodsType"
                  :label="$t('boatBookingDetail.goodsType')"
                  width="150"
                >
                  <template slot-scope="{row,$index}">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="'data.' + $index + '.goodsType'"
                      :rules="[
                        { required: true, message: $t('boatBookingDetail.goodsTypeEmptyInvalid') },
                      ]"
                    >
                      <el-select v-model="row.goodsType" disabled size="mini">
                        <el-option label="GC" :value="1" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="goodsDesc"
                  :label="$t('boatBookingDetail.goodsDesc')"
                >
                  <template slot-scope="{row,$index}">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="'data.' + $index + '.goodsDesc'"
                      :rules="[
                        { required: true, message: $t('boatBookingDetail.goodsDescEmptyInvalid') },
                        { validator: checkCargoDesc, message: $t('boatBookingDetail.englishInputOnlyInvalid') },
                      ]"
                    >
                      <el-input v-model="row.goodsDesc" size="mini" :placeholder="$t('boatBookingDetail.goodsDescPlaceholder')" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="goodsDesc"
                  :label="$t('boatBookingDetail.chineseName')"
                >
                  <template slot-scope="{row,$index}">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="'data.' + $index + '.goodsChineseName'"
                      :rules="[
                        { required: true, message: $t('boatBookingDetail.chineseNamePlaceholder') },
                      ]"
                    >
                      <el-input v-model="row.goodsChineseName" maxLength="200" size="mini" :placeholder="$t('boatBookingDetail.chineseNamePlaceholder')" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="casNo"
                  class-name="not-required"
                  :label="$t('boatBookingDetail.casNo')"
                >
                  <template slot-scope="{row,$index}">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="'data.' + $index + '.casNo'"
                      :rules="[{ validator: checkCas },]"
                    >
                      <el-input v-model="row.casNo" size="mini" maxlength="20"/>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
        <!--      集装箱信息，审核只可修改数量和删除-->
        <div class="detail-chunk mb-20">
          <div class="chunk-header">
            <div class="chunk-header-left">{{$t('boatBookingDetail.containerInfo')}}</div>
            <div v-if="isEdit" style="color:red;font-size:12px;align-content: flex-start">{{$t('boatBookingDetail.containerChangeTips')}}</div>
<!--            <el-button v-show="allowModify" type="primary" size="mini" @click="addContainer">添加集装箱</el-button>-->
          </div>
          <div class="chunk-body">
            <el-form
              ref="containerGridForm"
              label-width="0px"
              :show-message="false"
              label-position="left"
              :model="containerGrid"
            >
              <el-table
                header-row-class-name="el-grid-header el-grid-header-required "
                row-class-name="el-grid-row-no-error-msg"
                :cell-style="{padding:'0px'}"
                :data="containerGrid.data"
                stripe
                class="grid-list"
                style="width: 100%"
              >
                <el-table-column
                  prop="qty"
                  :label="$t('common.quantity')"
                  align="center"
                  width="200"
                >
                  <template slot-scope="{row,$index}">
                    <span v-if="!row.isEdit">{{ row.qty }}</span>
                    <el-form-item
                      v-else
                      label=""
                      label-width="0px"
                      :prop="'data.' + $index + '.qty'"
                      :rules="[{ required:true,validator:(r,v,c)=>checkContainerQty(r,v,c,row) },]"
                    >
                      <el-input v-model.number="row.qty" size="mini" :min="1" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="containerSizeType"
                  :label="$t('charteredBoat.containerType')"
                  align="center"
                  width="150"
                >
                  <template slot-scope="{row,$index}">
                    <span v-if="!row.isEdit||isAudit">{{ row.containerSizeType }}</span>
                    <el-form-item
                      v-else
                      label=""
                      label-width="0px"
                      :prop="'data.' + $index + '.containerSizeType'"
                      :rules="[
                        { required: true, message: $t('boatBookingDetail.containerSelectEmptyInvalid') },
                      ]"
                    >
                      <el-select v-model="row.containerSizeType" size="mini">
                        <el-option
                          v-for="item in containerGrid.supportSizeType"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="grossWeight"
                  :label="$t('boatBookingDetail.grossWeight')"
                >
                  <template slot-scope="{row,$index}">
                    <div v-if="!row.isEdit||isAudit" style="display: flex;justify-content: center">
                      <span>{{ row.grossWeight }}</span>
                      <span>KGS</span>
                    </div>
                    <div v-else style="display: flex;justify-content: center">
                      <el-form-item
                        label=""
                        label-width="0px"
                        :prop="'data.' + $index + '.grossWeight'"
                        :rules="[{ required:true,validator:checkNumber },]"
                      >
                        <el-input v-model="row.grossWeight" size="mini" :min="0" />
                      </el-form-item>
                      <el-form-item
                        label=""
                        label-width="0px"
                      >KGS
                        <!--                        <el-select v-model="row.grossWeightUnit" disabled size="mini">-->
                        <!--                          <el-option label="KGS" value="KGS"></el-option>-->
                        <!--                        </el-select>-->
                      </el-form-item>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="socFlag"
                  :label="$t('boatBookingDetail.socFlag')"
                  align="center"
                  width="130"
                >
                  <template slot-scope="{row}">
                    <span v-if="!row.isEdit||isAudit">{{ row.socFlag ? $t('common.trueText') : $t('common.falseText') }}</span>
                    <el-form-item
                      v-else
                      label=""
                      label-width="0px"
                    >
                      <el-select v-model="row.socFlag" size="mini">
                        <el-option :label="$t('common.trueText')" :value="true" />
                        <el-option :label="$t('common.falseText')" :value="false" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
<!--                <el-table-column-->
<!--                  width="200"-->
<!--                  class-name="not-required"-->
<!--                  label="操作"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--                    <div style="display: flex;justify-content: center">-->
<!--                      <template v-if="!scope.row.isEdit">-->
<!--                        <el-button type="text" size="mini" @click="editContainerRow(scope.row)">-->
<!--                          编辑-->
<!--                        </el-button>-->
<!--                        &lt;!&ndash;      因编辑操作，不可减少集装箱数量                  &ndash;&gt;-->
<!--                        <el-button-->
<!--                          v-show="!isEdit"-->
<!--                          type="text"-->
<!--                          style="color:#F56C6C"-->
<!--                          size="mini"-->
<!--                          @click="delContainerRow(scope.row)"-->
<!--                        >-->
<!--                          删除-->
<!--                        </el-button>-->
<!--                      </template>-->
<!--                      <template v-else>-->
<!--                        <el-button type="text" style="color:#F56C6C" size="mini" @click="cancelContainerRow(scope.row)">-->
<!--                          取消-->
<!--                        </el-button>-->
<!--                        <el-button type="text" size="mini" @click="confirmContainerRow(scope.row)">-->
<!--                          保存-->
<!--                        </el-button>-->
<!--                      </template>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </el-table-column>-->
              </el-table>
            </el-form>
          </div>
        </div>
<!--        文件上传-->
        <div class="detail-chunk mb-20">
          <div class="chunk-header">
            <div class="chunk-header-left">{{$t('boatBookingDetail.fileUpload')}}</div>
          </div>
          <el-form :status-icon="false" style="width: 1000px;" @submit.native.prevent ref="fileGrid" label-position="left" :model="fileGrid" label-width="140px">
            <el-table header-row-class-name="el-grid-header el-grid-header-required " row-class-name="el-grid-row-no-error-msg" :cell-style="{padding:'0px'}" :data="fileGrid.data" stripe class="grid-list" style="width: 100%;">
              <el-table-column prop="qty" :label="$t('boatBookingDetail.fileType')" align="center" width="300" show-overflow-tooltip>
                <template slot-scope="{row,$index}">
                  <el-form-item label=""  label-width="0px" :prop="'data.' + $index + '.documentTypeCode'" :rules="[{ required:true,message:$t('booking.pleaseSelect'),trigger: 'blur' }, ]">
                    <span  class="form-table-text">{{ row.documentTypeCode }}</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="qty" :label="$t('boatBookingDetail.selectFile')" align="center" width="250">
                <template slot-scope="{row,$index}">
                  <el-form-item label="" label-width="0px" :prop="'data.' + $index + '.originFileName'" :rules="[{ required:true, message:$t('booking.pleaseSelect') },]">
                    <span class="form-table-text">{{ row.originFileName }}</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column  class-name="not-required" :label="$t('boatBookingDetail.uploadComments')" align="center">
                <template slot-scope="{row}">
                  <el-form-item label="" label-width="0px">
                    <span class="form-table-text">{{ row.mark }}</span>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column class-name="not-required" v-show="allowModify" :label="$t('boatBookingDetail.operation')" width="200">
                <template slot-scope="{row}">
                  <div style="display: flex;justify-content: center; align-items: center;" class="form-table-text">
                    <el-tooltip class="item" effect="dark" :content="$t('boatBookingDetail.see')" placement="top-start">
                      <el-button @click="fileView(row)" type="text" icon="el-icon-reading" style="font-size: 18px"></el-button>
                    </el-tooltip>

<!--                      <el-button @click="download(row.url)" type="text" style="font-size: 24px">{{$t('boatBookingDetail.download')}}</el-button>-->
                  </div>
                </template>
              </el-table-column>


            </el-table>
          </el-form>

        </div>
        <!--      订舱备注-->
          <div class="detail-chunk">
            <div class="chunk-header">
              <div class="chunk-header-left">{{$t('boatBookingDetail.bookingRemark')}}<span style="color:gray">{{$t('boatBookingDetail.nonRequired')}}</span></div>
            </div>
            <el-form ref="remarkEg" :status-icon="false" :model="originalFormData" label-width="140px" @submit.native.prevent>
                  <el-form-item label="" label-width="0px">
                      <el-input
                        v-model="originalFormData.remark"
                        :rows="5"
                        :disabled="!allowModify"
                        type="textarea"
                        size="mini"
                        :maxlength="200"
                        :placeholder="$t('boatBookingDetail.remarkPlaceholder')"
                      />
                    </el-form-item>
                    <el-form-item :label="$t('boatBookingDetail.deliveryMode')" prop="deliveryMode" :rules="[{ required:true, message:$t('boatBookingDetail.deliveryModeEmptyInvalid')}]">
                      <!--  -->
                      <el-radio-group v-model="originalFormData.deliveryMode" :disabled="isEdit">
                        <el-radio :label="1">{{$t('boatBookingDetail.multipleContainerOneTicket')}}</el-radio>
                        <el-radio :label="2">{{$t('boatBookingDetail.oneContainerOneTicket')}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <!--      我希望发送订舱至-->
                    <el-form-item
                      :label="$t('boatBookingDetail.confirmEmail')"
                      prop="confirmEmail"
                      :rules="[{validator: checkEmail}]"
                    >
                      <el-input
                        v-model="originalFormData.confirmEmail"
                        size="mini"
                        style="width: 100%;"
                        :placeholder="$t('boatBookingDetail.confirmEmailPlaceholder')"
                        maxlength="255"
                      />
                    </el-form-item>
              </el-form>
          </div>
<!--           提箱点分配-->
        <div v-if="isManagerTerminal" class="detail-chunk">
          <div v-if="!containerGrid.data.isSocFlag" class="chunk-header">
            <div class="chunk-header-left">{{$t('boatBookingDetail.socFlagAllot')}}</div>
          </div>
          <div class="chunk-body">
            <el-form ref="managerConfirmForm" :model="distributeList" :status-icon="false" class="mt-10 managerConfirmForm" label-width="100px">
              <el-form-item v-if="!containerGrid.data.isSocFlag" label="配箱策略" prop="distributeType" >
                <el-radio-group v-model="originalFormData.distributeType" :disabled="isEdit" @change="initDistribute">
                  <el-radio :label="1">{{$t('boatBookingDetail.socFlagOneYard')}}</el-radio>
                  <el-radio :label="2">{{$t('boatBookingDetail.socFlagMultipleYard')}}</el-radio>
                  <el-radio :label="3">{{$t('boatBookingDetail.socFlagCustom')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('boatBookingDetail.returnYard')" prop="distributeType2" >
                <el-radio-group v-model="originalFormData.yardArr" :disabled="isEdit" @change="yardArrChange">
                  <el-radio  v-for="(item,index) in originalFormData.returnAddressList" :label="item" :key="index">{{ item.yardName }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-table v-if="!containerGrid.data.isSocFlag" class="dataTable" :data="distributeList.containerPickDistributeList" ref="distributeTable" style="padding-left: 120px">
                <el-table-column :label="$t('boatBookingDetail.yardName')" prop="yardName" align="center"  width="150"></el-table-column>
                <el-table-column :label="$t('charteredBoat.containerType')" prop="containerType" align="center"  width="150"></el-table-column>
                <el-table-column :label="$t('boatBookingDetail.releaseQuantity')" prop="releaseQuantity" align="center"  width="150"></el-table-column>
                <el-table-column :label="$t('boatBookingDetail.spaceQuantity')" prop="spaceQuantity" align="center"  width="150"></el-table-column>
                <el-table-column :label="$t('boatBookingDetail.surplusQuantity')" prop="surplusQuantity" align="center"  width="150"></el-table-column>
                <el-table-column :label="$t('boatBookingDetail.distributeFlag')" prop="distributeFlag" align="center"  width="150">
                  <template slot-scope="{row}">
                    <span v-if="row.distributeFlag && originalFormData.distributeType !==3">✔</span>
                    <span v-if="originalFormData.distributeType ===3">
                      <el-checkbox v-model="row.distributeFlag" label="" name="checkListFee" :disabled="!row.hasSomeType || row.surplusQuantity ===0" @change="distributeFlagChange(row)" />
                    </span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('boatBookingDetail.distributeQuantity')" prop="distributeQuantity" align="center" width="150">
                  <template slot-scope="{row,$index}">
                    <span v-if="originalFormData.distributeType !==3 || (!row.distributeFlag && originalFormData.distributeType !==2 )">{{row.distributeQuantity}}</span>
                    <el-form-item v-else label="" :prop="'containerPickDistributeList.' + $index + '.distributeQuantity'" :rules="[{required:true,message:''}]" label-width="0" >
                      <el-input v-model.number="row.distributeQuantity" v-input-limit="[9,0]" size="mini"  type="text" :placeholder="$t('common.placeholder')"></el-input>
                    </el-form-item>
                  </template>

                </el-table-column>
              </el-table>
              <div v-if="!containerGrid.data.isSocFlag" style="color: red; font-size: 12px; padding-left: 120px">
                <p v-show="originalFormData.distributeType !==3 && !distributeList.containerNotRelease">{{$t('boatBookingDetail.containerNotReleaseTips')}}</p>
                <p v-show="distributeList.containerNotEnough">{{ distributeList.containerNotEnough }}</p>
                <p v-show="distributeList.containerNotRelease">{{ distributeList.containerNotRelease }}</p>
              </div>
              <!--     编辑页面无 驳回理由 操作         -->
              <el-form-item>
                <el-checkbox v-model="formOtherInfo.passAutoSendConfirmLetter">{{$t('boatBookingDetail.passAutoSendConfirmLetter')}}</el-checkbox>
              </el-form-item>
              <el-form-item :label="$t('common.reasonOfRejected')" style="" :error="check.tip.reject">
                <el-input
                  v-model="originalFormData.rejectReason"
                  size="mini"
                  @input="checkRejectReason"
                />
              </el-form-item>


            </el-form>
          </div>
        </div>


        <div class="flex-right page-footer">
          <el-button size="mini" type="primary" @click="backList">{{$t('common.backList')}}</el-button>
          <el-button v-if="isEdit" size="mini" type="primary" @click="saveBooking4Manager">{{$t('common.saveBtn')}}</el-button>
          <template v-else>
            <el-button size="mini" type="danger" @click="toRejectBooking">{{$t('boatBookingDetail.rejectBtn')}}</el-button>
            <el-button size="mini" type="primary" @click="toAuditBooking">{{$t('boatBookingDetail.verified')}}</el-button>
          </template>
        </div>

      </el-scrollbar>

    </div>

  </div>
</template>

<script>
import shipImg from '@/assets/ship.png'
import { commonReg, validEmail } from '@/utils/validate'
import lodash from 'lodash'
// 运营端api
import {
  getContactList,
  saveContainer,
  updateContainer,
  getSupportSizeType,
  delContainer,
  getContactDetail,
  getBookingDetail, saveUpdateBooking,
  auditBooking, rejectBooking, distributeApi
} from '@/api/charteredBoat/booking4Manager'

// 运营端要显示
import suitcase from './suitcase'

export default {
  name: 'BookingDetail',
  components: { suitcase },
  props: {
    loading: { type: Boolean, default: false },
    terminal: { type: String, default: 'manager' }, // user客户端 or manager运营端
    source: { // 操作状态，(copy,edit,add) 可通过是否有id区分，audit 审核
      type: String,
      default: ''
    },
    orderId: {
      type: [String, Number]
    }
  },

  data() {
    return {
      tempSoNo: null,
      originalFormData: { // 原始表单
        id: 0,
        rejectReason: '',
        memberId: '',
        containerSizeTypeQty: '', // 箱型箱量描述
        shipperId: 0, consigneeId: 0, notifyId: 0,
        vesselDetailDTO: null,
        useContainers: null, // 订舱箱列表
        distributeContainers: [], // 提箱点列表
        status: 0,
        optUrl: '',
        remark: '',
        shipper: null,
        notify: null,
        casNo: '',
        confirmEmail: '',
        consignee: null,
        createBy: 0,
        createByName: '',
        createTime: 0,
        goodsDesc: '',
        goodsType: 1,
        deliveryMode: null,
        distributeType: 1 // 配箱策略
      },
      shipImg,
      suitcase: { // 提箱点
        list: null,
        render: false, // 渲染
        mode: 'form',
        polCode: '',
        sailingId: '',
        containerSizeTypeQty: ''
      },
      check: {
        tip: {
          email: '',
          reject: '',
          so: {
            num: ''
          }
        }

      },
      shippingGrid: { // 船期表
        graphData: [], // 图数据
        data: []
      },
      cargoGrid: {
        data: []
      },
      containerGrid: { // 集装箱信息
        supportSizeType: [],
        optRowPreSnapshot: null, // 操作行快照数据，用于回退
        rowTemplate: { // 行模板
          containerSizeType: '',
          createBy: 0,
          createByName: '',
          createTime: 0,
          doneCount: 0,
          grossWeight: 0,
          id: 0,
          optUrl: '',
          confirmEmail: '',
          orderId: 0,
          qty: 1,
          oldQty: 1,
          socFlag: false,
          tenantId: 0,
          unCount: 0,
          updateBy: 0,
          updateByName: '',
          updateTime: 0
        },
        data: []
      },
      contactList: {
        data: [],
        shipper: {
          data: []
        },
        consignee: {
          data: []
        },
        notify: {
          data: []
        }
      }, // 联系人列表 scnType,
      formOtherInfo: {
        passAutoSendConfirmLetter: true,
        shipper: {
          id: 0,
          scnType: '',
          contact: '',
          street: '',
          city: '',
          county: '',
          province: '',
          country: '',
          postCode: '',
          lastName: '',
          firstName: '',
          contactPhone: '',
          contactPhone1: '',
          contactPhone2: '',
          contactPhone3: ''
        },
        consignee: {
          id: 0,
          scnType: '',
          contact: '',
          street: '',
          city: '',
          county: '',
          province: '',
          country: '',
          postCode: '',
          lastName: '',
          firstName: '',
          contactPhone: '',
          contactPhone1: '',
          contactPhone2: '',
          contactPhone3: ''
        },
        notify: {
          id: 0,
          scnType: '',
          contact: '',
          street: '',
          city: '',
          county: '',
          province: '',
          country: '',
          postCode: '',
          lastName: '',
          firstName: '',
          contactPhone: '',
          contactPhone1: '',
          contactPhone2: '',
          contactPhone3: ''
        }

      }, // 记录表单其他信息
      distributeList: {
        containerPickDistributeList: []
      }, // 提箱点分配数据
      fileGrid: { // 文件上传
        data: [{
        }]
      }
    }
  },
  computed: {
    allowModify() {
      return this.isEdit || this.isAdd || this.isCopy
    },
    isEdit() {
      return this.source === 'edit'
    },
    isCopy() {
      return this.source === 'copy'
    },
    isAdd() {
      return this.source === 'add'
    },
    isAudit() { // 运营端审核
      return this.source === 'audit' // (审核状态肯定是编辑了)
    },
    isManagerTerminal() {
      return this.terminal === 'manager'
    }

  },
  watch: {
    'formOtherInfo.shipper.contactPhone1'(val) {
      this.toComputeContactPhone('shipper')
    },
    'formOtherInfo.shipper.contactPhone2'(val) {
      this.toComputeContactPhone('shipper')
    },
    'formOtherInfo.shipper.contactPhone3'(val) {
      this.toComputeContactPhone('shipper')
    },
    'formOtherInfo.consignee.contactPhone1'(val) {
      this.toComputeContactPhone('consignee')
    },
    'formOtherInfo.consignee.contactPhone2'(val) {
      this.toComputeContactPhone('consignee')
    },
    'formOtherInfo.consignee.contactPhone3'(val) {
      this.toComputeContactPhone('consignee')
    },
    'formOtherInfo.notify.contactPhone1'(val) {
      this.toComputeContactPhone('notify')
    },
    'formOtherInfo.notify.contactPhone2'(val) {
      this.toComputeContactPhone('notify')
    },
    'formOtherInfo.notify.contactPhone3'(val) {
      this.toComputeContactPhone('notify')
    }
  },
  async created() {
    this.$emit('update:loading', true)
    await this.initFormData()
    this.$emit('update:loading', false)
  },
  methods: {
    yardArrChange(val) {
      this.originalFormData.yardCode = val.yardCode
      this.originalFormData.yardName = val.yardName
    },
    fileView(fileObj) {
      const link = document.createElement('a')
      link.download = fileObj.fileName
      link.target = "_blank"
      link.href = fileObj.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    distributeFlagChange(row) {
      if (row.distributeFlag) {
        // let qty = row.qty
        let surplusQty = row.qty
        this.distributeList.containerPickDistributeList.map(item => {
          // 相同箱型 订舱数量减去已分配数量
          if (item.containerType === row.containerType && item.id !== row.id && item.distributeFlag) {
            surplusQty -= Number(item.distributeQuantity) || 0
          }
        })
        //  surplusQuantity 剩余 箱型的订舱数 > 当前提箱点的剩余箱量，将当前提箱点的剩余箱量
        if (surplusQty > row.surplusQuantity) {
          row.distributeQuantity = row.surplusQuantity
        } else {
          // 箱型的订舱数 < 当前提箱点的剩余箱量,，将当前SO中对应的箱型的订舱数
          row.distributeQuantity = surplusQty < 0 ? 0 : surplusQty
        }
      } else {
        row.distributeQuantity = 0
      }
    },
    suitcaseNumCheckFail() {
      this.$message.error(this.$t('boatBookingDetail.suitcaseNumCheckFail'))
    },
    toComputeContactPhone(type) {
      this.formOtherInfo[type].contactPhone = `${this.formOtherInfo[type].contactPhone1}-${this.formOtherInfo[type].contactPhone2}-${this.formOtherInfo[type].contactPhone3}`
    },
    initPhone4SFT(type) {
      const phones = this.originalFormData[type].contactPhone.split('-')
      this.originalFormData[type].contactPhone1 = phones[0] || ''
      this.originalFormData[type].contactPhone2 = phones[1] || ''
      this.originalFormData[type].contactPhone3 = phones[2] || ''
    },
    async initSFT() { // 初始化收发通信息
      const { shipperId, consigneeId, notifyId } = { ...this.originalFormData }
      const ps = []
      if (shipperId) {
        const shipperP = getContactDetail(shipperId).then(res => {
          if (res.ok) {
            this.originalFormData.shipper = res.content || { ...this.formOtherInfo.shipper }
            this.initPhone4SFT('shipper')
          }
        })
        ps.push(shipperP)
      }
      if (consigneeId) {
        const consigneeP = getContactDetail(consigneeId).then(res => {
          if (res.ok) {
            this.originalFormData.consignee = res.content || { ...this.formOtherInfo.consignee }
            this.initPhone4SFT('consignee')
          }
        })
        ps.push(consigneeP)
      }
      if (notifyId) {
        const notifyP = getContactDetail(notifyId).then(res => {
          if (res.ok) {
            this.originalFormData.notify = res.content || { ...this.formOtherInfo.notify }
            this.initPhone4SFT('notify')
          }
        })
        ps.push(notifyP)
      }
      await Promise.all(ps)
    },
    async initDistribute() {
      const {id, distributeType} = {...this.originalFormData}
      this.showLoading()
      const res = await distributeApi({id, distributeType})
      if (res.ok) {
        res.content.containerPickDistributeList.map(item => {
          let hasSomeType = this.containerGrid.data.map(val => {
            if (val.containerSizeType === item.containerType) {
              item.hasSomeType = true
              item.qty = val.qty
            }
          })
        })
        this.distributeList = res.content
      }
      this.$nextTick(() => {
        this.clearLoading()
      })
    },
    /**
     * 设置船期信息
     */
    setShipmentInfo(dataList) {
      this.shippingGrid.data = dataList
      const graphData = []
      // 直达无中转港
      if (dataList.length === 2) {
        const vesselInfo = dataList[1]
        if (vesselInfo) {
          graphData.push({ name: vesselInfo.enPolName, img: '', date: '' })
          graphData.push({ name: vesselInfo.enPodName, img: '', date: '', end: true })
        }
      }
      // 存在中转港
      if (dataList.length === 3) {
        const startData = dataList[1]
        const startEnd = dataList[2]
        graphData.push({ name: startData.enPolName, img: '', date: '' })
        graphData.push({ name: startData.enPodName, img: '', date: '' })
        graphData.push({ name: startEnd.enPodName, img: '', date: '', end: true })
      }
      this.shippingGrid.graphData = graphData
    },
    async initFormData() {
      if (this.isManagerTerminal || this.isEdit) {
        await getBookingDetail(this.orderId).then(async res => {
          if (res.ok) {
            const dataList = res.content.vesselDetailDTOList || []
            res.content.vesselDetailDTO = dataList[0]
            this.setShipmentInfo(dataList)
            this.fileGrid.data = res.content.comFileEditRequests
            this.originalFormData = { ...res.content, goodsType: 1 } // 货物类型固定写死
            await this.initSFT()
            if (!this.originalFormData.distributeType) {
              this.$set(this.originalFormData, 'distributeType', 1)
            }
            await this.initDistribute()
          }
        })
      }

      // 初始化联系人信息
      await getContactList(this.originalFormData.memberId).then(res => {
        if (res.ok) {
          this.contactList.data = res.content.list
          this.contactList.data.forEach(item => {
            if (item.scnType === 1) {
              this.contactList.consignee.data.push(item)
            } else if (item.scnType === 2) {
              this.contactList.shipper.data.push(item)
            } else if (item.scnType === 3) {
              this.contactList.notify.data.push(item)
            }

          })
        }
      })
      // 船期列表数据
      // podCode, vessel, voyage,
      const { polCode, sailingId } = { ...this.originalFormData.vesselDetailDTO }
      // 初始化箱型列表下拉
      if (polCode && sailingId) {
        getSupportSizeType(polCode, sailingId).then(res => {
          if (res.ok) {
            this.containerGrid.supportSizeType = res.content
          } else {
            this.containerGrid.supportSizeType = []
          }
        })
      }

      // 提箱点列表
      if (this.originalFormData.distributeContainers) {
        this.suitcase.list = this.originalFormData.distributeContainers

        this.suitcase.render = true
      }
      this.suitcase.polCode = polCode
      this.suitcase.sailingId = sailingId
      this.suitcase.containerSizeTypeQty = this.originalFormData.containerSizeTypeQty
      // 收
      if (this.originalFormData.shipper) {
        this.formOtherInfo.shipper = { ...this.originalFormData.shipper }
      }
      // 发
      if (this.originalFormData.consignee) {
        this.formOtherInfo.consignee = { ...this.originalFormData.consignee }
      }
      // 通
      if (this.originalFormData.notify) {
        this.formOtherInfo.notify = { ...this.originalFormData.notify }
      }
      // 订舱箱
      if (this.originalFormData.useContainers) {
        this.containerGrid.data = this.supplementEditPropBeforeSetResponse([...this.originalFormData.useContainers])
        let isSocFlag = this.containerGrid.data.some(val => val.socFlag === true)
        this.containerGrid.data.isSocFlag = isSocFlag || this.isEdit
      }
      // 还箱点
      if (this.originalFormData.returnAddressList) {
        this.$set(this.originalFormData, 'yardArr', this.originalFormData.returnAddressList[0])
        this.originalFormData.yardCode = this.originalFormData.returnAddressList[0].yardCode
        this.originalFormData.yardName = this.originalFormData.returnAddressList[0].yardName
      }
      const { goodsDesc, goodsType, casNo, goodsChineseName } = { ...this.originalFormData }
      // 货物信息
      this.cargoGrid.data = [{ goodsDesc, goodsType, casNo, goodsChineseName }]
      // this.$nextTick(() => {
      //   this.$refs.suitcaseGridRef.onContainerChange()
      // })
    },
    supplementEditPropBeforeSetResponse(sourceList) { // 补充编辑isEdit属性(在设置双向绑定前)
      return sourceList.map(item => {
        item.oldQty = item.qty // 备份 qty，方便在验证数量输入时使用，要和原始值 比较用
        if (item.isEdit === undefined) {
          return { ...item, isEdit: false }
        } else {
          return item
        }
      })
    },
    checkStreet(rule, val, callback, source) { // 街道
      if (!val.trim()) {
        if (source === 'shipper') {
          callback(new Error(this.$t('boatBookingDetail.addressEmptyInvalid')))
        } else {
          callback()
        }
      } else if (!commonReg.english.test(val)) {
        callback(new Error(this.$t('boatBookingDetail.inputNumberInterpunctionInvalid')))
      } else {
        callback()
      }
    },
    checkCity(rule, val, callback, source) {
      if (!val.trim()) {
        if (source === 'shipper') {
          callback(new Error(this.$t('boatBookingDetail.cityRequireInvalid')))
        } else {
          callback()
        }
      } else if (!commonReg.englishAndNumberArea.test(val)) {
        callback(new Error(this.$t('boatBookingDetail.inputFormatInvalid')))
      } else {
        callback()
      }
    },
    checkContact(rule, val, callback, source) {
      if (val.trim() && !commonReg.english.test(val)) {
        callback(new Error(this.$t('boatBookingDetail.inputNumberInterpunctionInvalid')))
      } else {
        callback()
      }
    },
    checkNumber(rule, val, callback, source) {
      if (!commonReg.isNumber.test(val + '') || Number(val) <= 0) {
        callback(new Error(this.$t('boatBookingDetail.inputZeroError')))
      } else {
        callback()
      }
    },
    checkContainerQty(rule, val, callback, rowData) {
      // 审核时，数量可减少，编辑状态下，只能增加不能减少
      if (this.isEdit) {
        if (rowData.qty < rowData.oldQty) {
          this.$message.error(this.$t('boatBookingDetail.containerQtyInvalid'))
          callback(new Error(this.$t('boatBookingDetail.containerQtyInvalid')))
          return
        }
      }
      if (!commonReg.isNumber.test(val + '') || val < 1 || val > 200) {
        this.$message.error(this.$t('boatBookingDetail.limitOneToTowHundred'))
        callback(new Error(this.$t('boatBookingDetail.limitOneToTowHundred')))
      } else if (val < rowData.doneCount) {
        callback(new Error(this.$t('boatBookingDetail.inputQtyLessInvalid')))
      } else {
        callback()
      }
    },
    checkTel(rule, val, callback, source) {
      if (val.trim()) {
        let pass = true
        val.trim().split('-').forEach(item => {
          if (item && !commonReg.pureNumberAndBlank.test(item)) {
            pass = false
          }
        })
        if (pass) {
          callback()
        } else {
          callback(new Error(this.$t('boatBookingDetail.inputNumberWithSpace')))
        }
      } else {
        callback()
      }
    },
    onChangeCompanyName(val, source) {
      const findOne = this.contactList[source].data.find(item => item.contact === val)
      if (findOne && findOne.id) { // 后台数据中查到的
        const phones = findOne.contactPhone.split('-')
        this.formOtherInfo[source] = {
          ...findOne,
          contactPhone1: phones[0] || '',
          contactPhone2: phones[1] || '',
          contactPhone3: phones[2] || ''
        }
        // this.initPhone4SFT(source)
      } else {
        this.formOtherInfo[source].id = 0
      }
    },
    querySearch(key, cb) {
      const arr = this.contactList.shipper.data
      cb(arr)
    },
    querySearch1(key, cb) {
      const arr = this.contactList.consignee.data
      cb(arr)
    },
    querySearch2(key, cb) {
      const arr = this.contactList.notify.data
      cb(arr)
    },
    querySearchChange(val, key) {
      this.formOtherInfo[key].contact = val.contact
      this.onChangeCompanyName(val.contact, key)
    },
    checkCompanyName(rule, val, callback, source) {
      // 联系人的校验
      if (!val.trim()) {
        if (source === 'shipper') {
          callback(new Error(this.$t('boatBookingDetail.requireCompanyNameInvalid')))
        } else {
          callback()
        }
      } else if (!commonReg.english.test(val)) {
        callback(new Error(this.$t('boatBookingDetail.inputNumberInterpunctionInvalid')))
      } else if (val.length > 70) {
        callback(new Error(this.$t('boatBookingDetail.companyLimit70')))
      } else {
        callback()
      }
    },
    checkRejectReason(val) {
      if (val) {
        this.check.tip.reject = ''
      }
    },
    addContainer() {
      if (!this.haveContainerRowEdit()) {
        // 添加集装箱row
        this.containerGrid.data.push({ ...this.containerGrid.rowTemplate, isEdit: true })
      }
    },
    async delContainerRow(row) {
      if (this.containerGrid.data.length === 1) {
        this.$message.warning(this.$t('boatBookingDetail.removeLessThanOne'))
        return
      }
      // 提示后，删除
      // 提示后直接删除
      let needDel = true
      if (row.id) { // 编辑状态下，的已入库数据
        // 提示后，删除
        await delContainer(this.originalFormData.id, row.id).then(res => {
          if (!res.ok) {
            needDel = false
          }
        }).catch(() => {
          needDel = false
        })
      }
      if (needDel) {
        const index = this.containerGrid.data.indexOf(row)
        this.containerGrid.data.splice(index, 1)
      } else {
        this.$message.error(this.$t('boatBookingDetail.removeFailded'))
      }
    },
    haveContainerRowEdit() {
    // 先检查有没处于编辑的行
      const editingRows = this.containerGrid.data.find(item => {
        if (item.isEdit) {
          return true
        }
      })
      if (editingRows) {
        this.$message.warning(this.$t('boatBookingDetail.saveFirst'))
        return [editingRows]
      } else {
        return false
      }
    },
    editContainerRow(row) {
    // 先检查有没处于编辑的行
      if (!this.haveContainerRowEdit()) {
        this.$set(row, 'isEdit', true)
        this.containerGrid.optRowPreSnapshot = lodash.cloneDeep(row)
      }
    },
    async cancelContainerRow(row) {
      if (!this.containerGrid.optRowPreSnapshot) {
      // 说明是第一次新增的，直接删除
        await this.delContainerRow(row)
      } else {
      // 新增的数据大于一次的编辑or旧数据
        const currentIndex = this.containerGrid.data.indexOf(row)
        this.containerGrid.optRowPreSnapshot.isEdit = false
        this.containerGrid.data.splice(currentIndex, 1, this.containerGrid.optRowPreSnapshot)
        console.log('置空，回到初始状态')
        // 置空，回到初始状态
        this.containerGrid.optRowPreSnapshot = null
      }
    },
    confirmContainerRow(row) {
    // 1、进行校验
      const errorTips = {
        containerSizeType: { tip: this.$t('boatBookingDetail.requireContainerTypeInvalid') },
        qty: { tip: this.$t('boatBookingDetail.limitOneToTowHundredInvalid') },
        grossWeight: { tip: this.$t('boatBookingDetail.inputNumberInvalid') }
      }
      this.$refs.containerGridForm.validate((pass, failFields) => {
        if (pass) {
        // 判断是否存在类型相同的数据
          const currentIndex = this.containerGrid.data.indexOf(row)
          const hasSameData = this.containerGrid.data.find((item, index) => index !== currentIndex && item.containerSizeType === row.containerSizeType && item.socFlag === row.socFlag)
          if (this.$isNotEmpty(hasSameData)) {
            this.$alert(this.$t('boatBookingDetail.ownerSameTypeInvalid'), {
              confirmButtonText: this.$t('common.confirmBtn'),
              type: 'error'
            })
            return
          }
          const updateOrSave = row.id ? updateContainer : saveContainer
          updateOrSave(this.originalFormData.id, row).then(res => {
            if (res.ok) {
            // todo 对于新增的记录，设置回显id
              if (this.$isNotEmpty(res.content)) {
                this.$set(row, 'id', res.content.id)
              }
              this.$set(row, 'oldQty', row.qty)
              this.$set(row, 'isEdit', false)
              // 更新成功后，需要计算集装箱的数量，动态添加 提箱点的记录
              // this.$refs.suitcaseGridRef.onContainerChange()
            } else {
              this.$message.error(this.$t('boatBookingDetail.containerTypeSaveFailed'))
            }
          })
        } else {
          let errors = ''
          Object.keys(failFields).forEach(eK => {
            const fieldName = eK.split('.').pop()
            errors += ' ' + errorTips[fieldName].tip
          })
          this.$message.error(this.$t('boatBookingDetail.containerTypeInvalid') + errors)
        }
      })
    },
    checkEmail(rule, value, callback) {
      const errorEmails = []
      if (value) {
        if (value.length > 255) {
          callback(new Error(this.$t('boatBookingDetail.confirmEmailPlaceholder')))
        } else {
        // 校验格式
          const emails = value.split(';')
          emails.forEach(e => {
            if (e && !validEmail(e)) {
              errorEmails.push(e)
            }
          })
        }
      }
      if (errorEmails.length) {
        callback(new Error(`${errorEmails.join(';')}${this.$t('boatBookingDetail.addressInfoInvalid')}`))
      } else {
        callback()
      }
    },
    checkCargoDesc(rule, value, callback) {
      if (!commonReg.english.test(value)) {
        callback(new Error())
      } else {
        callback()
      }
    },
    checkCas(rule, value, callback) {
      // 化工品必填，非化工品选填
      if (value && commonReg.chineseRepace.test(value)) {
        callback(new Error(this.$t('boatBookingDetail.casNoInvalid')))
      } else {
        callback()
      }
    },
    assembleAuditOrRejectData() { // 审核 驳回时 组装数据
      const { goodsDesc, deliveryMode, rejectReason, confirmEmail, distributeType, yardCode, yardName, goodsChineseName } = this.originalFormData
      const data =
        {
          goodsDesc, deliveryMode, rejectReason, confirmEmail, distributeType, yardCode, yardName, goodsChineseName,
          passAutoSendConfirmLetter: this.formOtherInfo.passAutoSendConfirmLetter,
          distributeContainers: this.suitcase.list,
          distributeList: this.distributeList.containerPickDistributeList
        }
      return data
    },
    assembleRequestData() { // 组装请求的数据
    // 收发通和货物数据
      const cargoInfo = this.cargoGrid.data[0]
      const { casNo, goodsDesc, goodsType } = cargoInfo
      const { id, remark } = this.originalFormData
      const requestData = {
        id, remark,
        ...this.assembleAuditOrRejectData(),
        casNo, goodsDesc, goodsType,
        vesselDetailDTO: this.shippingGrid.data[0],
        vesselDetailDTOList: this.shippingGrid.data,
        useContainers: this.containerGrid.data, // 订舱箱列表
        shipper: { ...this.formOtherInfo.shipper, scnType: 2 },
        notify: { ...this.formOtherInfo.notify, scnType: 3 },
        consignee: { ...this.formOtherInfo.consignee, scnType: 1 }
      }
      return requestData
    },
    checkSuitcase() {
      let checkFailInfo = ''
      let willFocusElem = ''
      let pass = true
      // 运营端编辑 不校验提箱点
      // if (this.isManagerTerminal) {
      //   if (this.$refs.suitcaseGridRef.checkForm()) {
      //     console.info('提箱校验成功')
      //   } else {
      //     console.error('提箱校验失败')
      //     checkFailInfo = '提箱校验失败'
      //     willFocusElem = willFocusElem || this.$refs.suitcaseGridRef.$el
      //     pass = false
      //   }
      // }
      return { checkFailInfo, willFocusElem, pass }
    },
    checkBookingData() {
    // 提交前，校验订舱数据 // 校验提交表单
      let pass = true
      let willFocusElem = null // 待聚焦校验的元素
      let checkFailInfo = null
      // 校验必填项（收发通、货物信息、集装箱），并定位到 对应错误信息模块
      // 收货人
      this.$refs.shipperForm.validate((valid, failFields) => {
        if (valid) {
          console.info('收货人校验成功')
        } else {
          console.error('收货人校验失败')
          checkFailInfo = checkFailInfo || this.$t('boatBookingDetail.consigneeInvalid')
          willFocusElem = willFocusElem || this.$refs.shipperForm.$el
          pass = false
        }
      })
      if (pass) {
        // 发、
        this.$refs.consigneeForm.validate((valid, failFields) => {
          if (valid) {
            console.info('fa货人校验成功')
          } else {
            console.error('发货人校验失败')
            checkFailInfo = checkFailInfo || this.$t('boatBookingDetail.consignerInvalid')
            willFocusElem = willFocusElem || this.$refs.consigneeForm.$el
            pass = false
          }
        })
      }
      if (pass) {
        // 通
        this.$refs.notifyForm.validate((valid, failFields) => {
          if (valid) {
            console.info('通知人校验成功')
          } else {
            console.error('通知人校验失败')
            checkFailInfo = checkFailInfo || this.$t('boatBookingDetail.notifierInvalid')
            willFocusElem = willFocusElem || this.$refs.notifyForm.$el
            pass = false
          }
        })
      }
      if (pass) {
        // 货物
        this.$refs.cargoGridForm.validate((valid, failFields) => {
          if (valid) {
            console.info('货物信息校验成功')
          } else {
            const errorTips = {
              goodsDesc: { tip: this.$t('boatBookingDetail.goodsInfoFormatInvalid') },
              casNo: { tip: this.$t('boatBookingDetail.casNoInvalid') },
              chineseNamePlaceholder: { tip: this.$t('boatBookingDetail.chineseNamePlaceholder') }
            }
            checkFailInfo = checkFailInfo || ''
            Object.keys(failFields).forEach(eK => {
              const fieldName = eK.split('.').pop()
              checkFailInfo += errorTips[fieldName].tip
            })
            checkFailInfo = checkFailInfo || this.$t('boatBookingDetail.goodsInfoInvalid')
            willFocusElem = willFocusElem || this.$refs.cargoGridForm.$el
            pass = false
          }
        })
      }

      if (pass) {
        // 集装箱(校验是否有编辑状态-)
        const editingRows = this.haveContainerRowEdit()
        if (editingRows) {
          // 提醒有编辑行 引导用户操作
          // do nothings.
          console.error('集装箱信息校验失败')
          checkFailInfo = checkFailInfo || this.$t('boatBookingDetail.containerInfoInvalid')
          willFocusElem = willFocusElem || this.$refs.containerGridForm.$el
          pass = false
        }
      }
      if (pass) {
        const checkSuitcaseResultObj = this.checkSuitcase()
        willFocusElem = willFocusElem || checkSuitcaseResultObj.willFocusElem
        checkFailInfo = checkFailInfo || checkSuitcaseResultObj.checkFailInfo
        pass = checkSuitcaseResultObj.pass
        // 邮箱
        this.$refs.remarkEg.validate((valid, failFields) => {
          if (!valid) {
            willFocusElem = willFocusElem || this.$refs.remarkEg.$el
            pass = false
          }
        })
      }
      if (willFocusElem) {
        willFocusElem.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (this.$isNotEmpty(checkFailInfo)) {
          this.$message.error(checkFailInfo)
        }
      }
      return pass
    },
    toRejectBooking() {
    // 驳回 需校验 驳回理由
      if (!this.originalFormData.rejectReason) {
        this.check.tip.reject = this.$t('boatBookingDetail.requiredRejectReason')
      } else {
        const requestData = this.assembleAuditOrRejectData()
        rejectBooking(requestData, this.orderId).then(res => {
          if (res.ok) {
            this.$emit('backList')
          } else {
            this.$message.error(this.$t('boatBookingDetail.rejectFailed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('boatBookingDetail.rejectFailed'))
        })
        this.check.tip.reject = ''
      }
    },
    showLoading() {
      this.$emit('update:loading', true)
    },
    clearLoading() {
      this.$emit('update:loading', false)
    },
    backList() {
      // if (this.checkBookingData()) {
      this.$emit('backList')
      // }
    },
    saveBooking4Manager() { // 运营端的编辑保存
      if (this.checkBookingData()) {
        this.showLoading()
        // 组装请求数据
        const requestData = this.assembleRequestData()
        requestData.deliveryMode = this.originalFormData.deliveryMode
        saveUpdateBooking(requestData, requestData.id).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('boatBookingDetail.submitSuccessAndSendEmail'))
            this.$emit('backList')
          } else {
            this.$message.error(this.$t('boatBookingDetail.saveFailed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('boatBookingDetail.saveFailed'))
        }).finally(() => {
          this.clearLoading()
        })
      }
    },
    async toAuditBooking() {
      const checkSuitcaseResultObj = this.checkSuitcase()
      if (!checkSuitcaseResultObj.pass) {
        this.$message.error(checkSuitcaseResultObj.checkFailInfo)
        return false
      }
      if (this.distributeList.containerNotEnough || this.distributeList.containerNotRelease) {
        this.$message.error(this.distributeList.containerNotEnough || this.distributeList.containerNotRelease)
        return false
      }
      // 审核时，需校验so
      this.showLoading()
      this.clearLoading()
      if (this.originalFormData.distributeType === 3) {
        let isError
        this.$refs.managerConfirmForm.validate((valid, failFields) => {
          if (!valid) {
            isError = true
            return
          }
        })
        if (isError) {
          return
        }
        let containerTypeArr = {}
        this.distributeList.containerPickDistributeList.map(item => {
          if (!containerTypeArr[item.containerType]) {
            containerTypeArr[item.containerType] = 0
          }
          containerTypeArr[item.containerType] += Number(item.distributeQuantity) || 0
        })
        for (let i in containerTypeArr) {
          this.distributeList.containerPickDistributeList.map(item => {
            if (item.qty && item.qty !== containerTypeArr[i] && i === item.containerType) {
              isError = true
              return
            }
          })
        }
        const requestData = this.assembleAuditOrRejectData()
        if (isError) {
          this.$message.warning(this.$t('boatBookingDetail.allotQuantityDifferent'))
          return
        }
      }

      this.$refs.remarkEg.validate((valid, failFields) => {
        if (!valid) {
          return
        }
        this.showLoading()
        const requestData = this.assembleAuditOrRejectData()
        auditBooking(requestData, this.orderId).then(res => {
          if (res.ok) {
            this.$emit('backList')
          }
        }).finally(() => {
          this.clearLoading()
        })
      })
    }
  }
}
</script>
<style lang="scss">
.booking-detail {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-scrollbar__view{ margin-bottom: 50px;    position: relative;}

  .el-collapse {
    border-top: 0px;
  }

  .label-text {
    width: 150px;
    margin-bottom: 22px;
  }

  .el-collapse-item__header {
    border-bottom: 0px;
    border-top: 0px;
  }

  .muti-form-item {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
    }
  }

  .el-grid-row-no-error-msg {
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.booking-detail {
  overflow-y: auto;
  overflow-x: hidden;

  .detail-chunk {
    margin: 5px;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    padding: 30px;

    span {
      font-size: 12px;
    }

    .chunk-header {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;

      .chunk-header-left {
        width: 200px;
        font-size: 18px;
      }
    }

    .arrow-link:after {
      content: '';
      display: block;
      width: 180px;
      margin-top: 8px;
      margin-right: -9.9px;
      border-bottom: 1px solid black;
    }
  }

}

.page-footer {
  height: 50px;
  width: 100%;
  //background: #fff;
  position: fixed;
  left: 10px;
  right: 0;
  bottom: 0px;
  padding-right: 30px;
}
.managerConfirmForm {
  ::v-deep.el-table::before{ background: none}
}
.dataTable ::v-deep{
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
