<template>
	<div>
		<el-row :gutter="20">
			<el-col
				:span="12"
				class="flex-line"
				v-if="inWarehouseType == 1 || inWarehouseType == 2"
			>
				<el-form-item
					:label="getZH('cartonNo')"
					prop="firstLeg.containerNo"
					:rules="[
						{ required: true, message: inputZH('cartonNo') },
					]"
				>
					<el-input
						size="mini"
						v-model="data.containerNo"
						:placeholder="inputZH('cartonNo')"
						:disabled="isDisabled"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="inWarehouseType == 1 || inWarehouseType == 2">
				<el-form-item
					:label="getZH('containerType')"
					prop="firstLeg.containerType"
					:rules="[
						{ required: true, message: selectZH('containerType') },
					]"
				>
					<el-select
						v-model="data.containerType"
						size="mini"
						:placeholder="selectZH('containerType')"
						:disabled="isDisabled"
						class="w-full"
					>
						<el-option
							:label="item.englishName"
							:value="item.englishName"
							:key="item.id"
							v-for="item in supportSizeTypes"
						/>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="inWarehouseType == 1 || inWarehouseType == 2">
				<el-form-item :label="getZH('vessel')">
					<el-input
						size="mini"
						v-model="data.vessel"
						:placeholder="inputZH('vessel')"
						:disabled="isDisabled"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="inWarehouseType == 1 || inWarehouseType == 2">
				<el-form-item :label="getZH('voyage')">
					<el-input
						size="mini"
						v-model="data.voyage"
						:placeholder="inputZH('voyage')"
						:disabled="isDisabled"
					></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12" v-if="inWarehouseType == 1 || inWarehouseType == 2">
				<el-form-item label="ETD">
					<CommonPicker
						:pikcerType="'date'"
						:pickerFormat="'yyyy-MM-dd'"
						:parentDate="data.etd"
						v-model="data.etd"
						class="w-full"
						size="mini"
						:disabled="isDisabled"
					/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item
					label="ETA"
					:rules="[{ required: true, message: getZH('selectETA') }]"
					prop="firstLeg.eta"
				>
					<CommonPicker
						:pikcerType="'date'"
						:pickerFormat="'yyyy-MM-dd'"
						:parentDate="data.eta"
						v-model="data.eta"
						class="w-full"
						size="mini"
						:disabled="isDisabled"
					/>
				</el-form-item>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { getContainerTypeList } from '@/api/seaExport'
import getZHMixin from './getZHMixin'
export default {
	name: 'FirstLegInfo',
	mixins: [getZHMixin],
	props: {
		data: Object,
		isDisabled: {
			type: Boolean,
			default: false
		},
		inWarehouseType: Number
	},
	data() {
		return {
			supportSizeTypes: []
		}
	},
	created() {
		getContainerTypeList().then(res => {
			this.supportSizeTypes = res.content
		})
	},
	mounted() {

	},
	methods: {

	}
}
</script>

<style scoped lang="less">
</style>
