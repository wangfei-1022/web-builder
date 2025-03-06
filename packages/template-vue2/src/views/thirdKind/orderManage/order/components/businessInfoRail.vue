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
        <el-form-item :label="getZH('trainNo')" prop="trainNo" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('trainNo') }]">
          <span v-if="isDisabled">{{ formData.trainNo || '-' }}</span>
          <el-input v-else v-model="formData.trainNo" :placeholder="inputZH('trainNo')" size="mini" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('columnCount')" prop="columnCount" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled">{{ formData.columnCount || '-' }}</span>
          <el-input v-else v-model="formData.columnCount" :placeholder="inputZH('columnCount')" size="mini" />
        </el-form-item>
      </el-col>
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('supplier')" prop="supplier" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="text-ellipsis">{{ formData.supplierName || '-'  }}</span>
          <type-select type="supplier" :defaultDisplay="formData.supplierName" v-model="formData.supplierId" @selected="typeSelectChange($event,'supplierName')" clearable v-else />
        </el-form-item>
      </el-col>

         <!-- 始发站 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('polCodeStation')" prop="polCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('polCodeStation') }]">
          <span v-if="isDisabled">{{ formData.pol || '-' }}</span>
          <type-select type="railstation" :defaultDisplay="formData.pol" v-model="formData.polCode" @selected="typeSelectChange($event,'pol')" v-else :clearable="false" />
        </el-form-item>
      </el-col>
        <!-- 口岸站 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('portStation')" prop="portStationCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('podCodeStation') }]">
          <span v-if="isDisabled" class="word-wrap">{{ $isEmpty(formData.portStationCode) ? '-' :  formData.portStationCode }}</span>
            <el-input size="mini" v-model="formData.portStationCode" @change="portStationChange()" v-else />
        </el-form-item>
      </el-col>
       <!-- 目的站 -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('podCodeStation')" prop="podCode" :class="isDisabled ? 'mb-0':''" :rules="[{ required: !isDisabled, message: this.selectZH('podCodeStation') }]">
          <span v-if="isDisabled">{{ formData.pod || '-' }}</span>
          <type-select type="railstation" :defaultDisplay="formData.pod" v-model="formData.podCode" @selected="typeSelectChange($event,'pod')" v-else :clearable="false"  />
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
          <CommonPicker v-model="formData.eta" pikcer-type="date" size="mini"  v-else />
        </el-form-item>
      </el-col>
      <!-- ATD -->
      <el-col :span=" small ? 8 : 6 ">
        <el-form-item :label="getZH('atd')" prop="atd" :class="isDisabled ? 'mb-0':''">
          <span v-if="isDisabled" class="word-wrap">{{ formData.atd | formatDate('YYYY-MM-DD') }}</span>
          <CommonPicker v-model="formData.atd" pikcer-type="date" size="mini"  v-else />
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
        portStationChange() {
            this.formData.portStation = this.formData.portStationCode
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
