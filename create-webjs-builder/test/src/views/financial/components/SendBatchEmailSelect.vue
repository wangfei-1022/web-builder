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
	getSendBillEmailListListApi,
	setSendBillEmailDefaultApi,
	setSendBillEmailRemoveDefaultApi,
	setSendBillEmailDeleteApi
} from "@/api/financial/fmsReceiveInvoice"
import { getPaymentMemonotifyEmailApi } from "@/api/financial/fmsPayablePayment";

export default {
	name: 'SendBillEmailSelect',
	props: {
		value: {
			type: [String, Array]
		},
		type: {
			type: [String],
      default: ''
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
		async loadAll() {
			if (this.settlementId) {
				let res = {}
        switch(this.type ) {
          case 'BILL':
            res = await getSendBillEmailListListApi({ settlementId: this.settlementId })
            break;
          case 'PAYMENT':
            res = await getPaymentMemonotifyEmailApi({ settlementId: this.settlementId })
            break;
          default:
            res = await getSendBillEmailListListApi({ settlementId: this.settlementId })
            break;
        }
        if (res.ok) {
          let arr = []
          if (res.content.list === undefined) {
            arr = res.content || []
          } else {
            arr = res.content.list || []
          }
          const optionsMap = {}
          let str = []
          arr.forEach(ex => {
            // ex.value = ex.email
            if (ex.defaultFlag) {
              str.push(ex.email)
            }
            optionsMap[ex[this.valueKey]] = ex
          })
          this.$emit('input', str.join(';'))
          this.optionsMap = optionsMap
          this.options = arr
          this.loading = false
        } else {
          this.loading = false
        }
			}
		},
		remoteMethod(queryString, cb) {
			const options = this.options;
			cb(options);
		},
		handleSelect(item) {
			this.$emit('selected', item || {})
      if (item.email) {
        let email = this.value
        let arr = email.split(';')
        if (arr.indexOf(item.email) < 0) {
          if (email.length > 0 && email.substr(email.length - 1, 1) !== ';') {
            email += ';'
          }
          email += item.email
          this.$emit('input', email)
        } else {
          // autocomplete 依赖item.vaule但是此处需要拼接选中的值 则单独处理
          this.$emit('input', '')
          this.$nextTick(() => {
            this.$emit('input', email)
          })
        }
      }
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
			setSendBillEmailRemoveDefaultApi(data).then(res => {
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
			setSendBillEmailDefaultApi(data).then(res => {
				if (res.ok) {
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
			setSendBillEmailDeleteApi(data).then(res => {
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
	min-width: 400px !important;
	max-width: 700px !important;
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
