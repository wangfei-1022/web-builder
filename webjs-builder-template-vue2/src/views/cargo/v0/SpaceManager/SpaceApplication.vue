<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <top-search-items-slot :searchFun="topSearch" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.applicationNo')}: `" prop="applyNo">
          <el-input v-trim v-model="multipleForm.applyNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.processingStatus')}: `" prop="applyState">
          <el-select v-model="multipleForm.applyState"  @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option :label="$t('spaceRule.shippingSpace.pending')" value="1"></el-option>
            <el-option :label="$t('spaceRule.shippingSpace.classApplicationInProgress')" value="10"></el-option>
            <el-option :label="$t('spaceRule.shippingSpace.partiallyEquippedCabin')" value="20"></el-option>
            <el-option :label="$t('spaceRule.shippingSpace.equippedCabin')" value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('sea.pol2')}: `" prop="polCode">
          <cargo-advance-select
            ref="polCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.polCode=data.code5
              topSearch()
            }"
          />
        </el-form-item>
        <el-form-item :label="`${$t('sea.pod')}: `" prop="podCode">
          <cargo-advance-select
            ref="podCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.podCode=data.code5
              topSearch()
            }"
          />
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.associationNo')}: `" prop="contractNo">
          <el-input v-trim v-model="multipleForm.contractNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.sailingPeriod')}: `" prop="productOwner">
          <el-select v-model="cycleSelectList" size="mini" filterable clearable @change="cycleNameChangeList" value-key="cycleName">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in cycleListSearch" :label="`${item.cycleName}(${formatDate(item.cycleStart)}~${formatDate(item.cycleEnd)})`" :value="item" :key="item.cycleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('spaceRule.shippingSpace.route')}: `" prop="routeCode">
          <el-select v-model="multipleForm.routeCode" size="mini" filterable clearable @change="topSearch">
            <el-option :label="$t('sea.all')" value=""></el-option>
            <el-option v-for="item in sealineList" :label="item.code" :value="item.code" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>

    <div class="container-wrap table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" class="ml-10" @click="newClassContract">{{ $t('spaceRule.shippingSpace.applicationForNewClass') }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"

        :column-defs="columnDefsRight"
        :row-data="tableData.list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>
<!--    新增合约-->
    <el-dialog :title="$t('spaceRule.shippingSpace.applicationForNewClass')" :visible.sync="newContractDialog" :close-on-click-modal="false" :before-close="closeSendNewContract" width="700px">
      <el-form :inline="true" :model="newContractForm" @submit.native.prevent ref="newContractForm" class="newContractDialog">
<!--        装货港-->
        <el-form-item :label="$t('sea.pol2')" prop="polCode" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'blur' },]">
          <cargo-advance-select
            ref="polCodeSelect"
            :url="url.qf.seaport"
            :default-value="newContractForm.polCode"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              newContractForm.polCode=data.code5
              newContractForm.pol=data.englishName
            }"
          />
        </el-form-item>
        <el-form-item :label="$t('sea.pod')" prop="podCode" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'blur' },]">
          <cargo-advance-select
            ref="podCodeSelect"
            :url="url.qf.seaport"
            :default-value="newContractForm.podCode"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              newContractForm.podCode=data.code5
              newContractForm.pod=data.englishName
              newContractForm.routeCode=data.lineCode
            }"
          />
        </el-form-item>
<!--        开航周期-->
        <el-form-item :label="$t('spaceRule.shippingSpace.sailingPeriod')" prop="cycleName" :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },]">
          <el-select v-model="cycleSelect" size="mini" filterable clearable @change="cycleNameChange" value-key="cycleName">
            <el-option v-for="item in cycleList" :label="`${item.cycleName}(${formatDate(item.cycleStart)}~${formatDate(item.cycleEnd)})`" :value="item" :key="item.cycleName"></el-option>
          </el-select>
        </el-form-item>
<!--        运输条款-->
        <el-form-item :label="$t('spaceRule.shippingSpace.transportationTerms')" prop="termCode" >
          <el-select v-model="newContractForm.termCode" size="mini" filterable clearable>
            <el-option v-for="item in transportTermList" :label="item.code" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('spaceRule.shippingSpace.shippingDepartment')" prop="carrierCode">
          <cargo-limited-select
            placeholder=""
            :select-label="newContractForm.assignCarrierName"
            :select-value="newContractForm.assignCarrierCode"
            type="carrier"
            style="width: 100%;"
            clearable
            @set="(data)=>{
              newContractForm.assignCarrierCode=data.englishShortname
              newContractForm.assignCarrierName=data.englishName
            }"
          />
        </el-form-item>
<!--        指定约号-->
        <el-form-item :label="$t('spaceRule.shippingSpace.specifyApproximateNumber')" prop="assignContractNo">
          <el-select v-model="newContractForm.assignContractNo" size="mini" filterable clearable>
            <el-option v-for="item in contractList" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('spaceRule.shippingSpace.applyForShippingSpace')" prop="containerDTOList"  :rules="[{ required: true, message: `${$t('sea.pleaseEnter')}`, trigger: 'change' },{ validator: validateContainer, trigger: 'blur' }]" style="width: 80%">
          <div v-for="(item,index) in newContractForm.containerDTOList" :key="index" class="container_list">
            <ContainerSelect  @change="ContainerTypesChange($event,item,index)" :itemObj="item" style="width: 85px"></ContainerSelect>
            <el-input-number size="mini" v-model="item.containerQty"></el-input-number>
<!--            <el-button type="text" icon="el-icon-circle-plus" @click="addContainerType"></el-button>-->
            <i v-show="newContractForm.containerDTOList.length<5" class="icon el-icon-circle-plus blue" @click="addContainerType" style="position: relative; top: 2px;"></i>
            <i v-show="newContractForm.containerDTOList.length >1" class="icon el-icon-remove red" @click="delContainerType(index)" style="position: relative; top: 2px;"></i>
          </div>
          <div>
            <span>总计</span><span style="margin-left: 15px">{{ totalTeu }}   TEU</span>
          </div>

        </el-form-item>

        <el-form-item :label="$t('spaceRule.shippingSpace.remarks')" prop="remark" style="width: 80%">
          <el-input class="textareaH"  v-model="newContractForm.remark" maxlength="500" show-word-limit type="textarea" :placeholder="$t('sea.pleaseEnter')" style="width: 400px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNewContract">{{$t('common.confirmBtn')}}</el-button>
        <el-button @click="closeSendNewContract">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import { getGridSelected } from "@/utils/gridChoose"
import lodash from 'lodash'
import { getUserInfo } from "@/api/login"
import { formatNumberToThousands, mergeMethod } from "@/utils"
import URL from "@/api/urlTranslator";
import Vue from '@/main'
import {
  addContractApi, applyManageApi, applySaleApi, applySaleDelApi, applySaleDetailApi, applySalePagesApi, contractDelApi,
  contractDetailApi,
  contractDisableApi, contractEnableApi, contractListApi,
  contractPagesApi, cycleListApi,
  getSEALINEApi, updataApplySaleApi, updataContractApi
} from "@/api/spaceManager";
import moment from "moment";
import ContainerSelect from "@/views/cargo/v0/SeaExport/components/order/containerSelect";
import {getDmnTermItemList} from "@/api/seaExport";
export default {
	name: 'SpaceApplication',
	components: {
		SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn, cargoLimitedSelect, ContainerSelect,
    'incomeComponent': {
      template: `<div style="font-size: 14px">
        <el-button type="text" size="mini" @click="params.context.componentParent.editRow(params.data)">${Vue.$t('sea.edit')}</el-button>
        <el-button  type="text" size="mini" @click="params.context.componentParent.deleteContract(params.data)">${Vue.$t('sea.delete')}</el-button>
        </div>
      `,
      methods: {}
    }
	},
	data() {
		const defaultFilter = {

      pageSize: 50,
      pageNum: 1,
      applyNo: null,
      applyState: null,
      polCode: null,
      podCode: null,
      contractNo: null,
      cycleEnd: null,
      cycleName: null,
      cycleStart: null,
      routeCode: null
		}
		return {
			url: URL,
			loading: false,
			pageSizeList: [10, 20, 30, 40],
			tableData: {
        list: []
      },
			selectedItems: [], // 列表选择
			pagination: {
				pageNum: 1,
				pageSize: 50
			},
			pageTotal: 0,
			defaultFilter: defaultFilter,
			multipleForm: this.$extends({}, defaultFilter),
			vm: this,
			VUE_APP_BASE_API: '',
			soNoList: [],
			gridApi: null,
			columnApi: null,
			columnDefsRight: [
			],
			gridOptionsRight: {
				rowSelection: 'multiple',
        suppressAggFuncInHeader: true,
				rowMultiSelectWithClick: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				},
				onRowSelected: selectorObj => {
					if (selectorObj.node.selected) {
						this.selectedItems.push(selectorObj.data)
					} else {
						const _data = selectorObj.data
						const _id = this.selectedItems.findIndex(item => item.id === _data.id)
						this.selectedItems.splice(_id, 1)
					}
				}
			},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      newContractDialog: false,
      newContractForm: {
        containerDTOList: [{ // 箱信息
          containerType: null, // 箱型代码
          englishName: null, // 英文简称
          chineseName: null, // 中文简称
          containerQty: 1 // 箱量
        }]
      },
      cycleSelect: {
        cycleEnd: '',
        cycleName: '',
        cycleStart: ''
      },
      cycleSelectList: {
        cycleEnd: '',
        cycleName: '',
        cycleStart: ''
      },
      routeDTOList: [],
      supplierInfoData: {}, // 供应商
      startTimeRange: '',
      pickerMinDate: '',
      sealineList: [],
      totalTeu: 0,
      transportTermList: [], // 运输条款
      cycleList: [],
      cycleListSearch: [],
      contractList: [] // 约号列表
		}
	},
  watch: {
    'newContractForm.containerDTOList': {
      handler(val) {
        this.calculationTeu(val)
      },
      deep: true

    }
  },
	computed: {
		...mapState({
			memberInfo: state => state.user.memberInfo
		}),
		multipleFormValuable() {
			for (let key in this.multipleForm) {
				if (this.multipleForm[key] && key !== 'pageSize' && key !== 'pageNum') {return true;}
			}
			return false
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
	methods: {
    pickerOptionsBlur() {
      this.pickerMinDate = ''
    },
    validateContainer(rule, value, callback) {
      let isTypeCode = this.newContractForm.containerDTOList.some(item => !item.containerType)
      if (isTypeCode) {
        callback(new Error(this.$t('spaceRule.shippingSpace.pleaseSelectBoxType')))
        return false
      }
      let uniqBy = lodash.uniqBy(this.newContractForm.containerDTOList, 'containerType')
      if (uniqBy.length !== this.newContractForm.containerDTOList.length) {
        callback(new Error(this.$t('spaceRule.shippingSpace.doNotSubmitTheSameBoxType')))
        return false
      }
      callback()
    },
    validatecontractTime(rule, value, callback) {
      if (value) {
        let nowTime = new Date().getTime()
        if (value[1] < nowTime) {
          callback(new Error(this.$t('spaceRule.shippingSpace.endTimeCanOnlyBeSelectedInTheFuture')))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('spaceRule.shippingSpace.endTimeCanOnlyBeSelectedInTheFuture')))
      }
    },
    calculationTeu(val) {
      let total = 0
      val.map(value => {
        if (value.teu || this.$isNotEmpty(value.containerTypeDTO)) {
          total += Math.ceil(value.teu || value.containerTypeDTO.teu) * value.containerQty
        }
      })
      this.totalTeu = total
    },
		async getList() {
			const data = lodash.cloneDeep(this.multipleForm)
			delete data.contractTime
			this.selectedItems = []
			this.loading = true
			const res = await applySalePagesApi(data)
			this.loading = false
			if (res.ok) {
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
		clearSearchForm() { // 搜索重置
			this.$refs.multipleForm.resetFields()
      this.cycleSelectList = {
        cycleEnd: '',
        cycleName: '',
        cycleStart: ''
      }
      this.$refs.polCodeSelect.value = ''
      this.$refs.podCodeSelect.value = ''
			this.multipleForm = this.$extends({}, this.defaultFilter)
			this.topSearch()
		},
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			this.resetHeight()
		},
		/** 选中装货港 */
		getItemFromChild(val, key) {
			this.multipleForm[key] = val.code5
			if (val.code5) {
				this.getList()
			}
		},

    cycleNameChange(val) {
      this.$set(this.newContractForm, 'cycleName', val.cycleName)
      this.$set(this.newContractForm, 'cycleEnd', val.cycleEnd)
      this.$set(this.newContractForm, 'cycleStart', val.cycleStart)
    },
    cycleNameChangeList(val) {
      this.multipleForm.cycleEnd = val.cycleEnd
      this.multipleForm.cycleName = val.cycleName
      this.multipleForm.cycleStart = val.cycleStart
      this.topSearch()
    },
    // 选择箱型
    ContainerTypesChange(val, item, index) {
      item.chineseName = val.chineseName
      item.englishName = val.englishName
      item.containerType = val.englishName
      item.teu = val.teu
    },
    // 箱型箱量
    addContainerType() {
      this.newContractForm.containerDTOList.push({
        containerType: null,
        englishName: null,
        chineseName: null,
        containerQty: 1
      })
    },
    delContainerType(index) {
      this.newContractForm.containerDTOList.splice(index, 1)
    },
    // 新建
		newClassContract() {
      this.newContractDialog = true
		},
    submitNewContract() {
      let routeDTOList = []
      this.routeDTOList.map(item => {
        this.sealineList.map(val => {
          if (item === val.code) {
            routeDTOList.push({
              routeCode: val.code,
              routeName: val.englishName
            })
          }
        })
      })
      this.newContractForm.routeDTOList = routeDTOList
      this.$refs.newContractForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let url
          if (this.newContractForm.id) {
            url = updataApplySaleApi
          } else {
            url = applySaleApi
          }
          if (this.newContractForm.termCode) {
            this.newContractForm.termName = this.newContractForm.termCode
          }
          const res = await url(this.newContractForm)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('sea.submittedSuccessfully'))
            this.getList()
            this.closeSendNewContract()
          }
        }
      })
    },
    closeSendNewContract() {
      this.newContractDialog = false
      this.newContractForm = {
        containerDTOList: [{ // 箱信息
          containerType: null, // 箱型代码
          englishName: null, // 英文简称
          chineseName: null, // 中文简称
          containerQty: 1 // 箱量
        }]
      }
      this.cycleSelect = {
        cycleEnd: '',
          cycleName: '',
          cycleStart: ''
      }
      this.$refs.newContractForm.resetFields()
    },
    async editRow(row) {
      this.loading = true
      const res = await applySaleDetailApi(row.id)
      this.loading = false
      if (res.ok) {
        this.cycleSelect = {
          cycleEnd: res.content.cycleEnd,
          cycleName: res.content.cycleName,
          cycleStart: res.content.cycleStart
        }
        this.newContractForm = res.content
        this.calculationTeu(this.newContractForm.containerDTOList)
        this.newContractDialog = true
      }
    },
    async deleteContract(row) {
      this.loading = true
      const res = await applySaleDelApi(row.id)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.successfullyDeleted'))
        this.getList()
      }
    }
	},
	async created() {
    this.$moment.locale('zh-cn')
    getSEALINEApi().then(res => {
      if (res.ok) {
        this.sealineList = res.content
      }
    });
		this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
		this.userInfo = await getUserInfo()
    applyManageApi().then(res => {
      if (res.ok) {
        this.cycleListSearch = res.content
      }
    })
    cycleListApi().then(res => {
      if (res.ok) {
        this.cycleList = res.content
      }
    })
    contractListApi().then(res => {
      if (res.ok) {
        this.contractList = res.content
      }
    })
    // 运输条款
    getDmnTermItemList({ termCode: 'TRANSPORTITEM' }).then(res => {
      this.transportTermList = res.content
    })
		await this.getList()
    this.columnDefsRight = [{
      colId: 'visibleCol',
      headerName: '',
      pinned: 'left',
      field: '',
      hide: true,
      width: 300
    }, {
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
      headerName: this.$t('spaceRule.shippingSpace.applicationNo'),
      field: 'applyNo',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.route'), // 航线
      field: 'routeCode',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.sailingPeriod'), // 开航周期
      field: 'carrierCode',
      cellRenderer: params => `${params.data.cycleName}(${this.formatDate(params.data.cycleStart)}~${this.formatDate(params.data.cycleEnd)})`,
      minWidth: 140
    }, {
      headerName: this.$t('sea.pol2'), // 装货港
      field: 'polCode',
      minWidth: 100
    }, {
      headerName: this.$t('sea.pod'), // 卸货港
      field: 'podCode',
      minWidth: 100
    }, {
      headerName: this.$t('spaceRule.shippingSpace.applyForShippingSpace'), // 申请舱位
      field: 'containerDesc',
      minWidth: 100
    }, {
      headerName: this.$t('spaceRule.shippingSpace.transportationTerms'), // 运输条款
      field: 'termName',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.designatedShippingCompany'), // 指定船司
      field: 'assignCarrierCode',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.specifyApproximateNumber'), // 指定约号
      field: 'assignContractNo',
      minWidth: 180
    }, {
      headerName: this.$t('spaceRule.shippingSpace.remarks'), // 备注
      field: 'remark',
      minWidth: 180
    }, {
      headerName: this.$t('spaceRule.shippingSpace.processingStatus'), // 处理状态
      field: 'applyStateName',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.allocateSpace'), // 分配舱位
      field: 'distributionQty',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.ordered'), // 下单数
      field: 'orderQty',
      minWidth: 140
    }, {
      headerName: this.$t('spaceRule.shippingSpace.associationNo'), // 关联约号
      field: 'contractNo',
      minWidth: 120
    }, {
      headerName: this.$t('spaceRule.shippingSpace.applicationTime'), // 申请时间
      field: 'applyTime',
      cellRenderer: params => this.formatDate(params.value),
      minWidth: 100
    },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 140, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'incomeComponent'
      }]

		window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
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
.operating {
	display: flex;
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
		color: #e6a23c;
	}

	&.success-text {
		color: #67c23a;
	}

	&.danger-text {
		color: #f56c6c;
	}

	&.primary-text {
		color: #409eff;
	}
}
.primary-text {
	color: #409eff;
}
.billForm {
	display: flex;
	flex-wrap: wrap;
	.title {
		font-family: "Arial Negreta", "Arial";
		font-weight: 700;
		font-size: 18px;
		color: #333333;
		margin-bottom: 20px;
		span {
			color: red;
		}
	}
	.phoneCon {
		display: flex;
		justify-content: space-between;
	}
	.phone {
		width: 30%;
	}
}
.go-ams {
	margin-right: 8px;
}
.el-icon-click,
.el-icon-edit,
.el-icon-download {
	cursor: pointer;
	transition: all 0.2s ease 0s;
	&:hover {
		transform: scale(1.1);
	}
}
.change-label-calss ::v-deep .el-form-item__label {
	width: 200px !important;
}

::v-deep .el-table__expand-column {
	pointer-events: none;
}
::v-deep .el-table__expand-column .el-icon {
	visibility: hidden;
}
.list-operating {
	display: flex;
	justify-content: space-between;
	::v-deep .el-button {
		margin-left: 0;
	}
}
.receivingMailbox ::v-deep {
	.el-table th > .cell:before {
		content: "*";
		color: red;
	}
}
.red {
	color: red;
}
.footer-btn {
	margin-top: 30px;
	text-align: right;
}
.newContractDialog ::v-deep {
  .el-form-item{ width: 44%; margin-bottom: 18px}
   .el-form-item__label{ width: 90px; text-align: right}
 }
.icon{ font-size: 20px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;position: relative;top: -10px;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
::v-deep .icon{ width: auto; height: auto}
.routeDTOList{
  ::v-deep .el-form-item__content{line-height: 24px; margin-top: 5px}
}
</style>

