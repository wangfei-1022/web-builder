<template>
	<el-dialog :visible.sync="visible" :close-on-click-modal="false" width="800px" :title="title">
		<div class="container">
      <el-form class="yht-form" ref="formDataRef" :model="formData" :rules="formDataRules" label-width="100px" size="mini">
				<el-form-item :label="$t('uexpressOrder.consigneePersonalName')" prop="consigneePersonalName">
					<el-input v-model="formData.consigneePersonalName" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeMobile')" prop="consigneeMobile">
					<el-input v-model="formData.consigneeMobile" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeCompanyName')" prop="consigneeCompanyName">
					<el-input v-model="formData.consigneeCompanyName" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeEmail')" prop="consigneeEmail">
					<el-input v-model="formData.consigneeEmail" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeHouseNo')" prop="consigneeHouseNo">
					<el-input v-model="formData.consigneeHouseNo" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeRoomNo')" prop="consigneeRoomNo">
					<el-input v-model="formData.consigneeRoomNo" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeDetailAddress')" prop="consigneeDetailAddress" class="full-line">
					<el-input v-model="formData.consigneeDetailAddress" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeDetailAddress2')" prop="consigneeDetailAddress2" class="full-line">
					<el-input v-model="formData.consigneeDetailAddress2" />
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeArea')" prop="consigneeArea" class="full-line">
          <country-state :value="formData" disabled @change="countryStateChange"/>
				</el-form-item>
        <el-form-item :label="$t('uexpressOrder.consigneeZipCode')" prop="consigneeZipCode">
					<el-input v-model="formData.consigneeZipCode" />
				</el-form-item>
			</el-form>
		</div>

		<div slot="footer" class="option-btn-wrap">
			<el-button size="mini" @click="visible = false">{{ $t("common.cancel")}}</el-button>
			<el-button size="mini" type="primary" @click="confirmFn" :loading="submitLoading">{{ $t("common.confirm") }}</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getOrderDetailApi, redeliveryOrderApi, updateConsigneeAddressApi } from '@/api/uexpress/orderManager'

// 重新派送
export default {
	name: "RedeliveryDialog",
	props: {
    arap: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      title: '',
      type: '',
      row: {},
			visible: false,
			submitLoading: false,
			formData: {
        consigneePersonalName: "",
        consigneeMobile: "",
        consigneeCompanyName: "",
        consigneeEmail: "",
        consigneeHouseNo: "",
        consigneeRoomNo: "",
        consigneeDetailAddress: "",
        consigneeDetailAddress2: "",
        consigneeArea: "",
        consigneeZipCode: ""
			},
			formDataRules: {
				consigneePersonalName: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "change" }],
				consigneeMobile: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				consigneeDetailAddress: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				consigneeDetailAddress2: [{ required: false, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				consigneeArea: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				consigneeZipCode: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
			}
		};
	},
	methods: {
		show(row, type) {
      // REDELIVERY 重派
      // UPDATE_ADDRESS 修改地址

      this.type = type
      this.title = type === "REDELIVERY" ? this.$t('uexpressOrder.redelivery') : this.$t('uexpressOrder.updateConsigneeAddressInfo')
      row.shardingKey = row.shardingKey || row.orderSk
      this.row = row
      getOrderDetailApi({orderId: row.orderId, shardingKey: row.shardingKey}).then(res => {
        if (res.ok) {
          let data = {
            consigneePersonalName: res.content.consignee.personalName,
            consigneeMobile: res.content.consignee.mobile,
            consigneeCompanyName: res.content.consignee.companyName,
            consigneeEmail: res.content.consignee.email,
            consigneeHouseNo: res.content.consignee.houseNo,
            consigneeRoomNo: res.content.consignee.roomNo,
            consigneeDetailAddress: res.content.consignee.detailAddress,
            consigneeDetailAddress2: res.content.consignee.detailAddress2,
            consigneeCountryCode: res.content.consigneeCountryCode,
            consigneeProvinceName: res.content.consignee.provinceName,
            consigneeCityName: res.content.consignee.cityName,
            countryCode: res.content.consigneeCountryCode,
            provinceName: res.content.consignee.provinceName,
            cityName: res.content.consignee.cityName,
            consigneeZipCode: res.content.consignee.zipCode
          }
          if (data.consigneeCountryCode && data.consigneeProvinceName && data.consigneeCityName) {
            data.consigneeArea = 'GETVALUE'
          } else {
            data.consigneeArea = ''
          }
          this.formData = data
          this.visible = true;
        }
      })
		},
		confirmFn() {
      this.$refs.formDataRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.formData,
            orderId: this.row.orderId,
            shardingKey: this.row.shardingKey
          }
          this.submitLoading = true
          let fn = null
          let msg = null
          if (this.type === 'REDELIVERY') {
            fn = redeliveryOrderApi
            msg = this.$t('uexpressOrder.redeliverySuccess')
          } else {
            fn = updateConsigneeAddressApi
            msg = this.$t('uexpressOrder.updateSuccess')
          }
          fn(data).then(res => {
            if (res.ok) {
              this.$message.success(msg)
              this.$emit('ok')
              this.visible = false
            }
            this.submitLoading = false
          })
        }
      })
		},
    countryStateChange(val) {

      this.formData.consigneeCountryCode = val.countryCode
      this.formData.consigneeProvinceName = val.provinceName
      this.formData.consigneeCityName = val.cityName
      this.formData.countryCode = val.countryCode
      this.formData.provinceName = val.provinceName
      this.formData.cityName = val.cityName
      if (this.formData.consigneeCountryCode && this.formData.consigneeProvinceName && this.formData.consigneeCityName) {
        this.formData.consigneeArea = 'GETVALUE'
      } else {
        this.formData.consigneeArea = ''
      }
    }
	}
};
</script>

<style lang="scss" scoped>

</style>
