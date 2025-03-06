<template>
  <div v-loading="loading" style="padding: 20px;">
    <topSearchItems :show-single-input="false" class="mb-20">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px">
            <el-form-item :label="$t('ETDInfoTable.vesselName')+':'">
              <el-input v-trim v-model="filter.vesselName" maxlength="50" :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.vesselName')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('ETDInfoTable.voyageNo')+':'">
              <el-input v-trim v-model="filter.voyageNo" maxlength="50" :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.voyageNo')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('ETDInfoTable.shipowner')+':'">
              <el-input v-trim v-model="filter.carrierName" maxlength="50" :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.shipowner')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('ETDInfoTable.callSign')+':'">
              <el-input v-trim v-model="filter.callSign" maxlength="30" :placeholder="$t('ETDInfoTable.placeholderInput')+$t('ETDInfoTable.callSign')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <!--            <el-form-item label=" " label-width="0px" />-->
            <!--            <el-form-item size="mini" style="padding-top: 2px;">-->
            <!--              <el-button type="primary" size="mini" icon="el-icon-search" @click="list">{{ $t('table.search') }}</el-button>-->
            <!--              <el-button icon="el-icon-refresh-left" size="mini" @click="reset()">{{ $t('table.resetColumns') }}</el-button>-->
            <!--            </el-form-item>-->
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="list">{{$t('common.searchBtn')}}</el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="reset()">{{$t('common.resetBtn')}}</el-button>
      </div>
    </topSearchItems>
    <div class="mb-10">
      <el-button type="primary" size="mini" @click="edit()">{{$t('boatEtdList.createSchedule')}}</el-button>
      <el-button type="primary" size="mini" @click="boxConfiguration()">{{$t('boatEtdList.releaseConfiguration')}}</el-button>
      <el-button type="primary" size="mini" @click="seaStewardShipName()">{{$t('boatEtdList.haiguanjiaConfig')}}</el-button>
      <el-button type="primary" size="mini" @click="adjustmentContainerPlan()">{{$t('boatEtdList.planConfiguration')}}</el-button>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      style="width:100%;height:calc(100vh - 380px)"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />

    <!--    放箱配置弹框 boxConfiguration-->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      :title="$t('boatEtdList.releaseConfiguration')"
      :visible.sync="showDialog"
      width="600px"
    >
      <EDTBoxConfiguration v-if="showDialog" ref="EDTBoxConfiguration" :visible.sync="showDialog" />
    </el-dialog>
    <!--    海管家船名配置弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="seaStewardDialogCancel"
      :title="$t('boatEtdList.haiguanjiaConfig')"
      :visible.sync="showDialogseaSteward"
      width="600px"
    >
      <el-form ref="seaStewardForm" label-position="left" :model="seaStewardForm">
        <el-form-item :label="$t('boatEtdList.sysVesselName')">
          {{ selectedItems[0]? selectedItems[0].vesselName : '' }}
        </el-form-item>
        <el-form-item :label="$t('boatEtdList.haiguanjiaConfig')" prop="yunlspVessel" :rules="[{ required: true, message: $t('boatEtdList.haiguanjiaInvalid') }]">
          <el-input v-model="seaStewardForm.yunlspVessel" :placeholder="$t('boatEtdList.haiguanjiaInvalid')" style="width: 400px" />
        </el-form-item>
      </el-form>
      <p style="margin-top:50px;color: red; font-size: 12px; line-height: 1.5em;">
        {{$t('boatEtdList.noticeStart')}}<a href="https://doc.yunlsp.com/port/ams/appendix/02-%E8%88%B9%E5%90%8D%E5%88%97%E8%A1%A81~10000.html" target="_blank" style="color:#4C9AFF; text-decoration:underline ">{{$t('boatEtdList.haiguanjiaVesselList')}}</a>{{$t('boatEtdList.noticeAfter')}}
      </p>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-button type="primary" size="mini" @click="seaStewardDialogConfirm">{{$t('common.confirmBtn')}}</el-button>
        <el-button type="" size="mini" @click="seaStewardDialogCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <!--    免柜设置弹框 免柜设置-->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="freeDialogCancel" :title="$t('boatEtdList.withoutContainerConfig')"  :visible.sync="showDialogfreeCabinet" width="500px">
      <div style="overflow: auto">
        <el-form ref="freeCabinetForm" class="freeCabinetForm" label-position="left" :model="freeCabinetForm" :hide-required-asterisk="true" label-width="240px">
          <div style="display: flex;">
            <div>{{$t('charteredBoat.vesselName')}}：{{ freeCabinetForm.vesselName }}</div>
            <div style="margin-left: 50px;">{{$t('charteredBoat.voyageNo')}}：{{ freeCabinetForm.voyageNo }}</div>
          </div>
          <div style="display: flex; justify-content: space-between; width: 300px; margin:30px 0 5px 0 ">
            <div>{{$t('boatEtdList.clientName')}}</div>
            <div><span style="color: red">*</span>{{$t('boatEtdList.withoutContainerDays')}}</div>
          </div>
          <el-form-item v-for="(item,i) in freeCabinetForm.data" :key="item.memberId" :label="item.memberName" :prop="'data.' + i + '.freeDays'" :rules="[{ required: true, message: $t('boatEtdList.enterWithoutDays') }]">
            <el-input v-model.number="item.freeDays" v-input-limit="[3,0]" style="width: 80px" maxlength="3" size="mini" />
          </el-form-item>
        </el-form>
      </div>

      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-button type="primary" size="mini" @click="freeDialogConfirm">{{$t('common.placeholder')}}</el-button>
        <el-button type="" size="mini" @click="freeDialogCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <!-- 用箱计划调整-->
    <el-dialog v-loading="loading" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="containerPlanCancel" :title="$t('boatEtdList.planConfiguration')"  :visible.sync="showContainerPlan" width="1100px">
      <div style=" overflow: auto">
        <el-form ref="containerPlanForm" class="containerPlanForm" label-position="left" :model="containerPlanForm"  label-width="90px">
          <div class="flex">
            <div>
              <div class="haeder">{{$t('charteredBoat.vesselName')}}：{{ containerPlanForm.vesselName }}</div>
              <div class="haeder">{{$t('charteredBoat.voyageNo')}}：{{ containerPlanForm.voyageNo }}</div>
              <el-form-item  :label="`${$t('boatEtdList.adjustPlan')}: `" prop="distributeType" label-width="95px" :rules="[{ required: true, message: $t('boatEtdList.adjustPlanEmptyInvalid') }]" class="adjustment_plan">
                <el-radio-group v-model="containerPlanForm.distributeType" @change="distributeTypeChange" :disabled="planStep === 2">
                  <el-radio :label="1">{{$t('boatEtdList.createText')}}</el-radio>
                  <el-radio :label="2">{{$t('boatEtdList.reduceText')}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <ul class="statistics">
              <li><div>{{$t('boatEtdList.planAmountTotal')}}：</div><div><template v-for="(item,i) in containerPlanForm.containerTypeQtyList">{{item.containerType}}x{{ item.planQuantity }}{{i!==containerPlanForm.containerTypeQtyList.length-1 ? '、' : '' }}</template></div></li>
              <li><div>{{$t('boatEtdList.currentReleasedContainer')}}：</div><div><template v-for="(item,i) in containerPlanForm.containerTypeQtyList">{{item.containerType}}x{{ item.releaseQuantity }}{{i!==containerPlanForm.containerTypeQtyList.length-1 ? '、' : '' }}</template></div></li>
              <li><div>{{$t('boatEtdList.currentReleasedBerth')}}：</div><div><template v-for="(item,i) in containerPlanForm.containerTypeQtyList">{{item.containerType}}x{{ item.spaceQuantity }}{{i!==containerPlanForm.containerTypeQtyList.length-1 ? '、' : '' }}</template></div></li>
              <li><div>{{$t('boatEtdList.currentPickedContainer')}}：</div><div><template v-for="(item,i) in containerPlanForm.containerTypeQtyList">{{item.containerType}}x{{ item.pickedUpQuantity }}{{i!==containerPlanForm.containerTypeQtyList.length-1 ? '、' : '' }}</template></div></li>
            </ul>
          </div>
          <el-table v-if="!containerPlanForm.distributeType" class="dataTable" height="440px" :data="containerPlanForm.polContainerTypeQtyList"  ref="conatinerTable">
            <el-table-column prop="polCode" :label="$t('charteredBoat.polCode')" align="center" fixed width="150"></el-table-column>
            <el-table-column prop="yardName" :label="$t('boatEtdList.yardName')" align="center" fixed width="150"></el-table-column>
            <el-table-column prop="containerType" :label="$t('charteredBoat.containerType')" align="center" fixed width="150"></el-table-column>
            <el-table-column prop="releaseQuantity" :label="$t('boatEtdList.releaseQuantity')" align="center" fixed width="150"></el-table-column>
            <el-table-column prop="spaceQuantity" :label="$t('boatEtdList.spaceQuantity')" align="center" fixed width="150"></el-table-column>
            <el-table-column prop="pickedUpQuantity" :label="$t('boatEtdList.pickedUpQuantity')" align="center" fixed width="150"></el-table-column>
          </el-table>
          <div v-else>
            <el-table v-if="planStep === 1" class="dataTable" height="440px" :data="containerPlanForm.polCodeContainerTypeListArr"  ref="conatinerTable">
              <el-table-column width="250">
                <template slot="header">
                  <span class="required">*</span>
                  <span>{{$t('charteredBoat.polCode')}}</span>
                </template>
                <template slot-scope="{row}">
                  <span>{{ row.polCode }}</span>
                </template>
              </el-table-column>
              <el-table-column width="250">
                <template slot="header">
                  <span class="required">*</span>
                  <span>{{$t('charteredBoat.ownerName')}}</span>
                </template>
                <template slot-scope="{row}">
                  <span v-if="row.containerOwner === 1">{{$t('boatEtdList.SOCOnly')}}</span>
                  <span v-if="row.containerOwner === 2">{{$t('boatEtdList.packageMixin')}}</span>
                </template>
              </el-table-column>
              <el-table-column label="" width="300px">
                <template slot="header">
                  <span class="required">*</span>
                  <span>{{$t('charteredBoat.containerType')}}</span>
                </template>
                <template slot-scope="{row,$index}">
                  <span v-if="!row.isEdit || planStep === 2">{{ $isNotEmpty(row.supportContainerSizeTypes) ? row.supportContainerSizeTypes.join(',') : '' }} <i v-if="containerPlanForm.distributeType ===1 && planStep === 1" class="el-icon-edit" @click="changeEdit(row)"></i></span>
                  <el-form-item
                    v-else
                    label=""
                    label-width="0px"
                    class="mb-0"
                    :prop="'polCodeContainerTypeListArr.' + $index + '.supportContainerSizeTypes'"
                    :rules="[{ required: true, message: '', trigger: 'change' }]"
                  >
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
                <template #header>
                  <span class="required">*</span>
                  <span v-if="containerPlanForm.distributeType ===1">{{item}}{{$t('boatEtdList.planAmount')}}</span>
                  <span v-else-if="containerPlanForm.distributeType ===2">{{item}}{{$t('boatEtdList.leftlessText')}}</span>
                </template>
                <template  slot-scope="{row,$index}" v-if="row.supportContainerSizeTypes.indexOf(item)>-1">

                  <!--                <span v-if="!row.isEdit">{{ row.casLoadingContainerPlanListArr[item] }}</span>-->
                  <!--              <span v-if="!row.isEdit">{{ row.returnAddr }}</span> casLoadingContainerPlanList-->
                  <div  v-for="(box,i) in row.containerTypeArr" v-if="box.containerType ===item" :key="i">
                    <span v-if="planStep === 2">{{box.quantity}}</span>
                    <el-form-item v-else label="" label-width="0px" class="mb-0" :prop="'polCodeContainerTypeListArr.' + $index + '.containerTypeArr.'+i+'.'+'quantity'" :rules="[ { required: true,message: '', trigger: 'change'}]" style="width: 200px">
                      <div class="pr-10">
                        <el-input v-model.number="box.quantity" maxlength="50" v-input-limit="[9,0]" :disabled="containerPlanForm.distributeType ===2 && box.surplusQuantity === 0" @change="quantityChange(box.quantity,row)" @input="quantityInput(box.quantity,box.surplusQuantity,row.containerTypeArr,i)" size="mini" :class=" { w190: containerPlanForm.distributeType ===1, w130: containerPlanForm.distributeType ===2 }" :placeholder="$t('boatEtdList.numberPlaceholder')" />
                        <span v-show="containerPlanForm.distributeType ===2"> / {{ box.surplusQuantity}}</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-else class="dataTable" height="440px" :data="containerPlanForm.polCodeContainerTypeListArr2"  ref="conatinerTable2">
              <el-table-column width="250">
                <template slot="header">
                  <span class="required">*</span>
                  <span>{{$t('charteredBoat.polCode')}}</span>
                </template>
                <template slot-scope="{row}">
                  <span>{{ row.polCode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="" width="300px">
                <template slot="header">
                  <span class="required">*</span>
                  <span>{{$t('charteredBoat.containerType')}}</span>
                </template>
                <template slot-scope="{row}">
                  <span>{{ $isNotEmpty(row.supportContainerSizeTypes) ? row.supportContainerSizeTypes.join(',') : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="" v-for="(item,index) in nowSupportContainerSizeTypes2" :key="index" width="210px">
                <template #header>
                  <span class="required">*</span>
                  <span v-if="containerPlanForm.distributeType ===1">{{item}}{{$t('boatEtdList.planAmount')}}</span>
                  <span v-else-if="containerPlanForm.distributeType ===2">{{item}}{{$t('boatEtdList.leftlessText')}}</span>
                </template>
                <template  slot-scope="{row,$index}" v-if="row.supportContainerSizeTypes.indexOf(item)>-1">

                  <!--                <span v-if="!row.isEdit">{{ row.casLoadingContainerPlanListArr[item] }}</span>-->
                  <!--              <span v-if="!row.isEdit">{{ row.returnAddr }}</span> casLoadingContainerPlanList-->
                  <div  v-for="(box,i) in row.containerTypeArr" v-if="box.containerType ===item" :key="i">
                    <span v-if="planStep === 2">{{box.quantity}}</span>
                    <el-form-item v-else label="" label-width="0px" class="mb-0" :prop="'polCodeContainerTypeListArr.' + $index + '.containerTypeArr.'+i+'.'+'quantity'" :rules="[ { required: true,message: '', trigger: 'change'}]" style="width: 200px">
                      <div class="pr-10">
                        <el-input v-model.number="box.quantity" maxlength="50" v-input-limit="[9,0]" :disabled="containerPlanForm.distributeType ===2 && box.surplusQuantity === 0" @input="quantityInput(box.quantity,box.surplusQuantity,row.containerTypeArr,i)" size="mini" :class=" { w190: containerPlanForm.distributeType ===1, w130: containerPlanForm.distributeType ===2 }" :placeholder="$t('boatEtdList.numberPlaceholder')" />
                        <span v-show="containerPlanForm.distributeType ===2"> / {{ box.surplusQuantity}}</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

<!--          <el-form-item v-for="(item,i) in containerPlanForm.data" :key="item.memberId" :label="item.memberName" :prop="'data.' + i + '.freeDays'" :rules="[{ required: true, message: '请输入免柜天数' }]">-->
<!--            <el-input v-model.number="item.freeDays" v-input-limit="[3,0]" style="width: 80px" maxlength="3" size="mini" />-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <div v-show="planStep === 2" style="color: red; margin-top: 5px">{{$t('boatEtdList.planStepStart')}}</div>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-button v-show="planStep === 1" type="primary" size="mini" @click="planStepNext">{{$t('common.nextStep')}}</el-button>
        <el-button v-show="planStep === 2" type="primary" size="mini" @click="planStepPrev">{{$t('common.previousStep')}}</el-button>
        <el-button v-show="planStep === 2" type="primary" size="mini" @click="containerPlanConfirm">{{$t('common.confirmBtn')}}</el-button>
        <el-button type="" size="mini" @click="containerPlanCancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import topSearchItems from '@/components/Cargo/Common/topSearchItems'
import ETDOperationBtn from './components/ETDOperationBtn'
import {
  getScheduleList,
  delScheduleInfo,
  scheduleInfoPublish,
  scheduleInfoUndercarriage,
  freeListApi, freeUpdateApi, updateYunlspVesselApi, containerInfoApi, containerPlanApi
} from '@/api/schedule'
import EDTBoxConfiguration from '@/views/cargo/v0/CharteredBoat/components/EDTBoxConfiguration'
import {getContainerTypeList} from "@/api/seaExport"
import lodash from 'lodash'
import {validEmail} from "@/utils/validate"
export default {
  name: 'ETDList',
  components: { topSearchItems, ETDOperationBtn, EDTBoxConfiguration },
  data() {
    const defaultFilter = {
      carrierName: '',
      callSign: '',
      vesselName: '',
      voyageNo: '',
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    }
    return {
      loading: false,
      showDialog: false,
      showDialogseaSteward: false,
      showDialogfreeCabinet: false,
      defaultFilter: defaultFilter,
      filter: this.$extends({}, defaultFilter),
      total: 0,
      dataList: [],
      columnDefsRight: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          pinned: 'left',
          width: 55
        },
        {
          headerName: this.$t('charteredBoat.vesselName'),
          field: 'vesselName',
          width: 120
        }, {
          headerName: this.$t('charteredBoat.voyageNo'),
          field: 'voyageNo'
        },
        {
          headerName: this.$t('boatEtdList.callSign'),
          field: 'callSign'
        },
        {
          headerName: this.$t('boatEtdList.shipowner'),
          field: 'chineseName'
        },
        {
          headerName: this.$t('boatEtdList.isTransform'),
          field: 'transitFlag',
          cellRenderer: params => params.value ? this.$t('common.trueText') : this.$t('common.falseText')
        },
        {
          headerName: this.$t('boatEtdList.createTime'),
          field: 'createTime',
          cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          headerName: this.$t('boatEtdList.sailingStatus'),
          field: 'sailingStatus',
          cellRenderer: params => {
            if (params.value === -1) {
              return `<div  class="status-text">${this.$t('common.draft')}</div>`
            } else if (params.value === 2) {
              return `<div  class="status-text danger-text">${this.$t('common.unpublished')}</div>`
            } else if (params.value === 1) {
              return `<div  class="status-text success-text">${this.$t('common.published')}</div>`
            }
          }
        },
        {
          headerName: this.$t('common.operation'), pinned: 'right', field: `id`, width: 100,
          cellRendererFramework: 'ETDOperationBtn'
        }],
      gridOptionsRight: {},
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      selectedItems: [],
      seaStewardForm: {},
      freeCabinetForm: {
        data: []
      },
      showContainerPlan: false, // 用箱计划Dialog
      containerPlanForm: {
        distributeType: null,
        statisticsContainerList: {},
        containerTypeQtyList: {
        },
        polCodeContainerTypeList: [],
        polCodeContainerTypeListArr: []
      },
      containerPlannextNum: 2,
      cntrOpts: [],
      cntrOpts2Copy: [
      ],
      cntrOpts2: [{
        englishName: '20GP'
        }, {
        englishName: '40HC'
      }, {
        englishName: '40RH'
      }
      // , {
      //   englishName: '53FR'
      // }
      ],
      containerInfoData: {},
      nowSupportContainerSizeTypes: [],
      nowSupportContainerSizeTypes2: [],
      initializationContainer: [], // 记录初始化箱子 增加减少切换用
      planStep: 1
    }
  },
  computed: {
  },
  watch: {},
  mounted() {
    // this.list()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // if(from.name === 'ETDInfo') {
      //   vm.list()
      // }
      vm.list()
    })
  },
  created() {
    this.cntrOpts2Copy = lodash.cloneDeep(this.cntrOpts2)
    this.getContainer()
    this.gridOptionsRight = {
      context: {
        componentParent: this
      }
    }
    // this.list()
  },
  methods: {
    quantityInput(quantity, num, row, i) {
      if (this.containerPlanForm.distributeType === 1) {return}
      if (quantity > num) {
        quantity = num
        this.$set(row[i], `quantity`, num)
      }
      if (quantity < 0) {
        this.$set(row[i], `quantity`, 0)
      }
    },
    quantityChange(val, row) {
      if (val > 0) {
        row.containerOwner = 2
      } else {
        let isQuantity = row.containerTypeArr.some(item => item.quantity > 0)
        if (isQuantity) {
          row.containerOwner = 2
        } else {
          row.containerOwner = 1
        }
      }
    },
    // 获取集装箱型
    async getContainer() {
      const res = await getContainerTypeList()
      if (res.ok) {
        this.cntrOpts = res.content
      }
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
    async getContainerInfoApi(id) {
      const res = await containerInfoApi(id)
      if (res.ok) {
        // 根据目的港重新计算箱量
        if (!res.content.polCodeContainerTypeListArr) {
          res.content.polCodeContainerTypeListArr = []
        }
        let nowSupportContainerSizeTypes = []
        res.content.polCodeContainerTypeList.map(item => {
          if (!item.supportContainerSizeTypes) {
            item.supportContainerSizeTypes = []
          }
          let index = res.content.polCodeContainerTypeListArr.findIndex(val => item.polId === val.polId)
          item.quantity = 0
          if (index > -1) {
            res.content.polCodeContainerTypeListArr[index].containerTypeArr.push(item)
            res.content.polCodeContainerTypeListArr[index].supportContainerSizeTypes.push(item.containerType)
          } else {
            res.content.polCodeContainerTypeListArr.push({
              supportContainerSizeTypes: [item.containerType],
              containerTypeArr: [item],
              polId: item.polId,
              polCode: item.polCode,
              polName: item.polName,
              yardCode: item.yardCode,
              containerOwner: item.containerOwner,
              isEdit: false
            })
          }
          // 用箱计划
          nowSupportContainerSizeTypes = lodash.union(nowSupportContainerSizeTypes, [item.containerType])
        })
        this.nowSupportContainerSizeTypes = nowSupportContainerSizeTypes
        this.initializationContainer = lodash.cloneDeep(res.content.polCodeContainerTypeListArr)
        res.content.distributeType = null
        res.content.polCodeContainerTypeListArr = [...res.content.polCodeContainerTypeListArr, ...res.content.polCodeContainerTypeListArr, ...res.content.polCodeContainerTypeListArr]
        this.containerPlanForm = res.content
        this.showContainerPlan = true
      }
    },
    distributeTypeChange(val) {
      this.initializationContainer.map(item => {
        item.containerTypeArr.map(val => {
          val.quantity = 0
        })
      })
      if (val === 1) {
        this.initializationContainer.map(item => {
          item.isEdit = true
        })
      } else if (val === 2) {
        this.initializationContainer.map(item => {
          item.isEdit = false
          item.quantity = 0
        })
      }
      this.$set(this.containerPlanForm, 'polCodeContainerTypeListArr', this.initializationContainer)
    },
    boxConfiguration() {
      this.showDialog = true
    },
    // 用箱计划调整
    adjustmentContainerPlan() {
      this.selectedItems = this.gridApi.getSelectedRows()
      this.checkContainerList = this.selectedItems
      if (!this.selectedItems || this.selectedItems.length === 0 || this.selectedItems.length > 1) {
        this.$message({
          type: 'warning',
          message: this.$t('boatEtdList.selectorEmptyInvalid')
        })
        return false
      }
      this.getContainerInfoApi(this.selectedItems[0].id)
    },
    containerPlanCancel() {
      this.$refs.containerPlanForm.resetFields()
      this.planStepPrev()
      this.showContainerPlan = false
    },
    // 下一步，帅选为0的值
    planStepNext() {
      this.$refs.containerPlanForm.validate(async valid => {
        if (valid) {

          let nowSupportContainerSizeTypes = []
          if (!this.containerPlanForm.polCodeContainerTypeListArr2) {
            this.containerPlanForm.polCodeContainerTypeListArr2 = []
          }
          const polCodeContainerTypeListArr = lodash.cloneDeep(this.containerPlanForm.polCodeContainerTypeListArr)
          // polCodeContainerTypeListArr.map(item => {
          //   let remove = lodash.remove(item.containerTypeArr, val => val.quantity === 0)
          //   remove.map(type => {
          //     lodash.remove(item.supportContainerSizeTypes, val => val === type.containerType)
          //   })
          // })
          // lodash.remove(polCodeContainerTypeListArr, val => val.supportContainerSizeTypes.length === 0)
          // if (!polCodeContainerTypeListArr || polCodeContainerTypeListArr.length === 0) {
          //   this.$message.warning('请修改用箱计划后在提交！')
          //   return
          // }
          this.$set(this.containerPlanForm, 'polCodeContainerTypeListArr2', polCodeContainerTypeListArr)
          this.containerPlanForm.polCodeContainerTypeListArr2.map(item => {
            nowSupportContainerSizeTypes = lodash.union(nowSupportContainerSizeTypes, item.supportContainerSizeTypes)
          })
          this.nowSupportContainerSizeTypes2 = []
          this.$nextTick(() => {
            this.nowSupportContainerSizeTypes2 = nowSupportContainerSizeTypes
          })
          this.planStep = 2
        }
      })

    },
    planStepPrev() {
      this.planStep = 1
    },
    // 提交
    containerPlanConfirm() {
      let data = {
        id: this.containerPlanForm.id,
        distributeType: this.containerPlanForm.distributeType,
        containerPlanAdjustList: []
      }
      this.containerPlanForm.polCodeContainerTypeListArr2.map(item => {
        item.containerTypeArr.map(val => {
          data.containerPlanAdjustList.push({
            polId: item.polId,
            polCode: item.polCode,
            containerType: val.containerType,
            quantity: val.quantity,
            containerOwner: val.containerOwner
          })
        })
      })
      this.$refs.containerPlanForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await containerPlanApi(data)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.submitSuccess'))
           this.containerPlanCancel()
           this.list()
          }
        }
      })
    },
    supportContainerSizeTypesChange(row, val) {
      if (!row.containerTypeArr) {
        this.$set(row, 'containerTypeArr', [])
      }
      let nowSupportContainerSizeTypes = []
      this.containerPlanForm.polCodeContainerTypeListArr.map(item => {
        nowSupportContainerSizeTypes = lodash.union(nowSupportContainerSizeTypes, item.supportContainerSizeTypes)
      })
      this.nowSupportContainerSizeTypes = []
      this.$nextTick(() => {
        this.nowSupportContainerSizeTypes = nowSupportContainerSizeTypes
        row.containerTypeArr.map((item, i) => {
          if (val.indexOf(item.containerType) === -1) {
            row.containerTypeArr.splice(i, 1)
          }

        })
        val.map(item => {
          let r = row.containerTypeArr.find(v => v.containerType === item)
          if (!r) {
            row.containerTypeArr.push({containerType: item, quantity: 0})
          }
        })
      })
    },
    changeEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    // 用箱计划调整 ********************************** end
    seaStewardShipName() {
      this.selectedItems = this.gridApi.getSelectedRows()
      this.checkContainerList = this.selectedItems
      if (!this.selectedItems || this.selectedItems.length === 0 || this.selectedItems.length > 1) {
        this.$message({
          type: 'warning',
          message: this.$t('boatEtdList.selectorEmptyInvalid')
        })
        return false
      }
      this.showDialogseaSteward = true
      this.$set(this.seaStewardForm, 'yunlspVessel', this.selectedItems[0].yunlspVessel)
    },
    cancel() {
      this.$refs.EDTBoxConfiguration.cancel()
    },
    onReadyRight(params) {
      // const self = this
      this.gridApi = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
          // self.onFirstDataRendered()
        })
      })
    },
    /**
     * 获取配置信息
     */
    async list() {
      this.loading = true
      const res = await getScheduleList(this.filter).catch(() => {this.loading = false})
      if (res.ok) {
        this.dataList = res.content.list
        this.total = Number(res.content.total)
        this.loading = false
      } else {
        this.dataList = []
        this.total = 0
        this.loading = false
      }
    },
    /**
     * 新增编辑页面
     */
    edit(id) {
      this.$router.push({ name: `ETDInfo`, query: { id }})
    },
    /**
     * 发布
     */
    async release(id) {
      const res = await scheduleInfoPublish({ id })
      if (res.ok) {
        this.$message.success(this.$t('boatEtdList.updateMessage'))
        this.list()
      }
    },
    /**
     * 下架
     */
    async scheduleInfoUndercarriage(id) {
      const res = await scheduleInfoUndercarriage({ id })
      if (res.ok) {
        this.$message.success(this.$t('boatEtdList.updateMessage'))
        this.list()
      }
    },
    /**
     * 删除
     */
    del(id) {
      this.$confirm(this.$t('boatEtdList.deleteWarnningText'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        delScheduleInfo(id).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('common.deleteSuccess'))
            this.list()
          }
        })
      }).catch(() => {

      })
    },
    /**
     * 充值查询条件
     */
    reset() {
      this.filter = this.$extends({}, this.defaultFilter)
      this.list()
    },
    // 海管家配置
    seaStewardDialogCancel() {
      this.showDialogseaSteward = false
      this.$nextTick(() => {
        this.$refs.seaStewardForm.resetFields()
      })
    },
    seaStewardDialogConfirm() {
      this.$refs.seaStewardForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await updateYunlspVesselApi(this.seaStewardForm, this.selectedItems[0].id)
          if (res.ok) {
            this.loading = false
            this.seaStewardDialogCancel()
            this.$message.success(this.$t('charteredBoat.submitSuccess'))
            this.list()
          }
        }
      })
    },
    // 免柜配置
    async showfreeCabinet(data) {
      this.loading = true
      const res = await freeListApi(data.id)
      this.loading = false
      if (res.ok) {
        this.$set(this.freeCabinetForm, 'data', res.content)
        this.$set(this.freeCabinetForm, 'vesselName', data.vesselName)
        this.$set(this.freeCabinetForm, 'voyageNo', data.voyageNo)
        this.showDialogfreeCabinet = true
        this.freeCabinetForm.sailingId = data.id
      }
    },
    freeDialogConfirm() {
      this.$refs.freeCabinetForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await freeUpdateApi(this.freeCabinetForm)
          this.loading = false
          if (res.ok) {
            this.showDialogfreeCabinet = false
            this.$message.success(this.$t('boatEtdList.submitWithoutContainerSucess'))
          }
        } else {
          this.mixinsFormScrollIntoView()
          return false
        }
      })
    },
    freeDialogCancel() {
      this.showDialogfreeCabinet = false
      this.$nextTick(() => {
        this.$refs.freeCabinetForm.resetFields()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './styles/table.scss';
::v-deep.status-text{
  color: #909399;
  &.info-text{
    color: #909399;
  }
  &.warning-text{
    color: #E6A23C;
  }
  &.success-text{
    color: #67C23A;
  }
  &.danger-text{
    color: #F56C6C;
  }
  &.primary-text{
    color: #409EFF;
  }
}
::v-deep .el-form-item__error {
  padding-top: 4px;
}
.freeCabinetForm ::v-deep{
  .el-form-item__label{
    //overflow: hidden;
    //text-overflow:ellipsis;
    //white-space: nowrap;
  }
  .el-form-item__error {
    padding-top: 0px;
  }
  .el-form-item{ margin-bottom: 12px;}
}
.flex{ display: flex}
.statistics{width: 50%;  margin: 0 0 0 15%;
  li{ line-height: 1.5em; margin-bottom: 8px; display: flex;justify-content: flex-start;
    div:nth-child(1){flex-shrink: 0;}
  }
}
.w190{ width: 190px}
.w130{ width: 130px}
.haeder{ margin: 10px 0 0 44px; line-height: 1.5em}
.adjustment_plan{ margin: 0px 0 0 5px; width: 100%;
  ::v-deep .el-form-item__label{ font-size: 14px!important;width: 95px;text-align: right; }
}
.dataTable {
  ::v-deep.el-table__body-wrapper{ min-height: 397px!important;}
}
</style>
