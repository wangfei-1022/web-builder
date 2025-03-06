<template>
  <el-dialog  v-loading="loading" :title="$t('sea.checkOut')" :visible.sync="JobShutOutDialog" :close-on-click-modal="false" :before-close="closeDialog" width="600px" class="dialog-box">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="form">
      <el-form-item :label="$t('sea.wholeTicketPart')+':'" prop="shutType">
        <el-radio-group v-model="dataForm.shutType">
            <el-radio :label="1">{{$t('sea.wholeTicket')}}</el-radio>
            <el-radio :label="2" style="margin-left: 10px">{{$t('sea.part')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.shutType === 2 " :label="$t('sea.container')+':'" prop="ids"  :rules="[ { required: true, message: $t('sea.pleaseSelectAContainer'), trigger: 'change' } ]" >
          <div style="width: 200px; height: 120px; overflow: auto">
            <div>
              <el-checkbox-group v-model="dataForm.ids" class="added_services">
                <el-checkbox v-for="item in containerListData.containerList" :key="item.id" :label="item.id">
                  {{item.containerNo ? item.containerNo : $t('sea.unboxed2') }}
                </el-checkbox>
              </el-checkbox-group>

            </div>
          </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>
<script>
import lodash from 'lodash'
import {containerListApi, exitCustomsContainerApi, seaShutOutApi} from "@/api/seaExportOrder"
import orderMixin from './orderMixin'

export default {
  name: 'JobShutOut',
  components: { },
  mixins: [orderMixin],
  props: {
    // value: { type: String, default: null },
    JobShutOutDialog: { type: Boolean, default: false },
    bookingJobId: { type: String, default: null },
    containerListDataProp: { type: Object, default: () => {} },
    orderDetailsData: {
			type: Object, default: () => {
			}
		}
  },
  data() {
    return {
      loading: false,
      dataForm: {
        shutType: 1,
        ids: []
      },
      containerListData: []
    }
  },
  created() {
    if (this.$isEmpty(this.containerListDataProp)) {
      this.getContainerList(this.bookingJobId)
    } else {
      this.containerListData = this.containerListDataProp
    }
  },
  methods: {
    async getContainerList(id) {
      this.loading = true
      const res = await containerListApi(id)
      this.loading = false
      if (res.ok) {
        this.containerListData = res.content
      }
    },
    async submit() {
      if (this.dataForm.shutType === 1) {
        this.loading = true
        const res = await seaShutOutApi(this.bookingJobId)
        this.loading = false
        if (res.ok) {
          this.$message.success(this.$t('sea.exitSuccessfully'))
          this.$emit('exitSuccessfully')
          this.closeDialog()
        }
      } else {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.getExitCustomsContainerApi()
          }
        })
      }
    },
    async getExitCustomsContainerApi() {
      this.loading = true
      const ids = this.dataForm.ids.map(item => item)
      const res = await exitCustomsContainerApi(ids)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('sea.exitSuccessfully'))
        this.$emit('exitSuccessfully')
        this.closeDialog()
      }

    },
    closeDialog() {
      this.$emit('update:JobShutOutDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.icon{ font-size: 28px; transition: all 0.2s ease 0s; cursor: pointer;user-select: none;
  &:hover{ transform: scale(1.1)}
}
.blue{ color: #1890ff}
.red{color: #ff4949}
.flex-bet{ display: flex; align-items:flex-start ; justify-content: space-between;flex-wrap:wrap;}
.box_title{ border-left: solid 3px rgb(24,144,255);font-size: 18px; color: #199ED8; padding-left: 8px; height: 28px; line-height: 28px; margin:5px 0 8px 0; display: flex;
  .operate-buttons-left{ margin-left: 20px}
}
.box{ background-color: #f5f7f7; padding: 8px;
  ::v-deep .el-form-item--medium{
    .el-form-item__content{ line-height: 28px}
    .el-form-item__label{ line-height: 28px}
  }
}
.box_child{border: solid 1px rgba(121, 121, 121, 1); padding: 20px 30px; background: #fff; margin-bottom: 15px;
  .box25{ width: 20%}
}
::v-deep .el-form--inline .el-form-item{ display: block}
//**
.case-data-table{ width: 90%;
  ::v-deep {
    .el-form-item{ margin: 10px 0}
    .el-form-item__error{ display: none;}
  }
}

.el-input__inner.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #606266 ;
  cursor: not-allowed;
}
::v-deep .el-checkbox{ display: block}

</style>
