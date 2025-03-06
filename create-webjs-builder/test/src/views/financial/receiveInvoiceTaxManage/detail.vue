<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
       <el-tabs v-model="activeName"  style="padding:0px 20px 50px 20px;">
          <el-tab-pane :label="$t('fmsReceiveInvoice.invoiceInfo')" name="INFO" v-if="invoiceType != 3">
            <div class="invoice-container">
              <invoice-item-detail :item="invoiceItem"/>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('fmsReceiveInvoice.chargeInfo')" name="CHARGE">
            <invoice-charge-detail :id="id"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('fmsReceiveInvoice.invoiceFileRelative')" name="FILE">
            <invoiceFile :id="id"/>
          </el-tab-pane>
      </el-tabs>
    </div>
     <div class="page-edit-footer">
        <el-button type="primary" size="mini" plain @click="backList()">{{$t('common.close')}}</el-button>
    </div>
  </div>

</template>
<script>
import { getTaxInvoiceFilesApi, getCommercialInvoiceFilesApi, getTaxInvoiceDetailApi } from "@/api/financial/fmsReceiveInvoice"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import InvoiceItemDetail from '../components/InvoiceItemDetail'
import InvoiceChargeDetail from '../components/InvoiceChargeDetail'
import invoiceFile from './components/invoiceFile'

export default {
	name: "FmsTaxInvoiceDetail",
	data() {
		return {
			id: '',
			activeName: '',
			bill: {},
			tableData: [],
			loading: false,
			invoiceItem: {}
		}
	},
	components: {
		InvoiceItemDetail,
		InvoiceChargeDetail,
		invoiceFile
	},
	created() {
		this.id = this.$route.query.id
		this.invoiceType = Number(this.$route.query.invoiceType)
		if (this.invoiceType === 3) {
			this.activeName = 'CHARGE'
		} else {
			this.activeName = 'INFO'
		}
		this.getDetail()
	},
	methods: {
		downloadFilePdf(url) {
			this.downloadFile({ url: url })
		},
		getDetail() {
			if (!this.id) {
				return
			}
			getTaxInvoiceDetailApi(this.id).then(res => {
				if (res.ok) {
					this.invoiceItem = res.content
				}
			})
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)

			let backPath = this.$route.query.backPath
			let businessType = this.$route.query.businessType
			let name = 'FmsTaxInvoiceListFinance'
			if (businessType && backPath) {
				name = backPath
			}
			this.$router.push({ name: name })
		}
	}
}
</script>
<style lang="scss" scoped>
.page-edit-container .page-edit-content {
	padding: 0;
	background: #fff;
}

.img-container {
	.img-block {
		float: left;
		margin-right: 15px;
		margin-bottom: 15px;

		.demonstration {
			display: block;
			color: #8492a6;
			font-size: 14px;
			margin-bottom: 15px;
			text-align: center;
		}
		.el-image {
			width: 300px;
			height: 200px;

			::v-deep .image-slot {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				background: #f5f7fa;
				color: #909399;
				font-size: 14px;
			}
		}
	}
}
.invoice-container {
	background: #fff;
	max-width: 1160px;
}
</style>

