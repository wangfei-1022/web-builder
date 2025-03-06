<template>
  <el-dialog :title="title" :visible.sync="visible" width="800px" @close="closeFn">
    <div slot="title">
      <div style="color: white;">
        <span style="margin-right: 15px;">{{title}}</span>
        <span v-if="state === 2" style="font-size: 14px;">
          {{$t('fmsPayablePayment.batchOperRuningInfo', { inCount: successList.length + failList.length, unCount: (rowsList.length - successList.length - failList.length) })}}
        </span>
        <span v-if="state === 4" style="font-size: 14px;">
          <span>{{$t('fmsPayablePayment.batchOperEndingInfo')}} </span>
          <span style="cursor: pointer;text-decoration: underline;" @click="allInit">{{$t('fmsPayablePayment.batchOperEndingInfo1', { allCount: rowsList.length})}} </span>，
          <span style="cursor: pointer;text-decoration: underline;" @click="successInit">{{$t('fmsPayablePayment.batchOperEndingInfo2', { successCount: successList.length, failCount: failList.length })}} </span>，
          <span style="cursor: pointer;text-decoration: underline;color: #ff0c0c;" @click="failInit">{{$t('fmsPayablePayment.batchOperEndingInfo3', { failCount: failList.length })}} </span>。
        </span>
      </div>
    </div>
    <div style="overflow: hidden;">
      <div style="height: 500px;overflow-y: auto;width: 250px;float: left;">
        <div style="border-right: 1px solid #eee;">
          <div v-for="item in dataList" :key="item.instructionNo">
            <div :class="'month-tabs ' + (item.instructionNo === activeRow.instructionNo ? 'active' : '')" @click="itemClick(item)">
              {{item.instructionNo}}
              <span style="margin-left: 10px;">
                <!-- 默认 -->
                <span v-if="item.stateCode === 10">-</span> 
                <!-- 成功 -->
                <i class="iconfont icon-chenggong" v-if="item.stateCode === 20" />
                <!-- 执行 -->
                <i class="el-icon-loading" v-if="item.stateCode === 30" />
                <!-- 失败 -->
                <i class="iconfont icon-guanbi1" v-if="item.stateCode === 40" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 0 20px;height: 500px;overflow-y: auto;" v-if="dataList.length">
        <div style="line-height: 35px;">
          申请编号 {{activeRow.instructionNo}}
          <div v-if="activeRow.result" style="line-height: 30px;">
            审批通过。
          </div>
          <div v-if="!activeRow.result && activeRow.failMessage" style="line-height: 30px;">
            <span style="color: red">1.{{activeRow.failMessage}}</span>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini" v-if="state === 1">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="startFn" size="mini"  v-if="state === 1">{{title}}</el-button>
      <el-button type="primary" size="mini" :loading="true" v-if="state === 2">{{$t('fmsPayablePayment.excuteRuning')}}</el-button>
      <el-button @click="close" size="mini" v-if="state === 4">{{$t('common.close')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { 
  approvalApplyAgreeNoExceptionApi, 
  approvalApplyAgreeV1NoExceptionApi, 
 } from "@/api/financial/fmsPayablePayment";
export default {
	name: "BatchOperDialog",
	data() {
		return {
      activeRow: {},
			title: '',
			visible: false,
      state: 1, // 1.init 2.start 3.stop 4.end
      successList: [],
      failList: [],
      oper: '',
      api: null,
      rowsList: [],
      dataList: [],
      excuteIndex: 0
		}
	},
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.refreshFn);
  },
	methods: {
    itemClick(row){
      this.activeRow = row
    },
    init() {
      this.state = 1
      this.ids = []
      this.successList = []
      this.failList = []
      this.oper = ''
      this.api = null
    },
    refreshFn(e) {
      e.returnValue = '确定要刷新页面吗？';
    },
		show(config) {
      this.init()
      let rowsList = this.$extends(true, [], config.rows)
      rowsList.forEach(v => {
        v.stateCode = 10
      })
      this.rowsList = rowsList

      this.title = this.$t(config.oper)
      this.oper = config.oper
      this.api = config.api
      this.profitPeriods = config.profitPeriods
      this.visible = true
      this.allInit()
		},
    allInit() {
      if (this.rowsList.length > 0) {
        this.dataList = this.rowsList
        this.activeRow = this.rowsList[0]
      }
    },
    successInit() {
      if (this.successList.length > 0) {
        this.dataList = this.successList
        this.activeRow = this.successList[0]
      }
    },
    failInit() {
      if (this.failList.length > 0) {
        this.dataList = this.failList
        this.activeRow = this.failList[0]
      }
    },
    startFn() {
      this.state = 2
      this.excuteIndex = 0
      window.addEventListener('beforeunload', this.refreshFn);
      this.submitFn()
    },

    async submitApiFn(item) {
      // v1
      let data = {}
      data.applyId = item.id
      data.instructionId = item.id
      data.applyType = item.paymentType
      data.currentApplyApprovalNodeCode = item.currentApprovalLog.approvalNodeCode
      data.nextApprovalNode = item.currentApprovalLog.nextApprovalNode
      let res = null
      if (item.workflowType === 10) {
        res = await approvalApplyAgreeV1NoExceptionApi(data)
      } else {
        res = await approvalApplyAgreeNoExceptionApi(data)
      }
      return res
    },

		async submitFn() {
      if (this.rowsList.length && this.excuteIndex < this.rowsList.length) {
        let item = this.rowsList[this.excuteIndex]
        item.stateCode = 30
        const res = await this.submitApiFn(item)
        this.excuteIndex ++
        if(res.ok && res.content && res.content.result) {
          this.successList.push(item)
          item.result = res.content.result
          item.stateCode = 20
        } else {
          if(res.errorString) {
            item.failMessage = res.errorString
            item.result = false
          }
          if(res.content) {
            item.failMessage = res.content.failMessage
            item.result = res.content.result
          }
          this.failList.push(item)
          item.stateCode = 40
        }
        this.submitFn()
      } else {
        this.state = 4
        window.removeEventListener('beforeunload', this.refreshFn);
      }
		},
    close() {
      this.visible = false
    },
    closeFn() {
      window.removeEventListener('beforeunload', this.refreshFn);
      this.visible = false
      this.$emit('success')
    }
	}
}
</script>
<style lang="scss" scoped>
.month-tabs {
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  padding: 0 12px;
}
.month-tabs.active {
  background: rgba(64, 158, 255, 0.3);
}
.icon-chenggong{
  color: rgb(21,126,213);
}
.icon-guanbi1{
  color: red;
}
.order-check{
  width: 100%;
  margin-bottom: 8px;

  .order-check-title{
    margin-bottom: 6px;
    font-size: 15px;
    font-weight: 600;
  }
  .order-check-item {
    line-height: 28px;
    text-indent: 12px;

    .icon-chenggong{
      color: rgb(21,126,213);
    }
    .icon-guanbi1{
      color: red;
    }
  }
}
</style>
