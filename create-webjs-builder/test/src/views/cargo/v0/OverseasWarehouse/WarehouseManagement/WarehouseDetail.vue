<template>
	<div class="page-edit-container full-page">
    <div class="page-edit-content">
      <el-form
        ref="formData"
        v-loading="loading"
        :model="formData"
        label-width="120px"
        :rules="rules"
      >
        <div class="pd-16 content-title">
          {{$t('warehouse.base_info')}}
          <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('baseInfo')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('baseInfo')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('baseInfo')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('baseInfo')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('baseInfo')" class="fc-red fs-12 ml-10 pointer" @click="cancel('baseInfo')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.product_category')" prop="productCategory">
              <el-input size="mini" readonly v-model="formData.productCategoryName" :disabled="isDisabled('baseInfo')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.warehouseType')" prop="warehouseType">
              <el-select v-model="formData.warehouseType" :disabled="$isNotEmpty(formData.id)" class="w-full" size="mini" :placeholder="$t('warehouse.please_warehouse_type')" >
                <el-option :label="$t('warehouse.underBond')" :value="10" />
                <el-option :label="$t('warehouse.nonBonded')" :value="11" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.warehouse_name')" prop="name">
              <el-input
                v-model="formData.name"
                :disabled="isDisabled('baseInfo')"
                :placeholder="$t('warehouse.please_enter_warehouse_name')"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.warehouse_code')" prop="warehouseCode">
              <el-input
                v-model.trim="formData.warehouseCode"
                :disabled="isDisabled('baseInfo')"
                :placeholder="$t('warehouse.please_input_warehouse_code')"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.supplier')" prop="supplierId">
              <type-select v-model="formData.supplierId" type="supplier" :defaultDisplay="formData.supplierName"  :disabled="isDisabled('baseInfo')" :requestParams="{businessType: 'OVERSEAS_WAREHOUSE'}"></type-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.areas')" style="height: 37px" prop="areas">
              <el-cascader
                v-model="formData.areas"
                :options="areasOptions"
                :disabled="isDisabled('baseInfo')"
                class="w-full"
                :props="provinProps"
                size="mini"
                @change="areasOptionsChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.city')" prop="city">
              <el-input
                v-model="formData.city"
                size="mini"
                :disabled="isDisabled('baseInfo')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('warehouse.detail_address')"
              style="height: 37px"
              prop="detailAddress"
            >
              <el-input
                v-model="formData.detailAddress"
                maxlength="100"
                :disabled="isDisabled('baseInfo')"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('warehouse.zip_code')"
              prop="zipcode"
            >
              <el-input
                v-model="formData.zipcode"
                :disabled="isDisabled('baseInfo')"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="flex-box">
              <el-form-item
                :label="$t('warehouse.warehouse_phone_area_no')"
                prop="warehousePhoneAreaNo"
                class="w-240"
              >
                <el-input
                  v-model="formData.warehousePhoneAreaNo"
                  :disabled="isDisabled('baseInfo')"
                  size="mini"
                />
              </el-form-item>
              <el-form-item label="" label-width="0px" class="w-20">
                <div class="w-20 text-center">-</div>
              </el-form-item>
              <el-form-item
                label=""
                label-width="0px"
                prop="warehousePhone"
                class="flex-grow"
              >
                <el-input
                  v-model="formData.warehousePhone"
                  :disabled="isDisabled('baseInfo')"
                  size="mini"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('warehouse.zone')" prop="zone">
              <el-select
                v-model="formData.zone"
                :disabled="isDisabled('baseInfo')"
                filterable
                class="w-full"
                size="mini"
                :placeholder="$t('warehouse.please_select_zone')"
              >
                <el-option
                  v-for="item in constant.timeZones"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="flex-box">
              <el-form-item :label="$t('warehouse.work_time')" prop="startWorkTime">
                <el-time-picker
                  v-model="formData.startWorkTime"
                  value-format="timestamp"
                  :placeholder="$t('warehouse.start_work_time')"
                  size="mini"
                  class="w-110"
                  :disabled="isDisabled('baseInfo')"
                />
              </el-form-item>
              <el-form-item
                label=""
                label-width="0px"
                class="ml-6"
                prop="endWorkTime"
              >
                <el-time-picker
                  v-model="formData.endWorkTime"
                  value-format="timestamp"
                  :placeholder="$t('warehouse.end_work_time')"
                  size="mini"
                  class="w-110"
                  :disabled="isDisabled('baseInfo')"
                />
              </el-form-item>
              <el-form-item
                :label="$t('warehouse.cut_time')"
                label-width="81px"
                class="ml-6"
                prop="cutTime"
              >
                <el-time-picker
                  v-model="formData.cutTime"
                  value-format="timestamp"
                  :placeholder="$t('warehouse.please_select_cut_time')"
                  size="mini"
                  class="w-150"
                  :disabled="isDisabled('baseInfo')"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="flex">
              <el-form-item :label="$t('warehouse.allow_snap_shoot')" prop="allowSnapshoot">
                <el-radio-group
                  v-model="formData.allowSnapshoot"
                  :disabled="isDisabled('baseInfo')"
                  class="w-200"
                  @change="
                    (val) => {
                      if (!val) {
                        formData.snapshootTime = null;
                      }
                    }
                  "
                >
                  <el-radio :label="true">{{$t('warehouse.YES')}}</el-radio>
                  <el-radio :label="false">{{$t('warehouse.NO')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="formData.allowSnapshoot"
                :label="$t('warehouse.snap_shoot_time')"
                prop="snapshootTime"
              >
                <el-time-picker
                  v-model="formData.snapshootTime"
                  value-format="timestamp"
                  :disabled="isDisabled('baseInfo')"
                  :placeholder="$t('warehouse.please_select_snap_shoot_time')"
                  size="mini"
                  class="w-150"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <TimeSlot :warehouseTimeSlotList="formData.warehouseTimeSlotList" :isDetail="isDisabled('baseInfo')"></TimeSlot>
          </el-col>
        </el-row>
        <div class="pd-16 content-title" v-if="formData.warehouseType === 10">
          {{$t('warehouse.bondedWarehouseInfo')}}
          <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('bondedWarehouseInfo')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('bondedWarehouseInfo')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('bondedWarehouseInfo')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('bondedWarehouseInfo')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('bondedWarehouseInfo')" class="fc-red fs-12 ml-10 pointer" @click="cancel('bondedWarehouseInfo')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <BondedWarehouseInfo :data='formData.bondedWarehouseInfo' :isDetail="isDisabled('bondedWarehouseInfo')" v-if="formData.warehouseType === 10"></BondedWarehouseInfo>
        <div class="pd-16 content-title">
          {{$t('warehouse.contactInfo')}}
          <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('contactInfo')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('contactInfo')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('contactInfo')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('contactInfo')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('contactInfo')" class="fc-red fs-12 ml-10 pointer" @click="cancel('contactInfo')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <contactInfo :data="formData" :isDetail='isDisabled("contactInfo")' />
        <div class="pd-16 content-title">
          {{$t('warehouse.baseConfig')}}
          <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('baseConfig')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('baseConfig')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('baseConfig')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('baseConfig')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('baseConfig')" class="fc-red fs-12 ml-10 pointer" @click="cancel('baseConfig')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('warehouse.docking_ways')+'：'" prop="dockingWays" >
              <el-checkbox-group
                v-model="formData.dockingWays"
                :disabled="isDisabled('baseConfig')"
              >
                <el-checkbox
                  v-for="item in constant.dockingWays"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.dockingWays.includes('1')">
            <el-form-item :label="$t('warehouse.warehouse_code')+'：'" prop="supplierWarehouseCode" >
              <el-input v-model.trim="formData.supplierWarehouseCode" :disabled="isDisabled('baseConfig')" :placeholder="$t('warehouse.please_input_warehouse_code')" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="pd-16 content-title">
          {{$t('warehouse.in_warehouse_config')}}
         <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('putStorage')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('putStorage')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('putStorage')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('putStorage')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('putStorage')" class="fc-red fs-12 ml-10 pointer" @click="cancel('putStorage')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('warehouse.in_warehouse_type')" prop="inWarehouseTypeList">
              <el-checkbox-group
                v-model="formData.inWarehouseTypeList"
                :disabled="isDisabled('putStorage')"
              >
                <el-checkbox
                  v-for="item in constant.receiveTypes"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('warehouse.container_type')" prop="containerTypeList">
              <el-select
                v-model="formData.containerTypeList"
                filterable
                size="mini"
                multiple
                class="w-full"
                :disabled="isDisabled('putStorage')"
              >
                <el-option
                  v-for="opt in containerList"
                  :key="opt.englishName"
                  :label="opt.englishName"
                  :value="opt.englishName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('warehouse.logistics_company')" prop="containerTypeList" v-if="formData.inWarehouseTypeList.includes('4')">
              <SelectFilter v-model="formData.logisticsCompanyArr" multiple :disabled="isDisabled('putStorage')" size="mini" :placeholder="$t('warehouse.channel_desc')"
                name-key="scacCode"
                value-key="id"
                :options="companyList"
                :filter-keys="['shortname', 'chineseName','scacCode','englishName']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('warehouse.receive_goods_type')" prop="receiveGoodsTypeList">
              <el-checkbox-group
                v-model="formData.receiveGoodsTypeList"
                :disabled="isDisabled('putStorage')"
              >
                <el-checkbox
                  v-for="item in constant.goodsTypes"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('warehouse.support_self_send')"
              label-width="120px"
              prop="supportSelfSend"
            >
              <el-radio-group
                v-model="formData.supportSelfSend"
                :disabled="isDisabled('putStorage')"
              >
                <el-radio :label="true">{{$t('warehouse.YES')}}</el-radio>
                <el-radio :label="false">{{$t('warehouse.NO')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('warehouse.allow_get_entry_order')"
              label-width="130px"
              prop="allowGetEntryOrder"
            >
              <el-radio-group
                v-model="formData.allowGetEntryOrder"
                :disabled="isDisabled('putStorage')"
              >
                <el-radio :label="true">{{$t('warehouse.YES')}}</el-radio>
                <el-radio :label="false">{{$t('warehouse.NO')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="pd-16 content-title">
          {{$t('warehouse.warehouse_inner_config')}}
          <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('configuration')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('configuration')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('configuration')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('configuration')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('configuration')" class="fc-red fs-12 ml-10 pointer" @click="cancel('configuration')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('warehouse.support_batch')" prop="supportBatch">
              <el-radio-group
                v-model="formData.supportBatch"
                :disabled="isDisabled('configuration')"
              >
                <el-radio :label="true">{{$t('warehouse.YES')}}</el-radio>
                <el-radio :label="false">{{$t('warehouse.NO')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('warehouse.warehouse_inner_service')">
              <el-checkbox-group
                v-model="formData.warehouseInnerServiceList"
                :disabled="isDisabled('configuration')"
              >
                <el-checkbox
                  v-for="item in constant.libraryServices"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <condition :isDetail="isDisabled('configuration')" :conditionList="formData.conditionList"></condition>
        <div class="pd-16 content-title">
          {{$t('warehouse.out_warehouse_config')}}
          <div v-if="$isNotEmpty(formData.id)">
            <span v-if="!isDetail && isDisabled('outbound')" class="fc-blue fs-12 ml-10 pointer" @click="changeStaus('outbound')">
              {{$t('common.editBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('outbound')" class="fc-blue fs-12 ml-10 pointer" @click="saveItem('outbound')" >
              {{$t('common.saveBtn')}}
            </span>
            <span v-if="!isDetail && !isDisabled('outbound')" class="fc-red fs-12 ml-10 pointer" @click="cancel('outbound')" >
              {{$t('common.cancelBtn')}}
            </span>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('warehouse.out_warehouse_type')" prop="outWarehouseTypeList">
              <el-checkbox-group
                v-model="formData.outWarehouseTypeList"
                :disabled="isDisabled('outbound')"
              >
                <el-checkbox
                  v-for="item in constant.outWarehouseTypes"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('warehouse.chargeType')" prop="chargeType" v-if="formData.outWarehouseTypeList.includes('30')" >
              <el-select v-model="formData.chargeType" :placeholder="$t('warehouse.please_select_charge_type')" size="mini" :disabled="isDisabled('outbound')">
                <el-option :label="$t('warehouse.charge_type_a1')" :value="1"></el-option>
                <el-option :label="$t('warehouse.charge_type_a2')" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('warehouse.allow_out_entry_order')"
              label-width="130px"
              prop="allowOutEntryOrder"
            >
              <el-radio-group
                v-model="formData.allowOutEntryOrder"
                :disabled="isDisabled('outbound')"
              >
                <el-radio :label="true">{{$t('warehouse.YES')}}</el-radio>
                <el-radio :label="false">{{$t('warehouse.NO')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('warehouse.logistics_product')">
              <div class="mt-20">
                <el-table :data="formData.productList">
                  <el-table-column :label="$t('warehouse.logistics_product_code')" prop="productCode" />
                  <el-table-column :label="$t('warehouse.logistics_product_name')" prop="productName" />
                  <el-table-column
                    :label="$t('warehouse.logistics_company_name')"
                    prop="logisticsCompanyName"
                  />
                  <el-table-column :label="$t('warehouse.operation')" width="100" fixed="right">
                    <template slot-scope="{ $index }">
                      <el-button
                        v-if="!isDisabled('outbound')"
                        type="text"
                        size="mini"
                        class="fc-red"
                        @click="del($index, 'productList')"
                      >
                        {{$t('warehouse.delete')}}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="!isDisabled('outbound')"
                  class="addItem flex-center"
                  @click="dialog.visible = true"
                >
                  <span class="el-icon-plus" />	{{$t('warehouse.increase')}}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('warehouse.delivery_channel')">
              <div class="mt-20">
                <el-table :data="formData.deliveryChannelList">
                  <el-table-column :label="$t('warehouse.channel_code')" prop="channelCode" />
                  <el-table-column :label="$t('warehouse.channel_name')" prop="channelName" />
                  <el-table-column :label="$t('warehouse.product_name')" prop="productName" />
                  <el-table-column :label="$t('warehouse.supplier_name')" prop="supplierName" />
                  <el-table-column :label="$t('warehouse.operation')" width="100" fixed="right">
                    <template slot-scope="{ $index }">
                      <el-button
                        v-if="!isDisabled('outbound')"
                        type="text"
                        size="mini"
                        class="fc-red"
                        @click="del($index, 'deliveryChannelList')"
                      >
                        {{$t('warehouse.delete')}}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="!isDisabled('outbound')"
                  class="addItem flex-center"
                  @click="dialogVisible = true"
                >
                  <span class="el-icon-plus" /> {{$t('warehouse.increase')}}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('warehouse.Autonomous_surface_single_logistics_company')">
              <div class="mt-20">
                <el-table :data="formData.logisticsCompanyList">
                  <el-table-column :label="$t('logisticsCompany.logistics_company_code')" prop="scacCode" />
                  <el-table-column :label="$t('logisticsCompany.logistics_company_abbreviation')" prop="shortname" />
                  <el-table-column :label="$t('logisticsCompany.cn_name')" prop="chineseName" />
                  <el-table-column :label="$t('logisticsCompany.en_name')" prop="englishName" />
                  <el-table-column :label="$t('warehouse.operation')" width="100" fixed="right">
                    <template slot-scope="{ $index }">
                      <el-button
                        v-if="!isDisabled('outbound')"
                        type="text"
                        size="mini"
                        class="fc-red"
                        @click="del($index, 'logisticsCompanyList')"
                      >
                        {{$t('warehouse.delete')}}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="!isDisabled('outbound')"
                  class="addItem flex-center"
                  @click="logisticsCompanyDialogVisible = true"
                >
                  <span class="el-icon-plus" /> {{$t('warehouse.increase')}}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <div>
        </div>
        <div v-if="$isEmpty(formData.id)">
          <div class="pd-16 content-title">{{$t('warehouse.peakSeasonTimeWarehouse')}}</div>
          <el-row>
            <el-col :span="24">
              <peakSeasonTimeWarehouseEdit :data="formData" />
            </el-col>
          </el-row>
        </div>

        <AddProductDialog
          :visible.sync="dialog.visible"
          :data-list="formData.productList"
          @saved="
            (data) => {
              addProduct(data, 'productList');
            }
          "
        />
        <AddChannelDialog
          :visible.sync="dialogVisible"
          :data-list="formData.deliveryChannelList"
          @saved="
            (data) => {
              addProduct(data, 'deliveryChannelList');
            }
          "
        />
        <AddLogisticsCompanyDialog
          :visible.sync="logisticsCompanyDialogVisible"
          :data-list="formData.logisticsCompanyList"
          @saved="
            (data) => {
              addProduct(data, 'logisticsCompanyList');
            }
          "
        />
      </el-form>
    </div>
		<div class="page-edit-footer">
			<div>
				<el-button :loading="loading" size="mini" @click="backList">
          {{$t('warehouse.cancel')}}
				</el-button>
				<el-button
          v-if="!formData.id"
					:loading="loading"
					type="primary"
					size="mini"
					@click="saveForm('formData')"
				>
          {{$t('warehouse.save')}}
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import constant from './components/constant'
import AddProductDialog from './components/AddProductDialog'
import TimeSlot from './components/timeSlot'
import AddChannelDialog from './components/AddChannelDialog'
import AddLogisticsCompanyDialog from './components/AddLogisticsCompanyDialog'
import contactInfo from './components/contactInfo'
import { validateZipCode } from '@/utils/validate'
import { getDivisionListV2 } from '@/api/division'
import { getCountryListApi } from '@/api/OverseasWarehouse/goodsManager'
import { saveWarehouseApi, detailWarehouseApi, saveBaseInfoApi, saveContactfoApi, saveBaseConfigApi, saveStorageConfigApi, saveOutboundConfigApi, saveRollsConfigApi, saveBondedWarehouseInfoApi } from '@/api/OverseasWarehouse/warehouse'
import { getContainerTypeList } from '@/api/seaExport'
import { getCountryHasCityApi } from '@/api/common'
import peakSeasonTimeWarehouseEdit from '../components/peakSeasonTimeWarehouseEdit.vue'
import condition from './components/condition'
import BondedWarehouseInfo from './components/bondedWarehouseInfo'
import { getCompanyListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'WarehouseDetail',
	components: { AddProductDialog, AddChannelDialog, peakSeasonTimeWarehouseEdit, contactInfo, AddLogisticsCompanyDialog, condition, BondedWarehouseInfo, TimeSlot },
	data() {
		const _this = this
		const defaultForm = {
			id: null,
			productCategory: 1,
			productCategoryName: '海外仓',
			supplierId: '',
			supplierName: '',
			name: '',
			warehouseCode: '',
			allowSnapshoot: null,
			areas: [],
			detailAddress: '',
			areaName: '',
			zipcode: '',
			inWarehouseContact: '',
			inWarehouseEmail: '',
			outWarehouseContact: '',
			outWarehouseEmail: '',
			warehousePhoneAreaNo: '',
			warehousePhone: '',
			startWorkTime: null,
			endWorkTime: null,
			cutTime: null,
			ediMappingId: null,
			zone: '',
			dockingWays: [],
			snapshootTime: null,
			inWarehouseTypeList: [],
			receiveGoodsTypeList: [],
			supportSelfSend: null,
			allowGetEntryOrder: null,
			outWarehouseTypeList: [],
			warehouseInnerServiceList: [],
			allowOutEntryOrder: null,
			productList: [],
			deliveryChannelList: [],
			province: '',
			countryCode: '',
			supportBatch: null,
			city: '',
			containerTypeList: [], // 可接受箱型
			peakSeasonTimeDetailDTOList: [],
			logisticsCompanyList: [],
			conditionList: [],
			warehouseTimeSlotList: [],
			supplierWarehouseCode: null,
			warehouseType: 11,
			bondedWarehouseInfo: {
				bondedWarehouseLicenseNo: null,
				alCode: null,
				unloCode: null,
				locationCode: null,
				customsOfficeCode: null,
				identifyVanHetEntrepot: null
			},
			chargeType: null,
			logisticsCompanyArr: [],
			carrierJson: null
		}
		const defaultStatus = {
			baseInfo: false,
			baseConfig: false,
			putStorage: false,
			outbound: false,
			configuration: false,
			contactInfo: false,
			bondedWarehouseInfo: false
		}
		const validateZipCodeFn = (rule, value, callback) => {
			if (value && !validateZipCode(this.formData.areas[0], value)) {
				callback(new Error('请输入正确的邮编'))
			} else {
				callback()
			}
		}
		return {
			areasOptions: [],
			containerList: [],
			companyList: [],
			loading: false,
			defaultForm,
			defaultStatus,
			constant,
			isEdit: false,
			isDetail: false,
			dialogVisible: false,
			logisticsCompanyDialogVisible: false,
			id: null,
			tempData: {},
			provinProps: {
				lazy: true,
				label: 'chineseName',
				value: 'code',
				lazyLoad(node, resolve) {
					const { level, data } = node
					if (level === 0) {
						getCountryHasCityApi().then(rs => {
							getCountryListApi({ pageSize: 500, pageNum: 1 }).then(res => {
								// 只显示美国和加拿大 其他国家数据库二级数据不全
								let codes = rs.content || []
								// getCountryHasCityApi().then(rs => {
								// 	codes = rs.content || []
								// })
								_this.$nextTick(() => {
									const arr = res.content.filter(
										item => codes.indexOf(item.code2) > -1
									)
									arr.forEach(item => {
										item.code = item.code2
									})
									resolve(arr)
								})
							})
						})

					} else {
						getDivisionListV2({
							areaLevel: level,
							countryCode: data.code
						}).then(res => {
							if (level === 1) {
								res.content.list.forEach(item => {
									item.leaf = true
								})
							}
							resolve(res.content.list)
						})
					}
				}
			},
			defaultBondedWarehouseInfo: {
				bondedWarehouseLicenseNo: null,
				alCode: null,
				unloCode: null,
				locationCode: null,
				customsOfficeCode: null,
				identifyVanHetEntrepot: null
			},
			formData: this.$extends(true, {}, defaultForm),
			currentStatus: this.$extends(true, {}, defaultStatus),
			countryCodes: [],
			rules: {
				productCategory: [{ required: true, message: this.$t('warehouse.please_select_product_category') }],
				name: [{ required: true, message: this.$t('warehouse.please_enter_warehouse_name') }],
				warehouseCode: [{ required: true, message: this.$t('warehouse.please_input_warehouse_code') }],
				supplierWarehouseCode: [{ required: true, message: this.$t('warehouse.please_input_warehouse_code') }],
				supplierId: [{ required: true, message: this.$t('warehouse.please_select_supplier') }],
				areas: [{ required: true, message: this.$t('warehouse.please_select_areas') }],
				city: [{ required: true, message: this.$t('warehouse.please_enter_city') }],
				detailAddress: [{ required: true, message: this.$t('warehouse.please_enter_detail_address') }],
				zipcode: [{ required: true, message: this.$t('warehouse.please_enter_zip_code') }, { validator: validateZipCodeFn }],
				allowSnapshoot: [{ required: true, message: this.$t('warehouse.please_select_allow_snap_shoot') }],
				warehousePhone: [
					{ required: true, message: this.$t('warehouse.please_enter_warehouse_phone') },
					{ validator: this.$validators.pInt }
				],
				warehousePhoneAreaNo: [
					{ required: true, message: this.$t('warehouse.please_enter_warehouse_phone_area_no') },
					{ validator: this.$validators.checkCommonPhone }
				],
				startWorkTime: [{ required: true, message: this.$t('warehouse.please_select_start_work_time') }],
				endWorkTime: [{ required: true, message: this.$t('warehouse.please_select_end_work_time') }],
				cutTime: [{ required: true, message: this.$t('warehouse.please_select_cut_time') }],
				zone: [{ required: true, message: this.$t('warehouse.please_select_zone') }],
				dockingWays: [{ required: true, message: this.$t('warehouse.please_select_docking_ways') }],
				snapshootTime: [{ required: true, message: this.$t('warehouse.please_select_snap_shoot_time') }],
				supportBatch: [{ required: true, message: this.$t('warehouse.please_select_support_batch') }],
				inWarehouseTypeList: [{ required: true, message: this.$t('warehouse.please_select_in_warehouse_type') }],
				containerTypeList: [{ required: true, message: this.$t('warehouse.please_select_container_type') }],
				receiveGoodsTypeList: [{ required: true, message: this.$t('warehouse.please_select_receive_goods_type') }],
				allowGetEntryOrder: [
					{ required: true, message: this.$t('warehouse.please_select_allow_get_entry_order') }
				],
				supportSelfSend: [{ required: true, message: this.$t('warehouse.please_select_support_self_send') }],
				outWarehouseTypeList: [{ required: true, message: this.$t('warehouse.please_select_out_warehouse_type') }],
				allowOutEntryOrder: [
					{ required: true, message: this.$t('warehouse.please_select_allow_out_entry_order') }
				],
				warehouseInnerServiceList: [
					{ required: true, message: this.$t('warehouse.please_select_warehouse_inner_service') }
				],
				warehouseType: [{ required: true, message: this.$t('warehouse.please_warehouse_type') }],
				'bondedWarehouseInfo.bondedWarehouseLicenseNo': [{ required: true, message: this.$t('common.placeholder') + 'Bonded warehouse license No' }],
				'bondedWarehouseInfo.alCode': [{ required: true, message: this.$t('common.placeholder') + 'ALcode' }],
				'bondedWarehouseInfo.unloCode': [{ required: true, message: this.$t('common.placeholder') + 'UNLOCODE' }],
				'bondedWarehouseInfo.locationCode': [{ required: true, message: this.$t('common.placeholder') + 'Location code' }],
				'bondedWarehouseInfo.customsOfficeCode': [{ required: true, message: this.$t('common.placeholder') + 'Customs office code' }],
				'bondedWarehouseInfo.identifyVanHetEntrepot': [{ required: true, message: this.$t('common.placeholder') + 'Identificatie van het entrepot' }],
				chargeType: [{ required: true, message: this.$t('warehouse.please_select_charge_type') }]
			}
		}
	},
	created() {
		this.isEdit = this.$route.query.type === '1'
		this.isDetail = this.$route.query.type === '2'
		this.init()
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.id = this.$route.query.id
			this.getDetail()
		} else {
			this.getCompanyList()
		}
	},
	mounted() { },
	methods: {
		/**
		 * 初始化数据
		 */
		async init() {
			// 获取箱型数据
			getContainerTypeList().then(res => {
				this.containerList = res.content
			})
			let rs = await getCountryHasCityApi()
			if (rs.ok) {
				this.countryCodes = rs.content || []
			}

		},
		/**
		 * 获取公司
		 */
		// countryCode
		async getCompanyList() {
			let res = await getCompanyListApi({ countryCode: this.formData.countryCode })
			if (res.ok) {
				this.companyList = res.content.list || []
			}
		},
		/**
		 * 国家变更
		 */
		areasOptionsChange(data) {
			this.formData.countryCode = this.$isEmpty(data) ? null : data[0]
			this.getCompanyList()
			if (!this.isEdit) {
				this.formData.logisticsCompanyArr = []
			}
		},
		getCarrierJson(val) {
			let arr = []
			val.forEach(itemId => {
				let itemData = this.companyList.find(item => item.id === itemId)
				if (this.$isNotEmpty(itemData)) {
					let data = {
						carrierName: itemData.chineseName,
						carrierId: itemData.id
					}
					arr.push(data)
				}
			})
			return JSON.stringify(arr)
		},
		/**
		 *回写所在地区
		 */
		getSelectCity(areas) {
			getCountryListApi({ pageSize: 50000, pageNum: 1 }).then(res => {
				let codes = this.countryCodes
				const arr = res.content.filter(
					item => codes.indexOf(item.code2) > -1
				)
				arr.forEach(item => {
					item.code = item.code2
				})
				const areasOptions = arr
				getDivisionListV2({ areaLevel: 1, countryCode: areas[0] }).then(rs => {
					if (rs.ok) {
						let itemData = areasOptions.find(item => item.code === areas[0])
						itemData = itemData || {}
						rs.content.list.forEach(item => {
							item.leaf = true
						})
						itemData.children = rs.content.list || []
						this.areasOptions = areasOptions
						this.formData.areas = areas
					}
				})
			})
		},
		/**
		 * 获取当天的00:00:00 时间戳
		 */
		getCurrentDayTime(dataTime) {
			let time = new Date()
			time.setHours(0)
			time.setMinutes(0)
			time.setSeconds(0)
			time.setMilliseconds(0)
			return Number(time.getTime()) + Number(dataTime)
		},
		/**
		 * 获取时分秒时间戳
		 */
		getHoursMinutes(time) {
			let date = new Date(time)
			let H = date.getHours()
			let M = date.getMinutes()
			let S = date.getSeconds()
			let m = date.getMilliseconds()
			let dateTime = Number(H * 60 * 60 * 1000) + Number(M * 60 * 1000) + Number(S * 60 * 1000) + m
			return dateTime
		},
		/**
		 * 状态改变
		 */
		changeStaus(key) {
			let flag = false
			for (let key in this.currentStatus) {
				if (this.currentStatus[key]) {
					flag = true
					break
				}
			}
			if (flag) {
				this.$message.error(this.$t('warehouse.saveItemNow'))
				return
			}
			this.currentStatus[key] = true
			this.tempData = this.$extends(true, {}, this.formData)
		},
		// 取消当前编辑
		cancel(key) {
			if (this.currentStatus[key]) {
				if (this.$isNotEmpty(this.tempData)) {
					this.$copyProps(this.formData, this.tempData)
					this.currentStatus[key] = false
					this.tempData = {}
				}

			}
		},
		/**
		 * 保存数据
		 */
		saveItem(key) {
			this.$refs.formData.validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				let saveForm = this.handlerData()

				let data = {}
				let fn = null
				if (key === 'baseInfo') {
					data = {
						allowSnapshoot: null,
						city: null,
						countryCode: null,
						cutTime: null,
						detailAddress: null,
						endWorkTime: null,
						name: null,
						warehouseCode: '',
						productCategory: null,
						productCategoryName: null,
						province: null,
						provinceName: null,
						snapshootFrequency: null,
						snapshootTime: null,
						startWorkTime: null,
						supplierId: null,
						supplierName: null,
						warehouseId: null,
						warehousePhone: null,
						warehousePhoneAreaNo: null,
						zipcode: null,
						zone: null,
						warehouseTimeSlotList: null
					}
					this.$copyProps(data, saveForm)
					data.warehouseId = saveForm.id
					fn = saveBaseInfoApi
				} else if (key === 'baseConfig') {
					data = {
						dockingWay: null,
						warehouseId: null,
						ediMappingId: null,
						supplierWarehouseCode: null
					}
					this.$copyProps(data, saveForm)
					data.warehouseId = saveForm.id
					fn = saveBaseConfigApi
				} else if (key === 'putStorage') {
					data = {
						allowGetEntryOrder: null,
						inWarehouseTypes: null,
						receiveGoodsTypes: null,
						containerTypeJson: null,
						supportSelfSend: null,
						warehouseId: null,
						carrierJson: null
					}
					this.$copyProps(data, saveForm)
					data.warehouseId = saveForm.id
					fn = saveStorageConfigApi
				} else if (key === 'outbound') {
					data = {
						allowOutEntryOrder: null,
						deliveryChannelList: null,
						logisticsCompanyList: null,
						outWarehouseTypes: null,
						productList: null,
						warehouseId: null,
						chargeType: null
					}
					this.$copyProps(data, saveForm)
					data.warehouseId = saveForm.id
					fn = saveOutboundConfigApi
				} else if (key === 'contactInfo') {
					data = {
						ccOperatorFlag: null,
						warehouseContactsList: null,
						warehouseId: null
					}
					this.$copyProps(data, saveForm)
					data.warehouseId = saveForm.id
					fn = saveContactfoApi
				} else if (key === 'configuration') {
					data = {
						conditionList: null,
						supportBatch: null,
						warehouseId: null,
						warehouseInnerServices: null
					}
					this.$copyProps(data, saveForm)
					data.warehouseId = saveForm.id
					fn = saveRollsConfigApi
				} else if (key === "bondedWarehouseInfo") {
					data = {
						bondedWarehouseLicenseNo: null,
						alCode: null,
						unloCode: null,
						locationCode: null,
						customsOfficeCode: null,
						identifyVanHetEntrepot: null,
						warehouseId: null
					}
					this.$copyProps(data, saveForm.bondedWarehouseInfo)
					data.warehouseId = saveForm.id
					fn = saveBondedWarehouseInfoApi
				}
				this.loading = true
				fn(data).then(res => {
					if (res.ok) {
						this.currentStatus[key] = false
						this.$message.success(this.$t('common.saveSuccess'))
						this.tempData = {}
					}
					this.loading = false
				}).catch(() => {
					this.loading = false
				})
			})
		},
		// 判断是否为禁用状态
		isDisabled(key) {
			return this.isEdit && !this.currentStatus[key] || this.isDetail
		},
		/**
		 * 获取详情数据
		 */
		async getDetail() {
			this.loading = true
			const res = await detailWarehouseApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				res.content.inWarehouseTypeList = res.content.inWarehouseTypes.split(
					','
				)
				res.content.outWarehouseTypeList = res.content.outWarehouseTypes.split(
					','
				)
				res.content.dockingWays = res.content.dockingWay.split(',')
				res.content.receiveGoodsTypeList = res.content.receiveGoodsTypes.split(
					','
				)
				res.content.warehouseInnerServiceList = res.content.warehouseInnerServices.split(
					','
				)
				res.content.containerTypeList = res.content.containerTypeJson ? JSON.parse(res.content.containerTypeJson) : []
				res.content.startWorkTime = this.getCurrentDayTime(res.content.startWorkTime)
				res.content.endWorkTime = this.getCurrentDayTime(res.content.endWorkTime)
				res.content.cutTime = this.getCurrentDayTime(res.content.cutTime)
				res.content.snapshootTime = res.content.snapshootTime ? this.getCurrentDayTime(res.content.snapshootTime) : null
				res.content.bondedWarehouseInfo = res.content.bondedWarehouseInfo || {}
				if (this.$isNotEmpty(res.content.carrierJson)) {
					let arr = []
					let carrierList = JSON.parse(res.content.carrierJson)
					carrierList.forEach(item => {
						arr.push(item.carrierId)
					})
					res.content.logisticsCompanyArr = arr
				}
				this.$copyProps(this.formData, res.content, ['bondedWarehouseInfo', 'conditionList'])
				// 复制保税信息
				this.$copyProps(this.formData.bondedWarehouseInfo, res.content.bondedWarehouseInfo)
				this.getSelectCity([this.formData.countryCode, this.formData.province])
				// 将后端给的数据条件展现成前端支持的结构
				const conditionList = []
				if (this.$isNotEmpty(res.content.conditionList)) {
					res.content.conditionList.forEach(item => {
						const data = conditionList.find(fieldItem => fieldItem.conditionTypeCode === item.conditionTypeCode && fieldItem.fieldCode === item.fieldCode)
						// 如果主数据已经存在
						if (this.$isNotEmpty(data)) {
							const data2 = {
								operator: item.operator,
								referenceValue: item.referenceValue
							}
							data.children.push(data2)
						} else {
							const data1 = {
								fieldCode: item.fieldCode,
								conditionTypeCode: item.conditionTypeCode,
								unit: item.unit,
								children: [{
									operator: item.operator,
									referenceValue: item.referenceValue
								}]
							}
							conditionList.push(data1)
						}
					})
					if (!this.isDetail) {
						// 增加空数据
						conditionList.forEach(item => {
							if (item.children.length === 1) {
								const data3 = {
									operator: '',
									referenceValue: ''
								}
								item.children.push(data3)
							}
						})
					}
				}
				this.formData.conditionList = conditionList
				this.getCompanyList()
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
		 * 处理保存的数据
		 */
		handlerData() {
			// 处理接口数据
			this.formData.province = this.formData.areas[1]
			this.formData.countryCode = this.formData.areas[0]
			this.formData.inWarehouseTypes = this.formData.inWarehouseTypeList.join(',')
			this.formData.outWarehouseTypes = this.formData.outWarehouseTypeList.join(',')
			this.formData.dockingWay = this.formData.dockingWays.join(',')
			this.formData.receiveGoodsTypes = this.formData.receiveGoodsTypeList.join(',')
			this.formData.warehouseInnerServices = this.formData.warehouseInnerServiceList.join(',')
			this.formData.containerTypeJson = JSON.stringify(this.formData.containerTypeList)
			this.formData.carrierJson = this.getCarrierJson(this.formData.logisticsCompanyArr)
			if (!this.formData.dockingWays.includes('1')) {
				// 对接方式没有API删除供应商仓库code
				this.formData.supplierWarehouseCode = null
			}
			// 如果出库类型不包含 一单多件 设置计费类型为空
			if (!this.formData.outWarehouseTypeList.includes('30')) {
				this.formData.chargeType = null
			}
			// 如果出库类型不包含 一单多件 设置计费类型为空
			if (!this.formData.inWarehouseTypeList.includes('4')) {
				this.formData.carrierJson = null
			}
			let saveForm = this.$extends(true, {}, this.formData)
			if (this.$isNotEmpty(saveForm.peakSeasonTimeDetailDTOList)) {
				saveForm.peakSeasonTimeDetailDTOList.forEach((item, index) => {
					if (item.endTimeFlag) {
						item.endTime = null
						delete item.endTimeFlag
						delete item.rangTime
						item.serial = index + 1
					} else {
						if (this.$isNotEmpty(item.rangTime)) {
							item.startTime = Number(item.rangTime[0])
							item.endTime = Number(item.rangTime[1])
							delete item.endTimeFlag
							delete item.rangTime
							item.serial = index + 1
						}
					}

				})
			}
			if (this.$isNotEmpty(saveForm.warehouseContactsList)) {
				saveForm.warehouseContactsList.forEach((item, index) => {
					item.serial = index + 1
				})
			}
			saveForm.startWorkTime = this.getHoursMinutes(this.formData.startWorkTime)
			saveForm.endWorkTime = this.getHoursMinutes(this.formData.endWorkTime)
			saveForm.cutTime = this.getHoursMinutes(this.formData.cutTime)
			saveForm.snapshootTime = this.formData.snapshootTime ? this.getHoursMinutes(this.formData.snapshootTime) : null
			const conditionList = []
			if (this.$isEmpty(this.formData.conditionList)) {
				// this.$message.warning('请维护限制条件')
			} else {
				// 组装限制条件
				const arr = this.$extends([], this.formData.conditionList)
				arr.forEach(item => {
					if (this.$isNotEmpty(item.conditionTypeCode)) {
						// 将限制条件平铺
						const data1 = {
							fieldCode: item.fieldCode,
							conditionTypeCode: item.conditionTypeCode,
							unit: item.unit,
							operator: item.children ? item.children[0].operator : null,
							referenceValue: item.children ? item.children[0].referenceValue : null
						}
						conditionList.push(data1)
						// 如果第二条数据存在郑增加第二条数据
						if (item.children && this.$isNotEmpty(item.children[1].operator)) {
							const data2 = {
								fieldCode: item.fieldCode,
								conditionTypeCode: item.conditionTypeCode,
								unit: item.unit,
								operator: item.children[1].operator,
								referenceValue: item.children[1].referenceValue
							}
							conditionList.push(data2)
						}
					}
				})
			}
			saveForm.conditionList = conditionList
			if (saveForm.warehouseType === 11) {
				// 如果是非保税 清空保税信息
				this.$copyProps(saveForm.bondedWarehouseInfo, this.defaultBondedWarehouseInfo)
			}
			// saveForm.warehouseTimeSlotList = JSON.stringify(saveForm.warehouseTimeSlotList)
			return saveForm
		},
		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				let saveForm = this.handlerData()
				this.loading = true
				saveWarehouseApi(saveForm)
					.then(res => {
						if (res.ok) {
							this.$message.success(this.$t('warehouse.save_success'))
							this.backList()
						}
						this.loading = false
					})
					.catch(() => {
						this.loading = false
					})
			})
		},
		/**
		 * 添加数据
		 */
		addProduct(data, key) {
			this.formData[key].push(data)
		},
		/**
		 * 删除数据
		 */
		del(index, key) {
			this.$confirm(this.$t('warehouse.delete_info'), this.$t('warehouse.prompt'), {
				confirmButtonText: this.$t('warehouse.confirm'),
				confirmButtonClass: 'el-button--danger',
				cancelButtonClass: 'el-button--primary',
				type: 'warning'
			})
				.then(() => {
					this.formData[key].splice(index, 1)
				})
				.catch(() => { })
		},
		/**
		 * 返回列表
		 */
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `WarehouseList` })
		}
	},
	watch: {
		'formData.dockingWays': {
			handler(val, oldVal) {
				if (val.length > oldVal.length && oldVal.length > 0) {
					let currentChange = val[val.length - 1]
					if (Number(currentChange) === 4) {
						// 如果是云仓 将其他清除
						this.formData.dockingWays = ['4']
					} else {
						// 如果不云仓 将云仓清除
						let index = val.indexOf('4')
						if (index > -1) {
							this.formData.dockingWays.splice(index, 1)
						}
					}
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">
.page-edit-container {
	background-color: #fff;
}
.content-title {
	display: flex;
	align-items: center;
}

.addItem {
	height: 40px;
	width: 100%;
	margin-top: 10px;
	cursor: pointer;
	border: 1px #d5d5e8 dashed;
	color: #909399;
}
</style>
