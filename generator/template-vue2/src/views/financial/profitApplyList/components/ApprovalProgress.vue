<template>
  <div class="timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(log, index) in approvalLogList"
        :key="index"
        icon="iconfont icon-jiaose"
        :type="log.type"
        :color="log.approvalType === 50 ? '#eee' : '#dfe4ed'"
        :size="log.size"
        :timestamp="log.timestamp">
        <div class="info-approval">
          <div class="icon-left">
            <i class="iconfont icon-guanbi1"  v-if='log.operationType === 30'/>
            <i class="iconfont icon-chenggong facker" v-else-if='log.operationType === 50' />
            <i class="iconfont icon-chenggong" v-else />
          </div>
          <div class="content-right">
            <div>
              <div class="department">
                {{log.operationTypeName}}
                <span class="remark" v-if="log.operationRemark">
                  <span>{{$t('fmsPayablePayment.approvalRemarks')}}：</span>
                  <span :class="(log.operationType === 30) ? 'reject' : ''">{{log.operationRemark}}</span>
                </span>
              </div>
              <div class="name">{{log.operatorTypeName}}</div>
              <div class="time">{{log.operationTime | parseTime}}</div>
            </div>
            <div style="display: flex;margin-left: 30px;" v-if="log.attachments && log.attachments.length">
              <span class="department">{{$t('fmsPayablePayment.approvalFiles')}}：</span>
              <div style="margin-bottom: 5px;">
                <div v-for="(file, index) in log.attachments" :key="index">
                  <a :href="file.fileUrl" target="_blank" class="link">{{file.fileName}}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getProfitAuditLogsApi } from "@/api/financial/fmsProfitAudit";
export default {
	name: 'ApprovalProgress',
  props: {
    profitApplyId: {
      type: String,
      default: ""
    }
  },
	data() {
		return {
      approvalLogList: []
		}
	},
  created(){
    this.init() 
  },
	methods: {
    init() {
      let data = {
        profitApplyId: this.profitApplyId
      }
      getProfitAuditLogsApi(data).then(res => {
        if(res.ok) {
          this.approvalLogList = res.content
        }
      })
    }
	}
}
</script>

<style lang='scss' scoped>
.timeline{
  background: #fff;
  padding: 20px;
}
.info-approval{
  line-height: 20px;
  font-size: 12px;
  padding-left: 24px;
  padding-top: 7px;


  .icon-left{
    float: left;
  }

  .icon-guanbi1{
    color: red;
  }
  .icon-chenggong{
    color: #1890ff;
  }
  .facker.icon-chenggong{
    color: #dedede;
  }

  .content-right{
    padding-left: 30px;
    display: flex;
  }

  .department{
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
  }

}
  ::v-deep .el-timeline-item__node{
    background: rgb(184,212,255)!important;
    width: 40px!important;
    height: 40px!important;
    left: -15px!important;
    overflow: hidden!important;
  }

  ::v-deep .icon-jiaose{
    font-size: 40px;
    margin-top: 7px;
  }
  .remark{
    margin-left: 30px;
  }
  .reject{
    color: red;
  }
  .link{
    font-size: 16px;
    color: #1890ff;
    cursor: pointer;
  }
</style>
