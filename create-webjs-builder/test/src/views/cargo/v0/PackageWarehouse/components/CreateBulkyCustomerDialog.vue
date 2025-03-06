<template>
  <div>
    <el-dialog
    :visible.sync="showDialog"
    width="1000px"
    :title="$t('packageWarehouse.createBulkyTitle')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" size="mini" label-width="80px" label-position="right" style="width: 100%;">
        <el-form-item :label="$t('packageWarehouse.chineseName')" prop="memberId">
          <RemoteSearchSelector ref="remoteSearch" v-model="editForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" />
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.productName')" prop="productIdList">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            {{$t('common.checkedAll')}}
          </el-checkbox>
          <div style="height: 300px; overflow: hidden; overflow-y: auto;">
            <el-checkbox-group v-model="editForm.productIdList" @change="handleCheckedChannelChange">
              <el-checkbox v-for="item in productList" :key="item.value"
                :label="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- <el-select v-model="editForm.productIdList"
            :placeholder="$t('common.placeholder')"
            filterable
            multiple>
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="checkForm">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { createBubbleApi, getProductListApi } from '@/api/packageWarehouse'
import { getRemoteMemberApi } from '@/api/user'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
export default {
  name: 'CreateBulkyCustomerDialog',
  components: {
    RemoteSearchSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      productList: [],
      isIndeterminate: false,
      checkAll: false,
      editForm: {
        memberId: '',
        productIdList: []
      },
      editFormRule: {
        memberId: [
          { required: true, message: this.$t('packageWarehouse.abbreviationEmptyError'), trigger: 'change' }
        ],
        productIdList: [
          { required: true, message: this.$t('packageWarehouse.girdConfig.productIdInvalid'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    showDialog: {
      get: function() {
        return this.visible
      },
      set: function(val) {
        this.$emit('update:visible', val)
      }
    },
    getMemberApi: function() {
      return getRemoteMemberApi
    }
  },
  watch: {
    visible: function(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.editFormRef.resetFields()
        })
      }
    }
  },
  methods: {
    // 渠道下拉
    async getProductList() {
      const res = await getProductListApi()
      this.productList = []
      if (res.ok && res.content) {
        let _productList = []
        res.content.forEach(item => {
          _productList.push({
            value: item.id,
            label: item.productName,
            countryCode: item.countryCode
          })
        })
        _productList.sort((a, b) => b.countryCode.localeCompare(a.countryCode))
        this.productList = _productList
      }
    },
    handleCheckAllChange(val) {
      this.editForm.productIdList = val ? this.productList.map(item => item.value) : []
      this.isIndeterminate = false
    },
    handleCheckedChannelChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.productList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.productList.length
    },
    checkForm() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.saveForm()
        }
      })
    },
    async saveForm() {
      this.loading = true
      const res = await createBubbleApi(this.editForm)
      if (res.ok) {
        this.$message({
          type: 'success',
          message: this.$t('packageWarehouse.submitSuccess')
        })
      }
      this.loading = false
      this.showDialog = false
      this.$emit('refreshData')
      this.clearForm()
    },
    closeDialog() {
      this.$confirm(this.$t('planManager.unSaveWarnningTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.dropEditBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(() => {
        this.clearForm()
      }).catch(() => {})
    },
    clearForm() {
      this.$refs.editFormRef.resetFields()
      this.showDialog = false
      this.$emit('refreshData')
    }
  },
  mounted() {
    this.getProductList()
  },
  created() {}
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-checkbox-group {
    .el-checkbox {
      width: 240px;
    }
  }
</style>
