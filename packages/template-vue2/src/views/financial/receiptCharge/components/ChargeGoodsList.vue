<template>
  <div class="goods-list">
    <div class="goods-oper">
			<transition name="bounce">
				<div class="goods-list" v-if="showGoodsList && goodsList.length">
					<div class="goods-list-title">
						<span>
							<span class="icon iconfont icon-dingdandingdanmingxishouzhimingxi"></span>
							{{$t('receiveFms.charge_detail')}}
						</span>
						<span style="font-size:12px;">{{$t('receiveFms.totoalCount', { len: goodsList.length })}}</span>
						<span style="float: right">
              <!--一键清除-->
							<el-button size="mini" type="primary" @click="clearGoodsList()">{{$t('receiveFms.removeGoodsList')}}</el-button>
							<el-button size="mini" type="primary" @click="createBill()" v-permission="['fms:receive:charge:create:bill']">{{$t('receiveFms.create_bill')}}</el-button>
							<el-button size="mini" type="primary" @click="receiveCleared()" v-if="arap === 'AP'">{{$t('receiveFms.receive_cleared')}}</el-button>
							<el-button size="mini" type="primary" @click="receiveCancelCleared()" v-if="arap === 'AP'">{{$t('receiveFms.receive_cancel_cleared')}}</el-button>
              <!--移出账单-->
              <el-button size="mini" type="primary" @click="removeChargeFromBill()">{{$t('receiveFms.removeBill')}}</el-button>
              <!--加入账单-->
              <el-button size="mini" type="primary" @click="joinChargeToBill()">{{$t('receiveFms.join_bill')}}</el-button>
              <!--申请开票-->
              <el-button size="mini" type="primary" @click="applyInvoice()" v-if="arap === 'AR'">{{$t('receiveFms.applyInvoice')}}</el-button>
              <!--申请核销-->
              <el-button size="mini" type="primary" @click="applyOrHedgeClear(false)" v-if="arap === 'AR'">{{$t('receiveFms.applyClear')}}</el-button>
              <!--对冲核销-->
              <el-button size="mini" type="primary" @click="applyOrHedgeClear(true)" v-if="arap === 'AR' && false">{{$t('receiveFms.hedgeClear')}}</el-button>
              <i class="el-icon-close" @click="showGoodsList = false"></i>
						</span>
					</div>
					<el-table size="mini" :data="goodsList" style="width: 100%;" row-key="id" border height="310">
						<el-table-column type="index" :label="$t('receiveFms.index_no')" min-width="50"></el-table-column>
						<el-table-column prop="entityNo" :label="$t('receiveFms.entity_no')" min-width="200"></el-table-column>
						<el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')" min-width="120"></el-table-column>
						<el-table-column prop="currency" :label="$t('receiveFms.curreny')" min-width="60"></el-table-column>
						<el-table-column prop="entryAmount" :label="$t('receiveFms.amount')" min-width="100">
							<template slot-scope="{ row }">
								<div style="text-align: right;">{{formatNumberToThousands(row.entryAmount)}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="oper" :label="$t('receiveFms.operation')" min-width="50">
							<template slot-scope="{ row }">
								<span class="link" @click="removeSelected(row.id)">{{$t('receiveFms.remove')}}</span>
							</template>
						</el-table-column>
					</el-table>
					<div class="page-total">
						<span>{{type === 'AR' ? $t('receiveFms.receive_sum'): $t('payableFms.payable_sum')}}：</span>
						<span>
							<span class="value-item" v-for="(item, index) in selectedAmountTotal" :key='index'>
								<span class='value'>{{item.currency}}</span>
								<span>{{item.value}}</span>
							</span>
						</span>
					</div>
				</div>
			</transition>
		</div>

		<div class="goods-oper">
			<transition name="el-zoom-in-bottom">
				<el-badge :value="goodsList.length" :max="99" class="item" v-if="!showGoodsList && goodsList.length">
					<div class="goods" @click="showGoodsFn">
						<i class="el-icon-s-order" />
					</div>
				</el-badge>
			</transition>
		</div>
  </div>
</template>
<script>
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "ChargeGoodsList",
	props: {
		arap: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
      // 加入购物车
			goodsList: [],
      showGoodsList: false,
      selectedAmountTotal: []
    }
	},
	methods: {
    showGoodsFn() {
			this.showGoodsList = true;
		},
    addGoodsCommonFn(rows) {
			let arrSelect = [];
			rows.forEach(v => {
				let index = this.goodsList.findIndex(item => item.id === v.id);
				if (index < 0) {
					arrSelect.push(v);
				}
			});
			this.goodsList = this.goodsList.concat(arrSelect);
			let map = {};
			this.goodsList.forEach(v => {
				map[v.currency] = Number(map[v.currency] || 0) + Number(v.entryAmount || 0) * 100;
			});
			let arr = [];
			Object.keys(map).forEach(v => {
				arr.push({
					currency: v,
					value: formatNumberToThousands(map[v] / 100)
				});
			});
			this.selectedAmountTotal = arr;
		},
		formatNumberToThousands(value) {
			return formatNumberToThousands(value)
		},
		closeFn() {
			this.$emit('close')
		},
		createBill() {
			this.$emit('createBill', 'SELECTED', this.goodsList)
		},
		// 一键清除
		clearGoodsList() {
			this.goodsList = [];
		},
    removeChargeFromBill() {
      this.$emit('removeChargeFromBill', 'SELECTED', this.goodsList)
    },
    joinChargeToBill() {
      this.$emit('joinChargeToBill', 'SELECTED', this.goodsList)
    },
    receiveCancelCleared() {
      this.$emit('receiveCancelCleared', 'SELECTED', this.goodsList)
    },
    applyInvoice() {
       this.$emit('applyInvoice', 'SELECTED', this.goodsList)
    },
		receiveCleared() {
			this.$emit('receiveCleared', 'SELECTED', this.goodsList)
		},
    removeSelected(id) {
			let index = this.goodsList.findIndex(item => item.id === id);
			if (index >= 0) {
				this.goodsList.splice(index, 1);
			}
			let map = {};
			this.goodsList.forEach(v => {
				map[v.currency] = Number(map[v.currency] || 0) + v.entryAmount;
			});
			let arr = [];
			Object.keys(map).forEach(v => {
				arr.push({
					currency: v,
					value: formatNumberToThousands(map[v])
				});
			});
			this.selectedAmountTotal = arr;
		},
    applyOrHedgeClear(flag) {
      this.$emit('applyOrHedgeClear', flag, 'SELECTED', this.goodsList)
    }
	}
}
</script>
<style lang="scss" scoped>
.goods-oper {
	position: fixed;
	bottom: 70px;
	right: 30px;
	z-index: 999;

	.goods {
		height: 50px;
		width: 50px;
		background: #1890ff;
		border-radius: 50px;
		box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.5);
		font-size: 36px;
		line-height: 50px;
		text-align: center;
		color: #fff;
	}

	.goods-list {
		border-radius: 5px;
		height: 400px;
		background: #fff;
		padding-top: 10px;
		text-align: left;
		box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.5);

		.goods-list-title {
			padding: 0px 8px;
			margin-bottom: 10px;
			overflow: hidden;
			line-height: 28px;
			font-size: 18px;
		}
		.icon-dingdandingdanmingxishouzhimingxi {
			font-size: 24px;
			color: #1890ff;
		}

		ul {
			margin: 0;
			padding: 0;
		}
	}

	.el-icon-close {
		font-size: 22px;
		cursor: pointer;
	}
}


.bounce-enter-active {
	animation: bounce-in 0.5s;
}
.bounce-leave-active {
	animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.25);
	}
	100% {
		transform: scale(1);
	}
}
</style>

