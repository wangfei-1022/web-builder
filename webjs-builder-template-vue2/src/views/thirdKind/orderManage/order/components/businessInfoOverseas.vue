<template>
  <div>
    <el-row :gutter="20">
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('businessType')" prop="businessType" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled">{{ formData.businessTypeName || '-' }}</span>
          <el-input size="mini" v-model="formData.businessTypeName" :placeholder="inputZH('businessType')" v-else disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('mblNo')" prop="mblNo" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('mblNo') }]">
          <span v-if="isDisabled">{{ formData.mblNo || '-' }}</span>
          <el-input v-else v-model="formData.mblNo" :placeholder="inputZH('mblNo')" v-trim size="mini" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('hblNo')" prop="hblNo" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled">{{ formData.hblNo || '-' }}</span>
          <el-input v-else v-model="formData.hblNo" :placeholder="inputZH('hblNo')" size="mini" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('supplier')" prop="supplier" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="text-ellipsis">{{ formData.supplierName || '-'  }}</span>
          <type-select type="supplier" :defaultDisplay="formData.supplierName" v-model="formData.supplierId" @selected="typeSelectChange($event,'supplierName')" clearable v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('businessDate')" prop="businessDate" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('businessDate') }]">
          <span v-if="isDisabled">{{ formData.businessDate | formatDate('YYYY-MM-DD') }}</span>
          <CommonPicker v-model="formData.businessDate" pikcer-type="date" size="mini" disabled :clearable="false"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('polCode')" prop="polCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('polCode') }]">
          <span v-if="isDisabled">{{ formData.polCode || '-' }}</span>
          <type-select type="seaport" :defaultDisplay="formData.polCode" v-model="formData.polCode" @selected="typeSelectChange($event,'pol')" v-else :clearable="false" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('podCode')" prop="podCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('podCode') }]">
          <span v-if="isDisabled">{{ formData.podCode || '-' }}</span>
          <type-select type="seaport" :defaultDisplay="formData.podCode" v-model="formData.podCode" @selected="typeSelectChange($event,'pod')" v-else :clearable="false"  />
        </el-form-item>
      </el-col>
      <!-- 交货地 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('placeOfDelivery')" prop="placeOfDelivery" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.placeOfDelivery) ? '-' :  formData.placeOfDelivery }}</span>
          <el-input size="mini" v-model="formData.placeOfDelivery" :placeholder="inputZH('placeOfDelivery')"  v-else />
        </el-form-item>
      </el-col>



        <!-- ETA -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('eta')" prop="eta" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ formData.eta | formatDate('YYYY-MM-DD') }}</span>
           <CommonPicker v-model="formData.eta" pikcer-type="date" size="mini" v-else />
        </el-form-item>
      </el-col>

    
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('actualQuantity')" prop="actualQuantity" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled || (type === 'EDIT' && formData.containerList.length > 0)">{{ $isEmpty(formData.actualQuantity) ? '-' :  formData.actualQuantity }}</span>
          <el-input size="mini" v-model="formData.actualQuantity" :placeholder="inputZH('actualQuantity')" oninput="value=value.replace(/[^\d]/g,'')" v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('actualGrossWeight')" prop="actualGrossWeight" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled || (type === 'EDIT' && formData.containerList.length > 0)">{{ $isEmpty(formData.actualGrossWeight) ? '-' :  formData.actualGrossWeight }}</span>
          <el-input size="mini" v-model="formData.actualGrossWeight" :placeholder="inputZH('actualGrossWeight')"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('actualVolume')" prop="actualVolume" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled || (type === 'EDIT' && formData.containerList.length > 0)">{{ $isEmpty(formData.actualVolume) ? '-' :  formData.actualVolume }}</span>
          <el-input size="mini" v-model="formData.actualVolume" :placeholder="inputZH('actualVolume')"   v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('actualChargeableWeight')" prop="actualChargeableWeight" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled">{{ $isEmpty(formData.actualChargeableWeight) ? '-' :  formData.actualChargeableWeight }}</span>
          <el-input size="mini" v-model="formData.actualChargeableWeight" :placeholder="inputZH('actualChargeableWeight')"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 12 : 12 ">
        <el-form-item :label="getZH('cargoDesc')" prop="cargoDesc" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.cargoDesc) ? '-' :  formData.cargoDesc }}</span>
          <el-input size="mini" v-model="formData.cargoDesc" :placeholder="inputZH('cargoDesc')"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 12 : 12 ">
        <el-form-item :label="getZH('remark')" prop="remark" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.remarks) ? '-' :  formData.remarks }}</span>
          <el-input size="mini" v-model="formData.remarks" :placeholder="inputZH('remark')"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 16 : 12 ">
        <ContainerEdit :disabled="isDisabled" :required="false" :containerList="formData.containerList" :type="type"></ContainerEdit>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import getZHMixin from './getZHMixin'
import ContainerEdit from './containerEdit'
export default {
	name: 'BusinessInfo',
	components: { ContainerEdit },
	mixins: [getZHMixin],
	props: {
		formData: {
			type: Object,
			required: true
		},
		isDisabled: {
			type: Boolean,
			default: false
		},
		small: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: ""
		}
	},
	data() {
		return {

		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		/**
		 * 海运港口变更
		 */
		typeSelectChange(data, key) {
			this.formData[key] = data.chineseName
		}
	}
};
</script>

<style scoped lang="less">
.text-ellipsis {
	display: block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.word-wrap {
	word-wrap: break-word;
}
.el-form-item {
    margin-bottom: 12px;
}
</style>
