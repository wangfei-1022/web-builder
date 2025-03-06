<template>
	<div class="page-edit-container full-page">
		<div class="custmer-detail page-edit-content">
      <base-info :recordItem="recordItem"></base-info>
      <trans-info :recordItem="recordItem" :claimList="claimList"></trans-info>
      <audited-info ref="auditedInfoRef" v-if="recordItem.id" :recordItem="recordItem" type='AUDITED'></audited-info>
		</div>
		<div class="page-edit-footer">
			<el-button size="mini" plain @click="backList">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="confrimFn" :loading="confirmLoading">{{$t('common.confirm')}}</el-button>
		</div>
	</div>
</template>

<script>
import BaseInfo from './components/BaseInfo'
import TransInfo from './components/TransInfo'
import AuditedInfo from './components/AuditedInfo'
import mixin from './components/detailMixin'
import {
  auditApplyTransApi, // 财务审核通过
  rejectApplyTransApi // 财务拒绝
} from "@/api/financial/rechargeRecord";

export default {
	name: "RechargeRecordDetail",
	components: {
		BaseInfo,
    TransInfo,
    AuditedInfo
	},
  mixins: [mixin],
	data() {
		return {
			loading: false,
      confirmLoading: false
		}
	},
	methods: {
    backList() {
      if (this.origin) {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: this.origin, query: { refresh: true } });
      }
    },
    confrimFn() {
      if (this.$refs.auditedInfoRef.validate()) {
        let formData = this.$refs.auditedInfoRef.getValue()
        if (formData.resCode === 1) {
            let data = {
              id: this.id,
              ...formData
            }
            this.confirmLoading = true
            auditApplyTransApi(data).then(res => {
              this.confirmLoading = false
              if (res.ok) {
                this.$message.success(this.$t("rechargeRecord.auditSuccss"))
                this.backList()
              }
            })
        } else {
          this.confirmLoading = true
          let data = {
            id: this.id,
            confirmedFailedReason: formData.confirmedRemarks,
            confirmedRemarks: formData.confirmedRemarks
          }
          rejectApplyTransApi(data).then(res => {
            this.confirmLoading = false
            if (res.ok) {
              this.$message.success(this.$t("rechargeRecord.rejectSuccss"))
              this.backList()
            }
          })
        }
      }
    }
	}
}
</script>
<style lang="scss" scoped>

</style>
