<template>
  <div>
    <report-data-opt ref="reportTemp" :print-data="paramsOfRequesetReportData.printDataCondition" />
  </div>
</template>

<script>
import reportDataOpt from '@/components/Cargo/Report/reportDataOpt'
export default {
  name: 'ReportPageView',
  components: { reportDataOpt },
  data() {
    return {
      paramsOfRequesetReportData: {
        action: '', // 模板操作类型:add/edit/view
        datasource: '', // 数据源内容
        entityType: '', // 业务实体类型(文件信息日志表需要存储)
        printDataCondition: {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: ''
        },
        templateId: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // if (to.$route.query.printData) {
      //   vm.paramsOfRequesetReportData.printData = JSON.parse(to.$route.query.printData)
      // }
    })
  },
  created() {
    if (this.$route.query.printData) {
      this.paramsOfRequesetReportData.printDataCondition = JSON.parse(this.$route.query.printData)
    }
  },
  mounted() {
    // document.querySelector('#ifmReport1Div').innerHTML = '<iframe id="ifmReport1" ref="ifmReport1" style="border:0px;width:100%;height: 90vh" name="ifmReport1" />'
    console.log('====reportPageView========>=mounted===========')
    this.paramsOfRequesetReportData.action = this.$route.query.action
    this.paramsOfRequesetReportData.templateId = this.$route.query.templateId
    console.log('this.paramsOfRequesetReportData', this.paramsOfRequesetReportData)
    if (this.paramsOfRequesetReportData.action === 'view') {
      this.toShowReport()
    }
    if (this.paramsOfRequesetReportData.action === 'edit') {
      this.toDesignReport()
    }
  },
  methods: {
    toShowReport() {
      const { templateId, action } = this.paramsOfRequesetReportData
      this.$refs.reportTemp.toShowReport(templateId, action)
    },
    toDesignReport() {
      const { templateId, action } = this.paramsOfRequesetReportData
      this.$refs.reportTemp.toDesignReport(templateId, action)
    }
  }
}
</script>

<style scoped>

</style>
