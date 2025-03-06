<template>
  <el-dialog :title="$t('sea.sendReplenishment')" :visible.sync="showDialog" :close-on-click-modal="false" :before-close="closeDialog" width="500px" class="dialog-box">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent ref="dataForm" v-loading="loading">
      <div class="flex-bet">
        <el-form-item prop="supplementaryAccount" :label="$t('sea.replenishmentAccountNo')" :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]" style="width: 48%">
          <el-select v-model="dataForm.supplementaryAccount" size="mini">
            <el-option v-for="item in optionList" :label="item.englishName" :value="item.englishName" :key="item.id"></el-option>
          </el-select>

        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submit">{{$t('sea.save')}}</el-button>
        <el-button size="mini" @click="closeDialog">{{$t('sea.cancel')}}</el-button>
      </span>
  </el-dialog>
</template>
<script>
import lodash from 'lodash'
import {getTerminologyListByTypeApi} from "@/api/common";
export default {
  name: 'sendReplenishment',
  components: { },
  props: {
    // value: { type: String, default: null },
    showDialog: { type: Boolean, default: false },
    data: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      dataForm: {
      },
      optionList:[]
    }
  },
  computed: {
  },
  async created() {
    let res = await getTerminologyListByTypeApi('SUPPLEMENTARY_ACCOUNT')
    if(res.ok){
      this.optionList = res.content
    }
  },
  methods: {
    async submit() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.bookingConfirmCallBack()
          this.closeDialog()
        }
      })
    },
    bookingConfirmCallBack() {
      this.$emit('submitCallBack', this.dataForm)
    },
    closeDialog() {
      this.$emit('update:showDialog', false)
    },
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
::v-deep .el-form--inline .el-form-item{ display: inline-block}
//**
.data-table{
  ::v-deep {
    .el-form-item{ margin: 10px 0}
    .el-form-item__error{ display: none}
    .el-form-item__content{
      max-width: 100%;
    }
  }
}

.el-input__inner.disabled {
  background-color: #F5F7FA;
  border-color: #dfe4ed;
  color: #606266 ;
  cursor: not-allowed;
}
::v-deep {
  .el-form-item__label{ width: auto !important}
}
</style>
