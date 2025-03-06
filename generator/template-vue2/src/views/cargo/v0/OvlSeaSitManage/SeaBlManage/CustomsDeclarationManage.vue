<template>
	<div v-loading="loading" class="pd-16">
		<div class="mb-10">
			<top-search-items-slot :searchFun="list" :resetFun="reset">
				<template slot="multipleSearch">
					<el-form	ref="formData" :inline="true" :model="formData" class="search-form" label-width="100px">
						<el-form-item	class="el-form-item"	:label="getZH('customerName')" prop="customerId">
              <TypeSelect v-model="formData.customerId"  type="customer"  @selected="list" />
						</el-form-item>
						<el-form-item	class="el-form-item" :label="getZH('blNo')"	prop="blNo">
							<el-input	v-model="formData.blNo" size="mini" :placeholder="inputZH('blNo')" clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item	class="el-form-item" :label="getZH('date')">
              <div class="flex-box">
                <el-select size="mini" v-model="formData.type" class="w-100">
                  <el-option v-for="item in dataTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <CommonPicker class="ml-10" v-model="dataTime" pickerFormat="yyyy-MM-dd"  pikcerType="daterange" :clearable="true" />
              </div>
						</el-form-item>
						<el-form-item	class="el-form-item" :label="getZH('state')"  prop="stateList">
              <ConstantSelect url="/api/sit-service/sea/import/customs/state/selections" :multiple="true" :isHasAll="false"  v-model="formData.stateList"  @change="list" ></ConstantSelect>
						</el-form-item>
					</el-form>
				</template>
			</top-search-items-slot>
		</div>
    <div class="mb-10 top-btn-wrap">
			<el-button size="mini" type="primary" @click="edit('add')">
        {{$t('common.addBtn')}}
			</el-button>
		</div>
   <el-tabs type="border-card">
      <el-tab-pane label="全部">
        <div class="tabs-content">
          <CustomsDeclarationTable :dataList="dataList" @update="list" />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'待确认（'+cnt+'）'">
         <div class="tabs-content">
           <CustomsDeclarationTable :dataList="dataList.filter(item=>item.state==1)" @update="list" />
        </div>
      </el-tab-pane>
    </el-tabs>
		<Pagination
			:total="total"
			:limit.sync="formData.pageSize"
			:page.sync="formData.pageNum"
			@pagination="list"
		/>
	</div>
</template>

<script>
import containerHandleOpBtn from './components/containerHandleOpBtn'
import { getSeaCustomsLitsApi, getStateCountCustomsApi } from '@/api/OvlSeaSitManage/seaBl'
import CustomsDeclarationTable from './components/CustomsDeclarationTable'
export default {
	name: 'CustomsDeclarationManage',
	components: { containerHandleOpBtn, CustomsDeclarationTable },
	data() {
		return {
			formData: {
				type: 1,
				customerId: null,
				blNo: '',
				blState: null,
				declareDateStart: null,
				declareDateEnd: null,
				ataStart: null,
				ataEnd: null,
				doFinishDateStart: null,
				doFinishDateEnd: null,
				stateList: [],
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataTime: [],
			goodsTypes: [],
			dataTypes: [{ value: 1, label: '预报日期' }, { value: 2, label: '到港日期' }, { value: 3, label: '换单完成日期' }],
			loading: false,
			dataList: [],
			cnt: null
		}
	},
	created() {
		this.list()

	},
	mounted() {

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'CustomsDeclarationDetail') {
				vm.list()
			}
		})
	},

	methods: {
		// 初始化数据
		async init() {
			this.cnt = 0
			let res = await getStateCountCustomsApi()
			if (res.ok) {
				if (this.$isNotEmpty(res.content)) {
					let data = res.content.find(item => item.state === 1)
					if (this.$isNotEmpty(data)) {
						this.cnt = data.count
					}
				}
			}
		},
		/**
			 * 下拉框
			 */
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'seaBl'
			let str = obj + '.' + key
			return this.$t(str)
		},

		/**
			 * 获取列表
			 */
		async list() {
			this.init()
			this.loading = true
			this.formData.declareDateStart = null
			this.formData.declareDateEnd = null
			this.formData.ataStart = null
			this.formData.ataEnd = null
			if (this.formData.type === 1) {
				this.formData.declareDateStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.declareDateEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.type === 2) {
				this.formData.ataStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.ataEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			} else if (this.formData.type === 3) {
				this.formData.doFinishDateStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
				this.formData.doFinishDateEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
			}
			const res = await getSeaCustomsLitsApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res && res.ok) {
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},

		/**
		 * 新增编辑
		 */
		edit(operate, id) {
			this.$router.push({ name: `CustomsDeclarationDetail`, params: { operate, id } })
		},
		/**
		 * 重置搜索条件
		 */
		reset() {
			this.$refs.formData.resetFields()
			this.dataTime = []
			this.list()
		}
	}
}
</script>

<style scoped lang="scss">
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
.tabs-content {
	height: calc(100vh - 400px);
	overflow: auto;
	padding: 5px;
}
</style>
