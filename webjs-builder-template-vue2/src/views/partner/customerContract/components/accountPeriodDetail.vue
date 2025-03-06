<template>
    <div class="module">
        <div class="title">{{ $t("contract.account_period_info") }}</div>
        <div class="content">
            <div class="item" v-if="(contractType == 1 || contractType == 3 || contractType == 10)">
                <label>{{ $t("contract.deposit") }}：</label>
                <span>{{item.deposit && item.deposit.amount}} {{item.deposit && item.deposit.currency}}</span>
            </div>
            <div class="item">
                <label>{{ $t("contract.recharge_currency") }}：</label>
                <span>{{ item.rechargeCurrency ? item.rechargeCurrency.join('、') : '' }}</span>
            </div>
            <div class="item">
                <label>{{ $t("contract.recharge_mode") }}：</label>
                <span>{{item.rechargeModeName}}</span>
            </div>
            <div class="item" v-if="item.billBaseType != -1 && (contractType == 1 || contractType == 3 || contractType == 10)">
                <label>{{ $t("contract.bill_base") }}：</label>
                <span>{{item.billBaseTypeName}} {{item.billOffsetTypeName}}</span>
            </div>
            <div class="item" v-if="item.statementBaseType != -1 && (contractType == 1 || contractType == 3 || contractType == 10)">
                <label>{{ $t("contract.statement_base") }}：</label>
                <span>{{item.statementBaseTypeName}} {{item.statementOffsetTypeName}}</span>
            </div>
            <div class="item" v-if="item.invoiceBaseType != -1 && (contractType == 1 || contractType == 3 || contractType == 10)">
                <label>{{ $t("contract.invoice_base") }}：</label>
                <span>{{item.invoiceBaseTypeName}} {{item.invoiceOffsetTypeName}}</span>
            </div>
            <div class="item" v-if="item.receiptBaseType != -1 && (contractType == 1 || contractType == 3 || contractType == 10)">
                <label>{{ $t("contract.receipt_base") }}：</label>
                <span>{{item.receiptBaseTypeName}} {{item.receiptOffsetTypeName}}</span>
            </div>
            <div class="item" v-if="item.paymentBaseType != -1 && (contractType == 2 || contractType == 20)">
                <label>{{ $t("contract.payment_base") }}：</label>
                <span>{{item.paymentBaseTypeName}} {{item.paymentOffsetTypeName}}</span>
            </div>
        </div>
    </div>
</template>
<script>


export default {
	name: 'AccountPeriodDetail',
	props: {
		item: {
			type: Object,
			default: function () {
				return {
					rechargeCurrency: []
				}
			}
		},
		contractType: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {}
	},
	created() { },
	methods: {}
};
</script>
<style scoped lang="scss">
.module {
	overflow: hidden;
	padding: 20px 0;
	background: #fff;
	border-radius: 5px;
	margin-bottom: 0px;

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
		width: 50%;
		float: left;
		margin-bottom: 15px;
		display: flex;
		line-height: 25px;

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
</style>
