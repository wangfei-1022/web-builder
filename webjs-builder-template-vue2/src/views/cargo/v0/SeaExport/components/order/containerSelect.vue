<template>
    <el-select v-model="englishName" :filter-method="remoteMethod" filterable size="mini" remote @change="containerTypesChange" :disabled="disabled">
      <el-option v-for="(opt,index) in cntrOpts2" :key="opt.englishName" :label="opt.englishName" :value="opt.englishName" />
    </el-select>
</template>
<script>
import URL from '@/api/urlTranslator'
import lodash from 'lodash'
import { getContainerTypeList } from "@/api/seaExport"

export default {
	name: 'ContainerSelect',
	props: {
		// uploadRadioType: { type: String, default: null }
		itemObj: { type: Object, default: null },
		disabled: { type: Boolean, default: false }
	},
	data() {
		return {
			englishName: null,
			englishNameCoyp: null,
			selectObj: {},
			cntrOpts: [],
			cntrOpts2Copy: [
			],
			cntrOpts2: [
				//   {
				//   englishName: '20GP'
				// }, {
				//   englishName: '40HC'
				// }
			]
		}
	},
	computed: {
		url() {
			return URL
		}
	},
	watch: {
		itemObj() {
			if (this.$isEmpty(this.selectObj)) {
				this.selectObj = this.itemObj
			}
			const itemObj = lodash.cloneDeep(this.itemObj)
			this.englishName = itemObj.englishName || itemObj.containerType
		}
	},
	created() {
		this.getContainer()
		const itemObj = lodash.cloneDeep(this.itemObj)
		this.englishName = itemObj.englishName || itemObj.containerType
	},
	methods: {
		containerTypesChange(val) {
			this.cntrOpts.some(opt => {
				if (val === opt.englishName) {
					this.selectObj = {
						typeCode: opt.isoCode,
						chineseName: opt.chineseName,
						englishName: opt.englishName,
						teu: opt.teu,
					}
				}
			})
			this.$emit('change', this.selectObj)
		},
		// 获取集装箱型
		async getContainer() {
			const res = await getContainerTypeList()
			if (res.ok) {
				this.cntrOpts = res.content
				res.content.map(item => {
					if (item.englishName === "20GP" || item.englishName === "40HC") {
						this.cntrOpts2.push(item)
					}
				})
				// this.cntrOpts2=res.content
				this.cntrOpts2Copy = lodash.cloneDeep(this.cntrOpts2)
			}
		},
		remoteMethod(query) {
			if (query !== '') {
				this.cntrOpts2 = this.cntrOpts.filter(item => {
					return item.englishName.toLowerCase()
						.indexOf(query.toLowerCase()) > -1;
				});
			} else {
				this.cntrOpts2 = this.cntrOpts
			}
		},

	}
}
</script>
<style lang="scss" scoped>
</style>
