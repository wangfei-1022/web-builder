import { adjustConfirmOrderApi } from "@/api/seaExportOrder";
import { getOrderLockInfoApi } from "@/api/financial/fmsLock";

import EventBus from '@/utils/bus' // bus

export default {
  data() {
    return {
        infoVisible: false,
        infoMsg: '',
        infoData: {},
        order: {}
    };
  },
  methods: {
    // 调整确认
    async adjustConfirmFn(order) {
        this.order = order
      if (order.orderLockState === 20) {
        let data = {
            orderId: order.id,
            orderEntityType: 1201,
          }
        let res = await getOrderLockInfoApi(data)
        let msg = ''
         if(res.ok && res.content && res.content.mainOrderNos && res.content.mainOrderNos.length > 0) {
              let MBL = res.content.mainOrderNos.join('\\')
              let orderNos = res.content.orderNos.join('\\')
              msg = `
               该单为并单订单，主单：${MBL}，关联订单：${orderNos}，调整完成后所有订单均不可调整，是否确认锁定？
                `
         } else {
           
         }
         this.infoVisible = true
         this.infoMsg = msg;
         this.infoData = data;
      }
    },
    confirmFn() {
        this.loading = true
        adjustConfirmOrderApi(this.order.id).then(res => {
          if (res.ok) {
            this.$message.success("调整确认成功")
            this.getSeaOrderDetail && this.id && this.getSeaOrderDetail(this.id)
          }
          this.infoVisible = false
          this.loading = false
        })
    },
  }
};
