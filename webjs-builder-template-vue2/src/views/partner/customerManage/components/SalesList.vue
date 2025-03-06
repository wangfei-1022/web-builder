<template>
  <div class="contact-table">
    <el-table ref="contactTable" :data="salesList" border style="width: 100%">
      <el-table-column prop="userName" :label='$t("customerManage.salesName")'></el-table-column>
      <el-table-column prop="startTime" :label='$t("customerManage.startTimeEffect")'>
        <template slot-scope="{row}">
          <span>{{row.startTime | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label='$t("customerManage.endTimeEffect")'>
        <template slot-scope="{row}">
          <span>{{row.endTime | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="changeReason" :label='$t("customerManage.changeReason")'></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getCustomerSalesListApi } from "@/api/partner/customerManage"

export default {
	name: "SalesList",
	props: {
		isDetail: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			contactTitle: "",
			salesList: []
		}
	},
	created() {
		this.getSalesListFn()
	},
	methods: {
		getSalesListFn() {
			if (this.id) {
				getCustomerSalesListApi(this.id).then(res => {
					if (res.ok) {
						res.content.forEach(x => {
							x.startTime = x.startTime === 0 ? null : x.startTime
						})
						this.salesList = res.content
					}
				})
			}
		}
	}
};
</script>
<style scoped lang="scss">
</style>
