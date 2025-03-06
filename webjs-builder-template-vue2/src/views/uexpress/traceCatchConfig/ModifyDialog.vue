<template>
  <div>
    <el-dialog
    :visible.sync="visible"
    width="800px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="modifyForm" v-if="visible" :model="modifyForm" :rules="modifyFormRule" size="mini" label-width="120px" label-position="right" style="width: 100%;" inline>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.supplierName")' prop="supplierId">
              <type-select
                ref="supplier"
                v-model="modifyForm.supplierId"
                type="supplier"
                :requestParams="{partnerRole: 17011}"
                :defaultDisplay="supplierDisplay"
                @selected="handleSpplierChange">
              </type-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.productOfSupplier")' prop="productCodes" style="width: 600px;">
              <uexpress-type-select class="cut-selection" ref="supplierProduct" type="supplierProduct" :requestParams="{supplierId: modifyForm.supplierId}" multiple v-model="modifyForm.productCodes" :disabled="!modifyForm.supplierId" clearable filterable :defaultDisplay="productsDisplay"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.customerName")' prop="customerIds">
              <type-select ref="customer" v-model="modifyForm.customerIds" :defaultDisplay="customerDisplay" multiple type="customer" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("uexpressTrace.channelCode")' prop="channelCode">
              <uexpress-type-select type="traceChannel" v-model="modifyForm.channelCode" clearable filterable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label='$t("common.remark")' prop="remarks">
              <el-input type="textarea" rows="3" style="width: 570px;" v-model="modifyForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="checkForm">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createTraceCatchApi, updateTraceCatchApi } from '@/api/uexpress/traceLine'
export default {
  name: "ModifyCatchDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      title: '',
      modifyForm: {},
      modifyFormRule: {
        supplierId: [
          {required: true, message: this.$t('uexpressTrace.invalidSupplier'), trigger: 'change'}
        ],
        productCodes: [
          {type: 'array', required: true, message: this.$t('uexpressTrace.invalidProductCodes'), trigger: 'change'}
        ],
        // customerIds: [
        //   {type: 'array', required: false, message: this.$t('uexpressTrace.invalidCustomer'), trigger: 'change'}
        // ],
        channelCode: [
          {required: true, message: this.$t('uexpressTrace.invalidChannelCode'), trigger: 'change'}
        ]
      },
      productsDisplay: [],
      customerDisplay: [],
      supplierDisplay: [],
      isModify: false
    }
  },
  created() {},
  computed: {},
  methods: {
    init(formData = null) {
      if (formData) {
        this.modifyForm = {...formData}
        this.isModify = true
        this.title = this.$t('uexpressTrace.modifyTraceCatch')
        this.setModifyData()
      } else {
        this.modifyForm = {
          channelCode: '',
          supplierId: null,
          customerIds: [],
          productCodes: [],
          remarks: ''
        }
        this.isModify = false
        this.title = this.$t('uexpressTrace.createTraceCatch')
        this.supplierDisplay = []
        this.productsDisplay = []
        this.customerDisplay = []
      }
      this.$nextTick(() => {
        this.$refs.modifyForm && this.$refs.modifyForm.clearValidate()
      })
    },
    // 修改时赋值供应商服务产品、客户
    setModifyData() {
      this.supplierDisplay = []
      this.productsDisplay = []
      this.customerDisplay = []
      this.$set(this.modifyForm, 'productCodes', [])
      this.$set(this.modifyForm, 'customerIds', [])

      this.supplierDisplay = [
        {
          id: this.modifyForm.supplierId,
          chineseName: this.modifyForm.supplierName
        }
      ]
      this.modifyForm.productDtos.map(item => {
        this.productsDisplay.push({
          productCode: item.productCode,
          productName: item.productName
        })
        this.modifyForm.productCodes.push(item.productCode)
      })

      this.modifyForm.customers.map(item => {
        this.customerDisplay.push({
          id: item.memberId,
          chineseName: item.memberName
        })
        this.modifyForm.customerIds.push(item.memberId)
      })
    },
    handleSpplierChange() {
      this.modifyForm.productCodes = []
      this.productsDisplay = []
      this.$refs.supplierProduct.$refs.supplierProduct.filterInitOnece = false
    },
    checkForm() {
      this.$refs.modifyForm.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm() {
      this.$emit('update:loading', true)
      let res = null
      if (this.isModify) {
        res = await updateTraceCatchApi(this.modifyForm)
      } else {
        res = await createTraceCatchApi(this.modifyForm)
      }

      this.$emit('update:loading', false)

      if (res.ok) {
        this.$message.success(this.$t('uexpressTrace.modifySuccess'))
        this.closeDialog()
        this.$emit('refreshData')
      }
    },
    closeDialog() {
      this.$refs.modifyForm.resetFields()
      this.$refs.supplier.clearChildOption('supplier')
      this.$refs.customer.clearChildOption('customer')
      this.$refs.supplierProduct.clearChildOption('supplierProduct')
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .cut-selection {
    .el-select__tags-text {
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: baseline;
    }
    .el-tag__close {
      top: -7px;
    }
  }
</style>
