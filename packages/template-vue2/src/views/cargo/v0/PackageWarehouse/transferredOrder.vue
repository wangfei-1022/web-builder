<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-form :model="packageForm" ref="packageForm" style="margin-top: 20px;" label-width="100px" size="mini" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.number')}: `" prop="orderNo" :rules="[{ required: true, message: `${$t('packageWarehouse.orderNoInvalid')}`, trigger: 'blur' }]">
                <el-input v-model.trim="packageForm.orderNo" @keyup.enter.native="handleOrderNoInput" size="mini" ref="OrderNoInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" label-width="0">
                <el-button type="primary" @click="handleOrderNoInput">{{$t('common.print')}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
  </div>
</template>
<script>
import printJS from 'print-js'
import { printTransferredOrderApi } from '@/api/packageWarehouse'
export default {
  name: 'TransferredOrder',
  components: {},
  data() {
    return {
      loading: false,
      singlePrint: false,
      packageForm: {
        orderNo: ''
      },
      packageFormRules: [
        {

        }
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {
    onReady(params) {},
    async handleOrderNoInput() {
      if (this.loading) {return false}
      this.$refs.packageForm.validate(valid => {
        if (valid) {
          this.printTag()
        }
      })
    },
    async printTag() { // 打印标签
      this.loading = true
      const res = await printTransferredOrderApi(this.packageForm.orderNo)
      if (res.ok) {
        printJS({
          printable: res.content,
          type: 'pdf',
          base64: true
        })
      }
      this.$refs.packageForm.resetFields()
      this.loading = false
    }
  },
  mounted() {
    this.$refs.OrderNoInput.focus()
  },
  created() {}
}
</script>
<style lang="scss" scoped>
</style>
