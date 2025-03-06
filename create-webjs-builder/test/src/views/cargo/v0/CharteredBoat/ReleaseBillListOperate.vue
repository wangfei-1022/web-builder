<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('charteredBoat.blNo')}: `" prop="blNo">
              <el-input v-model="multipleForm.blNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.containerNo')}: `" prop="containerNo">
              <el-input v-model="multipleForm.containerNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.sealNo')}: `" prop="sealNo">
              <el-input v-model="multipleForm.sealNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vessel" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
              <el-input v-model="multipleForm.voyage" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('releaseBillList.releaseNo')}: `" prop="releaseNo">
              <el-input v-model="multipleForm.releaseNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item class="el-form-item" :label="`${$t('charteredBoat.polCode')}: `" prop="polCode">
              <cargo-advance-select
                :url="`${VUE_APP_BASE_API}/api/mdm-service/dmn/seaportlist`"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{getItemFromChild(data,'polCode')}"
                ref="polCode"
              />
            </el-form-item>
            <el-form-item class="el-form-item" :label="`${$t('charteredBoat.podCode')}: `" prop="podCode">
              <cargo-advance-select
                :url="`${VUE_APP_BASE_API}/api/mdm-service/dmn/seaportlist`"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{getItemFromChild(data,'podCode')}"
                ref="podCode"
              />
            </el-form-item>
            <el-form-item :label="`${$t('releaseBillList.confirmTime')}: `" prop="multipleFormTime">
              <el-date-picker
                v-model="multipleFormTime"
                type="daterange"
                align="right"
                unlink-panels
                :range-separator="$t('common.datepickerSeparator')"
                :start-placeholder="$t('releaseBillList.startDate')"
                :end-placeholder="$t('releaseBillList.endDate')"
                value-format="timestamp"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                @change="dateChange"
                size="mini"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="`${$t('releaseBillList.status')}: `" prop="status">
              <el-select v-model="multipleForm.status" size="mini" @change="getList">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="1" :label="$t('releaseBillList.unConfirmed')" />
                <el-option value="2" :label="$t('releaseBillList.rejectedByBusiness')" />
                <el-option value="3" :label="$t('releaseBillList.confirmedByBusiness')" />
                <el-option value="4" :label="$t('releaseBillList.rejectedByOpreator')" />
                <el-option value="5" :label="$t('common.passed')" />
                <el-option value="-1" :label="$t('releaseBillList.releaseDropText')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.memberName')}: `" prop="memberId">
              <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="remoteApi" @selectorChange="getList" />
            </el-form-item>
            <el-form-item :label="`ATD: `" prop="status">
              <el-date-picker
                v-model="multipleFormTimeAtd"
                type="daterange"
                align="right"
                unlink-panels
                :range-separator="$t('common.datepickerSeparator')"
                :start-placeholder="$t('releaseBillList.startDate')"
                :end-placeholder="$t('releaseBillList.endDate')"
                value-format="timestamp"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                @change="atdDateChange"
                size="mini"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="getList">
          {{ $t('common.searchBtn') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('common.resetBtn') }}
        </el-button>
      </div>
    </topSearchItems>
    <div class="container-wrap">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"
        :column-defs="columnDefsRight"
        :row-data="tableData.list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        style="height:calc(100vh - 460px)"
        class="ag-theme-balham"
      />
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>

    <el-dialog v-loading="loading" :title="$t('releaseBillList.releaseConfirmText')" top="5vh" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="closeConfirmDialog" class="release-confirmation" width="85%">
      <el-form :inline="false" label-width="100px" :model="confirmationGuaranteeForm" @submit.native.prevent ref="confirmationGuaranteeForm" style="width: 100%;min-width: 1200px">
        <div style="display: flex;">
          <div style="width: 35%;max-height: 700px; overflow: auto ">
            <el-form-item :label="$t('releaseBillList.memberName')" prop="declareStatus">
              {{ confirmationGuaranteeForm.memberName }}
            </el-form-item>
            <el-form-item :label="$t('releaseBillList.declareBlNo')" prop="declareStatus">
              <el-collapse v-for="(item,index) in confirmationGuaranteeForm.blNos" :key="index" v-model="confirmationGuaranteeForm.selBlNos" @change="selBlNos" accordion style="width: 420px; padding-top: 6px">
                <el-collapse-item :title="item" :name="item">
                  <div class="blno-ul">
                    <div>
                      <p>{{$t('releaseBillList.polCodeAndPodCode')}}: </p><p>{{ blDetails.polCode }} - {{ blDetails.podCode }}</p>
                    </div>
                    <div>
                      <p>{{$t('releaseBillList.containerQuantity')}}: </p><p>{{ blDetails.containerSizeTypeQty }}</p>
                    </div>
                    <div>
                      <p>{{$t('releaseBillList.consignerInfo')}}: </p><p>{{ blDetails.shipperAddress }}</p>
                    </div>
                    <div>
                      <p>{{$t('releaseBillList.consigneeInfo')}}: </p><p>{{ blDetails.consigneeAddress }}</p>
                    </div>
                    <div>
                      <p>{{$t('releaseBillList.notifierInfo')}}: </p><p>{{ blDetails.notifyAddress }}</p>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
            <el-form-item :label="$t('releaseBillList.totalAmount')" prop="declareStatus">{{ confirmationGuaranteeForm.containerSizeTypeQty }}</el-form-item>
            <el-form-item :label="$t('releaseBillList.declareRemark')" prop="declareStatus">{{ confirmationGuaranteeForm.memberRemark }}</el-form-item>
          </div>
          <div style="max-height: 700px; overflow: auto; width: 65%">
            <el-form-item label="申请状态" label-width="71px" prop="status" :rules="[{ required: true, message: '请选择申请状态', trigger: 'change' },]">
              <el-radio-group v-model="confirmationGuaranteeForm.status" @change="passStatusChange">
                <el-radio :label="4">{{$t('releaseBillList.reject')}}</el-radio>
                <el-radio :label="5">{{$t('releaseBillList.pass')}}</el-radio>
              </el-radio-group>
            </el-form-item>
<!--            <el-form-item v-if="confirmationGuaranteeForm.status === 4" label="驳回原因" prop="rejectReason" :rules="[{ required: true, message: `请填写驳回原因`, trigger: 'blur' },]">-->
<!--              <el-input v-model="confirmationGuaranteeForm.rejectReason" type="textarea" rows="4" style="width: 600px;" placeholder="请输入驳回原因" />-->
<!--            </el-form-item>-->
            <el-form-item v-if="confirmationGuaranteeForm.status === 4" :label="$t('releaseBillList.reasonOfRejected')" label-width="71px" prop="rejectReason" :rules="[{ required: true, message: $t('releaseBillList.reasonEmptyInvalid'), trigger: 'blur' },]">
              <el-input v-model="confirmationGuaranteeForm.rejectReason" type="textarea" rows="4" maxlength="500" style="width: 600px;" show-word-limit :placeholder="$t('releaseBillList.reasonRejectPlaceholder')" />
            </el-form-item>
            <el-form-item v-if="confirmationGuaranteeForm.status === 5" :label="$t('releaseBillList.remarkVerify')" label-width="71px" prop="operatePassRemark">
              <el-input v-model="confirmationGuaranteeForm.operatePassRemark" type="textarea" rows="4" maxlength="500" style="width: 600px;" show-word-limit :placeholder="$t('releaseBillList.remarkVerifyPlaceholder')" ></el-input>
            </el-form-item>

            <div class="table-wrap mb-10">
              <el-dropdown class="ml-10" size="mini" @command="picturePreview">
                <el-button type="primary">
                  {{$t('releaseBillList.releaseFileView')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in confirmationGuaranteeForm.files" v-if="item.fieldCode === 'release'" :command="index" :key="index">{{ item.cloudFileName }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown class="ml-10" size="mini" @command="picturePreview">
                <el-button type="primary">
                  {{$t('releaseBillList.paymentFileView')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in confirmationGuaranteeForm.files" v-if="item.fieldCode === 'payment'" :command="index" :key="index">{{ item.cloudFileName }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </div>
            <div style="min-width: 500px; height: 596px; overflow: auto ">
<!--              <iframe v-if="confirmationGuaranteeForm.fileType === 1" :src="confirmationGuaranteeForm.viewUrl" width="90%" height="800px" style="margin-left: 5%; overflow: auto"></iframe>-->
<!--              <el-image v-if="confirmationGuaranteeForm.fileType === 2" style="width: 100%; height: 100%" :src="confirmationGuaranteeForm.viewUrl" fit="contain"></el-image>-->
              <iframe v-if="confirmationGuaranteeForm.fileType === 1" :src="confirmationGuaranteeForm.viewUrl" width="90%" height="800px" style="margin-left: 5%; overflow: auto"></iframe>
              <img v-if="confirmationGuaranteeForm.fileType === 2" :src="confirmationGuaranteeForm.viewUrl">
              <div v-if="confirmationGuaranteeForm.fileType === -1" class="no-data">{{$t('releaseBillList.nonFileUpload')}}</div>

            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendConfirms">{{$t('common.confirmBtn')}}</el-button>
        <el-button @click="closeConfirmDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('common.viewBtn')" :visible.sync="dialogViewFile" :close-on-click-modal="false" :before-close="closeReleaseGuaranteeDialog" width="95%" top="1vh">
      <div class="releaseGuarantee">
        <el-carousel :interval="5000" arrow="always" :autoplay="false" style="width: 100%; height: 800px">
          <div v-for="(item,index) in viewFileList" :key="index">
            <el-carousel-item v-if="item.fileType === 1" style="width: 100%; height: 800px">
              <iframe :src="item.url" width="90%" height="800px" style="margin-left: 5%"></iframe>
            </el-carousel-item>
            <el-carousel-item v-if="item.fileType === 2" style="width: 100%; height: 800px">
              <img :src="item.url" class="center" style="min-height:30%;max-height: 80%; max-width: 80%">
            </el-carousel-item>
          </div>

        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import {
  releaseDetailApi,
  releaseFileListApi, releaseJobBlApi,
  releaseListOperateApi,
  updateStatusByOperateApi
} from "@/api/charteredBoat/releaseBill"
import topSearchItems from "@/components/Cargo/Common/topSearchItems"
import {parseTime} from "@/utils"
import RemoteSearchSelector from "@/components/Cargo/Common/RemoteSearchSelector"
import {getRemoteMemberApi} from "@/api/user"
export default {
  name: 'ReleaseBillListOperate',
  components: { cargoAdvanceSelect, topSearchItems, RemoteSearchSelector,
    'incomeComponent': {
      template: `<el-button v-if="params.data.status === 3"  type="text" size="mini" @click="params.context.componentParent.confirm(params.data.id)">{{params.btnView}}</el-button>`,
      methods: {}
    },
    'viewPictureRelease': {
      template: `<el-button  type="text" size="mini" @click="params.context.componentParent.viewPicture(params.data.id, 'release')">{{params.btnView}}</el-button>`,
      methods: {}
    },
    'viewPicturePayment': {
      template: `<el-button  type="text" size="mini" @click="params.context.componentParent.viewPicture(params.data.id, 'payment')">{{params.btnView}}</el-button>`,
      methods: {}
    },
    'statusNameComponents': {
      template: `<div><span class="status-text primary-text">{{params.data.statusName}}</span>
      <el-tooltip v-if="params.data.accountStatus === 0 || params.data.accountStatus === false" :content="params.contentText" placement="top" effect="light">
        <i class="el-icon-warning" style="color: red; font-size: 14px" ></i>
      </el-tooltip></div>`,
      methods: {}
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        },
        shortcuts: [{
          text: this.$t('releaseBillList.lastWeek'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('releaseBillList.lastMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('releaseBillList.previousThreeMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      loading: false,
      pageSizeList: [10, 20, 30, 40],
      tableData: {},
      selectedItems: [], // 列表选择
      pagination: {
        pageNum: 1,
        pageSize: 50
      },
      pageTotal: 0,
      multipleForm: {
        blNo: null,
        containerNo: null,
        sealNo: null,
        vessel: null,
        voyage: null,
        releaseNo: this.$route.query.releaseNo || null,
        polCode: null,
        podCode: null,
        status: null,
        pageNum: 1,
        pageSize: 50,
        operateTimeStart: null,
        operateTimeEnd: null
      },
      multipleFormTime: null,
      multipleFormTimeAtd: null,
      vm: this,
      VUE_APP_BASE_API: '',
      soNoList: [],
      dialogVisible: false,
      dialogViewFile: false,
      viewFileList: [],
      confirmationGuaranteeForm: {},
      gridApi: null,
      columnDefsRight: [{
        headerName: '',
        width: 55,
        pinned: 'left',
        suppressSorting: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        suppressMenu: true,
        suppressSizeToFit: true,
        suppressResize: true
      }, {
        headerName: this.$t('releaseBillList.releaseNo'),
        field: 'releaseNo',
        tooltipField: 'releaseNo',
        minWidth: 140,
        pinned: 'left'
      }, {
        headerName: this.$t('charteredBoat.memberName'),
        field: 'memberName',
        tooltipField: 'memberName',
        minWidth: 140,
        pinned: 'left'
      }, {
        headerName: this.$t('releaseBillList.status'),
        minWidth: 120,
        cellRendererFramework: 'statusNameComponents',
        cellRendererParams: {contentText: this.$t('releaseBillList.unpayText')}
      }, {
        headerName: this.$t('charteredBoat.blNo'),
        field: 'blNos',
        tooltipField: 'blNos',
        minWidth: 120,
        cellClass: 'status-text primary-text'
      }, {
        headerName: this.$t('charteredBoat.typeAndQuantity'),
        field: 'containerSizeTypeQty',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.blType'),
        field: 'blTypeName',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.vesselName'),
        field: 'vessel',
        minWidth: 120
      }, {
        headerName: this.$t('charteredBoat.voyageNo'),
        field: 'voyage',
        minWidth: 120
      }, {
        headerName: 'ATD',
        field: 'atd',
        minWidth: 120,
        cellRenderer: params => this.formatDate(params.value)
      }, {
        headerName: this.$t('common.reasonOfRejected'),
        field: 'rejectReason',
        minWidth: 120
      }, {
        headerName: this.$t('releaseBillList.releaseFile'),
        minWidth: 120,
        cellRendererFramework: 'viewPictureRelease',
        cellRendererParams: {btnView: this.$t('common.viewBtn')}
      }, {
        headerName: this.$t('releaseBillList.paymentFile'),
        minWidth: 80,
        cellRendererFramework: 'viewPicturePayment',
        cellRendererParams: {btnView: this.$t('common.viewBtn')}
      }, {
        headerName: this.$t('releaseBillList.businessName'),
        field: 'businessName',
        tooltipField: 'businessName',
        minWidth: 140
      }, {
        headerName: this.$t('releaseBillList.businessTime'),
        field: 'businessTime',
        tooltipField: 'businessTime',
        minWidth: 140
      }, {
        headerName: this.$t('releaseBillList.businessPassRemark'),
        field: 'businessPassRemark',
        tooltipField: 'businessPassRemark',
        minWidth: 140
      }, {
        headerName: this.$t('releaseBillList.operateName'),
        field: 'operateName',
        tooltipField: 'operateName',
        minWidth: 140
      }, {
        headerName: this.$t('releaseBillList.operateTime'),
        field: 'operateTime',
        tooltipField: 'operateTime',
        minWidth: 140
      }, {
        headerName: this.$t('releaseBillList.operatePassRemark'),
        field: 'operatePassRemark',
        tooltipField: 'operatePassRemark',
        minWidth: 140
      },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 90, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'incomeComponent',
        cellRendererParams: {btnView: this.$t('common.confirmBtn')}
      }
      ],
      gridOptionsRight: {
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      blDetails: {} // 提单详情
    }
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    }),
    remoteApi() {
      return getRemoteMemberApi
    }
  },
  filters: {
    filterSoc(socFlag, vm) {
      return socFlag ? vm.$t('containerList.socFlagYes') : vm.$t('containerList.socFlagFalse')
    },
    filterBLClass(_status) {
      const classList = [
        '',
        'status-text info-text',
        'status-text warning-text',
        'status-text success-text',
        'status-text danger-text',
        'status-text primary-text'
      ]
      return classList[_status]
    },
    filterDeclareClass(_status) {
      const classList = [
        'status-text info-text',
        'status-text warning-text',
        'status-text warning-text',
        'status-text success-text',
        'status-text danger-text',
        'status-text primary-text'
      ]
      return classList[_status]
    },
    filterFullInTime(timestamp, vm) {
      if (!timestamp) {
        return ''
      }
      return vm.$moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
    },
    isHouseBill(_status) {
      if (_status === true) {
        return this.$t('common.trueText')
      } else if (_status === false) {
        return this.$t('common.falseText')
      }
    }
  },
  watch: {
    'multipleForm.status'(val) {
      if (val === '-1') {
        let len = this.columnDefsRight.length - 1
        if (this.columnDefsRight[len].field !== 'cancelRemark') {
          this.columnDefsRight.push({
            headerName: this.$t('releaseBillList.dropReason'),
            field: 'cancelRemark',
            tooltipField: 'cancelRemark',
            minWidth: 140
          })
        }
      } else {
        let index = this.columnDefsRight.findIndex(item => item.field === 'cancelRemark')
        if (index > -1) {
          this.columnDefsRight.splice(index, 1)
        }
      }
    }
  },
  methods: {
    dateChange(val) {
      if (val) {
        this.multipleForm.businessTimeStart = val[0]
        this.multipleForm.businessTimeEnd = val[1]
      } else {
        this.multipleForm.businessTimeStart = null
        this.multipleForm.businessTimeEnd = null
      }

    },
    atdDateChange(val) {
      if (val) {
        this.multipleForm.atdTimeStart = val[0]
        this.multipleForm.atdTimeEnd = val[1]
      } else {
        this.multipleForm.atdTimeStart = null
        this.multipleForm.atdTimeEnd = null
      }
    },
    async getList() {
      this.loading = true
      const res = await releaseListOperateApi(this.multipleForm)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(ex => {
          if (ex.businessTime) {ex.businessTime = parseTime(ex.businessTime)}
          if (ex.operateTime) {ex.operateTime = parseTime(ex.operateTime)}
        })
        this.tableData = res.content
        this.pageTotal = Number(res.content.total)
      } else {
        this.pageTotal = 0
        this.tableData = []
      }
    },
    topSearch() {
      this.currPage = 1
      this.getList()
    },
    selBlStatusrChange(data, val) { // 下拉框
      this.multipleForm[val] = data
      this.getList()
    },
    selTrailerStatusChange(data) {
      this.multipleForm.trailerStatus = data
      this.getList()
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.$refs.polCode.value = null
      this.$refs.podCode.value = null
      this.multipleFormTime = null
      this.multipleFormTimeAtd = null
      this.multipleForm.operateTimeStart = null
      this.multipleForm.operateTimeEnd = null
      this.multipleForm.atdTimeStart = null
      this.multipleForm.atdTimeEnd = null
      this.getList()
    },
    onReady(params) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    /** 选中装货港 */
    getItemFromChild(val, key) {
      this.multipleForm[key] = val.code5
      if (val.code5) {
        this.getList()
      }
    },
    /** =======================================*/
    calculationFileType(cloudFileName) {
      const pdf = ['pdf', 'PDF']
      const img = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']
      let fileName = cloudFileName.split('.')
      let fileNameType = fileName[fileName.length - 1]
      if (pdf.indexOf(fileNameType) > -1) {
        return 1
      }
      if (img.indexOf(fileNameType) > -1) {
        return 2
      }
    },
    async viewPicture(id, type) { // 放单保函/凭证文件查看
      this.loading = true
      let params = {
        fieldCode: type
      }
      const res = await releaseFileListApi(params, id)
      this.loading = false
      if (res.ok) {
        this.dialogViewFile = true
        res.content.map(item => {
          item.fileType = this.calculationFileType(item.cloudFileName)
        })
        this.viewFileList = res.content
      }
    },
    closeReleaseGuaranteeDialog() { // 关闭放单保函/凭证文件查看
      this.dialogViewFile = false
      this.viewFileList = []
    },
    picturePreview(index) { // 保函预览
      if (index > -1) {
        const file = this.confirmationGuaranteeForm.files[index]
        const fileType = this.calculationFileType(file.cloudFileName)
        this.$set(this.confirmationGuaranteeForm, 'fileType', fileType)
        this.$set(this.confirmationGuaranteeForm, 'viewUrl', this.confirmationGuaranteeForm.files[index].url)
      } else {
        this.$set(this.confirmationGuaranteeForm, 'fileType', -1)
      }

    },
    async confirm(id) {
      if (id) {
        this.loading = true
        const res = await releaseDetailApi(id)
        this.loading = false
        if (res.ok) {
          res.content.blNos = res.content.blNos.split(',')
          this.confirmationGuaranteeForm = res.content
          this.confirmationGuaranteeForm.id = id
          let index = res.content.files.findIndex(item => item.fieldCode === 'release')
          this.picturePreview(index)

        }
      }
      this.dialogVisible = true
    },
    async selBlNos(blNo) { // 提单详情
      if (blNo) {
        this.loading = true
        const res = await releaseJobBlApi(blNo)
        this.loading = false
        if (res.ok) {
          this.blDetails = res.content
        }
      }
    },
    passStatusChange() {
      this.$set(this.confirmationGuaranteeForm, 'rejectReason', null)
      this.$set(this.confirmationGuaranteeForm, 'operatePassRemark', null)
      this.$refs.confirmationGuaranteeForm.clearValidate(['rejectReason', 'operatePassRemark'])
    },
    sendConfirms() { // 审核
      this.$refs.confirmationGuaranteeForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let data = {
            rejectReason: this.confirmationGuaranteeForm.rejectReason,
            status: this.confirmationGuaranteeForm.status,
            operatePassRemark: this.confirmationGuaranteeForm.operatePassRemark
          }
          const res = await updateStatusByOperateApi(data, this.confirmationGuaranteeForm.id)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.submitSuccess'))
            this.closeConfirmDialog()
            this.getList()
          }

        } else {
          this.mixinsFormScrollIntoView()
          return
        }
      })
    },
    closeConfirmDialog() {
      this.$refs.confirmationGuaranteeForm.resetFields()
      this.dialogVisible = false
    }
  },
  async created() {
    this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
    this.getList()
  }
}

</script>
<style lang='scss' scoped>
// .sys-right-inner-wrap {
//   height: 100%;
//   overflow: hidden;
//   overflow-y: auto;
// }

.container-wrap {
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
}

.pagination-wrap {
  margin-top: 20px;
  text-align: right;
}

.features-btn {
  margin-top: 15px;
}

.dataTable {
  margin-top: 15px;
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
::v-deep .el-table__expand-column{
  pointer-events: none;
}
::v-deep .el-table__expand-column .el-icon{
  visibility:hidden;
}
.list-operating{
  display: flex; justify-content: space-between;
  ::v-deep .el-button{ margin-left: 0;}
}
.release-confirmation ::v-deep {
  .el-form-item__label{ font-weight: bold !important}
  .el-collapse{ border: none}
  .el-collapse-item__header{ border: none; height: 24px; line-height: 24px}
}
.blno-ul{
  div{
    p{  display: table-cell;}
    p:first-child{ width: 80px; text-align: right;}
  }
}
.releaseGuarantee{ width: 100%; height: 100%;
  ::v-deep .el-carousel__container{ height: 100%}
}
.center{ position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto}
.no-data{ width: 80%; line-height: 15em; text-align: center; font-size: 20px; font-weight: bold; color: #ccc;letter-spacing: 5px;}
</style>

