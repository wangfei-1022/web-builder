import { adjustConfirmOrderApi } from "@/api/airExport";
import EventBus from '@/utils/bus' // bus

export default {
  data() {
    return {

    };
  },
  methods: {
    // 调整确认
    adjustConfirmFn(order) {
      if (order.orderLockState === 30) {
        let html = `
          <div>
            <p>请确认订单是否调整完成</p>
            <p>1、如需继续调整，请点击“<span style="color: red">继续调整</span>”</p>
            <p>2、如已调整完成，请点击“<span style="color: red">锁定订单</span>”，锁单订单后内容将无法变更</p>
          </div>
          `

        // message: h('p', null, [
        //   h('p', null, '请确认订单是否调整完成 '),
        //   h('p', null, [
        //     h('span', null, '1、如需继续调整，请点击“'),
        //     h('span', { style: 'color: red' }, '继续调整'),
        //     h('span', null, '”')
        //   ]),
        //   h('p', null, [
        //     h('span', null, '2、如已调整完成，请点击“'),
        //     h('span', { style: 'color: red' }, '锁定订单'),
        //     h('span', null, '”，锁单订单后内容将无法变更')
        //   ])
        // ]),

        this.$confirm(html, '调整确认', {
          confirmButtonText: '锁定订单',
          cancelButtonText: '继续调整',
          dangerouslyUseHTMLString: true,
          customClass: "adjust-confirm"
        }).then(() => {
          adjustConfirmOrderApi(order.id).then(res => {
            if (res.ok) {
              this.$message.success("调整确认成功")
              EventBus.$bus.$emit('air/export/order', order)
            }
          })
        }).catch(() => {

        });
      }
    }
  }
};
