<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #single>
        <div class="right-search-input-wrap">
          <el-input v-model="singleSearchStr" size="mini" type="text" @keyup.enter.native="singleSearchSubmit" />
        </div>
      </template>
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('boatContainerList.soNo')}: `" prop="soNo">
              <el-input v-model="multipleForm.soNo" type="text" size="mini" clearable :placeholder="$t('boatContainerList.soNoPlaceholder')" @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.containerNo')}: `" prop="containerNo">
              <el-input v-model="multipleForm.containerNo" type="text" size="mini" clearable :placeholder="$t('charteredBoat.containerNoPlaceholder')" @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.blNo')}: `" prop="blNo">
              <el-input v-model="multipleForm.blNo" type="text" size="mini" clearable :placeholder="$t('boatContainerList.blNoPlaceholder')" @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vessel" type="text" size="mini" clearable :placeholder="$t('boatContainerList.vesselNamePlaceholder')" @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
              <el-input v-model="multipleForm.voyage" type="text" size="mini" clearable :placeholder="$t('boatContainerList.voyageNoPlaceholder')" @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('boatContainerList.containerStatus')}: `" prop="containerStatus">
              <el-select v-model="multipleForm.containerStatus" :placeholder="$t('common.placeholder')" @change="topSearch" size="mini">
                <el-option key="" value="" :label="$t('common.all')"></el-option>
                <el-option key="0" value="1" :label="$t('boatContainerList.normal')"></el-option>
                <el-option key="1" value="3" :label="$t('boatContainerList.clearance')"></el-option>
                <el-option key="2" value="2" :label="$t('boatContainerList.removed')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.serialNo')}: `" prop="serialNo">
              <el-input v-model="multipleForm.serialNo" type="text" size="mini" clearable :placeholder="$t('boatContainerList.serialNoPlaceholder')" @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.memberName')}: `" prop="memberId">
              <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" @selectorChange="topSearch" :remoteApi="remoteApi" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.blStatus')}: `" prop="blStatus">
              <BLStatusSelector v-model="multipleForm.blStatus" @selectorChange="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('boatContainerList.trailerStatus')}: `" prop="trailerStatus">
              <FleetStatusSelector v-model="multipleForm.trailerStatus" @selectorChange="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.polCode')}: `" prop="polCode">
              <cargo-advance-select
                ref="polCodeSelect"
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{getItemFromChild(data,'polCode')}"
              />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.podCode')}: `" prop="podCode">
              <cargo-advance-select
                ref="podCodeSelect"
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{getItemFromChild(data,'podCode')}"
              />
            </el-form-item>
            <el-form-item :label="`${$t('boatContainerList.VGMStatus')}: `" prop="vgmStatus">
              <VGMStatusSelector v-model="multipleForm.vgmStatus" @selectorChange="topSearch" />
            </el-form-item>
            <el-form-item :label="$t('blInfo.daysOverdue')+':'" prop="vgmStatus">
              <div style="display: flex">
                <el-select v-model="multipleForm.overdueCondition" size="mini" :default-first-option="true" @change="overdueConditionChange" style="width: 90px; margin-right: 5px ">
                  <el-option value="" label="空"/>
                  <el-option value="=" label="等于"/>
                  <el-option value="<" label="小于"/>
                  <el-option value=">" label="大于"/>
                </el-select>
                <el-input v-trim v-model="multipleForm.overdueDays" :disabled="!multipleForm.overdueCondition" v-input-limit="[9,0]" type="number" size="mini" style="width: 85px;" clearable placeholder="" @keyup.enter.native="topSearch" @clear="topSearch" />
              </div>
              </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="multipleSearch">
          {{$t('common.searchBtn')}}
        </el-button>
        <el-button size="mini" icon="el-icon-refresh-left" @click="clearSearchForm">{{$t('common.resetBtn')}}</el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap">
      <el-dropdown style="margin-right: 10px;" @command="handleCommand">
        <el-button type="primary" size="mini">
          {{$t('common.download')}} <i class="el-icon-arrow-down" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="casOrder">{{$t('boatContainerList.soList')}}</el-dropdown-item>
          <el-dropdown-item command="VGM">{{$t('boatContainerList.VGMList')}}</el-dropdown-item>
           <el-dropdown-item command="Overdue">{{ $t('blInfo.containerOverdueList') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" icon="el-icon-upload2" size="mini" @click="toggleInputDialog">{{$t('common.importData')}}</el-button>
      <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="checkBLList">{{$t('boatContainerList.checkBlList')}}</el-button>
      <el-button type="primary" icon="el-icon-connection" size="mini" @click="openPool">{{$t('boatContainerList.splitOrMergeBL')}}</el-button>
<!--      <el-button type="primary" icon="el-icon-delete" size="mini" @click="checkDelete">删除</el-button>-->
<!--      <el-button type="primary" icon="el-icon-document-delete" size="mini" @click="markExit">标记退关</el-button>-->
      <el-dropdown style="margin-left: 10px;" @command="checkDeleteAndCancellation">
        <el-button type="primary" size="mini">
          {{$t('boatContainerList.removeOrClearance')}}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item  command="1">{{$t('common.deleteBtn')}}</el-dropdown-item>
          <el-dropdown-item command="2">{{$t('boatContainerList.clearance')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown style="margin:0 10px;" @command="changeOrderCommand">
        <el-button type="primary" size="mini">
          {{$t('boatContainerList.changeOrder')}}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item  command="1">{{$t('boatContainerList.changeOwner')}}</el-dropdown-item>
          <el-dropdown-item command="2">{{$t('boatContainerList.changeContainerNo')}}</el-dropdown-item>
          <el-dropdown-item command="3">{{$t('boatContainerList.changeSailing')}}</el-dropdown-item>
          <el-dropdown-item command="4">{{$t('boatContainerList.changePol')}}</el-dropdown-item>
          <el-dropdown-item command="5">{{$t('boatContainerList.changePickUpPoint')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" icon="el-icon-connection" size="mini" @click="adjustmentFreeDays">{{$t('blInfo.adjustmentFreeDays')}}</el-button>
      <div v-if="batchPrintMultipleForm.vessel && batchPrintMultipleForm.voyage" class="statistics">
        {{$t('boatContainerList.normal')}}：{{$isEmpty(statistic.normalCopy) ? $t('boatContainerList.emptyData') : statistic.normalCopy.join(',') }}
        <span>{{$t('boatContainerList.clearance')}}： {{$isEmpty(statistic.shutOutCopy) ? $t('boatContainerList.emptyData') : statistic.shutOutCopy.join(',')}}</span>
      </div>

      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        style="width:100%; height:calc(100vh - 440px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="pageSize" :page.sync="currPage" @pagination="getDataList" />
    </div>
    <div v-show="showContainerPool" class="container-pool-wrap">
      <ContainerPools :pools="selectedItems" @deleteNo="deleteSelectedItems" @openMergeDialog="openMergeDialog" @closeWindow="closePool" />
    </div>
    <el-dialog
      :visible.sync="showInputDialog"
      :title="$t('common.importData')"
      width="500px"
      :before-close="closeUploadDialog"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item :label="$t('boatContainerList.importContent')" required>
          <el-radio v-model="inputType" label="1">{{$t('boatContainerList.pickUpData')}}</el-radio>
          <el-radio v-model="inputType" label="2">{{$t('boatContainerList.returnData')}}</el-radio>
<!--          <el-radio v-model="inputType" label="3">目的港动态</el-radio>-->
        </el-form-item>
      </el-form>
      <div class="opt-wrap">
        <el-button size="small" @click="downloadExcel">{{$t('boatContainerList.downloadTemplate')}}</el-button>
        <ExcelUpload
          ref="excelUpload"
          :upload-radio-type="inputType"
          :can-be-upload="canBeUpload"
          @uploadSuccess="uploadSuccess"
          @uploadError="uploadError"
          @uploadExceed="uploadExceed"
          @setUploadStatus="setUploadStatus"
        />
      </div>
      <div class="footer-btn">
        <el-button size="small" @click="showInputDialog = false">{{$t('common.closed')}}</el-button>
        <el-button type="primary" size="small" @click="uploadFile">{{$t('common.uploadBtn')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="merge-dialog"
      :visible.sync="showMergeDialog"
      :title="$t('boatContainerList.splitOrMergeBL')"
      :before-close="closeMergeDialog"
      :close-on-click-modal="false"
      width="600px"
    >
      <ContainerMerger
        :containers="selectedItems"
        @deleteNo="deleteSelectedItems"
        @closeDialog="containersMergeFinished"
      />
    </el-dialog>

    <el-dialog
      :visible.sync="showSailingScheduleDialog"
      :title="$t('boatContainerList.changeSailing')"
      width="600px"
      :before-close="ChangeSailingCancel"
    >
      <div style="width: 90%">
        <div style="display: flex; justify-content: space-between">
          <div style="display: flex">{{$t('boatContainerList.originalVessel')}}: <div style="max-width: 200px">{{ changeSailingListVal.vessel }}</div></div>
          <div style="display: flex">{{$t('boatContainerList.originalVoyage')}}: <div style="max-width: 200px">{{ changeSailingListVal.voyage }}</div></div>
          <div style="display: flex">{{$t('charteredBoat.containerType')}}: <div style="max-width: 200px">{{ changeSailingListVal.containerType }}</div></div>
        </div>
        <el-form ref="formSailingSchedule" :model="formSailingSchedule" label-position="top" style="margin-top: 10px;">
          <el-form-item :label="$t('boatContainerList.sailingLabel')" prop="sailingId" :rules="[{ required: true, message: $t('common.placeholder') }]">
            <!--            所选集装箱所关联的提单下存在其他集装箱，船期不同无法共用一个提单，请先通过提单拆合功能生成独立提单，再进行改船操作！-->
            <el-select v-model="formSailingSchedule.sailingId" :placeholder="$t('common.placeholder')" style="width: 450px;">
              <el-option
                v-for="(item,index) in formSailingScheduleOptions"
                :key="index"
                multiple
                :label="`${item.vessel}/${item.voyage}/${ $moment(Number(item.etd)).format('YYYY-MM-DD HH:mm:ss') }`"
                :value="item.sailingId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="chargeOrderFlag">
            <el-checkbox v-model="formSailingSchedule.chargeOrderFlag">{{ $t('boatContainerList.synchronousChangeOfSoShippingDateInformation') }}</el-checkbox>
          </el-form-item>
        </el-form>
      </div>

      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitChangeSailing">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="small" @click="ChangeSailingCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="suitcaseDialog"
      v-if="suitcaseDialog"
      :title="$t('boatContainerList.changeOwner')"
      width="1300px"
      :before-close="suitcaseCancel"
      v-loading="loading"
    >
      <el-form ref="suitcaseFrom" :model="suitcaseFrom" label-position="right" label-width="100px" style="margin-top: 10px;">
        <el-form-item label="SO" prop="socFlag" style="margin-bottom: 0">
          {{suitcaseFrom.soNo}}
        </el-form-item>
        <el-form-item :label="$t('charteredBoat.typeAndQuantity')" prop="socFlag" style="margin-bottom: 0">
          {{suitcaseFrom.containerTypeAndQty}}
        </el-form-item>
        <el-form-item :label="$t('charteredBoat.ownerName')" prop="socFlag" :rules="[{ required: true, message: $t('common.placeholder') }]" style="margin-bottom: 0">
          <el-radio-group v-model="suitcaseFrom.socFlag" :disabled="true" >
            <el-radio :label="1">SOC</el-radio>
            <el-radio :label="0">COC</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="color: red; margin-top: 15px; padding-left: 56px">
          <p>{{$t('boatContainerList.changeOwnerNotice1')}}</p>
          <p style="text-indent: 3em">{{$t('boatContainerList.changeOwnerNotice2')}}</p>
        </div>
        <template v-if="suitcaseFrom.socFlag === 0">
            <el-form-item :label="$t('boatContainerList.operationTactics')" prop="distributeType" >
              <el-radio-group v-model="suitcaseFrom.distributeType" @change="initDistribute">
                <el-radio :label="1">{{$t('boatContainerList.socFlagOneYard')}}</el-radio>
                <el-radio :label="2">{{$t('boatContainerList.socFlagMultipleYard')}}</el-radio>
                <el-radio :label="3">{{$t('boatContainerList.socFlagCustom')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-table  class="dataTable" :data="suitcaseFrom.distributeList" ref="distributeTable" style="margin-left: 120px;width: 1050px">
            <el-table-column :label="$t('boatContainerList.pickUpAddress')" prop="yardName" align="center"  width="150"></el-table-column>
            <el-table-column :label="$t('charteredBoat.containerType')" prop="containerType" align="center"  width="150"></el-table-column>
            <el-table-column :label="$t('boatContainerList.numberFromContainerManager')" prop="releaseQuantity" align="center"  width="150"></el-table-column>
            <el-table-column :label="$t('boatContainerList.released')" prop="spaceQuantity" align="center"  width="150"></el-table-column>
            <el-table-column :label="$t('boatContainerList.leftContainer')" prop="surplusQuantity" align="center"  width="150"></el-table-column>
            <el-table-column :label="$t('boatContainerList.allotPickupAddress')" prop="distributeFlag" align="center"  width="150">
              <template slot-scope="{row}">
                <span v-if="row.distributeFlag && suitcaseFrom.distributeType !==3">✔</span>
                <span v-if="suitcaseFrom.distributeType ===3">
                      <el-checkbox v-model="row.distributeFlag" label="" name="checkListFee" :disabled="!row.hasSomeType || row.surplusQuantity ===0" @change="distributeFlagChange(row)" />
                    </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('boatContainerList.currentSOAllotNumber')" prop="distributeQuantity" align="center" width="150">
              <template slot-scope="{row,$index}">
                <span v-if="suitcaseFrom.distributeType !==3 || (!row.distributeFlag && suitcaseFrom.distributeType !==2 )">{{row.distributeQuantity}}</span>
                <el-form-item v-else label="" :prop="'distributeList.' + $index + '.distributeQuantity'" :rules="[{required:true,message:''}]" label-width="0" >
                  <el-input v-model.number="row.distributeQuantity" v-input-limit="[9,0]" size="mini"  type="text" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </template>

            </el-table-column>
          </el-table>

          <div  style="color: red; font-size: 12px; padding-left: 120px">
            <p v-show="suitcaseFrom.containerNotEnough">{{ suitcaseFrom.containerNotEnough }}</p>
            <p v-show="suitcaseFrom.containerNotRelease">{{ suitcaseFrom.containerNotRelease }}</p>
          </div>

        </template>
      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitChangeSuitcase">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="small" @click="suitcaseCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
<!--     <suitcase :data="suitcase.list" :type="2" :container-size-type-qty="suitcase.containerSizeTypeQty" :visible.sync="suitcase.showDialog" :serial-no="suitcase.serialNo" :sailing-id="suitcase.sailingId" :pol-code="suitcase.polCode" @success="allotSuitcaseSuccess" />-->
    </el-dialog>

    <el-dialog
      :visible.sync="changeNoDialog"
      v-if="changeNoDialog"
      :title="$t('boatContainerList.changeContainerNo')"
      width="750px"
      :before-close="changeNoCancel"
    >
      <el-form ref="changeNoForm" :model="changeNoForm" label-position="right" label-width="100px" style="margin-top: 10px; max-height: 300px; overflow: auto">
        <div v-for="(item,index) of changeNoForm.CasOrderContainerSimpleDTO" :key="index">
          <div class="change-no-list">
            <span style="line-height: 36px">EIR-ID：{{ item.eirId }}</span>
            <span style="line-height: 36px; margin-left: 15px">{{$t('charteredBoat.containerType')}}: {{ item.containerSizeType }}</span>
            <!--          -->
            <el-form-item :label="$t('charteredBoat.containerNo')" :prop="'CasOrderContainerSimpleDTO.' + index + '.newContainerNo'" :rules="validateContainerNo(item.containerSizeType)">
              <el-input v-trim v-model="item.newContainerNo" @change="changeNoFun(item)" onblur="value=value.toUpperCase()" :disabled="index != changeNoForm.CasOrderContainerSimpleDTO.length-1" size="mini"></el-input>
            </el-form-item>
          </div>
          <div v-if="index != changeNoForm.CasOrderContainerSimpleDTO.length-1" style="color: red">{{$t('common.noticeText')}}: {{$t('boatContainerList.containerNoConflict')}}</div>
        </div>

      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitChangeNo">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="small" @click="changeNoCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="podChangeDialog"
      v-if="podChangeDialog"
      :title="$t('boatContainerList.changePol')"
      width="650px"
      :before-close="changeNoCancel"
    >

        <div style="width: 80%">
          <div style="display: flex; justify-content: space-between">
            <div>{{$t('charteredBoat.vesselName')}}: {{ podChangeForm.vessel }}</div>
            <div>{{$t('charteredBoat.voyageNo')}}: {{ podChangeForm.voyage }}</div>
            <div>{{ podChangeForm.polCode }} - {{ podChangeForm.podCode }}</div>
          </div>
          <el-form ref="podChangeForm" :model="podChangeForm" label-position="top" style="margin-top: 10px;">
            <el-form-item :label="$t('boatContainerList.targetCity')" prop="id" :rules="[{ required: true, message: $t('common.placeholder') }]">
              <!--            所选集装箱所关联的提单下存在其他集装箱，船期不同无法共用一个提单，请先通过提单拆合功能生成独立提单，再进行改船操作！-->
              <el-select v-model="podChangeForm.id" :placeholder="$t('common.placeholder')" style="width: 450px;">
                <el-option
                  v-for="(item,index) in changePodList"
                  :key="index"
                  multiple
                  :label="`${item.enPortName} / ${item.portCode}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="chargeOrderFlag" >
              <el-checkbox v-model="podChangeForm.chargeOrderFlag">{{ $t('boatContainerList.synchronousChangeOfSoDestinationInformation') }}</el-checkbox>
            </el-form-item>
          </el-form>
<!--          <div v-if="changePodList && $isEmpty(changePodList)" style="color: red">所选集装箱所关联的提单下存在其他集装箱，目的港不同无法共用一个提单，请先通过提单拆合功能生成独立提单，再进行改港操作！</div>-->
        </div>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitPodChange">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="small" @click="CancelPodChange">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />
    <el-dialog
      :visible.sync="trajectoryDialog"
      v-if="trajectoryDialog"
      :title="$t('boatContainerList.containerTrail')"
      width="650px"
      :before-close="trajectoryCancel"
    >
      <div class="trajectory_box">
        <el-row class="trajectory_title">
          <el-col :span="12"><span>{{$t('charteredBoat.containerNo')}}: {{ trajectoryData.containerNo }}</span></el-col>
          <el-col :span="12"><span>{{ trajectoryData.newestName }}</span></el-col>
        </el-row>

        <div v-for=" (val, key, index) in trajectoryData.typeMap" :key="index">
          <div class="trajectory_child_title" v-if="Number(key) !== 2 || (Number(key)  === 2 && trajectoryData.transitCode)">
            <template v-if="Number(key) === 1">{{trajectoryPort[key]}} {{ trajectoryData.polCodeName }}</template>
            <template v-if="Number(key)  === 2">{{trajectoryPort[key]}} {{ trajectoryData.transitName }}</template>
            <template v-if="Number(key)  === 3">{{trajectoryPort[key]}} {{ trajectoryData.podName }}</template>
          </div>
          <el-timeline :reverse="reverse" v-if="Number(key)  !== 2 || (Number(key)  === 2 && trajectoryData.transitCode)">
            <el-timeline-item v-for="(item,index) in val" :color="item.sort | colorFilter(vm)" :key="index">
              <div>{{item.trackingStatusName.split('_')[1]}}</div>
              <div class="time_box">
                <div>{{item.happenedTimeFormat}}</div>
                <div v-if="item.trackingStatus ===2">{{trajectoryData.returnAddr}}</div>
                <div v-if="item.trackingStatus ===3 || item.trackingStatus ===7">{{trajectoryData.vessel}} / {{trajectoryData.voyage}}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="footer-btn">
        <el-button size="small" @click="trajectoryCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
<!--    免柜天数-->
    <el-dialog
      :visible.sync="freeDayDialog"
      v-if="freeDayDialog"
      :title="$t('blInfo.adjustmentFreeDays')"
      width="650px"
      :before-close="freeDayCancel"
      v-loading="loading"
    >

      <div style=" margin: 0 auto">
        <el-form ref="freeDayForm" :model="freeDayForm" label-position="top" style="margin-top: 10px;">
          <el-tabs type="card" v-model="editableTabsValue" :stretch="true" class="editableTabs"  @tab-click="tavClick" :before-leave="tabLeave">
            <el-tab-pane class="custom-tree" :label="$t('blInfo.customerDimension')" name="1">
              <div v-for="(item,i) in freeDayForm.customerList" :key="i" class="customerList">
                <div class="memberName">{{item.memberName}}</div>
                <el-form-item label="" :prop="'customerList.' + i + '.freeDays'" :rules="validateFreeDay(item)">
                  <el-input size="mini" v-trim v-model="item.freeDays" type="number" class="freeDays" v-input-limit="[3,0 ]" :placeholder="(!item.sameFlag && !item.freeDays && !item.disabled)? '--': '' " :disabled="!item.disabled">
                    <i v-if="!item.disabled" slot="suffix" class="el-input__icon el-icon-edit freeDaysEdit" @click="freeDaysEdit(item,i)"></i>
                  </el-input>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane class="custom-tree" :label="$t('blInfo.billOfLadingDimension')" name="2">
              <el-tree :data="freeDayForm.blList" :props="defaultProps" @node-click="handleNodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }" style="display: flex; width: 100%">
                  <div class="memberName"><span>{{node.label}}</span></div>
                  <div v-if="data.blNo">
                    <el-form-item label="" :prop="'blList.' + data.parentIndex +'.children.'+data.index+ '.freeDays'" :rules="validateFreeDay(data)">
                      <el-input size="mini" v-trim v-model="data.freeDays" type="number" class="freeDays" v-input-limit="[3,0 ]" :placeholder="(!data.sameFlag && !data.freeDays && !data.disabled)? '--': '' " :disabled="!data.disabled">
                        <i v-if="!data.disabled" slot="suffix" class="el-input__icon el-icon-edit freeDaysEdit" @click="freeDaysEdit(data,data.parentIndex,data.index)"></i>
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-tree>
            </el-tab-pane>
            <el-tab-pane class="custom-tree" :label="$t('blInfo.containerDimension')" name="3">
              <el-tree :data="freeDayForm.containerList" :props="defaultProps" @node-click="handleNodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }" style="display: flex; width: 100%">
                  <div class="memberName"><span>{{node.label}}</span></div>
                  <div v-if="data.containerNo">

                    <el-form-item label="" :prop="'containerList.' + data.index +'.children.'+data.secIndex+'.children.'+data.thirdIndex+ '.freeDays'" :rules="validateFreeDay(data)">
                      <el-input size="mini" v-trim v-model="data.freeDays" type="number" class="freeDays" v-input-limit="[3,0 ]" :placeholder="(!data.sameFlag && !data.freeDays && !data.disabled)? '--': '' " :disabled="!data.disabled">
                        <i v-if="!data.disabled" slot="suffix" class="el-input__icon el-icon-edit freeDaysEdit" @click="freeDaysEdit(data,data.index,data.secIndex,data.thirdIndex)"></i>
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitFreeDay">{{ $t('common.confirm') }}</el-button>
        <el-button size="small" @click="freeDayCancel">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
<!--    变更提箱点-->
    <el-dialog :visible.sync="changePickUpPointDialog" v-if="changePickUpPointDialog" :title="$t('boatContainerList.changePickUpPoint')" width="650px" :before-close="cancelChangePickUpPoint" v-loading="loading">
      <el-form ref="changePickUpPointForm" :model="changePickUpPointForm" style="margin-top: 10px;">
        <div style="display: flex; margin-bottom: 20px; ">
          <div style="margin:  0 20px 0 56px">{{$t('boatContainerList.shipName')}}:{{changePickUpPointForm.vessel}} </div>
          <div>{{$t('boatContainerList.voyage')}}:{{changePickUpPointForm.voyage}} </div>
        </div>

        <div style="display: flex;">
          <div>
            <div style="margin-bottom: 12px; width: 90px; text-align: right">{{ $t('boatContainerList.affectedContainerVolume') }}:</div>
            <div class="requiredBerore" style=" width: 90px; text-align: right">{{ $t('boatContainerList.pickUpAddress') }}:</div>
          </div>
          <div style="width: 500px; display: flex; overflow-x: auto; margin-left: 20px; padding-bottom: 20px;">
            <div v-for="(item,i) in changePickUpPointForm.changepickList" :key="i" class="pickUpPoint">
              <div style="text-align: center; margin-bottom: 10px">
                {{ item.containerType }}*{{ item.containerQty }}
              </div>
              <el-form-item v-for="(val,index) in item.containerPickDistributeList" :key="index" label="" :prop="'changepickList.' + i + '.yardCode'" :rules="[ { required: true,message:$t('sea.pleaseEnter'),trigger: 'change'} ]" size="mini">
                <el-radio v-model="item.yardCode" :label="val.yardCode">{{ val.yardName }}</el-radio>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitChangePickUpPoint">{{ $t('common.confirm') }}</el-button>
        <el-button size="small" @click="cancelChangePickUpPoint">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import lodash from 'lodash'
import topSearchItems from '@/components/Cargo/Common/topSearchItems'
import BLStatusSelector from './components/BLStatusSelector'
import FleetStatusSelector from './components/FleetStatusSelector'
import ExcelUpload from './components/ExcelUpload'
import ContainerPools from './components/ContainerPools'
import ContainerMerger from './components/ContainerMerger'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import {
	getContainerListApi,
	deleteRecordsApi,
	checkContainerStatusApi,
	exportCasOrderApi,
	polPodListApi,
	containerVesselChangeApi,
	containerTypeAndQtyApi,
	containerSocChangeApi,
	checkContainerNoApi,
	containerNoChangeApi,
	changePodListApi,
	podChangeApi,
	batchShutOutApi,
	listStatisticsApi,
	containerTrackingApi,
	pickChangeApi, pickChangeListApi
} from '@/api/containerList'
import { getRemoteMemberApi } from '@/api/user'
import { getToken } from '@/utils/auth'
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import suitcase from "@/views/cargo/v0/CharteredBoat/components/booking/suitcase"
import {
	distributeApi,
	loadingPortAddressList,
	pickDistributeApi,
	settingStatisticApi, settingStatisticSetApi
} from "@/api/charteredBoat/booking4Manager"
import { validContainerNo, validContainerNo53HC } from "@/utils/validate"
import VGMStatusSelector from "@/views/cargo/v0/CharteredBoat/components/VGMStatusSelector"
import reportListDialog from "@/components/Cargo/Report/reportListDialog"
import { deepCloneMethod } from "@/utils"
import { issueStatisticApi } from "@/api/bl"
import { seaBookingCancelApi } from "@/api/seaExportOrder"
export default {
	name: 'ContainerList',
	components: {
		topSearchItems,
		BLStatusSelector,
		FleetStatusSelector,
		ExcelUpload,
		ContainerPools,
		ContainerMerger,
		RemoteSearchSelector,
		cargoAdvanceSelect,
		suitcase,
		VGMStatusSelector,
		reportListDialog,
		'containerTrajectory': {
			template: `<el-button v-if="params.data.containerNo" type="text" @click="params.context.componentParent.containerTrajectory(params.data)">{{params.containerTrail}}</el-button>`,
			methods: {}
		}
	},
	filters: {
		colorFilter(sort, vm) {
			if (!sort) {
				return ''
			}
			return sort <= vm.newSort ? '#0bbd87' : ''
		},
		blStatusFilter(status, name) {
			const className = [
				'',
				'status-text info-text',
				'status-text warning-text',
				'status-text success-text',
				'status-text danger-text',
				'status-text primary-text'
			]
			return `<span class="${className[status]}">
          ${name}
        </span>`
		},
		containerStatusFilter(status, name) {
			const className = [
				'',
				'status-text primary-text',
				'status-text info-text',
				'status-text warning-text'
			]
			return `<span class="${className[status]}">
          ${name}
        </span>`
		}
	},
	data() {
		return {
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			vm: this,
			changeSailingListVal: {},
			url: URL,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			loading: false,
			singleSearchStr: '',
			multipleForm: {
				soNo: '',
				containerNo: '',
				blNo: '',
				vessel: '',
				voyage: '',
				memberId: '',
				blStatus: null,
				polCode: '',
				podCode: '',
				trailerStatus: null,
				pageNum: 0,
				pageSize: 50,
				serialNo: '',
				vgmStatus: null,
				containerStatus: null,
				overdueCondition: '',
				overdueDays: ''
			},
			BLSelectorList: [],
			fleetSelectorList: [],
			rowData: [],
			totalData: 0,
			pageSize: 50,
			currPage: 0,
			selectedItems: [],
			showInputDialog: false,
			inputType: '1',
			canBeUpload: false,
			showContainerPool: false,
			showMergeDialog: false,
			checkContainerList: [],
			showSailingScheduleDialog: false, // 变更船期
			showChangeShipDialog: true,
			formSailingSchedule: {
				chargeOrderFlag: true
			},
			formSailingScheduleOptions: [],
			changeShipForm: {},
			suitcaseDialog: false,
			suitcaseFrom: { // 变更箱属
				serialNo: '',
				socFlag: null,
				polCode: '',
				sailingId: '',
				distributeType: 1
			},
			suitcaseSelectList: [],
			changeNoDialog: false,
			changeNoForm: { // 变更箱号
				CasOrderContainerSimpleDTO: []
			},
			SOQty: '', // 箱量，
			podChangeDialog: false, // 变更目的港
			podChangeForm: {
				chargeOrderFlag: true
			},
			changePodList: [],
			changepickList: [],
			reportDialog: { // 打印报表对话框
				isShow: false,
				typeCode: '',
				data: {
					jobId: '',
					assistInfo: '',
					definedInfo: '',
					entityIdList: [],
					remark: ''
				}
			},
			batchPrintMultipleForm: {}, // 批量打印用的条件
			isValid: false, // 退关操作,
			statistic: {
				normalCopy: [],
				shutOutCopy: []
			}, // 统计
			trajectoryDialog: false,
			reverse: false,
			trajectoryData: {
				activities: []
			},
			nowIndex: null,
			trajectoryPort: ['', this.$t('boatContainerList.startPort'), this.$t('boatContainerList.transformPort'), this.$t('charteredBoat.podCode')],
			newSort: null,
			freeDayDialog: false,
			freeDayForm: {
				customerList: [],
				blList: []
			},
			editableTabsValue: '1',
			isJump: false,
			changePickUpPointDialog: false,
			changePickUpPointForm: {
				changepickList: []
			}
		}
	},
	computed: {
		// 提单状态是否全为待补料
		checkBLStatus() {
			return this.checkContainerList.every(item => item.blStatus === 1)
		},
		// 勾选条目是否为同一客户、船名航次、是否为同一装货港和卸货港，如果校验不通过则提示“所选条目的客户、船名航次、装货港、卸货港不一致，请确认后再操作”
		checkSameOrigin() {
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				return this.checkContainerList.every(item => item.client === compareObj.client && item.vessel === compareObj.vessel &&
					item.voyage === compareObj.voyage && item.polId === compareObj.polId && item.podId === compareObj.podId)
			}
			return false
		},
		checkSameOriginChangeOrder() {
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				return this.checkContainerList.every(item => item.vessel === compareObj.vessel && item.voyage === compareObj.voyage)
			}
			return false
		},
		// 如果箱子是COC（箱主持有）箱子，则进一步判断是否已经存在箱号，如果存在箱号，则打开新页面访问提单新建页面，否则提示“所选部分箱子箱号未知，无法进行补料”
		checkCOCNo() {
			return this.checkContainerList.some(item => item.socFlag === false && item.containerNo === '')
		},
		checkSameSerialNo() {
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				return this.checkContainerList.every(item => item.serialNo === compareObj.serialNo)
			}
			return false
		},
		// 集装箱已删除 containerStatus/ 2
		checkContainerIsDel() {
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				return this.checkContainerList.some(item => item.containerStatus === 2)
			}
			return false
		},
		// 已退关
		checkContainerStatus3() {
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				return this.checkContainerList.some(item => item.containerStatus === 3)
			}
			return false
		},
		remoteApi() {
			return getRemoteMemberApi
		},
		checkDelStatus() { // trailerStatus 1 未邀请
			return this.checkContainerList.every(item => item.blStatus === 1 && item.containerStatus === 1 && !item.containerNo)
		}
	},
	watch: {},
	mounted() {
		// this.getDataList()
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			// if(from.name === 'BLInfo') {
			//   vm.getDataList()
			// }
			vm.getDataList()
		})
	},
	created() {
		const _self = this
		this.gridOptions = {
			context: {
				componentParent: _self
			},
			onRowSelected: selectorObj => {
				if (selectorObj.node.selected) {
					this.selectedItems.push(selectorObj.data)
				} else {
					const _data = selectorObj.data
					const _id = this.selectedItems.findIndex(item => item.id === _data.id)
					this.selectedItems.splice(_id, 1)
				}
			},
			rowSelection: 'multiple', // 设置多行可选
			rowMultiSelectWithClick: true, // 点击及选择复选框
			suppressRowClickSelection: true // 选中单元格后可以复制内容
			// suppressCellSelection: true, //点击不选中单元格
		}
		this.columnFields = [
			{
				colId: 'visibleCol',
				headerName: '',
				pinned: 'left',
				field: '',
				hide: true,
				minWidth: 180
			},
			{
				headerName: '',
				checkboxSelection: true,
				headerCheckboxSelection: true,
				pinned: 'left',
				minWidth: 60
			},
			{
				field: 'serialNo',
				headerName: this.$t('charteredBoat.serialNo'),
				pinned: 'left',
				minWidth: 120,
				tooltipField: 'serialNo'
			},
			{
				field: 'soNo',
				headerName: this.$t('boatContainerList.soNo'),
				pinned: 'left',
				minWidth: 120,
				tooltipField: 'soNo'
			},
			{
				field: 'containerNo',
				headerName: this.$t('charteredBoat.containerNo'),
				pinned: 'left',
				minWidth: 120,
				tooltipField: 'containerNo'
			},
			{
				field: 'blNo',
				headerName: this.$t('charteredBoat.blNo'),
				pinned: 'left',
				minWidth: 120,
				tooltipField: 'blNo'
			},
			{
				field: 'containerType',
				headerName: this.$t('charteredBoat.containerType'),
				minWidth: 100
			},
			{
				field: 'memberName',
				headerName: this.$t('charteredBoat.memberName'),
				minWidth: 100,
				tooltipField: 'memberName'
			},
			{
				field: 'remark',
				headerName: this.$t('boatContainerList.remark'),
				minWidth: 200,
				tooltipField: 'remark'
			},
			{
				field: 'blStatus',
				headerName: this.$t('charteredBoat.blStatus'),
				minWidth: 100,
				cellRenderer: params => this.$options.filters.blStatusFilter(params.data.blStatus, params.data.blStatusName)
			},
			{
				field: 'trailerStatusName',
				headerName: this.$t('boatContainerList.trailerStatusName'),
				minWidth: 120
			},
			{
				field: 'vgmStatus',
				headerName: this.$t('boatContainerList.VGMStatus'),
				minWidth: 100,
				cellRenderer: params => this.$options.filters.blStatusFilter(params.data.vgmStatus, params.data.vgmStatusName)
			},
			{
				field: 'containerStatus',
				headerName: this.$t('boatContainerList.containerStatus'),
				minWidth: 100,
				cellRenderer: params => this.$options.filters.containerStatusFilter(params.data.containerStatus, params.data.containerStatusName)
			},

			{
				field: 'socFlag',
				headerName: this.$t('charteredBoat.ownerName'),
				minWidth: 120,
				cellRenderer: params => params.value ? 'SOC' : 'COC'
			},
			{
				field: 'vessel',
				headerName: this.$t('charteredBoat.vesselName'),
				minWidth: 120,
				tooltipField: 'vessel'
			},
			{
				field: 'voyage',
				headerName: this.$t('charteredBoat.voyageNo'),
				minWidth: 120
			},
			{
				field: 'polCode',
				headerName: this.$t('charteredBoat.polCode'),
				minWidth: 120,
				tooltipField: 'polCode'
			},
			{
				field: 'pickUpAddr',
				headerName: this.$t('boatContainerList.pickUpAddress'),
				minWidth: 200,
				tooltipField: 'pickUpAddr'
			},
			{
				field: 'returnAddr',
				headerName: this.$t('boatContainerList.returnAddress'),
				minWidth: 200,
				tooltipField: 'returnAddr'
			},
			{
				field: 'podCode',
				headerName: this.$t('charteredBoat.podCode'),
				minWidth: 120,
				tooltipField: 'podCode'
			},
			{
				field: 'truckName',
				headerName: this.$t('boatContainerList.truckName'),
				minWidth: 240,
				tooltipField: 'truckName'
			},
			{
				field: 'eirId',
				headerName: this.$t('boatContainerList.eirId'),
				minWidth: 150,
				tooltipField: 'eirId'
			},
			{
				field: 'pickUpTime',
				headerName: this.$t('boatContainerList.pickUpTime'),
				minWidth: 150,
				cellRenderer: params => {
					if (params.value) {
						return this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm')
					}
					return ''
				}
			},
			{
				field: 'fullInTime',
				headerName: this.$t('boatContainerList.fullInTime'),
				minWidth: 150,
				cellRenderer: params => {
					if (params.value) {
						return this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm')
					}
					return ''
				}
			},
			{
				field: 'unloadingTimeFormat',
				headerName: this.$t('boatContainerList.unloadingTimeFormat'),
				minWidth: 150
			},
			{
				field: 'liftingTimeFormat',
				headerName: this.$t('boatContainerList.liftingTimeFormat'),
				minWidth: 150
			},
			{
				field: 'returnTimeFormat',
				headerName: this.$t('boatContainerList.returnTime'),
				minWidth: 150
			},
			{
				field: 'freeDays',
				headerName: this.$t('boatContainerList.freeDays'),
				minWidth: 100
			},
			{
				field: 'overdueDays',
				headerName: this.$t('boatContainerList.overdueDays'),
				minWidth: 100
			},
			// {
			//   field: 'overdueDays',
			//   headerName: '超堆存天数',
			//   minWidth: 100
			// },
			{
				headerName: this.$t('common.operation'),
				pinned: 'right',
				minWidth: 100,
				cellRendererFramework: 'containerTrajectory',
				cellRendererParams: { containerTrail: this.$t('boatContainerList.containerTrail') }
			}
		]
	},
	methods: {
		// 免贵天数跳转
		tavClick() {
			// this.getSettingStatisticApi()
		},
		tabLeave(activeName) {
			if (!this.isJump) {
				this.$confirm(this.$t('blInfo.cutoverFreeDays'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(async () => {
					this.goTabs(activeName)
				}).catch(() => {
					console.log('取消')
				})
			} else {
				return true
			}
			return false
		},
		goTabs(e) {
			this.isJump = true
			this.editableTabsValue = e
			this.getSettingStatisticApi()
			this.$nextTick(() => {
				this.isJump = false
			})
		},
		adjustmentFreeDays() {
			if (!this.batchPrintMultipleForm.vessel || !this.batchPrintMultipleForm.voyage) {
				this.$message.warning(this.$t('blInfo.pleaseSearchSameBoat'))
				return
			}
			if (Number(this.totalData) === 0) {
				this.$alert(this.$t('blInfo.pleaseModifyTheQueryConditions'), {
					confirmButtonText: this.$t('blInfo.determine')
				})
				return
			}
			if (this.multipleForm.blNo) {
				this.editableTabsValue = '2'
			}
			if (this.multipleForm.containerNo) {
				this.editableTabsValue = '3'
			}
			this.getSettingStatisticApi()
			this.freeDayDialog = true
		},
		async getSettingStatisticApi(type = Number(this.editableTabsValue)) {
			this.multipleForm.type = type
			this.loading = true
			const res = await settingStatisticApi(this.multipleForm)
			this.loading = false
			if (res.ok) {
				if (type === 1) {
					this.freeDayForm.customerList = res.content.customerList
				} else if (type === 2) {
					res.content.blList.map((item, parentIndex) => {
						item.label = item.memberName
						item.children = item.blDetailList
						item.blDetailList.map((val, index) => {
							val.label = val.blNo
							val.parentIndex = parentIndex
							val.index = index
						})
					})
					this.freeDayForm.blList = res.content.blList
				} else if (type === 3) {
					res.content.containerList.map((item, parentIndex) => {
						item.label = item.memberName
						item.children = item.containerBlList
						item.containerBlList.map((val, secIndex) => {
							val.label = val.blNo
							val.children = val.containerList
							val.parentIndex = parentIndex
							val.containerList.map((thirdVal, thirdIndex) => {
								thirdVal.label = thirdVal.containerNo
								thirdVal.index = parentIndex
								thirdVal.secIndex = secIndex
								thirdVal.thirdIndex = thirdIndex
							})
						})
					})
					this.$set(this.freeDayForm, 'containerList', res.content.containerList)
				}
			}
		},
		freeDaysEdit(item, parentIndex, index, thirdIndex) {
			// data.index,data.secIndex,data.thirdIndex
			if (!item.sameFlag) {
				this.$confirm(this.$t('blInfo.continueFreeDays'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(async () => {
					item.disabled = true
					if (Number(this.editableTabsValue) === 1) {
						this.$set(this.freeDayForm.customerList[parentIndex], item)
					} else if (Number(this.editableTabsValue) === 2) {
						this.$set(this.freeDayForm.blList[parentIndex].children[index], item)
					} else if (Number(this.editableTabsValue) === 3) {
						this.$set(this.freeDayForm.containerList[parentIndex].children[index].children[thirdIndex], item)
					}
				}).catch(() => {
					console.log('取消')
				})
			} else {
				item.disabled = true
				if (Number(this.editableTabsValue) === 1) {
					this.$set(this.freeDayForm.customerList[parentIndex], item)
				} else if (Number(this.editableTabsValue) === 2) {
					this.$set(this.freeDayForm.blList[parentIndex].children[index], item)
				} else if (Number(this.editableTabsValue) === 3) {
					this.$set(this.freeDayForm.containerList[parentIndex].children[index].children[thirdIndex], item)
				}
			}

		},
		handleNodeClick(data) {
		},
		async submitFreeDay() {

			this.$refs.freeDayForm.validate(async valid => {
				if (valid) {
					let data = {
						type: Number(this.editableTabsValue)
					}
					if (Number(this.editableTabsValue) === 1) {
						data.customerList = []
						this.freeDayForm.customerList.map(item => {
							if (item.disabled) {
								data.customerList.push(item)
							}
						})
						if (this.$isEmpty(data.customerList)) {
							this.$message.warning(this.$t('blInfo.modifyeDataSubmit'))
							return false
						}
					} else if (Number(this.editableTabsValue) === 2) {
						data.blList = []
						console.log(this.freeDayForm.blList)
						this.freeDayForm.blList.map(item => {
							let blList = {
								memberId: item.memberId,
								memberName: item.memberName,
								blDetailList: []
							}
							item.children.map(val => {
								if (val.disabled) {
									blList.blDetailList.push(val)
								}
							})
							if (this.$isNotEmpty(blList.blDetailList)) {
								data.blList.push(blList)
							}
						})
						if (this.$isEmpty(data.blList)) {
							this.$message.warning(this.$t('blInfo.modifyeDataSubmit'))
							return false
						}
					} else if (Number(this.editableTabsValue) === 3) {
						data.containerList = []
						this.freeDayForm.containerList.map(item => {
							let containerList = {
								memberId: item.memberId,
								memberName: item.memberName,
								sailingId: item.sailingId,
								sameFlag: item.sameFlag,
								containerBlList: []
							}
							item.children.map(val => {
								let containerBlList = {
									blId: val.blId,
									blNo: val.blNo,
									containerList: []
								}
								val.children.map(thirdVal => {
									if (thirdVal.disabled) {
										containerBlList.containerList.push(thirdVal)
									}
								})

								if (this.$isNotEmpty(containerBlList.containerList)) {
									containerList.containerBlList.push(containerBlList)
								}
							})
							if (this.$isNotEmpty(containerList.containerBlList)) {
								data.containerList.push(containerList)
							}

						})
						if (this.$isEmpty(data.containerList)) {
							this.$message.warning(this.$t('blInfo.modifyeDataSubmit'))
							return false
						}
					}
					this.loading = true
					const res = await settingStatisticSetApi(data)
					this.loading = false
					if (res.ok) {
						this.$message.success(this.$t('blInfo.submitSuc'))
						this.freeDayCancel()
					}
				}
			})

		},
		freeDayCancel() {
			this.$refs.freeDayForm.resetFields()
			this.freeDayDialog = false
		},
		overdueConditionChange(val) {
			if (!val) {
				this.multipleForm.overdueDays = ''
			}
		},
		validateFreeDay(item) {
			let activeRules = [
				{
					validator: (rule, value, callback) => {
						if (!value && item.disabled) {
							callback(new Error(this.$t('preManifest.placeholder')))
						} else {
							callback()
						}
					},
					trigger: 'change'
				}]
			return activeRules
		},
		// 验证箱号
		validateContainerNo(item) {
			let activeRules = [
				{ required: true, message: this.$t('common.placeholder'), trigger: 'blur' },
				{
					validator: (rule, value, callback) => {
						if (item === '53HC' ? !validContainerNo53HC(value) : !validContainerNo(value)) {
							callback(new Error(this.$t('boatContainerList.containerNoError')))
						} else {
							callback()
						}
					}
				}]
			return activeRules
		},
		/** ******** 改单 ************************** **/
		// 改箱属
		async initDistribute() {
			const { id, distributeType } = { ...this.suitcaseFrom }
			this.suitcaseFrom.distributeList = []
			this.loading = true
			const res = await pickDistributeApi({ id, distributeType })
			this.loading = false
			if (res.ok) {
				let containerGrid = res.content.containerTypeAndQty.split(',')
				let containerGridArr = containerGrid.map(item => {
					let arr = item.split('×')
					return {
						containerType: arr[0],
						qty: arr[1]
					}
				})
				res.content.containerPickDistributeList.map(item => {
					containerGridArr.map(val => {
						if (val.containerType === item.containerType) {
							item.hasSomeType = true
							item.qty = val.qty
						}
					})
				})
				this.suitcaseFrom.orderId = res.content.orderId
				this.suitcaseFrom.distributeList = res.content.containerPickDistributeList
				this.suitcaseFrom.containerTypeAndQty = res.content.containerTypeAndQty
				this.suitcaseFrom.soNo = res.content.soNo
				this.suitcaseFrom.containerNotEnough = res.content.containerNotEnough
				this.suitcaseFrom.containerNotRelease = res.content.containerNotRelease
			}
		},
		distributeFlagChange(row) {
			if (row.distributeFlag) {
				// let qty = row.qty
				let surplusQty = row.qty
				this.suitcaseFrom.distributeList.map(item => {
					// 相同箱型 订舱数量减去已分配数量
					if (item.containerType === row.containerType && item.id !== row.id && item.distributeFlag) {
						surplusQty -= Number(item.distributeQuantity)
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
		async allotSuitcase(selectedRows) {
			const row = selectedRows[0]
			this.suitcaseFrom.serialNo = row.serialNo
			this.suitcaseFrom.polCode = row.polCode
			this.suitcaseFrom.sailingId = row.sailingId
			this.suitcaseFrom.id = row.id
			this.suitcaseFrom.socFlag = row.socFlag ? 0 : 1
			const res = await this.initDistribute()
			this.suitcaseDialog = true
		},
		// 改箱属
		command1() {
			this.selectedItems = this.gridApi.getSelectedRows()
			this.checkContainerList = this.selectedItems
			if (!this.selectedItems || this.selectedItems.length !== 1) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerInfoEmptyError')
				})
				return false
			}
			// if (!this.checkSameSerialNo) {
			//   this.$message({
			//     type: 'warning',
			//     message: '请选择同一流水号下的集装箱进行箱属变更'
			//   })
			//   return false
			// }
			this.allotSuitcase(this.selectedItems)
		},
		// 箱属提交
		submitChangeSuitcase() {
			this.$refs.suitcaseFrom.validate(async (valid, failFields) => {
				if (valid) {
					if (this.suitcaseFrom.distributeType === 3) {
						let isError
						let containerTypeArr = {}
						this.suitcaseFrom.distributeList.map(item => {
							if (!containerTypeArr[item.containerType]) {
								containerTypeArr[item.containerType] = 0
							}
							containerTypeArr[item.containerType] += Number(item.distributeQuantity) || 0
						})
						for (let i in containerTypeArr) {
							this.suitcaseFrom.distributeList.map(item => {
								if (item.qty && Number(item.qty) !== Number(containerTypeArr[i]) && i === item.containerType) {
									console.log(item.qty, containerTypeArr[i], i, item.containerType)
									isError = true
									return
								}
							})
						}
						if (isError) {
							this.$message.warning(this.$t('boatContainerList.differentNumberFromOwner'))
							return
						}
					}

					this.loading = true
					const res = await containerSocChangeApi(this.suitcaseFrom)
					this.loading = false
					if (res.ok) {
						this.getDataList()
						this.suitcaseCancel()
					}
				}
			})
		},
		// 改箱号
		command2() {
			this.selectedItems = this.gridApi.getSelectedRows()
			this.checkContainerList = this.selectedItems
			if (!this.selectedItems || this.selectedItems.length !== 1) {
				this.$message.warning(this.$t('boatContainerList.updateSelectEmpty'))
				return false
			}
			if (!this.selectedItems[0].containerNo) {
				this.$message.warning(this.$t('boatContainerList.existSelectedError'))
				return false
			}
			this.changeNoDialog = true
			this.changeNoForm.CasOrderContainerSimpleDTO.push({
				containerNo: this.selectedItems[0].containerNo,
				containerSizeType: this.selectedItems[0].containerType,
				eirId: this.selectedItems[0].eirId,
				id: this.selectedItems[0].id,
				newContainerNo: lodash.cloneDeep(this.selectedItems[0].containerNo)
			})
		},
		async command4() { // 改目的港
			this.selectedItems = this.gridApi.getSelectedRows()
			this.checkContainerList = this.selectedItems
			if (!this.selectedItems || this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerInfoEmptyError')
				})
				return false
			}
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				const somePod = this.checkContainerList.every(item => item.podId === compareObj.podId)
				if (somePod) {
					this.podChangeDialog = true
					this.podChangeForm = {
						vessel: compareObj.vessel,
						voyage: compareObj.voyage,
						polCode: compareObj.polCode,
						podCode: compareObj.podCode,
						chargeOrderFlag: true
					}
					this.loading = true
					const _query = this.checkContainerList.map(item => item.id)
					const res = await changePodListApi({ containerIds: _query.join(',') })
					this.loading = false
					if (res.ok) {
						this.changePodList = res.content
					}
				} else {
					this.$message.warning(this.$t('boatContainerList.sameSailingCheckedError'))
				}
			}
		},

		async command3() {
			this.selectedItems = this.gridApi.getSelectedRows()
			this.checkContainerList = this.selectedItems
			if (!this.selectedItems || this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerInfoEmptyError')
				})
				return false
			}
			// 请求接口查询箱子的最新状态
			// await this.checkContainerStatus()
			if (!this.checkSameOriginChangeOrder) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.sameSailingCheckedError')
				})
				return false
			}
			const arr = {}
			this.selectedItems.map(item => {
				// arr[item.containerType] ? arr[item.containerType] = 0 :
				arr[item.containerType] ? arr[item.containerType]++ : arr[item.containerType] = 1
			})
			let str = ''
			for (const key in arr) {
				str += `${key}*${arr[key]} `
			}
			this.$set(this.changeSailingListVal, 'containerType', str)
			this.$set(this.changeSailingListVal, 'vessel', this.selectedItems[0].vessel)
			this.$set(this.changeSailingListVal, 'voyage', this.selectedItems[0].voyage)
			this.loading = true
			const _query = this.checkContainerList.map(item => item.id)
			console.log(_query)
			const res = await polPodListApi({ containerIds: _query.join(',') })
			this.loading = false
			if (res.ok) {
				if (res.content.length === 0) {
					this.$message.error(this.$t('boatContainerList.nonSailingUsedError'))
					return
				}
				this.formSailingScheduleOptions = res.content
				this.showSailingScheduleDialog = true
			}
		},
		// 变更提箱点
		async changePickUpPoint() {
			this.selectedItems = this.gridApi.getSelectedRows()
			this.checkContainerList = this.selectedItems
			if (!this.selectedItems || this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerInfoEmptyError')
				})
				return false
			}
			const compareObj = this.checkContainerList[0] || false
			if (compareObj) {
				// 是否跨船期（不属于同一船名航次）
				const someShipping = this.checkContainerList.some(item => item.vessel !== compareObj.vessel || item.voyage !== compareObj.voyage)
				if (someShipping) {
					this.$message.warning(this.$t('boatContainerList.sameSailingCheckedError'))
					return
				}
				// 是否属于同一装货港
				const somePolId = this.checkContainerList.some(item => item.polId !== compareObj.polId)
				if (somePolId) {
					this.$message.warning(this.$t('boatContainerList.samePolCheckedError'))
					return
				}
				// 已提空、已反重，已退关，已取消的
				const someTrailerStatus = this.checkContainerList.some(item => Number(item.containerStatus) !== 1 || [1, 2, 3].indexOf(Number(item.trailerStatus)) < 0)
				if (someTrailerStatus) {
					this.$message.warning(this.$t('boatContainerList.sameExitheckedError'))
					return
				}
				this.changePickUpPointDialog = true

				this.loading = true
				const _query = this.checkContainerList.map(item => item.id)
				const res = await pickChangeListApi({ ids: _query.join(',') })
				this.loading = false
				if (res.ok) {
					this.$set(this.changePickUpPointForm, 'changepickList', res.content)
					this.$set(this.changePickUpPointForm, 'voyage', compareObj.voyage)
					this.$set(this.changePickUpPointForm, 'vessel', compareObj.vessel)
				}
			}
		},
		// 提交变更提箱点
		async submitChangePickUpPoint() {
			this.$refs.changePickUpPointForm.validate(async valid => {
				if (valid) {
					const data = {
						pickUpDTOS: []
					}
					data.ids = this.checkContainerList.map(item => item.id)
					this.changePickUpPointForm.changepickList.map(item => {
						let arr = {
							containerType: item.containerType,
							yardCode: item.yardCode
						}
						data.pickUpDTOS.push(arr)
					})
					this.loading = true
					const res = await pickChangeApi(data)
					if (res.ok) {
						this.$message.success(this.$t('boatContainerList.changeSucceeded'))
						this.cancelChangePickUpPoint()
						this.getDataList()
					} else {
						this.loading = false
					}
				}
			})
		},
		cancelChangePickUpPoint() {
			this.$refs.changePickUpPointForm.resetFields()
			this.changePickUpPointDialog = false
		},
		async changeOrderCommand(command) {
			this.selectedItems = this.gridApi.getSelectedRows()
			this.checkContainerList = this.selectedItems
			if (!this.selectedItems || this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerInfoEmptyError')
				})
				return false
			}
			if (this.checkContainerIsDel) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerRemovedError')
				})
				return false
			}
			if (this.checkContainerStatus3) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerClearanceError')
				})
				return false
			}
			if (command === '1') {
				this.command1()
			} else
				if (command === '2') {
					this.command2()
				} else
					if (command === '3') {
						this.command3()
					} else
						if (command === '4') {
							this.command4()
						} else
							if (command === '5') {
								this.changePickUpPoint()
							}
		},
		async submitChangeSailing() { // 提交变更船期
			this.$refs.formSailingSchedule.validate(async valid => {
				if (valid) {
					console.log(this.formSailingSchedule)
					const data = {
						containerIds: this.checkContainerList.map(item => item.id),
						...this.formSailingSchedule
					}
					const res = await containerVesselChangeApi(data)
					if (res.ok) {
						this.$message({
							type: 'success',
							message: this.$t('boatContainerList.changeSailingSuccess')
						})
						this.showSailingScheduleDialog = false
						this.ChangeSailingCancel()
						this.getDataList()
					}
				}
			})
		},
		ChangeSailingCancel() {
			this.$refs.formSailingSchedule.resetFields()
			this.showSailingScheduleDialog = false
		},
		pickUpChange(val, row) {
			const selectedItem = this.suitcaseSelectList.find(item => item.pickUpAddr === val)
			this.$set(row, 'id', selectedItem.id)
			this.$set(row, 'pickUpAddr', selectedItem.pickUpAddr)
			this.$set(row, 'portCode', selectedItem.portCode)
			this.$set(row, 'returnAddr', selectedItem.returnAddr)
		},
		suitcaseCancel() { // 关闭箱属
			this.suitcaseDialog = false
			this.$refs.suitcaseFrom.resetFields()
		},
		async changeNoFun(val) { // 箱号更改
			if (val) {
				val.newContainerNo = val.newContainerNo.toUpperCase()
				const res = val.containerSizeType === '53HC' ? !validContainerNo53HC(val.newContainerNo) : !validContainerNo(val.newContainerNo)
				const len = this.changeNoForm.CasOrderContainerSimpleDTO.length
				if (len > 1) {
					const some = this.changeNoForm.CasOrderContainerSimpleDTO.some((item, index) => {
						if (index < len - 1) {
							return item.newContainerNo === val.newContainerNo
						}
					})
					if (some) {
						this.$message.warning(`${this.$t('charteredBoat.containerNo')}${val.newContainerNo}${this.$t('boatContainerList.containerExisted')}`)
						return
					}
				}
				if (!res) {
					this.loading = true
					const res = await checkContainerNoApi(this.changeNoForm.CasOrderContainerSimpleDTO)
					this.loading = false
					if (res.ok && res.content.length > 0) {
						//  res.content.newContainerNo = lodash.cloneDeep(res.content.containerNo)
						this.changeNoForm.CasOrderContainerSimpleDTO.push(res.content[0])
					}
				}
			}
		},
		async submitChangeNo() { // 提交箱号
			this.$refs.changeNoForm.validate(async (valid, failFields) => {
				if (valid) {
					const len = this.changeNoForm.CasOrderContainerSimpleDTO.length
					const val = this.changeNoForm.CasOrderContainerSimpleDTO[len - 1]
					if (len > 1) {
						const some = this.changeNoForm.CasOrderContainerSimpleDTO.some((item, index) => {
							if (index < len - 1) {
								return item.newContainerNo === val.newContainerNo
							}
						})
						if (some) {
							this.$message.close()
							this.$message.warning(`${this.$t('charteredBoat.containerNo')}${val.newContainerNo}${this.$t('boatContainerList.containerExisted')}`)
							return
						}
					}
					this.loading = true
					const res = await containerNoChangeApi(this.changeNoForm.CasOrderContainerSimpleDTO)
					this.loading = false
					if (res.ok) {
						this.changeNoCancel()
						this.getDataList()
					}
				}
			})
		},
		changeNoCancel() { // 关闭箱号
			this.changeNoForm.CasOrderContainerSimpleDTO = []
			this.changeNoDialog = false
			this.$refs.changeNoForm.clearValidate()
		},
		submitPodChange() {
			this.$refs.podChangeForm.validate(async (valid, failFields) => {
				if (valid) {
					this.loading = true
					const containerIds = this.checkContainerList.map(item => item.id)
					const data = {
						containerIds: containerIds,
						podId: this.podChangeForm.id,
						chargeOrderFlag: this.podChangeForm.chargeOrderFlag
					}
					const res = await podChangeApi(data)
					this.loading = false
					if (res.ok) {
						this.getDataList()
						this.CancelPodChange()
					}
				}
			})
		},
		CancelPodChange() { // 关闭目的港
			this.podChangeDialog = false
			this.podChangeForm = {}
			this.changePodList = []
			this.$refs.podChangeForm.clearValidate()
		},
		/** ******** 改单end ************************** **/
		allotSuitcaseSuccess() {
			this.topSearch()
		},
		// AG GRID
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		/** ***列表页*****************************************************/
		researchData(paginationObj) {
			this.currPage = paginationObj.page
			this.pageSize = paginationObj.size
			this.getDataList()
		},
		topSearch() {
			this.currPage = 1
			this.getDataList()
		},
		/** 选中装货港 */
		getItemFromChild(val, key) {
			this.multipleForm[key] = val.code5
			if (val.code5) {
				this.topSearch()
			}
		},
		async getDataList() {
			this.loading = true
			this.selectedItems = []
			this.multipleForm.pageNum = this.currPage
			this.multipleForm.pageSize = this.pageSize
			const res = await getContainerListApi(this.$querystring.stringify(this.multipleForm))
			if (res.ok) {
				this.totalData = Number(res.content.total)
				this.rowData = res.content.list
				this.batchPrintMultipleForm = { ...this.multipleForm } // 暂存条件，防止查询后 进行 修改查询条件，在未查询情况下，进行批量打印
			}
			if (this.batchPrintMultipleForm.vessel && this.batchPrintMultipleForm.voyage) {
				const statistic = await listStatisticsApi({
					vessel: this.batchPrintMultipleForm.vessel,
					voyage: this.batchPrintMultipleForm.voyage
				})
				if (statistic.ok) {
					statistic.content.normalCopy = []
					statistic.content.shutOutCopy = []
					statistic.content.normalCopy = Object.keys(statistic.content.normal).map(key => `${key}*${statistic.content.normal[key]}`)
					statistic.content.shutOutCopy = Object.keys(statistic.content.shutOut).map(key => `${key}*${statistic.content.shutOut[key]}`)
					this.statistic = statistic.content
					console.log(this.statistic)
				}
			}

			this.$nextTick(() => {
				if (this.$refs.containerTable) {
					this.$refs.containerTable.setSelectedItem()
				}
				this.loading = false
			})
		},
		// handleRowSelected(val) {
		//   this.selectedItems = val
		// },
		/** ********************************************************/

		/** ***顶部查询*****************************************************/
		singleSearchSubmit() {
			if (this.singleSearchStr) {
				// 执行查询
				this.getDataList()
			} else {
				return false
			}
		},
		handleBLStatusChange(val) {
			// this.multipleForm.blStatus = val
			this.getDataList()
		},
		handleFleetStatusChange(val) {
			// this.multipleForm.trailerStatus = val
			this.getDataList()
		},
		multipleSearch() {
			if (this.multipleForm.overdueCondition && Number(this.multipleForm.overdueDays) === 0) {
				this.$message.warning(this.$t('blInfo.positiveIntegerGreaterThan0'))
				return
			}
			this.getDataList()
		},
		clearSearchForm() {
			this.$refs.multipleForm.resetFields()
			this.$refs.polCodeSelect.value = ''
			this.$refs.podCodeSelect.value = ''
			this.getDataList()
		},
		/** ********************************************************/
		// 下载下拉command处理
		handleCommand(command) {
			if (command === 'casOrder') {
				this.downloadCasOrder()
			}
			if (command === 'VGM') {
				this.batchPrint()
			}
			if (command === 'Overdue') {
				this.batchPrint('OVERDUE_CONTAINER_LIST')
			}
		},
		// 下载订舱清单
		async downloadCasOrder() {
			this.loading = true
			this.multipleForm.pageNum = this.currPage
			this.multipleForm.pageSize = this.pageSize
			const res = await exportCasOrderApi(this.multipleForm)
			if (res.ok && !!res.content) {
				const link = document.createElement('a')
				link.download = 'cas_order.xlsx'
				link.href = res.content
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			}
			this.loading = false
		},
		// * 打印vgm
		batchPrint(type = 'CNR') {
			if ((!this.batchPrintMultipleForm.vessel || !this.batchPrintMultipleForm.voyage) && type !== 'OVERDUE_CONTAINER_LIST') {
				this.$message.warning(this.$t('boatContainerList.differentSailingError'))
				return
			}
			if (Number(this.totalData) === 0 && type !== 'OVERDUE_CONTAINER_LIST') {
				this.$alert(this.$t('boatContainerList.printDataEmptyError'), {
					confirmButtonText: this.$t('common.confirmBtn')
				})
				return
			}
			// 根据查询条件进行批量打印
			//  const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = this.batchPrintMultipleForm
			//  const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
			this.reportDialog.typeCode = type

			let queryConditionJson = deepCloneMethod(this.batchPrintMultipleForm)
			delete queryConditionJson.pageNum
			delete queryConditionJson.pageSize
			this.reportDialog.data = { queryConditionJson: queryConditionJson }
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true
		},
		/** ***数据导入*****************************************************/
		toggleInputDialog() {
			this.showInputDialog = true
		},
		downloadExcel() {
			let _fileName
			switch (this.inputType) {
				case '1':
					_fileName = 'exportTruckOrderBoxIdTemplate.xlsx'
					break
				case '2':
					_fileName = 'exportTruckOrderReturnTimeTemplate.xlsx'
					break
				default:
					_fileName = 'destinationPortTemplate.xlsx'
			}

			const link = document.createElement('a')
			link.download = _fileName
			link.href = encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${_fileName}&Authorization=${getToken()}`)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		},
		uploadFile() {
			if (!this.canBeUpload) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.uploadFileEmptyError')
				})

				return false
			}
			this.loading = true
			this.$refs.excelUpload.submit()
		},
		uploadSuccess() {
			this.loading = false
			this.$message({
				type: 'success',
				message: this.$t('boatContainerList.uploadFileSuccess')
			})
			this.clearUploadFiles()
			this.canBeUpload = false
			this.showInputDialog = false
			this.currPage = 1
			this.getDataList()
		},
		uploadError(message) {
			this.loading = false
			this.$message({
				type: 'error',
				message: message
			})
			this.clearUploadFiles()
			this.canBeUpload = false
		},
		uploadExceed() {
			this.loading = false
			this.$message({
				type: 'error',
				message: this.$t('boatContainerList.apiError')
			})
			this.clearUploadFiles()
			this.canBeUpload = false
		},
		setUploadStatus(val) {
			this.canBeUpload = val
		},
		closeUploadDialog(done) {
			this.clearUploadFiles()
			this.canBeUpload = false
			this.showInputDialog = false
			done()
		},
		clearUploadFiles() {
			this.$refs.excelUpload.clearUploadFiles()
		},
		/** ********************************************************/

		// 查询箱子最新状态
		async checkContainerStatus() {
			this.loading = true
			const _containerIdList = this.selectedItems.map(item => item.id)
			const _status = await checkContainerStatusApi(this.$querystring.stringify({ containerIdList: _containerIdList }))
			if (_status.ok && _status.content.length > 0) {
				this.checkContainerList = _status.content
			}
			this.loading = false
		},

		/** ***提单补料*****************************************************/
		async checkBLList() {
			this.selectedItems = this.gridApi.getSelectedRows()
			// 需勾选任意条目后方可进行此操作，否则提示“请至少选择一条记录”；
			if (this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.submitDataEmptyError')
				})

				return false
			}

			// 请求接口查询箱子的最新状态
			await this.checkContainerStatus()

			// 提单状态是否为全为待补料，否则提示“请选择待补料的箱子进行操作”
			if (!this.checkBLStatus) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.blStatusError')
				})

				return false
			}
			if (this.checkContainerIsDel) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.blOnDeletedError')
				})
				return false
			}
			// containerStatus = 3 已退关
			if (this.checkContainerStatus3) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.blOnClearanceError')
				})
				return false
			}
			// 勾选条目是否为同一客户、船名航次、是否为同一装货港和卸货港，如果校验不通过则提示“所选条目的客户、船名航次、装货港、卸货港不一致，请确认后再操作”
			if (!this.checkSameOrigin) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.checkSameOriginError')
				})

				return false
			}

			// 如果箱子是COC（箱主持有）箱子，则进一步判断是否已经存在箱号，如果存在箱号，则打开新页面访问提单新建页面，否则提示“所选部分箱子箱号未知，无法进行补料”
			if (this.checkCOCNo) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.checkCOCNoError')
				})
				return false
			}
			// 全部通过 -> 进入提单新建页面
			const _query = this.checkContainerList.map(item => item.id)
			this.$router.push({ name: 'BLInfo', query: { containerIds: _query.join(','), type: 'create' } })
			this.checkContainerList = []
		},
		/** ********************************************************/

		/** ********删除************************************************/
		checkDeleteAndCancellation(command) {
			if (command === '1') {
				this.checkDelete()
			}
			if (command === '2') {
				this.markExit()
			}
		},
		async checkDelete() {
			this.selectedItems = this.gridApi.getSelectedRows()
			if (this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.submitDataEmptyError')
				})
				return false
			}
			// 获取箱子的最新状态
			await this.checkContainerStatus()
			if (!this.checkDelStatus) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.checkDelStatusError')
				})

				return false
			}
			if (this.checkContainerStatus3) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.containerClearanceError')
				})
				return false
			}
			// 柜子的提单状态是否为“待补料”状态，如果是则提示“柜子的订舱信息有所变更，删除后请留意重新发送订舱确认函”
			// 柜子的提单状态是否为“待补料”之外的其他状态，如果是则提示“部分柜子的已开始补料操作，删除柜子将变更现有的提单信息，确认删除？”
			let msg = ''
			if (this.checkBLStatus) {
				msg = this.$t('boatContainerList.checkBLStatusDeletedSuccess')
			} else {
				msg = this.$t('boatContainerList.checkBlStatusDeleteConfirm')
			}

			this.$confirm(msg, this.$t('common.noticeText'), {
				confirmButtonText: this.$t('boatContainerList.confirmDelete'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(async () => {
				this.loading = true
				const data = JSON.stringify({
					ids: this.checkContainerList.map(item => item.id)
				})

				// 调用删除接口
				const res = await deleteRecordsApi(data)
				this.loading = false
				if (res.ok) {
					this.$message({
						type: 'success',
						message: this.$t('common.deleteSuccess')
					})
					this.getDataList()
				}
				this.checkContainerList = []
			}).catch(() => { })
		},
		/** ********************************************************/
		// 标记退关
		async markExit() {
			this.isValid = false
			this.selectedItems = this.gridApi.getSelectedRows()
			if (this.selectedItems.length === 0) {
				this.$message({
					type: 'warning',
					message: this.$t('boatContainerList.submitDataEmptyError')
				})
				return false
			}
			// 至少需要有箱号的集装箱信息方可进行退关操作
			let isContainerNo = this.selectedItems.some(item => !item.containerNo)
			if (isContainerNo) {
				this.$message.warning(this.$t('boatContainerList.containerNoEmptyError'))
				return false
			}
			// 放单申请/已确认放单/已签发的提单中的柜子，无法标记退关
			let isBlStatus = this.selectedItems.some(item => item.blStatus === 5 || item.blStatus === 6 || item.blStatus === 7)
			if (isBlStatus) {
				this.$message.warning(this.$t('boatContainerList.blStatusReleased'))
				return false
			}
			if (this.checkContainerStatus3) {
				this.$message.warning(this.$t('boatContainerList.containerClearanceError'))
				return false
			}
			this.submitMarkExit()
		},
		async submitMarkExit() {
			let data = {
				ids: this.selectedItems.map(item => item.id),
				isValid: this.isValid
			}
			const res = await batchShutOutApi(data)
			if (res.ok) {
				if (!res.content) {
					this.$message.success(this.$t('boatContainerList.clearanceSuccess'))
					this.getDataList()
				} else {
					this.submitMarkExitConfirm(res.content)
				}

			}
		},
		submitMarkExitConfirm(content) {
			let str
			if (content === '710467') {
				str = this.$t('boatContainerList.declaredAMSError')
			} else if (content === '710468') {
				str = this.$t('boatContainerList.clearanceWarning')
			}
			this.$confirm(str, this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.isValid = true
				this.submitMarkExit()
			})
		},
		/** ******提单拆合**************************************************/
		// 显示箱号池
		openPool() {
			this.columnApi.setColumnVisible('visibleCol', true)
			this.selectedItems = this.gridApi.getSelectedRows()
			this.showContainerPool = true
		},
		// 删除选中的箱号
		deleteSelectedItems(_obj) {
			// 根据删除的箱号删除列表重对应的选中状态
			this.gridApi.forEachNode(node => {
				if (node.data.id === _obj.id) {node.setSelected(false)}
			})
		},
		// 关闭浮窗
		closePool() {
			this.selectedItems = []
			this.showContainerPool = false
			this.gridApi.deselectAll()
			this.columnApi.setColumnVisible('visibleCol', false)
		},
		// 打开拆合编辑页
		openMergeDialog() {
			this.showMergeDialog = true
		},
		// 关闭拆合窗口
		closeMergeDialog(done) {
			this.showMergeDialog = false
			done()
		},
		containersMergeFinished(refreshTable) {
			if (refreshTable) {
				this.closePool()
				this.getDataList()
			}

			this.showMergeDialog = false
		},
		// 集装箱轨迹
		async containerTrajectory(data) {
			this.loading = true
			const res = await containerTrackingApi(data.id)
			this.loading = false
			if (res.ok) {
				this.trajectoryData = res.content
				Object.values(res.content.typeMap).map(val => {
					val.map(item => {
						if (res.content.newest === item.trackingStatus) {
							this.newSort = item.sort
						}
					})
				})
				this.trajectoryDialog = true
				if (data.containerNo) {this.trajectoryData.containerNo = data.containerNo}
			}
		},
		trajectoryCancel() {
			this.trajectoryData = {}
			this.trajectoryDialog = false
		}
		/** ********************************************************/

	}
}
</script>
<style lang="scss" scoped>
@import "./styles/table.scss";
.opt-wrap {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-start;
}
.footer-btn {
	margin-top: 30px;
	text-align: right;
}
.container-pool-wrap {
	position: fixed;
	top: 0;
	margin-left: -10px;
	margin-top: 310px;
	width: 160px;
	height: 300px;
	background: #fff;
	box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	overflow: hidden;
	border-radius: 4px;
}
::v-deep .merge-dialog {
	.el-dialog__body {
		padding-top: 0;
	}
}
.change-no-list {
	display: flex;
}
::v-deep .el-grid-header-required {
	th:not(.not-required) {
		div:before {
			content: "*";
			font-size: 20px;
			position: absolute;
			top: 3px;
			width: 20px;
			margin-left: -15px;
			display: inline-block;
			height: 50%;
			color: red;
		}
	}
}
.dataTable ::v-deep {
	.el-form-item {
		margin-bottom: 0px;
	}
}
.statistics {
	color: red;
	font-size: 13px;
	margin-left: 30px;
	display: inline-block;
	font-weight: bold;
	span {
		margin-left: 20px;
	}
}
.trajectory_title {
	margin-bottom: 20px;
	font-size: 14px;
	color: rgb(0, 141, 240);
	font-weight: 700;
}
.trajectory_child_title {
	color: #333333;
	font-size: 14px;
	margin: 0 0 10px 30px;
}
.trajectory_box {
	width: 80%;
	height: 500px;
	overflow: auto;
	::v-deep .el-timeline-item__content {
		display: flex;
	}
	::v-deep .el-timeline-item__wrapper {
		min-height: 16px;
	}
	::v-deep .el-timeline-item {
		padding-bottom: 10px;
	}
	.time_box {
		color: #909399;
		margin-left: 20px;
	}
	.time {
		margin-bottom: 4px;
	}
}
.editableTabs {
	margin: 0 auto;
}
.customerList {
	display: flex;
}
.memberName {
	width: 80%;
	span {
		line-height: 35px;
	}
}
.freeDays {
	width: 100px;
}
.freeDaysEdit {
	font-size: 18px;
	color: rgb(0, 141, 240);
	cursor: pointer !important;
}
.custom-tree {
	::v-deep.el-tree-node__content {
		height: auto;
	}
	::v-deep.el-form-item {
		margin-bottom: 0;
	}
	::v-deep.el-form-item__error {
		display: none;
	}
}
.pickUpPoint {
	margin-left: 20px;
	::v-deep {
		.el-radio {
			margin-right: 0;
		}
		.el-form-item {
			margin-bottom: 10px;
		}
	}
}
.requiredBerore {
	position: relative;
	&:before {
		content: "*";
		font-size: 20px;
		position: absolute;
		top: 0px;
		width: 20px;
		margin-left: -22px;
		display: inline-block;
		height: 50%;
		color: red;
	}
}
</style>
