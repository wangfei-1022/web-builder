<template>
	<div>
		<div class="flex-box content-container">
			<div class="flex-box mb-10" v-if="Number(productType) === 2">
        <el-form-item :label="$t('channelPriceCard.compute_mode')+'：'" class="mb-0"  prop="computeMode">
          <el-select size="mini" v-model="data.computeMode" v-if="Number(type) === 0">
            <el-option :value="1" :label="$t('channelPriceCard.computeMode.UNIT')" />
            <el-option :value="2" :label="$t('channelPriceCard.computeMode.ALL')" />
          </el-select>
          <span v-else class="label">
            {{ Number(data.computeMode) === 1 ? $t('channelPriceCard.computeMode.UNIT') : $t('channelPriceCard.computeMode.ALL') }}
          </span>
        </el-form-item>
			</div>
			<div v-if="Number(type) === 0" class="flex-box mb-10">
				<span class="label ml-10">{{$t('channelPriceCard.delivery_charge_upload_file')}}：</span>
				<UploadFileByUrl
					:accept="'.xlsx'"
					:url="fileUrl"
					:showFileList="false"
					v-model="fileList"
					class="upload"
					@success="successUpload"
					:on-progress="handlerProgress"
					@error='handleError'
				>
					<div slot="upload">
						<el-button type="primary" size="mini" :loading="loading1">
							{{$t('channelPriceCard.upload_file')}}
						</el-button>
					</div>
				</UploadFileByUrl>
				<el-button
					size="mini"
					class="ml-10 mt-6"
					@click="download"
					:loading="loading"
				>
          {{$t('channelPriceCard.download_template')}}
				</el-button>
			</div>
		</div>
		<DistributionFeeArea v-if="Number(productType) === 1" :data="data" />
		<!--  -->
		<div v-if="Number(productType) === 2">
			<DistributionTruckFeeArea :data="data" />
		</div>
	</div>
</template>

<script>
import DistributionFeeArea from "./DistributionFeeArea.vue"
import DistributionTruckFeeArea from "./DistributionTruckFeeArea.vue"
import { expressImportExcelApi, expressTruckImportExcelApi } from '@/api/OverseasWarehouse/PriceCardManage.js'
import UploadFileByUrl from '@/components/UploadFile/UploadFileByUrl'
export default {
	name: 'DeliveryFee',
	components: { DistributionFeeArea, DistributionTruckFeeArea, UploadFileByUrl },
	props: {
		data: Object,
		type: String,
		productId: String,
		productType: [String, Number]
	},
	data() {
		return {
			loading: false,
			loading1: false,
			activeTabName: '0',
			fileList: []
		}
	},
	created() {

	},
	mounted() {

	},
	computed: {
		fileUrl() {
			return Number(this.productType) === 1 ? `api/trans-service/omc/lnt/products/${this.productId}/express/priceCards/costCards/deliveryCharges/importExcel` : `api/trans-service/omc/lnt/products/truck/priceCards/costCards/importExcel/${this.productId}`
		}
	},
	methods: {
		/**
		 * 下载模板
		 */
		download() {
			this.loading = true
			let fn = null
			if (Number(this.productType) === 1) {
				fn = expressImportExcelApi
			} else if (Number(this.productType) === 2) {
				fn = expressTruckImportExcelApi
			} else {
				this.loading = false
				this.$message.error(this.$t('channelPriceCard.product_type_un_support'))
			}
			fn(this.productId).then(res => {
				if (res.ok) {
					const _fileName = this.$t('channelPriceCard.download_template')
					const link = document.createElement('a')
					link.download = _fileName
					link.href = res.content.url
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					this.loading = false
				}
			})
		},
		handlerProgress() {
			this.loading1 = true
		},
		handleError() {
			this.loading1 = false
		},
		/**
		 * 解析文件成功
		 */
		successUpload(res) {
			if (res) {
				this.loading1 = false
				this.$message.success(this.$t('channelPriceCard.parse_success'))
				if (Number(this.productType) === 1) {
					this.$set(this.data, 'chargeDetailForDeliveryChargeDTOList', res)
				} else if (Number(this.productType) === 2) {
					this.$set(this.data, 'warehouseTruckChargeDetailList', res)
				} else {
					this.$message.error(this.$t('channelPriceCard.product_type_un_support'))
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">
.content-container {
	padding-left: 40px;
	.label {
		font-size: 14px;
		color: #606266;
	}
	.uploadTip {
		font-size: 14px;
		color: #606266;
	}
}
</style>
