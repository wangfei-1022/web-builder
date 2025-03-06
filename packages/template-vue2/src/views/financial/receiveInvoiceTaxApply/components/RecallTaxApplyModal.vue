<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="500px" :title="$t('fmsReceiveInvoice.split_apply')">
    <div class="container">
      <div style="padding-left: 30px;margin-bottom: 16px;color: rgba(255,0,0,0.7);">{{$t('fmsReceiveInvoice.splitApplyInfo')}}</div>
      <el-form ref="formDataRef" :inline="true" :model="formData" :rules="formDataRules" label-width="100px" size="mini">
        <el-form-item :label="$t('fmsReceiveInvoice.splitCurrency')" prop="currencyCode">
          <el-select v-model="formData.currencyCode" size="mini" style="width: 100%;">
						<el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
					</el-select>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="visible = false">{{ $t("customerManage.cancel")}}</el-button>
      <el-button size="mini" type="primary" @click="confirmFn" :loading="loading">{{ $t("customerManage.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInvoiceApplyTaxSplitCurrencyApi, invoiceApplyTaxSplitApi } from "@/api/financial/fmsReceiveInvoice"

// 撤回申请
export default {
	name: "RecallTaxApplyModal",
	components: { },
	props: {
    role: {
      type: String,
      default: ''
    }
	},
	data() {
		return {
      item: {},
      applyId: '',
      currencyList: [],
			visible: false,
      loading: false,
      successInfo: {

      },
      formData: {
        currencyCode: ''
      },
      formDataRules: {
				currencyCode: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "change" }]
			}
    };
	},
	created() {

	},
	methods: {
		show(item) {
      this.item = item
      this.currencyList = []
      this.formData = {
        currencyCode: ''
      }
      this.applyId = item.id
      getInvoiceApplyTaxSplitCurrencyApi({ invoiceApplyId: item.id }).then(res => {
        if (res.ok) {
          this.currencyList = res.content
          this.visible = true;
        }
      })
		},
    confirmFn() {
      this.$refs.formDataRef.validate(valid => {
        if (valid) {
          let data = {
            applyId: this.applyId,
            currencyCode: this.formData.currencyCode
          }
          this.loading = true;
          invoiceApplyTaxSplitApi(data).then(res => {
            if (res.ok) {
              this.successInfo = {
                ...res.content
              }
              this.visible = false
              this.submitSuccessFn()
            }
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        }
      })
    },
    applyTaxDetail() {
      this.$msgbox.close()
      this.$router.push({
        name: `FmsTaxInvoiceApplyDetail`,
        query: {
          id: this.successInfo.id,
          invoiceType: this.item.invoiceType,
          role: this.role
        }
      })
    },
    // 撤回申请 提交成功
    submitSuccessFn() {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t('common.mention'),
        message: h('div', { class: 'create-bill' }, [
          h('i', { class: 'iconfont icon-yanzhengchenggong' }),
          h('div', { class: 'render' }, this.$t('fmsReceiveInvoice.splitSubmitSuccess')),
          h('div', { class: 'bill-no-info' }, [
            h('span', null, this.$t('fmsReceiveInvoice.applyNo')),
            h('a', { class: 'link', on: { click: this.applyTaxDetail } }, this.successInfo.applyNo)
          ])
        ]),
        showCancelButton: false,
        confirmButtonText: this.$t('common.confirm'),
        beforeClose: (action, instance, done) => {
          done();
          this.$emit('ok')
        }
      });
    }
	}
};
</script>

<style lang="scss" scoped>
.create-bill {
	text-align: center;
	background: #fff;

	i {
		font-size: 40px;
		color: rgb(82, 196, 26);
	}
	.render {
		font-weight: 650;
		font-style: normal;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.847058823529412);
		line-height: 32px;
	}
	.bill-no-info {
		font-weight: 400;
		font-style: normal;
		text-align: center;
		line-height: 22px;
		margin-bottom: 40px;
	}
	.link {
		color: #108ee9;
		text-decoration: underline;
		margin-left: 10px;
	}
}
</style>
