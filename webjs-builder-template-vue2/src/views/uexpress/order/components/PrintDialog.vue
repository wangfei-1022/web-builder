<template>
  <el-dialog :visible.sync="printVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.batchPrintPdf")'>
    <el-form ref="printFormRef" :model="printForm" :rules="printFormRule" label-width="100px" size="mini">
      <el-form-item :label='$t("uexpressOrder.pdfType")' prop="printType">
        <el-select v-model="printForm.printType">
          <el-option :key="item.code" v-for="item in printTypeList" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="printVisible = false">{{ $t("common.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="printConfirmFn" :loading="printLoading">{{ $t("common.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { printOrderPdfIdsApi } from '@/api/uexpress/orderManager'
import { getDictListApi } from '@/api/uexpress/base'
export default {
	name: "PrintDialog",
	data() {
		return {
      // 打印面单
      printVisible: false,
      printLoading: false,
      printForm: {
        printType: ''
      },
      printFormRule: {
        printType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
      printTypeList: [],
      ids: []
    };
	},
  created() {
    this.getBaseDataFn()
  },
  methods: {
    getBaseDataFn() {
      Promise.all([ getDictListApi(41) ]).then(results => {
        const printTypeRes = results[0]; // 打印类型
        if (printTypeRes && printTypeRes.ok) {
          this.printTypeList = printTypeRes.content
        }
      })
    },
    show(ids) {
      this.ids = ids
      this.printForm = {
        printType: ''
      }
      this.printVisible = true
    },
    printConfirmFn() {
      this.$refs.printFormRef.validate(valid => {
        if (valid) {
          let data = {
            ids: this.ids,
            printType: this.printForm.printType
          }
          this.printLoading = true
          printOrderPdfIdsApi(data).then(res => {
            if (res.ok) {
              this.printVisible = false
              if (res.content) {
                this.printFn(res)
              } else {
                this.$message.error(this.$t('uexpressOrder.printMaxValue'))
              }
            }
            this.printLoading = false
          })
        }
      })
    },
    printFn(res) {
      let bd = Uint8Array.from(atob(res.content), c => c.charCodeAt(0))
      let blob = new Blob([bd], { type: 'application/pdf' })
      let url = window.URL.createObjectURL(blob)
      let iframe = document.getElementById('print-iframe-template')
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.setAttribute('id', 'print-iframe-template')
        iframe.setAttribute('style', 'display:none')
      }
      iframe.setAttribute('src', url)
      document.body.appendChild(iframe)
      document.getElementById('print-iframe-template').contentWindow.print();
    },
  }
};
</script>
<style lang="scss" scoped>

</style>

