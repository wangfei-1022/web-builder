<template>
  <el-dialog :title="title" :visible.sync="visible" width="800px" @close="closeFn">
    <div slot="title">
      <div style="color: white;">
        <span style="margin-right: 15px;">{{title}}</span>
        <span v-if="state === 2" style="font-size: 14px;">
          {{$t('fmsProfit.batchOperRuningInfo', { inCount: successList.length + failList.length, unCount: (rowsList.length - successList.length - failList.length) })}}
        </span>
        <span v-if="state === 4" style="font-size: 14px;">
          <span>{{$t('fmsProfit.batchOperEndingInfo')}} </span>
          <span style="cursor: pointer;text-decoration: underline;" @click="allInit">{{$t('fmsProfit.batchOperEndingInfo1', { allCount: rowsList.length})}} </span>，
          <span style="cursor: pointer;text-decoration: underline;" @click="successInit">{{$t('fmsProfit.batchOperEndingInfo2', { successCount: successList.length, failCount: failList.length })}} </span>，
          <span style="cursor: pointer;text-decoration: underline;color: #ff0c0c;" @click="failInit">{{$t('fmsProfit.batchOperEndingInfo3', { failCount: failList.length })}} </span>。
        </span>
      </div>
    </div>
    <div style="overflow: hidden;">
      <div style="height: 500px;overflow-y: auto;width: 250px;float: left;">
        <div style="border-right: 1px solid #eee;">
          <div v-for="item in dataList" :key="item.orderNo">
            <div :class="'month-tabs ' + (item.orderNo === activeRow.orderNo ? 'active' : '')" @click="itemClick(item)">
              {{item.orderNo}}
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
          订单号 {{activeRow.orderNo}}
          <span v-if="activeRow.outerCheck && (activeRow.outerCheck.length || activeRow.innerCheck.length)">
            , 系统检测{{activeRow.checkSuccessList.length}}项通过，
            <span style="color: red;">{{activeRow.checkErrorList.length}}项失败</span>
          </span>
        </div>
        <div v-if="activeRow.outerCheck && (activeRow.outerCheck.length || activeRow.innerCheck.length)">
          <div class="order-check" v-if="activeRow.outerCheck && activeRow.outerCheck.length">
            <div class="order-check-title">非内部往来部分</div>
            <div class="order-check-item" v-for="(item, index) in activeRow.outerCheck" :key="index">
              <i class="iconfont icon-chenggong" v-if="item.stateCode === 20" />
              <i class="iconfont icon-guanbi1" v-if="item.stateCode !== 20" />
              {{item.itemDesc}}
            </div>
          </div>
          <div class="order-check" v-if="activeRow.innerCheck && activeRow.innerCheck.length">
            <div class="order-check-title">内部往来部分</div>
            <div class="order-check-item" v-for="(item, index) in activeRow.innerCheck" :key="index">
              <i class="iconfont icon-chenggong" v-if="item.stateCode === 20" />
              <i class="iconfont icon-guanbi1" v-if="item.stateCode !== 20" />
              {{item.itemDesc}}
            </div>
          </div>
          <el-form ref="submitFormRef" class="submit-form" :rules="submitFormRules" :model="submitForm" size="mini" label-width="120px" label-position="top">
            <el-form-item :label="$t('fmsProfit.submitRemark')" prop="submitRemark">
              <el-input v-model="submitForm.submitRemark" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('fmsProfit.submitAttachments')" prop="submitAttachments">
              <upload-file v-model="submitForm.submitAttachments" drag multiple accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"></upload-file>
            </el-form-item>
          </el-form>

          <div style="margin-bottom: 20px;">
            <el-button type="primary" @click="continueSubmit" size="mini" style="width: 100%;">继续提交审核</el-button>
          </div>
        </div>
        <div v-else-if="activeRow.errors && activeRow.errors.length" style="line-height: 30px;">
          <span v-for="(item, index) in activeRow.errors" :key="index" style="color: red">{{index + 1}}.{{item.message}}</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn" size="mini" v-if="state === 1">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="startFn" size="mini"  v-if="state === 1">{{title}}</el-button>
      <el-button type="primary" size="mini" :loading="true" v-if="state === 2">{{$t('fmsProfit.excuteRuning')}}</el-button>
      <el-button @click="closeFn" size="mini" v-if="state === 4">{{$t('common.close')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { profitApplySubmitApi } from "@/api/financial/fmsProfitApply";
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
      excuteIndex: 0,
      submitForm: {
        submitRemark: '',
        submitAttachments: []
      },
      submitFormRules: {
        submitRemark: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
        submitAttachments: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
      }
		}
	},
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.refreshFn);
  },
	methods: {
    itemClick(row){
      this.activeRow = row
      this.submitForm = {
        submitRemark: '',
        submitAttachments: []
      }
    },
    init() {
      this.state = 1
      this.ids = []
      this.successList = []
      this.failList = []
      this.oper = ''
      this.api = null

      this.submitForm = {
        submitRemark: '',
        submitAttachments: []
      }
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
		async submitFn() {
      if (this.rowsList.length && this.excuteIndex < this.rowsList.length) {
        let item = this.rowsList[this.excuteIndex]
        let params = {
          orderEntityType: item.orderEntityType,
          orderId: item.orderId,
          profitApplyId: item.id,
          profitPeriods: this.profitPeriods
        }
         item.stateCode = 30
        const res = await this.api(params)
        this.excuteIndex ++
        if(res.ok && !res.content) {
          this.successList.push(item)
          item.stateCode = 20
        } else {
          if(res.content) {
            if(res.content.content) {
              item.innerCheck = res.content.content.profitApplyInnerCheckDetails || []
              item.outerCheck = res.content.content.profitApplyOuterCheckDetails || []

              let checkSuccessList = []
              let checkErrorList = []
              let checkList = item.innerCheck.concat(item.outerCheck)
              checkList.forEach(item => {
                if(item.stateCode === 20) {
                  checkSuccessList.push(item)
                } else {
                  checkErrorList.push(item)
                }
              })
              item.checkSuccessList = checkSuccessList
              item.checkErrorList = checkErrorList
            }
            item.errors = res.content.errors
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
    closeFn() {
      window.removeEventListener('beforeunload', this.refreshFn);
      this.visible = false
      this.$emit('success')
    },
    continueSubmit() {
      this.$refs.submitFormRef.validate(valid => {
        if(valid) {
          let data = {
            ...this.submitForm
          }
          data.orderEntityType = this.activeRow.orderEntityType
          data.orderId = this.activeRow.orderId

          this.loading = true
          profitApplySubmitApi(data).then(res => {
            if (res.ok) {
              // 提交成功
              this.$message.success(this.$t('fmsProfit.submitSuccess'))
              this.activeRow.stateCode = 20
            }
            this.loading = false
          })
        }
      })
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
