<template>
  <el-row>
    <el-col :span="7">
      <base-select v-model="countryCode" type="country" filterable :disabled="disabled"/>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="7">
      <el-input v-model="provinceName" @change="handleChange"></el-input>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="8">
      <el-input v-model="cityName" @change="handleChange"></el-input>
    </el-col>
  </el-row>
</template>

<script>
import { getReginInfoApi } from '@/api/common'
export default {
	name: 'Provinces',
	props: {
		value: [String, Object],
		valueName: String,
		disabled: Boolean
	},
	data() {
		return {
      countryCode: '',
			province: '',
      provinceName: '',
			provinceList: [],
			city: '',
      cityName: '',
			cityList: [],
			district: '',
			districtList: []
		}
	},
	watch: {
		value: {
			handler() {
				this.init()
			},
      deep: true,
			immediate: true
		}
	},
	created() {

	},
	methods: {
		init() {
      const { countryCode, provinceName, cityName } = this.value || {}
      this.countryCode = countryCode
      this.provinceName = provinceName
      this.cityName = cityName
		},
		handleChange() {
			this.$emit('change', {
        countryCode: this.countryCode,
        provinceName: this.provinceName,
        cityName: this.cityName
			})
		}
	}
}
</script>
<style scoped>
.line {
	text-align: center;
}
</style>

