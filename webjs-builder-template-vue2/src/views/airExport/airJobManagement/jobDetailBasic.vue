<template>
  <div class="app-main-inner">
    <el-form :model="job.spaceDTO" label-width="90px" label-position="left" class="page-form">
      <div class="form-module-title ">基础信息</div>
      <div class="form-module-item">
        <div class="item">
          <label>主票编号</label>
          <span>{{job.jobNo}}</span>
        </div>
        <div class="item">
          <label>MAWB NO</label>
          <span>{{job.baseDTO.mblNo}}</span>
        </div>
        <div class="item">
          <label>主单运费条款</label>
          <span>{{job.baseDTO.mblFreightTerm}}</span>
        </div>
      </div>

      <div class="form-module-title">货物信息</div>
      <div class="form-module-item">
        <div class="item">
          <label>件数(委/实)</label>
          <span>{{job.cargoDTO.orderQuantity || '--'}}/{{job.cargoDTO.actualQuantity || '--'}}</span>
        </div>
        <div class="item">
          <label>毛重(委/实)/KGS</label>
          <span>{{job.cargoDTO.orderGrossWeight || '--'}}/{{job.cargoDTO.actualGrossWeight || '--'}}</span>
        </div>
        <div class="item">
          <label>体积(委/实)/CBM</label>
          <span>{{job.cargoDTO.orderVolume || '--'}}/{{job.cargoDTO.actualVolume || '--'}}</span>
        </div>
        <div class="item">
          <label>计费重量(委/实)/M/T</label>
          <span>{{job.cargoDTO.orderChargeableWeight || '--'}}/{{job.cargoDTO.actualChargeableWeight || '--'}}</span>
        </div>
      </div>

      <div class="form-module-title">
        <span>舱位信息</span>
        <el-button type="primary" class="order-btn" size="mini" @click="bookingFn" v-if="job.jobState == 10">订舱</el-button>
        <el-button type="primary" class="order-btn" size="mini" @click="changeShippingSpace" v-if="job.jobState != 100 && job.jobState != 95">改配</el-button>
        <el-button type="primary" class="order-btn" size="mini" @click="atdFn" v-if="job.jobState != 100 && job.jobState != 95">起飞</el-button>
        <el-button type="primary" class="order-btn" size="mini" @click="ataFn" v-if="job.jobState != 100 && job.jobState != 95">到港</el-button>
      </div>
      <div class="form-module-item">
        <div class="item">
          <label>操作模式</label>
          <span>{{job.spaceDTO.blModeDesc}}</span>
        </div>
        <div class="item">
          <label>舱位类型</label>
          <span>{{job.spaceDTO.shippingSpaceTypeDesc}}</span>
        </div>
        <div class="item">
          <label>装货港</label>
          <span>{{job.spaceDTO.pol}}</span>
        </div>
        <div class="item">
          <label>贸易条款</label>
          <span>{{job.spaceDTO.tradeTerm}}</span>
        </div>
        <div class="item">
          <label>航空公司</label>
          <span>{{job.spaceDTO.airlineName}}</span>
        </div>
        <div class="item">
          <label>卸货港</label>
          <span>{{job.spaceDTO.pod}}</span>
        </div>
        <div class="item">
          <label>货好日期</label>
          <span>{{parseTime(job.spaceDTO.erd)}}</span>
        </div>
        <div class="item">
          <label>订舱代理</label>
          <span>{{job.spaceDTO.bookingAgentName}}</span>
        </div>

        <div class="item">
          <label>交货地</label>
          <span>{{job.spaceDTO.receipt}}</span>
        </div>
        <div class="item">
          <label>航班日期</label>
          <span>
             <span v-if="job.spaceDTO.atd">{{parseTime(job.spaceDTO.atd)}}（实际）</span>
             <span v-else-if="job.spaceDTO.etd">{{parseTime(job.spaceDTO.etd)}}（预计）</span>
          </span>
        </div>
        <div class="item">
          <label>起运港代理</label>
          <span>{{job.spaceDTO.spaceDTONo}}</span>
        </div>
        <div class="item">
          <label>航线</label>
          <span>{{job.spaceDTO.routeCode}}</span>
        </div>
        <div class="item">
          <label>到港日期</label>
          <span>
            <span v-if="job.spaceDTO.ata">{{parseTime(job.spaceDTO.ata)}}（实际）</span>
            <span v-else-if="job.spaceDTO.eta">{{parseTime(job.spaceDTO.eta)}}（预计）</span>
          </span>
        </div>
        <div class="item">
          <label>目的港代理</label>
          <span>{{job.spaceDTO.spaceDTONo}}</span>
        </div>
        <div class="item">
          <label>航班号</label>
          <span>{{job.spaceDTO.flightNo}}</span>
        </div>
        <div class="item">
          <label>订舱备注</label>
          <span>{{job.spaceDTO.bookingRemark}}</span>
        </div>
      </div>

      <div class="form-module-title">收发通信息</div>
      <div class="form-module-item shipping-info">
        <div class="item">
          <label>委托托运人</label>
          <span>
            <el-input v-model="job.addressDTO.orderShipperAddress" :rows="8" type="textarea" wrap="off" disabled/>
          </span>
        </div>
        <div class="item">
          <label>委托收货人</label>
          <span>
             <el-input v-model="job.addressDTO.orderConsigneeAddress" :rows="8" type="textarea" wrap="off" disabled/>
          </span>
        </div>
        <div class="item">
          <label>委托通知人</label>
          <span>
              <el-input v-model="job.addressDTO.orderNotifyAddress" :rows="8" type="textarea" wrap="off" disabled/>
          </span>
        </div>
      </div>

      <div class="form-module-title">分票信息</div>
      <div class="form-module-item">
        <el-table :data="job.subOrderList"  border style="width: 100%" >
          <el-table-column property="orderNo" label="订单号" width="150"></el-table-column>
          <el-table-column property="hblNo" label="HAWB NO." width="150"></el-table-column>
          <el-table-column property="pol" label="装货港" width="150"></el-table-column>
          <el-table-column property="pod" label="卸货港" width="150"></el-table-column>
          <el-table-column property="etd" label="开航日期" width="150"></el-table-column>
          <el-table-column property="actualQuantity" label="实际件数" width="100"></el-table-column>
          <el-table-column property="actualGrossWeight" label="实际重量" width="100"></el-table-column>
          <el-table-column property="actualVolume" label="实际体积" width="100"></el-table-column>
          <el-table-column property="actualChargeableWeight" label="实际计费重" width="120"></el-table-column>
          <el-table-column property="operation" label="操作" width="150"  fixed="right">
            <template slot-scope="{ row }">
              <div style="padding: 5px 0;">
                <a class="link-btn" @click="addFn" v-if="job.jobState != 100 && job.jobState != 95">增加</a>
                <a class="link-btn" @click="showDetail(row.id)">查看</a>
                <a class="link-btn" @click="joinFn" v-if="job.jobState != 100 && job.jobState != 95">加入</a>
                <a class="link-btn" @click="removeFn(row.id)" v-if="job.jobState != 100 && job.jobState != 95">移除</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>

    <atd @refresh="refreshFn" :visible="atdFormVisible" @close="atdClose" :jobIds="[job.id]" :orderIds="[]" :atd="job.spaceDTO.atd"></atd>
    <ata @refresh="refreshFn" :visible="ataFormVisible" @close="ataClose" :jobIds="[job.id]" :orderIds="[]" :ata="job.spaceDTO.ata"></ata>
    <join @refresh="refreshFn" v-if="job.id" :visible="joinVisible" @close="joinClose" :job="job" ></join>
    <shipping-space @refresh="refreshFn" :visible="shippingSpaceVisible" @close="shippingSpaceClose" :job="job" v-if="job.id"></shipping-space>
    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />

    <el-dialog
      title="移除小票"
      :visible.sync="removeVisible"
      width="400px">
      <div>确认将“小票单号”从“主票单号”移除？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="removeVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="removeSubmitFn" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="订舱提示"
      :visible.sync="bookingVisible"
      width="400px">
      <div>该订单“{{job.baseDTO.orderNo}}”已通过审核，是否进行订舱并输出订舱文件？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bookingVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="bookingFile" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { joinRemoveAirExportOrderListApi, bookingAirExportJobApi } from '@/api/airExport'
import shippingSpace from '../airOrderManagement/operation/shippingSpaceDialog'
import ata from '../airOrderManagement/operation/ataDialog'
import atd from '../airOrderManagement/operation/atdDialog'
import join from '../airOrderManagement/operation/joinDialog'
import { parseTime } from '@/utils/index'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'

export default {
	name: 'SeaExportOperateBasic',
	components: {
		shippingSpace,
		ata,
		atd,
		join,
		reportListDialog
	},
	props: {
		job: {
			type: Object,
			default() {
				return {
					spaceDTO: {},
					addressDTO: {},
					cargoDTO: {},
					baseDTO: {}
				}
			}
		}
	},
	data() {
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
			removeOrderId: '',
			bookingVisible: false,
			removeVisible: false,
			joinVisible: false,
			atdFormVisible: false,
			ataFormVisible: false,
			shippingSpaceVisible: false
		}
	},

	created() {

	},
	mounted() {

	},
	methods: {
		bookingFn() {
			this.bookingVisible = true
			bookingAirExportJobApi(this.job.id).then(res => {
				if (res && res.ok) {
					this.$message.success('订舱成功！')
					this.$emit('refresh')
				}
			})
		},
		bookingFile() {
			this.bookingVisible = false
			// 根据查询条件进行批量打印
			const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, declareMethod = null, polCode = null, podCode = null } = {}
			const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode }
			this.reportDialog.typeCode = 'BL'
			this.reportDialog.data = { queryConditionJson: queryConditionJson }
			// this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
			this.reportDialog.isShow = true
		},
		parseTime(value) {
			return parseTime(value, '{y}-{m}-{d} {h}:{i}')
		},
		refreshFn() {
			this.$emit('refresh')
		},
		atdFn() {
			this.atdFormVisible = true
		},
		atdClose() {
			this.atdFormVisible = false
		},
		ataFn() {
			this.ataFormVisible = true
		},
		ataClose() {
			this.ataFormVisible = false
		},

		changeShippingSpace() {
			this.shippingSpaceVisible = true
		},
		shippingSpaceClose() {
			this.shippingSpaceVisible = false
		},
		addFn() {
			let id = this.job.id
			this.$router.push({ name: `AirOrderManagementEdit`, query: { id } })
		},
		removeFn(orderId) {
			this.removeOrderId = orderId
			this.removeVisible = true
		},
		removeSubmitFn() {
			let data = {
				jobId: this.job.id,
				orderId: this.removeOrderId
			}
			this.removeVisible = false
			joinRemoveAirExportOrderListApi(data).then(res => {
				if (res && res.ok) {
					this.$message.success('移除成功！')
				}
			})
		},
		joinFn() {
			this.joinVisible = true
		},
		joinClose() {
			this.joinVisible = false
		},
		submitBaseInfo() {

		},
		showDetail(id) {
			this.$router.push({ name: `AirOrderManagementOrderDetail`, query: { id } })
		}
	}
}
</script>

<style scoped lang="less">
.page-form {
	width: 100%;
	max-width: 1200px;
	background: #f5f7fa;
}

.form-module-title {
	font-size: 15px;
	margin-bottom: 10px;
	display: block;
	color: #1890ff;
	padding-left: 10px;
	border-left: 2px solid #1890ff;
	height: 28px;
	line-height: 28px;
}

.form-module-item {
	overflow: hidden;
	padding: 20px;
	background: #fff;
	margin-bottom: 20px;
	box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

	.item {
		width: 33%;
		float: left;
		padding: 0 20px;

		label {
			font-size: 14px;
			margin-right: 20px;
		}
		span {
			font-size: 12px;
		}
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

.order-btn {
	margin-left: 20px;
}

.shipping-info .item label {
	display: block;
}

.shipping-info .item span {
	display: inline-block;
	min-height: 200px;
	width: 100%;
	border-radius: 5px;

	::v-deep .el-textarea.is-disabled .el-textarea__inner {
		background-color: #fff;
		font-size: 12px;
		color: #000;
	}
}

.link-btn {
	color: #1890ff;
	cursor: pointer;
}

.dialog-footer {
	text-align: center;
}
</style>
