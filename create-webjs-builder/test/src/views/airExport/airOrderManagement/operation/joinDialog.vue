<template>
  <el-dialog
    title="加入"
    :visible.sync="visible"
    class="selected-order-form"
    @close="closeFn"
    width="900px">
    <div>
      <el-form class="selected-order-form" ref="multipleForm" label-position="left" :inline="true" :model="filter" label-width="70px">
        <el-form-item label="订单编号:">
          <el-input v-model.trim="filter.orderNo" maxlength="50" size="mini" clearable @keyup.enter.native="list"/>
        </el-form-item>
        <el-form-item label="装货港:">
          <type-select v-model="filter.polCode" type="airport" />
        </el-form-item>
        <el-form-item label="卸货港:">
          <type-select v-model="filter.podCode" type="airport" />
        </el-form-item>
        <el-form-item label="委托单位:">
          <cargo-limited-select
            placeholder="必填项"
            :select-label="filter.customerName"
            :select-value="filter.customerId"
            type="customer"
            style="width: 100%;"
            @set="setCustomerInfo"
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
          />
        </el-form-item>
        <el-form-item label="航班号:">
          <el-input v-model.trim="filter.flightNo" maxlength="50" size="mini" clearable @keyup.enter.native="list"/>
        </el-form-item>

        <div style="float: left;margin-top: 4px;">
          <el-button type="primary" @click="searchFn" size="mini">查询</el-button>
          <el-button type="primary" @click="visible = false" size="mini">重置</el-button>
        </div>
      </el-form>
    </div>
    <el-table :data="dataList" style="width: 100%;" border @selection-change="handleSelectionChange" v-loading="loading" height="300" class="join-table" :close-on-click-modal="false">
      <el-table-column type="selection" width="40" fixed="left"></el-table-column>
      <el-table-column property="orderNo" label="订单编号" width="150"></el-table-column>
      <el-table-column property="hblNo" label="HAWB NO." width="150"></el-table-column>
      <el-table-column property="pod" label="装货港" width="200"></el-table-column>
      <el-table-column property="pol" label="卸货港" width="150"></el-table-column>
      <el-table-column property="etd" label="开航日期" width="150">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.etd)}}</span>
        </template>
      </el-table-column>
      <el-table-column property="actualQuantity" label="实际件数" min-width="100"></el-table-column>
      <el-table-column property="actualGrossWeight" label="实际重量" min-width="100"></el-table-column>
      <el-table-column property="actualVolume" label="实际体积" min-width="100"></el-table-column>
      <el-table-column property="actualChargeableWeight" label="实际计费重" min-width="100"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
import { getJoinAirExportOrderListApi, joinUpdateAirExportOrderListApi } from '@/api/airExport'
import { airLineListApi, getCustomerDropDownListByJob } from '@/api/common'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { parseTime } from '@/utils/index'

export default {
	name: 'BaseInfoDialog',
	components: {
		cargoLimitedSelect
	},
	props: {
		job: {
			type: Object,
			default: function () {
				return {}
			}
		},
		visible: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			loading: false,
			airCustomerMethod: airLineListApi,
			multipleSelection: [],
			dataList: [],
			filter: {
				orderNo: '',
				pol: '',
				polCode: '',
				podCode: '',
				pod: '',
				airlineId: '',
				airlineName: '',
				flightNo: '',
				customerId: '',
				customerName: ''
			}
		}
	},

	watch: {
		visible(val) {
			if (val) {
				this.getList()
			}
		}
	},

	created() {
		this.filter = {
			orderNo: this.job.baseDTO.orderNo,
			pol: this.job.spaceDTO.pol,
			polCode: this.job.spaceDTO.polCode,
			pod: this.job.spaceDTO.pod,
			podCode: this.job.spaceDTO.podCode,
			airlineId: this.job.spaceDTO.airlineId,
			airlineName: this.job.spaceDTO.airlineName,
			flightNo: this.job.spaceDTO.flightNo,
			customerId: '',
			customerName: ''
		}
	},

	methods: {
		parseTime(value) {
			if (!value) {
				return ''
			}
			return parseTime(value, '{y}-{m}-{d} {h}:{i}')
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		searchFn() {
			this.getList()
		},
		async getList() {
			this.loading = true
			const res = await getJoinAirExportOrderListApi(this.filter).catch(() => {
				this.loading = false
			})
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
		closeFn() {
			this.$emit('close')
		},
		submitFn() {
			let ids = []
			this.multipleSelection.forEach(function (v) {
				ids.push(v.id)
			})
			if (ids.length <= 0) {
				this.$message.warning('请先选择一行！')
				return
			}
			let data = {
				jobId: this.job.id,
				ids: ids
			}
			this.closeFn()
			joinUpdateAirExportOrderListApi(data).then(res => {
				if (res && res.ok) {
					this.$emit('refresh')
					this.$message.success('加入成功！')
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

<style scoped lang="less">
.selected-order-form {
	float: left;

	::v-deep .el-form-item {
		width: 28%;
		float: left;
		margin-right: 0;
	}

	::v-deep .el-form-item__content {
		width: 150px;
	}

	::v-deep .el-table th {
		padding: 5px 0;
	}
	::v-deep .el-table td {
		padding: 5px 0 !important;
	}
}
</style>
