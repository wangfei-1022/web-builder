<template>
  <div>
    <el-dialog id="reportListDialog" :visible.sync="isShowDialog" :title="$t('common.printTemplate')" width="850px" @close="closeDialogCallback">
      <el-scrollbar style="height: 550px;">
        <div v-for="item in templates" :key="item.id" style="margin: 20px;float:left;position: relative">
          <el-tooltip :disabled="item.chineseName.length<9" :content="item.chineseName" effect="dark" placement="top">
            <div style="width:144px;overflow:hidden;text-align:center;font-size:14px;text-overflow:ellipsis;white-space: nowrap;position: absolute;top:8px;color:#1a61af">
              {{ item.chineseName }}
            </div>
          </el-tooltip>
          <img src="@/assets/print_rep2.png" @click="toShowReport(item.id,'view',item.reportServiceUrl)">
          <div style="width: 145px;margin-top:-10px;">
            <el-button-group>
              <el-button icon="el-icon-share" size="mini" style="width:72px;text-align: left" @click="toShowReport(item.id,'view',item.reportServiceUrl)">{{$t('common.previewBtn')}}</el-button>
              <el-button icon="el-icon-edit" size="mini" style="width:73px" @click="toDesignReport(item.id,'edit',item.reportServiceUrl)">{{$t('common.designBtn')}}</el-button>
            </el-button-group>
          </div>
        </div>
        <!--<div v-for="item in templates" :key="item.id" style="display: inline-block; margin: 10px;">-->
        <!--<el-button icon="el-icon-share" type="success" style="width:230px;text-align: left" @click="toShowReport(item.id,'view')">{{ item.chineseName }}</el-button>-->
        <!--<el-button icon="el-icon-edit" type="primary" style="width:80px" @click="toDesignReport(item.id,'edit')">设计</el-button>-->
        <!--</div>-->
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import { getBusinessReportTemplateList } from '@/api/report'
import { getToken } from '@/utils/auth'
import {objectIsArray} from "@/utils/objectUtils";
export default {
  name: 'ReportListDialog',
  components: { },
  props: {
    isShow: { type: Boolean, default: false },
    typeCode: { type: String, default: '' },
    printData: {
      type: Object, default() {
        return {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: '',
          ip: ''
        }
      }
    }
  },
  data() {
    return {
      isShowDialog: this.isShow,
      templates: []
    }
  },
  created() {
  },
  beforeMount() {
    this.fetchPageData()
  },
  methods: {
    fetchPageData() {
      this.getBusinessReportTemplateList()
    },
    getBusinessReportTemplateList() {
      getBusinessReportTemplateList(this.typeCode).then(res => {
        if (objectIsArray(res.content)) {
          this.templates = res.content
        } else if (res.content) {
          this.templates.push(res.content)
        }
      }).catch(() => {
        // this.$message.error(err)
      })
    },
    toShowReport(templateId, action, url) {
      const printData = JSON.stringify(this.printData)
      const time = new Date().getTime() + Math.random() + ''
      this.closeDialogCallback()
      window.open(`/viewreport.html?templateId=${templateId}&action=${action}&printData=${printData}&time=${time}&Authorization=${getToken()}&initUrl=${url}`)
      // this.$router.push({ name: `ReportPageView`, query: { templateId, action, printData, time }})
    },
    toDesignReport(templateId, action) {
      const printData = JSON.stringify(this.printData)
      const time = new Date().getTime() + Math.random() + ''
      this.closeDialogCallback()
      this.$router.push({ name: `ReportPageView`, query: { templateId, action, printData, time }})
    },
    closeDialogCallback() {
      this.$emit('closeDialog')
    }

  }
}
</script>
<style>
 #reportListDialog .el-scrollbar__wrap{
   overflow-x:hidden ;
 }
</style>
