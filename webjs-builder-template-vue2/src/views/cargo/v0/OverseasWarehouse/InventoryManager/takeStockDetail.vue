<template>
	<div class="page-edit-container full-page detailContent">
		<div class="page-edit-content pd-16" v-loading="loading">
      <div class="info-content">
        <el-row class="label-box">
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("orderStatus") }}：</div>
              <div class="content">{{ detail.orderStatusName }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("takeStockNo") }}：</div>
              <div class="content">{{ detail.cyclecountNo }}</div>
            </div>
          </el-col>
          <el-col :span="8" v-if="operate !== 'submit'">
            <div class="label-item">
              <div class="label">{{ getZH("inventoryTime") }}：</div>
              <div class="content" v-if=" detail.checkTime">{{  detail.checkTime | formatDate('YYYY-MM-DD') }}</div>
              <div class="content" v-else>-</div>
            </div>
          </el-col>
          <el-col :span="8" v-if="operate !== 'submit'">
            <div class="label-item">
              <div class="label">{{ getZH("checkByName") }}：</div>
              <div class="content" v-if=" detail.checkByName">{{  detail.checkByName }}</div>
              <div class="content" v-else>-</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="info-title">{{ getZH("baseInfo") }}</div>
      <div class="info-content">
        <el-row class="label-box">
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("customerName") }}：</div>
              <div class="content">{{ detail.customerName }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("warehouseName") }}：</div>
              <div class="content">{{ detail.warehouseName }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("lspcode") }}：</div>
              <div class="content">{{ detail.lspCode }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("lspWhsCode") }}：</div>
              <div class="content">{{ detail.lspWhsCode }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("plannedInventoryStartTime") }}：</div>
              <div class="content" v-if="detail.planCheckStartTime">{{ detail.planCheckStartTime | formatDate }}</div>
              <div class="content" v-else>-</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("plannedInventoryEndTime") }}：</div>
              <div class="content" v-if="detail.planCheckEndTime">{{ detail.planCheckEndTime | formatDate}}</div>
              <div class="content" v-else>-</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-item">
              <div class="label">{{ getZH("blindFlag") }}：</div>
              <div class="content">{{ detail.blindCount ? 'Y' :'N' }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="info-title">{{ getZH("detailInfo") }}
        <span class="fc-blue ml-10 fs-12 pointer" @click="exportAll" v-if="!isDisabled">{{getZH('exportBtn')}}</span>
        <span class="fc-blue ml-10 fs-12 pointer" @click="importItem" v-if="!isDisabled">{{getZH('batchUpdate')}}</span>
      </div>
      <div class="info-content">
        <el-form :inline="true" ref="filterForm" :model="filterForm" label-width="90px" label-position="left">
          <el-form-item :label='getZH("trayNo")' prop="traceId" class="mb-10">
            <el-input v-model="filterForm.traceId" size="mini" :placeholder="inputZH('trayNo')" @keyup.enter.native="list"></el-input>
          </el-form-item>
          <el-form-item :label='getZH("materielCode")' prop="productCode" class="mb-10">
            <el-input v-model="filterForm.productCode" size="mini" :placeholder="inputZH('materielCode')" @keyup.enter.native="list"></el-input>
          </el-form-item>
          <el-form-item :label='getZH("skuNumber")' prop="skuCode" class="mb-10">
            <el-input v-model="filterForm.skuCode" size="mini" :placeholder="inputZH('skuNumber')" @keyup.enter.native="list"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="0px">
            <el-button type="primary" size="mini" @click="list">{{getZH('searchBtn','common')}}</el-button>
          <el-button  size="mini" @click="reset()">{{getZH('resetBtn','common')}}</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" ref="formData" :model="formData" label-width="90px" label-position="left">
          <lb-table
            border
            :height="scrollTableHeight > 200 ? scrollTableHeight : 200"
            :column="columnData" 
            :data="formData.takeStockTaskDetailList || []" 
            :merge="mergeKey" 
            :pagination="showPage"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[50, 100, 200]"
            :pager-count="5"
            :current-page.sync="pageData.currentPage"
            :total="detailDataList.length"
            :page-size.sync="pageData.pageSize"
            @size-change="handleSizeChange"
            @p-current-change="handleCurrentChange"
            size="mini">
          </lb-table>
          <el-form-item v-if="operate === 'submit'" :label='`${getZH("inventoryTime")}：`' prop="checkTime" class="mb-10" :rules="[{ required: true,message:selectZH('inventoryTime') }]">
            <CommonPicker v-model="formData.checkTime" v-if="!isDisabled" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
            <span v-else>{{formData.checkTime | formatDate('YYYY-MM-DD')}} <span v-if="!formData.checkTime ">-</span></span>
          </el-form-item>
        </el-form>
      </div>
      <BatchUpdate :visible.sync="dialog.visible" :id="activeId" @saved="backList()"></BatchUpdate>
    </div>
		<div class="page-edit-footer">
      <el-button size="mini" :loading="loading" @click="backList()">
        {{ $t("common.closed") }}
      </el-button>
      <el-button size="mini" type="primary" :loading="loading" @click="saveForm('formData')" v-if="operate === 'submit'">
        {{getZH('submitTake') }}
      </el-button>
		</div>
	</div>
</template>

<script lang="jsx">
import getZHMixin from './components/getZHMixin'
import { detailTakeStockApi, getTakeStockDetailListApi, submitTakeStockApi, exportTakeStockApi, importTakeStockApi } from '@/api/inventory'
import BatchUpdate from './components/batchUpdate'
export default {
	name: 'TakeStockDetail',
	mixins: [getZHMixin],
	components: { BatchUpdate },
	data() {
		return {
			detail: {},
			filterForm: {
				productCode: null,
				takeStockTaskId: this.$route.query.id,
				traceId: null,
				skuCode: null,
			},
			activeId: null,
			operate: null,
			mergeKey: ['traceId'],
			currentPage: 1,
			detailDataList: [],
			pageData: {
				pageSize: 50,
				currentPage: 1,
			},
			columnData: [
				{
					label: this.getZH('trayNo'),
					prop: 'traceId',
					showOverflowTooltip: true,
					width: 140,
					fixed: 'left'
				},

				{
					label: this.getZH('wmsCode'),
					prop: 'location',
					width: 90,
					showOverflowTooltip: true,
					fixed: 'left'
				},
				{
					label: this.getZH('shipper'),
					prop: 'ownerName',
					showOverflowTooltip: true,
					width: 130,
					fixed: 'left'
				},
				{
					label: this.getZH('materielCode'),
					prop: 'productCode',
					showOverflowTooltip: true,
					width: 150,
					fixed: 'left'
				},
				{
					label: this.getZH('unit'),
					prop: 'uom',
					showOverflowTooltip: true,
					width: 50
				},
				{
					label: this.getZH('wmsQuantity'),
					prop: 'quantity',
					showOverflowTooltip: true,
					width: 70
				},

				{
					label: this.getZH('takePictureFlag'),
					width: 50,
					showOverflowTooltip: true,
					render: (h, { row }) => <div>{row.photoFlag ? 'Y' : 'N'}</div>
				},
				{
					label: this.getZH('santoFlag'),
					width: 65,
					showOverflowTooltip: true,
					render: (h, { row }) => <div>{row.pickFlag ? 'Y' : 'N'}</div>
				},
				{
					label: this.getZH('damageFlag'),
					width: 50,
					showOverflowTooltip: true,
					render: (h, { row }) => <div>{row.damageFlag ? 'Y' : 'N'}</div>
				},
				{
					label: this.getZH('massState'),
					width: 50,
					showOverflowTooltip: true,
					render: (h, { row }) => <div>{row.massStatus}</div>
				},
				{
					label: this.getZH('SKUCategory'),
					prop: 'skuCode',
					minWidth: 140,
					showOverflowTooltip: true,
					showOverflowTooltip: true,
				},
				{
					label: this.getZH('groundingNo'),
					prop: 'batchNo',
					minWidth: 140,
					showOverflowTooltip: true,
				},
				{
					label: this.getZH('justInTimeInventory'),
					prop: 'currentStockQuantity',
					minWidth: 110,
					showOverflowTooltip: true,
				},
				{
					label: this.getZH('currentMassState'),
					width: 65,
					showOverflowTooltip: true,
					render: (h, { row }) => <div>{row.currentStockMassStatus}</div>
				},
				{
					label: this.getZH('currentDamageFlag'),
					width: 65,
					showOverflowTooltip: true,
					render: (h, { row }) => <div>{row.currentStockDamageFlag}</div>
				},
				{
					label: this.getZH('currentDamageQuantity'),
					width: 65,
					showOverflowTooltip: true,
					prop: 'currentStockDamageQuantity',
					render: (h, { row }) => <div>{Number(row.currentStockDamageQuantity)}</div>
				},
				{
					label: this.getZH('actualInventoryQuantity'),
					minWidth: 140,
					renderHeader: (h, scope) => {
						return <span><span class="fc-red mr-4">*</span>{scope.column.label}</span>
					},
					render: (h, { row, $index }) => this.isDisabled ? <span>{row.stockQuantity} {this.$isNotEmpty(row.stockQuantity) && Number(row.stockQuantity) !== Number(row.currentStockQuantity) ? <el-tooltip effect="dark" content={this.getZH('diffStockTips')} placement="top-start"><i class="el-icon-warning fc-yellow"></i></el-tooltip> : null}</span> : <el-form-item label="" label-width="0px" prop={`takeStockTaskDetailList[${$index}].stockQuantity`} rules={[{ required: this.$isNotEmpty(row.currentStockQuantity) }]} class="mb-0">
						<el-input type="number" size="mini" placeholder={this.$t('common.placeholder')} value={row.stockQuantity} onInput={(val) => { row.stockQuantity = val }}></el-input>
					</el-form-item>
				},
				{
					label: this.getZH('actualMassState'),
					minWidth: 140,
					renderHeader: (h, scope) => {
						return <span><span class="fc-red mr-4">*</span>{scope.column.label}</span>
					},
					render: (h, { row, $index }) => this.isDisabled ? <span>{row.stockMassStatus} {this.$isNotEmpty(row.stockMassStatus) && String(row.stockMassStatus) !== String(row.currentStockMassStatus) ? <el-tooltip effect="dark" content={this.getZH('diffMassTips')} placement="top-start"><i class="el-icon-warning fc-yellow"></i></el-tooltip> : null}</span> : <el-form-item label="" label-width="0px" prop={`takeStockTaskDetailList[${$index}].stockMassStatus`} rules={[{ required: this.$isNotEmpty(row.currentStockQuantity) }]} class="mb-0">
						<el-select placeholder={this.$t('common.selectPlaceholder')} size="mini" value={row.stockMassStatus} onInput={(val) => { row.stockMassStatus = val }} onChange={(val) => { row.stockMassStatus = val }}>
							<el-option label='OK' value='OK'></el-option>
							<el-option label='NG' value='NG'></el-option>
							<el-option label='TBD' value='TBD'></el-option>
						</el-select>
					</el-form-item>
				},
				{
					label: this.getZH('actualCurrentDamageFlag'),
					minWidth: 140,
					renderHeader: (h, scope) => {
						return <span><span class="fc-red mr-4">*</span>{scope.column.label}</span>
					},
					render: (h, { row, $index }) => this.isDisabled ? <span>{row.stockDamageFlag}</span> : <el-form-item label="" label-width="0px" prop={`takeStockTaskDetailList[${$index}].stockDamageFlag`} rules={[{ required: this.$isNotEmpty(row.currentStockQuantity) }]} class="mb-0">
						<el-select placeholder={this.$t('common.selectPlaceholder')} size="mini" value={row.stockDamageFlag} onInput={(val) => { row.stockDamageFlag = val }} onChange={(val) => { row.stockDamageFlag = val }}>
							<el-option label='Y' value='Y'></el-option>
							<el-option label='N' value='N'></el-option>
						</el-select>
					</el-form-item>
				},
				{
					label: this.getZH('actualDamageQuantity'),
					minWidth: 140,
					renderHeader: (h, scope) => {
						return <span><span class="fc-red mr-4">*</span>{scope.column.label}</span>
					},
					render: (h, { row, $index }) => this.isDisabled ? <span>{row.stockDamageQuantity}{this.$isNotEmpty(row.stockDamageQuantity) && Number(row.stockDamageQuantity) !== Number(row.currentStockDamageQuantity) ? <el-tooltip effect="dark" content={this.getZH('diffDamageTips')} placement="top-start"><i class="el-icon-warning fc-yellow"></i></el-tooltip> : null}</span> : <el-form-item label="" label-width="0px" prop={`takeStockTaskDetailList[${$index}].stockDamageQuantity`} rules={[{ required: this.$isNotEmpty(row.currentStockQuantity) }]} class="mb-0">
						<el-input size="mini" type="number" placeholder={this.$t('common.placeholder')} value={row.stockDamageQuantity} onInput={(val) => { row.stockDamageQuantity = val }}></el-input>
					</el-form-item>
				},
			],
			formData: {
				id: null,
				checkTime: null,
				takeStockTaskDetailList: []
			},
			loading: true,
		}
	},
	created() {
		this.operate = this.$route.query.operate
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.pageData.currentPage = 1
			this.getDetail()
		}
	},
	computed: {
		isDisabled() {
			return this.operate === 'view'
		},
		scrollTableHeight() {
			return document.documentElement.clientHeight - (this.showPage ? 550 : 500)
		},
		showPage() {
			return this.detailDataList.length > 100
		},
	},
	methods: {
		createData(validate = false, isInit = false) {
			this.loading = true
			//前端分页
			this.detailDataList.forEach((item, index) => {
				let currentNum = index + 1
				if (currentNum <= this.pageData.pageSize) {
					this.$set(item, 'currentPage', 1)
				} else if (currentNum % this.pageData.pageSize === 0) {
					let currentPage = parseInt(currentNum / this.pageData.pageSize)
					this.$set(item, 'currentPage', currentPage)
				} else {
					let currentPage = Math.ceil(currentNum / this.pageData.pageSize)
					this.$set(item, 'currentPage', currentPage)
				}
			})
			this.formData.takeStockTaskDetailList = this.detailDataList.filter(item => item.currentPage === this.pageData.currentPage)
			let timer = parseInt(Math.floor(this.detailDataList.length / 500) * 1000)
			setTimeout(() => {
				this.loading = false
				if (validate) {
					this.$refs.formData.validate(valid => {
						if (!valid) {
							this.mixinsFormScrollIntoView()
							return false
						}
					})
				}
			}, this.detailDataList.length > 500 && isInit ? timer : 300)
		},
		handleSizeChange(val) {
			this.pageData.currentPage = 1
			this.pageData.pageSize = val
			this.createData()
		},
		handleCurrentChange() {
			this.createData()
		},
		/**
		 * 出库单详情
		 */
		async getDetail() {
			this.loading = true
			let res = await detailTakeStockApi(this.$route.query.id)
			if (res.ok) {
				this.detail = res.content || {}
				this.$copyProps(this.formData, res.content)
				this.list()
			} else {
				this.detail = {}
			}
		},
		async list() {
			this.loading = true
			let res = await getTakeStockDetailListApi(this.filterForm)
			if (res.ok) {
				this.detailDataList = res.content
				this.formData.takeStockTaskDetailList = []
				this.pageData.currentPage = 1
				this.createData(false, true)
			}
			this.loading = false
		},
		//处理要保存的数据List
		hanlerSaveDataList() {
			let arr = []
			this.detailDataList.forEach(item => {
				let itemData = {
					batchId: null,
					batchNo: null,
					id: null,
					skuCode: null,
					stockDamageFlag: null,
					stockDamageQuantity: null,
					stockMassStatus: null,
					stockQuantity: null,
					takeStockTaskId: null,
					currentStockQuantity: null,
					currentStockMassStatus: null,
					currentStockDamageFlag: null,
					currentStockDamageQuantity: null,
					containerNo: null,
					sn: null,
				}
				this.$copyProps(itemData, item)
				arr.push(itemData)
			})
			return arr
		},
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				let emptyData = this.detailDataList.find(item => (this.$isEmpty(item.stockQuantity) || this.$isEmpty(item.stockMassStatus) || this.$isEmpty(item.stockDamageFlag) || this.$isEmpty(item.stockDamageQuantity)) && this.$isNotEmpty(item.currentStockQuantity))
				if (this.$isNotEmpty(emptyData)) {
					this.pageData.currentPage = emptyData.currentPage
					this.createData(true)
					return
				}
				let saveForm = {
					id: this.formData.id,
					checkTime: this.formData.checkTime,
					takeStockTaskDetailList: this.hanlerSaveDataList(),
				}
				this.loading = true
				submitTakeStockApi(saveForm).then(res => {
					if (res.ok) {
						// 添加日志 记录数据
						this.logBtnSend({
							origin: this.logOrigin.SYSTEM_OPERATION,
							logCode: this.pointOvl.OVL_TAKE_STOCK_SUBMIT,
							serviceName: this.logServiceName.OVL_SERVICE,
							businessType: this.pointOvl.OVL_TAKE_STOCK_SUBMIT,
							content: {
								id: this.detail.id
							}
						})
						this.$message.success(this.$t('common.saveSuccess'))
						this.loading = false
						this.backList()
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		},
		/**
		 * 批量导出
		 */
		async exportAll() {
			this.loading = true
			const res = await exportTakeStockApi({ id: this.detail.id })
			if (res.ok) {
				// 添加日志 记录数据
				this.logBtnSend({
					origin: this.logOrigin.SYSTEM_OPERATION,
					logCode: this.pointOvl.OVL_TAKE_STOCK_EXPORT,
					serviceName: this.logServiceName.OVL_SERVICE,
					businessType: this.pointOvl.OVL_TAKE_STOCK_EXPORT,
					content: {
						id: this.detail.id
					}
				})
				this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime', 'common')}</span><span class="fs-16">,${this.getZH('handlerRes', 'common')}</span></div>`, this.getZH('handlerExportTips', 'common'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.getZH('theKnow', 'common'),
					callback: () => {
					}
				})
			}
			this.loading = false
		},
		/**
 * 批量更新
 */
		importItem() {
			if ((this.detail.orderStatus === 1 || this.detail.orderStatus === 3) && this.detail.importStatus !== 1) {
				this.activeId = this.detail.id
				this.dialog.visible = true
			} else {
				this.$message.error(this.getZH('selectError'))
				return
			}
		},
		/**
	* 返回列表
	*/
		backList() {
			this.$router.go(-1)
			this.$store.dispatch('tagsView/delView', this.$route)
		},
		reset() {
			this.$refs.filterForm.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="scss">
.detailContent {
	background-color: #fff;
	.info-title {
		width: 100%;
		height: 22px;
		line-height: 22px;
		font-size: 14px;
		position: relative;
		margin-bottom: 4px;
		padding-left: 30px;
		color: #666;
		font-weight: 600;
		&::before {
			position: absolute;
			content: "";
			width: 2px;
			top: 11px;
			bottom: 11px;
			left: 20px;
		}
	}
	.info-content {
		background: #fff;
		padding: 0px 30px;
		.orderContent {
			font-size: 14px;
			color: #61655c;
		}
	}
	.label-box {
		.label-item {
			line-height: 22px;
			margin-bottom: 4px;
			display: flex;
			align-self: center;
			.label {
				color: #828282;
				font-size: 14px;
				width: 130px;
			}
			.content {
				font-size: 14px;
				margin-left: 10px;
				color: #5f5f5f;
			}
		}
	}
}
</style>
