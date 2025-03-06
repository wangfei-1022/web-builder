<template>
  <div v-loading="fullscreenLoading" class="sys-right-inner-wrap">
    <div class="container-wrap">
      <div class="features-btn">
        <el-button type="primary" size="mini" @click="addFn">{{ $t('receiverManage.add') }}</el-button>
      </div>
      <el-table class="dataTable" :data="tableData" @selection-change="handleSelectionChange" :height="tableHeight+'px'">
        <el-table-column prop="name" :label="$t('receiverManage.name')" align="center" width="200" />
        <el-table-column prop="mobile" :label="$t('receiverManage.mobile')" align="center" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.mobile }}
              <el-popover v-if="scope.row.mobile && !scope.row.mobileFlag && false" placement="top-start" title="" width="200" trigger="hover">
                <div>{{ $t('receiverManage.mobileUnIdentification') }}<a class="resend" @click="resend(scope.row)">{{ $t('receiverManage.resend') }}</a></div>
                <span slot="reference"><i class="el-icon-info unAuth" /></span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" :label="$t('receiverManage.email')" align="center" width="300">
          <template slot-scope="scope">
            <div>
              {{ scope.row.email }}
              <el-popover v-if="scope.row.email && !scope.row.emailFlag" placement="top-start" title="" width="200" trigger="hover">
                <div>{{ $t('receiverManage.emailUnIdentification') }}<a class="resend" @click="resend(scope.row)">{{ $t('receiverManage.resend') }}</a></div>
                <span slot="reference"><i class="el-icon-info unAuth" /></span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receiverManage.operating')" align="center">
          <template slot-scope="scope">
            <div class="operating">
              <span v-if="!scope.row.systemUserFlag" class="operation" @click="editFn(scope.row)">{{ $t('receiverManage.edit') }}</span>
              <span v-if="!scope.row.systemUserFlag" class="operation" @click="deleteFn(scope.row)">{{ $t('receiverManage.delete') }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <add-receiver ref="addReceiver" :form="form" @add-success="addSuccess" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getReceiverListApi, deleteReceiverApi, resendEmailApi } from '@/api/middleware/message'
import AddReceiver from './addReceiver'

export default {
  name: 'ReceiverList',
  components: {
    AddReceiver
  },
  data() {
    return {
      form: {},
      activeName: 'first',
      fullscreenLoading: false,
      pageSizeList: [10, 20, 30, 40],
      tableData: [],
      multipleSelection: [] // 列表选择
    }
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    })
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
    addFn() {
      this.form = {}
      this.$refs.addReceiver.show()
    },
    editFn(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.$refs.addReceiver.show()
    },
    addSuccess() {
      this.getList()
    },
    resend(row) {
      resendEmailApi(row).then(res => {
        if (res && res.ok) {
          this.$message({
            type: 'success',
            message: this.$t('receiverManage.resendSuccess')
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteFn(row) {
      deleteReceiverApi(row).then(res => {
        if (res.ok) {
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('receiverManage.deleteSuccess')
          })
        }
      })
    },

    getList() {
      const params = {
        ...this.searchForm
      }
      this.fullscreenLoading = true
      getReceiverListApi(params).then(res => {
        if (res.ok) {
          this.tableData = res.content
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

  .message-tab {
    background: #fff;
    padding: 0 20px;

    ::v-deep .el-tabs__header {
      margin: 0;
    }
  }

  .container-wrap {
    margin: 20px;
    padding: 10px 20px;
    background: #fff;
  }

  .pagination-wrap {
    margin-top: 20px;
    text-align: right;
  }

  .features-btn {
    margin-bottom: 15px;
  }

  .dataTable {
    margin-top: 15px;
  }

  .operation {
    margin-right: 10px;
    color: #409eff;
    cursor: pointer;
  }

  .unAuth {
    color: rgb(244, 189, 0);
  }

  .resend {
    color: #337ab7;
  }
</style>
