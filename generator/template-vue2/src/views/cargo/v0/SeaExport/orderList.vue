<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner" >
    <search-item
      v-show="true"
      ref="searchItem"
      source-page="order"
      :is-sea-export-job-list="true"
      sim-url="/api/sea-service/sea/order/export/list"
      adv-url="/api/sea-service/sea/order/export/list"
      search-item-code="海运出口"
      search-item-mode="querydata"
      :searchItemsDefault="true"
      config-module="101"
      @mode-switched="resetHeight"
      @multipleSelectionCallBack="multipleSelectionCallBack"
      @simSearchItemCallBack="keywordSearch"
      @resetSearch="resetSearch"
      @toggle-is-showing-more-search-condition="handleIsShowingMoreSearchConditionToggle"
      @queryDataCallBack="filterJobListWithSearchResult"
      :reset="true"
    >
      <div slot="search-right">
        <!--        <el-button type="text" size="mini" @click="toFilterByDateRange(null)">{{ $t('sea.all') }}</el-button>-->
        <el-button v-for="(item,index) in seaLineList" :type="item.active? 'primary': 'text'" :key="index" size="mini" :style="{color:item.active? '#fff': '#979797'}" @click="toFilterByDateRange(item.value,index)">
          {{ item.name }}
        </el-button>
      </div>
    </search-item>

    <div class="operate-buttons" style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff" >
      <div class="operate-buttons-left">
        <!--{{ dynamicHeightFactor }}, {{ isShowingMoreSearchCondition }}, {{ searchItemHeight }}-->
        <router-link :to="{name: 'SeaExportOrderCreate'}"><el-button type="primary" size="mini">{{ $t('sea.newOrder') }}</el-button></router-link>
        <el-button type="primary" size="mini" @click="importVGM" style="margin-left: 10px;">{{ $t('sea.importVGMInformation') }}</el-button>
        <el-dropdown size="mini" @command="exportCommand" style="margin-left: 10px;">
          <el-button type="primary" size="mini">
            {{ $t('sea.export') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">{{ $t('sea.exportOrderDetails') }}</el-dropdown-item>
            <el-dropdown-item command="2">{{ $t('sea.orderGrossProfitList') }}</el-dropdown-item>
            <el-dropdown-item command="3">{{ $t('sea.hblList') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary"  size="mini" @click="issueClick">{{ $t('sea.issue') }}</el-button>
        <el-button type="primary"  size="mini" @click="changeOrderQuery">{{ $t('sea.changeOrderQuery') }}</el-button>
        <el-button type="primary"  size="mini" @click="preAlert">PRE-ALERT</el-button>
      </div>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :column-defs="columnDefs"
      :row-data="rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :animate-rows="true"
      :grid-ready="onReady"
      :first-data-rendered="onFirstDataRendered"
      :style="listGridStyle"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />

    <!--    <DataImport :btnText="updateMsg.btnText" :code="updateMsg.code" :name="updateMsg.name" :showDataImportDialog.sync="showDataImportDialog" @close="colseDialog"-->
    <!--                :uploadUrl="`/api/sea-service/sea/order/export/uploadVgm`"-->
    <!--                @packingUpdate="packingUpdate"-->
    <!--                :downLoadFileName="downLoadFileName"-->
    <!--                :isDownloadExcel.sync="isDownloadExcel">-->
    <!--    </DataImport>-->

    <DataImport :btnText="updateMsg.btnText"
                :code="updateMsg.code"
                :name="updateMsg.name"
                :showDataImportDialog.sync="showDataImportDialog"
                @close="colseDialog"
                :isDownloadExcel="true"
                :autoUpload="autoUpload"
                uploadType="packing"
                :limit="1"
                :whiteList="whiteList"
                :uploadUrl="`/api/sea-service/sea/order/export/uploadVgm`"
                @packingUpdate="packingUpdate"
                :downLoadFileName="downLoadFileName"
    ></DataImport>
    <BookingConfirm v-if="bookingDialog" :bookingDialog.sync="bookingDialog" :goodsTypeCode="goodsTypeCode" @bookingConfirmCallBack="bookingConfirmCallBack"></BookingConfirm>

    <el-dialog :visible.sync="changeOrderDialog" v-if="changeOrderDialog" :title="$t('sea.changeOrderResultQuery')" width="750px" :before-close="closeChangeOrder" v-loading="loading">
      <el-form ref="changeOrderForm" :model="changeOrderForm" :inline="true" class="changeOrderForm" style="margin-top: 10px;">
        <el-form-item :label="$t('sea.changeDocument')+':'" prop="alterType" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]">
          <el-radio-group v-model="changeOrderForm.alterType">
            <el-radio :label="1">{{ $t('sea.booking') }}</el-radio>
            <el-radio :label="2" v-if="$isNotEmpty(changeOrderData.blNos)">{{ $t('sea.bill') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="changeOrderForm.alterType===2" style="margin-left: 190px" :label="$t('sea.billNo')+':'" prop="id" size="mini"  :rules="[ { required: true,message:$t('sea.placeholder'),trigger: 'change'} ]">
          <el-select v-model="changeOrderForm.id">
            <el-option v-for="item in changeOrderData.blNos" :key="item.id" :label="item.blNo" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="color: red;  margin-top: 20px; display: flex">
        <div style="width: 50px;">{{ $t('sea.tips') }}：</div>
        <div>
          {{$t('sea.changeOrderDialog1')}}<br/>
          {{$t('sea.changeOrderDialog2')}}<br/>
          {{$t('sea.changeOrderDialog3')}}
        </div>
      </div>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitChangeOrder">{{ $t('sea.submit') }}</el-button>
        <el-button size="small" @click="closeChangeOrder">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
<!--    PRE-ALERT-->
    <el-dialog :visible.sync="preAlertDialog" v-if="preAlertDialog" :title="$t('sea.preALERTEmailSending')" width="750px" :before-close="closePreAlert" :close-on-click-modal="true" v-loading="loading">
      <el-form ref="emailSendingForm" :model="emailSendingForm" :inline="true" class="emailSendingForm">
        <el-form-item :label="$t('sea.emailTitle')" prop="emailTitle" :rules="[required]" >
          <el-input v-model="emailSendingForm.emailTitle" size="mini" maxlength="500"></el-input>
        </el-form-item>
        <el-form-item :label="$t('sea.sendingAddress')" prop="emailTo" :rules="[required]"  >
          <el-autocomplete class="autocomplete" size="mini" v-model="emailSendingForm.emailTo"
                           :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'emailTo')})" :placeholder="$t('sea.pleaseEnter')"
                           @select="handleSelectEmail($event,'emailCc')" style="width: 100%" :maxlength="500">
            <template slot-scope="{item}">
              <div style="font-weight: bold; line-height: 1.2em">To:{{item.emailTo}}</div>
              <div style="font-size: 10px; color: #7d7d7f; line-height: 1.2em">Cc:{{item.emailCc}}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t('sea.copyAddress')" prop="emailCc" :rules="[required]"  >
          <el-autocomplete class="autocomplete" size="mini" v-model="emailSendingForm.emailCc"
                           :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'emailCc')})" :placeholder="$t('sea.pleaseEnter')"
                           @select="handleSelectEmail($event,'emailTo')" style="width: 100%" :maxlength="500">
            <template slot-scope="{item}">
              <div style="font-weight: bold; line-height: 1.2em">Cc:{{item.emailCc}}</div>
              <div style="font-size: 10px; color: #7d7d7f; line-height: 1.2em">To:{{item.emailTo}}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item :label="$t('sea.sendingAttachments')" prop="hblList" :rules="[required]">
          <div style="display: flex;line-height: 1.4em; margin-top: 9px">
            <div style="display: flex; width: 50%">
              <div>HBL： </div>
              <div>
                <div v-for="item in emailSendingForm.hblList" :key="item.id" style="line-height: 1.4em">
                  <span v-if="$isEmpty(item.fileElectronDTOList)">{{item.blNo}}</span>
                  <el-button v-else type="text"  @click="downloadElectronicFile(item.fileElectronDTOList[0])" style="padding: 0">{{item.blNo}}</el-button>
                </div>

              </div>
            </div>
            <div style="display: flex; width: 50%">
              <div style="width: 75px">MBL： </div>
              <div>
                <div v-for="item in this.emailSendingForm.mblList" :key="item.id">{{item.blNo}}</div>
                <uploadFile v-if="$isEmpty(mblFileList)" v-model="emailSendingForm.mblFileList" :limit="1">
                  <div slot="upload">
                    <el-button v-show="$isEmpty(emailSendingForm.mblFileList)" type="primary" size="mini"  style="margin-left: 50px;">
                      {{$t('channelPriceCard.upload_file')}}
                    </el-button>
                  </div>
                </uploadFile>
                <el-button v-else type="text" v-for="item in emailSendingForm.mblFileList" :key="item.id"  @click="downloadElectronicFile(item)" style="margin: 0">{{item.fileName}}</el-button>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('sea.messageBody')" prop="emailContent" :rules="[required]"  >
          <el-input v-model="emailSendingForm.emailContent" type="textarea" :rows="6" size="mini" maxlength="4000" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button type="primary" size="small" @click="submitPreAlert">{{ $t('sea.sendOut') }}</el-button>
        <el-button size="small" @click="closePreAlert">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
    <reportListDialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />
  </div>

</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import URL from '@/api/urlTranslator'
import searchItem from '@/components/Cargo/Dmn/searchItem'
import { parseTime } from "@/utils"
import {downloadElectronicFileApi, getDmnTermItemList, getJobNoList} from "@/api/seaExport"
import { getScheduleList } from "@/api/schedule"
import DataImport from '@/components/DataImport'
import { getGridSelected } from "@/utils/gridChoose"
import {
  alterOrderBatchApi, getAttachmentApi, getCheckAndGetApi, getEmailHistoryApi,
  orderAlterApi,
  orderAlterOrderApi,
  orderIssueApi,
  orderListApi, postHblExportCheckApi, postPreAlertApi, seaOrderExportGrossProfitApi,
  seaOrderListExportApi
} from "@/api/seaExportOrder"
import BookingConfirm from "./components/order/bookingConfirm"
import { downloadContainerTransferApi } from "@/api/containerTransfer";
import lodash from 'lodash'
import reportListDialog from "@/components/Cargo/Report/reportListDialog";

export default {
	name: "SeaExportOrderList",
	components: {
		AgGridVue, searchItem, DataImport, BookingConfirm,reportListDialog,
		// v-if="params.data.status === 1"
		// 制单补料功能sp2开放
		//     <el-button v-if="params.data.orderState === 30" type="text" size="mini" :disabled="true" @click="params.context.componentParent.goOrderView(params.data.id)">{{params.context.componentParent.$t('sea.documentPreparation')}}</el-button>
		// <el-button v-if="params.data.orderState === 40" type="text" size="mini" :disabled="true" @click="params.context.componentParent.goOrderView(params.data.id)">{{params.context.componentParent.$t('sea.replenishment')}}</el-button>

		'operating': {
			template: `<span>
            <el-button  type="text" size="mini" @click="params.context.componentParent.goOrderView(params.data)">{{params.context.componentParent.$t('sea.view')}}</el-button>
            <el-button v-if="params.data.orderState === 20" type="text" size="mini" @click="params.context.componentParent.goOrderBooking(params.data)">{{params.context.componentParent.$t('sea.bookingSpace')}}</el-button>
            <el-button type="text" size="mini" @click="params.context.componentParent.copyOrder(params.data.id)">{{params.context.componentParent.$t('sea.copy')}}</el-button>
            <el-button v-if="[30,40,50,60,80].indexOf(params.data.orderState)>-1" type="text" size="mini" @click="params.context.componentParent.copyAllOrder(params.data.id)">{{params.context.componentParent.$t('sea.copyAll')}}</el-button>
             <el-button v-if="params.data.orderState === 50" type="text" size="mini" @click="params.context.componentParent.issueRowClick(params.data.id)">{{params.context.componentParent.$t('sea.issue')}}</el-button>
          </span>`,
			methods: {}
		},
		'orderStateTem': {
			template: `<div class="status-text " :class="{['status-text'+params.data.orderState]: true}" >
      {{params.data.orderStateName}}
      <span v-if="params.data.jobState === 3">
        <el-tooltip class="item" effect="dark" :content="params.data.bookingFailedReason" placement="top">
         <el-button type="text" icon="el-icon-warning" style="color: red; padding: 0"></el-button>
        </el-tooltip>
      </span>
      <span v-else-if="params.data.blState === 1">
        <el-tooltip class="item" effect="dark" :content="params.data.blDesc" placement="top">
         <el-button type="text" icon="el-icon-warning" style="color: red; padding: 0"></el-button>
        </el-tooltip>
      </span>
      <span v-else-if="params.data.blState === 2">
        <el-tooltip class="item" effect="dark" :content="params.context.componentParent.$t('sea.billOfLadingReplenishmentCompleted')" placement="top">
         <el-button type="text" icon="el-icon-warning" style="padding: 0"></el-button>
        </el-tooltip>
      </span>
      </div>`,
			methods: {}
		}
	},
	data() {
		return {
			changeOrderDialog: false,
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
			changeOrderForm: {},
			loading: false,
			goodsTypeCode: null,
			searchItemHeight: 0,
			isShowingMoreSearchCondition: false,
			// table
			columnDefs: null,
			rowData: [],
			gridOptions: null,
			defaultFilter: {
				lineCodes: '', // 航线
				keyword: '', // keyword
				customerId: '',
				polCode: '',
				podCode: '',
				vessel: '',
				voyage: '',
				soNo: '',
				orderState: '',
				memberBlNo: '',
				carrierBlNo: '', // 船司提单
				pageSize: 50,
				pageNum: 1
			},
			filter: {},
			total: 0,
			// table end,
			seaLineList: [{
				name: this.$t('sea.all'),
				value: '',
				active: false
			}, {
				name: this.$t('sea.mega'),
				value: 'AAS1,AWE,OPNW',
				active: false
			}, {
				name: this.$t('sea.ouDi'),
				value: 'CEU1,CEM1',
				active: false
			}, {
				name: this.$t('sea.southeastAsia'),
				value: 'CSE',
				active: false
			}, {
				name: this.$t('sea.southAmericanLine'),
				value: 'WSA1,ESA1',
				active: false
			}, {
				name: this.$t('sea.africanLine'),
				value: 'WAX',
				active: false
			}, {
				name: this.$t('sea.australiaSingaporeRailway'),
				value: 'A3S',
				active: false
			}, {
				name: this.$t('sea.middleEastLine'),
				value: 'MEX',
				active: false
			}, {
        name: this.$t('sea.japanSouthKoreaLine'),
        value: 'AKS',
        active: false
      }
				//   {
				//   name: this.$t('sea.lafite'),
				//   value: 'ESA1,WSA1,CAX,WAX',
				//   active: false
				// }, {
				//   name: this.$t('sea.asiaPacific'),
				//   value: 'A3S,MEX,RES',
				//   active: false
				// }, {
				//   name: this.$t('sea.southeastAsia'),
				//   value: 'CSE',
				//   active: false
				// }
			], // 航线数据
			updateMsg: {
				btnText: '',
				code: '',
				name: ''
			},
			isDownloadExcel: false, // 是否显示下载模板链接
			downLoadFileName: null,
			showDataImportDialog: false, // 导入弹窗
			autoUpload: false,
			whiteList: ['xlsx', 'xls', 'XLSX', 'XLS'],
			bookingDialog: false,
			clickListData: {},
			changeOrderData: {}, // 改单数据
      preAlertDialog:false,
      emailSendingForm : {},
      emailHistoryMap : {
			  list:[],
        emailTo:[],
        emailCc:[],
      },
      attachmentList : {},
      restaurants : [],
      mblFileList : [],
      required: { required: true, message:  this.$t('sea.pleaseEnter'), trigger: 'change' },
		}
	},
	computed: {
		url() {
			return URL
		},
		dynamicHeightFactor() { // 用于动态计算列表高度
			let least = 295
			if (this.isShowingMoreSearchCondition) {
				least += this.searchItemHeight
			}
			return least
		},
		listGridStyle() {
			const s = {
				width: '100%',
				height: `calc(100vh - ${this.dynamicHeightFactor}px)`
			}
			return s
		}
	},
	created() {
		// 航线基础数据
		// getDmnTermItemList({ termCode: 'SEALINE' }).then(res => {
		//   res.content.map(item => {
		//     item.active = false
		//   })
		//   this.seaLineList = res.content
		//   this.seaLineList.unshift({
		//     code: null,
		//     chineseName: this.$t('sea.all'),
		//     active: true
		//   })
		// })
		this.gridOptions = {
			rowClassRules: {
				'grid-row-zebra-even': function (params) {
					return !(params.rowIndex % 2)
				},
				'grid-row-zebra-odd': function (params) {
					return params.rowIndex % 2
				}
			},
			groupDefaultExpanded: -1,
			sideBar: { toolPanels: ['columns', 'filter'], visible: false },
			suppressRowClickSelection: true,
			rowSelection: 'multiple',
			context: {
				componentParent: this
			}
			// rowMultiSelectWithClick: true
		}

    this.columnDefs = [{
      headerName: '',
      width: 55,
      pinned: 'left',
      suppressSorting: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressMenu: true,
      suppressSizeToFit: true,
      suppressResize: true
		},
		{ headerName: this.$t('sea.orderNumber'), field: 'orderNo' },
		{ headerName: this.$t('sea.requester'), field: 'customerName', minWidth: 200 },
		{ headerName: 'SO', field: 'soNo', minWidth: 150 },
		{ headerName: this.$t('sea.shippingCompany'), field: 'carrierName', minWidth: 150 },
		{ headerName: this.$t('sea.boxQuantity'), field: 'containerDesc' },
		{ headerName: this.$t('sea.businessTag'), field: 'businessTags' },
		{ headerName: this.$t('sea.orderState'), field: 'orderStateName', cellRendererFramework: 'orderStateTem' },
		//   cellRenderer: params => {
		//     if (params.data.orderState) {
		//       return `<div class="status-text status-text${params.data.orderState}">${params.value}</div>`
		//     }
		//   }
		// },
		{ headerName: `${this.$t('sea.shipName')} / ${this.$t('sea.voyage')}`, field: 'vessel', cellRenderer: params => `<div>${params.value}/${params.data.voyage}</div>` },
		{ headerName: this.$t('sea.pol'), field: 'pol' },
		{ headerName: 'ETD', field: 'etd', minWidth: 140, cellRenderer: params => this.formatDate(params.value) },
		{ headerName: '销售', field: 'sellerName', minWidth: 120, tooltipField: 'sellerName' },
		{ headerName: 'ATD', field: 'atd', minWidth: 140, cellRenderer: params => this.formatDate(params.value) },
		{ headerName: this.$t('sea.pod'), field: 'pod' },
		{ headerName: 'ETA', field: 'eta', minWidth: 150, cellRenderer: params => this.formatDate(params.value) },
		{ headerName: this.$t('sea.destination'), field: 'destinationCode', tooltipField: 'destinationCode' },
		{ headerName: this.$t('sea.carrierBlNo'), field: 'carrierBlNos' },
		{ headerName: this.$t('sea.memberBlNo'), field: 'customerBlNos' },
    { headerName: this.$t('sea.orderLockStateName'), field: 'orderLockStateName', minWidth: 100 },
		{ headerName: this.$t('sea.createByName'), field: 'createByName' },
		{ headerName: this.$t('sea.createTime'), field: 'createTime', cellRenderer: params => this.formatDate(params.value) },
		{ headerName: this.$t('sea.updateByName'), field: 'updateByName' },
		{ headerName: this.$t('sea.updateTime'), field: 'updateTime', cellRenderer: params => this.formatDate(params.value) },
		{ headerName: this.$t('sea.operating'), pinned: 'right', minWidth: 180, cellRendererFramework: 'operating' }

		]
    this.filter = this.$extends({}, this.defaultFilter)
		this.list()

	},
	watch: {
		'$route'(to, from) {
			if (to.name === 'SeaExportOrderList') {
				this.$refs.searchItem.advSearch()
			}
		}
	},
	methods: {
		async list() {
			this.loading = true
      console.log('this.filter',this.filter)
			const res = await orderListApi(this.filter)
			this.loading = false
			if (res.ok) {
				this.rowData = res.content.list
				this.total = Number(res.content.total)
			} else {
				this.rowData = []
				this.total = 0
				this.updateStepList()
			}
		},
		updateStepList() {
			// 每次查过之后记录结果，“上一票”或“下一票”应该按照这个查询结果跳
			const stepList = []
			let index = 0
			this.rowData.forEach(r => {
				stepList.push(`${r.jobNo}:${r.id}:${r.jobId}:${r.fclLcl}:${index}`)
				index++
			})
			window.localStorage.setItem('stepList', stepList.toString())
		},
		// 新建订单
		newOrder() { },
		// 签发
		issueClick() {
			const selectedList = this.getSelectData()
			if (this.$isEmpty(selectedList)) {
				this.$message.error(this.$t('sea.pleaseCheckDataIssuance'))
				return
			}
			const toBeIssued = selectedList.some(item => item.orderState !== 50)
			if (toBeIssued) {
				this.$message.error(this.$t('sea.notToBeIssued'))
				return
			}
			const data = selectedList.map(item => item.id)
			if (selectedList.length === 1) {
				this.$confirm(this.$t('sea.toBeIssuedOne'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(() => {
					this.issueFun(data)
				})
			} else {
				this.$confirm(this.$t('sea.toBeIssuedMore'), this.$t('sea.tips'), {
					confirmButtonText: this.$t('sea.determine'),
					cancelButtonText: this.$t('sea.cancel'),
					type: 'warning'
				}).then(() => {
					this.issueFun(data)
				})
			}

		},
		issueRowClick(id) {
			const data = [id]
			this.issueFun(data)
		},
		async issueFun(data) {
			this.loading = true
			const res = await orderIssueApi(data)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.issuedSuccessfully'))
				this.list()
			}
		},
		// 改单查询
		async changeOrderQuery() {
			const selectedList = this.getSelectData()
			if (this.$isEmpty(selectedList)) {
				this.$message.warning(this.$t('sea.checkAtLeastOnePieceOfData'))
			} else if (selectedList.length === 1) { // 选择单个订单
				this.loading = true
				const res = await orderAlterApi(selectedList[0].id)
				this.loading = false
				if (res.ok) {
					if (this.$isEmpty(res.content.blNos)) {
						this.$set(this.changeOrderForm, 'alterType', 1)
					}
					this.changeOrderData = res.content
					if (this.$isEmpty(res.content.blNos)) {
						this.submitChangeOrderFun()
					} else {
						this.changeOrderDialog = true
					}
				}
			} else {
				// 成功放舱的订单
				const isorderState = selectedList.every(item => {
					if ([30, 40, 50, 60, 80].indexOf(item.orderState) < 0) {
						return true
					}
				})
				if (isorderState) {
					this.$message.warning(this.$t('sea.successfullyReleasedTheCabinForQuery'))
				} else {
					this.submitChangeOrderBatchFun()
				}
			}
		},
		async submitChangeOrder() {
			this.$refs.changeOrderForm.validate(async valid => {
				if (valid) {
					await this.submitChangeOrderFun()
					this.closeChangeOrder()
				}
			})
		},
		async submitChangeOrderFun() {
			const selectedList = this.getSelectData()
			const data = {
				alterType: this.changeOrderForm.alterType,
				orderId: selectedList[0].id
			}
			if (this.changeOrderForm.alterType === 1) {
				data.id = this.changeOrderData.bookingId
			} else {
				data.id = this.changeOrderForm.id
			}
			this.loading = true
			const res = await orderAlterOrderApi(data)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.submittedSuccessfully'))
				this.$refs.searchItem.advSearch()
			}
		},
		async submitChangeOrderBatchFun() {
			const selectedList = this.getSelectData()
			const orderIds = selectedList.map(item => item.id)
			this.loading = true
			const res = await alterOrderBatchApi(orderIds)
			this.loading = false
			if (res.ok) {
				this.$message.success(this.$t('sea.submittedSuccessfully'))
				this.$refs.searchItem.advSearch()
			}
		},
		closeChangeOrder() {
			this.$refs.changeOrderForm.resetFields()
			this.changeOrderDialog = false
		},
    querySearch(queryString, cb,type) {
      let restaurants = this.emailHistoryMap[type];
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    //PRE-ALERT邮件
    async preAlert(){
      const selectedList = this.getSelectData()
      if (selectedList.length!==1) {
        this.$message.warning(this.$t('sea.pleaseSelectAnOrderToSend'))
        return
      }
      this.loading = true
      const res1 =await getCheckAndGetApi(selectedList[0].id)
      if(res1.ok){
        if(res1.content.sendFlag){
          this.$confirm(this.$t('sea.preAlertNeedToSendAgain'), this.$t('common.tips'), {
            confirmButtonText: this.$t('common.confirmBtn'),
            cancelButtonText: this.$t('common.cancelBtn'),
            type: 'warning'
          }).then(() => {
            this.preAlertConfirm(res1.content,selectedList[0].id)
          }).catch(()=>{
            this.loading = false
            return
          })
        }else{
          this.preAlertConfirm(res1.content,selectedList[0].id)
        }
      }else{
        this.loading = false
      }


    },
    async preAlertConfirm(resData,id){
      let mblArr = resData.mblList.map(item=> item.blNo)
      let mbl = mblArr.join(',')
      let hblArr = resData.hblList.map(item=> item.blNo)
      let hbl = hblArr.join(',')
      let containerNo = this.$isNotEmpty(resData.containerList) ? resData.containerList[0].containerNo : null
      resData.emailTitle = `Eshipping Pre-alert + ${resData.pol} - ${resData.pod} / ${mbl} ${mbl? ',' : ''}${hbl} / ${containerNo} `
      let mblList=``
      resData.mblList.map(item=>{
        if(item.releaseModeCode === 'SWB'){
          mblList+= `${item.blNo}(SWB) `
        }else{
          mblList+= `${item.blNo}(COPY) `
        }
      })
      let hblList=``
      resData.hblList.map(item=>{
        if(item.releaseModeCode === 'SWB'){
          hblList+= `${item.blNo}(SWB) `
        }else{
          hblList+= `${item.blNo}(COPY) `
        }
      })
      let freightTermCodes = lodash.uniq(resData.hblList.map(item=>item.freightTermCode))
      resData.orderId = id
      resData.emailContent = `
Dear all.

Good day.
please find the attached shipping info for subject shipment:

Shipment details:
Carrier: ${resData.carrierName}
V/V: ${resData.vessel} / ${resData.voyage}
POL: ${resData.pol}
POD: ${resData.pod}
EQ: ${resData.containerDesc}
ATD: ${resData.atd ? this.formatDate(resData.atd) : '' }
ETA: ${resData.eta ? this.formatDate(resData.eta) : ''}
MBL: ${mblList}
HBL: ${hblList}
Handling Instruction:

HBL OCEAN FREIGHT ${freightTermCodes.join(',')}
HANDLING EEE: PREPAID

lf you have any questions, please feel free to contact us, thanks`
      this.emailSendingForm = resData

      let promiseAll = []
      const res2 = getAttachmentApi(id).then(res=>{
        this.mblFileList = lodash.cloneDeep(res.content.mblFileList)
        this.$set(this.emailSendingForm,'mblFileList',res.content.mblFileList)
        this.$set(this.emailSendingForm,'mblList',res.content.mblList)
        this.$set(this.emailSendingForm,'hblList',res.content.hblList)
      })
      promiseAll.push(res2)
      const res3 = getEmailHistoryApi(id).then(res=>{
        this.emailHistoryMap.list = res.content
        this.emailHistoryMap.emailTo = []
        this.emailHistoryMap.emailCc = []
        res.content.map(item=> {
          this.emailHistoryMap.emailTo.push({
            ...item,
            value: item.emailTo
          })
          this.emailHistoryMap.emailCc.push({
            ...item,
            value: item.emailCc
          })
        })
      })
      promiseAll.push(res3)
      await Promise.all(promiseAll)
      this.loading = false
      this.preAlertDialog = true
    },
    handleSelectEmail(val,type){
		  this.$set(this.emailSendingForm,type,val[type])
    },
    submitPreAlert(){
      this.$refs.emailSendingForm.validate(async valid => {
        if (valid) {
          this.loading = true
          this.emailSendingForm.mblFileList.map(item=>{
            item.documentTypeCode = 'SE_CARRIER_BL'
            item.entityType = 'SEA_ORDER_EXPORT'
          })
          const res =await postPreAlertApi(this.emailSendingForm)
          this.loading = false
          if(res.ok){
            this.$message.success(this.$t('sea.submittedSuccessfully'))
            this.closePreAlert()
          }
        }

      })
    },
    closePreAlert(){
      this.$refs.emailSendingForm.resetFields()
		  this.preAlertDialog = false
      this.emailSendingForm= {}
    },
		// 导入VGM
		importVGM() {
			this.updateMsg = {
				btnText: this.$t('sea.uploadVGMData'),
				code: 'AE_VGM',
				name: 'VGM资料'
			}
			this.downLoadFileName = 'vgm申报模板.xls'
			this.isDownloadExcel = true
			this.showDataImportDialog = true
		},
		exportCommand(command) {
      const selectedList = this.getSelectData()
      let ids = selectedList.map(item=> item.id)
      if (Number(command) === 3){
        this.postHblExportCheck(ids)
        return
      }
			if (!this.filter.etdStart || !this.filter.etdEnd) {
				this.$message.warning(this.$t('sea.pleaseEnterETDTime'))
				return
			}
			let m1 = this.$moment(this.filter.etdStart);
			let m2 = this.$moment(this.filter.etdEnd);
			let day = m2.diff(m1, 'day');

			if (day > 31) {
				this.$message.warning(this.$t('sea.exportIsAllowedFor1MonthAtMost'))
				return
			}
			if (Number(command) === 1) {
				this.exportOrderDetails()
			}else if (Number(command) === 2){
				this.getSeaOrderExportGrossProfitApi()
			}
		},
		// 导入订单明细
		async exportOrderDetails() {
			this.loading = true
			const res = await seaOrderListExportApi(this.filter)
			this.loading = false
			if (res.ok) {
				window.location = res.content
			}
		},
		// 订单管理_毛利清单导出
		async getSeaOrderExportGrossProfitApi() {
			this.loading = true
			const res = await seaOrderExportGrossProfitApi(this.filter)
			this.loading = false
		},
    async postHblExportCheck(ids){
		  this.loading = true
      const res =await postHblExportCheckApi({ids})
      this.loading = false
      if(res.ok){
        this.reportDialog.typeCode = 'CUSTOMER_BL/HBL_LIST' // 'SEA_MBL' 打印客户提单 EB_PACKING_INFORMATION 导出装箱数据
        const orderIds = ids
        // sampleFlag = 1 // 打印样单按钮仅用于输出样单
        const queryConditionJson = {blSignType: 2,orderIds}
        this.reportDialog.data = { jobId: '', queryConditionJson: queryConditionJson }
        this.reportDialog.isShow = true
      }
    },
		packingUpdate() {
			this.list()
		},
		colseDialog() {
			this.updateMsg = {
				btnText: '',
				code: '',
				name: ''
			}
			this.showDataImportDialog = false
		},
		// table btn
		async goOrderView(data) {
			this.$router.push({ name: 'SeaExportOrderView', query: { id: data.id, type: 'view', bookingJobId: data.bookingJobId, page: '1' } })
		},
		bookingConfirmCallBack(val) {
			this.$router.push({
				name: 'SeaExportOrderView', query: {
					id: this.clickListData.id, type: 'view', bookingJobId: this.clickListData.bookingJobId, page: '2',
					bookingChannel: val.bookingChannel,
					bookingJobMethod: val.bookingJobMethod
				}
			})
			this.clickListData = {}
		},
		goOrderBooking(data) {
			if (!data.jobState) {
				this.clickListData = data
				this.goodsTypeCode = data.goodsTypeCode
				if (Number(data.carrierId) === 5) { // cosco 直接
					this.bookingDialog = true

				} else {
					const callBackVal = {
						bookingChannel: 3,
						bookingJobMethod: 1
					}
					this.bookingConfirmCallBack(callBackVal)
				}
			} else {
				this.$router.push({ name: 'SeaExportOrderView', query: { id: data.id, type: 'view', bookingJobId: data.bookingJobId, page: '2' } })
			}
		},
		copyOrder(id) {
			this.$router.push({ name: 'SeaExportOrderCreate', query: { id: id, type: 'copy' } })
		},
    copyAllOrder(id){
      this.$router.push({ name: 'SeaExportOrderCreate', query: { id: id, type: 'copyAll' } })
    },
		// table
		onReady(params) {
			const self = this
			window.addEventListener('resize', function () {
				setTimeout(function () {
					self.onFirstDataRendered()
				})
			})
		},
		onFirstDataRendered() {
			const self = this
			const allColumnIds = []
			self.gridOptions.columnApi.getAllColumns().forEach(function (column) {
				allColumnIds.push(column.colId)
			})
			setTimeout(function () {
				self.gridOptions.columnApi.autoSizeColumns(allColumnIds)
			})
		},
		// 航线
		toFilterByDateRange(lineCode, index) {
			this.seaLineList.map((item, i) => {
				if (index === i) {
					item.active = true
				} else {
					item.active = false
				}
			})
			this.filter.lineCodes = lineCode
			this.$refs.searchItem.toFilterByDateRange({ lineCodes: lineCode })
			// this.list()
		},
		multipleSelectionCallBack(data) {
			this.filter = data // this.$extends(this.filter, data)
		},
		keywordSearch(data) {
			this.filter.keyword = data
			this.seaLineListInit()
		},
		resetSearch() {
			this.seaLineListInit()
		},
		seaLineListInit() {
			this.seaLineList.map((item, i) => {
				if (i === 0) {
					item.active = true
				} else {
					item.active = false
				}
			})
			this.filter = this.$extends({}, this.defaultFilter)
			// this.filter.lineCodes = null
		},
		filterJobListWithSearchResult(data) {
			this.total = Number(data.total)
			this.rowData = data.list
		},
		handleIsShowingMoreSearchConditionToggle(isShowingMoreSearchCondition) {
			this.isShowingMoreSearchCondition = isShowingMoreSearchCondition
			const self = this
			setTimeout(() => {
				self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight

			})
		},
		resetHeight() {
			const self = this
			setTimeout(() => {
				self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
			})
		},
		// 获取表格选中的数据集合
		getSelectData() {
			const rows = getGridSelected(this.gridOptions)
			return rows
		},
		// table end *************
    downloadElectronicFile (obj) {
      downloadElectronicFileApi(obj.id).then(res => {
        if (res.ok) {
          // res.content.fileName = obj.fileName
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
	}
}
</script>
<style  lang="scss" scoped>
.footer-btn {
	text-align: right;
}
.emailSendingForm{
  ::v-deep{
    .el-form-item{ width: 100%}
    .el-form-item__content{ width: 90%}
    .el-upload-list__item-name{ max-width: 230px}
  }
}
.autocomplete ::v-deep .el-autocomplete-suggestion li{ line-height: 1.2em}
</style>
