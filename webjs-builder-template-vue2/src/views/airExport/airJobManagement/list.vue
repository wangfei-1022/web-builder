<!-- <template>
  <div class="air-page" v-loading="loading" style="padding: 20px;">
    <topSearchItems :show-single-input="false" class="mb-20">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px">
            <el-form-item label="订单编号:">
              <el-input v-model.trim="filter.orderNo" maxlength="50" size="mini" clearable @keyup.enter.native="getList"/>
            </el-form-item>
            <el-form-item label="装货港:">
              <type-select v-model="filter.polCode" type="airport"  clearable @change="getList"/>
            </el-form-item>
            <el-form-item label="卸货港:">
              <type-select v-model="filter.podCode" type="airport"  clearable @change="getList"/>
            </el-form-item>
            <el-form-item label="委托单位:">
              <cargo-limited-select
                placeholder=""
                :select-label="filter.customerName"
                :select-value="filter.customerId"
                type="customer"
                style="width: 100%;"
                @set="setCustomerInfo"
                clearable
                @change="getList"
              />
            </el-form-item>
            <el-form-item label="航空公司:">
              <cargo-limited-select
                placeholder=""
                :method="airCustomerMethod"
                :select-label="filter.airlineName"
                :select-value="filter.airlineId"
                type="customer"
                style="width: 100%;"
                @set="setAirCustomerInfo"
                clearable
                @change="getList"
              />
            </el-form-item>
            <el-form-item label="订单状态:">
              <el-select v-model="filter.orderState" placeholder="请选择" size="mini" clearable @change="getList">
                <el-option label="全部" value=""></el-option>
                <el-option label="待订舱" value="10"></el-option>
                <el-option label="待制单" value="30"></el-option>
                <el-option label="已收货" value="95"></el-option>
                <el-option label="已取消" value="100"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="MAWB NO:">
              <el-input v-model.trim="filter.mblNo" maxlength="50" placeholder="" size="mini" clearable @keyup.enter.native="getList"/>
            </el-form-item>
            <el-form-item label="HAWB NO:">
              <el-input v-model.trim="filter.hblNo" maxlength="50" placeholder="" size="mini" clearable @keyup.enter.native="getList"/>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="getList">{{ $t('table.search') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="reset()">{{ $t('table.resetColumns') }}</el-button>
      </div>
    </topSearchItems>

    <div style="padding: 0 0 10px 0;">
      <el-button type="primary" size="mini" @click="changeShippingSpace()">改配</el-button>
      <el-button type="primary" size="mini" @click="atdFn()">起飞</el-button>
      <el-button type="primary" size="mini" @click="ataFn()">到港</el-button>
    </div>

    <el-table
      size="mini"
      :data="tableData"
      :height="tableHeight"
      style="width: 100%;"
      row-key="id"
      border
      lazy
      :load="load"
      @selection-change="handleSelectionChange"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        fixed="left"
        type="selection"
        width="40" />
      <el-table-column
        prop="jobNo"
        label="主单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="blModeDesc"
        label="操作模式"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mblNo"
        label="MAWB NO"
        width="180">
      </el-table-column>
      <el-table-column
        prop="hblNo"
        label="HAWB NO"
        width="180">
      </el-table-column>
      <el-table-column
        prop="jobStateDesc"
        label="订单状态"
        width="180">
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="委托单位"
        width="220">
      </el-table-column>
      <el-table-column
        prop="pol"
        label="装货港"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pod"
        label="卸货港"
        width="180">
      </el-table-column>
      <el-table-column
        prop="airlineName"
        label="航空公司"
        width="220">
      </el-table-column>
      <el-table-column
        prop="actualQuantity"
        label="件数(预计/实际)"
        width="180">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.orderQuantity || '--' }}</span>/
            <span>{{ scope.row.actualQuantity || '--' }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actualGrossWeight"
        label="毛重(预计/实际)"
        width="180">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.orderGrossWeight || '--' }}</span>/
            <span>{{ scope.row.actualGrossWeight || '--' }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actualVolume"
        label="体积(预计/实际)"
        width="180">
        <template slot-scope="scope">
          <span>
            <span>{{ scope.row.orderVolume || '--' }}</span>/
            <span>{{ scope.row.actualVolume || '--' }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="operationBtn"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <a class="link" @click="showDetailFn(scope.row)">查看</a>
          <a class="link" @click="bookingFn(scope.row)" v-if="scope.row.jobState == 10">订舱</a>
          <a class="link" @click="takeDelivery(scope.row)" v-if="!scope.row.isChildren && scope.row.jobState != 100 && scope.row.jobState != 95 && scope.row.jobState != 10">收货</a>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="getList"/>

    <atd @refresh="getList" :visible="atdFormVisible" @close="atdClose" :jobIds="selectedIds" :orderIds="[]"></atd>
    <ata @refresh="getList" :visible="ataFormVisible" @close="ataClose" :jobIds="selectedIds" :orderIds="[]"></ata>
    <shipping-space-batch @refresh="getList" :visible="shippingSpaceVisible" @close="shippingSpaceClose" :jobIds="selectedIds" :orderIds="[]"></shipping-space-batch>
    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />

    <el-dialog
      title="收货"
      :visible.sync="takeDeliveryVisible"
      width="400px">
      <div>提交后主票和小票的业务信息将锁定不允许修改，是否还进行提交操作？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="takeDeliveryVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitDeliveryFn" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="订舱提示"
      :visible.sync="bookingVisible"
      width="400px">
      <div>该订单“{{activeRow.jobNo}}”已通过审核，是否进行订舱并输出订舱文件？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bookingVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="bookingFile" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import searchItem from '@/components/Cargo/Dmn/searchItem'
import { getGridSelectedIds } from '@/utils/gridChoose'
import { passRelease } from '@/api/release'
import { getAirExportJobListApi, getAirExportJobChildrenListApi, deliveryAirExportJobListApi, bookingAirExportJobApi } from '@/api/airExport'
import shippingSpaceBatch from '../airOrderManagement/operation/shippingSpaceBatchDialog'
import ata from '../airOrderManagement/operation/ataDialog'
import atd from '../airOrderManagement/operation/atdDialog'
import { airLineListApi, getCustomerDropDownListByJob } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'


export default {
	name: 'AirJobManagement',
	components: {
		shippingSpaceBatch,
		ata,
		atd,
		searchItem,
		reportListDialog,
		cargoLimitedSelect
	},
	data() {
		const defaultFilter = {
			airlineId: '',
			customerId: '',
			mblNo: '',
			hblNo: '',
			orderState: '',
			orderNo: '',
			podCode: '',
			polCode: '',
			pageSize: 50,
			pageNum: 1,
			gridApi: null
		}

		return {
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
			airCustomerMethod: airLineListApi,
			loading: false,
			bookingVisible: false,
			shippingSpaceVisible: false,
			atdFormVisible: false,
			ataFormVisible: false,
			takeDeliveryVisible: false,
			defaultFilter: defaultFilter,
			filter: this.$extends({}, defaultFilter),
			total: 0,
			tableData: [],
			selectedIds: [],
			multipleSelection: [],
			activeRow: {},
			tableHeight: document.documentElement.clientHeight - 400
		}
	},

	created() {
		/** 控制table的高度 */
		window.onresize = () => {
			this.updateTableHeight()
		}
		this.getList()
	},
	mounted() {

	},
	methods: {
		bookingFn(row) {
			this.activeRow = row
			this.bookingVisible = true
			bookingAirExportJobApi(row.id).then(res => {
				if (res && res.ok) {
					this.$message.success('订舱成功！')
					this.getList()
				}
			})
		},
		bookingFile(row) {
			this.bookingVisible = false
			// 根据查询条件进行批量打印
			const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = {}
			const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
			this.reportDialog.typeCode = 'BL'
			this.reportDialog.data = { queryConditionJson: queryConditionJson }
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true
		},
		updateTableHeight() {
			const offsetHei = document.documentElement.clientHeight
			const removeHeight = 400
			this.tableHeight = offsetHei - removeHeight
		},
		atdFn() {
			if (this.selectedIds.length <= 0) {
				this.$message.warning('请先选择一行！')
				return
			}
			this.atdFormVisible = true
		},
		atdClose() {
			this.atdFormVisible = false
		},
		ataFn() {
			if (this.selectedIds.length <= 0) {
				this.$message.warning('请先选择一行！')
				return
			}
			this.ataFormVisible = true
		},
		ataClose() {
			this.ataFormVisible = false
		},

		changeShippingSpace() {
			if (this.selectedIds.length <= 0) {
				this.$message.warning('请先选择一行！')
				return
			}
			if (this.selectedIds.length > 1) {
				// 装货港、卸货港、航班号
				let podCode = this.multipleSelection[0].podCode
				let polCode = this.multipleSelection[0].polCode
				let flightNo = this.multipleSelection[0].flightNo
				let flag = true
				this.multipleSelection.forEach(function (v) {
					if (v.podCode != podCode || v.polCode != polCode || v.flightNo != flightNo) {
						flag = false
					}
				})

				if (!flag) {
					this.$message.warning('装货港、卸货港、航班号，不一致，不能进行批量改配！')
					return
				}
			}
			this.shippingSpaceVisible = true
		},
		shippingSpaceClose() {
			this.shippingSpaceVisible = false
		},
		reset() {
			this.filter = this.$extends({}, this.defaultFilter)
			this.getList()
		},
		getList() {
			this.tableData = []
			this.loading = true
			getAirExportJobListApi(this.filter).then(res => {
				if (res && res.ok) {
					res.content.list.forEach(function (v) {
						v.hasChildren = true
					})
					this.tableData = res.content.list
					this.total = Number(res.content.total)
				}
				this.loading = false
			})
		},
		load(tree, treeNode, resolve) {
			getAirExportJobChildrenListApi(tree.id).then(res => {
				let arr = []
				if (res.content) {
					res.content.forEach(function (v, index) {
						v.oldId = v.id
						v.id = index + new Date().getTime()
						v.isChildren = true
						arr.push(v)
					})
				}
				resolve(arr)
			})
		},
		showDetailFn(row) {
			if (row.isChildren) {
				this.$router.push({
					name: `AirOrderManagementOrderDetail`, query: {
						id: row.oldId
					}
				})
			} else {
				this.$router.push({ name: `AirJobManagementJobDetail`, query: { id: row.id } })
			}
		},
		handleSelectionChange(val) {
			let arr = []
			val.forEach(function (v) {
				arr.push(v.id)
			})
			this.selectedIds = arr;
			this.multipleSelection = val;
		},
		takeDelivery(row) {
			this.activeRow = row
			this.takeDeliveryVisible = true
		},
		submitDeliveryFn() {
			this.takeDeliveryVisible = false
			deliveryAirExportJobListApi(this.activeRow.id).then(res => {
				if (res && res.ok) {
					this.getList()
					this.$message.success('收货成功！')
				}
			})
		},
		setCustomerInfo(customer) {
			this.filter.customerId = customer.id
		},
		setAirCustomerInfo(customer) {
			this.filter.airlineId = customer.id
		}
	}
}
</script>
<style lang="scss" scoped>
@import "../styles/table.scss";

.air-page {
	::v-deep .el-table--border th {
		background-color: #f5f7f7;
	}

	::v-deep .el-table tr:nth-child(odd) {
		background-color: #fffffd;
	}

	::v-deep .el-table tr:nth-child(even) {
		background-color: #f3f4f9;
	}
	::v-deep .el-table--mini th {
		padding: 3px 0;
	}
	::v-deep .el-table--mini td {
		padding: 3px 0;
	}
}

.tab-list {
	margin-bottom: 10px;
}

.tab-list .tab-item {
	display: inline-block;
	margin: 10px 0px;
	font-size: 15px;
	padding: 0px 35px;
	border-right: 1px solid #aaa;
}

.link {
	color: #1890ff;
}

.el-badge__content_status {
	::v-deep .el-badge__content {
		background: none;
		color: #000;
	}
}
</style> -->
