<template>
  <div>
    <div v-if="!disabled && type === 'ADD'">
      <div v-for="(item,index) in containerList" :key="index" class="flex-box">
        <el-form-item :label="$t('thirdKindOrder.container')" :prop="'containerList.' + index + '.typeCode'" size="mini" :rules="[{ required: required, message: $t('common.selectPlaceholder')+$t('thirdKindOrder.containerType'), trigger: 'change' },]">
          <ContainerSelect  class="w-140" @change="ContainerTypesChange($event,item)" :itemObj="item"></ContainerSelect>
        </el-form-item>
        <el-form-item label-width="10px" :prop="'containerList.' + index + '.ctnrNum'" size="mini"  :rules="[{ required: required, message:  $t('common.placeholder')+$t('thirdKindOrder.containerQuantity'), trigger: 'change' },]">
          <el-input v-trim v-model="item.ctnrNum" :placeholder="$t('common.placeholder')" class="w-100" oninput="if(value){value=value.replace(/[^\d]/g,'')} if(value<=0){value=''} if(value>299){value=299}" type="number"></el-input>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-checkbox v-model="item.ownerType" :true-label="1" :false-label="2">（SOC）</el-checkbox>
        </el-form-item>
        <el-form-item label-width="0px">
          <i v-show="containerList.length<5" class="icon el-icon-circle-plus fc-blue fs-18" @click="addContainerType"></i>
        </el-form-item>
        <el-form-item label-width="0px">
          <i v-show="containerList.length >1" class="icon el-icon-remove fc-red fs-18" @click="delContainerType(index)"></i>
        </el-form-item>
      </div>
    </div>
    <div v-else>
      <el-form-item :label="$t('thirdKindOrder.container')" size="mini">
        <span class="word-wrap">{{getContainerStr(containerList)}}</span>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import ContainerSelect from "@/views/cargo/v0/SeaExport/components/order/containerSelect";
export default {
	name: 'ContainerEdit',
	props: {
		containerList: {
			type: Array,
			default: () => []
		},
		required: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
        type: {
            type: String,
			default: ''
        }
	},
	components: { ContainerSelect },
	data() {
		return {

		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		// 箱型箱量
		addContainerType() {
			this.containerList.push({
				typeCode: null,
				englishName: null,
				chineseName: null,
				ctnrNum: null,
				weight: null,
				ownerType: 2
			})
		},
		/**
		 * 箱型变更
		 */
		ContainerTypesChange(val, item) {
			if (this.$isNotEmpty(val)) {
				item.chineseName = val.chineseName
				item.englishName = val.englishName
				item.typeCode = val.typeCode
			} else {
				item.chineseName = null
				item.englishName = null
				item.typeCode = null
			}

			// item.englishName =
		},
		delContainerType(index) {
			this.containerList.splice(index, 1)
		},
		/**
		 * 拼接箱量显示
		 */
		getContainerStr(containerList) {
			let str = ""
			if (this.$isEmpty(containerList)) {
				return '-'
			}
			containerList.forEach((item, index) => {
				str += `${item.englishName}*${item.ctnrNum}${item.ownerType === 1 ? '（SOC）' : ''}${index === containerList.length - 1 ? '' : '、'}`
			})
			return str
		}
	}
};
</script>

<style scoped lang="less">
.icon {
	vertical-align: middle;
}
.word-wrap {
	word-wrap: break-word;
}
</style>
