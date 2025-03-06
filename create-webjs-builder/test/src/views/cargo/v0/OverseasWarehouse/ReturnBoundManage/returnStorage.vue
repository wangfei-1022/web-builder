<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <TopSearchItemsSlot :filterType="'mutliple'" :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <el-form :inline="true" :model="formData" label-width="90px" ref="formData">
          <el-form-item :label="`${$t('common.customerName')}: `" prop="customerId">
            <TypeSelect v-model="formData.customerId" type="customer" @selected="list" />
          </el-form-item>
          <el-form-item :label="getZH('returnOrderNo')" prop="orderNo">
            <el-input class='w-140' size="mini" v-model="formData.orderNo" :placeholder="inputZH('returnOrderNo')" @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('orderNo')" prop="outboundNo">
            <el-input class='w-140' size="mini" v-model="formData.outboundNo" :placeholder="inputZH('orderNo')" @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('skuNumber')" prop="skuCode">
            <el-input class='w-160' size="mini" v-model="formData.skuCode" :placeholder="inputZH('skuNumber')" @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('typeOfReturn')"  clearable>
            <el-select size="mini" v-model="formData.type" @change="list" class="w-120">
              <el-option :value="1" label="客退入库"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('returnWarehouse')" prop="warehouseIds" >
            <StorageWarehouseSelect @change="list" v-model="formData.warehouseIds" clearable :multiple="true" outWarehouseType="10" :show-all-levels="false" />
          </el-form-item>
          <el-form-item :label="getZH('trackNo')" prop="shipmentNo">
            <el-input size="mini" v-model="formData.shipmentNo" :placeholder="inputZH('trackNo')"
              @keyup.enter.native="list" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item :label="getZH('logicProductName')" prop="productId">
             <TypeSelect v-model="formData.productId" type="ovlProduct" productValue="id" @selected="list" />
          </el-form-item>
          <el-form-item :label="getZH('status')" prop="status" clearable>
            <el-select size="mini" v-model="formData.status" @change="list" class="w-120">
              <el-option :value="null" :label="getZH('all')"></el-option>
              <el-option v-for="item in statusList" :key="item.code" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item :label="getZH('pickupType')" prop="pickup" label-width='130px'>
            <el-select size="mini" v-model="formData.pickup" @change="list" class="w-120">
              <el-option :value="null" :label="getZH('isAll')"></el-option>
              <el-option :value="true" :label="getZH('isTrue')"></el-option>
              <el-option :value="false" :label="getZH('isFalse')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="getZH('createTime')">
            <el-select class="w-100"	v-model="queryZone" @change="list" size="mini">
              <el-option v-for="(item,key) in zoneObj" :key="item" :label="item" :value="Number(key)" />
            </el-select>
            <el-date-picker size="mini" v-model="dateTime" class="ml-10" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="timestamp"
                :default-time="['00:00:00','23:59:59']"
                @change="list" >
              </el-date-picker>
          </el-form-item>
          <el-form-item :label="getZH('arrivalTime')">
            <el-select class="w-100"	v-model="queryZone1" @change="list" size="mini">
              <el-option v-for="(item,key) in zoneObj" :key="item" :label="item" :value="Number(key)" />
            </el-select>
            <el-date-picker size="mini" v-model="arrivalTime" class="ml-10" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="timestamp"
                :default-time="['00:00:00','23:59:59']"
                @change="list" >
              </el-date-picker>
          </el-form-item>
          <el-form-item :label="getZH('processeTime')" label-width="120px">
            <el-select class="w-100"	v-model="queryZone2" @change="list" size="mini">
              <el-option v-for="(item,key) in zoneObj" :key="item" :label="item" :value="Number(key)" />
            </el-select>
            <el-date-picker size="mini" v-model="processeTime" class="ml-10" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="timestamp"
                :default-time="['00:00:00','23:59:59']"
                @change="list" >
              </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
    </TopSearchItemsSlot>
    <div class="container-wrap">
      <div class="flex-box mb-10">
        <el-button type="primary" size="mini"  @click="batchExportVisible=true">{{ getZH("exportBtn") }}</el-button>
        <el-checkbox class="ml-20" v-model="isCurrentZone">{{getZH('isCurrentZone')}}</el-checkbox>
      </div>
      <div>
       <ag-grid-vue
				:locale-text-func="_i18nGridLocalText"
				:grid-options="gridOptionsRight"
				:side-bar="sideBarDefs"
				:column-defs="columnFields"
				:row-data="filterDataList"
				:enable-col-resize="true"
				:enable-sorting="true"
				:grid-ready="onReady"
				:animate-rows="false"
        :style="gridHeight"
				class="ag-theme-balham"
			/>
      </div>
    </div>

    <BatchExportDialog :visible.sync="batchExportVisible" @saved="exportData" :exportType="2" />
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
    <SupplementDialog :visible.sync="dialog.visible" :id="activeId" :orderNo="orderNo" @saved="list" />
    <OperationConfirmDialog :visible.sync="operationConfirmVisible" :type="operationType" :data="handlerRow"  @saved="list" />
    <UpdateWarehouseDialog :visible.sync="updateWarehouseVisible" :id="activeId"  @saved="list" />

  </div>
</template>

<script lang="jsx">
import StorageWarehouseSelect from "../components/storageWarehouseSelect.vue"
import SupplementDialog from './components/supplementDialog.vue'
import operationBtn from './components/operationBtn.vue'
import OperationConfirmDialog from './components/operationConfirmDialog.vue'
import UpdateWarehouseDialog from './components/updateWarehouseDialog.vue'
import BatchExportDialog from '../PutInStorageManage/components/batchExportDialog'
import { getTimeByQueryTimeZone, handlerTimeStr } from '@/utils'
import { getReturnOutboundPagesApi, getReturnStatusApi, detailReturnOutboundApi, getReturnTypeApi, delReturnOutboundApi, exportReturnBoundApi, batchSubmitReturnboundApi, batchDelReturnboundApi } from '@/api/OverseasWarehouse/returnManage'
export default {
	name: "OutboundList",
	components: { StorageWarehouseSelect, operationBtn, SupplementDialog, OperationConfirmDialog, UpdateWarehouseDialog, BatchExportDialog },
	data() {
		return {
			gridOptionsRight: {
				rowSelection: 'multiple',
				rowMultiSelectWithClick: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			gridApi: null,
			columnApi: null,
			queryZoneVal: null,
			batchExportVisible: false,
			vm: this,
			loading: false,
			orderNo: null,
			operationType: null,
			dialogVisible: false,
			operationConfirmVisible: false,
			dataList: [],
			currentZone: -new Date().getTimezoneOffset() / 60,
			tableHeight: document.documentElement.clientHeight - 560,
			total: 0,
			dateTime: [],
			processeTime: [],
			arrivalTime: [],
			productList: [],
			statusList: [],
			types: [],
			companyList: [],
			tempDate: [],
			selectRows: [],
			zoneObj: {
				'0': '中时区',
				'1': '东一区',
				'2': '东二区',
				'3': '东三区',
				'4': '东四区',
				'5': '东五区',
				'6': '东六区',
				'7': '东七区',
				'8': '东八区',
				'9': '东九区',
				'10': '东十区',
				'11': '东十一区',
				'12': '东十二区',
				'-11': '西十一区',
				'-10': '西十区',
				'-9': '西九区',
				'-8': '西八区',
				'-7': '西七区',
				'-6': '西六区',
				'-5': '西五区',
				'-4': '西四区',
				'-3': '西三区',
				'-2': '西二区',
				'-1': '西一区'
			},
			activeId: null,
			throughFileVisible: false,
			updateWarehouseVisible: false,
			isCurrentZone: true,
			queryZone: -new Date().getTimezoneOffset() / 60,
			queryZone1: -new Date().getTimezoneOffset() / 60,
			queryZone2: -new Date().getTimezoneOffset() / 60,
			columnFields: [
				{
					headerName: '', width: 55, pinned: 'left',
					suppressSorting: true, checkboxSelection: true, headerCheckboxSelection: true,
					suppressMenu: true, suppressSizeToFit: true, suppressResize: true
				},
				{
					headerName: this.getZH('customerName', 'common'),
					field: 'customerName',
					minWidth: 150
				},
				{
					headerName: this.getZH('returnOrderNo'),
					field: 'orderNo',
					minWidth: 150
				},
				{
					headerName: this.getZH('typeOfReturn'),
					field: 'typeName',
					minWidth: 120
				},
				{
					headerName: this.getZH('orderNo'),
					field: 'outboundNo',
					minWidth: 150
				},
				{
					headerName: this.getZH('returnWarehouse'),
					field: 'warehouseName',
					minWidth: 120
				},
				{
					headerName: this.getZH('trackNo'),
					field: 'shipmentNo',
					minWidth: 230
				},

				{
					headerName: this.getZH('pickupType'),
					field: 'pickup',
					minWidth: 140,
					cellRenderer: params => params.value ? this.getZH('isTrue') : this.getZH('isFalse')
				},

				{
					headerName: this.getZH('logicProductName'),
					field: 'productName',
					minWidth: 120

				},
				{
					headerName: this.getZH('status'),
					field: 'statusName',
					minWidth: 110
				},

				{
					headerName: this.getZH('createTime'),
					minWidth: 230,
					field: 'createTimeStr'
				},
				{
					headerName: this.getZH('arrivalTime'),
					minWidth: 230,
					field: 'returnArrivalTimeStr'
				},
				{
					headerName: this.getZH('processeTime'),
					minWidth: 230,
					field: 'operationTimeStr'
				},
				{
					headerName: this.getZH('submitTime'),
					field: 'submitTimeStr',
					minWidth: 230
				},
				{
					headerName: this.getZH('skuNumber'),
					field: 'skuCode',
					minWidth: 160
				},

				{
					headerName: this.getZH('returnContact'),
					field: 'returnContact',
					minWidth: 120
				},
				{
					headerName: this.getZH('carrierMobile'),
					field: 'returnContactTel',
					minWidth: 140
				},
				{
					headerName: this.getZH('returnContactEmail'),
					field: 'returnContactEmail',
					minWidth: 120
				},
				{
					headerName: this.getZH('arrivalCountry'),
					field: 'returnCountryName',
					minWidth: 90
				},
				{
					headerName: this.getZH('arrivalProvince'),
					field: 'returnProvinceName',
					minWidth: 120
					// cellRenderer: params => `<div><div>
					// 				<span>${params.data.returnCountryName}</span>
					// 				<span> ${params.data.returnProvinceName}</span>
					// 				<span> ${params.data.returnCity}</span>
					// 				<span> ${params.data.returnAddress1}</span>
					// 				<span> ${params.data.returnAddress2}</span>
					// 			</div></div>`
				},
				{
					headerName: this.getZH('arrivalCity'),
					field: 'returnCity',
					minWidth: 110,
					showOverflowTooltip: true
				},
				{
					headerName: this.getZH('arrivalZipcode'),
					field: 'zipcode',
					minWidth: 160
				},
				{
					headerName: this.getZH('arrivalAddress1'),
					field: 'returnAddress1',
					minWidth: 140
				},
				{
					headerName: this.getZH('arrivalAddress2'),
					field: 'returnAddress2',
					minWidth: 140
				},
				{
					headerName: this.getZH('rejectMessage'),
					field: 'rejectMessage',
					minWidth: 140
				},
				{
					headerName: this.getZH('abnormalFlag'),
					field: 'abnormalFlag',
					minWidth: 140,
					render: (h, { row }) =>
						<div>
							{
								row.abnormalFlag
									? <el-tooltip effect="dark" placement="top">
										<div slot="content">{row.abnormalMessage}</div>
										<span class='fc-blue pointer'>是</span></el-tooltip> : '否'
							}
						</div>
				},
				{
					headerName: this.getZH('abnormalCause'),
					field: 'abnormalMessage',
					minWidth: 140
				},
				{
					headerName: '操作', pinned: 'right', field: `id`, minWidth: 230,
					cellRendererFramework: 'operationBtn'
				}

			],
			detailContent: {},
			handlerRow: {},
			limits: [100, 210, 215, 325, 330, 340, 345, 350],
			formData: {
				shipmentNo: '',
				orderNo: '',
				productId: '',
				warehouseIds: [],
				status: '',
				outTimeStart: null,
				outTimeEnd: null,
				carrierId: '',
				pickup: null,
				skuCode: null,
				outOrderNo: null,
				type: 1,
				pageNum: 1,
				pageSize: 50

			}
		}
	},
	created() {
		this.init()
		this.list()
	},
	mounted() { },
	computed: {
		filterDataList() {
			const handlerTimeStrCache = {}
			return this.dataList.map(({ createTime, returnArrivalTime, submitTime, operationTime, ...item }) => {
				let zone = this.isCurrentZone ? this.currentZone : item.warehouseZone
				const createTimeStr = handlerTimeStrCache[createTime]
					? handlerTimeStrCache[createTime]
					: handlerTimeStrCache[createTime] = handlerTimeStr(createTime, zone)
				const returnArrivalTimeStr = handlerTimeStrCache[returnArrivalTime]
					? handlerTimeStrCache[returnArrivalTime]
					: handlerTimeStrCache[returnArrivalTime] = handlerTimeStr(returnArrivalTime, zone)
				const submitTimeStr = handlerTimeStrCache[submitTime]
					? handlerTimeStrCache[submitTime]
					: handlerTimeStrCache[submitTime] = handlerTimeStr(submitTime, zone)
				const operationTimeStr = handlerTimeStrCache[operationTime]
					? handlerTimeStrCache[operationTime]
					: handlerTimeStrCache[operationTime] = handlerTimeStr(operationTime, zone)
				return {
					...item,
					createTimeStr,
					returnArrivalTimeStr,
					submitTimeStr,
					operationTimeStr
				}
			})
		}
	},
	methods: {
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
		handleRowSelected(val) {
			this.selectRows = val
		},
		/**
		 * 更新到仓
		 */
		updateWarehouse(data) {
			this.activeId = data.id
			this.updateWarehouseVisible = true
		},
		/**
		 * 初始话基础数据
		 */
		async init() {
			// 物流产品
			// let rs = await getProductListApi()
			// if (rs.ok) {
			// 	this.productList = rs.content
			// }
			// // 物流公司
			// let result = await getLogisticsCompanyApi()
			// if (result.ok) {
			// 	this.companyList = result.content
			// }
			// 状态
			let res = await getReturnStatusApi()
			if (res.ok) {
				this.statusList = res.content
			}
			let result = await getReturnTypeApi()
			if (result.ok) {
				this.types = res.content
			}
		},
		// 批量导出
		exportData(data) {
			console.log(data);

			let query = {}
			if (this.$isNotEmpty(this.selectRows)) {
				let ids = []
				this.selectRows.forEach(item => {
					ids.push(item.id)
				})
				query.ids = ids
			} else {
				this.handlerQuery()
				query = this.$extends(true, {}, this.formData)
			}
			query = { ...query, ...data }
			this.loading = true
			exportReturnBoundApi(query).then(res => {
				if (res.ok) {
					this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerTips'), {
						dangerouslyUseHTMLString: true,
						confirmButtonText: this.getZH('theKnow', 'common'),
						callback: () => {
							// this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
							this.loading = false
						}
					})
					this.loading = false
				} else {
					this.loading = false
				}
			})
		},
		// 处理上架和销毁
		handlerItem(data) {
			this.operationType = Number(data.status) === 410 ? 1 : 2
			this.handlerRow = this.$extends(true, {}, data)
			this.operationConfirmVisible = true
		},
		// 处理查询条件
		handlerQuery() {
			if (this.queryZone) {
				this.formData.createTimeStart = this.$isNotEmpty(this.dateTime) ? getTimeByQueryTimeZone(this.dateTime[0], this.queryZone) : null
				this.formData.createTimeEnd = this.$isNotEmpty(this.dateTime) ? getTimeByQueryTimeZone(this.dateTime[1], this.queryZone) : null
			} else {
				this.formData.createTimeStart = this.$isNotEmpty(this.dateTime) ? this.dateTime[0] : null
				this.formData.createTimeEnd = this.$isNotEmpty(this.dateTime) ? this.dateTime[1] : null
			}
			if (this.queryZone1) {
				this.formData.returnArrivalTimeStart = this.$isNotEmpty(this.arrivalTime) ? getTimeByQueryTimeZone(this.arrivalTime[0], this.queryZone1) : null
				this.formData.returnArrivalTimeEnd = this.$isNotEmpty(this.arrivalTime) ? getTimeByQueryTimeZone(this.arrivalTime[1], this.queryZone1) : null
			} else {
				this.formData.returnArrivalTimeStart = this.$isNotEmpty(this.arrivalTime) ? this.arrivalTime[0] : null
				this.formData.returnArrivalTimeEnd = this.$isNotEmpty(this.arrivalTime) ? this.arrivalTime[1] : null
			}
			if (this.queryZone2) {
				this.formData.operationTimeStart = this.$isNotEmpty(this.processeTime) ? getTimeByQueryTimeZone(this.processeTime[0], this.queryZone2) : null
				this.formData.operationTimeEnd = this.$isNotEmpty(this.processeTime) ? getTimeByQueryTimeZone(this.processeTime[1], this.queryZone2) : null
			} else {
				this.formData.operationTimeStart = this.$isNotEmpty(this.processeTime) ? this.arrivalTime[0] : null
				this.formData.operationTimeEnd = this.$isNotEmpty(this.processeTime) ? this.arrivalTime[1] : null
			}
		},

		/**
		 * 获取列表数据
		 */
		async list() {
			this.handlerQuery()
			this.loading = true
			let res = await getReturnOutboundPagesApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},


		// 批量提交
		bacthSubmit() {
			let query = {}
			if (this.$isNotEmpty(this.selectRows)) {
				let ids = []
				this.selectRows.forEach(item => {
					ids.push(item.id)
				})
				query.ids = ids
			} else {
				this.handlerQuery()
				query = this.$extends(true, {}, this.formData)
			}
			this.loading = true
			batchSubmitReturnboundApi(query).then(res => {
				if (res.ok) {
					this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime')}</span><span class="fs-16">,${this.getZH('handlerRes')}</span></div>`, this.getZH('handlerSubmitTips'), {
						dangerouslyUseHTMLString: true,
						confirmButtonText: this.getZH('theKnow', 'common'),
						callback: () => {
							// this.$router.push({ name: `TaskList`, query: { time: new Date().getTime() } })
							this.loading = false
						}
					})
					this.loading = false
				} else {
					this.loading = false
				}
			})
		},
		/**
* 批量删除
*/
		batchDelOutbound() {
			let selectRows = this.selectRows.filter(item => item.status === 100)
			if (this.$isNotEmpty(selectRows)) {
				let ids = []
				selectRows.forEach(item => {
					ids.push(item.id)
				})
				this.$confirm(this.$t('common.deleteTips'), this.$t('common.tips'), {
					confirmButtonText: this.$t('common.confirm'),
					cancelButtonText: this.$t('common.cancel'),
					type: 'warning'
				}).then(() => {
					// 调后端接口
					batchDelReturnboundApi({ ids }).then(res => {
						if (res.ok) {
							this.list()
							this.$message.success(this.$t('common.deleteSuccess'))
						}
					})
				})
			} else {
				this.$message.error(this.$t('outInStorageManage.selectEmptyTips'))
			}
		},
		// 删除
		del(id) {
			this.$confirm(this.$t('common.deleteTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel'),
				type: 'warning'
			}).then(() => {
				// 调后端接口
				delReturnOutboundApi(id).then(res => {
					if (res.ok) {
						this.list()
						this.$message.success(this.$t('common.deleteSuccess'))
					}
				})
			})
		},
		// 补录面单
		supplement(data) {
			this.activeId = data.id
			this.orderNo = data.orderNo
			this.dialog.visible = true

		},
		/**
		 * 重置搜索条件
		 */
		reset() {
			this.dateTime = []
			this.processeTime = []
			this.arrivalTime = []
			this.$refs.formData.resetFields()
			this.list()
		},
		/**
	 * 下拉框
	 */
		selectZH(key, obj) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key, obj)
		},
		/**
		 * 输入框
		 */
		inputZH(key, obj) {
			return this.getZH('placeholder', 'common') + this.getZH(key, obj)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'outInStorageManage'
			let str = obj + '.' + key
			return this.$t(str)
		}
	}
}
</script>

<style scoped lang="scss">
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
.input-disabled {
	display: inline-block;
	height: 28px;
	line-height: 28px;
	background-color: #f5f7fa;
	border: 1px solid #dfe4ed;
	color: #606266;
	border-radius: 4px;
	font-size: 12px;
	padding: 0 15px;
	flex-grow: 1;
	width: 100px;
	margin-right: 10px;
}
</style>
