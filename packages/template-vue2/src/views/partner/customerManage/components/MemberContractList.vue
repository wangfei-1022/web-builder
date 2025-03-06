<template>
	<div>
		<div class="module">
			<div class="title">{{ $t("contract.business_cooperation") }}</div>
			<div class="content">
				<div v-if="businessList.length > 0">
					<div class="business-item" v-for="(item, index) in businessList" :key="index">
						<div class="icon">
							<i :class="'iconfont ' + (iconMap[item.businessType] || 'icon-contentright')" />
						</div>

						<div class="item-info">
							{{item.businessTypeName}}
						</div>
						<div class="item-info">
							<span class="link" @click="showDetailFn(item.contractType, item.contractId)"> {{item.contractNo}}</span>
						</div>
						<div class="item-info">
							<label>{{ $t("contract.period_date") }}</label>
							<span>{{parseTime(item.periodBegin)}}-{{parseTime(item.periodEnd)}}</span>
						</div>
						<div class="item-info">
							<span :class="'STATUS-' + item.contractStatus">{{item.contractStatusName}}</span>
						</div>
						<div class="item-info">
							<label>{{ $t("contract.recharge_mode") }}</label>
							<span>{{item.rechargeModeName}}</span>
						</div>
						<div class="item-info" v-if="item.statementBaseType != -1 && (item.contractType == 1 || item.contractType == 3 || item.contractType == 10)">
							<label>{{ $t("contract.statement_base") }}</label>
							<span>{{item.statementBaseTypeName}} {{item.statementOffsetTypeName}}</span>
						</div>
						<div class="item-info" v-if="item.invoiceBaseType != -1 && (item.contractType == 1 || item.contractType == 3 || item.contractType == 10)">
							<label>{{ $t("contract.invoice_base") }}</label>
							<span>{{item.invoiceBaseTypeName}} {{item.invoiceOffsetTypeName}}</span>
						</div>
						<div class="item-info" v-if="item.receiptBaseType != -1 && (item.contractType == 1 || item.contractType == 3 || item.contractType == 10)">
							<label>{{ $t("contract.receipt_base") }}</label>
							<span>{{item.receiptBaseTypeName}} {{item.receiptOffsetTypeName}}</span>
						</div>
						<div class="item-info" v-if="item.paymentBaseType != -1 && (item.contractType == 2 || item.contractType == 20)">
							<label>{{ $t("contract.payment_base") }}</label>
							<span>{{item.paymentBaseTypeName}} {{item.paymentOffsetTypeName}}</span>
						</div>
					</div>
				</div>
				<div v-if="!businessList.length">{{$t("customerManage.noData")}}</div>
			</div>
		</div>

		<div class="module">
			<div class="title">{{ $t("contract.history_contract") }}</div>
			<div class="content">
				<el-table :data="historyContractList" style="width: 100%;" row-key="id" border size="mini">
					<el-table-column prop="index" :label='$t("contract.index")' min-width="50">
						<template slot-scope="{$index}">
							<span>{{$index +1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="contractTypeName" :label="$t('contract.contract_type')" min-width="100"></el-table-column>
					<el-table-column prop="businessType" :label="$t('contract.business_type')" min-width="180">
						<template slot-scope="scope">
							<span class="oh" :title="scope.row.businessType">{{scope.row.businessType}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="contractName" :label="$t('contract.contract_name')" min-width="220"></el-table-column>
					<el-table-column prop="contractNo" :label="$t('contract.contract_no')" min-width="200"> </el-table-column>
					<el-table-column prop="periodBegin" :label="$t('contract.period')" min-width="180">
						<template slot-scope="scope">
							<span>{{parseTime(scope.row.periodBegin)}}-{{parseTime(scope.row.periodEnd)}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="contractStatusName" :label="$t('contract.contract_status')" min-width="100">
						<template slot-scope="scope">
							<span :class="'STATUS-' + scope.row.contractStatus">{{scope.row.contractStatusName}}</span>
						</template>
					</el-table-column>
					<el-table-column fixed="right" prop="operationBtn" :label="$t('contract.operation')" min-width="60">
						<template slot-scope="scope">
							<a class="link" @click="showDetailFn(scope.row.contractType, scope.row.id)">{{$t('contract.view')}}</a>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :pageSizes="[10,20,50]" :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getHistory" />
			</div>
		</div>
	</div>

</template>
<script>
import { getCustomerHistoryContractApi, getCustomerBusinessApi } from "@/api/partner/customerManage";
import { getSupplierHistoryContractApi, getSupplierBusinessApi } from "@/api/supplierManage";
import { parseTime } from "@/utils";

export default {
	name: "MemberContractDetail",
	props: {
		id: {
			type: [String, Number],
			default: ""
		},
		type: {
			type: String,
			default: ""
		}
	},
	watch: {
		id: {
			handler(val) {
				if (val) {
					this.getDetail();
					this.getHistory();
				}
			},
			immediate: true
		}
	},
	data() {
		return {
			iconMap: {
				CUSTOM_CAPACITY: "icon-ship-baochuan", // 定制运力
				SEA_EXPORT: "icon-ship-baochuan",
				SEA_IMPORT: "icon-ship-baochuan",
				AIR_EXPORT: "icon-kongyun",
				AIR_IMPORT: "icon-kongyun",
				RAILWAY_BOOKING: "icon-jizhuangxiang", // 铁路订舱业务
				RAILWAY_RENTAL: "icon-cangku", // 铁路租箱业务
				OVERSEAS_WAREHOUSE: "icon-cangku", // 海外仓配业务
				INTERNATIONAL_LINE: "icon-contentright", // 国际专线业务
				SUPPLY_CHAIN_FINANCE: "icon-contentright" // 供应链金融
			},
			total: "",
			pageSize: 10,
			pageNum: 1,
			historyContractList: [],
			businessList: [] // 合作业务
		};
	},
	methods: {
		parseTime(value) {
			return value ? parseTime(value, "{y}/{m}/{d}") : "";
		},
		showDetailFn(contractType, id) {
      let name = ''
			let query = {
        id: id,
        contractType: contractType
      }
      if (contractType === 2 || contractType === 20) {
        name = 'CRMContractSupplierPaymentDetail'
        query.role = 'PRODUCT'
      } else {
        name = 'CRMContractCustomerReceiptDetail'
      }
      this.$router.push({
        name: name,
        query: query
      });
		},
		getDetail() {
			let fn = this.type === "CUSTOMER" ? getCustomerBusinessApi : getSupplierBusinessApi;
			fn(this.id).then(res => {
				if (res.ok) {
					this.businessList = res.content;
				}
			});
		},
		getHistory() {
			let data = {
				pageSize: this.pageSize,
				pageNum: this.pageNum,
				memberId: this.id
			};
			let fn = this.type === "CUSTOMER" ? getCustomerHistoryContractApi : getSupplierHistoryContractApi;
			fn(data).then(res => {
				if (res.ok) {
					res.content.list.forEach(x => {
						x.businessType = [];
						x.businessTypes.forEach(b => {
							x.businessType.push(b.businessTypeName);
						});
						x.businessType = x.businessType.join("、");
					});
					this.total = res.content.total;
					this.historyContractList = res.content.list;
				}
			});
		}
	}
};
</script>
<style scoped lang="scss">
.custmer-detail {
	font-size: 14px;

	::v-deep .el-table th > .cell {
		color: #555;
		font-size: 14px;
	}

	.module {
		overflow: hidden;
		padding: 20px 0;
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
			width: 50%;
			float: left;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 130px;
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
}
.is-spread {
	float: right;
	font-size: 14px;
	font-weight: 500;
	color: #1890ff;
	cursor: pointer;
}
.link {
	color: #1890ff;
	cursor: pointer;
}
.STATUS-30 {
	background: rgb(204, 225, 245);
	padding: 4px 13px;
	border-radius: 3px;
	color: rgb(21, 126, 223);
	height: 24px;
}
.STATUS-20 {
	background: rgb(251, 200, 200);
	padding: 4px 13px;
	border-radius: 3px;
	color: rgb(255, 0, 0);
	height: 24px;
}
.STATUS-40 {
	background: rgb(251, 231, 210);
	padding: 4px 13px;
	border-radius: 3px;
	color: rgb(255, 153, 51);
	height: 24px;
}
.business-item {
	overflow: hidden;
	-webkit-box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
	box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
	margin: 10px 0;
	padding: 20px;
	font-weight: 500;
	position: relative;
	background: rgb(250, 250, 250);
	padding-left: 70px;
	border-radius: 10px;
	font-size: 15px;

	.icon {
		position: absolute;
		left: 20px;
		width: 30px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		top: 13px;
		background: #1890ff;
		border-radius: 5px;
		i {
			font-size: 20px;
			color: white;
		}
	}

	.item-info {
		width: 25%;
		float: left;
		height: 40px;
		display: flex;

		label {
			text-align: right;
			font-weight: 500;
			font-size: 14px;
			margin-right: 18px;
			float: left;
			min-width: 56px;
		}
		span {
			font-size: 14px;
		}
	}
}

.oh {
	display: block;
	min-width: 150px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
