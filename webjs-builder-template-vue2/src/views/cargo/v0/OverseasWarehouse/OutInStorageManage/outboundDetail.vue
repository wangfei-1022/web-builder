<template>
	<div class="page-edit-container detailContent">
		<div class="page-edit-content pd-16" v-loading="loading">
			<div class="top-status">
				<el-steps align-center class="steps">
					<el-step
						v-for="(item, index) in detail.statuses || []"
						:key="index"
						:title="item.statusName"
						:status="item.status === 85 ? 'error':
							item.checkedFlag
								? 'finish'
								: item.checkedFlag && !detail.statuses[index + 1].checkedFlag
								? 'process'
								: 'wait'
						"
					>
						<div slot="description">{{ item.operationTime | formatDate }}</div>
					</el-step>
				</el-steps>
			</div>
			<el-tabs
				type="border-card"
				class="border-card"
				@tab-click="handClick"
				v-model="activeName"
			>
				<el-tab-pane :label="getZH('detail')" name="0">
					<div>
						<div class="info-title">{{ getZH("baseInfo") }}</div>
						<div class="info-content">
							<el-row class="label-box">
								<el-col :span="12">
									<div class="label-item">
										<div class="label">{{ getZH("customerName") }}</div>
										<div class="content">{{ detail.customerName  }}</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="label-item">
										<div class="label">{{ getZH("orderNo") }}</div>
										<div class="content">{{ detail.orderNo }}</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="label-item">
										<div class="label">{{ getZH("orderType") }}</div>
										<div class="content">{{ detail.typeName }}</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="label-item">
										<div class="label">{{ getZH("userOutBoundNo") }}</div>
										<div class="content">{{ detail.outOrderNo }}</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="label-item">
										<div class="label">{{ getZH("transportMode") }}</div>
										<div class="content" v-if="detail.lastLeg">
											{{ detail.lastLeg.transportModeName }}
										</div>
									</div>
								</el-col>
								<el-col :span="12" v-if="detail.lastLeg">
									<div class="label-item">
										<div class="label">
											{{
												detail.lastLeg.transportMode === 1
													? getZH("isShipmentFiles")
													: getZH("isPickup")
											}}
										</div>
										<div class="content">
											{{
												detail.lastLeg.pickup
													? getZH("isTrue")
													: getZH("isFalse")
											}}
										</div>
									</div>
								</el-col>
								<el-col :span="12" v-if="detail.trade && detail.type === 10">
									<div class="label-item">
										<div class="label">{{ getZH("tradePlatform") }}</div>
										<div class="content">
											{{ detail.trade.tradePlatformName }}
										</div>
									</div>
								</el-col>
								<el-col :span="12" v-if="detail.trade && detail.type === 10">
									<div class="label-item">
										<div class="label">{{ getZH("tradeNo") }}</div>
										<div class="content" v-if="detail.trade">
											{{ detail.trade.tradeNo }}
										</div>
									</div>
								</el-col>
								<el-col :span="12" v-if="detail.trade && detail.type === 22">
									<div class="label-item">
										<div class="label">{{ getZH("amazonOrderNo") }}</div>
										<div class="content">
											{{ detail.trade.tradeNo }}
										</div>
									</div>
								</el-col>
								<el-col :span="12" v-if="detail.trade && detail.type === 22">
									<div class="label-item">
										<div class="label">
											{{ getZH("amazonReferenceNumber") }}
										</div>
										<div class="content">
											{{ detail.trade.referenceNo }}
										</div>
									</div>
								</el-col>
								<el-col
									:span="12"
									v-if="detail.lastLeg && detail.lastLeg.transportMode === 1"
								>
									<div class="label-item">
										<div class="label">{{ getZH("shipmentNo") }}</div>
										<div class="content" v-if="detail.lastLeg">
												{{ $isNotEmpty(detail.lastLeg.jobShipmentNos) ?detail.lastLeg.jobShipmentNos[0] :'-' }}
										</div>
									</div>
								</el-col>
                <el-col	:span="12" v-if="detail.lastLeg && detail.lastLeg.transportMode === 1 && $isNotEmpty(detail.lastLeg.shipmentLabelFiles)">
                  <div class="label-item">
                    <div class="label">{{ getZH("shipmentLabelFiles") }}</div>
                    <div class="content" v-if="detail.lastLeg">
                      <div class="link-box ml-10" @click="lookDetail(item)" v-for="(item,index) in detail.lastLeg.shipmentLabelFiles" :key="index">{{item.originFileName}}</div>
                    </div>
                  </div>
                </el-col>
              <el-col :span="12" >
                <div class="label-item">
                  <div class="label">{{getZH("batchFlag")}}</div>
                  <div class="content">{{	detail.batchFlag ? getZH("isTrue") : getZH("isFalse")}}</div>
                </div>
              </el-col>
              <el-col :span="12"  v-if="detail.type !== 10 && detail.lastLeg && detail.lastLeg.transportMode === 2">
                <div class="label-item">
                  <div class="label">{{getZH("planPickTime")}}</div>
                  <div class="content" v-if="planPickTime">{{detail.planPickTime | formatDate('YYYY-MM-DD')}}</div>
                   <div class="content" v-else>-</div>
                </div>
              </el-col>
              <el-col :span="12"  v-if="detail.type === 22">
                <div class="label-item">
                  <div class="label">{{getZH("orderValidDate")}}</div>
                  <div class="content" v-if="detail.orderValidDate">{{detail.orderValidDate | formatDate('YYYY-MM-DD')}}</div>
                  <div class="content" v-else>-</div>
                </div>
              </el-col>
            </el-row>
            </div>
            <div class="info-content">
              <el-row class="label-box">
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("remark") }}</div>
                    <div class="content">{{ detail.remarks || '-' }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div	class="info-title"	v-if="detail.lastLeg && detail.lastLeg.transportMode === 2 && detail.lastLeg.pickup">
              {{ getZH("pickupInfo") }}
            </div>
            <div class="info-content"	v-if="detail.lastLeg  && detail.lastLeg.pickup">
              <el-row class="label-box">
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("carrierName") }}</div>
                    <div class="content" v-if="detail.lastLeg">
                      {{ detail.lastLeg.carrierName || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("shipmentNo") }}</div>
                    <div class="content" v-if="detail.lastLeg">
                      {{ detail.lastLeg.shipmentNo || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("carrierContact") }}</div>
                    <div class="content" v-if="detail.lastLeg">
                      {{ detail.lastLeg.carrierContact || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("carrierMobile") }}</div>
                    <div class="content" v-if="detail.lastLeg">
                      {{ detail.lastLeg.carrierMobile || "-" }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="info-title">{{ getZH("warehouseInfo") }}</div>
            <div class="info-content">
              <el-row class="label-box">
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("warehouse") }}</div>
                    <div class="content" v-if="detail.warehouse">
                      {{ detail.warehouse.name || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalCountry") }}</div>
                    <div class="content" v-if="detail.warehouse">
                      {{ detail.warehouse.countryName || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalAddress") }}</div>
                    <div class="content" v-if="detail.warehouse">
                      {{ detail.warehouse.address || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalZipcode") }}</div>
                    <div class="content" v-if="detail.warehouse">
                      {{ detail.warehouse.postCode || "-" }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="info-title">{{ getZH("arrivalInfo") }}</div>
            <div class="info-content">
              <el-row class="label-box">
                <el-col :span="12" v-if="detail.arrival && detail.type === 22">
                  <div class="label-item">
                    <div class="label">{{ getZH("fba") }}</div>
                    <div class="content">
                      {{ detail.arrival.arrivalTag || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalContact") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalContact || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalContactTel") }}</div>
                    <div class="content" v-if="detail.arrival">
                      <span>{{ detail.arrival.arrivalContactTel || "-" }}</span>
                      <span v-if="$isNotEmpty(detail.arrival.arrivalContactTel2)">- {{ detail.arrival.arrivalContactTel2 }}</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalContactEmail") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalContactEmail || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalCountry") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalCountryName || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalProvince") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalProvinceName?detail.arrival.arrivalProvinceName+'（'+ (detail.arrival.arrivalProvinceEnName||'-') +'-' + (detail.arrival.arrivalProvince||'-')+'）' : "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalCity") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalCity || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalAddress1") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalAddress1 || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalAddress2") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalAddress2 || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("arrivalZipcode") }}</div>
                    <div class="content" v-if="detail.arrival">
                      {{ detail.arrival.arrivalZipcode || "-" }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("houseNumber") }}</div>
                    <div
                      class="content"
                      v-if="
                        detail.arrival && detail.arrival.arrivalExternalInfoJson
                      "
                    >
                      {{
                        JSON.parse(detail.arrival.arrivalExternalInfoJson)
                          .houseNumber || "-"
                      }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div
              class="info-title"
              v-if="detail.lastLeg && !detail.lastLeg.pickup"
            >
              {{ getZH("outBoundProduct") }}
            </div>
            <div class="info-content" v-if="detail.lastLeg && !detail.lastLeg.pickup">
              <el-row class="label-box" v-if="detail.lastLeg.serviceList">
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("childProduct") }}</div>
                    <div class="content">
                      {{ detail.lastLeg.productName }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="label-item">
                    <div class="label">{{ getZH("prescription") }}</div>
                    <div class="content">
                      {{ detail.lastLeg.aging }}
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="12"
                  v-for="serviceItem in detail.lastLeg.serviceList"
                  :key="serviceItem.serviceCode"
                >
                  <div class="label-item">
                    <div class="label">{{ serviceItem.serviceName }}</div>
                    <div class="content" v-if="serviceItem.serviceContentJson">{{ serviceItem.serviceItemNames }}</div>
                    <div class="content" v-if="serviceItem.serviceCode === 'INSURANCE' && ['2','3'].includes(serviceItem.serviceItemValues) && $isNotEmpty(serviceItem.serviceItemCurrency)">{{`${$t("outInStorageManage.amountVal")}（${serviceItem.serviceItemCurrency}）`}}{{serviceItem.serviceItemAmount || '-'}}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="info-title">{{ getZH("addedServices") }}</div>
            <div class="info-content">
              <lb-table stripe :column="columnData1" :data="detail.vas || []">
              </lb-table>
            </div>
            <div class="info-title">{{ getZH("goodsInfo") }}</div>
            <div class="info-content">
              <lb-table stripe :column="detail.batchFlag ? columnData2: columnData" border :data="detail.goods || []">
              </lb-table>
            </div>
            <!-- -->
					</div>
					<el-dialog
						:title="$t('common.viewBtn')"
						:visible.sync="dialogViewFile"
						:close-on-click-modal="false"
						:append-to-body="true"
						width="100%"
						height="100%"
						fullscreen
						:before-close="closeReleaseGuaranteeDialog"
					>
						<div class="flex-center top-content">
              <div class="releaseGuarantee">
                <pdf
                  ref="pdf"
                  style="width:100%;display:inline-block"
                  :src="viewFile.url"
                  :page="currentPage"
                  @num-pages="pageCount=$event"
                  @page-loaded="currentPage=$event"
                  @loaded="loadPdf"
                  >
                </pdf>
              </div>
						</div>
            <div class="flex-center labelTips">
              <span class="fs-14 mr-10 pointer"  @click="carouselChange(1)">{{getZH('prePage')}}</span>	{{ currentPage }}/{{ pageCount }} <span class="fs-14 ml-10 pointer" @click="carouselChange(2)">{{getZH('nextPage')}}</span>
              <span class="fs-14 ml-10 pointer link-box" @click="downloadFile({url:viewFile.url,fileName:viewFile.originFileName})">{{getZH('download')}}</span>
            </div>
					</el-dialog>
				</el-tab-pane>
				<el-tab-pane :label="getZH('tailLiftTrack')" name="1">
					<div class="flex flex-wrap">
						<div
							class="box-content flex-grow"
							v-for="(item, index) in tracksContent"
							:key="index"
						>
							<div
								class="step-box info-content"
								v-if="$isNotEmpty(item.tracks)"
							>
								<div class="orderContent">
									{{ getZH("shipmentNo") }}:
									<span class="ml-10">{{ item.trackNo }}</span>
								</div>
								<div
									class="step-item flex"
									v-for="(itemData, itemIndex) in item.tracks"
									:key="itemData.id"
								>
									<div class="date">
                                        {{
											$moment(Number(itemData.happenTime))
												.utcOffset(itemData.zoneId)
												.format("YYYY-MM-DD HH:mm:ss")
										}}
									</div>
									<div
										class="line"
										:class="itemIndex > 0 ? 'splice' : ''"
									></div>
									<div class="name">{{ itemData.happenPlace }}</div>
									<div class="operation">{{ itemData.eventContent }}</div>
								</div>
							</div>
							<div v-else class="flex-center empty-text">
								{{ getZH("emptyData") }}
							</div>
						</div>
						<div class="flex-center empty-text" v-if="$isEmpty(tracksContent)">
							{{ getZH("emptyData") }}
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane :label="getZH('costDetail')" name="3">
					<div>
						<costDetail
							:dataList="detail.chargeList || []"
							:totalPrice="detail.estimateTotalChargeMap || {}"
						/>
					</div>
				</el-tab-pane>
				<el-tab-pane :label="getZH('operationLog')" name="2">
					<div>
						<lb-table stripe :column="logsColumnData" :data="logs || []" />
					</div>
				</el-tab-pane>
			</el-tabs>
      <auditDialog :visible.sync="dialog.visible" :type="type" :id="$route.query.id" :detail="detail" @saved="backList" />
		</div>
		<div class="page-edit-footer">
			<div></div>
			<div>
				<el-button
					size="mini"
					type="primary"
					:loading="loading"
					@click="audit(1)"
					v-if="isAudit"
				>
					{{ $t("common.refuse") }}
				</el-button>
				<el-button
					size="mini"
					type="danger"
					:loading="loading"
					@click="audit(0)"
					v-if="isAudit"
				>
					{{ $t("common.reject") }}
				</el-button>
				<el-button size="mini" :loading="loading" @click="backList()">
					{{ $t("common.closed") }}
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="jsx">
import getZHMixin from './components/getZHMixin'
import costDetail from './components/costDetail'
import { getOrderLogsApi, getOrderTracksApi, getOrderDetailApi, getImageUrlApi, auditOutboundsApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
import auditDialog from './components/auditDialog.vue'
// import pdf from "vue-pdf"
export default {
	name: 'OutboundDetail',
	mixins: [getZHMixin],
	components: { costDetail, auditDialog, 
    // pdf 
    },
	data() {
		return {
			isAudit: false,
			activeName: '',
			currentPage: 0,
			pageCount: 0,
			detail: {},
			tracksContent: [],
			dialogViewFile: false,
			viewFile: {},
			columnData1: [
				{
					label: this.getZH('number'),
					width: 50,
					render: (h, { $index }) =>
						<div>
							{
								$index + 1
							}
						</div>
				},
				{
					label: this.getZH('serviceName'),
					prop: 'serviceName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('cnt'),
					prop: 'quantity',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('fileCnt'),
					showOverflowTooltip: true,
					render: (h, { row }) =>
						<div >
							{
								row.fileQuantity || '-'
							}
						</div>
				},
				{
					label: this.getZH('lookFile'),
					prop: 'quantity',
					width: 100,
					render: (h, { row }) =>
						<div >
							{
								this.$isNotEmpty(JSON.parse(row.serviceContentJson).fileList) ? <span class='fc-blue pointer' onClick={() => {
									this.lookFile(JSON.parse(row.serviceContentJson).fileList)
								}}>{this.getZH('lookFile')}</span> : '-'
							}
						</div>
				}

			],
			columnData: [
				{
					label: this.getZH('number'),
					width: 50,
					render: (h, { $index }) =>
						<div>
							{
								$index + 1
							}
						</div>
				},
				{
					label: this.getZH('elecSkuCode', 'goodsManagement'),
					minWidth: 140,
					prop: 'skuCode',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('sysBarCode', 'goodsManagement'),
					minWidth: 140,
					prop: 'systemBarCode',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('cnName'),
					minWidth: 140,
					prop: 'name',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('enName'),
					minWidth: 140,
					prop: 'englishName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('quantity'),
					width: 120,
					prop: 'quantity',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('length'),
					width: 120,
					prop: 'length',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('width'),
					width: 120,
					prop: 'width',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('height'),
					width: 120,
					prop: 'height',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('weight'),
					width: 120,
					prop: 'weight',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('actualOutQuantity'),
					width: 110,
					prop: 'actualOutQuantity',
					showOverflowTooltip: true
				}
				// 实际出库数量
			],
			columnData2: [
				{
					label: this.getZH('number'),
					width: 50,
					render: (h, { $index }) =>
						<div>
							{
								$index + 1
							}
						</div>
				},
				{
					label: this.getZH('elecSkuCode', 'goodsManagement'),
					minWidth: 140,
					prop: 'skuCode',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('specifiedBatch'),
					minWidth: 140,
					prop: 'batchNo',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('sysBarCode', 'goodsManagement'),
					minWidth: 140,
					prop: 'systemBarCode',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('cnName'),
					minWidth: 140,
					prop: 'name',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('enName'),
					minWidth: 140,
					prop: 'englishName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('quantity'),
					width: 120,
					prop: 'quantity',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('length'),
					width: 120,
					prop: 'length',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('width'),
					width: 120,
					prop: 'width',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('height'),
					width: 120,
					prop: 'height',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('weight'),
					width: 120,
					prop: 'weight',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('actualOutQuantity'),
					width: 110,
					prop: 'actualOutQuantity',
					showOverflowTooltip: true
				}
				// 实际出库数量
			],
			logsColumnData: [
				{
					label: this.getZH('operationOf'),
					prop: 'opName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('logOriginName'),
					prop: 'logOriginName',
					showOverflowTooltip: true
				},
				{
					label: this.getZH('time'),
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
					label: this.getZH('operation'),
					prop: 'logTypeName',
					width: 140
				},
				{
					label: this.getZH('logContent'),
					prop: 'logContent',
					showOverflowTooltip: true
				}
			],
			formData: this.$extends(true, {}, this.detail),
			loading: false,
			logs: [],
			type: 1
		}
	},
	created() {
		this.activeName = this.$route.query.type
		this.isAudit = this.$route.query.audit || false
		if (this.$isNotEmpty(this.$route.query.id)) {
			this.getDetail()
		}
		if (Number(this.$route.query.type) === 1) {
			this.getTracks()
		}
	},
	computed: {

	},
	methods: {
		loadPdf() {
			this.currentPage = 1// 加载的时候先加载第一页
		},
		/**
		 * 出库单详情
		 */
		async getDetail() {
			this.loading = true
			let res = await getOrderDetailApi(this.$route.query.id)
			if (res.ok) {
				if (res.content.batchFlag) {
					if (this.$isNotEmpty(res.content.batch)) {
						res.content.batch.forEach(item => {
							item.quantity = item.goodsQuantity
						})
					}
					res.content.goods = res.content.batch
					delete res.content.batch
				}
				let arr = res.content.statuses
				// 查询有没有被取消
				let cancelItem = arr.find(item => item.status === 85 && item.checkedFlag)
				if (this.$isNotEmpty(cancelItem)) {
					arr = arr.filter(item => item.checkedFlag)
				} else {
					arr = arr.filter(item => item.status !== 85)
				}
				res.content.statuses = arr
				// 处理一下 物流产品 serviceList
				if (res.content.lastLeg) {
					res.content.lastLeg.serviceList.forEach(item => {
						let data = JSON.parse(item.serviceContentJson)
						let serviceItemValues = ''
						let serviceItemNames = ''
						let serviceItemCurrency = ''
						let serviceItemAmount = ''
						if (this.$isNotEmpty(data)) {
							let names = data.names
							let values = data.values
							let insureAmounts = data.insureAmounts
							serviceItemNames = names.join(",")
							serviceItemValues = values.join(",")
							if (this.$isNotEmpty(insureAmounts)) {
								serviceItemCurrency = insureAmounts.map(item => item.currency).join(',')
								serviceItemAmount = insureAmounts.map(item => item.amount).join(',')
							}
						}
						item.serviceItemValues = serviceItemValues
						item.serviceItemNames = serviceItemNames
						item.serviceItemCurrency = serviceItemCurrency
						item.serviceItemAmount = serviceItemAmount
					})
				}
				this.detail = res.content || {}
				this.loading = false
			} else {
				this.loading = false
				this.detail = {}
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
		 * 获取服务项值
		 */
		getServiceNames(services) {
			let data = JSON.parse(services)
			let str = ''
			if (this.$isNotEmpty(data)) {
				let names = data.names
				str = names.join(",")
			}
			return str
		},
		/**
		 * 获取尾程轨迹
		 */
		async getTracks() {
			this.loading = true
			let res = await getOrderTracksApi(this.$route.query.id)
			if (res.ok) {
				this.tracksContent = res.content || []
				this.loading = false
			} else {
				this.tracksContent = []
				this.loading = false
			}
		},
		/**
		 * PDF页码变更
		 */
		carouselChange(type) {
			if (type === 1) {
				if (Number(this.currentPage) === 1) {
					return
				} else {
					this.currentPage -= 1

				}
			} else {
				if (Number(this.currentPage) === Number(this.pageCount)) {
					return
				} else {
					this.currentPage += 1
				}
			}
		},

		/**
	* 返回列表
	*/
		backList() {
			this.$router.go(-1)
			this.$store.dispatch('tagsView/delView', this.$route)
		},
		/**
		 * 人工审核
		 */
		async audit(type) {
			if (this.detail.lastLeg.transportMode === 1 && type === 1) {
				// 快递审核
				let res = await auditOutboundsApi({ id: this.detail.id })
				if (res.ok) {
					this.$message.success(this.$t('TipsMessage.saveMessage'))
					this.backList()
				}
				return
			}
			this.type = type
			this.dialog.visible = true
		},

		handClick(tab) {
			let index = Number(tab.index)
			if (index === 1) {
				this.getTracks()
			}
			if (index === 3) {
				this.getLogs()
			}
		},
		closeReleaseGuaranteeDialog() { // 关闭放单保函/凭证文件查看
			this.dialogViewFile = false
			this.viewFile = {}
		},
		// 预览PDF
		async lookDetail(file) {
			if (this.$isEmpty(file)) {
				this.$message.warning(this.getZH('emptyImg'))
				return
			}
			this.viewFile = file
			this.$nextTick(() => {
				this.dialogViewFile = true
			})
		},
		// 预览文件
		async lookFile(files) {
			if (this.$isEmpty(files)) {
				this.$message.warning(this.getZH('emptyImg'))
				return
			}
			let arr = []
			files.forEach(item => {
				arr.push(item.cloudFileName)
			})
			let res = await getImageUrlApi({ cloudFileNames: arr })
			if (res.ok) {
				let files = res.content || []
				files.forEach((item, index) => {
					setTimeout(() => {
						this.downloadFile({ url: item.url, fileName: '' })
					}, 500 * index)
				})
			}
		}
	}
}
</script>

<style scoped lang="scss">
.top-content {
	height: calc(100vh - 130px);
	overflow: auto;
}
.labelTips {
	font-size: 18px;
	margin-top: 20px;
}
.detailContent {
	background-color: #fff;
	position: relative;
	.info-title {
		width: 100%;
		height: 36px;
		line-height: 36px;
		font-size: 14px;
		position: relative;
		margin-bottom: 10px;
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
			line-height: 32px;
			margin-bottom: 10px;
			display: flex;
			align-self: center;
			.label {
				color: #828282;
				font-size: 14px;
				width: 114px;
			}
			.content {
				font-size: 14px;
				margin-left: 10px;
				color: #5f5f5f;
			}
		}
	}
	.top-status {
		padding: 15px 0px;
		border-top: 1px solid #dfe4ed;
	}
	.empty-text {
		height: 400px;
		width: 100%;
		color: #909399;
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
}
.releaseGuarantee {
	width: 1000px;
}
</style>
