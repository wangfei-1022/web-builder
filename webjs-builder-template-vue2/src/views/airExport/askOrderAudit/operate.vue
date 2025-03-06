<template>
  <div class="app-main-inner">
    <el-form :model="job" label-width="90px" label-position="left" class="page-form">
      <div class="form-module-title">询盘基本信息</div>
      <div class="form-module-item">
        <el-form-item label="询盘流水号">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="装货港">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托件数">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托单位">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="卸货港">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托毛重">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货物类型">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="预计航班日期">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托体积">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="托盘尺寸">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货好日期">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="询盘备注">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>

      </div>

      <div class="form-module-item">
        <el-row>
          <el-checkbox v-model="job.jobNo" label="接受询盘"></el-checkbox>
          <el-checkbox v-model="job.jobNo" label="拒绝询盘"></el-checkbox>
        </el-row>
        <el-form-item label="舱位类型">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="航空公司">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="订舱代理">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="航班号">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>

        <el-table :data="chargeList">
          <el-table-column
            property="type"
            label="费用项"
            width="80"
          >
          </el-table-column>
          <el-table-column
            property="index"
            label="空运费"
            type="index"
            width="120"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit" style="padding: 10px 0;display: inline-block">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="date"
            label="燃油附加费"
            width="120"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="systemBarCode"
            label="操作费"
            width="120"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="stockAvailable"
            label="提单费"
            width="150"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="quantity"
            label="信息费"
            width="150"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="length"
            label="舱单费"
            min-width="150"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="width"
            label="报关费"
            min-width="150"
          >
            <template slot-scope="{ row }">
              <span v-if="row.isEdit">
                <el-input size="mini" v-model="row.quantity"></el-input>
              </span>
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="form-module-item">
        <span>电子文件</span>
      </div>

      <div class="operation-btn">
        <el-button type="primary">审核确认</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import ElectronicFile from '../components/electronicFile'
import { toSimulateRefreshingCurrentActiveTag, toSimulateRefreshingListBackingTo } from '@/utils'

import {
	getCustomerContactList, getSeaExportJob, getTruckList, getContainerList,
	getPreManifestList, getManifestList, getLadingNoList, getHblTabInfo, getMblTabInfo,
	getWarehouseDetail, getWarehouseInRecordList, getJobPanorama, getJobPanoramaProfit,
	getJobPanoramaState, getDangerousCargo, getJobNoListRowDataOfConsol,
	getSelectableSlave, appendSlave, removeSlave, createSlave, deleteSlave,
	getElectronicFile, fillClipboard, getClipboardConfig, saveClipboardConfig,
	deleteJob, cancelJob, getConfigParams
} from '@/api/seaExport'
import { batchSubmitJob, batchRejectSubmitJob, batchAcceptJob } from '@/api/chargeTabAtJob'
import { getTerminologyListByType } from '@/api/terminology'
import { deepCloneMethod } from '@/utils'

export default {
	name: 'SeaExportOperate',
	components: {
		ElectronicFile
	},
	data() {
		return {
			loading: false,
			job: {
				electronicFile: {}
			},
			chargeList: [{
				type: '成本价',
				isEdit: true
			}, {
				type: '销售价',
				isEdit: true
			}],
			nonsense: '',
			activeTabName: 'Basic',
			jobNoHistoryReversed: []
		}
	},
	activated() {

	},
	beforeMount() {

	},
	methods: {
		handleTabClick() {
		},
		goTo() {
		},
		jump() {
		},
		toShowAbstract() {
		},
		backToList() {
		},
		reloadJob() {
		},
		saveItem() {
		},
		editItem() {
		},
		cancel() {
		}
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";
.app-main-inner {
	width: 100%;
	height: 100%;
}

.page-form {
	width: 100%;
	max-width: 1200px;
	padding: 20px;
	background: #f5f7fa;
}

.form-module-title {
	font-size: 16px;
	margin-bottom: 10px;
	display: block;
	color: #1890ff;
	padding-left: 10px;
	border-left: 2px solid #1890ff;
}

.form-module-item {
	overflow: hidden;
	padding: 20px;
	background: #fff;
	margin-bottom: 20px;

	::v-deep .el-form-item {
		width: 33%;
		float: left;
		padding: 0 20px;
	}
}

.operation-btn {
	padding: 20px;
	text-align: right;
	background: #fff;
}
</style>
