<template>
    <el-dialog :title='$t("receiveFms.join_bill")' :visible.sync="visvible" width="600px">
        <div class="info-container">
            <div class="info-item">
                <label>{{$t("receiveFms.entity_no")}}</label>
                <span>{{order.entityNo}}</span>
            </div>
            <div class="info-item" v-if="type === 'CHARGE'">
                <label>{{$t("receiveFms.charge_name")}}</label>
                <span>{{order.feeItemName}}</span>
            </div>
            <div class="info-item" v-if="type === 'CHARGE_ORDER'">
                <label>{{$t("receiveFms.serial_no")}}</label>
                <span>{{order.confirmationNo}}</span>
            </div>
            <div class="info-item">
                <label>{{$t("receiveFms.warehouse_name")}}</label>
                <span>{{order.warehouseName}}</span>
            </div>
        </div>
        <el-form ref="addForm" :inline="true" :model="addForm" :rules="addFormRule" class="addForm">
            <el-form-item :label='$t("receiveFms.bill_no")' prop="billNo">
                <el-input v-model.trim="addForm.billNo" size="mini"/>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="visvible = false">{{$t('common.cancel')}}</el-button>
            <el-button size="mini" type="primary" @click="confirm()">{{$t('common.confirm')}}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { receiveChargeJoinBillApi, receiveConfirmationJoinBillApi } from "@/api/fmsReceiveOvl"

export default {
	name: "JoinBill",
	props: {
		id: String,
		type: String, // CHARGE 费用 CHARGE_ORDER 费用确认单
		order: {
			type: Object,
			default: function () {
				return {}
			}
		},
		list: {
			type: Function,
			default: function () { }
		}
	},
	watch: {

	},
	data() {
		return {
			visvible: false,
			addForm: {
				billNo: ''
			},
			addFormRule: {
				billNo: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "blur" }]
			}
		}
	},
	created() {

	},
	beforeMount() { },
	methods: {
		show() {
			this.addForm = {
				billNo: ''
			}
			this.visvible = true
		},
		confirm() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					if (this.type === 'CHARGE') {
						let data = {
							billNo: this.addForm.billNo,
							keepChargeIds: [this.id]
						}
						receiveChargeJoinBillApi(data).then(res => {
							if (res.ok) {
								this.visvible = false
								this.$message.success(this.$t("receiveFms.join_bill_success"))
								this.list()
							}
						})
					} else {
						let data = {
							billNo: this.addForm.billNo,
							confirmationIds: [this.id]
						}
						receiveConfirmationJoinBillApi(data).then(res => {
							if (res.ok) {
								this.visvible = false
								this.$message.success(this.$t("receiveFms.join_bill_success"))
								this.list()
							}
						})
					}
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.info-container {
	overflow: hidden;
	margin-bottom: 10px;

	.info-item {
		width: 50%;
		float: left;
		margin-bottom: 20px;

		label {
			font-weight: 500;
			margin-right: 10px;
		}
	}
}
.el-form-item {
	margin-bottom: 10px;
}
</style>

