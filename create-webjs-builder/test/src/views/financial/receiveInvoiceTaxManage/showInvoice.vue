<template>
	<div class="page-edit-container" v-loading="loading">
		<div class="page-edit-content">
      <div class="invoice-container">
        <div class="arrow-container ">
           <button type="button" class="arrow-button" @click="arrowNext">
            <i class="el-icon-arrow-right"></i>
          </button>
          <span class="arrow-page">
            {{currentIndex}}/{{taxInvoicePreCreateTaxInvoiceDTOs.length}}
          </span>
          <button type="button" class="arrow-button" @click="arrowPrev">
            <i class="el-icon-arrow-left"></i>
          </button>
        </div>
        <el-carousel trigger="click" :autoplay="false" height="810px" @change="arrowChange" ref='carouselRef'>
          <el-carousel-item v-for="(item, index) in taxInvoicePreCreateTaxInvoiceDTOs" :key="index">
            <editInvoiceItem :ref="'editInvoiceItemRef' + index"></editInvoiceItem>
          </el-carousel-item>
        </el-carousel>
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
import { invoiceTaxReversePrecreateApi, invoiceTaxToSubmitApi } from '@/api/financial/fmsReceiveInvoice'
import editInvoiceItem from './editInvoiceItem'

export default {
	name: 'FmsTaxInvoiceReverse',
	components: {
		editInvoiceItem
	},
	data() {
		return {
			loading: false,
			currentIndex: 1,
			taxInvoicePreCreateTaxInvoiceDTOs: [{}, {}, {}, {}],
			invoiceId: null
		}
	},
	watch: {

	},
	created() {
		this.invoiceId = this.$route.query.id
		this.init()
	},
	methods: {
		arrowChange(index) {
			this.currentIndex = index + 1
		},
		prevFn() {

		},
		arrowPrev() {
			this.$refs.carouselRef.prev()
		},
		arrowNext() {
			this.$refs.carouselRef.next()
		},
		// 初始化
		init() {
			let data = {
				invoiceId: this.invoiceId
			}
			invoiceTaxReversePrecreateApi(data).then(res => {
				if (res.ok) {
					this.taxInvoicePreCreateTaxInvoiceDTOs = res.content.taxInvoicePreCreateTaxInvoiceDTOs
				}
			})
		},
		// 保存
		save() {
			let VR = true
			let data = {
				invoiceApplyId: this.invoiceApplyId,
				newTaxInvoiceDTOs: []
			}
			this.taxInvoicePreCreateTaxInvoiceDTOs.forEach((v, index) => {
				let ref = this.$refs['editInvoiceItemRef' + index][0]
				if (ref.validate()) {
					data.newTaxInvoiceDTOs.push(ref.getValue())
				} else {
					VR = false
				}
			})
			if (VR) {
        this.loading = true
				invoiceTaxReversePrecreateApi(data).then(res => {
          this.loading = false
					if (res.ok) {
						this.$confirm(this.$t('fmsReceiveInvoice.submitTaxInfo'), this.$t('fmsReceiveInvoice.saveSuccess'), {
							cancelButtonText: this.$t('common.cancel'),
              confirmButtonText: this.$t('common.confirm')
						}).then(() => {
							this.submitFn(res.content)
						}).catch(() => {
							// 取消
						});
					}
				})
			}
		},
		submitFn(res) {
			let data = {
				invoiceIds: res.invoiceIds
			}
      this.loading = true
			invoiceTaxToSubmitApi(data).then(res => {
        this.loading = false
				if (res.ok) {
          // 成功提交至税控，是否前往打印发票？
					this.$confirm(this.$t('fmsReceiveInvoice.invoiceTaxToSubmitInfo'), this.$t('fmsReceiveInvoice.submitSuccess'), {
						cancelButtonText: this.$t('common.cancel'),
            confirmButtonText: this.$t('common.confirm')
					}).then(() => {
						// 返回列表
						this.$router.push({ name: `TaskList` })
					}).catch(() => {
						// 取消
					});
				}
			})
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
