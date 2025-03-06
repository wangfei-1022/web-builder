<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-form :model="packageForm" ref="packageForm" style="margin-top: 20px;" label-width="100px" size="mini" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.number')}: `" prop="boxTags" :rules="[{ required: true, message: `${$t('packageWarehouse.numberInvalid')}`, trigger: 'blur' }]">
                <el-input v-model.trim="packageForm.boxTags" @keyup.enter.native="handleBoxNoInput" size="mini" ref="boxNoInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" label-width="0">
                <el-button type="primary" @click="handleBoxNoInput">{{$t('common.print')}}</el-button>
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
import { printThirdPartTagApi } from '@/api/packageWarehouse'
export default {
  name: 'PackagePrintTagsThirdPart',
  components: {},
  data() {
    return {
      loading: false,
      singlePrint: false,
      packageForm: {
        boxTags: ''
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
    async handleBoxNoInput() {
      if (this.loading) {return false}
      this.$refs.packageForm.validate(valid => {
        if (valid) {
          this.printTag()
        }
      })
    },
    async printTag() { // 打印标签
      this.loading = true
      const res = await printThirdPartTagApi({boxNo: this.packageForm.boxTags})
      if (res.ok) {
        printJS({
          printable: res.content,
          type: 'pdf',
          base64: true
        })
        // if (this.singlePrint) {
        //   this.$nextTick(() => {
        //     this.$refs.boxNoInput.focus()
        //   })
        // }
      }
      this.$refs.packageForm.resetFields()
      this.loading = false
    }
  },
  mounted() {
    this.$refs.boxNoInput.focus()
  },
  created() {}
}
</script>
<style lang="scss" scoped>
</style>
