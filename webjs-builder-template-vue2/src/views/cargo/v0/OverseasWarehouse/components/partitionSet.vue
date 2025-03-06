<template>
	<div>
    <div class="flex-box">
      <el-form-item label="分区设置" />
      <el-form-item :label="''" label-width="0px">
        <el-checkbox
          v-model="data.singleAreaFlag"
          class="ml-10"
          @change="changeSeason($event, 'normalAreaList','singleAreaFlag')"
					:disabled="isDetail"
        >
          是否单一分区
        </el-checkbox>
      </el-form-item>
    </div>
    <div v-for='(item,index) in data.normalAreaList' :key='index'>
      <div class="flex-box">
        <el-form-item :label="'分区代码'+(index+1)" :prop="'normalAreaList.' +index +'.areaName'"
          :rules="[
						{
							required: true,
							message: '请输入分区代码',
							trigger: 'blur',
						},
            { validator:checkNumOrEnglish}
					]"
        >
          <el-input size="mini" placeholder="请输入分区代码" v-model="item.areaName" :disabled="isDetail"></el-input>
        </el-form-item>
        <el-form-item
          label=""
          label-width="0px"
          class="ml-10"
          v-if="
            data.normalAreaList.length - 1 == index && !isDetail && !data.singleAreaFlag
          "
        >
          <div
            class="el-icon-circle-plus-outline fs-18"
            @click="addItem('normalAreaList')"
          ></div>
        </el-form-item>
        <el-form-item
          label=""
          label-width="0px"
          class="ml-10"
          v-if="data.normalAreaList.length > 1 && !isDetail && !data.singleAreaFlag"
        >
          <div
            class="el-icon-remove-outline fs-18"
            @click="removeItem('normalAreaList',index)"
          ></div
        ></el-form-item>
      </div>

    </div>
	</div>
</template>

<script>
import { checkNumOrEnglish } from '@/utils/validate'
import getZHMixin from '../PeakSeasonTimeManage/components/getZHMixin'
export default {
	name: 'PartitionSet',
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
      checkNumOrEnglish
		}
	},
	created() {
		if (!this.isDetail) {
			this.init()
		}
	},
	watch: {

	},
	methods: {
		async init() {
      this.$set(this.data, 'normalAreaList', [{areaName: ''}])
      this.$set(this.data, 'singleAreaFlag', false)
		},
		/**
		 * 是否有分区
		 */
		changeSeason(val, key, changeKey) {
			if (val) {
				this.$confirm(this.getZH('confirm'), this.getZH('tips'), {
					confirmButtonText: this.getZH('confirmBtn'),
					cancelButtonText: this.getZH('cancel'),
					type: 'warning'
				}).then(() => {
					this.data[key] = []
				}).catch(() => {
					this.data[changeKey] = true
				})
			} else {
				this.data[key] = [{areaName:	''}]
			}
		},
		/**
		 * 添加数据
		 */
		addItem(key) {
			let data = {
				areaName: ''
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
