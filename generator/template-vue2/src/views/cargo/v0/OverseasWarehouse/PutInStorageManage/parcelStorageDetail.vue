<template>
	<div class="page-edit-container">
		<el-form label-width="110px" label-position="left" :model="formData"	ref="formData">
			<div class="page-edit-content" v-loading="loading">
        <el-tabs	type="border-card" class="border-card" @tab-click="handClick" v-model="borderName">
          <el-tab-pane :label="getZH('detail','outInStorageManage')" name="0">
            <div class="pd-16">
              <div class="info-title mb-10">{{ getZH("baseInfo") }}</div>
              <el-row :gutter="20">
                 <el-col :span="12">
                  <el-form-item :label="getZH('customerName')">
                    <el-input size="mini" v-model="formData.customerName" disabled ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('orderInboundNo')">
                    <el-input  size="mini" v-model="formData.orderInboundNo" disabled></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item :label="getZH('orderState')">
                    <el-input
                      size="mini"
                      v-model="formData.orderStateName"
                      placeholder="-"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('warehouse')">
                    <el-input size="mini" v-model="formData.warehouseNameCountry" disabled ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('deliveryMethod')">
                    <el-input  size="mini" v-model="formData.deliverModeTypeName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('memberNo')">
                    <el-input  size="mini" v-model="formData.customerSystemNo" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item	:label="getZH('expectArriveWarehouseTime')" prop="expectArriveWarehouseTime">
                    <CommonPicker disabled pickerFormat="yyyy-MM-dd HH:mm" pikcerType="datetime" :parentDate="formData.expectArriveWarehouseTime" v-model="formData.expectArriveWarehouseTime" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="getZH('remark')">
                    <el-input size="mini" v-model="formData.remarks" type="textarea" placeholder="-" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="info-title mb-10">{{ getZH("parcelInfo") }}</div>
               <div class="totalBox">
                <div class="flex-box total-item">
                  <span>{{ getZH("parcelQuantity") }}：</span>
                  {{ formData.boxList.length }}
                </div>
              </div>
              <el-table :data="formData.boxList" style="width: 100%" size="mini" border stripe class="mb-20">
                <el-table-column type="expand">
                    <template slot-scope="{row}">
                        <div v-for="(item, index) in row.boxGoodsList" :key="index" class="box-goods">
                            <div class="box-goods-item"><span >{{getZH("skuCode")}}：</span>{{ item.skuCode }}</div>
                            <div class="box-goods-item"><span >{{getZH("name")}}：</span>{{ item.name }}</div>
                            <div class="box-goods-item"><span >{{getZH("enName")}}：</span>{{ item.englishName }}</div>
                            <div class="box-goods-item"><span >{{getZH("quantity")}}：</span>{{ item.quantity }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="130" :label="getZH('parcelNo')" prop="boxNo"></el-table-column>
                <el-table-column minWidth="110" :label="`${getZH('parcelLength')}（CM）`" prop="lenght"></el-table-column>
                <el-table-column minWidth="110" :label="`${getZH('parcelWidth')}（CM）`" prop="width"></el-table-column>
                <el-table-column minWidth="110" :label="`${getZH('parcelHeight')}（CM）`" prop="height"></el-table-column>
                <el-table-column minWidth="110" :label="`${getZH('parcelWeight')}（KG）`" prop="weight"></el-table-column>
                <el-table-column width="100" :label="getZH('SKUTypes')" prop="skuKindQuantity"></el-table-column>
                <el-table-column width="100" :label="getZH('SKUTotal')" prop="skuQuantity"></el-table-column>
              </el-table>
              <div class="info-title mb-10">{{ getZH("goodsInformation") }}</div>
              <div class="totalBox">
                <div class="flex-box">
                  <div class="flex-box total-item">
                    <span>{{ getZH("skuSpecies") }}：</span>
                    {{ formData.skuKindQuantity }}
                  </div>
                  <div class="flex-box total-item">
                    <span>{{ getZH("skuTotal") }}：</span>
                    {{ formData.skuQuantity }}
                  </div>
                  <div class="flex-box total-item">
                    <span>{{ getZH("totalVolume") }}：</span>
                    {{ formData.totalVolume }}（CBM）
                  </div>
                </div>
                <div class="flex-box">
                  <div class="flex-box total-item">
                    <span>{{ getZH("shelvesType") || "-" }}：</span>
                    {{
                      totalNumber.shelvesTypeNumber
                        ? totalNumber.shelvesTypeNumber
                        : "-"
                    }}
                  </div>
                  <div class="flex-box total-item">
                    <span>{{ getZH("shelvesTotal") || "-" }}：</span>
                    {{ totalNumber.groundingQuantity || "-" }}
                  </div>
                  <div class="flex-box total-item">
                    <span>{{ getZH("shelvesVolumeTotal") }}：</span>
                    {{
                      formData.realTotalVolume
                        ? formData.realTotalVolume + "（CBM）"
                        : "-"
                    }}
                  </div>
                </div>
              </div>
              <lb-table stripe :column="columnData1" :data="formData.orderInboundGoodsList" border></lb-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="getZH('trajectoryInfo')" name="2">
            <div class="tabs-content">
              <el-row :gutter="20">
                <el-col  :xs="24" :sm="24" :lg="12">
                  <el-table :data="formData.lastLegList" border style="width: 100%" size="mini">
                    <el-table-column  :label="getZH('TheSerialNumber')" width="60">
                      <template slot-scope="{$index}">{{$index + 1}}</template>
                    </el-table-column>
                    <el-table-column min-width="110" :label="`${getZH('carrier')}`" prop="carrierName" />
                    <el-table-column min-width="110" :label="`${getZH('logisticsNo')}`" prop="shipmentNo" />
                    <el-table-column  :label="getZH('operation','common')" width="90">
                      <template slot-scope="{ row }">
                        <el-button type="text" size="mini" @click="getTrackItem(row)">{{getZH('trajectoryDetail')}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <div	class="box-content flex-grow" v-if="$isNotEmpty(activeTrack)">
                    <div class="step-box info-content">
                      <div class="orderContent">
                        {{ getZH("logisticsNo") }}:{{ activeTrack.shipmentNo || "-" }}
                      </div>
                      <div class="step-item flex"	v-for="(itemData, itemIndex) in tracksContent" :key="itemData.id"	>
                        <div class="date">
                          {{ $moment(Number(itemData.happenTime)).utc(Number(itemData.zone))	.format("YYYY-MM-DD HH:mm:ss")}}
                        </div>
                        <div class="line" :class="itemIndex > 0 ? 'splice' : ''"></div>
                        <div class="name">{{ itemData.happenPlace }}</div>
                        <div class="operation">{{ itemData.eventContent }}</div>
                      </div>
                      <div class="flex-center empty-text" v-if="$isEmpty(tracksContent)">
                        {{ getZH("emptyData",'outInStorageManage') }}
                      </div>
                    </div>
                    <!---->
                  </div>
                </el-col>
            </el-row>
            </div>

          </el-tab-pane>
          <el-tab-pane :label="getZH('operationLog','outInStorageManage')" name="3">
            <div class="tabs-content">
              <lb-table stripe :column="logsColumnData" border :data="logs || []" />
            </div>
          </el-tab-pane>

        </el-tabs>
			</div>
			<aduitRejectDialog
				:visible.sync="dialog.visible"
				:id="formData.id"
				@saved="backList"
			/>
			<div class="page-edit-footer">
        <el-button	size="mini" type="primary"	:loading="loading"	@click="aduit(1)" v-if="operate === 'audit'">{{ $t("common.refuse") }}</el-button>
        <el-button	size="mini"	type="danger"	:loading="loading" @click="aduit()" v-if="operate === 'audit'">{{ $t("common.reject") }}</el-button>
        <el-button size="mini" :loading="loading" @click="backList()">{{ $t("common.closed") }}</el-button>
			</div>
		</el-form>
	</div>
</template>
<script lang="jsx">
import aduitRejectDialog from './components/aduitRejectDialog.vue'
import { detailPackageInboundApi, auditAgreeApi, getInboundLogisticsTracksApi } from '@/api/OverseasWarehouse/GRNManager'
import constant from "./components/constant"
import getZHMixin from './components/getZHMixin'
import { getOrderLogsApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
import { zoneObj } from '../OutInStorageManage/components/zoneObj'
export default {
	name: 'ParcelStorageDetail',
	components: { aduitRejectDialog },
	mixins: [getZHMixin],
	data() {
		let defaultForm = {
			id: null,
			customerName: null,
			deliverModeType: null,
			deliverModeTypeName: null,
			customerSystemNo: null,
			orderState: 1,
			warehouseCountry: '',
			warehouseNameCountry: '',
			orderInboundNo: null,
			skuKindQuantity: '',
			skuQuantity: '',
			totalVolume: '',
			realTotalVolume: null,
			orderStateName: null,
			expectArriveWarehouseTime: null,
			remarks: '',
			createTime: null,
			orderInboundGoodsList: [],
			boxList: [],
			lastLegList: [],
			chargeList: [],
			estimateTotalChargeMap: {}
		}
		return {
			defaultForm,
			zoneObj,
			constant,
			formData: defaultForm,
      borderName: '0',
      operate: null,
      activeTrack: {},
      tracksContent: [],
      logs: [],
      logsColumnData: [
				{
					label: this.getZH('operationOf', 'outInStorageManage'),
					prop: 'opName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('logOriginName', 'outInStorageManage'),
					prop: 'logOriginName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('time', 'outInStorageManage'),
					prop: 'happenTime',
					width: 160,
					render: (h, { row }) =>
						<div>
							{
								row.happenTime ? this.$moment(Number(row.happenTime)).format('YYYY-MM-DD HH:mm:ss') : null
							}
						</div>
				},
				{
					label: this.getZH('operation', 'outInStorageManage'),
					prop: 'logTypeName',
					width: 140
				},
				{
					label: this.getZH('logContent', 'outInStorageManage'),
					prop: 'logContent',
					showOverflowTooltip: true
				}
			],
			columnData1: [
				{
					label: this.getZH('TheSerialNumber'),
          width: 50,
					render: (h, scope) => <div>{ scope.$index + 1 }</div>
				},
				{
					label: this.getZH('skuCode'),
					prop: 'skuCode'
				},
				{
					label: this.getZH('chineseName'),
					prop: 'name'
				},
				{
					label: this.getZH('skuEnName'),
					prop: 'englishName'
				},
				{
					label: this.getZH('plannedWarehousingQuantity'),
					prop: 'quantity'
				},
				{
					label: this.getZH('actualNumberShelves'),
					prop: 'groundingQuantity',
          render: (h, scope) => <div>{ scope.row.groundingQuantity || '-' }</div>
				}
			],
			loading: false
		}
	},
	created() {
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail(this.$route.query.id)
		}
    this.operate = this.$route.query.operate
	},
	computed: {
		totalNumber() {
			let obj = {
				groundingQuantity: 0,
				shelvesTypeNumber: 0
			}
			let dataList = this.formData.orderInboundGoodsList
			dataList.forEach(item => {
				obj.groundingQuantity += Number(item.groundingQuantity)
				if (Number(item.groundingQuantity) > 0) {
					obj.shelvesTypeNumber += 1
				}
			})
			return obj
		}
	},
	methods: {
		/**
		 * 获取详情数据
		 */
		async getDetail(id) {
			this.loading = true
			detailPackageInboundApi(id).then(res => {
				if (res.ok) {
					this.$copyProps(this.formData, res.content)
					this.formData.warehouseNameCountry = res.content.countryName + '/' + res.content.warehouseName
					this.loading = false
				} else {
					this.loading = false
				}
			})
		},
    handClick() {
      if (this.borderName === '0') {
        this.getDetail(this.$route.query.id)
      }
      if (this.borderName === '3') {
        this.getLogs()
      }
    },
    /**
	 *获取日志
	 */
		async getLogs() {
			this.loading = true
			let res = await getOrderLogsApi(this.$route.query.id)
			if (res.ok) {
				this.logs = res.content || []
				this.loading = false
			} else {
				this.logs = []
				this.loading = false
			}
		},
    /**
     * 获取物流轨迹
     */
    async getTrackItem(row) {
      this.activeTrack = row
      this.loading = true
      let res = await getInboundLogisticsTracksApi({orderId: this.formData.id, trackNo: row.shipmentNo})
      if (res.ok) {
        this.tracksContent = res.content || []
      }
      this.loading = false
    },
		async aduit(type) {
			if (type) {
				this.loading = true
				let res = await auditAgreeApi(this.formData.id)
				if (res.ok) {
					this.$message.success(this.getZH('auditSuccess', 'common'))
					this.backList()
				} else {
					this.loading = false
				}
			} else {
				this.dialog.visible = true
			}

		},
		/**
		* 返回列表
		*/
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.loading = false
			this.$router.push({ name: `ParcelStorage`})
		}
	}
}
</script>

<style scoped lang="scss">
.page-edit-container {
	background: #fff;
}
.totalBox {
	margin-bottom: 10px;
	.total-item {
		width: 260px;
		color: #666;
		font-size: 14px;
		margin-bottom: 10px;
	}
}
.tabs-content {
	height: calc(100vh - 320px);
}
.step-box {
	padding-top: 10px;
	.step-item {
		color: #61655c;
		font-size: 14px;
		height: 52px;
		align-items: flex-end;
		.week {
			font-size: 14px;
			margin-left: 6px;
		}
		.line {
			width: 16px;
			height: 16px;
			border-radius: 50%;
			border: 4px solid #a2ebd6;
			margin-left: 12px;
			margin-right: 16px;
			position: relative;
			&.splice {
				border-color: #d2dcd8;
			}
			&.splice::after {
				position: absolute;
				width: 1px;
				background: #d2dcd8;
				height: 40px;
				left: 3px;
				top: -44px;
				content: "";
			}
		}
		.date {
			margin-right: 6px;
		}
		.time {
			margin-right: 42px;
		}
		.name {
			margin-right: 18px;
		}
	}
}
.box-content {
	margin: 10px;
}

.empty-text {
	height: 400px;
	width: 100%;
	color: #909399;
}

.box-goods {
    overflow: hidden;
    margin-bottom: 10px;
    .box-goods-item {
        display: inline-block;
        margin-right: 20px;
        line-height: 18px;
    }
}
</style>
