<template>
  <div class="sys-right-inner-wrap">
    <div class="head">
      <i class="el-icon-success" style="font-size: 78px; color: rgb(82,196,26)" />
      <p class="p1">{{ $t('blInfo.submitSuc') }}</p>
      <p class="p2">{{ $t('blInfo.submitResult') }}</p>
    </div>
    <div class="cb-suc-middle">
      <p class="p1">{{ $t('blInfo.BLInfo') }}</p>
      <div class="info">
        <div class="BLNo">{{ $t('blInfo.bookingNumber') }}：{{ returnBLData.blNo }}</div>
        <div class="total">
          <p>&nbsp;&nbsp;&nbsp;{{ $t('blInfo.containerVolume') }}：<span>{{ returnBLData.containerSizeTypeQty }}</span></p>
          <p>{{ $t('blInfo.totalNumber') }}：<span>{{ returnBLData.quantity }}</span> {{ returnBLData.packageType }}</p>
          <p>{{ $t('blInfo.grossWeight') }}：<span>{{ returnBLData.weight }}</span> KGS</p>
          <p>{{ $t('blInfo.totalCapacity') }}：<span>{{ returnBLData.volume }}</span> CBM</p>
        </div>
      </div>
      <el-steps :active="stepsActive" align-center class="step-bar">
        <el-step :title="$t('blInfo.createBL')">
          <template slot="description">
            <div class="description">
              <p>{{ $t('blInfo.userName') }}: {{ returnBLData.createByName }}</p>
              <p>{{ dateFormat(returnBLData.createTime) }}</p>
            </div>
          </template>
        </el-step>
        <el-step :title="$t('blInfo.platformAudit')" />
        <el-step :title="$t('blInfo.examinationPassed')" />
        <el-step :title="$t('blInfo.issueBL')" />
      </el-steps>
      <div class="jump-btn">
        <router-link :to="{ name: 'BlList' }"><el-button type="primary">{{ $t('blInfo.backToList') }}</el-button></router-link>
        <el-button @click="viewBL">{{ $t('blInfo.viewBL') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Success',
  props: {
    returnBLData: {
      type: Object
    }
  },
  data() {
    return {
      stepsActive: 1
    }
  },
  created() {
    if (this.returnBLData.status === 4) {
      this.stepsActive = 2
    } else if (this.returnBLData.status === 5) {
      this.stepsActive = 3
    } else {
      this.stepsActive = this.returnBLData.status
    }
  },
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    })
  },
  methods: {
    dateFormat(date) {
      return this.$moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
    },
    viewBL() {
      if (this.$route.query.type === 'edit') {
        this.$router.go(0)
      } else {
        this.$router.push({ name: 'BLInfo', query: { blid: this.returnBLData.blId, type: 'edit' }})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.head{ text-align: center; margin-top: 40px;
  .p1{ font-size: 24px; font-weight: bold;}
  .p2{ font-size: 14px; color: rgba(0, 0, 0, 0.4)}
}
.cb-suc-middle{ width: 730px; margin: 45px auto 0 auto;
  .p1{ font-size: 16px; font-weight: bold; color: rgba(0, 0, 0, 0.8)}
  .info{ display: flex; justify-content: space-between;
    .BLNo{ font-size: 16px; color: rgba(0, 0, 0, 0.8);}
  }
  .total{ display: flex; flex-wrap: wrap; font-size: 14px; width: 420px;
    p{ width: 200px; margin: 0; margin-bottom: 5px;
      span{ color:rgba(255, 0, 0, 0.8) }
    }
  }
  .step-bar{ margin: 35px auto 25px auto }
  .description{ color: rgba(0, 0, 0, 0.8); text-align: left; font-size: 13px;
    p{ margin: 3px 0;}
  }
  .jump-btn{ display: flex; justify-content: center;
    button{ margin: 0 5px;}
  }
}
</style>
<style  lang="scss">
.cb-suc-middle{
  .el-step.is-center .el-step__description{ padding-left: 32%; padding-right: 0;}
}
</style>
