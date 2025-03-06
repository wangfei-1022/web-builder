<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content" :class="step == 2 ? 'pre' : ''">
      <!--开票-->
      <div v-if="step == 1">
        <el-tabs v-model="activeName">
          <!--开票配置-->
          <el-tab-pane :label='$t("fmsReceiveInvoice.invoiceConfig")' name="first">
            <div class="module">
                <div class="info-container" style="padding: 0 20px;">
                  {{$t("fmsReceiveInvoice.applyNo")}}：{{invoiceInfo.applyNo}}
                  <el-link type="primary" style="float: right;">{{invoiceInfo.applyStateName}}</el-link>
              </div>
            </div>
            <div class="module">
              <div class="blod name">
                <span class="icon iconfont icon-print"></span>
                {{$t("fmsReceiveInvoice.invoiceConfig")}}
              </div>
              <apply-invoice-config :invoiceInfo="invoiceInfo" role="FINANCE"></apply-invoice-config>
            </div>
          </el-tab-pane>
           <!--费用明细-->
          <el-tab-pane :label='$t("fmsReceiveInvoice.chargeInfo")' name="two" lazy>
            <apply-invoice-charge-detail :id="id" :amountTotal="invoiceInfo.sourceAmounts"/>
          </el-tab-pane>
        </el-tabs>
       </div>

      <!--发票预创建-->
      <div  v-if="step == 2">
        <div class="invoice-container">
          <div class="arrow-container " v-if="taxInvoicePreCreateTaxInvoiceDTOs.length > 1">
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
          <el-carousel trigger="click" :autoplay="false" height="800px" @change="arrowChange" ref='carouselRef'>
            <el-carousel-item v-for="(item, index) in taxInvoicePreCreateTaxInvoiceDTOs" :key="index">
              <editInvoiceItem :ref="'editInvoiceItemRef' + index" :item="item"></editInvoiceItem>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" plain @click="backList()">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="mini" @click="next()" v-if="step == 1">{{$t('common.nextStep')}}</el-button>
      <el-button type="primary" size="mini" @click="prevFn()" v-if="step == 2">{{$t('common.previousStep')}}</el-button>
      <el-button type="primary" size="mini" @click="saveInvoice()" :loading="saveLoading" v-if="step == 2">{{$t('common.save')}}</el-button>
    </div>
  </div>
</template>
<script>
import ApplyInvoiceConfig from '../components/ApplyInvoiceConfig.vue'
import { getApplyTaxDetailApi, getApplyTaxDetailChargeListApi } from "@/api/financial/fmsReceiveInvoice"
import { invoiceTaxPrecreateApi, invoiceTaxCreateApi, invoiceTaxToSubmitApi } from '@/api/financial/fmsReceiveInvoice'
import editInvoiceItem from './editInvoiceItem'
import ApplyInvoiceChargeDetail from '../components/ApplyInvoiceChargeDetail'

export default {
	name: "FmsTaxInvoiceMake",
	components: {
		ApplyInvoiceConfig,
		editInvoiceItem,
		ApplyInvoiceChargeDetail
	},
	props: {
		billInfo: {
			type: Object,
			default: function () {
				return {}
			}
		}
	},
	created() {
		this.id = this.$route.query.id
		this.getDetail()
	},
	data() {
		return {
			activeName: 'first',
			step: 1,
			id: '',

			active: 0,
			bill: {},
			tableData: [],
			loading: false,
			saveLoading: false,
			amountTotal: [],
			invoiceInfo: {},
			currentIndex: 1,
			taxInvoicePreCreateTaxInvoiceDTOs: []
		}
	},
	methods: {
		getDetail() {
			getApplyTaxDetailApi(this.id).then(res => {
				if (res.ok) {
					this.invoiceInfo = res.content
				}
			})

		},

		// 发票预创建相关操作
		arrowChange(index) {
			this.currentIndex = index + 1
		},
		prevFn() {
			this.step = 1
		},
		arrowPrev() {
			this.$refs.carouselRef.prev()
		},
		arrowNext() {
			this.$refs.carouselRef.next()
		},
		// 初始化 发票预创建
		next() {
			let data = {
				invoiceApplyId: this.id
			}
      this.loading = true
			invoiceTaxPrecreateApi(data).then(res => {
				if (res.ok) {
					this.step = 2
					this.currentIndex = 1
					this.taxInvoicePreCreateTaxInvoiceDTOs = res.content.taxInvoicePreCreateTaxInvoiceDTOs
				}
        this.loading = false
			})
		},
		// 保存
		saveInvoice() {
			let VR = true
			let data = {
				invoiceApplyId: this.id,
				newTaxInvoiceDTOs: []
			}
			this.taxInvoicePreCreateTaxInvoiceDTOs.forEach((v, index) => {
				let ref = this.$refs['editInvoiceItemRef' + index][0]
				// 一个个校验
				if (VR && ref.validate()) {
					data.newTaxInvoiceDTOs.push(ref.getValue())
				} else {
					VR = false
				}
			})
			if (VR) {
				this.saveLoading = true
				invoiceTaxCreateApi(data).then(res => {
					if (res.ok) {
						this.$confirm(this.$t("fmsReceiveInvoice.submitTaxInfo"), this.$t("fmsReceiveInvoice.saveSuccess"), {
							cancelButtonText: this.$t("common.cancel"),
							confirmButtonText: this.$t("fmsReceiveInvoice.submitTax")
						}).then(() => {
							this.submitFn(res.content)
						}).catch(() => {
							// 取消
							this.backList()
						});
					}
					this.saveLoading = false
				})
			}
		},
		submitFn(res) {
			let data = {
				invoiceIds: res
			}
      this.loading = true
			invoiceTaxToSubmitApi(data).then(res => {
        this.loading = false
				if (res.ok) {
					this.$alert(this.$t("fmsReceiveInvoice.submitSuccessInfo"), this.$t("fmsReceiveInvoice.submitSuccess"), {
						confirmButtonText: this.$t("common.close")
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
.page-edit-content {
	padding: 0;
}

.page-edit-content.pre {
	padding: 20px;
}

::v-deep .el-tabs__header {
	background: #fff;
	padding: 0 20px;
}
::v-deep .el-tabs__content {
	padding: 0 20px;
}

::v-deep .el-tabs__item {
	height: 50px;
	line-height: 50px;
}

.module {
	overflow: hidden;
	padding: 20px 0px;
	background: #fff;
	margin-bottom: 20px;
	border-radius: 5px;

	.title {
		font-size: 16px;
		font-weight: 600;
		border-bottom: 1px solid #f0f2f5;
		margin-bottom: 15px;
		padding: 0 20px 15px 20px;
	}
	.content {
		padding: 0 25px;
		overflow: hidden;
	}
	.img {
		display: block !important;
		border: 1px dashed #ccc;
		border-radius: 6px;
		width: 300px;
		height: 180px;
		line-height: 180px;
		text-align: center;
		cursor: pointer;
		padding: 0;
		float: left;

		img {
			width: 100%;
			height: 100%;
			-o-object-fit: conver;
			object-fit: conver;
		}
	}
	.item {
		width: 100%;
		float: left;
		margin-bottom: 15px;
		display: flex;

		label {
			width: 110px;
			display: block;
			text-align: right;
			margin-bottom: 15px;
			font-weight: 500;
			font-size: 14px;
			float: left;
			margin-right: 6px;
		}
		span {
			font-weight: 500;
			font-size: 14px;
			display: inline;
			flex: 1;
		}
	}
}

.blod {
	font-weight: 600 !important;
	font-style: normal;
	font-size: 16px !important;
	color: rgba(0, 0, 0, 0.8);
	height: 34px;
	line-height: 34px;
}

.name {
	padding-left: 26px;
	line-height: 60px;
	height: 60px;
	border-bottom: 1px solid #ddd;
}
.icon {
	color: #1890ff;
	font-size: 28px;
	margin-right: 5px;
}

.invoice-container {
	background: #fff;
	max-width: 1160px;
	position: relative;

	::v-deep .el-carousel .el-carousel__arrow {
		display: none !important;
	}

	.arrow-container {
		text-align: right;
		padding: 15px 15px 0 15px;
		line-height: 28px;
		overflow: hidden;
		position: absolute;
		right: 15px;
		top: 15px;
		z-index: 999;
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
