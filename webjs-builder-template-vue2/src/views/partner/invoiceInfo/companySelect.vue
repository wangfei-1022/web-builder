<template>
  <div>
    <el-select
      v-if="isCN"
      v-model="modelValue"
      :disabled="disabled"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
      style="width: 100%"
      @change="handleChange">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-autocomplete
      v-else
      v-model="modelValue"
      :loading="loading"
      :disabled="disabled"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
      style="width: 100%"
      @change="handleUnCnChange"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
import { getCompanyListByTianYanChaApi, getCompanyDetailByTianYanChaApi, getCompanyListByOwnApi, getCompanyDetailByOwnApi } from '@/api/partner/member'

export default {
	name: 'CompanySelect',
	props: {
		disabled: Boolean,
		value: String,
		isCN: Boolean
	},
	watch: {
		value(val) {
			this.modelValue = val
		}
	},
	created() {
		this.modelValue = this.value
	},
	data() {
		return {
			options: [],
			loading: false,
			modelValue: ''
		}
	},
	methods: {
		remoteMethod(query) {
			let data = {
				keyword: query
			}
			this.loading = true
			getCompanyListByTianYanChaApi(data).then(res => {
				this.loading = false
				if (res.ok) {
					let arr = []
					res.content.forEach(function (v) {
						arr.push({
							value: v.chineseName,
							label: v.chineseName
						})
					})
					this.options = arr
				}
			})
		},
		querySearchAsync(queryString, cb) {
			let data = {
				keyword: queryString
			}
			this.loading = true
			getCompanyListByOwnApi(data).then(res => {
				this.loading = false
				if (res.ok) {
					let results = []
					res.content.forEach(function (v) {
						results.push({
							value: v.chineseName,
							id: v.chineseName
						})
					})
					cb(results)
				}
			})
		},
		handleUnCnChange() {
			// 当不是中国的时候的change
			this.$emit('change', { value: this.modelValue })
		},
		handleChange() {
			this.$emit('change', {
				id: this.modelValue
			})
		},
		handleSelect(item) {
			this.$emit('change', {
				id: item.id
			})
		}
	}
}
</script>

<style scoped>
</style>
