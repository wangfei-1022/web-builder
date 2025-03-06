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
        <el-form-item :label="getZH('vessel')" prop="vessel" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('vessel') }]">
          <span v-if="isDisabled">{{ formData.vessel || '-' }}</span>
          <div v-else>
            <el-input  v-model="formData.vessel" :disabled="formData.tbaFlag" :placeholder="inputZH('vessel')" size="mini" />
            <el-checkbox v-model="formData.tbaFlag" @change="TBAChange" style="position: absolute; right: -65px; top: 0">TBA</el-checkbox>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('voyage')" prop="voyage" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('voyage') }]">
          <span v-if="isDisabled">{{ formData.voyage || '-' }}</span>
          <el-input v-else v-model="formData.voyage" :disabled="formData.tbaFlag" :placeholder="inputZH('voyage')" size="mini" />
        </el-form-item>
      </el-col>
      <div style="clear: both;"></div>

      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('polCode')" prop="polCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('polCode') }]">
          <span v-if="isDisabled">{{ formData.polCode || '-' }}</span>
          <type-select type="seaport" :defaultDisplay="formData.polCode" v-model="formData.polCode" @selected="typeSelectChange($event,'pol')" v-else :clearable="false" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('podCodePort')" prop="podCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('podCodePort') }]">
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
          <CommonPicker v-model="formData.atd" pikcer-type="date" size="mini" :clearable="false"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('remark')" prop="remark" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.remarks) ? '-' :  formData.remarks }}</span>
          <el-input size="mini" v-model="formData.remarks" :placeholder="inputZH('remark')"  v-else />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 16 : 12 ">
        <ContainerEdit :disabled="isDisabled" :containerList="formData.containerList" :type="type"></ContainerEdit>
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
		},
        TBAChange(val) {
			if (val) {
				this.$set(this.formData, 'vessel', 'TBA')
				this.$set(this.formData, 'voyage', '---')
			} else {
				this.$set(this.formData, 'vessel', '')
				this.$set(this.formData, 'voyage', '')
			}
		},
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
