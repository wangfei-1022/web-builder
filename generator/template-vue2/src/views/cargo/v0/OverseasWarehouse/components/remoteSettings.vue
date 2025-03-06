<template>
	<div>
    <div class="flex-box">
      <el-form-item :label="$t('logisticsProduct.remoteSettings')" />
      <el-form-item :label="''" label-width="0px">
        <el-checkbox :disabled="isDetail" v-model="data.haveRemoteAreaFlag"  class="ml-10"  @change="changeSeason($event, 'remoteAreaList','haveRemoteAreaFlag')" >
          {{$t('logisticsProduct.haveRemoteAreaFlag')}}
        </el-checkbox>
      </el-form-item>
      <el-form-item class="ml-20" label-width="50px" prop="remoteAreaType" :label="$t('logisticsProduct.typeArea')" v-if="data.haveRemoteAreaFlag">
        <el-select size="mini"	:disabled="isDetail" v-model="data.remoteAreaType" @change="changeAreaType($event,'remoteAreaList')" :placeholder="$t('logisticsProduct.please_select_type_area')">
          <el-option :label="$t('logisticsProduct.typeArea1')" :value="1" />
          <el-option :label="$t('logisticsProduct.typeArea2')" :value="2" />
        </el-select>
      </el-form-item>
    </div>
    <div v-if="data.remoteAreaType">
      <div v-for='(item,index) in data.remoteAreaList' :key='index' >
        <div class="flex-box">
          <el-form-item label="" label-width="0px" :prop="'remoteAreaList.' +index +'.areaCode'" :rules="[ {required: true,message: $t('logisticsProduct.please_remoteAreaType'),trigger: 'blur', }]" >
            <el-select size="mini" v-model="item.areaCode"  :placeholder="$t('logisticsProduct.please_remoteAreaType')" :disabled="isDetail" @change="constantChange($event,item)" >
              <el-option v-for="item in filterConstants(item.areaCode)" :key="item.code"  :value="item.code" :label="item.name" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="20px" :prop="'remoteAreaList.' +index +'.areaName'" :rules="[ { required: true, message: $t('logisticsProduct.please_remoteAreaName'), trigger: 'blur', }, { validator:checkNumOrEnglish}, { validator:validatAreaCode,}]">
            <el-input size="mini" :placeholder="data.remoteAreaType === 1 ? $t('logisticsProduct.please_remoteAreaName') : $t('logisticsProduct.please_select_type_area_code')" v-model.trim="item.areaName" :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="0px"  class="ml-10"  v-if=" data.remoteAreaList.length - 1 === index && !isDetail && data.remoteAreaList.length < 5 " >
            <div  class="el-icon-circle-plus-outline fs-18"  @click="addItem('remoteAreaList')" ></div>
          </el-form-item>
          <el-form-item label="" label-width="0px" class="ml-10" v-if="data.remoteAreaList.length > 1 && !isDetail" >
            <div class="el-icon-remove-outline fs-18" @click="removeItem('remoteAreaList',index)" ></div >
          </el-form-item>
        </div>
      </div>
    </div>
	</div>
</template>
<script>
import { checkNumOrEnglish } from '@/utils/validate'
import { getRemoteAreaTypeApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import getZHMixin from '../PeakSeasonTimeManage/components/getZHMixin'
export default {
	name: 'RemoteSettings',
	mixins: [getZHMixin],
	props: {
		data: Object,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			channelPriceList: [],
			constantList: [],
			checkNumOrEnglish,
			constantMap: {
				1: 'RA',
				2: 'URA',
				3: 'RAE',
				4: 'URAE',
				5: 'RE48'
			}
		}
	},
	computed: {

	},
	async created() {
		let res = await getRemoteAreaTypeApi()
		if (res.ok) {
			this.constantList = res.content || []
		}
		if (!this.isDetail) {
			this.init()
		}
	},
	watch: {

	},
	methods: {
		async init() {
			this.$set(this.data, 'remoteAreaList', [])
			this.$set(this.data, 'haveRemoteAreaFlag', false)
		},
		// 过滤可选项
		filterConstants(code) {
			let arr = []
			if (this.data.remoteAreaType === 1) {
				arr = this.constantList.filter(item => item.type === 1 && this.$isEmpty(this.data.remoteAreaList.find(data => data.areaCode === item.code && data.areaCode !== code)))
			} else {
				arr = this.constantList.filter(item => item.type === 2)
			}
			return arr
		},
		validatAreaCode(rule, value, callback) {
			if (this.data.remoteAreaType === 1 || !value) {
				callback()
			}
			let currentValList = this.data.remoteAreaList.filter(item => item.areaName === value)
			if (currentValList.length > 1) {
				callback(this.$t('logisticsProduct.type_area_code_repeat'))
			} else {
				callback()
			}
		},
		// 通过偏远地区类型获取默认值
		constantChange(val, item) {
			item.areaName = this.constantMap[val]
		},
		changeAreaType(val, key) {
			let areaCode = val === 1 ? '' : 6
			if (this.$isNotEmpty(this.data[key])) {
				this.$confirm(this.getZH('confirm1'), this.getZH('tips'), {
					confirmButtonText: this.getZH('confirmBtn'),
					cancelButtonText: this.getZH('cancel'),
					type: 'warning'
				}).then(() => {
					this.$set(this.data, key, [{ areaName: '', areaCode: areaCode }])
				}).catch(() => {
					if (val === 1) {
						this.data.remoteAreaType = 2
					} else {
						this.data.remoteAreaType = 1
					}
				})
			} else {
				this.$set(this.data, key, [{ areaName: '', areaCode: areaCode }])
			}
		},
		/**
		 * 是否有分区
		 */
		changeSeason(val, key, changeKey) {
			if (!val) {
				this.$confirm(this.getZH('confirm'), this.getZH('tips'), {
					confirmButtonText: this.getZH('confirmBtn'),
					cancelButtonText: this.getZH('cancel'),
					type: 'warning'
				}).then(() => {
					this.data[key] = []
					this.data.remoteAreaType = null
				}).catch(() => {
					this.data[changeKey] = true
				})
			}
		},
		/**
		 * 添加数据
		 */
		addItem(key) {
			let areaCode = this.data.remoteAreaType === 1 ? '' : 6
			let data = {
				areaName: '',
				areaCode: areaCode
			}
			this.data[key].push(data)
		},
		/**
		 * 删除单条数据
		 */
		removeItem(key, index) {
			this.data[key].splice(index, 1)
		}
	}
}
</script>

<style scoped lang="less">
</style>
