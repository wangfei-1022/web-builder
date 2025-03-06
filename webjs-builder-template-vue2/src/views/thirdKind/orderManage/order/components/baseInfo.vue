<template>
<div>
  <el-row :gutter="20">
    <el-col :span=" small ? 8 : 6 ">
      <el-form-item :label="getZH('client')" class="relative" prop="customerId" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('client') }]">
        <span v-if="isDisabled" class="text-ellipsis">{{ formData.customerName || '-' }}</span>
        <type-select
            v-else
            :defaultDisplay="formData.customerName" 
            :clearable="false" 
            :request-params="{businessType: formData.businessType, businessDate: formData.businessDate}" 
            type="customer" 
            v-model="formData.customerId" 
            @selected="customerSelected" 
        ></type-select>
        <span v-if="!validContractFlag && $isNotEmpty(formData.customerId)" class="cantractEmptyTips fc-red text-ellipsis">{{getZH('cantractEmptyTips')}}</span>
      </el-form-item>
    </el-col>
    <el-col :span=" small ? 8 : 6 ">
      <el-form-item :label="getZH('sellerName')" prop="sellerName" :class="isDisabled ? 'mb-0':''">
        <span v-if="isDisabled" class="text-ellipsis">{{ formData.sellerName || '-' }}</span>
        <el-input disabled v-else v-model="formData.sellerName" :placeholder="inputZH('sellerName')" size="mini" />
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
  <el-col :span=" small ? 8 : 6 ">
  <el-form-item :label="getZH('contactCnName')" prop="contactCnName" :class="isDisabled ? 'mb-0':''">
    <span v-if="isDisabled">{{ formData.contactCnName || '-' }}</span>
    <el-input v-else v-model="formData.contactCnName" :placeholder="inputZH('contactCnName')" size="mini" />
  </el-form-item>
  </el-col>
  <el-col :span=" small ? 8 : 6 ">
  <el-form-item :label="getZH('contactMobile')" prop="contactMobile" :class="isDisabled ? 'mb-0':''">
    <span v-if="isDisabled">{{ formData.contactMobile || '-' }}</span>
    <el-input v-else v-model="formData.contactMobile" :placeholder="inputZH('contactMobile')" size="mini" />
  </el-form-item>
  </el-col>
  <el-col :span=" small ? 8 : 6 ">
  <el-form-item :label="getZH('contactEmail')" prop="contactEmail" :class="isDisabled ? 'mb-0':''" :rules="[{ validator: $validators.checkEmail, trigger: 'blur' }]">
    <span v-if="isDisabled">{{ formData.contactEmail || '-' }}</span>
    <el-input v-else v-model="formData.contactEmail" :placeholder="inputZH('contactEmail')" size="mini" />
  </el-form-item>
  </el-col>
  </el-row>
</div>
</template>

<script>
import { getCrmCustomerLinkmanApi, getCrmCustomerContractReceiptApi } from '@/api/thirdKind'
import getZHMixin from './getZHMixin'
export default {
	name: 'BaseInfo',
	mixins: [getZHMixin],
	props: {
		formData: {
			type: Object,
			required: true
		},
		isDisabled: {
			type: Boolean,
			default: false
		},
		small: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			validContractFlag: true
		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		/**
 * 委托单位变更
 */
		customerSelected(data) {
			if (this.$isNotEmpty(data)) {
				this.formData.customerName = data.chineseName
				this.getCrmCustomerLinkmanFn()
				this.verifyContract()
			}
		},
		/**
		 * 验证是否存在有效合同
		 */
		async verifyContract() {
			let data = {
				businessDate: this.formData.businessDate,
				businessType: this.formData.businessType,
				memberId: this.formData.customerId
			}
			let res = await getCrmCustomerContractReceiptApi(data)
			if (res.ok) {
				this.validContractFlag = this.$isNotEmpty(res.content)
			}
		},
		/**
		 * 获取客户联系人信息
		 */
		async getCrmCustomerLinkmanFn() {
			this.loading = true
			let data = {
				customerId: this.formData.customerId,
				businessDate: this.formData.businessDate
			}
			let res = await getCrmCustomerLinkmanApi(data)
			if (res.ok) {
				let data = {
					contactCnName: null,
					contactEmail: null,
					contactMobile: null,
					sellerId: null,
					sellerName: null
				}
				this.$copyProps(data, res.content)
				this.$copyProps(this.formData, data)
			}
			this.loading = false
		}
	}
};
</script>

<style scoped lang="less">
.text-ellipsis {
	display: block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.cantractEmptyTips {
	position: absolute;
	font-size: 12px;
	height: 18px;
	line-height: 18px;
}
</style>
