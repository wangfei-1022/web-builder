<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('fmsLock.detail')" name="1">
          <lock-charge-detail :id="id" :chargeList="chargeList" :lockOrderState="lockOrderState" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList()">{{$t('common.close')}}</el-button>
    </div>
  </div>
</template>

<script>
import { parseTime, formatNumberToThousands } from '@/utils/index';
import { getFmsOrderLockDetailApi } from '@/api/financial/fmsLock';
import LockChargeDetail from './LockChargeDetail';

// 申请核销
export default {
    name: 'FmsProfitApplyListDetail',
    components: {
        LockChargeDetail
    },
    data() {
        return {
            loading: false,
            id: '',
            origin: '',
            activeName: '1',
            chargeList: [],
            lockOrderState: null
        };
    },
    created() {
        this.orderId = this.$route.query.orderId;
        this.orderEntityType = this.$route.query.orderEntityType;
        this.origin = this.$route.query.origin;
        this.lockOrderState = Number(this.$route.query.lockOrderState);
        this.init();
    },
    methods: {
        init() {
            let data = {
                orderId: this.orderId,
                orderEntityType: this.orderEntityType
            };
            getFmsOrderLockDetailApi(data).then(res => {
                if (res.ok) {
                    this.chargeList = res.content;
                }
            });
        },
        backList(refresh) {
            if (this.origin) {
                this.$store.dispatch('tagsView/delView', this.$route);
                this.$router.push({ name: this.origin, query: { refresh: refresh } });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.page-edit-container .page-edit-content {
    padding: 0;
}
::v-deep .el-tabs__header {
    background: #fff;
    padding-left: 20px;
    line-height: 50px;
}
</style>
