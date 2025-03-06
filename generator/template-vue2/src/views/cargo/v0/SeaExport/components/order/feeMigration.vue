<template>
  <el-dialog :visible.sync="feeMigrationDialog" v-if="feeMigrationDialog" :title="$t('sea.feeMigration')" width="700px" :before-close="closefeeMigrationDialog" v-loading="loading">
    <div>{{ $t('sea.pleaseCheckTheNeedTo') }}<span style="font-weight: 700;color: rgba(255,0,0,0.65); font-size: 16px">{{ feeMigrationForm.confirmationNo }}</span>{{ $t('sea.transferInTheSelectedConfirmation') }}</div>
    <el-form ref="feeMigrationForm" :model="feeMigrationForm" style="margin-top: 10px;">
      <el-form-item  :label="$t('sea.transferInConfirmation')" prop="confirmationIdTo" size="mini" :rules="[{ required: true, message: this.$t('sea.pleaseSelectTransferInConfirmation'), trigger: 'blur' }]">
        <el-select  v-model="feeMigrationForm.confirmationIdTo" size="mini">
          <el-option v-for="item in feeMigrationForm.confirmationIdToOps" :key="item.confirmationId" :label="item.confirmationNo" :value="item.confirmationId"></el-option>
        </el-select>
      </el-form-item>
      <el-table class="case-data-table" :data="feeMigrationForm.cargoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="feeItemName" :label="$t('sea.feeName')" align="center" width="150" ></el-table-column>
        <el-table-column prop="currency" :label="$t('sea.currency')" align="center" ></el-table-column>
        <el-table-column prop="amount" :label="$t('sea.expenseAmount')" align="center"  ></el-table-column>
      </el-table>
    </el-form>
    <div v-if="multipleSelectionLength" style="color: red; margin: 10px 0">{{ $t('sea.allExpenseItemsWillBeMigratedTo') }}</div>
    <div class="footer-btn">
      <el-button type="primary" size="small" @click="addFeeMigration">{{ $t('sea.newExpenseConfirmation') }}</el-button>
      <el-button type="primary" size="small" @click="submitfeeMigration">{{ $t('sea.toChangeInto') }}</el-button>
      <el-button size="small" @click="closefeeMigrationDialog">{{ $t('common.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import URL from '@/api/urlTranslator'
import ExpensesCostList from "./expensesCostList"
import ExpensesCostDetails from "./expensesCostDetails"
import {
  chargeMoveApi,
  chargeMoveToNewApi,
  chargeSpecialMoveToNewApi,
  chargeSpecialRemoveApi,
  confirmationChargeCommonDetailApi,
  confirmationChargeDeleteApi,
  confirmationNoListApi,
  confirmationNosByEntityNoApi,
  confirmationPayCommonDetailApi,
  confirmationPayEntityNoApi,
  confirmationPayNoListApi,
  confirmationSpecialDeleteApi, payMoveApi, payMoveToNewApi, paySpecialMoveToNewApi, paySpecialRemoveApi
} from "@/api/seaExportOrder"
export default {
  name: 'FeeMigration',
  components: {ExpensesCostList, ExpensesCostDetails},
  props: {
    feeMigrationDialog: { type: Boolean, default: null },
    row: { type: Object, default: () => {}},
    isList: { type: Boolean, default: true },
    userInfo: { type: Object, default: () => {}},
    feeMigrationType: { type: Boolean, default: true} //  费用迁移默认 应收  false为应付
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      feeMigrationForm: {}
    }
  },
  computed: {
    url() {
      return URL
    },
    multipleSelectionLength() {
      if (this.$isNotEmpty(this.multipleSelection) && this.feeMigrationForm.cargoList) {
        if (this.multipleSelection.length === this.feeMigrationForm.cargoList.length) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  created() {
    this.feeMigrationFun()
  },
  methods: {
    // 费用迁移
    async feeMigrationFun() {
      const row = this.row
      this.loading = true
      let res
      if (this.isList) {
        if (this.feeMigrationType) {
          res = await confirmationNosByEntityNoApi({entityId: row.entityId, entityType: row.entityType})
        } else {
          res = await confirmationPayEntityNoApi({entityId: row.entityId, entityType: row.entityType})
        }

      } else {
        if (this.feeMigrationType) {
          res = await confirmationNoListApi(this.id)
        } else {
          res = await confirmationPayNoListApi(this.id)
        }

      }
      let resDetail
      if (this.feeMigrationType) {
        resDetail = await confirmationChargeCommonDetailApi(row.confirmationId)
      } else {
        resDetail = await confirmationPayCommonDetailApi(row.confirmationId)
      }


      this.loading = false
      if (res.ok) {
        this.$set(this.feeMigrationForm, 'confirmationNo', row.confirmationNo)
        this.$set(this.feeMigrationForm, 'confirmationIdFrom', row.confirmationId)
        console.log('confirmationIdToOps', res.content)
        this.$set(this.feeMigrationForm, 'confirmationIdToOps', res.content)

      }
      if (resDetail.ok) {
        this.$set(this.feeMigrationForm, 'cargoList', resDetail.content.charges)
      }
      if (res.ok && resDetail.ok) {
        this.feeMigrationDialog = true
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async addFeeMigration() {
      if (this.$isEmpty(this.multipleSelection)) {
        this.$message.warning(this.$t('sea.checkAtLeastOnePieceOfData'))
        return
      }
      const data = {
        confirmationIdFrom: this.feeMigrationForm.confirmationIdFrom,
        chargeIds: this.multipleSelection.map(item => item.id)
      }
      this.loading = true
      let url
      if (this.feeMigrationType) { // 应收
        if (this.$isNotEmpty(this.userInfo) && this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:move_new_special') > -1) { // 特定用户
          url = chargeSpecialMoveToNewApi
        } else { // 普通用户
          url = chargeMoveToNewApi
        }
      } else {// 应付
        if (this.$isNotEmpty(this.userInfo) && this.userInfo.privilegeCodeList.indexOf('sea:confirmation:pay:list:move_new_special') > -1) { // 特定用户
          url = paySpecialMoveToNewApi
        } else { // 普通用户
          url = payMoveToNewApi
        }
      }

      const res = await url(data)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.submittedSuccessfully'))
        this.$emit('submit')
        this.closefeeMigrationDialog()
      }
    },
    async submitfeeMigration() {
      this.$refs.feeMigrationForm.validate(async valid => {
        if (valid) {
          if (this.$isEmpty(this.multipleSelection)) {
            this.$message.warning(this.$t('sea.checkAtLeastOnePieceOfData'))
            return
          }
          const data = {
            confirmationIdFrom: this.feeMigrationForm.confirmationIdFrom,
            confirmationIdTo: this.feeMigrationForm.confirmationIdTo,
            chargeIds: this.multipleSelection.map(item => item.id)
          }
          this.loading = true
          let url
          if (this.feeMigrationType) {
            if (this.$isNotEmpty(this.userInfo) && this.userInfo.privilegeCodeList.indexOf('sea:confirmation:charge:list:move_special') > -1) { // 特定用户
              url = chargeSpecialRemoveApi
            } else { // 普通用户
              url = chargeMoveApi
            }
          } else {
            if (this.$isNotEmpty(this.userInfo) && this.userInfo.privilegeCodeList.indexOf('sea:confirmation:pay:list:move_special') > -1) { // 特定用户
              url = paySpecialRemoveApi
            } else { // 普通用户
              url = payMoveApi
            }
          }
          const res = await url(data)
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('sea.submittedSuccessfully'))
            this.$emit('submit')
            this.closefeeMigrationDialog()
          }
        }
      })

    },
    closefeeMigrationDialog() {
      this.$emit('update:feeMigrationDialog', false)
      // this.feeMigrationDialog = false
      this.feeMigrationForm = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
.cost_head{ display: flex;justify-content: space-between; border-bottom: #ccc solid 1px; padding-bottom: 8px}
.cost_mid{ display: flex; justify-content: space-between; flex-wrap: wrap;
  ::v-deep .el-form-item{ width: 30%}
}
.addExpenseConfirmation{ width: 100%; margin: 12px auto}
.footer-btn{
  margin-top: 30px;
  text-align: right;
}
::v-deep .el-table__body td{ padding: 10px 0 !important;}
</style>
