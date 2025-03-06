<template>
  <el-autocomplete
    style="width: 100%"
    popper-class="my-autocomplete"
    v-model="modelValue"
    :loading="loading"
    :disabled="disabled"
    :fetch-suggestions="remoteMethod"
    :placeholder="placeholder"
    @change="changeFn"
    @select="handleSelect">
    <template slot-scope="{ item }">
      <div class="view-content">
        <div class="item">{{ item.email }}</div>
        <div class="item-oper">
          <i class="icon-set iconfont icon-yanzhengchenggong active" v-if="item.defaultFlag" @click="cancelDefault($event,item)"></i>
          <i class="icon-set iconfont icon-yanzhengchenggong" v-if="!item.defaultFlag" @click="setDefault($event,item)"></i>
          <i class="icon-set el-icon-delete" @click="deleteFn($event,item)"></i>
        </div>
      </div>
    </template>
  </el-autocomplete>
</template>
<script>
import {
	getApplyInvoiceNotifyCustomerListApi,
	setApplyInvoiceNotifyCustomerDefaultApi,
	setApplyInvoiceNotifyCustomerRemoveDefaultApi,
	setApplyInvoiceNotifyCustomerDeleteApi
} from "@/api/financial/fmsReceiveInvoice"

export default {
	name: 'NotifyCustomerSelect',
	props: {
		value: {
			type: [String, Array]
		},
		disabled: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default: '请输入关键词'
		},
		settlementId: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			modelValue: '',
			loading: false,
			options: [],
			map: {}
		}
	},
	watch: {
		value: {
			handler(newV, oldV) {
				this.modelValue = newV
			},
			immediate: true
		},
		settlementId: {
			handler(newV, oldV) {
				this.loadAll()
			},
			immediate: true
		}
	},
	created() {
		this.modelValue = this.value
	},
	methods: {
		loadAll() {
			if (this.settlementId) {
				getApplyInvoiceNotifyCustomerListApi({ settlementId: this.settlementId }).then(res => {
					if (res.ok) {
						let arr = []
						if (res.content.list === undefined) {
							arr = res.content || []
						} else {
							arr = res.content.list || []
						}
						const optionsMap = {}
						arr.forEach(ex => {
							ex.emailSubscribers = ex.email
							optionsMap[ex[this.valueKey]] = ex
						})
						this.optionsMap = optionsMap
						this.options = arr
						this.loading = false
					} else {
						this.loading = false
					}
				})
			}
		},
		remoteMethod(queryString, cb) {
			const options = this.options;
			cb(options);
		},
		handleSelect(item) {
			this.modelValue = item.emailSubscribers
			this.$emit('selected', item || {})
		},
		changeFn() {
			this.$emit('input', this.modelValue)
		},
		cancelDefault(e, item) {
			e.stopPropagation()
			e.preventDefault()
			let data = {
				settlementId: this.settlementId,
				seqNo: item.seqNo
			}
			setApplyInvoiceNotifyCustomerRemoveDefaultApi(data).then(res => {
				if (res.ok) {
					item.defaultFlag = false
					this.$message.success('取消默认成功')
				}
			})
		},
		setDefault(e, item) {
			e.stopPropagation()
			e.preventDefault()
			let data = {
				settlementId: this.settlementId,
				seqNo: item.seqNo
			}
			setApplyInvoiceNotifyCustomerDefaultApi(data).then(res => {
				if (res.ok) {
					this.options.forEach(v => {
						v.defaultFlag = false
					})
					item.defaultFlag = true
					this.$message.success('设置默认成功')
				}
			})
		},
		deleteFn(e, item) {
			e.stopPropagation()
			e.preventDefault()
			let data = {
				settlementId: this.settlementId,
				seqNo: item.seqNo
			}
			setApplyInvoiceNotifyCustomerDeleteApi(data).then(res => {
				if (res.ok) {
					let index = this.options.findIndex(v => v.seqNo === item.seqNo)
					if (index >= 0) {
						this.options.splice(index, 1)
					}
					this.$message.success('删除成功')
				}
			})
		}
	}
}
</script>
<style scoped lang="scss">
.cargo-advance-select {
	width: 100%;
}

.view-content {
	display: flex;
	justify-content: space-between;
}

.tip-count-options {
	padding-top: 10px;
	padding-left: 18px;
	font-size: 14px;
	color: rgb(192, 196, 204);
	height: 36px;
	top: 0px;
	background: rgb(252, 252, 252);
	z-index: 1000;
}

.item {
	float: left;
	flex: 1;
	padding: 0 5px;
}
.item-oper {
	float: left;
	width: 50px;
}
.active {
	color: #1890ff;
}
.icon-set {
	font-size: 20px;
	margin-right: 6px;
}
</style>
