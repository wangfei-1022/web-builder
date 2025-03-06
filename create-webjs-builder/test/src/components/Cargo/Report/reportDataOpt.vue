<!--报表展示页(模拟表单提交->到报表服务器，获取展示页报表)-->
<template>
  <div v-show="isShow" class="app-main-inner-row">
    <!--    <el-form ref="reportForm" :action="reportForm.property.action" :method="reportForm.property.method" target="ifmReport1" label-width="150px" label-position="right" style="display:none;">-->
    <!--      <el-form-item label="reportParameter">-->
    <!--        <el-input v-model="reportParameter" name="reportParameter" type="textarea" rows="2" size="mini" />-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <iframe :srcdoc="reportDataHtml" style="border:0px;width:100%;height: 90vh" />
    <!--<div>-->
    <!--<json-viewer-->
    <!--:value="reportForm.data"-->
    <!--:expand-depth="1"-->
    <!--copyable-->
    <!--boxed-->
    <!--sort-->
    <!--style="font-size: small;font-family: 'Courier New';width:100%;vertical-align: top"/>-->
    <!--<br>-->
    <!--</div>-->
  </div>
</template>

<script>
//  viewReport, designerReport
import { getReportTemplateDataInit, getViewReportURL, getDesignerReportURL } from '@/api/report'
import request from '@/utils/request'
import JsonViewer from 'vue-json-viewer'
// import URL from '@/api/urlTranslator'
export default {
  name: 'ReportDataOpt',
  components: { JsonViewer },
  props: {
    isShow: { type: Boolean, default: true },
    printData: { type: Object, default() {
      return {
        assistInfo: '',
        definedInfo: '',
        entityIdList: [],
        remark: ''
      }
    } }
  },
  data() {
    return {
      paramsOfRequesetReportData: {
        action: '', // 模板操作类型:add/edit/view
        datasource: '', // 数据源内容
        entityType: '', // 业务实体类型(文件信息日志表需要存储)
        printDataCondition: {},
        templateId: ''
      },
      reportForm: {
        property: {
          target: 'ifmReport1',
          action: '',
          method: 'post'
        },
        data: {}
      },
      reportDataHtml: ''
    }
  },
  computed: {
    reportParameter() {
      return JSON.stringify(this.reportForm.data)
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('=========reportDataOpt beforeRouteEnter--->')
  },
  created() {
  },
  methods: {
    toDealReport(templateId, action) {
      console.log('printData', this.printData)
      console.log('this.paramsOfRequesetReportData.printDataCondition', this.paramsOfRequesetReportData.printDataCondition)
      this.paramsOfRequesetReportData.templateId = templateId
      this.paramsOfRequesetReportData.action = action
      this.paramsOfRequesetReportData.printDataCondition = this.printData
      getReportTemplateDataInit(this.paramsOfRequesetReportData).then(res => {
        this.reportForm.data = res.content
        this.printData.ip = res.content.reportServiceUrl
        this.toVisitReportServer(action)
      }).catch(() => {
        // this.$message.error(err)
      })
    },
    toShowReport(templateId, action) {
      this.toDealReport(templateId, action)
    },
    toDesignReport(templateId, action) {
      this.toDealReport(templateId, action)
    },
    toVisitReportServer(mode) {
      let reportDesignerUrl = getDesignerReportURL()
      let reportViewerUrl = getViewReportURL()
      const ip = this.reportForm.data.reportServiceUrl // 示例：http://47.101.31.151:5000/sys-service
      // const ip = 'http://121.89.215.52:5000/report-service'
      // const ip = 'http://sys-service'
      reportDesignerUrl = `${ip}/report/designer`
      reportViewerUrl = `${ip}/report/viewreport`
      if (mode === 'view') {this.reportForm.property.action = reportViewerUrl}
      if (mode === 'edit') {this.reportForm.property.action = reportDesignerUrl}

      this.$nextTick(() => {
        // this.$refs.reportForm.$el.submit()

        let formData = new FormData()
        formData.append('reportParameter', this.reportParameter)
        console.log(this.reportForm.property.action)
        request({
          url: this.reportForm.property.action,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
          }
        }).then(res => {
          this.reportDataHtml = res
          // debugger
          console.log(res)
        }, res => {
          // debugger
          console.log(res)
        },)
      })
    }
  }
}
</script>

<style scoped>

</style>
