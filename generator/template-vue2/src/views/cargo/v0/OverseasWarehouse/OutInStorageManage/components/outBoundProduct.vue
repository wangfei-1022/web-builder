<template>
	<div>
		<div v-if="list.length > 0">
			<div class="service-item" :class="{'disabled':disabled}" v-for="item in list" :key="item.name">
				<el-row>
					<el-col :span="8" :sm="12" :lg="6">
						<el-radio v-model="checkedValue" :label="item.id" @change="$emit('change',$event)" :disabled="disabled">
							{{ $t("outInStorageManage.logicProductName") }}：
							{{ item.productName }}
						</el-radio>
					</el-col>
					<el-col :span="8" :sm="12" :lg="6">
						{{ $t("outInStorageManage.prescription") }}：
						{{ item.aging }}
						{{ $t("outInStorageManage.weekdays") }}
					</el-col>

					<div class="product-service-item" v-if="item.id === checkedValue && item.services && item.services.length > 0">
						<el-row v-for="(servicesItem, i) in item.services" :key="i">
							<el-col :span="2">
								{{ servicesItem.name }}
							</el-col>
							<el-col :span="16">
								<el-radio-group v-model="servicesItem.defaultVal" :disabled="disabled" >
									<el-radio
										v-for="(c, index) in servicesItem.childrenServices"
										:key="index"
										:label="c.code"
									>
										{{ c.name }}
									</el-radio>
								</el-radio-group>
							</el-col>
						</el-row>
					</div>
				</el-row>
			</div>
		</div>
		<div v-else class="service-item" >	{{ $t("outInStorageManage.empty_product_service") }}</div>
	</div>
</template>
<script>
export default {
	name: 'OutBoundProduct',
	props: {
		list: Array,
		productId: String,
		disabled: {
			type: Boolean,
			default: false
		}
	},
	created() { },
	data() {
		return {
			checkedValue: '',
			fileList: []
		}
	},
	watch: {
		productId: {
			handler(val) {
				this.checkedValue = val
			},
			immediate: true
		}
	},
	methods: {
		getValue() {
			// 获取到必须是切换之后的列表当中的产品。
			let serviceList = []
			let productItem = {}
			this.list.forEach(v => {
				if (v.id === this.checkedValue) {
					productItem = v
					v.services.forEach(item => {
						serviceList.push({
							serviceCode: item.code,
							quantity: 1,
							serviceContentJson: JSON.stringify({ values: [item.defaultVal] })
						})
					})
				}
			})
			return {
				productId: productItem.id,
				serviceList: serviceList
			}
		},
		validate() {
			let { productId } = this.getValue()
			if (!productId) {
				this.$alert(this.$t("outInStorageManage.please_select_service"), {
					confirmButtonText: this.$t("common.confirm")
				})
				return false
			}
			return true
		}
	}
}
</script>
<style scoped lang="scss">
.number {
	display: inline-block;
	width: 50%;
}
.el-form-item {
	margin: 0;
}
.el-row {
	margin-top: 15px;
}
.service-item {
	margin: 10px 0 20px 0;
	font-size: 14px;
	&.disabled .el-col {
		color: #c0c4cc;
	}
}
.product-service-item {
	margin-left: 30px;
	clear: both;
	margin-top: 25px;
	overflow: hidden;
}
</style>
