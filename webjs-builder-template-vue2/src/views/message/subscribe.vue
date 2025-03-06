<template>
  <div
    v-loading="fullscreenLoading"
    class="sys-right-inner-wrap"
  >
    <div class="container-wrap">
      <div class="features-btn">
        <el-button
          type="primary"
          size="mini"
          @click="editFn"
        >
          {{ $t('subscribe.batchSetReceiver') }}
        </el-button>
      </div>
      <el-table
        class="dataTable"
        :data="data"
        @selection-change="handleSelectionChange"
        :height="tableHeight+'px'"
      >
        <el-table-column
          type="selection"
          width="55"
          fixed
        >
          <template slot-scope="scope">
            <el-checkbox
              v-if="!scope.row.isParent"
              v-model="scope.row.isChecked"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="subscribeActionName"
          :label="$t('subscribe.messageType')"
          align="left"
          width="200"
        />
        <el-table-column
          prop="mobile"
          :label="$t('subscribe.sys')"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-if="!scope.row.isParent"
              :value="scope.row.messageFlag"
              :disabled="!scope.row.messageEnable"
              @change="changeStatus('sys', scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          :label="$t('subscribe.sms')"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-if="!scope.row.isParent"
              :value="scope.row.smsFlag"
              :disabled="!scope.row.smsEnable"
              @change="changeStatus('sms', scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          :label="$t('subscribe.email')"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-if="!scope.row.isParent"
              :value="scope.row.emailFlag"
              :disabled="!scope.row.emailEnable"
              @change="changeStatus('email', scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="receivers"
          :label="$t('subscribe.receivers')"
          align="center"
        >
          <template slot-scope="scope">
            <div
              v-if="!scope.row.isParent"
              class="operating"
            >
              <span>{{ scope.row.receiversName }}</span>
              <span
                class="operation"
                @click="editFn(scope.row)"
              >{{ $t('subscribe.edit') }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <add-receiver ref="addReceiver" :form="form" @add-success="addSuccess" />

    <el-dialog
      :title="$t('subscribe.setReceiver')"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      :center="true"
      width="540px"
    >
      <div class="edit-dialog">
        <div class="edit-title">
          <el-alert
            :title="$t('subscribe.selectReceiverInfo')"
            type="info"
            show-icon
            :closable="false"
          />
          <a @click="addReceiverFn">+ {{ $t('subscribe.addReceiver') }}</a>
        </div>

        <el-row
          v-for="(item, index) in receiverList"
          :key="index"
          :class="item.checkFlag ? 'active row-receiver' : 'row-receiver'"
        >
          <el-col :span="2">
            <el-checkbox v-model="item.checkFlag" />
          </el-col>
          <el-col :span="22">
            <div class="name">
              {{ item.name }}
            </div>
            <div>
              <span
                v-if="item.mobile"
                class="mobile"
              >{{ item.mobile }}</span>
              <span>{{ item.email }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="editVisible = false"
        >
          {{ $t('common.cancel') }}
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="confirmEdit"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSubscribeListApi,
  updateSubscribeSysStatusApi,
  updateSubscribeEmailStatusApi,
  updateSubscribeSmsStatusApi,
  getAllReceiverApi,
  updateReceiverApi,
  getUserReceiverApi,
  updateBatchReceiverApi
} from '@/api/middleware/message'
import AddReceiver from './addReceiver'

export default {
  name: 'SubscribeList',
  components: {
    AddReceiver
  },
  data() {
    return {
      form: {},
      editRow: {},
      receiverList: [],
      editVisible: false,
      fullscreenLoading: false,
      data: [],
      multipleSelection: [] // 列表选择
    }
  },
  created() {
  },
  mounted() {
    this.getList()
    window.addEventListener('resize', () => {
      this.resetHeight()
    })
    this.$nextTick(() => {
      this.resetHeight()
    })
  },
  methods: {
    addReceiverFn() {
      this.form = {}
      this.$refs.addReceiver.show()
    },
    addSuccess(receiver) {
      this.receiverList.unshift(receiver)
    },
    handleSelectionChange(val) {
      this.data.forEach(ex => {
        ex.isChecked = !!val.length
      })
    },
    changeStatus(type, row) {
      let fn = null
      let key = ''
      switch (type) {
        case 'sys':
          key = 'messageFlag'
          fn = updateSubscribeSysStatusApi
          break
        case 'sms':
          key = 'smsFlag'
          fn = updateSubscribeSmsStatusApi
          break
        case 'email':
          key = 'emailFlag'
          fn = updateSubscribeEmailStatusApi
          break
        default:
          break
      }
      const data = {
        id: row.id,
        defaultConfigId: row.defaultConfigId,
        [key]: !row[key]
      }
      fn(data).then(res => {
        if (res && res.ok) {
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('subscribe.setEnableSuccess')
          })
        }
      })
    },
    editFn(row) {
      if (!row.id) {
        const userReceiverConfigList = []
        this.data.forEach(function(v) {
          if (v.isChecked) {
            userReceiverConfigList.push({
              id: v.id,
              defaultConfigId: v.defaultConfigId
            })
          }
        })
        if (userReceiverConfigList.length < 1) {
          this.$message({
            type: 'error',
            message: this.$t('subscribe.needOneLine')
          })
          return
        }
      }
      this.editRow = row || {}
      const fn = this.editRow.id ? getUserReceiverApi : getAllReceiverApi
      fn(row).then(res => {
        if (res && res.ok) {
          res.content.forEach(function(v) {
            v.checkFlag = v.checkFlag || false
          })
          this.receiverList = res.content
        }
      })
      this.editVisible = true
    },
    confirmEdit() {
      let fn, data
      if (this.editRow.id) {
        fn = updateReceiverApi
        data = {
          id: this.editRow.id,
          defaultConfigId: this.editRow.defaultConfigId,
          receiverIds: []
        }
      } else {
        fn = updateBatchReceiverApi
        const userReceiverConfigList = []
        this.data.forEach(function(v) {
          if (v.isChecked && !v.isParent) {
            userReceiverConfigList.push({
              id: v.id,
              defaultConfigId: v.defaultConfigId
            })
          }
        })
        data = {
          userReceiverConfigList: userReceiverConfigList,
          receiverIds: []
        }
      }
      this.receiverList.forEach(function(v) {
        if (v.checkFlag) {
          data.receiverIds.push(v.id)
        }
      })
      fn(data).then(res => {
        if (res && res.ok) {
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('subscribe.setSuccess')
          })
        }
      })
      this.editVisible = false
    },
    getList() {
      this.fullscreenLoading = true
      getSubscribeListApi({}).then(res => {
        if (res && res.ok) {
          let arr = []
          res.content.forEach(e => {
            arr.push({
              subscribeActionName: e.targetTypeName,
              targetTypeCode: e.targetTypeCode,
              isParent: true,
              isChecked: false,
              receiversName: ''
            })
            e.subscribeActions.forEach(x => {
              x.receiversName = []
              x.isChecked = false
              x.receivers.forEach(function(v) {
                x.receiversName.push(v.name)
              })
              x.receiversName = x.receiversName.join(',')
            })
            arr = arr.concat(e.subscribeActions)
          })
          this.data = arr
        } else {
          this.data = []
        }
        this.fullscreenLoading = false
      }).catch(() => {
        this.fullscreenLoading = false
      })
    }
  }
}

</script>
<style lang='scss' scoped>
  .sys-right-inner-wrap {
    width: 100% !important;
    margin: 0 !important;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background: #f2f2f2;
  }

  .container-wrap {
    margin: 20px;
    padding: 10px 20px;
    background: #fff;
  }

  .operation {
    margin-right: 10px;
    color: #409eff;
    cursor: pointer;
  }

  .edit-dialog {
    max-height: 400px;
    overflow-y: scroll;
    line-height: 22px;

    .row-receiver {
      border: 1px solid #c7d3e3;
      margin-top: 10px;
      padding: 10px;
    }
    .row-receiver.active {
      border-color: #409eff;
    }
    .name {
      font-weight: 600;
    }
    .mobile {
      margin-right: 60px;
    }
    .edit-title {
      overflow: hidden;

      .el-alert {
        width: 250px;
        float: left;
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 2px;
        padding: 4px 10px;
        color: #666;

        ::v-deep .el-alert__icon {
          color: #048cff;
        }
      }
      a {
        color: #409eff;
        float: right;
      }
    }
  }

  .operating span {
    margin-right: 10px;
  }

</style>
