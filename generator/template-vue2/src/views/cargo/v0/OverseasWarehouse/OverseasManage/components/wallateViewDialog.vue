<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="getZH('lookWallet')"
			width="800px"
			:close-on-click-modal="false"
		>
      <div class="dialog-content">
        <el-form v-if="dialogVisible" ref="formData" v-loading="loading" label-width="110px" label-position="left" :model="formData">
          <div class="content-title mb-10">{{ getZH('base_info') }}</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="getZH('customer_cName')">
                  <span>{{ formData.chineseName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="getZH('customerNumber')">
                  <span>{{ formData.no }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="getZH('customer_short_Name')">
                  <span>{{ formData.shortName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="getZH('customer_eName')">
                  <span>{{ formData.englishName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="getZH('sales_names')">
                  <span>{{formData.salesNames?formData.salesNames.join(","):''}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          <div class="content-title mb-10">{{ getZH('walletInfo') }}</div>
        <lbTable :column="columnFields" stripe :data="dataList" />
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn") }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { getConfigWallettApi, detailCustomerApi } from '@/api/OverseasWarehouse/overseasManage.js'
import getZHMixin from './getZHMixin'
export default {
	name: 'WallateViewDialog',
	mixins: [getZHMixin],
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			dataList: [],
			columnFields: [{
				prop: 'currency',
				label: this.getZH('currency')
			},
			{
				prop: 'amountSum',
				label: this.getZH('balance')
			},
			{
				prop: 'amountFrozenPaying',
				label: this.getZH('frozen_amount')
			},
			{
				prop: 'creditAmount',
				label: this.getZH('authorized_limit_contract')
			}
			]
		}
	},
	created() {

	},
	methods: {
		async init() {
			this.loading = true
			const res = await detailCustomerApi(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.formData = res.content
				this.loading = false
			} else {
				this.loading = false
			}
			let rs = await getConfigWallettApi(this.id)
			if (rs.ok) {
				this.dataList = rs.content || []
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData = {}
				this.init()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
