<template>
	<div v-loading="loading" class="pd-16">
		<div class="mb-10">
			<top-search-items-slot >
				<template slot="multipleSearch">
					<el-form	ref="formData" :inline="true" :model="formData" class="search-form" label-width="20px">
						<el-form-item	class="el-form-item"	label="" prop="customerName">
              <el-input size="mini" v-model="formData.customerName" :placeholder="inputZH('customerNameOrOther')" class="w-200"></el-input>
						</el-form-item>
						<el-form-item	class="el-form-item" label=""	prop="number">
							<el-input	v-model="formData.number" size="mini" :placeholder="inputZH('blOrCtn')" clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item	class="el-form-item" label=""	prop="vesselVoyage">
							<el-input	v-model="formData.vesselVoyage" size="mini" :placeholder="inputZH('vesselOrVoyage')" clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item	class="el-form-item" label="">
              <div class="flex-box">
                <el-select size="mini" v-model="formData.orderByField" class="w-100">
                  <el-option v-for="item in dataTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <CommonPicker class="ml-10" v-model="dataTime" pickerFormat="yyyy-MM-dd"  pikcerType="daterange" :clearable="true" />
              </div>
						</el-form-item>
						<el-form-item	class="el-form-item" label=""  prop="order">
              <el-select size="mini" v-model="formData.order">
                <el-option label="正序" :value="1"></el-option>
                <el-option label="倒序" :value="2"></el-option>
              </el-select>
						</el-form-item>
					</el-form>
				</template>
        <span slot="searchBtn">
          <div class="search-btn-wrap">
            <div></div>
            <div class="page-search-button">
              <el-button type="primary" icon="el-icon-search" @click="list" size="mini">{{$t('common.searchBtn')}}</el-button>
              <el-button @click="reset" icon="el-icon-refresh-left" size="mini">{{$t('common.resetBtn')}}</el-button>
              <el-dropdown @command="dropdownClick">
                <el-button type="primary" size="mini">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">提柜</el-dropdown-item>
                  <el-dropdown-item command="2">还柜</el-dropdown-item>
                  <el-dropdown-item command="3">导出</el-dropdown-item>
                  <el-dropdown-item command="4">异常</el-dropdown-item>
                  <el-dropdown-item command="5">入库</el-dropdown-item>
                  <el-dropdown-item command="6">更新保费</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </span>
			</top-search-items-slot>
		</div>
    <div class="top-message flex-between mb-10">
      <div class="top-item">
        <el-checkbox v-model="initCnt.etaDayFlag" size="mini" @change="checkboxChange($event,1)"></el-checkbox>
        <span class="ml-4">未来 <el-input class="w-50" size="mini" v-model="initCnt.etaDay" @blur="initCntBlur(initCnt.etaDay,1)" oninput="value=value.replace(/[^\d]/g,'')"></el-input> 天到港箱子数量：</span>
        <span>{{reportData.etaCount || 0}}</span>
      </div>
      <div class="top-item">
        <el-checkbox v-model="initCnt.pickUpDayFlag" size="mini" @change="checkboxChange($event,2)"></el-checkbox>
        <span class="ml-4">未来 <el-input class="w-50" size="mini" v-model="initCnt.pickUpDay" @blur="initCntBlur(initCnt.pickUpDay,2)" oninput="value=value.replace(/[^\d]/g,'')"></el-input> 天应提柜数量：</span>
        <span>{{reportData.pickUpCount || 0}}</span>
      </div>
      <div class="top-item">
        <el-checkbox v-model="initCnt.returnDayFlag" size="mini" @change="checkboxChange($event,3)"></el-checkbox>
        <span class="ml-4">未来 <el-input class="w-50" size="mini" v-model="initCnt.returnDay" @blur="initCntBlur(initCnt.returnDay,3)" oninput="value=value.replace(/[^\d]/g,'')"></el-input> 天应还柜数量：</span>
        <span>{{reportData.returnCount|| 0}}</span>
      </div>
    </div>
    <div class="page-content">
      <el-tabs type="border-card" v-model="activeName" @tab-click="list">
      <el-tab-pane :label="`${item.label}（${item.count}）`" :name="item.value+''" v-for="item in stateList" :key="item.value">
        <div class="tabs-content">
          <ContainerDetailTable :ref="`ContainerDetailTable-${item.value}`" :dataList="dataList" @saved="list" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <Pagination :total="total"	:limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list"	/>
    </div>
    <AbnormalCabinetDialog :visible.sync="dialog.visible" @saved="list" :initData="initData" />
    <CtnOpDialog :visible.sync="ctnOpVisible" @saved="list" :initData="ctnInfo" />
    <UpdatePremiumDialog :visible.sync="updatePremiumVisible" @saved="list"  :ids='ctnIds' />
	</div>
</template>

<script>
import containerHandleOpBtn from './components/containerHandleOpBtn'
import AbnormalCabinetDialog from './components/AbnormalCabinetDialog'
import UpdatePremiumDialog from './components/updatePremiumDialog'
import { getSeaImportCtnListApi, getSeaImportCtnCountApi, getSeaImportCtnDateCountApi, getCtnPickupApi, getCtnReturnApi, exportCtnInfoApi, checkInboundIsCreatedApi, appointInboundApi } from '@/api/OvlSeaSitManage/seaBl'
import ContainerDetailTable from './components/ContainerDetailTable'
import CtnOpDialog from './components/CtnOpDialog'
export default {
	name: 'ContainerManage',
	components: { containerHandleOpBtn, ContainerDetailTable, AbnormalCabinetDialog, CtnOpDialog, UpdatePremiumDialog },
	data() {
		return {
			formData: {
				orderByField: 1,
				customerName: null,
				number: null,
				vesselVoyage: null,
				declareDateStart: null,
				declareDateEnd: null,
				etaStart: null,
				etaEnd: null,
				ataStart: null,
				ataEnd: null,
				doFinishDateStart: null,
				doFinishDateEnd: null,
				pickUpTimeStart: null,
				pickUpTimeEnd: null,
				inboundDateStart: null,
				inboundDateEnd: null,
				returnTimeStart: null,
				returnTimeEnd: null,
				order: 2,
				etaDay: null,
				pickUpDay: null,
				returnDay: null,
				state: null,
				pageSize: 50,
				pageNum: 1
			},
			selectedData: [],
			total: 0,
			ctnOpVisible: false,
			updatePremiumVisible: false,
			dataTime: [],
			ctnIds: [],
			activeName: '0',
			stateList: [{
				label: '全部',
				count: 0,
				value: 0
			},
			{
				label: '未到港',
				count: 0,
				value: 19
			},
			{
				label: '已到港',
				count: 0,
				value: 20
			},
			{
				label: '已清关或转关',
				count: 0,
				value: 10
			},
			{
				label: '已提柜',
				count: 0,
				value: 30
			},
			{
				label: '已入库',
				count: 0,
				value: 35
			},
			{
				label: '已还柜',
				count: 0,
				value: 50
			},
			{
				label: '异常柜',
				count: 0,
				value: 22
			}],
			initCnt: {
				etaDayFlag: false,
				pickUpDayFlag: false,
				returnDayFlag: false,
				etaDay: 8,
				pickUpDay: 5,
				returnDay: 5
			},
			reportData: {
				etaCount: null,
				pickUpCount: null,
				returnCount: null
			},
			initData: {
				id: null,
				ctnNo: null,
				state: null,
				exceptionRemark: null
			},
			ctnInfo: {
				ctnId: null,
				ctnNo: '',
				blId: null,
				blNo: null,
				customerName: null,
				skuCode: null,
				trayNum: null,
				pickUpTime: null,
				warehouseId: null,
				warehouseName: null,
				returnEmptyDock: null

			},
			dataTypes: [{ value: 1, label: '预报日期' }, { value: 2, label: 'ETA' }, { value: 3, label: 'ATA' }, { value: 4, label: '换单完成日期' }, { value: 5, label: '提柜日期' }, { value: 6, label: '入库日期' }, { value: 7, label: '还空日期' }],
			loading: false,
			dataList: [],
			cnt: null
		}
	},
	created() {
		this.list()
	},
	mounted() {

	},
	computed: {
		filterData() {
			let arr = this.dataList
			if (Number(this.activeName) !== 0) {
				arr = arr.filter(item => item.state === Number(this.activeName))
			}
			return arr
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {

		})
	},

	methods: {
		// 初始化数据
		async init() {
			let queryData = {
				etaDay: null,
				pickUpDay: null,
				returnDay: null
			}
			this.$copyProps(queryData, this.initCnt)
			let res = await getSeaImportCtnDateCountApi(queryData)
			if (res.ok) {
				this.$copyProps(this.reportData, res.content)
			}
		},
		// 设置箱子信息
		setCtnInfo(data) {
			let goods = data.ctnGoodsList[0]
			this.ctnInfo = {
				ctnId: data.id,
				ctnNo: data.ctnNo,
				blId: data.blDetail.id,
				blNo: data.blDetail.blNo,
				warehouseId: data.blDetail.warehouseId,
				warehouseName: data.blDetail.warehouseName,
				returnEmptyDock: data.pickupInfo ? data.pickupInfo.returnEmptyDock : data.blDetail.pod,
				customerName: data.blDetail.customerName,
				skuCode: goods.skuCode,
				trayNum: goods.trayNum,
				opType: data.opType,
				pickUpTime: data.pickupInfo ? data.pickupInfo.pickUpTime : null
			}
			this.ctnOpVisible = true
		},
		dropdownClick(data) {
			data = Number(data)
			if (data === 3) {
				this.exportData()
				return
			}
			let selectedData = this.$refs[`ContainerDetailTable-${this.activeName}`][0].selectedData
			// 入库
			if (data === 5) {
				if (selectedData.length === 0) {
					this.$message.error(this.$t('common.multipleSelectorEmpty'))
					return
				}
				this.storageReservation(selectedData)
				return
			}
			// 更新保费
			if (data === 6) {
				if (selectedData.length === 0) {
					this.$message.error(this.$t('common.multipleSelectorEmpty'))
					return
				}
				let ctnIds = []
				selectedData.forEach(item => {
					ctnIds.push(item.id)
				})
				this.ctnIds = ctnIds
				this.updatePremiumVisible = true
				return
			}
			if (selectedData.length !== 1) {
				this.$message.error(this.$t('common.selectorOne'))
				return
			}
			// 提柜
			if (data === 1) {
				getCtnPickupApi({ ctnNo: selectedData[0].ctnNo }).then(res => {
					if (res.ok) {
						if (this.$isNotEmpty(res.content)) {
							res.content.opType = 1
							this.setCtnInfo(res.content)
						} else {
							this.$message.error(this.$t('seaBl.pickUpTips'))
							return
						}
					}
				})
			}
			// 还柜
			if (data === 2) {
				getCtnReturnApi({ ctnNo: selectedData[0].ctnNo }).then(res => {
					if (res.ok) {
						if (this.$isNotEmpty(res.content)) {
							res.content.opType = 2
							this.setCtnInfo(res.content)
						} else {
							this.$message.error(this.$t('seaBl.returnTips'))
							return
						}
					}
				})
			}
			// 导出
			if (data === 3) {
				// todo
			}
			// 异常
			if (data === 4) {
				if (selectedData[0].state === 20 || selectedData[0].state === 22) {
					this.$copyProps(this.initData, selectedData[0])
					this.dialog.visible = true
				} else {
					this.$message.error(this.$t('seaBl.stateTips'))
					return
				}

			}

		},
		// 预警选中
		checkboxChange(val, type) {
			if (val) {
				if (type === 1) {
					this.initCnt.pickUpDayFlag = false
					this.initCnt.returnDayFlag = false
				}
				if (type === 2) {
					this.initCnt.etaDayFlag = false
					this.initCnt.returnDayFlag = false
				}
				if (type === 3) {
					this.initCnt.pickUpDayFlag = false
					this.initCnt.etaDayFlag = false
				}
			}
		},
		// 初始化数据失焦 控制不能为空
		initCntBlur(val, type) {
			if (this.$isEmpty(val)) {
				if (type === 1) {
					this.initCnt.etaDay = 8
				}
				if (type === 2) {
					this.initCnt.pickUpDay = 5
				}
				if (type === 3) {
					this.initCnt.returnDay = 5
				}
			}

		},

		// 入库预约-检查是否可创建入库单
		storageReservation(selectedList) {
			let ids = []
			selectedList.forEach(item => {
				ids.push(item.id)
			})
			checkInboundIsCreatedApi({ ids }).then(rs => {
				if (rs.ok) {
					let msg = '箱号'
					let saveIds = []
					if (this.$isNotEmpty(rs.content.createdList)) {
						rs.content.createdList.forEach(item => {
							msg += `【${item.ctnNo}】`
						})
						msg += '已生成入库单，不能重复生成入库单;'
					}
					if (this.$isNotEmpty(rs.content.uncreatedList)) {
						msg += '箱号'
						rs.content.uncreatedList.forEach(item => {
							saveIds.push(item.id)
							msg += `【${item.ctnNo}】`
							msg += '可生成入库单。'
						})
					} else {
						msg += '所选没有可生成入库单的箱号，请检查。'
					}
					this.confirmTips(msg).then(() => {
						if (this.$isNotEmpty(saveIds)) {
							this.saveAppointInbound(saveIds)
						}
					}).catch(() => { })
				}
			})
		},
		// 入库预约-创建入库单
		saveAppointInbound(ids) {
			this.confirmTips(this.getZH('confirmAppointInbound')).then(() => {
				this.loading = true
				appointInboundApi({ ids }).then(res => {
					if (res.ok) {
						this.loading = false
						let msg = `总条数：${res.content.sumCount}条；预约成功：${Number(res.content.successCount)}条；预约失败：${res.content.errorCount}条；`
						if (this.$isNotEmpty(res.content.errorList)) {
							let errTips = '失败原因：'
							res.content.errorList.forEach(item => {
								errTips += `【${item.message}】`
							})
							msg += errTips
						}
						this.$alert(msg, this.$t('common.tips'), {
							confirmButtonText: this.getZH('theKnow', 'common'),
							callback: () => {
								this.list()
							}
						})
					} else {
						this.loading = false
					}
				})
			}).catch(() => { })
		},
		/**
			 * 下拉框
			 */
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'seaBl'
			let str = obj + '.' + key
			return this.$t(str)
		},
		// 处理查询条件
		handlerQuery() {
			this.formData.declareDateStart = null
			this.formData.declareDateEnd = null
			this.formData.etaStart = null
			this.formData.etaEnd = null
			this.formData.ataStart = null
			this.formData.ataEnd = null
			this.formData.doFinishDateStart = null
			this.formData.doFinishDateEnd = null
			this.formData.pickUpTimeStart = null
			this.formData.pickUpTimeEnd = null
			this.formData.inboundDateStart = null
			this.formData.inboundDateEnd = null
			this.formData.returnTimeStart = null
			this.formData.returnTimeEnd = null
			this.formData.etaDay = null
			this.formData.pickUpDay = null
			this.formData.returnDay = null
			this.formData.state = null
			if (this.initCnt.etaDayFlag) {
				this.formData.etaDay = this.initCnt.etaDay
			}
			if (this.initCnt.pickUpDayFlag) {
				this.formData.pickUpDay = this.initCnt.pickUpDay
			}
			if (this.initCnt.returnDayFlag) {
				this.formData.returnDay = this.initCnt.returnDay
			}
			if (this.formData.orderByField === 1) {
				this.formData.declareDateStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.declareDateEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.orderByField === 2) {
				this.formData.etaStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.etaEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.orderByField === 3) {
				this.formData.ataStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.ataEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.orderByField === 4) {
				this.formData.doFinishDateStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.doFinishDateEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.orderByField === 5) {
				this.formData.pickUpTimeStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.pickUpTimeEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.orderByField === 6) {
				this.formData.inboundDateStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.inboundDateEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.orderByField === 7) {
				this.formData.returnTimeStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.returnTimeEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			}
			let query = this.$extends(true, {}, this.formData)
			return query
		},

		/**
			 * 获取列表
			 */
		async list() {
			this.init()
			this.loading = true
			let query = this.handlerQuery()
			// 统计状态数量
			let rs = await getSeaImportCtnCountApi(query)
			if (rs.ok) {
				let ctnAll = 0
				rs.content.forEach(item => {
					ctnAll += Number(item.count)
				})
				this.stateList.forEach((item, index) => {
					if (index !== 0) {
						let itemData = rs.content.find(data => data.state === item.value)
						if (this.$isNotEmpty(itemData)) {
							item.count = itemData.count
						} else {
							item.count = 0
						}
					}
				})
				this.stateList[0].count = ctnAll
			}
			if (Number(this.activeName) !== 0) {
				this.formData.state = Number(this.activeName)
			}
			const res = await getSeaImportCtnListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res && res.ok) {
				res.content.list.forEach(item => {
					item.cloudFileDTOS = item.cloudFileDTOS || []
					let blFileFlagData = item.cloudFileDTOS.find(item => item.fieldCode === 'bl')
					item.blFileFlag = this.$isNotEmpty(blFileFlagData)
					item.blFileFlagData = this.$isNotEmpty(blFileFlagData) ? blFileFlagData : null

					let ctnFlagData = item.cloudFileDTOS.find(item => item.fieldCode === 'ctn')
					item.ctnFlag = this.$isNotEmpty(ctnFlagData)
					item.ctnFlagData = this.$isNotEmpty(ctnFlagData) ? ctnFlagData : null

					let invoiceFlagData = item.cloudFileDTOS.find(item => item.fieldCode === 'clear_invoice')
					item.invoiceFlag = this.$isNotEmpty(invoiceFlagData)
					item.invoiceFlagData = this.$isNotEmpty(invoiceFlagData) ? invoiceFlagData : null

					let ctnDetailsFlagData = item.trayGoodsDetailFileJson
					item.ctnDetailsFlag = this.$isNotEmpty(ctnDetailsFlagData)
					item.ctnDetailsFlagData = this.$isNotEmpty(ctnDetailsFlagData) ? JSON.parse(ctnDetailsFlagData) : null

					let DOFlagData = item.cloudFileDTOS.find(item => item.fieldCode === 'do')
					item.DOFlag = this.$isNotEmpty(DOFlagData)
					item.DOFlagData = this.$isNotEmpty(DOFlagData) ? DOFlagData : null

					item.customsFile = this.$isNotEmpty(item.customsFileJson) ? JSON.parse(item.customsFileJson) : null
					let goodsNameJson = ''
					let goodsSkuCodeJson = ''
					let wattNumJson = ''
					let trayGoodsNum = ''
					if (this.$isNotEmpty(item.ctnGoodsList)) {
						item.ctnGoodsList.forEach((item, index) => {
							goodsNameJson += index > 0 ? '、' + item.skuName : item.skuName
							goodsSkuCodeJson += index > 0 ? '、' + item.skuCode : item.skuCode
							wattNumJson += index > 0 ? '、' + item.skuWattNum : item.skuWattNum
							trayGoodsNum += index > 0 ? '、' + item.trayGoodsNum : item.trayGoodsNum
						})
					}
					item.goodsNameJson = goodsNameJson
					item.goodsSkuCodeJson = goodsSkuCodeJson
					item.wattNumJson = wattNumJson
					item.trayGoodsNum = trayGoodsNum

				})
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)

				this.loading = false
			} else {
				this.loading = false
			}

		},
		// 导出数据
		exportData() {
			let query = this.handlerQuery()
			this.loading = true
			exportCtnInfoApi(query).then(res => {
				if (res.ok) {
					this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime', 'common')}</span><span class="fs-16">,${this.getZH('handlerRes', 'common')}</span></div>`, this.getZH('handlerExportTips', 'common'), {
						dangerouslyUseHTMLString: true,
						confirmButtonText: this.getZH('theKnow', 'common'),
						callback: () => { }
					})
					this.loading = false
				} else {
					this.loading = false
				}
			})
		},
		/**
		 * 新增编辑
		 */
		edit(operate, id) {
			this.$router.push({ name: `CustomsDeclarationDetail`, params: { operate, id } })
		},
		/**
		 * 重置搜索条件
		 */
		reset() {
			this.$refs.formData.resetFields()
			this.dataTime = []
			this.list()
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
.page-content {
	height: calc(100vh - 335px);
	overflow: auto;
}
.tabs-content {
	// margin-top: -21px;

	overflow: auto;
	padding: 5px;
}
.top-message {
	height: 40px;
	background-color: #f0f9eb;
	padding: 0 20px;
	.top-item {
		width: 33%;
		color: #67c23a;
		font-size: 12px;
	}
}
</style>
