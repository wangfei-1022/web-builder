<template>
  <el-dialog  v-loading="loading" :title="$t('sea.confirmationOfBookingChannel')" :visible.sync="bookingDialog" :close-on-click-modal="false" :before-close="closeDialog" width="600px" class="dialog-box">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="form">
      <el-form-item :label="$t('sea.cargoType')+':'" prop="goodsTypeCode">
        {{goodsTypeCode}}
      </el-form-item>
      <el-form-item :label="$t('sea.bookingChannel')+':'" prop="bookingChannel" :rules="[ { required: true, message: $t('sea.placeholder'), trigger: 'change' } ]">
        <el-radio-group v-model="dataForm.bookingChannel">
          <el-radio :label="1">EB</el-radio>
          <el-radio :label="2" style="margin-left: 10px">SynconHub</el-radio>
          <el-radio :label="3" style="margin-left: 10px">{{$t('sea.other')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('sea.bookingMethod')+':'" prop="bookingJobMethod" :rules="[ { required: true, message: $t('sea.placeholder'), trigger: 'change' } ]">
        <el-radio-group v-model="dataForm.bookingJobMethod">
          <el-radio v-if="goodsTypeCode === 'GC' && dataForm.bookingChannel === 1" :label="2" style="margin-right: 10px">{{$t('sea.automatic')}}</el-radio>
          <el-radio :label="1" >{{$t('sea.artificial')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="display: flex; color: red; font-size: 12px">
      <div style="margin-right: 10px">{{$t('sea.prompt')}}</div>
      <div>
        <div>{{$t('sea.confirmationOfBookingChannelTips1')}}</div>
        <div>{{$t('sea.confirmationOfBookingChannelTips2')}}</div>
        <div>{{$t('sea.confirmationOfBookingChannelTips3')}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>
<script>
import lodash from 'lodash'
import { exitCustomsContainerApi} from "@/api/seaExportOrder"
export default {
  name: 'BookingConfirm',
  components: { },
  props: {
    // value: { type: String, default: null },
    bookingDialog: { type: Boolean, default: false },
    bookingJobId: { type: String, default: null },
    containerListDataProp: { type: Object, default: () => {} },
    goodsTypeCode: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      dataForm: {
        bookingChannel: 1,
        bookingJobMethod: null
      },
      containerListData: []
    }
  },
  created() {

  },
  methods: {

    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.bookingConfirmCallBack()
          this.closeDialog()
        }
      })
    },
    bookingConfirmCallBack() {
      this.$emit('bookingConfirmCallBack', this.dataForm)
    },
    closeDialog() {
      this.$emit('update:bookingDialog', false)
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
