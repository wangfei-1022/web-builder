<template>
	<div class="page-edit-container" v-loading="loading">
		<div class="page-edit-content">
      <div class="invoice-container">
        <invoice-item-detail v-if="taxInvoiceItem.blueInvoiceId" ref="editInvoiceItemRef" :item="taxInvoiceItem"></invoice-item-detail>
        <editInvoiceItem v-if="!taxInvoiceItem.blueInvoiceId" ref="editInvoiceItemRef" :item="taxInvoiceItem"></editInvoiceItem>
      </div>
		</div>
		<div class="page-edit-footer">
			<el-button size="mini" plain @click="backList()">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="save()">{{$t('common.save')}}</el-button>
		</div>
	</div>
</template>
<script>
import { getGridSelectedIds, getGridSelected } from '@/utils/gridChoose'
import { toCloseCurrentActiveTag, lowerAmountToUpper, formatNumberToThousands } from '@/utils'
import { taxInvoiceSaveApi, invoiceTaxToSubmitApi, getTaxInvoiceDetailApi } from '@/api/financial/fmsReceiveInvoice'
import editInvoiceItem from './editInvoiceItem'
import InvoiceItemDetail from '../components/InvoiceItemDetail'

export default {
	name: 'FmsTaxInvoiceReverse',
	components: {
		editInvoiceItem,
		InvoiceItemDetail
	},
	data() {
		return {
			loading: false,
			taxInvoiceItem: {},
			invoiceId: null,
			taxInvoiceReverseReason: ''
		}
	},
	watch: {

	},
	created() {
		this.invoiceId = this.$route.query.id
		this.taxInvoiceReverseReason = this.$route.query.taxInvoiceReverseReason
		this.init()
	},
	methods: {
		// 初始化
		init() {
			if (!this.invoiceId) {
				return
			}
			getTaxInvoiceDetailApi(this.invoiceId).then(res => {
				if (res.ok) {
					this.taxInvoiceItem = res.content
				}
			})
		},
		// 保存
		save() {
			let VR = this.$refs.editInvoiceItemRef.validate()
			if (!VR) {
				return
			}
			let item = this.$refs.editInvoiceItemRef.getValue()
			let data = {
				invoiceId: this.invoiceId,
				...item
			}
      this.loading = true
			taxInvoiceSaveApi(data).then(res => {
        this.loading = false
				if (res.ok) {
          // 发票流水保存成功，是否提交至税控？
					this.$confirm(this.$t('fmsReceiveInvoice.submitTaxInfo'), this.$t('fmsReceiveInvoice.saveSuccess'), {
						cancelButtonText: this.$t('common.cancel'),
						confirmButtonText: this.$t('fmsReceiveInvoice.submitTax')
					}).then(() => {
						this.submitFn()
					}).catch(() => {
						// 取消
						this.backList()
					});
				}
			})
		},
		submitFn(res) {
			let data = {
				invoiceIds: [this.invoiceId]
			}
      this.loading = true
			invoiceTaxToSubmitApi(data).then(res => {
        this.loading = false
				if (res.ok) {
          // 已提交至税控，待税控返回结果
					this.$alert(this.$t('fmsReceiveInvoice.submitSuccessInfo'), this.$t('fmsReceiveInvoice.submitSuccess'), {
						confirmButtonText: this.$t('common.close')
					}).then(() => {
						// 返回列表
						this.backList()
					}).catch(() => {
						// 取消
					});
				}
			})
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: 'FmsTaxInvoiceListFinance' })
		}
	}
}
</script>
<style lang="scss" scoped>
.invoice-container {
	background: #fff;
	max-width: 1280px;

	::v-deep .el-carousel .el-carousel__arrow {
		display: none !important;
	}

	.arrow-container {
		text-align: right;
		padding: 15px 15px 0 15px;
		line-height: 28px;
		overflow: hidden;
	}

	.arrow-button {
		border: none;
		outline: none;
		padding: 0;
		margin: 0;
		height: 30px;
		width: 30px;
		cursor: pointer;
		-webkit-transition: 0.3s;
		transition: 0.3s;
		border-radius: 50%;
		background-color: rgba(31, 45, 61, 0.11);
		color: #fff;
		text-align: center;
		font-size: 12px;
		float: right;
	}
	.arrow-page {
		width: 60px;
		border: 1px solid #eee;
		height: 30px;
		display: block;
		text-align: center;
		border-radius: 3px;
		line-height: 28px;
		float: right;
		margin: 0 5px;
	}
}
</style>
