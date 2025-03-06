<template>
  <div>
    <el-dialog :visible.sync="dialogVisible"	:title="$t('warehouse.add_logistics_product')" width="550px" :close-on-click-modal="false">
      <el-form v-if="dialogVisible" ref="formData" label-width="110px" label-position="left" :model="formData">
        <el-form-item
          :label="$t('warehouse.logistics_product')"
          prop="productCode"
          :rules="[
            {required:true,message: $t('warehouse.please_select_logistics_product')}
          ]"
        >
          <SelectFilter
            v-model="formData.productCode"
            size="mini"
            :placeholder="$t('warehouse.logistics_product_desc')"
            name-key="productName"
            value-key="productCode"
            :options="productList"
            :filter-keys="['productCode', 'productName']"
            @change="selectChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('warehouse.logistics_product_code')"
          :rules="[
            {required:true,message: $t('warehouse.please_select_logistics_product')}
          ]"
          prop="productCode"
        >
          <span>{{ formData.productName }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('warehouse.logistics_company_name')"
          :rules="[
            {required:true,message: $t('warehouse.please_select_logistics_product')}
          ]"
          prop="logisticsCompanyName"
        >
          <span>{{ formData.logisticsCompanyName }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveForm('formData')"> {{$t('warehouse.confirm')}} </el-button>
        <el-button size="mini" @click="dialogVisible = false"> {{$t('warehouse.cancel')}} </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProductListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
export default {
	name: 'AddProductDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		dataList: Array
	},
	data() {
		const defaultForm = {
			id: null,
			productCode: '',
			productName: '',
			logisticsCompanyName: '',
			carrierId: ''
		}
		return {
			defaultForm,
			dialogVisible: false,
			productList: [],
			formData: this.$extends(true, {}, defaultForm)
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData = this.$extends(true, {}, this.defaultForm)
				this.init()
			}
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 获取物流产品列表数据
		 */
		async init() {
			const res = await getProductListApi({
				pageSize: 1000,
				pageNum: 1
			})
			if (res.ok) {
				const arr = res.content.list || []
				console.log(this.dataList)
				this.productList = arr.filter(item => this.$isEmpty(this.dataList.find(data => data.id === item.id)))
			}
		},
		/**
		 * 保存物流产品
		 */
		saveForm(refName) {
			this.loading = true
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.loading = false
					return false
				}
				this.loading = false
				this.$emit('saved', this.formData)
				this.dialogVisible = false
			})
		},
		/**
		 * 选中
		 */
		selectChange(val) {
			const itemData = this.productList.find(item => item.productCode === val)
			this.$copyProps(this.formData, itemData)
		}
	}

}
</script>

<style>
</style>
