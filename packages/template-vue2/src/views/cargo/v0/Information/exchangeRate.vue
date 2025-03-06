<template>
  <div class="app-main-inner">
    <div class="app-main-inner-row" style="padding-bottom:10px; border-bottom: 1px solid #ccc;">
      <div class="filters">
        <el-form :inline="true" label-width="90px" label-position="left">
          <div class="el-form-item-wrapper">
            <el-form-item label="生效期间">
              <CommonPicker
                v-model="searchConditions.startAndEndDate"
                type="daterange"
                size="mini"
                style="width:205px;"
                clearable
              />
            </el-form-item>
            <el-form-item label="生效日期">
              <CommonPicker
                v-model="searchConditions.startDateStartAndEnd"
                type="daterange"
                size="mini"
                style="width:205px;"
                clearable
              />
            </el-form-item>
            <el-form-item label="源币种">
              <cargo-advance-select
                :url="url.dmn.currencyDropDownList"
                :fields="['label']"
                :callback-params="{key:'currencySource'}"
                tag-value="value"
                tag-name="label"
                options-width="200px"
                style="width:205px;"
                @parentCallBack="getValueFromChild"
                @childOptions="childOptions"
              />
            </el-form-item>
            <el-form-item label="目标币种">
              <cargo-advance-select
                :url="url.dmn.currencyDropDownList"
                :fields="['label']"
                :callback-params="{key:'currencyTarget'}"
                tag-value="value"
                tag-name="label"
                options-width="200px"
                style="width:205px;"
                @parentCallBack="getValueFromChild"
              />
            </el-form-item>
            <el-form-item label="汇率"><el-input v-model="searchConditions.exchangeRate" style="width:205px;" size="mini" /></el-form-item>
            <el-form-item label="分公司">
              <cargo-limited-select
                :select-value="searchConditions.officeId"
                type="office"
                style="width: 205px"
                @set="(obj)=>{searchConditions.officeId = obj.value}"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="triggers">
        <div style="margin-top:5px;"><el-button size="mini" style="width:100%;" @click="toQuery">查询</el-button></div>
      </div>
    </div>
    <div class="app-main-inner-row">
      <div class="btn-group-left">
        <el-button v-permission="['mdm:rate:add']" type="primary" size="mini" @click="popExchangeRateFormDialog()">新建</el-button>
        <el-button v-permission="['mdm:rate:del']" type="danger" size="mini" @click="toBatchDel">删除</el-button>
      </div>
      <div class="btn-group-right" />
    </div>
    <div class="app-main-inner-row">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnDefs"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        style="width: 100%;height:calc(100vh - 200px)"
        class="ag-theme-balham"
      />
    </div>
    <el-dialog :visible.sync="isShowingCreateExchangeRateDialog" title="汇率维护" width="700px" @close="initData">
      <el-form :model="onePeriodExchangeRate" label-width="90px" label-position="left">
        <el-form-item label="" style="margin-left: -90px;">
          <el-checkbox v-model="onePeriodExchangeRate.autoPostpone">自动延期</el-checkbox>
        </el-form-item>
        <el-form-item label="所属公司">
          <div style="display: flex;justify-content: space-between;">
            <el-select v-model="onePeriodExchangeRate.officeId" size="mini" style="width:200px;">
              <el-option v-for="office in officeList" :key="office.value" :label="office.label" :value="office.value" />
            </el-select>
            <div style="width: 90px;">指定月份</div>
            <CommonPicker
              ref="month"
              v-model="onePeriodExchangeRate.month"
              parent-class="w-180"
              size="mini"
              picker-format="yyyy-MM"
              pikcer-type="month"
              placeholder="选择月"
              :clearable="false" />
          </div>
        </el-form-item>
        <el-form-item label="生效期间">
          <CommonPicker
            placeholder="选择月"
            :clearable="false"
            v-model="onePeriodExchangeRate.effectivePeriod"
            :parent-range-date="onePeriodExchangeRate.effectivePeriod"
            pikcer-type="daterange"
            size="mini"
            style="width:530px;"
            range-separator="~"
            format="yyyy-MM-dd"
            :start-placeholder="$t('common.startDate')"
            :end-placeholder="$t('common.endDate')"
          />
        </el-form-item>
        <el-form-item label="" style="margin-left: -90px;">
          <div>
            <div v-for="e in exchangeRateArray" :key="e.identNum" style="display: flex;">
              <div style="padding-top:10px;"><el-button type="primary" size="mini" plain @click="addOneExchangeRate(e.identNum)"><i class="el-icon-plus" /></el-button></div>
              <div style="display: flex;justify-content: space-around;margin-left:45px;border:1px solid #dcdfe6;width:450px;padding: 10px;">
                <div style="font-size:28px;">
                  <svg class="icon" aria-hidden="true">
                    <use v-bind:xlink:href="`#icon-${e.currencySource}`"></use>
                  </svg>
                  <!-- <svg-icon :icon-class="`huilv-${e.currencySource}`" /> -->
                </div>
                <div>1</div>
                <div>
                  <el-select v-model="e.currencySource" size="mini" style="width:90px;">
                    <el-option v-for="currency in currencyList" :key="currency.value" :label="currency.label" :value="currency.value" />
                  </el-select>
                </div>
                <div>=</div>
                <div>
                  <el-select v-model="e.currencyTarget" size="mini" style="width:90px;">
                    <el-option v-for="currency in currencyList" :key="currency.value" :label="currency.label" :value="currency.value" />
                  </el-select>
                </div>
                <div><el-input v-model="e.rate" size="mini" style="width:110px;" /></div>
                <div style="font-size:28px;">
                  <svg class="icon" aria-hidden="true">
                    <use v-bind:xlink:href="`#icon-${e.currencyTarget}`"></use>
                  </svg>
                  <!-- <svg-icon :icon-class="`huilv-${e.currencyTarget}`" /> -->
                </div>
              </div>
              <div style="padding-top:10px;margin-left:50px;"><el-button type="danger" size="mini" plain @click="removeThisExchangeRate(e.identNum)"><i class="el-icon-minus" /></el-button></div>
              <div v-show="false">
                <el-input v-model="e.exchangeRateAp" size="mini" value="1" style="width:110px;" />
                <el-input v-model="e.exchangeRateAr" size="mini" value="12" style="width:110px;" />
                <el-input v-model="e.exchangeRateFin" size="mini" value="13" style="width:110px;" />
                <el-input v-model="e.exchangeRateInv" size="mini" value="14" style="width:110px;" />
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-permission="['mdm:rate:update']" type="primary" size="mini" @click="submitExchangeRate()"> 确定 </el-button>
        <el-button size="mini" @click="cancelBtn()"> 取消 </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import { getExchangeRateList, getDetailPageInitData, batchAddExchangeRate, batchEditExchangeRate, getExchangeRateByPeriodCode, switchExchangeRateStatus, delExchangeRate, batchDelExchangeRate } from '@/api/exchangeRate'
import { getMonthLastDay } from '@/utils'
import exchangeRateOperateButton from './CellRendererFramework/exchangeRateOperateButton'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import URL from '@/api/urlTranslator'
import { getGridSelectedIds } from '@/utils/gridChoose'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import moment from 'moment'
export default {
	name: 'ExchangeRate',
	components: { AgGridVue, exchangeRateOperateButton, cargoAdvanceSelect, cargoLimitedSelect },
	data() {
		return {
			searchConditions: {
				officeId: '',
				currencySource: '',
				currencyTarget: '',
				startAndEndDate: [],
				startDate: '', // 生效日期
				endDate: '',
				startDateStartAndEnd: [],
				startDateStart: '', // 生效日期起始日
				startDateEnd: '', // 生效日期截止日
				exchangeRate: ''
			},
			onePeriodExchangeRate: {
				periodCode: '', // 期间、批次id号
				officeId: '',
				month: '',
				datePeriod: '', // 生效期间
				officeName: '',
				startDate: '',
				endDate: '',
				autoPostpone: false,
				effectivePeriod: []
			},
			initOnePeriodExchangeRate: {},
			officeList: [],
			officeListMap: [],
			currencyList: [],
			isShowingMoreSearchCondition: false,
			isShowingCreateExchangeRateDialog: false,
			gridOptions: { suppressRowTransform: true },
			columnDefs: null,
			sideBarDefs: false,
			rowData: [],
			oneExchangeRate: {
				identNum: 0,
				id: -1,
				datePeriod: '',
				currencySource: '',
				currencyTarget: '',
				exchangeRateAp: '',
				exchangeRateAr: '',
				exchangeRateFin: '',
				exchangeRateInv: '',
				rate: '',
				month: '',
				periodCode: '',
				startDate: '',
				endDate: '',
				tenantId: '',
				officeId: 0
			},
			exchangeRateArray: []
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	watch: {
		'onePeriodExchangeRate.effectivePeriod'(newVal, oldVal) {
			this.onePeriodExchangeRate.startDate = newVal[0]
			this.onePeriodExchangeRate.endDate = newVal[1]
		},
		'searchConditions.startAndEndDate'(newVal, oldVal) {
			this.searchConditions.startDate = newVal[0]
			this.searchConditions.endDate = newVal[1]
		},
		'searchConditions.startDateStartAndEnd'(newVal, oldVal) {
			this.searchConditions.startDateStart = newVal[0]
			this.searchConditions.startDateEnd = newVal[1]
		}
	},
	created() {
		const self = this

		self.initOnePeriodExchangeRate = { ...self.onePeriodExchangeRate }

		const autoGroupColumnDef = {
			headerName: '汇率期间',
			width: 350,
			field: 'datePeriod',
			valueGetter: params => {
				// console.log('params.node', params.node)
				// console.log('params.node.group', params.node.group)
				if (params.node.group) {
					return params.node.key
				} else {
					const _startDate = this.$moment(parseInt(params.data.startDate)).format('YYYY-MM-DD')
					const _endDate = this.$moment(parseInt(params.data.endDate)).format('YYYY-MM-DD')
					return `${_startDate} - ${_endDate}`
					// return params.data[params.colDef.field]
					// return ''
				}
			},
			headerCheckboxSelection: true,
			// headerCheckboxSelectionFilteredOnly: true,
			// cellRenderer: 'agGroupCellRenderer',
			cellRendererParams: {
				checkbox: true
			}
		}
		this.gridOptions = {
			...self.gridOptions,
			...{
				rowClassRules: {
					'grid-row-zebra-even': function (params) {
						return !(params.rowIndex % 2)
					},
					'grid-row-zebra-odd': function (params) {
						return params.rowIndex % 2
					}
				},
				context: {
					componentParent: self
				},
				rowSelection: 'multiple',
				suppressRowClickSelection: true,
				groupSelectsChildren: true,
				animateRows: true,
				enableRangeSelection: true,
				enableSorting: true,
				groupDefaultExpanded: -1,
				groupMultiAutoColumn: true,
				// pivotPanelShow: 'always',
				// rowGroupPanelShow: 'always',
				autoGroupColumnDef: autoGroupColumnDef
			}
		}

		this.columnDefs = [
			{
				headerName: '', width: 55,
				checkboxSelection(params) {
					// we put checkbox on the name if we are not doing grouping
					if (!params.data) {
						// todo return false
					}
					return true
				},
				headerCheckboxSelection(params) {
					// we put checkbox on the name if we are not doing grouping
					// return params.columnApi.getRowGroupColumns().length === 0
					return true
				},
				pinned: 'left',
				suppressSorting: true, suppressMenu: true, suppressSizeToFit: true, suppressResize: true
			},
			{
				headerName: 'id',
				field: 'id',
				hide: true
			}, {
				headerName: '汇率期间',
				field: 'datePeriod',
				// rowGroup: true,
				// hide: true,
				cellRenderer: param => {
					const _startDate = moment(parseInt(param.data.startDate)).format('YYYY-MM-DD')
					const _endDate = moment(parseInt(param.data.endDate)).format('YYYY-MM-DD')
					return `${_startDate} - ${_endDate}`
				}
				// rowSpan: params => {
				//   return params.data.rowSpan
				// },
				// cellClassRules: {
				//   'cell-of-spanning-row': params => params.data.rowSpan > 1
				// }
			}, {
				headerName: '源币种',
				field: 'currencySource',
				cellRenderer: param =>
					param.value ? `<svg class="icon" aria-hidden="true" style="height:1em;width:1em;vertical-align: -0.08em;font-size:14px;"><use xlink:href="#icon-${param.value}"></use></svg> ${param.value}` : ''
				// return param.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;"><use xlink:href="#icon-huilv-${param.value}"/></svg> ` + param.value : ''

			}, {
				headerName: '目标币种',
				field: 'currencyTarget',
				cellRenderer: param =>
					param.value ? `<svg class="icon" aria-hidden="true" style="height:1em;width:1em;vertical-align: -0.08em;font-size:14px;"><use xlink:href="#icon-${param.value}"></use></svg> ${param.value}` : ''
				// return param.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;"><use xlink:href="#icon-huilv-${param.value}"/></svg> ` + param.value : ''

			}, {
				headerName: '汇率',
				field: 'rate'
			}, {
				headerName: '分公司',
				field: 'officeName',
				flex: 1,
				cellRenderer: params => {
					const iconName = 'icon-gongsi1'
					return params.value ? `<i class="iconfont ${iconName}" style="color: #159cf5; font-size: 12px;"></i> ${params.value}` : ''
				}
			}, {
				headerName: '创建人',
				field: 'createByName',
				cellRenderer: params => {
					const iconName = 'icon-fahuodanwei'
					return params.value ? `<i class="iconfont ${iconName}" style="font-size: 14px;"></i> ${params.value}` : ''
					// return params.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1.2em;width:1.2em;">
					//       <use xlink:href="#icon-${iconName}"></use>
					//     </svg> ${params.value}` : ''
				},
				hide: true
			}, {
				headerName: '创建日期',
				field: 'createTime',
				hide: true
			}, {
				headerName: '更新人',
				field: 'updateByName',
				cellRenderer: params => {
					const iconName = 'icon-fahuodanwei'
					return params.value ? `<i class="iconfont ${iconName}" style="font-size: 14px;"></i> ${params.value}` : ''
					// const iconName = 'person-in-grid-cell'
					// return params.value ? `<svg class="svg-icon" aria-hidden="true" style="height:1.2em;width:1.2em;">
					//       <use xlink:href="#icon-${iconName}"></use>
					//     </svg> ${params.value}` : ''
				},
				hide: true
			}, {
				headerName: '更新日期',
				field: 'updateTime',
				hide: true
			}, {
				headerName: '操作', pinned: 'right', field: `bActive`, width: 300,
				cellRendererFramework: 'exchangeRateOperateButton'
			}]
	},
	beforeMount() {
		this.fetchExchangeRateList()
	},
	methods: {

		onReady(params) {
			const self = this
			// this.gridApi = params.api
			// params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					// params.api.sizeColumnsToFit()
					self.onFirstDataRendered(self.gridOptions)
				})
			})
		},
		childOptions(childValue) {
			this.currencyList = childValue
			console.log('childValuechildValuechildValuechildValue:', childValue)
		},
		onFirstDataRendered(gridOptions) {
			const allColumnIds = []
			gridOptions.columnApi.getAllColumns().forEach(function (column) {
				allColumnIds.push(column.colId)
			})
			setTimeout(function () {
				gridOptions.columnApi.autoSizeColumns(allColumnIds)
			})
		},
		initData() {
			this.onePeriodExchangeRate = { ...this.initOnePeriodExchangeRate }
			this.exchangeRateArray = []
		},
		// chooseMonth(val) {
		//   const valDate = this.$moment(val).startOf('month')
		//   this.onePeriodExchangeRate.month = valDate.valueOf()
		//   // const arr = this.onePeriodExchangeRate.month.split('-')
		//   // const start = this.onePeriodExchangeRate.month + ' 00:00:00'
		//   // const end = getMonthLastDay(arr[0], arr[1]) + ' 00:00:00'
		//   // this.onePeriodExchangeRate.effectivePeriod = [start, end]
		// },
		toQuery() {
			this.fetchExchangeRateList()
		},
		fetchExchangeRateList() {
			const self = this
			self.initData()
			getExchangeRateList(this.searchConditions).then(res => {
				if (res.ok) {
					self.rowData = res.content.list
				}
			})
		},
		toBatchDel() {
			getGridSelectedIds(this.gridOptions).then(ids => batchDelExchangeRate(ids.join(','))).then(res => {
				if (res.ok) {
					this.fetchExchangeRateList()
				}
			})
		},
		popExchangeRateFormDialog(periodCode) {
			const self = this
			getDetailPageInitData().then(res => {
				if (res.ok) {
					let map = {}
					res.content.officeList.forEach(function (v) {
						map[v.value] = v.label
					})
					self.officeListMap = map
					self.officeList = res.content.officeList
				}
				//  self.currencyList = res.content.currencyList
				console.log(self.currencyList)
			}).then(() => {
				if (periodCode) {
					getExchangeRateByPeriodCode(periodCode).then(res => {
						if (res.ok) {
							const content = res.content
							// 设置 期间id
							self.onePeriodExchangeRate.periodCode = periodCode
							self.exchangeRateArray = content.rateList
							self.isShowingCreateExchangeRateDialog = true
							self.exchangeRateArray.forEach((item, index) => {
								// 设置身份标识
								item.identNum = new Date().getTime() - index
							})
							self.onePeriodExchangeRate.month = content.month
							self.onePeriodExchangeRate.officeId = content.officeId
							self.onePeriodExchangeRate.effectivePeriod = [content.startDate, content.endDate]
							console.log('editRateRows:', self.exchangeRateArray)
						} else {
							self.$message.warning('编辑信息获取失败，编辑弹框打开失败')
						}
					})
				} else {
					// 这样可防止不污染oneExchangeRate中的初始化数据
					// 新建窗口 应初始化一条数据
					self.exchangeRateArray.push({ ...self.oneExchangeRate })
					console.log('self.initOneExchangeRate:', self.oneExchangeRate)
					self.isShowingCreateExchangeRateDialog = true
				}
			})
		},
		addOneExchangeRate(eid) {
			let idx = 0
			let cnt = 0
			this.exchangeRateArray.find(e => {
				if (e.identNum === eid) {
					idx = cnt
				}
				cnt++
			})
			const newExchangeRate = { ...this.oneExchangeRate, ...{ identNum: new Date().getTime() } }
			this.exchangeRateArray.splice(idx + 1, 0, newExchangeRate)
		},
		removeThisExchangeRate(eid) {
			if (this.exchangeRateArray.length === 1) {
				return this.$message.error('至少保留一条')
			}
			this.exchangeRateArray = this.exchangeRateArray.filter(e => e.identNum !== eid)
		},
		batchAddExchangeRate() {
			const self = this
			let data = { ...this.onePeriodExchangeRate, ...{ rateList: this.exchangeRateArray } }
			if (data.officeId) {
				data.officeName = self.officeListMap[data.officeId]
			}
			batchAddExchangeRate(data).then(res => {
				if (res.ok) {
					self.fetchExchangeRateList()
					self.$message.success('添加汇率成功')
					this.isShowingCreateExchangeRateDialog = false
				}
			})
		},
		batchEditExchangeRate() {
			const self = this
			const data = { ...this.onePeriodExchangeRate, ...{ rateList: this.exchangeRateArray } }
			if (data.officeId) {
				data.officeName = self.officeListMap[data.officeId]
			}
			batchEditExchangeRate(this.onePeriodExchangeRate.periodCode, data).then(res => {
				if (res.ok) {
					self.fetchExchangeRateList()
					self.$message.success('编辑汇率成功')
					this.isShowingCreateExchangeRateDialog = false
				}
			})
		},
		delExchangeRate(id) {
			delExchangeRate(id).then(res => {
				if (res.ok) {
					this.$message.success('删除成功')
					this.fetchExchangeRateList()
				}
			})
		},
		submitExchangeRate() {
			if (this.onePeriodExchangeRate.periodCode) {
				this.batchEditExchangeRate()
			} else {
				this.batchAddExchangeRate()
			}
		},
		cancelBtn() {
			this.initData()
			this.isShowingCreateExchangeRateDialog = false
		},
		switchExchangeRateStatus(id, bActive) {
			const self = this
			switchExchangeRateStatus(id, bActive).then(res => {
				if (res.ok) {
					self.fetchExchangeRateList()
				} else {
					self.$message.warning('汇率状态变更失败')
				}
			})
		},
		getValueFromChild(obj) {
			this.searchConditions[obj.key] = obj.value
		}

	}
}
</script>
<style>
.cell-of-spanning-row {
	background-color: #fff;
	border-left: 1px solid lightgrey !important;
	border-right: 1px solid lightgrey !important;
	border-bottom: 1px solid lightgrey !important;
	display: flex !important;
	justify-content: center !important;
	flex-direction: column !important;
	text-align: center !important;
}
</style>
