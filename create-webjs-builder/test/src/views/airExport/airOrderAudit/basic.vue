<template>
  <div class="app-main-inner">
    <el-form :model="job" label-width="90px" label-position="left" class="page-form">
      <div class="form-module-title ">基本信息</div>
      <div class="form-module-item">
        <el-form-item label="订单编号">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="航空公司">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="订舱代理">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="舱位类型">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="航班">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="贸易条款">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货物中文品名">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货物英文品名">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="订舱备注">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
      </div>

      <div class="form-module-title">询盘信息</div>
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
        <el-form-item label="托盘尺寸">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="预计航班日期">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="委托体积">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="货好日期">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>
        <el-form-item label="询盘备注">
          <el-input v-model="job.jobNo" class="job-no-input" size="mini"/>
        </el-form-item>

        <el-table :data="chargeList" class="charge-list-data">
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
              <span v-else style="padding: 10px 0;display: inline-block">123</span>
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


        <div class="el-form-item">
          <div>委托发货人</div>
          <el-input v-model="job.orderShipperAddress" :rows="7" type="textarea" wrap="off"/>
        </div>
        <div class="el-form-item">
          <div>委托发货人</div>
          <el-input v-model="job.orderShipperAddress" :rows="7" type="textarea" wrap="off"/>
        </div>
        <div class="el-form-item">
          <div>委托发货人</div>
          <el-input v-model="job.orderShipperAddress" :rows="7" type="textarea" wrap="off"/>
        </div>
      </div>

      <div class="operation-btn">
        <el-button type="primary">订舱</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
	name: 'SeaExportOperateBasic',
	components: {},
	props: {},
	data() {
		return {
			chargeList: [{ type: '成交价' }, { type: '销售价' }],
			job: {
				jobNo: ''
			}
		}
	},

	created() {
	},
	mounted() {

	},
	methods: {}
}
</script>

<style scoped lang="less">
.app-main-inner {
	width: 100%;
	height: 100%;
}

.page-form {
	width: 100%;
	max-width: 1200px;
	padding: 20px 10px;
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

.charge-list-data {
	margin: 20px 0;
}
.operation-btn {
	padding: 20px;
	text-align: right;
	background: #fff;
}
</style>
