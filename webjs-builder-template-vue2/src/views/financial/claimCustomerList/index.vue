<template>
  <el-tabs type="border-card" class="top-tabs">
    <el-tab-pane :label="$t('uexpressClaim.FINANCE_WAIT_PAY') + '(' + toPayCount + ')'">
      <claim-list role='FINANCE' type="FINANCE_WAIT_PAY"></claim-list>
    </el-tab-pane>
    <el-tab-pane :label="$t('uexpressClaim.FINANCE_WAIT_OFFSET') + '(' + toOffsetCount + ')'" lazy>
      <claim-list role='FINANCE' type="FINANCE_WAIT_OFFSET"></claim-list>
    </el-tab-pane>
     <el-tab-pane :label="$t('uexpressClaim.FINANCE_ALL')" lazy>
      <claim-list role='FINANCE' type="FINANCE_ALL"></claim-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import claimList from '@/views/uexpress/claimCustomerList/index'
import { getClaimCustomerCountApi } from "@/api/uexpress/claimCustomerList"

export default {
	name: "FmsClaimCustomerList",
	components: {
		claimList
	},
	data() {
		return {
			loading: false,
			toPayCount: '0',
			toOffsetCount: '0'
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			// 1 待赔付 2 待抵扣
			getClaimCustomerCountApi().then(res => {
				if (res.ok) {
					res.content.forEach(v => {
            if (v.toDoType === 1) {
              this.toPayCount = v.countToDo || 0
            }
             if (v.toDoType === 2) {
              this.toOffsetCount = v.countToDo || 0
            }
          })
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content{
  padding: 0;
}
</style>
