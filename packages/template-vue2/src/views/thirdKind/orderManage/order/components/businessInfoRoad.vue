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
        <el-form-item :label="getZH('blNo')" prop="mblNo" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('blNo') }]">
          <span v-if="isDisabled">{{ formData.mblNo || '-' }}</span>
          <el-input v-else v-model="formData.mblNo" :placeholder="inputZH('blNo')" v-trim size="mini" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('licensePlateNo')" prop="licensePlateNo" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('licensePlateNo') }]">
          <span v-if="isDisabled">{{ formData.licensePlateNo || '-' }}</span>
          <el-input v-else v-model="formData.licensePlateNo" :placeholder="inputZH('licensePlateNo')"  size="mini" />
        </el-form-item>
      </el-col>
      <div style="clear: both;"></div>

         <!-- 起运地 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('polCodePlace')" prop="polCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('polCodePlace') }]">
          <span v-if="isDisabled">{{ formData.polCode || '-' }}</span>
           <el-input size="mini" v-model="formData.polCode" @change="polChange()" v-else />
        </el-form-item>
      </el-col>
       <!-- 卸货地 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('podCodePlace')" prop="podCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('podCodePlace') }]">
          <span v-if="isDisabled">{{ formData.podCode || '-' }}</span>
           <el-input size="mini" v-model="formData.podCode" @change="podChange()" v-else />
        </el-form-item>
      </el-col>
      <!-- 交货地 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('placeOfDelivery')" prop="placeOfDelivery" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.placeOfDelivery) ? '-' :  formData.placeOfDelivery }}</span>
          <el-input size="mini" v-model="formData.placeOfDelivery" :placeholder="inputZH('placeOfDelivery')"  v-else />
        </el-form-item>
      </el-col>

      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('cargoDesc')" prop="cargoDesc" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.cargoDesc) ? '-' :  formData.cargoDesc }}</span>
          <el-input size="mini" v-model="formData.cargoDesc" :placeholder="inputZH('cargoDesc')"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('etd')" prop="businessDate" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('etd') }]">
          <span v-if="isDisabled">{{ formData.businessDate | formatDate('YYYY-MM-DD') }}</span>
          <CommonPicker v-model="formData.businessDate" pikcer-type="date" size="mini" disabled :clearable="false"  v-else />
        </el-form-item>
      </el-col>

        <!-- ETA -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('eta')" prop="eta" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('eta') }]">
          <span v-if="isDisabled" class="word-wrap">{{ formData.eta | formatDate('YYYY-MM-DD') }}</span>
           <CommonPicker v-model="formData.eta" pikcer-type="date" size="mini" :clearable="false"  v-else />
        </el-form-item>
      </el-col>
      <!-- ATD -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('atd')" prop="atd" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ formData.atd | formatDate('YYYY-MM-DD') }}</span>
           <CommonPicker v-model="formData.atd" pikcer-type="date" size="mini" clearable  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
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
        podChange() {
			this.formData.pod = this.formData.podCode
		},
        polChange() {
            this.formData.pol = this.formData.polCode
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
