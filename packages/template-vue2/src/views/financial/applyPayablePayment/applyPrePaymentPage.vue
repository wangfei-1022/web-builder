<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="page-edit-content">
			<apply-payment-config :paymentInfo="paymentInfo" ref="applyPaymentConfigRef" role="OPERATORS" />
		</div>
		<div class="page-edit-footer">
			<el-button size="mini" plain @click="backList()">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="submitFn()">{{$t('common.submit')}}</el-button>
		</div>
	</div>

</template>
<script>
import ApplyPaymentConfig from "./components/ApplyPaymentConfig";
import { submitPaymentApplyApi, getPaymentApplyCopyInitApi } from "@/api/financial/fmsPayablePayment"

export default {
	name: "FmsPayableApplyPrePayment",
	components: {
		ApplyPaymentConfig
	},
	data() {
		return {
			origin: "",
      isOverSea: false,
      localServicePaymentType: '',
      paymentType: '',
      settlementOfficeId: "",
      settlementCompanyId: '',
			settlementCompanyName: "",
			loading: false,
			paymentInfo: {}
		};
	},
	created() {
    this.id = this.$route.query.id
    this.origin = this.$route.query.origin

    if(this.id) {
        getPaymentApplyCopyInitApi({ instructionId: this.id}).then(res => {
            if(res.ok) {
                res.content.applyPayAmounts.forEach(v => {
                   v.isNewAdd = true 
                })
                this.settlementOfficeId = res.content.settlementOfficeId
                this.settlementCompanyId = res.content.settlementCompanyId
                this.settlementCompanyName = res.content.settlementCompanyName
                this.isOverSea = res.content.isOverSea
                this.localServicePaymentType = res.content.localServicePaymentType
                
                this.paymentInfo = {
                    ...res.content,
                    amountTotal: res.content.applyPayAmounts
                }
            }
        })
    } else {
        this.paymentType = this.$route.query.paymentType ? Number(this.$route.query.paymentType) : ''
        this.settlementOfficeId = this.$route.query.settlementOfficeId
        this.settlementCompanyId = this.$route.query.settlementCompanyId
        this.settlementCompanyName = this.$route.query.settlementCompanyName
        
        this.isOverSea = this.$route.query.isOverSea
        this.localServicePaymentType = this.$route.query.localServicePaymentType

        this.paymentInfo = {
            isOverSea: this.isOverSea,
            settlementCompanyId: this.settlementCompanyId,
            settlementCompanyName: this.settlementCompanyName,
            paymentType: this.paymentType,
            amountTotal: [{
                isNewAdd: true
            }]
        }
    }
	},
	methods: {
		// 提交
		submitFn() {
			if (this.$refs.applyPaymentConfigRef.validate()) {
				let data = this.$refs.applyPaymentConfigRef.getValue();
        data.settlementOfficeId = this.settlementOfficeId
        data.settlementCompanyId = this.settlementCompanyId
        data.localServicePaymentType = this.localServicePaymentType
        this.loading = true;
        submitPaymentApplyApi(data).then(res => {
          if (res.ok) {
            this.successInfo = {
              ...res.content
            };
            this.submitSuccessFn()
          }
          this.loading = false;
        }).catch(() => {
					this.loading = false;
				});
			} else {
        // 滚动到 校验未通过的位置
        this.mixinsFormScrollIntoView()
      }
		},
    submitSuccessFn() {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('common.mention'),
        message: h('div', { class: 'create-bill'}, [
          h('i', { class: 'iconfont icon-yanzhengchenggong' }),
          h('div', { class: 'render' }, this.$t('fmsPayablePayment.submitSuccess')),
          h('div', { class: 'bill-no-info' }, [
            h('span', null, this.$t('fmsPayablePayment.applyPaymentNo')),
            h('a', { class: 'link', on: { click: this.applyInvoiceDetail } }, this.successInfo.instructionNo)
          ])
        ]),
        showCancelButton: false,
        confirmButtonText: this.$t('common.confirm'),
        beforeClose: (action, instance, done) => {
          done();
          this.backList()
        }
      });
    },
    // 开票申请提交之后 可查看申请详情
		applyInvoiceDetail() {
      let id = this.successInfo.id
      this.$msgbox.close()
      this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({
        name: 'FmsPayablePaymentApplyDetail',
        query: {
          id: id,
          origin: this.origin
        }
      });
		},
		backList() {
			// 通过配置进行回调的
			if (this.origin) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.origin });
			}
		}
	}
};
</script>
<style lang="scss" scoped>
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

.total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 50px;
	line-height: 50px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 50px;
		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}

::v-deep .el-table th {
	background: #f5f7fa;
	height: 50px;
}
.edit-container {
	border: 1px solid #dedede;
}
.tilte-line {
	line-height: 50px;
	height: 50px;
	background: #f5f7fa;
	margin-bottom: 15px;
	border-bottom: 1px solid #dedede;
	border-top: 1px solid #dedede;

	.title-name {
		padding-left: 40px;
	}
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
			-o-object-fit: cover;
			object-fit: cover;
		}
	}
	.item {
		width: 100%;
		float: left;
		display: flex;
		margin-bottom: 10px;
		height: 35px;
		line-height: 35px;

		label {
			width: 130px;
			display: block;
			text-align: right;
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

.set-padding {
	padding: 20px;
}

.blod {
	font-weight: 600 !important;
	font-style: normal;
	font-size: 16px !important;
	color: rgba(0, 0, 0, 0.8);
}

.name {
	height: 50px;
	line-height: 50px;
	border-bottom: 1px solid #ddd;
}
.icon {
	color: #1890ff;
	font-size: 28px;
	margin-right: 5px;
}
.invoice-radio .el-radio {
	width: 100%;
	height: 36px;
	line-height: 36px;
}
.set-invoice-container {
	width: 250px;
}
.set-blue-color {
	color: #108ee9;
}
.has-select {
	padding-left: 10px;
	height: 40px;
	line-height: 40px;
	background: rgba(16, 142, 233, 0.1);
	font-size: 14px;
}

::v-deep .el-step__head.is-success {
	color: #fff;
	border-color: #1890ff;

	.el-step__icon.is-text {
		background: #1890ff;
	}
}
::v-deep .el-step__title.is-success,
::v-deep .el-step__description.is-success {
	color: #1890ff;
}
::v-deep .el-step__head.is-process {
	color: #c0c4cc;
	border-color: #c0c4cc;

	.el-step__icon.is-text {
		color: #c0c4cc;
	}
}
::v-deep .el-step__title.is-process {
	color: #c0c4cc;
}
::v-deep .el-step__description.is-process {
	color: #c0c4cc;
}

.create-bill {
	text-align: center;
	background: #fff;

	i {
		font-size: 40px;
		color: rgb(82, 196, 26);
	}
	.render {
		font-weight: 650;
		font-style: normal;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.847058823529412);
		line-height: 32px;
	}
	.bill-no-info {
		font-weight: 400;
		font-style: normal;
		text-align: center;
		line-height: 22px;
		margin-bottom: 40px;
	}
	.link {
		color: #108ee9;
		text-decoration: underline;
		margin-left: 10px;
	}
}
</style>

