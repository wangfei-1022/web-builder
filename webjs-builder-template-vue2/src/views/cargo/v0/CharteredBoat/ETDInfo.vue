<template>
  <div class="pd-16 pageContent">
    <el-form ref="formData" v-loading="loading" label-width="0px" label-position="left" :model="formData">
      <div class="content-title mt-10 mb-10">{{ $t('charteredBoat.baseInfo') }}</div>
      <div class="flex-box">
        <el-form-item
          label=""
          prop="vesselName"
          :rules="[
            { required: true, message: $t('boatEtdList.vesselNameEmptyInvalid') },
          ]"
        >
          <div><span class="required">*</span>{{ $t('charteredBoat.vesselName') }}</div>
          <el-input v-model="formData.vesselName" maxlength="50" class="w-200" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.vesselName')}`" size="mini" @blur="updateBaseData('vesselName')" />
        </el-form-item>
        <el-form-item
          label=""
          class="ml-20"
          prop="voyageNo"
          :rules="[
            { required: true, message: $t('boatEtdList.voyageNoEmptyInvalid') },
          ]"
        >
          <div><span class="required">*</span>{{ $t('charteredBoat.voyageNo') }}</div>
          <el-input v-model="formData.voyageNo" maxlength="50" class="w-200" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.voyageNo')}`" size="mini" @blur="updateBaseData('voyageNo')" />
        </el-form-item>
        <el-form-item
          label=""
          class="ml-20"
          prop="callSign"
          :rules="[
            { required: true, message: $t('boatEtdList.IMOEmptyInvalid') },
          ]"
        >
          <div><span class="required">*</span>IMO</div>
          <el-input v-model="formData.callSign" maxlength="50" class="w-200" :placeholder="$t('common.placeholder')+'IMO'" size="mini" @blur="updateBaseData('callSign')" />
        </el-form-item>
        <el-form-item
          label=""
          class="ml-20"
          prop="carrierId"
          :rules="[
            { required: true, message: $t('boatEtdList.shippingDepartmentInvalid') },
          ]"
        >
          <div><span class="required">*</span>{{ $t('boatEtdList.shippingDepartment') }}</div>
          <cargo-advance-select
            :url="url.omc.shippingCompanylist"
            :default-value="formData.nameStr"
            tag-value="id"
            tag-name="chineseName"
            :headers="[$t('boatEtdList.shortInChinese'),$t('boatEtdList.shortInEnglish'),]"
            :fields="['chineseShortname','englishShortname']"
            :options-width="'400px'"
            remote
            class="w-200"
            :clearable="false"
            :placeholder="$t('common.placeholder')+$t('boatEtdList.shippingDepartment')"
            @parentCallBack="selected"
          />
        </el-form-item>
<!--        <el-form-item-->
<!--          label=""-->
<!--          class="ml-20"-->
<!--          prop="routeCode"-->
<!--        >-->
<!--&lt;!&ndash;          :rules="[&ndash;&gt;-->
<!--&lt;!&ndash;          { required: true, message: '请输入航线代码' },&ndash;&gt;-->
<!--&lt;!&ndash;          ]"&ndash;&gt;-->
<!--          <div><span class="required">*</span>{{ $t('charteredBoat.routeCode') }}</div>-->
<!--          <el-input v-model="formData.routeCode" :disabled="true" maxlength="50" class="w-200" :placeholder="$t('boatEtdList.routeCodePlaceholder')" size="mini" @blur="updateBaseData('routeCode')" />-->
<!--        </el-form-item>-->
        <el-form-item label="" class="ml-20" prop="teu"
          :rules="[{ required: true, message: $t('charteredBoat.contractSpacePlaceholder') }]"
        >
          <div><span class="required">*</span>{{ $t('charteredBoat.contractSpace') }}</div>
          <el-input v-model="formData.teu" v-input-limit="[20,0]"  @blur="updateBaseData('teu')" maxlength="50" class="w-200" :placeholder="$t('charteredBoat.contractSpacePlaceholder')" size="mini" />
        </el-form-item>
      </div>
      <!--      装货港信息-->
      <div class="flex-between mb-10">
        <div class="content-title">{{ $t('charteredBoat.polCode') }}{{ $t('boatEtdList.information') }}</div>
        <el-button type="primary" :disabled="edit" size="mini" @click="addCasSchedule()">{{ $t('boatEtdList.createPolCode') }}</el-button>
      </div>
      <el-table ref="table" class="table-item" :data="formData.casScheduleLoadingDTOList" style="width: 100%" row-key="id" :row-class-name="tableRowClassName">
        <el-table-column min-width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('charteredBoat.polCode') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.enPortName }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.enPortName'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.polCode')}` },
              ]"
            >
              <cargo-advance-select
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :default-value="row.enPortName"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                class="w-240"
                :clearable="false"
                :disabled="disabledEdit(row)"
                tagName="englishName"
                @parentCallBack="(data)=>{getItemFromChild(data,row,formData.casScheduleLoadingDTOList)}"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="portCode" width="100">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('common.fiveCharCode') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="220">
          <template slot="header"><span class="required">*</span><span>{{$t('boatEtdList.returnPlace')}}</span></template>
          <template slot-scope="{row,$index}">
<!--            yardName-->
            <span v-if="!row.isEdit">{{ row.returnAddressListArrName}}</span>
            <el-form-item v-else label="" label-width="0px" class="mb-0" :prop="'casScheduleLoadingDTOList.' + $index + '.returnAddressListArr'" :rules="[{ required: true, message: $t('boatEtdList.returnPlaceEmptyInvalid') }]">
              <el-select v-model="row.returnAddressListArr" size="small" filterable multiple :placeholder="$t('common.placeholder')" :clearable="true" @change="(val)=>returnAddressListChange(val,row)">
                <el-option v-for="item in yardOptions" :key="item.code" :label="item.name" :value="`${item.code},${item.name},${item.yardAddress}`">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" :label="$t('boatEtdList.CYOpen')">
          <template slot-scope="{row}">
            <span v-if="!row.isEdit">{{ row.cyOpenDate| formatDate }}</span>
            <el-form-item v-else label="" label-width="0px" class="mb-0">
              <CommonPicker
                v-model="row.cyOpenDate"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.CYCut')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.cyCutDate| formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.cyCutDate'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('boatEtdList.CYCut')}` },
              ]"
            >
              <CommonPicker
                v-model="row.cyCutDate"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.SICut')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.siCutDate| formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.siCutDate'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('boatEtdList.SICut')}` },
              ]"
            >
              <CommonPicker
                v-model="row.siCutDate"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.VGMCut')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.vgmCutDate| formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.vgmCutDate'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('boatEtdList.VGMCut')}` },
              ]"
            >
              <CommonPicker
                v-model="row.vgmCutDate"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.CUSCut')}}</span>
          </template>
          <template slot-scope="{row,$index }">
            <span v-if="!row.isEdit">{{ row.cusCutDate| formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.cusCutDate'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('boatEtdList.CUSCut')}` },
              ]"
            >
              <CommonPicker
                v-model="row.cusCutDate"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('charteredBoat.etd')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.etd | formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.etd'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.etd')}` },
              ]"
            >
              <CommonPicker
                v-model="row.etd"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="ATD">
          <template slot-scope="{row}">
            <span v-if="!row.isEdit">{{ row.atd | formatDate }}</span>
            <el-form-item v-else label="" label-width="0px" class="mb-0">
              <CommonPicker
                v-model="row.atd"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('boatEtdList.bookingEndDate') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.bookingEndDate | formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.bookingEndDate'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('boatEtdList.bookingEndDate')}` },
              ]"
            >
              <CommonPicker
                v-model="row.bookingEndDate"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" :label="$t('boatEtdList.settlementCode')">
          <template slot-scope="{row}">
            <span v-if="!row.isEdit">{{ row.settlementCode }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
            >
<!--              :prop="'casPickReturnAddressDTOList.' + $index + '.settlementCode'"-->
              <div class="pr-10">
                <el-input v-model="row.settlementCode" class="w-full" size="mini" @keyup.native="row.settlementCode=row.settlementCode.replace(/[^A-Z\d]/g,'')" />
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="110" fixed="right">
          <template slot-scope="{row,$index}">
            <div v-if="row.isEdit">
              <el-button type="text" size="mini" @click="saveCasScheduleBefore(row,1,formData.casScheduleLoadingDTOList)">
                {{ $t('common.saveBtn') }}
              </el-button>
              <el-button type="text" size="mini" style="color:#f78989" @click="cancleCasSchedule(row,$index,formData.casScheduleLoadingDTOList)">
                {{ $t('common.cancelBtn') }}
              </el-button>
            </div>
            <div v-else>
              <el-button type="text" size="mini" :disabled="edit || !row.editAble" @click="editCasSchedule(row)">
                <i class="el-icon-edit" :title="$t('common.editBtn')" style="font-size: 16px" />
              </el-button>
              <el-button v-if="!$isEmpty(id) && formData.sailingStatus !== -1" type="text" size="mini" :disabled="edit || !row.editAble || formData.casScheduleLoadingDTOList.length < 2" @click="showDialogFun(row)">
                <i class="iconfont icon-wrench-full" style="font-size: 14px" />
              </el-button>
              <el-button type="text" size="mini" :style="edit || disabledEdit(row)?'':{color:'#f78989'}" :disabled="edit ||disabledEdit(row) || !row.editAble" @click="delCasSchedule($index,formData.casScheduleLoadingDTOList,row.id,1)">
                <i class="el-icon-delete-solid" :title="$t('common.deleteBtn')" style="font-size: 16px" />
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1">
          <template slot-scope="{row,$index}">
            <div class="bookingConfirmation">
              <p style="color: #909399; font-weight: bold"><span class="required">*</span>{{$t('boatEtdList.bookingConfirmIllustration')}}</p>
              <el-form-item label="" label-position="top" :prop="'casScheduleLoadingDTOList.' + $index + '.bookingConfirmIllustration'" label-width="0" :rules="[{ required: true, message: $t('boatEtdList.IllustrationEmptyInvalid') }]">
                <el-input v-model="row.bookingConfirmIllustration" type="textarea" rows="4" maxlength="2000" :placeholder="$t('boatEtdList.IllustrationEmptyInvalid')" style="width: 70%" />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
      </el-table>
<!--      装货港用箱计划-->
      <div class="flex-between mb-10">
        <div class="content-title">{{$t('boatEtdList.polCodePlan')}}</div>
      </div>
      <el-table class="table-item table-plan" :data="formData.casScheduleLoadingDTOList" style="width: 100%">
        <el-table-column width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('charteredBoat.polCode')}}</span>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.enPortName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="300px">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('charteredBoat.ownerName')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit || (formData.sailingStatus !== -1 && formData.sailingStatus !== null && !row.isAddPlan) ">
              <template v-if="row.containerOwner === 1">{{$t('boatEtdList.SOCOnly')}}</template>
              <template v-else-if="row.containerOwner === 2">{{$t('boatEtdList.packageMixin')}}</template>
            </span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.containerOwner'"
              :rules="[{ required: true, message: '', trigger: 'change' }]"
            >
              <div class="pr-10" style="width: 300px">
                <el-select v-model="row.containerOwner" size="mini"  @change="containerOwnerChange(row)">
                  <el-option :label="$t('boatEtdList.packageMixin')" :value="2"/>
                  <el-option :label="$t('boatEtdList.SOCOnly')" :value="1"/>
                </el-select>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="" width="300px">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('charteredBoat.containerType')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit || (formData.sailingStatus !== -1 && formData.sailingStatus !== null && !row.isAddPlan)">{{ row.supportContainerSizeTypes.join(',') }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleLoadingDTOList.' + $index + '.supportContainerSizeTypes'"
              :rules="[{ required: true, message: '', trigger: 'change' }]"
            >
<!--              :collapse-tags="row.supportContainerSizeTypesrow.supportContainerSizeTypes&&row.supportContainerSizeTypes.length>2"-->
              <div class="pr-10" style="width: 300px">
                <el-select v-model="row.supportContainerSizeTypes" :filter-method="dataFilter" filterable size="mini" multiple @change="supportContainerSizeTypesChange(row,row.supportContainerSizeTypes)">
                  <el-option
                    v-for="(opt,index) in cntrOpts2"
                    :key="index"
                    :label="opt.englishName"
                    :value="opt.englishName"
                  />
                </el-select>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="" v-for="(item,index) in nowSupportContainerSizeTypes" :key="index" width="210px">
          <template slot="header">
            <span class="required">*</span>
            <span>{{item}}{{$t('boatEtdList.planAmount')}}</span>
          </template>
          <template slot-scope="{row,$index}" v-if="row.supportContainerSizeTypes.indexOf(item)>-1">
            <span v-if="!row.isEdit || (formData.sailingStatus !== -1 && formData.sailingStatus !== null && !row.isAddPlan) || row.containerOwner ==1">{{ row.casLoadingContainerPlanListArr[item] }}</span>
            <!--              <span v-if="!row.isEdit">{{ row.returnAddr }}</span> casLoadingContainerPlanList-->
            <el-form-item v-else label="" label-width="0px" class="mb-0" :prop="'casScheduleLoadingDTOList.' + $index + '.casLoadingContainerPlanListArr.'+item" :rules="[ { required: true,message: '', trigger: 'change' }]" style="width: 200px">
              <div class="pr-10">
<!--                :disabled="formData.sailingStatus === 1 && !row.isAddPlan"-->
<!--                @input="containerPlanInput(row.casLoadingContainerPlanListArr,item,row.casLoadingContainerPlanListArr[item])"-->
                <el-input  v-model="row.casLoadingContainerPlanListArr[item]" maxlength="50" v-input-limit="[9,0]" size="mini" style="width: 190px" />
              </div>
            </el-form-item>
          </template>
        </el-table-column>


      </el-table>
<!--      提还箱点信息-->
<!--      <div class="flex-between mb-10">-->
<!--        <div class="content-title">{{ $t('charteredBoat.pickUpOrReturn') }}{{ $t('boatEtdList.information') }}</div>-->
<!--        <el-button type="primary" :disabled="edit" size="mini" @click="addCasPickReturnAddress()">{{ $t('charteredBoat.add') }}{{ $t('charteredBoat.pickUpOrReturn') }}</el-button>-->
<!--      </div>-->
<!--      <el-table class="table-item" :data="formData.casPickReturnAddressDTOList" style="width: 100%">-->
<!--        <el-table-column width="250">-->
<!--          <template slot="header">-->
<!--            <span class="required">*</span>-->
<!--            <span>{{ $t('charteredBoat.polCode') }}</span>-->
<!--          </template>-->
<!--          <template slot-scope="{row,$index}">-->
<!--            <span v-if="!row.isEdit">{{ row.enPortName }}</span>-->
<!--            <el-form-item-->
<!--              v-else-->
<!--              label=""-->
<!--              label-width="0px"-->
<!--              class="mb-0"-->
<!--              :prop="'casPickReturnAddressDTOList.' + $index + '.enPortName'"-->
<!--              :rules="[-->
<!--                { required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.polCode')}` },-->
<!--              ]"-->
<!--            >-->
<!--              <el-select v-model="row.enPortName" size="mini" @change="(val)=>{setAddressProt(row)}">-->
<!--                <el-option-->
<!--                  v-for="item in formData.casScheduleLoadingDTOList"-->
<!--                  :key="item.portCode"-->
<!--                  :label="item.enPortName"-->
<!--                  :value="item.enPortName"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column min-width="200" label="">-->
<!--          <template slot="header">-->
<!--            <span class="required">*</span>-->
<!--            <span>{{ $t('charteredBoat.pickPoint') }}</span>-->
<!--          </template>-->
<!--          <template slot-scope="{row,$index}">-->
<!--            <span v-if="!row.isEdit">{{ row.pickUpAddr }}</span>-->
<!--            <el-form-item-->
<!--              v-else-->
<!--              label=""-->
<!--              label-width="0px"-->
<!--              class="mb-0"-->
<!--              :prop="'casPickReturnAddressDTOList.' + $index + '.pickUpAddr'"-->
<!--              :rules="[ { required: true }]"-->
<!--            >-->
<!--              <div class="pr-10">-->
<!--                <el-input v-model="row.pickUpAddr" maxlength="50" class="w-full" size="mini" />-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column min-width="200" label="">-->
<!--          <template slot="header">-->
<!--            <span class="required">*</span>-->
<!--            <span>{{ $t('charteredBoat.returnPoint') }}</span>-->
<!--          </template>-->
<!--          <template slot-scope="{row,$index}">-->
<!--            <span v-if="!row.isEdit">{{ row.returnAddr }}</span>-->
<!--            <el-form-item-->
<!--              v-else-->
<!--              label=""-->
<!--              label-width="0px"-->
<!--              class="mb-0"-->
<!--              :prop="'casPickReturnAddressDTOList.' + $index + '.returnAddr'"-->
<!--              :rules="[ { required: true }]"-->
<!--            >-->
<!--              <div class="pr-10">-->
<!--                <el-input v-model="row.returnAddr" maxlength="50" class="w-full" size="mini" />-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column min-width="200" label="">-->
<!--          <template slot="header">-->
<!--            <span class="required">*</span>-->
<!--            <span>{{ $t('charteredBoat.supportBox') }}</span>-->
<!--          </template>-->
<!--          <template slot-scope="{row,$index}">-->
<!--            <span v-if="!row.isEdit">{{ row.supportContainerSizeType }}</span>-->
<!--            <el-form-item-->
<!--              v-else-->
<!--              label=""-->
<!--              label-width="0px"-->
<!--              class="mb-0"-->
<!--              :prop="'casPickReturnAddressDTOList.' + $index + '.supportContainerSizeTypes'"-->
<!--              :rules="[{ required: true }]"-->
<!--            >-->
<!--              <div class="pr-10">-->
<!--                <el-select v-model="row.supportContainerSizeTypes" :collapse-tags="row.supportContainerSizeTypes.length>5" filterable size="mini" multiple class="w-full">-->
<!--                  <el-option-->
<!--                    v-for="opt in cntrOpts"-->
<!--                    :key="opt.englishName"-->
<!--                    :label="opt.englishName"-->
<!--                    :value="opt.englishName"-->
<!--                  />-->
<!--                </el-select>-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column :label="$t('table.actions')" width="100" fixed="right">-->
<!--          <template slot-scope="{row,$index}">-->
<!--            <div v-if="row.isEdit">-->
<!--              <el-button type="text" size="mini" @click="saveCasSchedule(row,2,formData.casPickReturnAddressDTOList)">-->
<!--                {{ $t('table.save') }}-->
<!--              </el-button>-->
<!--              <el-button type="text" size="mini" style="color:#f78989" @click="cancleCasSchedule(row,$index,formData.casPickReturnAddressDTOList)">-->
<!--                {{ $t('table.cancel') }}-->
<!--              </el-button>-->
<!--            </div>-->
<!--            <div v-else>-->
<!--              <el-button type="text" size="mini" :disabled="edit" @click="editCasSchedule(row)">-->
<!--                {{ $t('table.edit') }}-->
<!--              </el-button>-->
<!--              <el-button type="text" size="mini" :style="edit ?'':{color:'#f78989'}" :disabled="edit" @click="delCasSchedule($index,formData.casPickReturnAddressDTOList,row.id,2)">-->
<!--                {{ $t('table.delete') }}-->
<!--              </el-button>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
      <!--      卸货港信息-->
      <div class="flex-between mb-10">
        <div class="content-title">{{ $t('charteredBoat.podCode') }}{{ $t('boatEtdList.information') }}</div>
        <el-button type="primary" :disabled="edit" size="mini" @click="addScheduleDischarge()">{{$t('boatEtdList.createInfo')}}</el-button>
      </div>
      <el-table class="table-item table-item-unloading" :data="formData.casScheduleDischargeDTOList" style="width: 100%">
        <el-table-column width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('charteredBoat.podCode') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.enPortName }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleDischargeDTOList.' + $index + '.enPortName'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.polCode')}` },
              ]"
            >
              <cargo-advance-select
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :default-value="row.enPortName"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                class="w-240"
                :clearable="false"
                :disabled="isUse(row.enPortName)"
                tagName="englishName"
                @parentCallBack="(data)=>{getItemFromChild(data,row,formData.casScheduleDischargeDTOList)}"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="portCode" width="100">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('common.fiveCharCode') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('boatEtdList.transitPortOrNot') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit && !row.isAdd">{{ row.transitFlag?$t('common.trueText'):$t('common.falseText') }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleDischargeDTOList.' + $index + '.transitFlag'"
              :rules="[ { required: true, message: `${$t('common.placeholder')}${$t('boatEtdList.transitPortOrNot')}`}]"
            >
              <div class="pr-10">
                <el-select v-model="row.transitFlag" class="w-full" size="mini" :disabled="isUseFlag(row.enPortName)">
                  <el-option
                    :label="$t('common.trueText')"
                    :value="true"
                  />
                  <el-option
                    :label="$t('common.falseText')"
                    :value="false"
                  />
                </el-select>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="countryCode" width="140">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('boatEtdList.countryOfDischargePort') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('boatEtdList.transitPort') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ $isEmpty(row.enPortTransitName)?$t('common.nullText'): row.enPortTransitName }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleDischargeDTOList.' + $index + '.enPortTransitName'"
              :rules="[{ required: true,message: `${$t('common.placeholder')}${$t('boatEtdList.transitPort')}`}]"
            >
              <el-select v-model="row.enPortTransitName" size="mini" @change="(val)=>{setCnPortTransit(val,row)}">
                <el-option
                  v-for="item in filterCasScheduleLoadingDTOList"
                  v-if="item.enPortName !== row.enPortName"
                  :key="item.portCode"
                  :label="item.enPortName"
                  :value="item.enPortName"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" label="">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.eta')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.eta | formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleDischargeDTOList.' + $index + '.eta'"
              :rules="[{ required: true,message: `${$t('common.placeholder')}${$t('boatEtdList.eta')}`}]"
            >
              <CommonPicker
                v-model="row.eta"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"

                :clearable="false"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" :label="$t('boatEtdList.ATA')">
          <template slot-scope="{row}">
            <span v-if="!row.isEdit">{{ row.ata | formatDate }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
            >
              <CommonPicker
                v-model="row.ata"
                parent-class="w-180"
                size="small"
                picker-format="yyyy-MM-dd HH:mm"
                pikcer-type="datetime"
                :clearable="true"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('boatEtdList.agentInformation') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.dischargeAgentMessage }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casScheduleDischargeDTOList.' + $index + '.dischargeAgentId'"
              :rules="[ { required: true,message: `${$t('common.placeholder')}${$t('boatEtdList.agentInformation')}`}]"
            >
              <cargo-advance-select
                :method="(params)=>getPartnerAdv(params,row)"
                :headers="[$t('boatEtdList.chineseNameOfClient'),$t('boatEtdList.englishNameOfClient')]"
                :default-value="row.dischargeAgentMessage"
                :fields="['englishName']"
                tag-value="id"
                tag-name="memberName"
                remote
                class="w-240"
                :clearable="false"
                @parentCallBack="(data)=>{setPartnerAdv(data,row)}"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.MBLPrefix')}}</span>
          </template>
          <template slot-scope="{row}">
            <el-form-item
              v-if=" USLCodeArr.indexOf(row.portCode) > -1"
              label=""
              label-width="0px"
              class="mb-0"
              prop="mblPrefix"
              :rules="[
                { required: true, pattern:/^[A-Z]+$/, message: $t('boatEtdList.upperCaseTips')},
              ]"
            >
              <span v-if="!row.isEdit">{{ formData.mblPrefix }}</span>
              <el-input v-else v-model="formData.mblPrefix" size="mini" :placeholder="$t('boatEtdList.placeHolderPrefixMBL')" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="100" fixed="right">
          <template slot-scope="{row,$index}">
            <div v-if="row.isEdit">
              <el-button type="text" size="mini" @click="saveCasSchedule(row,3,formData.casScheduleDischargeDTOList)">
                {{ $t('common.saveBtn') }}
              </el-button>
              <el-button type="text" size="mini" style="color:#f78989" @click="cancleCasSchedule(row,$index,formData.casScheduleDischargeDTOList)">
                {{ $t('common.cancelBtn') }}
              </el-button>
            </div>
            <div v-else>
              <el-button type="text" size="mini" :disabled="edit" @click="editCasSchedule(row)">
                {{ $t('common.editBtn') }}
              </el-button>
              <el-button type="text" size="mini" :style="edit || isUse(row.enPortName) ?'':{color:'#f78989'}" :disabled="edit || isUse(row.enPortName)" @click="delCasSchedule($index,formData.casScheduleDischargeDTOList,row.id,3)">
                {{ $t('common.deleteBtn') }}
              </el-button>
            </div>
          </template>
        </el-table-column>

      </el-table>
      <!-- SO号规则 -->
      <div class="flex-between mb-10">
        <div class="flex-between mb-10 SOnumberSegment">
          <div class="content-title">{{$t('boatEtdList.ruleForSONo')}}</div>

        </div>
        <el-button type="primary" :disabled="edit" size="mini" @click="addSailingNumberSegment()">{{$t('boatEtdList.createSONo')}}</el-button>
      </div>
      <el-table class="table-item" :data="formData.casSailingNumberSegmentRequestDTOList" style="width: 100%">
        <el-table-column width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{ $t('charteredBoat.polCode') }}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.polEnName }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casSailingNumberSegmentRequestDTOList.' + $index + '.polEnName'"
              :rules="[
                { required: true, message: `${$t('common.placeholder')}${$t('charteredBoat.polCode')}` },
              ]"
            >
              <el-select v-model="row.polEnName" size="mini" @change="selectChange($event,row)">
                <el-option
                  v-for="item in formData.casScheduleLoadingDTOList"
                  :key="item.portCode"
                  :label="item.enPortName"
                  :value="item.enPortName"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.useNormalRule')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.isEdit">{{ row.type===1 ? $t('common.trueText') : $t('common.falseText') }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casSailingNumberSegmentRequestDTOList.' + $index + '.type'"
              :rules="[
                { required: true, message: $t('boatEtdList.ifUseNormalRule') },
              ]"
            >
              <el-select v-model="row.type" size="mini" :disabled="rulesDisabled(row)" @change="rulesChange(row)">
                <el-option
                  :label="$t('common.trueText')"
                  :value="1"
                />
                <el-option
                  :label="$t('common.falseText')"
                  :value="2"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="250">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('charteredBoat.podCode')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.edit">{{ $isEmpty(row.podEnName)?'/': row.podEnName }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casSailingNumberSegmentRequestDTOList.' + $index + '.podEnName'"
              :rules="[
                { required: true, message: $t('boatEtdList.podCodePlaceholder') },
              ]"
            >
              <el-select v-model="row.podEnName" size="mini" @change="disPortChange($event,row)">
                <el-option
                  v-for="item in formData.casScheduleDischargeDTOList"
                  :key="item.portCode"
                  :label="item.enPortName"
                  :value="item.enPortName"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column min-width="200">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.startNo')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.edit">{{ $isEmpty(row.startNo) ||row.type === 1 ?'/': row.startNo }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casSailingNumberSegmentRequestDTOList.' + $index + '.startNo'"
              :rules="[
                { required: true, message: $t('boatEtdList.startNoEmptyInvalid') },
                { validator: $validators.validSoNumber,message: $t('boatEtdList.startNoFormatInvalid') }

              ]"
            >
              <el-input v-trim v-model="row.startNo" size="mini" maxlength="255" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="200">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.endNo')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.edit">{{ $isEmpty(row.endNo) ||row.type === 1?'/': row.endNo }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casSailingNumberSegmentRequestDTOList.' + $index + '.endNo'"
              :rules="[
                { required: true, message: $t('boatEtdList.endNoEmptyInvalid') },
                { validator: $validators.validSoNumber,message: $t('boatEtdList.endNoFormatInvalid') }
              ]"
            >
              <el-input v-trim v-model="row.endNo" size="mini" maxlength="255" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.stepBy')}}</span>
          </template>
          <template slot-scope="{row,$index}">
            <span v-if="!row.edit ">{{ $isEmpty(row.step) ||row.type === 1 ?'/': row.step }}</span>
            <el-form-item
              v-else
              label=""
              label-width="0px"
              class="mb-0"
              :prop="'casSailingNumberSegmentRequestDTOList.' + $index + '.step'"
              :rules="[
                { required: true, message: $t('boatEtdList.stepEmptyInvalid') },
                { validator: $validators.pInt,message: $t('boatEtdList.stepFormatInvalid') }
              ]"
            >
              <InputNumber v-trim v-model="row.step" size="mini" :maxlength="10" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <span class="required">*</span>
            <span>{{$t('boatEtdList.enableSOQuantity')}}</span>
          </template>
          <template slot-scope="{row}">
            <span>{{ $isEmpty(row.total) ||row.type === 1?'/': row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="130" fixed="right">
          <template slot-scope="{row,$index}">
            <div v-if="row.isEdit">
              <el-button type="text" size="mini" @click="saveCasSchedule(row,4,formData.casSailingNumberSegmentRequestDTOList)">
                {{ $t('common.saveBtn') }}
              </el-button>
              <el-button type="text" size="mini" style="color:#f78989" @click="cancleCasSchedule(row,$index,formData.casSailingNumberSegmentRequestDTOList)">
                {{ $t('common.cancelBtn') }}
              </el-button>
            </div>
            <div v-else>
              <el-button v-if="row.status===0 || row.type===1" type="text" size="mini" :disabled="edit" @click="editCasSchedule(row)">
                {{ $t('common.editBtn') }}
              </el-button>
              <el-button v-if="$isNotEmpty(id) && row.status===0 && row.type===2 && formData.sailingStatus===1" type="text" size="mini" :disabled="edit" @click="publishNumber(row.id)">
                {{$t('common.publishBtn')}}
              </el-button>
              <el-button v-if="row.status===0|| row.type===1" type="text" size="mini" :style="edit ?'':{color:'#f78989'}" :disabled="edit" @click="delCasSchedule($index,formData.casSailingNumberSegmentRequestDTOList,row.id,4)">
                {{ $t('common.deleteBtn') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="pageFooter">
      <div v-if="$isEmpty(id)">
        <el-button size="mini" @click="cancle()">{{ $t('common.cancelBtn') }}</el-button>
        <el-button type="primary" size="mini" class="ml-20" :disabled="edit || loading" @click="saveForm('formData')">{{ $t('common.saveBtn') }}</el-button>
      </div>
      <el-button v-else type="primary" size="mini" @click="backList()">{{ $t('common.returnBtn') }}</el-button>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="changePortHide"
      :title="$t('boatEtdList.polCodeChange')"
      :visible.sync="showDialog"
      width="600px"
    >
      <el-form ref="boxConForm" :inline="true" label-position="right" :model="changePort">
        <el-form-item :label="$t('boatEtdList.currentPolCode')" prop="fromPolName" style="width: 230px">
          {{ changePort.fromPolName }}
        </el-form-item>
        <el-form-item :label="$t('boatEtdList.changeToOtherPort')" prop="toPolId" :rules="[{ required: true, message: $t('boatEtdList.otherPortEmptyInvalid'), trigger: 'blur' }]">
          <el-select v-model="changePort.toPolId" :placeholder="$t('boatEtdList.otherPortPlaceholder')">
            <el-option v-for="(item,index) in formData.casScheduleLoadingDTOList" v-if="changePort.fromPolId !== item.id && item.editAble" :key="index" :label="item.enPortName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="color: red; font-size: 12px; line-height: 1.5em;">
        <p>{{$t('common.noticeText')}}：{{$t('boatEtdList.ETDNotice1')}}</p>
        <p style="padding-left: 3em">{{$t('boatEtdList.ETDNotice2')}}</p>
        <p style="padding-left: 3em">{{$t('boatEtdList.ETDNotice3')}}</p>
      </div>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-button type="primary" size="mini" @click="changePortConfirm">{{$t('common.confirmBtn')}}</el-button>
        <el-button type="" size="mini" @click="changePortHide">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import {getCode5ListByRouteCodeListApi, getContainerTypeList} from '@/api/seaExport'
import {getYardListByRequestApi, partnerAdv, partnerAdvNew, routeDirectionApi} from '@/api/schedule'
import URL from '@/api/urlTranslator'
import { saveScheduleInfo, detailScheduleInfo, updateBaseData, saveScheduleLoading, delScheduleLoading, saveDischarge, delDischarge, savePickReturnAddress, delPickReturnAddress, numberSegmentList,
  saveNumberSegment, updateNumberSegment, delNumberSegment, publishNumberSegment, polChangeApi } from '@/api/schedule'
import lodash from 'lodash'
export default {
  name: 'ETDInfo',
  components: { cargoAdvanceSelect },
  data() {
    const defaultForm = {
      id: null,
      vesselName: '',
      voyageNo: '',
      callSign: '',
      carrierId: '',
      chineseName: '',
      englishName: '',
      nameStr: '',
      // routeCode: '',
      teu: null,
      sailingStatus: null,
      // casPickReturnAddressDTOList: [], // 提还箱点信息
      casScheduleDischargeDTOList: [], // 卸货港信息
      casScheduleLoadingDTOList: [], // 装货港信息
      casSailingNumberSegmentRequestDTOList: [], // SO字段，
      mblPrefix: '' // 美线mblNo的前缀
    }
    return {
      loading: false,
      id: this.$route.query.id,
      edit: false,
      url: URL,
      defaultForm: defaultForm,
      formData: this.$extends({}, defaultForm),
      temObj: {},
      cntrOpts: [],
      cntrOpts2Copy: [
      ],
      cntrOpts2: [{
        englishName: '20GP'
      }, {
        englishName: '40HC'
      }, {
        englishName: '40RH'
      }],
      partnerAdvs: [],
      showMBLPrefix: false,
      showDialog: false,
      dialogFormDate: {},
      changePort: {
        fromPolId: null,
        fromPolName: null,
        toPolId: null
      },
      changePortArr: [],
      yardOptions: [], // 还箱点,
      nowSupportContainerSizeTypes: [],
      USLCodeArr: []
    }
  },
  computed: {
    // 筛选中转港
    filterCasScheduleLoadingDTOList() {
      let arr = this.$extends([], this.formData.casScheduleDischargeDTOList)
      arr = arr.filter(item => item.transitFlag)
      arr.unshift({ enPortName: this.$t('common.nullText'), portCode: '111' })
      return arr
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
  created() {
    this.cntrOpts2Copy = lodash.cloneDeep(this.cntrOpts2)
    this.getContainer()
    this.getYardListByRequest()
    if (this.$isNotEmpty(this.id)) {
      this.getDetail()
    }
    this.getCode5ListByRouteCodeList()
  },
  mounted() {

  },
  methods: {
    // 获取需要加MBL前缀的港口
    async getCode5ListByRouteCodeList() {
      let parasm = {routeCodeList: [this.$t('boatEtdList.AWE'), this.$t('boatEtdList.AAS1')].join(',')}
      const res = await getCode5ListByRouteCodeListApi(parasm)
      if (res.ok && this.$isNotEmpty(res.content)) {
        this.USLCodeArr = res.content.map(item => item.code5)
      }
    },
    // 获取航线代码
    async getRouteDirectionApi() {
      let codes = this.formData.casScheduleDischargeDTOList[0].portCode
      if (codes) {
        const res = await routeDirectionApi({codes})
        if (res.ok && this.$isNotEmpty(res.content)) {
          this.formData.routeCode = res.content[0].code
        } else {
          this.$message.error(this.$t('boatEtdList.lineCodeErrorText'))
        }
      }
    },
    // 装货港用箱计划 箱属
    containerOwnerChange(row) {
      if (row.containerOwner === 1) {
        for (let key in row.casLoadingContainerPlanListArr) {
          row.casLoadingContainerPlanListArr[key] = null
        }
      }
    },
    containerPlanInput(row, parameter, value) {
      if (value && value <= 0) {
        this.$set(row, parameter, 1)
      }
    },
    returnAddressListChange(val, row) {
      if (val) {
        row.returnAddressList = []
        let name = []
        val.map(item => {
          let retAd = item.split(',')
          row.returnAddressList.push({
            yardCode: retAd[0],
            yardName: retAd[1],
            yardAddress: retAd[2]
          })
          name.push(retAd[1])
        })
        row.returnAddressListArrName = name.join(',')
      }
    },
    supportContainerSizeTypesChange(row, val) {
      if (!row.casLoadingContainerPlanListArr) {
        this.$set(row, 'casLoadingContainerPlanListArr', {[val]: null})
      }
      let nowSupportContainerSizeTypes = []
      this.formData.casScheduleLoadingDTOList.map(item => {
        nowSupportContainerSizeTypes = lodash.union(nowSupportContainerSizeTypes, item.supportContainerSizeTypes)
      })
      this.nowSupportContainerSizeTypes = []
      this.$nextTick(() => {
        this.nowSupportContainerSizeTypes = nowSupportContainerSizeTypes
        Object.keys(row.casLoadingContainerPlanListArr).map(key => {
          if (val.indexOf(key) === -1 && row.casLoadingContainerPlanListArr.hasOwnProperty(key)) {
            delete row.casLoadingContainerPlanListArr[key]
          }
        })
      })
    },
    tableRowClassName({ row }) {
      if (!row.editAble) {
        return 'gray-row'
      }
    },
    showDialogFun(row) {
      this.showDialog = true
      this.changePort.fromPolId = row.id
      this.changePort.fromPolName = row.enPortName
    },
    changePortConfirm() {
      this.$refs.boxConForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const data = this.$extends(true, {}, this.changePort)
          delete data.fromPolName
          const res = await polChangeApi(data)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.boatEtdList'))
            this.changePortHide()
            this.$router.go(0)
          }
        }
      })
    },
    changePortHide() {
      this.$refs.boxConForm.resetFields()
      this.showDialog = false
    },
    async getYardListByRequest() {
      const res = await getYardListByRequestApi({yardType: 2})
      if (res.ok) {
        this.yardOptions = res.content
      }
    },
    /**
     * 获取详情页面
     */
    async getDetail() {
      const res = await detailScheduleInfo(this.id)
      if (res.ok) {
        if (this.$isNotEmpty(res.content)) {
          res.content.nameStr = res.content.chineseName + '/' + res.content.englishName
          // res.content.casPickReturnAddressDTOList.forEach(item => {
          //   if (this.$isNotEmpty(item.supportContainerSizeType)) {
          //     item.supportContainerSizeTypes = item.supportContainerSizeType.split(',')
          //   }
          // })
          if (res.content.mblPrefix) {
            this.showMBLPrefix = true
          }
        }
        let nowSupportContainerSizeTypes = []

        res.content.casScheduleLoadingDTOList.forEach(val => {
          let returnAddressList = val.returnAddressList ? JSON.parse(val.returnAddressList) : []
          let returnAddressListArr = []
          let returnAddressListArrName = []
          returnAddressList.map(item => {
            returnAddressListArr.push(`${item.yardCode},${item.yardName},${item.yardAddress}`)
            returnAddressListArrName.push(item.yardName)
          })
          val.returnAddressListArr = returnAddressListArr
          val.returnAddressListArrName = returnAddressListArrName.join(',')
          // 用箱计划
          val.casLoadingContainerPlanList.forEach(item => {
            if (!val.casLoadingContainerPlanListArr) {
              val.casLoadingContainerPlanListArr = {}
            }
            if (!val.supportContainerSizeTypes) {
              val.supportContainerSizeTypes = []
            }
            if (!val.containerOwner) {
              val.containerOwner = null
            }

            val.supportContainerSizeTypes.push(item.containerType)
            this.$set(val.casLoadingContainerPlanListArr, item.containerType, item.quantity)

            nowSupportContainerSizeTypes = lodash.union(nowSupportContainerSizeTypes, val.supportContainerSizeTypes)
          })
          val.oldAtd = lodash.cloneDeep(val.atd)
          // val.returnAddressList = JSON.parse(val.returnAddressList)
          // this.$nextTick(() => {
          //   this.nowSupportContainerSizeTypes = nowSupportContainerSizeTypes
          //   Object.keys(row.casLoadingContainerPlanListArr).map(key => {
          //     if (val.indexOf(key) === -1 && row.casLoadingContainerPlanListArr[key]) {
          //       delete row.casLoadingContainerPlanListArr[key]
          //     }
          //   })
          // })
        })
        this.nowSupportContainerSizeTypes = nowSupportContainerSizeTypes

        this.$copyProps(this.formData, res.content)
        this.vesselNameTemp = this.$extends({}, res.content)
        this.list()

        if (this.formData.casScheduleDischargeDTOList.length >= 1) {
          this.$watch(function () {
            return this.formData.casScheduleDischargeDTOList[0].portCode
          }, function (old, valold) {
            // this.getRouteDirectionApi()
          })
        }

      }
    },
    /**
     * 选中船司
     */
    selected(data) {
      if (this.$isEmpty(data)) {
        this.formData.chineseName = ''
        this.formData.englishName = ''
        this.formData.carrierId = ''
        this.formData.nameStr = ''
      } else {
        this.formData.chineseName = data.chineseShortname
        this.formData.englishName = data.englishShortname
        this.formData.carrierId = data.id
        this.formData.nameStr = data.chineseShortname + '/' + data.englishShortname
      }
      this.updateBaseData()
    },
    /**
     * 增加装货港
     */
    addCasSchedule() {
      const casScheduleObj = {
        id: null,
        cnPortName: '',
        enPortName: '',
        portCode: '',
        countryCode: '',
        cityCode: '',
        cityDesc: '',
        isEdit: true,
        isAdd: true,
        isCurrentEdit: true,
        bookingConfirmIllustration: '',
        cyOpenDate: '',
        cyCutDate: '',
        siCutDate: '',
        vgmCutDate: '',
        cusCutDate: '',
        etd: '',
        atd: '',
        bookingEndDate: '',
        editAble: true,
        cyOpenName: '',
        returnAddressListArr: [],
        supportContainerSizeTypes: [],
        isAddPlan: true
      }
      this.formData.casScheduleLoadingDTOList.push(casScheduleObj)
      this.edit = true
      this.$nextTick(() => {
        const $table = this.$refs.table
        $table.toggleRowExpansion(this.formData.casScheduleLoadingDTOList[this.formData.casScheduleLoadingDTOList.length - 1], true)
      })
    },
    /**
     * 保存数据
     */
    saveCasScheduleBefore(row, type, dataList) {
      if (!row.oldAtd && row.atd) {
        this.$confirm(this.$t('boatEtdList.ATDConfirmTips'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.saveCasSchedule(row, type, dataList)
        }).catch(() => {
        })
      } else {
        this.saveCasSchedule(row, type, dataList)
      }
    },
    async saveCasSchedule(row, type, dataList) {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          if (this.$isNotEmpty(row.supportContainerSizeTypes)) {
            row.supportContainerSizeType = row.supportContainerSizeTypes.join(',')
          }
          let arr = this.$extends([], dataList)
          // 排除正在操作的这条数据
          arr = arr.filter(item => !item.isCurrentEdit)
          // 判断是否有重复港口
          const dataItem = arr.find(item => item.enPortName === row.enPortName)
          // 装货港和卸货张港校验重复港口的问题
          if (this.$isNotEmpty(dataItem) && (type === 1 || type === 3)) {
            const msg = row.enPortName + this.$t('boatEtdList.duplicatePortErrorText')
            row.enPortName = null
            this.$alert(msg, {
              confirmButtonText: this.$t('common.confirmBtn')
            })
            return
          }
          // 装货港用箱计划
          if (type === 1) {
            row.casLoadingContainerPlanList = []
            console.log(row)
            if (row.containerOwner === 2) {
              let isNull = Object.keys(row.casLoadingContainerPlanListArr).every(key => !row.casLoadingContainerPlanListArr[key] || Number(row.casLoadingContainerPlanListArr[key]) === 0)
              console.log(isNull)
              if (isNull) {
                this.$message.warning(this.$t('boatEtdList.ownerNameMixinPlanEmptyInvalid'))
                return
              }
            }
            Object.keys(row.casLoadingContainerPlanListArr).map(key => {
              row.casLoadingContainerPlanList.push({
                containerType: key,
                quantity: row.casLoadingContainerPlanListArr[key]
              })
            })
            if (typeof row.returnAddressList === 'string') {
              row.returnAddressList = JSON.parse(row.returnAddressList)
            }
            // delete row.casLoadingContainerPlanListArr
            // delete row.returnAddressListArr
          }
          // So 规则设置可用So 数量
          if (type === 4) {
            const flag = this.calcSoNumber(row)
            if (!flag) {
              return
            }
          }
          if (this.$isNotEmpty(this.id)) {
            // 调用接口保存单条数据
            let Interface = null
            switch (type) {
              case 1:
                Interface = saveScheduleLoading
                break
              case 2:
                Interface = savePickReturnAddress
                break
              case 3:
                Interface = saveDischarge
                break
              case 4:
                Interface = this.$isNotEmpty(row.id) ? updateNumberSegment : saveNumberSegment
                break
              default:
                return
            }
            row.sailingId = this.id
            this.loading = true
            Interface(row).then(res => {
              if (res.ok) {
                const $table = this.$refs.table
                $table.toggleRowExpansion(row, false)
                row.id = res.content.id
                // 全局的编辑状态
                this.edit = false
                // 当前行是否为编辑状态
                row.isEdit = false
                // so规则的状态
                row.edit = false
                // 当前行是否为新增行状态
                row.isAdd = false
                // 用箱计划
                row.isAddPlan = false
                // 正在操作的行
                row.isCurrentEdit = false
                if (type === 4) {
                  this.list()
                }
                if (this.USLCodeArr.indexOf(row.portCode) > -1) {
                  this.updateBaseData('mblPrefix')
                  this.loading = false
                } else {
                  this.loading = false
                }
              } else {
                this.loading = false
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            row.isEdit = false
            row.edit = false
            row.isAdd = false
            row.isCurrentEdit = false
            if (type === 1) {
              row.id = new Date().getTime()
            }
            this.edit = false
            const $table = this.$refs.table
            $table.toggleRowExpansion(row, false)
          }
        } else {
          this.mixinsFormScrollIntoView()
          return false
        }
      })
    },
    /**
     * 取消保存装货港
     */
    cancleCasSchedule(row, index, dataList) {
      // 如果是取消新增项直接删除
      if (row.isAdd) {
        dataList.splice(index, 1)
      } else {
        // 还原历史数据
        this.$copyProps(row, this.temObj)
        this.checkMBLPrefix()
        this.$set(row, 'isEdit', false)
        if (row.edit) {
          row.edit = false
        }
        const $table = this.$refs.table
        $table.toggleRowExpansion(row, false)
        row.isCurrentEdit = false
      }
      this.supportContainerSizeTypesChange(row, row.supportContainerSizeTypes)
      this.edit = false
    },
    /**
     * 编辑装货港
     */
    editCasSchedule(row) {
      this.$set(row, 'isEdit', true)
      this.$set(row, 'isCurrentEdit', true)
      if (row.type === 2) {
        this.$set(row, 'edit', true)
      }
      if (!row.bookingConfirmIllustration) {
        this.$set(row, 'bookingConfirmIllustration', '')
      }
      this.edit = true
      this.temObj = lodash.cloneDeep(row)
      const $table = this.$refs.table
      this.$nextTick(() => {
        $table.toggleRowExpansion(row, true)
      })
    },
    checkMBLPrefix(type) {
      if (type === 3) {
        const isUSA = this.formData.casScheduleDischargeDTOList.some(item => this.USLCodeArr.indexOf(item.portCode) > -1)
        if (isUSA) {
          this.showMBLPrefix = true
          if (!this.formData.mblPrefix) {
            return false
          }
        } else {
          this.$set(this.formData, 'mblPrefix', '')
          this.showMBLPrefix = false
        }
        return true
      }
    },
    /**
     * 删除列表数据
     */
    delCasSchedule(index, dataList, id, type) {
      // 编辑页面直接通过接口删除
      if (this.$isNotEmpty(this.id)) {
        // 调用接口删除单条数据
        let Interface = null
        switch (type) {
          case 1:
            Interface = delScheduleLoading
            break
          case 2:
            Interface = delPickReturnAddress
            break
          case 3:
            Interface = delDischarge
            break
          case 4:
            Interface = delNumberSegment
            break
          default:
            return
        }
        Interface(id).then(res => {
          if (res.ok) {
            dataList.splice(index, 1)
            this.checkMBLPrefix(type)
          }
        })
      } else {
        dataList.splice(index, 1)
        this.checkMBLPrefix(type)
      }
    },
    /**
     * 提箱点使用SO规则 禁用装货港口编辑
     */
    disabledEdit(row) {
      // 提箱点中被使用
      // const dataItem = this.formData.casPickReturnAddressDTOList.find(item => item.enPortName === row.enPortName)
      // SO规则中被使用
      const dataSailingItem = this.formData.casSailingNumberSegmentRequestDTOList.find(item => item.polEnName === row.enPortName)
      // this.$isNotEmpty(dataItem) ||
      return this.$isNotEmpty(dataSailingItem)
    },
    /**
     * 选中装货港
     */
    getItemFromChild(val, row) {
      row.cnPortName = val.chineseName
      row.enPortName = val.englishName
      row.portCode = val.code5
      row.countryCode = val.countryCode
      row.cityCode = val.cityCode
      row.cityDesc = val.cityDesc

    },
    /**
     * 设置中转港
     */
    setCnPortTransit(val, row) {
      if (val === this.$t('common.nullText')) {
        row.cnPortTransitName = this.$t('common.nullText')
        row.enPortTransitName = this.$t('common.nullText')
        row.portCodeTransit = null
      } else {
        const selectedData = this.filterCasScheduleLoadingDTOList.find(item => item.enPortName === val)
        row.cnPortTransitName = selectedData.cnPortName
        row.enPortTransitName = selectedData.enPortName
        row.portCodeTransit = selectedData.portCode
      }
    },
    /**
     * 当前卸货港港口是否被使用
     */
    isUse(enPortName) {
      if (this.$isEmpty(enPortName)) {
        return false
      }
      // 中转港是否被使用
      const itemData = this.formData.casScheduleDischargeDTOList.find(item => item.enPortTransitName === enPortName)
      // so规则中被使用
      const soRulesData = this.formData.casSailingNumberSegmentRequestDTOList.find(item => item.podEnName === enPortName)
      return this.$isNotEmpty(itemData) || this.$isNotEmpty(soRulesData)
    },
    isUseFlag(enPortName) {
      if (this.$isEmpty(enPortName)) {
        return false
      }
      // 中转港是否被使用
      const itemData = this.formData.casScheduleDischargeDTOList.find(item => item.enPortTransitName === enPortName)
      return this.$isNotEmpty(itemData)
    },
    /**
     * 设置提箱点港口信息
     */
    setAddressProt(row) {
      const dataItem = this.formData.casScheduleLoadingDTOList.find(item => item.enPortName === row.enPortName)
      row.cnPortName = dataItem.cnPortName
      row.portCode = dataItem.portCode
    },
    /**
     * 设置代理信息
     */
    setPartnerAdv(val, row) {
      row.dischargeAgentId = val.id
      row.dischargeAgentMessage = val.memberName
    },
    /**
     * 增加提还箱点
     */
    addCasPickReturnAddress() {
      const casScheduleObj = {
        id: null,
        cnPortName: '',
        enPortName: '',
        pickUpAddr: '',
        returnAddr: '',
        portCode: '',
        supportContainerSizeTypes: [],
        supportContainerSizeType: '',
        cityCode: '',
        cityDesc: '',
        isEdit: true,
        isAdd: true,
        isCurrentEdit: true
      }
      this.formData.casPickReturnAddressDTOList.push(casScheduleObj)
      this.edit = true
    },
    /**
     *获取集装箱型
     */
    getContainer() {
      getContainerTypeList().then(res => {
        this.cntrOpts = res.content
      })
    },
    dataFilter(val) {
      if (val) { // val存在
        // this.cntrOpts2 = this.optionsCopy;
        this.cntrOpts2 = this.cntrOpts.filter(item => {
          if (!!~item.englishName.indexOf(val) || !!~item.englishName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else { // val为空时，还原数组
        this.cntrOpts2 = this.cntrOpts2Copy
      }
    },
    /**
     *获取代理列表数据
     */
    async getPartnerAdv(params, row) {
      const { keyword } = params
      const data = {
        portCode: row.portCode,
        keyword,
        searchItemList: []
      }
      return partnerAdvNew(data)
    },
    /**
     * 增加卸货港
     */
    addScheduleDischarge() {
      const casScheduleObj = {
        id: null,
        cnPortName: '',
        enPortName: '',
        portCode: '',
        countryCode: '',
        cnPortTransitName: '',
        enPortTransitName: '',
        portCodeTransit: '',
        transitFlag: null,
        eta: '',
        ata: '',
        dischargeAgentId: null,
        dischargeAgentMessage: '',
        cityCode: '',
        cityDesc: '',
        isEdit: true,
        isAdd: true,
        isCurrentEdit: true

      }
      this.formData.casScheduleDischargeDTOList.push(casScheduleObj)
      if (this.formData.casScheduleDischargeDTOList.length === 1) {
        this.$watch(function () {
          return this.formData.casScheduleDischargeDTOList[0].portCode
        }, function (old, valold) {
          // this.getRouteDirectionApi()
        })
      }
      this.edit = true
    },
    /**
     * 增加SO
     */
    addSailingNumberSegment() {
      const casScheduleObj = {
        id: null,
        sailingId: null,
        status: 0, // 0 未发布 1 是已发布
        polCode: '',
        polCnName: '',
        polEnName: '',
        podCode: '',
        podCnName: '',
        podEnName: '',
        type: null,
        startNo: '',
        endNo: null,
        step: null,
        total: null,
        isEdit: true,
        isAdd: true,
        isCurrentEdit: true,
        edit: false
      }
      this.formData.casSailingNumberSegmentRequestDTOList.push(casScheduleObj)
      this.edit = true
    },
    /**
     * 保存数据
     */
    saveForm(refName) {

      this.$refs[refName].validate(valid => {
        if (valid) {
          if (this.$isEmpty(this.formData.casScheduleDischargeDTOList)) {
            this.$message.warning(this.$t('boatEtdList.podCodeInfoError'))
            return
          }
          if (this.$isEmpty(this.formData.casScheduleLoadingDTOList)) {
            this.$message.warning(this.$t('boatEtdList.polCodeInfoError'))
            return
          }
          // if (this.$isEmpty(this.formData.casPickReturnAddressDTOList)) {
          //   this.$message.warning('请维护提还箱点信息')
          //   return
          // }
          this.formData.casScheduleLoadingDTOList.map(val => {
            val.casLoadingContainerPlanList = []
            Object.keys(val.casLoadingContainerPlanListArr).map(key => {
              val.casLoadingContainerPlanList.push({
                containerType: key,
                quantity: val.casLoadingContainerPlanListArr[key]
              })
            })
          })
          // eslint-disable-next-line no-return-assign
          this.formData.casScheduleLoadingDTOList.map(item => item.id = null)
          this.loading = true
          saveScheduleInfo(this.formData, null).then(res => {
            if (res.ok) {
              this.loading = false
              this.$message.success(this.$t('charteredBoat.saveSuccess'))
              this.backList()
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.mixinsFormScrollIntoView()
          return false
        }
      })
    },
    /**
     * 更新基础数据
     */
    updateBaseData(key) {
      if (this.$isNotEmpty(this.id)) {
        if (key && this.vesselNameTemp[key] === this.formData[key]) {
          return
        }
        const data = {
          voyageNo: '',
          vesselName: '',
          carrierId: '',
          englishName: '',
          chineseName: '',
          callSign: '',
          // routeCode: '',
          id: null,
          mblPrefix: '',
          teu: null
        }
        this.$copyProps(data, this.formData)
        this.$refs.formData.validate(valid => {
          if (valid) {
            updateBaseData(data).then(res => {
              if (res.ok) {
                if (key) {
                  this.vesselNameTemp[key] = this.formData[key]
                }
              } else {
                if (key) {
                  this.formData[key] = this.vesselNameTemp[key]
                }
              }
            })
          } else {
            return false
          }
        })
      }
    },
    /**
     * 返回列表
     */
    backList() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `ETDList` })
    },
    /**
     * 取消操作
     */
    cancle() {
      this.$confirm(this.$t('boatEtdList.unSaveWarnningTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.backList()
      }).catch(() => {
      })
    },
    /**
     * 计算SO可用数量
     */
    calcSoNumber(row) {
      if (row.type === 1) {
        // 如果使用一海通
        return true
      }
      // 转大写
      row.startNo = row.startNo.toUpperCase()
      row.endNo = row.endNo.toUpperCase()
      const minStr = row.startNo
      const maxStr = row.endNo
      if (this.$isEmpty(minStr) || this.$isEmpty(maxStr)) {
        return false
      }
      const min = Number(minStr.match(/\d+/g).pop())
      const max = Number(maxStr.match(/\d+/g).pop())
      if (max < min + Number(row.step)) {
        this.$alert(this.$t('boatEtdList.soNoErrorText'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return false
      } else {
        // 计算向下取整
        const cnt = Math.floor((max - min) / Number(row.step))
        row.total = cnt + 1
        return true
      }
    },
    /**
     * SO装货港变更
     */
    selectChange(val, row) {
      // 选中的装货港SO规则
      const arr = this.formData.casSailingNumberSegmentRequestDTOList.filter(item => item.polEnName === val && !item.isCurrentEdit)
      // 选中的装货港SO规则且使用一海通
      const dataItem = arr.find(item => item.type === 1)
      // 如果当前选中的装货港存在使用一海通规则的号段
      if (this.$isNotEmpty(dataItem)) {
        const msg = val + this.$t('boatEtdList.duplicateRuleError')
        this.$alert(msg, {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        row.polEnName = ''
        row.polCnName = ''
        row.polCode = ''
        return
      } else if (this.$isNotEmpty(arr)) {
        row.type = 2
        row.edit = true
      }
      const selectDataItem = this.formData.casScheduleLoadingDTOList.find(item => item.enPortName === row.polEnName)
      row.polCode = selectDataItem.portCode
      row.polCnName = selectDataItem.cnPortName
    },
    /**
     *so规则 卸货港变更
     */
    disPortChange(val, row) {
      const dataItem = this.formData.casScheduleDischargeDTOList.find(item => item.enPortName === val)
      if (this.$isNotEmpty(dataItem)) {
        row.podCode = dataItem.portCode
        row.podEnName = dataItem.enPortName
        row.podCnName = dataItem.cnPortName
      }
    },
    /**
     * SO规则变更
     */
    rulesChange(row) {
      if (this.$isEmpty(row.type)) {
        return
      }
      if (row.type === 1) {
        row.podEnName = ''
        row.podCnName = ''
        row.startNo = ''
        row.endNo = ''
        row.step = 1
        row.total = ''
        row.status = 1
        row.edit = false
      } else {
        row.podEnName = ''
        row.podCnName = ''
        row.startNo = ''
        row.endNo = ''
        row.step = ''
        row.total = ''
        row.status = 0
        row.edit = true
      }
    },
    /**
     * so规则 使用一海通禁用
     */
    rulesDisabled(row) {
      const dataItem = this.formData.casSailingNumberSegmentRequestDTOList.find(item => row.polEnName === item.polEnName && !item.isCurrentEdit)
      return this.$isNotEmpty(dataItem)
    },
    /**
     * so规则发布
     */
    async publishNumber(id) {
      const res = await publishNumberSegment(id)
      if (res.ok) {
        this.$message.success(this.$t('common.publishedSuccess'))
        this.list()
      }
    },
    /**
     * 获取so 列表
     */
    async list() {
      const res = await numberSegmentList(this.id)
      if (res.ok) {
        this.formData.casSailingNumberSegmentRequestDTOList = res.content || []
      }
    }
  }
}
</script>

<style scoped lang="less">
.table-item {
  margin-bottom: 48px;
}
.bookingConfirmation{
  margin-left: -38px;
  ::v-deep .el-form-item__error {
    padding-top: 4px;
  }
}
::v-deep .el-form-item__error {
  padding-top: 4px;
}
.SOnumberSegment{
  width: 430px;
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
.table-item-unloading {
  ::v-deep .cell{height: 100%;}
  ::v-deep td{ padding: 0;height: 65px; padding-top: 12px;}
  ::v-deep .el-form-item__error{ padding: 0}

}
::v-deep .gray-row {
  color: #ddd
}
.table-plan.el-table:before{ display: none}

.pageFooter {
  position: fixed;
  right: 0px;
  height: 60px;
  display: flex;
  padding-right: 60px;
  align-items: center;
  justify-content: flex-end;
  background-color: #fff;
  z-index: 20;
  bottom: 0px;
  width: 100%;
}
</style>
