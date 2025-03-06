<template>
  <div>
    <el-dialog v-if="visible" :title="$t('fmsProfit.submitProfit')" :visible.sync="visible"  width="600px" :close-on-click-modal="false">
      <div v-for="(item, index) in settlementOfficeList" :key="index">
        <submit-profit-item ref="submitProfitItemRef" :item="item" batchable />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitFn" :loading="aduitLoading" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProfitAuditSettlementOfficeIdApi, getProfitAuditProfitPeroidApi } from "@/api/financial/fmsProfitAudit";
import { profitApplyAuditApi, profitApplyRejectApi } from "@/api/financial/fmsProfitAudit";
import SubmitProfitItem from './SubmitProfitItem'
export default {
	name: "ProfitApplyAuditDialog",
  components: {
    SubmitProfitItem
  },
  props: {
    batchable: {
      type: Boolean,
      default: false
    }
  },
	data() {
		return {
      visible: false,
      aduitLoading: false,
      settlementOfficeList: []
		};
	},
	methods: {
    hide() {
      this.visible = false
    },
    show(ids) {
      this.visible = true
      getProfitAuditSettlementOfficeIdApi({ ids: ids }).then(res => {
        if(res.ok) {
          let settlementOfficeIds = []
          res.content.forEach(v => {
            settlementOfficeIds.push(v.settlementOfficeId)
          })
          let officeList = res.content
          let data = {
            settlementOfficeIds: settlementOfficeIds
          }
          // 获取盈亏月份
          getProfitAuditProfitPeroidApi(data).then(res => {
            if(res.ok) {
              let settlementOfficeList = []
              res.content.forEach(v => {
                let index = officeList.findIndex(item => item.settlementOfficeId === v.settlementOfficeId)
                if(index >= 0) {
                  v.count = officeList[index].count
                }
              })
              this.settlementOfficeList = res.content
            }
          })
        }
      })
    },
    submitFn() {
      let VALID = true
      let profitPeriods = []
      Object.keys(this.$refs).forEach(key => {
        let refItem = this.$refs[key][0]
        if (refItem) {
          let v = refItem.validate()
          if (!v) {
            VALID = false
          }
          let id = refItem.getValue()
          profitPeriods.push(id)
        }
      })
      if (!VALID) {
        return
      }
      this.$emit('audit', profitPeriods)
		}
	}
};
</script>
<style lang="scss" scoped>

</style>

