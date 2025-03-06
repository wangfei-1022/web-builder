<template>
  <el-row>
    <el-col :span="7">
      <el-select v-model="province" filterable :disabled="disabled" @change="handleProvinceChange" style="width: 100%">
        <el-option v-for="item in provinceList" :key="item.code" :value="item.code" :label="item.name"></el-option>
      </el-select>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="7">
      <el-select v-model="city" filterable :disabled="disabled" @change="handleCityChange" style="width: 100%">
        <el-option v-for="item in cityList" :key="item.code" :value="item.code" :label="item.name"></el-option>
      </el-select>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="8">
      <el-select v-model="district" filterable :disabled="disabled" @change="handleDistrictChange" style="width: 100%">
        <el-option v-for="item in districtList" :key="item.code" :value="item.code" :label="item.name"></el-option>
      </el-select>
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
			province: '',
			provinceList: [],
			city: '',
			cityList: [],
			district: '',
			districtList: []
		}
	},
	watch: {
		value: {
			handler() {
				this.setAddressNormalizedInfo()
			},
      deep: true,
			immediate: true
		}
	},
	created() {
		this.getProvinceList()
	},
	methods: {
		setAddressNormalizedInfo() {
      if (typeof this.value === 'object') {
        const { provinceCode, cityCode, districtCode } = this.value
        this.province = provinceCode
				this.city = cityCode
				this.district = districtCode
				if (provinceCode && this.cityList.length === 0) {
					this.getCityList(provinceCode)
				}
				if (cityCode && this.districtList.length === 0) {
					this.getDistrictList(cityCode)
				}
      } else if (this.value) {
				const [provinceCode, cityCode, districtCode] = this.value.split('@@@')
				this.province = provinceCode
				this.city = cityCode
				this.district = districtCode
				if (provinceCode && this.cityList.length === 0) {
					this.getCityList(provinceCode)
				}
				if (cityCode && this.districtList.length === 0) {
					this.getDistrictList(cityCode)
				}
			} else if (this.valueName) {
				const [provinceName, cityName, districtName] = this.valueName.split('@@@')
				this.province = provinceName
				this.city = cityName
				this.district = districtName
			}
		},
		getProvinceList() {
			const params = {
				areaLevel: 1
			}
			getReginInfoApi(params).then(res => {
				if (res.ok && !!res.content.list) {
					this.provinceList = res.content.list.map(item => ({
						code: item.code,
						name: item.chineseName
					}))
				}
			})
		},
		getCityList(province) {
			this.cityList = []
			const params = {
				areaLevel: 2,
				parentCode: province
			}
			getReginInfoApi(params).then(res => {
				if (res.ok && !!res.content.list) {
					this.cityList = res.content.list.map(item => ({
						code: item.code,
						name: item.chineseName
					}))
				}
			})
		},
		getDistrictList(city) {
			this.districtList = []
			const params = {
				areaLevel: 3,
				parentCode: city
			}
			getReginInfoApi(params).then(res => {
				if (res.ok && !!res.content.list) {
					this.districtList = res.content.list.map(item => ({
						code: item.code,
						name: item.chineseName
					}))
				}
			})
		},
		handleProvinceChange(province) {
			let pIndex = this.provinceList.findIndex(item => item.code === this.district)
			let pName = pIndex >= 0 ? this.provinceList[pIndex].name : ''
			this.$emit('change', {
				code: [this.province].join('@@@'),
				name: [pName].join('@@@'),
        provinceCode: this.province,
        provinceName: pName,
        cityCode: '',
        cityName: '',
        districtCode: '',
        districtName: ''
			})

			this.city = ''
			this.district = ''
			this.districtList = []
			this.getCityList(province)
		},
		handleCityChange(city) {
			let pIndex = this.provinceList.findIndex(item => item.code === this.district)
			let pName = pIndex >= 0 ? this.provinceList[pIndex].name : ''

			let cIndex = this.cityList.findIndex(item => item.code === this.district)
			let cName = cIndex >= 0 ? this.cityList[cIndex].name : ''

			this.$emit('change', {
				code: [this.province, this.city].join('@@@'),
				name: [pName, cName].join('@@@'),
        provinceCode: this.province,
        provinceName: pName,
        cityCode: this.city,
        cityName: cName,
        districtCode: '',
        districtName: ''
			})

			this.district = ''
			this.getDistrictList(city)
		},
		handleDistrictChange() {
			let pIndex = this.provinceList.findIndex(item => item.code === this.province)
			let pName = pIndex >= 0 ? this.provinceList[pIndex].name : ''

			let cIndex = this.cityList.findIndex(item => item.code === this.city)
			let cName = cIndex >= 0 ? this.cityList[cIndex].name : ''

			let dIndex = this.districtList.findIndex(item => item.code === this.district)
			let dName = dIndex >= 0 ? this.districtList[dIndex].name : ''

			this.$emit('change', {
				code: [this.province, this.city, this.district].join('@@@'),
				name: [pName, cName, dName].join('@@@'),
        provinceCode: this.province,
        provinceName: pName,
        cityCode: this.city,
        cityName: cName,
        districtCode: this.district,
        districtName: dName
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
