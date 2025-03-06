<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="page-edit-content relative">
      <el-tabs v-model="activeName" type="border-card">
        <!-- 订单 -->
        <el-tab-pane :label="$t('thirdKindOrder.tabsLabel.basic')" name="basic">
           <el-form ref="formData" :model="formData" label-width="100px">
              <ThirdBaseInfo ref="basic" type="ADD" :formData="formData" />
           </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
     <div class="page-edit-footer">
        <el-button type="primary" size="mini" @click="saveForm('formData')" >{{ $t('common.saveBtn') }}</el-button>
        <el-button size="mini" @click="backToList">{{ $t('common.backList') }}</el-button>
    </div>
  </div>
</template>
<script>
import ThirdBaseInfo from './components/thirdBaseInfo'
import getZHMixin from './components/getZHMixin'
import { saveThiOrderApi } from '@/api/thirdKind'

export default {
	name: 'ThirdKindOrderAdd',
	mixins: [getZHMixin],
	components: {
		ThirdBaseInfo,
	},
	data() {
		return {
            origin: '',
			loading: false,
			activeName: 'basic',
			formData: {
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
                groupCode: '',
                boxList: []
			}
		}
	},
	created() {
        this.origin = this.$route.query.origin
        this.formData.businessType = this.$route.query.businessType,
        this.formData.businessTypeName = this.$route.query.businessTypeName,
        this.formData.businessDate = this.$route.query.businessDate,
        this.formData.groupCode = this.$route.query.groupCode
	},
	methods: {
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return
				}
				let saveForm = this.$extends(true, {}, this.formData)
                let containerList = []
                let check = true
                this.formData.containerList.forEach(v => {
                    if(v.englishName || v.ctnrNum) {
                        if(v.englishName && v.ctnrNum) {
                            containerList.push(v)
                        } else {
                            check = false
                        }
                    }
                })
                if(!check) {
                    this.$message.error('请完整填写箱型箱量')
                    return
                }
                saveForm.containerList = containerList
				this.loading = true
				saveThiOrderApi(saveForm).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('saveSuccess', 'common'))
						this.backToList()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
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

</style>
