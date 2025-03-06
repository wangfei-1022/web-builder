<template>
  <el-dialog :title="$t('receiveFms.create_bill')" :visible.sync="visible" width="500px">
    <div class="create-bill">
      <i class="iconfont icon-yanzhengchenggong"></i>
      <div class="render">{{ $t('receiveFms.already_create_bill') }}</div>
      <div class="bill-no-info">
        {{ $t('receiveFms.click_bill_no') }}
        <a class="link" @click="billDetail()">{{ billInfo.billNo }}</a>
        {{ $t('receiveFms.view_detail') }}
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="visible = false">{{ $t('common.close') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

export default {
  name: "CreateBillSuccess",
  props: {
    type: {
      type: String,
      default: ''
    },
    billInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {

  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    billDetail () {
      console.log("type", this.type)
      this.visible = false
      if (this.type === "pay") {
        this.$router.push({ name: `AirFmsPayableBillDetail`, query: { id: this.billInfo.id } })
      } else {
        this.$router.push({ name: `AirFmsReceiveBillDetail`, query: { id: this.billInfo.id } })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.create-bill {
  text-align: center;

  i {
    font-size: 60px;
    color: rgb(82, 196, 26);
  }

  .render {
    font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
    font-weight: 650;
    font-style: normal;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.847058823529412);
    line-height: 32px;
    margin: 10px 0;
  }

  .bill-no-info {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    text-align: center;
    line-height: 22px;
  }

  .link {
    color: #108ee9;
    text-decoration: underline;
  }
}
</style>

