<template>
  <el-dialog :title="title" :visible.sync="visible" width="800px" @close="closeFn">
    <div slot="title">
      <div style="color: white;">
        <span style="margin-right: 15px;">{{title}}</span>
        <span v-if="state === 2" style="font-size: 14px;">
          {{$t('fmsLock.batchOperRuningInfo', { inCount: successList.length + failList.length, unCount: (rowsList.length - successList.length - failList.length) })}}
        </span>
        <span v-if="state === 4" style="font-size: 14px;">
          <span>{{$t('fmsLock.batchOperEndingInfo')}} </span>
          <span style="cursor: pointer;text-decoration: underline;" @click="allInit">{{$t('fmsLock.batchOperEndingInfo1', { allCount: rowsList.length})}} </span>，
          <span style="cursor: pointer;text-decoration: underline;"
                @click="successInit">{{$t('fmsLock.batchOperEndingInfo2', { successCount: successList.length, failCount: failList.length })}} </span>，
          <span style="cursor: pointer;text-decoration: underline;color: #ff0c0c;" @click="failInit">{{$t('fmsLock.batchOperEndingInfo3', { failCount: failList.length })}} </span>。
        </span>
      </div>
    </div>
    <div style="overflow: hidden;">
       <div v-if="step === 1">
            <div style="margin-bottom: 8px;">以下订单存在并单场景，请确认是否{{title}}?</div>
            <el-table class="yht-table" size="mini" :data="mergeOrders" style="width: 100%;" height="400" row-key="id" border>
                <el-table-column prop="orderNo" :label="$t('fmsLock.orderNo')" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="mainOrderNo" :label="$t('fmsLock.MBL')" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="unitName" label="关联主单号" min-width="100" >
                    <template slot-scope="{ row }">
                        <span v-for="(item, index) in row.mainOrderNos" :key="index">{{item}}<br /></span>
                    </template> 
                </el-table-column>
                <el-table-column prop="unitName" label="其他关联订单" min-width="100" >
                    <template slot-scope="{ row }">
                        <span v-for="(item, index) in row.orderNos" :key="index">{{item}}<br /></span>
                    </template> 
                </el-table-column>
            </el-table>
       </div>
        <div v-if="step === 2">
            <el-table class="yht-table" size="mini" :data="dataList" style="width: 100%;"  height="400" row-key="id" border>
                <el-table-column prop="orderNo" :label="$t('fmsLock.orderNo')" min-width="150" show-overflow-tooltip/>
                <el-table-column prop="mainOrderNo" :label="$t('fmsLock.MBL')" min-width="150" show-overflow-tooltip/>
                <el-table-column prop="unitName" label="执行结果" min-width="200" >
                    <template slot-scope="{ row }">
                        <span style="margin-left: 10px;">
                            <!-- 默认 -->
                            <span v-if="row.stateCode === 10">-</span> 
                            <!-- 成功 -->
                            <span v-if="row.stateCode === 20"><i class="iconfont icon-chenggong"  />执行成功</span>
                            <!-- 执行 -->
                            <i class="el-icon-loading" v-if="row.stateCode === 30" />
                            <!-- 失败 -->
                            <span v-if="row.stateCode === 40">
                                <i class="iconfont icon-guanbi1"  />
                                执行失败 {{row.failMessage}}
                            </span>
                        </span>
                    </template> 
                </el-table-column>
                
            </el-table>
       </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <span v-if="step === 1">
            <el-button @click="close" size="mini">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="nextFn" size="mini">{{$t('common.nextStep')}}</el-button>
        </span>
        <span v-if="step === 2">
            <el-button @click="close" size="mini" v-if="state === 1">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="startFn" size="mini" v-if="state === 1">{{title}}</el-button>
            <el-button type="primary" size="mini" :loading="true" v-if="state === 2">{{$t('fmsLock.excuteRuning')}}</el-button>
            <el-button @click="close" size="mini" v-if="state === 4">{{$t('common.close')}}</el-button>
        </span>
    </span>
  </el-dialog>
</template>

<script>
import { fmsOrderUnlockApi, fmsOrderLockApi, getOrderLockInfoApi } from '@/api/financial/fmsLock';
export default {
    name: 'BatchLockDialog',
    data() {
        return {
            activeRow: {},
            title: '',
            visible: false,
            step: 1, // 
            state: 1, // 1.init 2.start 3.stop 4.end
            successList: [],
            failList: [],
            rowsList: [],
            dataList: [],
            mergeOrders: [],
            excuteIndex: 0
        };
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', this.refreshFn);
    },
    methods: {
        itemClick(row) {
            this.activeRow = row;
        },
        init() {
            this.state = 1;
            this.ids = [];
            this.successList = [];
            this.failList = [];
        },
        refreshFn(e) {
            e.returnValue = '确定要刷新页面吗？';
        },
        show(rows, isLock, initCallback) {
            let arr = []
            let mergeOrders = []
            const checkFinish = () => {
                if(arr.length === rows.length) {
                    // 初始化获取并单完成
                    initCallback()
                    this.mergeOrders = mergeOrders
                    this.showDialog(rows, isLock)
                }
            }
            rows.forEach(item => {
                let data = {
                    orderId: item.orderId,
                    orderEntityType: item.orderEntityType,
                    isLock: false
                };
                getOrderLockInfoApi(data).then(res => {
                    if(res.ok) {
                        arr.push(res)
                        // 并单
                        if(res.ok && res.content && res.content.mainOrderNos && res.content.mainOrderNos.length > 0) {
                            mergeOrders.push({
                                ...item,
                                mainOrderNos: res.content.mainOrderNos,
                                orderNos: res.content.orderNos,
                            })
                        }
                        checkFinish()
                    }
                })
            })
        },
        showDialog(rows, isLock) {
            if(this.mergeOrders.length > 0) {
                this.step = 1
            } else {
                this.step = 2
            }
            this.init();
            let rowsList = this.$extends(true, [], rows);
            rowsList.forEach(v => {
                v.stateCode = 10;
            });
            this.rowsList = rowsList;

            this.title = isLock ? this.$t('fmsLock.batchLock') : this.$t('fmsLock.batchUnlock');
            this.isLock = isLock
            this.visible = true;
            this.allInit();
        },
        allInit() {
            if (this.rowsList.length > 0) {
                this.dataList = this.rowsList;
                this.activeRow = this.rowsList[0];
            }
        },
        successInit() {
            if (this.successList.length > 0) {
                this.dataList = this.successList;
                this.activeRow = this.successList[0];
            }
        },
        failInit() {
            if (this.failList.length > 0) {
                this.dataList = this.failList;
                this.activeRow = this.failList[0];
            }
        },
        startFn() {
            this.state = 2;
            this.excuteIndex = 0;
            window.addEventListener('beforeunload', this.refreshFn);
            this.submitFn();
        },

        async submitApiFn(item) {
            let data = {
                orderId: item.orderId,
                orderEntityType: item.orderEntityType,
                isLock: this.isLock
            };
            let res = null;
            if (this.isLock === false) {
                res = await fmsOrderUnlockApi(data);
            } else {
                res = await fmsOrderLockApi(data);
            }
            return res;
        },
        nextFn() {
            this.step = 2
        },
        async submitFn() {
            if (this.rowsList.length && this.excuteIndex < this.rowsList.length) {
                let item = this.rowsList[this.excuteIndex];
                item.stateCode = 30;
                const res = await this.submitApiFn(item);
                this.excuteIndex++;
                if (res.ok && res.content && res.content.result) {
                    this.successList.push(item);
                    item.result = res.content.result;
                    item.stateCode = 20;
                } else {
                    if (res.errorString) {
                        item.failMessage = res.errorString;
                        item.result = false;
                    }
                    if (res.content) {
                        item.failMessage = res.content.failMessage;
                        item.result = res.content.result;
                    }
                    this.failList.push(item);
                    item.stateCode = 40;
                }
                this.submitFn();
            } else {
                this.state = 4;
                window.removeEventListener('beforeunload', this.refreshFn);
            }
        },
        close() {
            this.visible = false;
        },
        closeFn() {
            window.removeEventListener('beforeunload', this.refreshFn);
            this.visible = false;
            this.$emit('success');
        }
    }
};
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
.icon-chenggong {
    color: rgb(21, 126, 213);
}
.icon-guanbi1 {
    color: red;
}
.order-check {
    width: 100%;
    margin-bottom: 8px;

    .order-check-title {
        margin-bottom: 6px;
        font-size: 15px;
        font-weight: 600;
    }
    .order-check-item {
        line-height: 28px;
        text-indent: 12px;

        .icon-chenggong {
            color: rgb(21, 126, 213);
        }
        .icon-guanbi1 {
            color: red;
        }
    }
}
</style>
