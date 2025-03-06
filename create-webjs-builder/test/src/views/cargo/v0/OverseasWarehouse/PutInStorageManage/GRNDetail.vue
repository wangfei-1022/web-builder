<template>
	<div class="page-edit-container">
		<el-form
			label-width="110px"
			label-position="left"
			:model="formData"
			ref="formData"
			:rules="rules"
		>
			<div class="page-edit-content" v-loading="loading">
        <el-tabs	type="border-card" class="border-card" @tab-click="handClick" v-model="borderName">
          <el-tab-pane :label="getZH('detail','outInStorageManage')" name="0">
            <div class="pd-16">
              <div class="info-title mb-10">{{ getZH("baseInfo") }}</div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="getZH('storageReservationNumber')">
                    <div
                      class="link-box span-input"
                      @click="getAppointInboundDetail(formData.appointInboundId)"
                    >
                      {{ formData.appointInboundNo }}
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('customerName')">
                    <el-input
                      size="mini"
                      v-model="formData.customerName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('orderInboundNo')">
                    <el-input
                      size="mini"
                      v-model="formData.orderInboundNo"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('inWarehouseType')">
                    <el-input
                      size="mini"
                      v-model="formData.inWarehouseTypeName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('warehouse')">
                    <el-input
                      size="mini"
                      v-model="formData.warehouseNameCountry"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('deliverType')" prop="deliverType">
                    <el-select
                      size="mini"
                      v-model="formData.deliverType"
                      :placeholder="selectZH('deliverType')"
                      class="w-full"
                      disabled
                    >
                      <el-option
                        v-for="item in constant.deliverTypeStatus"
                        :key="item.value"
                        :label="getZH(item.label)"
                        :value="Number(item.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('memberNo')">
                    <el-input
                      size="mini"
                      v-model="formData.customerSystemNo"
                      placeholder="-"
                      disabled
                    ></el-input>
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
                  <el-form-item :label="getZH('createTime')">
                    <CommonPicker
                      :pikcerType="'date'"
                      :pickerFormat="'yyyy-MM-dd'"
                      :parentDate="formData.createTime"
                      v-model="formData.createTime"
                      class="w-full"
                      size="mini"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="getZH('remark')">
                    <el-input
                      size="mini"
                      v-model="formData.remarks"
                      placeholder="-"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="info-title mb-10">{{ getZH("firstLeg") }}</div>
              <firstLegInfo
                :inWarehouseType="formData.inWarehouseType"
                :data="formData.firstLeg"
                :isDisabled="true"
              />
              <div class="info-title mb-10">{{ getZH("usingTheInformation") }}</div>
              <el-tabs v-model="activeName">
                <el-tab-pane :label="getZH('goodsInformation')" name="2">
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
                  <lb-table
                    stripe
                    :column="columnData1"
                    :data="formData.orderInboundGoodsList"
                    border
                  >
                  </lb-table>
                </el-tab-pane>
                <el-tab-pane
                  :label="getZH('usingTheInformation')"
                  name="1"
                  v-if="formData.inWarehouseType != 2 || formData.boxUpType != 1"
                >
                  <containerTable
                    :inWarehouseType="formData.inWarehouseType"
                    :dataList="formData.orderInboundBoxUpList || []"
                    :type="formData.boxUpType"
                    @exportBoxInfo='exportBoxInfo'
                  />
                </el-tab-pane>
              </el-tabs>
              <div v-if="$isNotEmpty(formData.chargeList)">
                <div class="info-title mt-10 mb-10">{{ getZH("costInfo") }}</div>
                <costDetail
                  :dataList="formData.chargeList || []"
                  :totalPrice="formData.estimateTotalChargeMap || {}"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="getZH('operationLog','outInStorageManage')" name="1">
            <lb-table stripe border :column="logsColumnData" :data="logs || []" />
          </el-tab-pane>
        </el-tabs>
			</div>
			<aduitRejectDialog
				:visible.sync="dialog.visible"
				:id="formData.id"
				@saved="backList"
			/>
			<div class="page-edit-footer">
				<div v-if="formData.orderState == 2">
					<el-button
						size="mini"
						type="primary"
						:loading="loading"
						@click="aduit(1)"
					>
						{{ $t("common.refuse") }}
					</el-button>
					<el-button
						size="mini"
						type="danger"
						:loading="loading"
						@click="aduit()"
					>
						{{ $t("common.reject") }}
					</el-button>
				</div>
				<div v-else>
					<el-button size="mini" :loading="loading" @click="backList()">
						{{ $t("common.closed") }}
					</el-button>
				</div>
			</div>
		</el-form>
	</div>
</template>

<script lang="jsx">
import firstLegInfo from './components/firstLegInfo.vue'
import aduitRejectDialog from './components/aduitRejectDialog.vue'
import containerTable from './components/containerTable.vue'
import { detailOrderInboundApi, auditAgreeApi, exportGoodsBoxApi } from '@/api/OverseasWarehouse/GRNManager'
import constant from "./components/constant"
import getZHMixin from './components/getZHMixin'
import costDetail from '../OutInStorageManage/components/costDetail'
import { getOrderLogsApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'GRNDetail',
	components: { firstLegInfo, containerTable, aduitRejectDialog, costDetail },
	mixins: [getZHMixin],
	data() {
		let defaultForm = {
			id: null,
			customerName: null,
			inWarehouseTypeName: null,
			appointInboundId: null,
			appointInboundNo: '',
			inWarehouseType: null,
			deliverType: null,
			customerSystemNo: null,
			orderState: 1,
			warehouseCountry: '',
			warehouseNameCountry: '',
			boxUpType: 1,
			orderInboundNo: null,
			skuKindQuantity: '',
			skuQuantity: '',
			totalVolume: '',
			realTotalVolume: null,
			orderStateName: null,
			remarks: '',
			createTime: null,
			firstLeg: {
				containerNo: null,
				containerType: null,
				eta: null,
				etd: null,
				vessel: null,
				voyage: null
			},
			orderInboundGoodsList: [],
			orderInboundBoxUpList: [],
			chargeList: [],
			estimateTotalChargeMap: {}
		}
		return {
			defaultForm,
			constant,
			formData: defaultForm,
      borderName: '0',
      logs: [],
			rules: {
				deliverType: [{ required: true, message: this.selectZH('deliverType') }]
			},
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
					render: (h, scope) =>
						<div>
							{
								scope.$index + 1
							}
						</div>

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
					label: this.getZH('planWarehousQuantity'),
					prop: 'quantity'
				},
				{
					label: this.getZH('actualNumberShelves'),
					prop: 'groundingQuantity'
				},
				{
					label: '',
					render: (h, { row }) =>
						<div>
							{
								<div class='fc-blue  pointer' onClick={() => {
									this.lookDetail()
								}}>{Number(row.groundingQuantity) > 0 ? this.getZH('lookDetail') : ''}</div>
							}
						</div>
				}
			],
			activeName: "2",
			rowDatas: [],
			drawer: false,
			detailContent: {},
			loading: false
		}
	},
	created() {
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail(this.$route.query.id)
		}
	},
	computed: {
		/**
     * 是否需要托盘
     */
		isNeedTray() {
			return this.formData.inWarehouseType === 1 || this.formData.inWarehouseType === 3
		},
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
			detailOrderInboundApi(id).then(res => {
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
      if (this.borderName === '1') {
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
		 * 跳转预约单
		 */
		getAppointInboundDetail(id) {
			this.$router.push({ name: `StorageReservationFormDetail`, query: { id, type: true, time: new Date().getTime() } })
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
		 * 查看批次库存
		 */
		lookDetail() {
			this.$router.push({ name: 'BatchList', query: { orderNo: this.formData.orderInboundNo, time: new Date().getTime() } })
		},
		// 导出装箱信息
		async exportBoxInfo() {
			this.loading = true
			let res = await exportGoodsBoxApi(this.formData.id)
			if (res.ok) {
				this.loading = false
				this.$message.success(this.getZH('exportSuccess'))
			} else {
				this.loading = false
			}
		},
		/**
		* 返回列表
		*/
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.loading = false
			this.$router.push({ name: `GRNList`, query: { time: new Date().getTime() } })
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
.span-input {
	height: 28px;
	border: 1px solid rgb(223, 228, 237);
	padding: 0 15px;
	line-height: 28px;
	background: rgb(245, 247, 250);
	border-radius: 4px;
}
</style>
