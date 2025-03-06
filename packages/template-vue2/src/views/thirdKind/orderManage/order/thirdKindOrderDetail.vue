<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content relative">
      <el-tabs v-model="activeName" type="border-card">
        <!-- 订单 -->
        <el-tab-pane :label="$t('thirdKindOrder.tabsLabel.basic')" name="basic">
           <el-form ref="formData" :model="formData" label-width="100px">
              <ThirdBaseInfo ref="basic" isDisabled :formData="formData" @saved="getDetail" />
           </el-form>
        </el-tab-pane>
        <!-- 装箱 -->
        <el-tab-pane :label="$t('thirdKindOrder.tabsLabel.packing')" name="packing" lazy v-if="formData.id">
          <packing ref="packingRef" :id="id" @init="getDetail" v-if="activeName === 'packing'"/>
        </el-tab-pane>
        <!-- 费用 -->
        <el-tab-pane :label="$t('thirdKindOrder.tabsLabel.cost')" name="charge" lazy v-if="formData.id">
          <charge ref="chargeRef" :id="formData.id" v-if="activeName === 'charge'" />
        </el-tab-pane>
        <!-- 应收费用确认单 -->
        <el-tab-pane :label="$t('thirdKindOrder.tabsLabel.receivableExpense')" name="receivable" lazy v-if="formData.id">
          <receive-tab ref="receiveTabRef" :order="formData" :back="origin" :tabPane="activeName" />
        </el-tab-pane>
        <!-- 应付费用确认单 -->
        <el-tab-pane :label="$t('thirdKindOrder.tabsLabel.payableExpense')" name="payable" lazy v-if="formData.id">
          <pay-tab ref="payTabRef" :order="formData" :back="origin" :tabPane="activeName" />
        </el-tab-pane>
        <!-- 电子文件 -->
        <el-tab-pane :label="$t('thirdKindOrder.electronicDocuments')" name="electronicFile" v-if="formData.id">
          <electronicDocument ref="electronicFile" :formData="formData"  />
        </el-tab-pane>
      </el-tabs>
      <div class="top-button">
        <el-button type="primary" @click="adjustConfirmFn()" size="mini" v-if="formData.lockOrderState === 30">{{getZH('confirmTips9')}}</el-button>
      </div>
    </div>
     <div class="page-edit-footer">
        <!-- 取消订单 -->
        <el-button type="danger" v-permission="['thk:order:cancel']" v-if="formData.lockOrderState === 0 && formData.orderState !==100" size="mini" @click="cancelOrder" >{{ $t('thirdKindOrder.cancellationOfOrder') }}</el-button>
        <el-button size="mini" @click="backToList">{{ $t('common.backList') }}</el-button>
    </div>
  </div>
</template>
<script>
import ThirdBaseInfo from './components/thirdBaseInfo'
import electronicDocument from './components/electronicDocument'
import packing from './components/packing'
import getZHMixin from './components/getZHMixin'
import { saveThiOrderApi, detailThiOrderApi, cancelThiOrderApi, adjustCompleteApi } from '@/api/thirdKind'
import Charge from '../expense/chargeAll'
import receiveTab from '../expense/receiveTab'
import payTab from '../expense/payTab'

export default {
	name: 'ThirdKindOrderDetail',
	mixins: [getZHMixin],
	components: {
		ThirdBaseInfo,
		Charge,
		receiveTab,
		payTab,
		electronicDocument,
        packing
	},
	data() {
		return {
            id: '',
            origin: '',
			loading: false,
			activeName: 'basic',
			formData: {
                isUnLocked: true,
				id: null,
				orderNo: null,
				businessType: null,
				businessTypeName: null,
				businessLockState: null,
				customerId: null,
				customerName: null,
				contactCnName: null,
				contactMobile: null,
				contactEmail: null,
				sellerId: null,
				sellerName: null,
				orderLabel: null,
				orderLabelDesc: null,
				pol: null,
				polCode: null,
				pod: null,
				podCode: null,
				mblNo: null,
				hblNo: null,
				businessDate: null,
				supplierId: null,
				supplierName: null,
				actualQuantity: null,
				actualGrossWeight: null,
				actualChargeableWeight: null,
				actualVolume: null,
				cargoDesc: null,
				remarks: null,
				orderState: null,
				lockOrderState: 0, //0 未锁单 30  调整中 40 已调整 50 已锁单
				containerList: [{
					englishName: null,
					chineseName: null,
					ownerType: 2,
					ctnrNum: null,
					weight: null,
					typeCode: null
				}],
				fileList: [],
                boxList: [],
                groupCode: '',
                containerDesc: '',
                etd: '',
                eta: '',
                atd: '',
                placeOfDelivery: '',
                tbaFlag: false,
                voyage: '',
                vessel: '',
                portStation: '',
                portStationCode: '',
                columnCount: '',
                trainNo: '',
                licensePlateNo: ''
			}
		}
	},
	created() {
        this.origin = this.$route.query.origin
        this.id = this.$route.query.id
		if (this.id) {
			this.getDetail()
		}
	},
	methods: {
		async getDetail() {
			if (this.$isEmpty(this.id)) {
				return
			}
			this.loading = true
			let res = await detailThiOrderApi(this.id)
			if (res.ok) {
                res.content.isUnLocked = [0, 30].includes(res.content.lockOrderState) && res.content.orderState !==100
				this.$copyProps(this.formData, res.content)
			}
			this.loading = false
		},
		cancelOrder() {
			this.confirmTips(this.$t('common.cancelWarnningTips')).then(() => {
				this.loading = true
				cancelThiOrderApi(this.formData.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.cancelSuccess'))
						this.backToList()
					}
					this.loading = false
				})
			}).catch(() => { })
		},
		// 调整确认
		adjustConfirmFn() {
			if (this.formData.lockOrderState === 30) {
				let html = `
          <div>
            <p>${this.getZH('confirmTitle')}</p>
            <p>${this.getZH('confirmTips')}“<span style="color: red">${this.getZH('confirmTips1')}</span>”</p>
            <p>${this.getZH('confirmTips2')}“<span style="color: red">${this.getZH('confirmTips3')}</span>”，${this.getZH('confirmTips4')}</p>
          </div>
          `
				this.$confirm(html, this.getZH('confirmTips5'), {
					confirmButtonText: this.getZH('confirmTips6'),
					cancelButtonText: this.getZH('confirmTips7'),
					dangerouslyUseHTMLString: true,
					customClass: "adjust-confirm"
				}).then(() => {
					this.loading = true
					adjustCompleteApi(this.formData.id).then(res => {
						if (res.ok) {
							this.$message.success(this.getZH('confirmTips8'))
							this.backToList()
						}
						this.loading = false
					})
				}).catch(() => {

				});
			}
		},
		backToList() {
			if(this.origin) {
                this.$store.dispatch('tagsView/delView', this.$route)
			    this.$router.push({ name: this.origin })
            }
		}
	}
};

</script>
<style lang="scss" scoped>
.top-button {
	position: absolute;
	top: 25px;
	right: 40px;
}
</style>
