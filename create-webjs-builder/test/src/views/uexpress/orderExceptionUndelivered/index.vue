<template>
  <div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="activeName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressOrder.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressOrder.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataSimpleRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="width: 100px;float: left;"></el-form-item>
            <el-form-item label='' prop="nos" class="multiple-no-item">
              <el-input v-model="formData.nos" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="activeName === 'BASE_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">

            <el-form-item label="">
              <template slot="label">
                <el-select v-model="formData.noType" style="width: 100px;">
                  <el-option :label="$t('uexpressOrder.orderNo')" value="orderNo"></el-option>
                  <el-option :label="$t('uexpressOrder.channelOrderNo')" value="channelOrderNo"></el-option>
                  <el-option :label="$t('uexpressOrder.memberOrderNo')" value="memberOrderNo"></el-option>
                </el-select>
              </template>
              <el-input v-trim :placeholder="$t('common.placeholder')" v-model="formData.nos" clearable />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.channelCode')" prop="channelCode">
              <uexpress-type-select type="channel" v-model="formData.channelCode" clearable filterable @selected="channelSelected" />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.supplierId')" prop="supplierId">
              <type-select v-model="formData.supplierId"  type="supplier" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '17011'}" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-dropdown size="mini" @command="operFn" style="margin-right: 10px;">
          <el-button type="primary" size="mini">{{$t("uexpressOrder.batchOper")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">{{$t("uexpressOrder.batchFollow")}}</el-dropdown-item>
            <el-dropdown-item :command="2">{{$t("uexpressOrder.batchComplete")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
				<el-dropdown size="mini" @command="exportFn" style="margin-right: 10px;">
          <el-button type="primary" size="mini">{{$t("uexpressOrder.export")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">{{$t("uexpressOrder.batchExport")}}</el-dropdown-item>
            <el-dropdown-item :command="2">{{$t("uexpressOrder.seExport")}}</el-dropdown-item>
            <el-dropdown-item :command="3">{{$t("uexpressOrder.claimExport")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
			</div>
      <el-tabs v-model="abnormalityState" class="middle-tabs" @tab-click="abnormalityTabsClick">
        <el-tab-pane :label='$t("uexpressOrder.PENDING") + "(" + pendingCount + ")"' name="1"></el-tab-pane>
        <!-- <el-tab-pane :label='$t("uexpressOrder.PROCESSING") + "(" + processingCount + ")"' name="2"></el-tab-pane> -->
        <el-tab-pane :label='$t("uexpressOrder.SOLVED") + "(" + solvedCount + ")"' name="3"></el-tab-pane>
        <el-tab-pane :label='$t("uexpressOrder.ALL") + "(" + allCount + ")"' name="ALL"></el-tab-pane>
      </el-tabs>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="batchFollowVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.batchFollow")'>
      <el-form class="contact-form" ref="batchFollowRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressOrder.batchFollowTemplate")}}</el-button>
        </div>
        <el-form-item :label='$t("uexpressOrder.uploadFile")' prop="abnormalityExcel">
          <upload-file v-model="importForm.abnormalityExcel" accept=".xls,.xlsx" :limit="1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchFollowVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchFollowConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="followVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.follow")'>
      <el-form class="contact-form" ref="followFormRef" :model="followForm" :rules="followFormRule" label-width="100px" size="mini">
        <el-form-item :label='$t("uexpressOrder.flowUpRemark")' prop="flowUpRemark">
          <el-input v-model="followForm.flowUpRemark" type="textarea" :rows="3"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="followVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="followConfirmFn" :loading="followLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderExceptionListApi,
  getOrderExceptionListByNosApi,
  undeliveredFollowApi, // 未妥投异常-跟进
  undeliveredBatchFollowApi, // 未妥投异常-批量跟进
  undeliveredBatchCompletedApi // 未妥投异常-批量处理完成
} from '@/api/uexpress/orderException'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import mixin from "@/views/uexpress/orderException/mixin";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import OptionBtn from './optionBtn'

export default {
  name: "UexpressOrderExceptionUndeliveredList",
  mixins: [mixin],
  components: {
    OptionBtn
  },
  data() {
    return {
      selectItem: {},
      activeName: 'BASE_SEARCH',
      loading: false,
      abnormalityType: 810, // 未妥投异常
      abnormalityState: '1',

      // 批量跟进
      batchFollowVisible: false,
      batchImportLoading: false,
      importForm: {
        abnormalityExcel: []
      },
      importFormRule: {
        abnormalityExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      // 跟进
      followVisible: false,
      followLoading: false,
      followForm: {
        flowUpRemark: ''
      },
      followFormRule: {
        flowUpRemark: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      columnFields: [{
          field: 'index',
          headerName: '',
          width: 55,
          pinned: 'left',
          suppressSorting: true,
          checkboxSelection: true,
          suppressMenu: true,
          suppressSizeToFit: true,
          suppressResize: true,
          headerCheckboxSelection: true
        },
        {
          field: "orderNo",
          headerName: this.$t("uexpressOrder.orderNo"),
          minWidth: 160,
          cellRendererFramework: "OrderNoComponent"
        },
        {
          field: "orderChannelNo",
          headerName: this.$t("uexpressOrder.orderChannelNo"),
          minWidth: 140,
          cellRendererFramework: "OrderChannelNoComponent"
        },
        {
          field: "memberOrderNo",
          headerName: this.$t("uexpressOrder.memberOrderNo"),
          minWidth: 160,
          cellRendererFramework: "MemberOrderNoComponent"
        },


        {
          field: "customerName",
          headerName: this.$t("uexpressOrder.customerName"),
          minWidth: 120
        },
        {
          field: "channelSupplierName", // 尾程供应商
          headerName: this.$t("uexpressOrder.channelSupplierName"),
          minWidth: 150
        },
        {
          field: "channelName",
          headerName: this.$t("uexpressOrder.channelName"),
          minWidth: 120
        },
        {
          field: "orderStateName",
          headerName: this.$t("uexpressOrder.orderStateName"),
          minWidth: 120
        },
        {
          field: "abnormalStateName", // 异常状态（名称虽然是处理状态）
          headerName: this.$t("uexpressOrder.abnormalityProcessState"),
          minWidth: 120
        },
        {
          field: 'abnormalityReason',
          headerName: this.$t("uexpressOrder.abnormalityReason"),
          minWidth: 150
        },
        {
          field: 'flowUpRemark',
          headerName: this.$t("uexpressOrder.flowUpRemark"),
          minWidth: 150
        },
        {
          field: 'flowUpTime',
          headerName: this.$t("uexpressOrder.flowUpTime"),
          minWidth: 150
        },
        {
          field: "operation",
          pinned: 'right',
          headerName: this.$t("common.operation"),
          cellRendererFramework: "OptionBtn",
          minWidth: 120
        }
      ]
    }
  },
  created() {
    this.getList()
    this.getCount()
  },
  methods: {
    // 跟进
    followFn(item) {
      this.followForm = {
        flowUpRemark: ''
      }
      this.followVisible = true
      this.selectItem = item
    },
    followConfirmFn() {
      this.$refs.followFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.followForm,
            id: {
              id: this.selectItem.id,
              abnormalitySk: this.selectItem.abnormalitySk
            }
          }
          this.followLoading = true
          undeliveredFollowApi(data).then(res => {
            if (res.ok) {
              this.getList()
              this.followVisible = false
              this.$message.success(this.$t('uexpressOrder.followOperSuccess'))
            }
            this.followLoading = false
          })
        }
      })
    },
    operFn(operType) {
      switch (operType) {
        case 1:
          this.batchFollowFn()
          break;
        case 2:
          this.batchComplete()
          break;
        default:
          break;
      }
    },
    // 批量跟进
    batchFollowFn() {
      this.importForm = {
        abnormalityExcel: []
      }
      this.batchFollowVisible = true
    },
    // 批量跟进-模板
    downloadTemplateFn() {
      getTemplateFileApi(20).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchFollowConfirmFn() {
      this.$refs.batchFollowRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.abnormalityExcel = data.abnormalityExcel[0]
          this.batchImportLoading = true
          undeliveredBatchFollowApi(data).then(res => {
            if (res.ok) {
              this.getList()
              this.batchFollowVisible = false
              this.$message.success(this.$t('uexpressOrder.importOperSuccess'))
            }
            this.batchImportLoading = false
          })
        }
      })
    },
    // 批量处理完成
    batchComplete() {
      let arr = this.gridApi.getSelectedRows()
      if (arr.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      let VALID = true
      let ids = []
      arr.forEach(v => {
        ids.push({
          id: v.id,
          abnormalitySk: v.abnormalitySk
        })
        if (v.abnormalityState !== 1) {
          VALID = false
        }
      })
      if (!VALID) {
        // 只有【待处理】的订单，才能选择【批量处理完成】
        this.$message.error(this.$t('uexpressOrder.completeErrorInfo'))
        return
      }
      this.$confirm(this.$t('uexpressOrder.batchCompleteInfo'), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true
        let data = {
          ids: ids
        }
        undeliveredBatchCompletedApi(data).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t("uexpressOrder.operSuccess"));
          }
          this.loading = false
        });
      }).catch(() => { });
    }
  }
};
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  padding: 0 20px 20px 20px;
}
.multiple-no-wrap{
  width: 100%;
  overflow:hidden;
}

.multiple-no-item {
  width: calc(100% - 150px);
  float: left;

  ::v-deep .el-form-item__content {
    width: 100%;
  }
  .el-select {
    float: left;
    width: 80px;
  }
  .el-textarea {
    width: 100%;
    float: left;
  }
}
.pagination-container {
  margin-top: 0px;
}
</style>
