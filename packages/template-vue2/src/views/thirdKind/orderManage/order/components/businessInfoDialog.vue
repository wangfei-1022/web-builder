<template>
  <el-dialog :visible.sync="dialogVisible" :title="getZH('businessInfo')" width="1000px" :close-on-click-modal="false">
    <div class="dialog-content" v-loading="loading">
      <el-form ref="formDataRef" :model="formData" label-width="100px" v-if="dialogVisible" :rules="rules">
        <BusinessInfoIntegrated type="EDIT" :formData="formData" :isDisabled="false"  v-if="formData.groupCode === ThirdBusinessGroup.INTEGRATED_SERVICE" />
        <BusinessInfoDomestic type="EDIT" :formData="formData" :isDisabled="false" v-if="formData.groupCode === ThirdBusinessGroup.DOMESTIC_TRADE" />
        <BusinessInfoRoad type="EDIT" :formData="formData" :isDisabled="false" v-if="formData.groupCode === ThirdBusinessGroup.ROAD_TRANSPORT" />
        <BusinessInfoRail type="EDIT" :formData="formData" :isDisabled="false" v-if="formData.groupCode === ThirdBusinessGroup.RAIL_BUSINESS" />
        <BusinessInfoOverseas type="EDIT" :formData="formData" :isDisabled="false" v-if="formData.groupCode === ThirdBusinessGroup.OVERSEAS_WAREHOUSE" />
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"	size="mini" @click="saveForm()" :loading="loading">{{ $t("common.saveBtn") }}</el-button>
      <el-button size="mini"	@click="dialogVisible = false" :loading="loading">	{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import getZHMixin from './getZHMixin'

import BusinessInfoIntegrated from './businessInfoIntegrated'
import BusinessInfoDomestic from './businessInfoDomestic'
import BusinessInfoRoad from './businessInfoRoad'
import BusinessInfoRail from './businessInfoRail'
import BusinessInfoOverseas from './businessInfoOverseas'

import { detailThiOrderApi, saveThiOrderBusinessApi } from '@/api/thirdKind'
import { ThirdBusinessGroup } from '@/utils/constant'

export default {
	name: 'BusinessInfoRoadDialog',
	mixins: [getZHMixin],
	components: { 
        BusinessInfoIntegrated,
        BusinessInfoDomestic,
        BusinessInfoRoad,
        BusinessInfoRail,
        BusinessInfoOverseas,
     },
	props: {
		id: String
	},
	data() {
		let defaultForm = {
			id: null,
			orderLabel: null,
			businessTypeName: null,
			businessType: null,
			businessDate: null,
			pol: null,
			polCode: null,
			pod: null,
			podCode: null,
			mblNo: null,
			hblNo: null,
			supplierId: null,
			supplierName: null,
			actualQuantity: null,
			actualGrossWeight: null,
			actualVolume: null,
			actualChargeableWeight: null,
			cargoDesc: null,
			remarks: null,
			containerList: [],
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
            licensePlateNo: '',
            groupCode: ''
		}
		return {
			dialogVisible: false,
			loading: false,
			rules: {},
			defaultForm,
			formData: this.$extends(true, {}, defaultForm),
            ThirdBusinessGroup: ThirdBusinessGroup
		}
	},
	methods: {
        show() {
            this.dialogVisible = true
            this.getDetail()
        },
		async getDetail() {
			this.loading = true
			if (this.$isNotEmpty(this.id)) {
				let res = await detailThiOrderApi(this.id)
				if (res.ok) {
					this.$copyProps(this.formData, res.content)
				}
				this.loading = false
			}
		},
		 saveForm() {
            this.$refs.formDataRef.validate(async (valid) => {
                if(valid) {
                    this.loading = true
                    let res = await saveThiOrderBusinessApi(this.formData)
                    if (res.ok) {
                        this.$message.success(this.getZH('saveSuccess', 'common'))
                        this.dialogVisible = false
                        this.$emit('saved')
                    }
                    this.loading = false
                }
            })
			
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
