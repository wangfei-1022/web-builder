<template>
    <div>
      <div class="flex-right" v-if="!isDetail">
        <el-button type="primary" size="mini" class="mb-10" @click="addItem()"  :loading="loading" :disabled="isEdit">{{$t('common.addBtn')}}</el-button>
      </div>
      <el-table :data="dataList" size="mini" height="250" border stripe v-loading="loading">
        <el-table-column :label="$t('seaBl.indexNo')" width="60">
          <template slot-scope="{$index}">
            {{$index+1}}
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <span class="fc-red">*</span><span>SKU</span>
          </template>
          <template slot-scope="{row}">
            <type-select v-model="row.skuId" :defaultDisplay="row.skuCode" type="seaGoods" @selected="skuSelected($event,row)"  v-if="row.isEdit" />
            <span v-else>{{row.skuCode}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('seaBl.skuName')" prop="skuName" min-width="120" />
        <el-table-column :label="$t('seaBl.ctnNum')" width="140">
          <template slot-scope="{row}">
            <!-- <el-input size="mini" v-model="row.ctnNum" :placeholder="$t('seaBl.ctnNum')" v-if="row.isEdit" oninput="value=value.replace(/[^\d]/g,'')"> </el-input> -->
            <span >{{row.ctnNum}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('seaBl.skuNum')" min-width="140">
          <template slot-scope="{row}">
            <!-- <el-input size="mini" v-model="row.skuNum" :placeholder="$t('seaBl.skuNum')" v-if="row.isEdit" oninput="value=value.replace(/[^\d]/g,'')"></el-input> -->
            <span>{{row.skuNum}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <span class="fc-red">*</span><span>{{$t('seaBl.nw')}}（KG）</span>
          </template>
          <template slot-scope="{row}">
            <el-input size="mini" v-model="row.nw" :placeholder="$t('seaBl.nw')" v-if="row.isEdit" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"></el-input>
            <span v-else>{{row.nw}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <span class="fc-red">*</span><span>{{$t('seaBl.gw')}}（KG）</span>
          </template>
          <template slot-scope="{row}">
            <el-input size="mini" v-model="row.gw" :placeholder="$t('seaBl.gw')" v-if="row.isEdit" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"></el-input>
            <span v-else>{{row.gw}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140">
          <template slot="header">
            <span class="fc-red">*</span><span>{{$t('seaBl.importValue')}}</span>
          </template>
          <template slot-scope="{row}">
            <el-input size="mini" v-model="row.importValue" :placeholder="$t('seaBl.importValue')" v-if="row.isEdit" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"></el-input>
            <span v-else>{{row.importValue}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot="header">
            <span class="fc-red">*</span><span>{{$t('seaBl.currency')}}</span>
          </template>
          <template slot-scope="{row}">
            <CurrencySelect v-model="row.currency" :type="2" v-if="row.isEdit" @selected="currencySelect($event,row)" />
            <span v-else>{{row.currencyName}}</span>
          </template>
        </el-table-column>
         <el-table-column :label="$t('common.operation')" fixed="right" width="140" v-if="!isDetail">
          <template slot-scope="{row,$index}">
            <div v-if="row.isEdit">
              <span class="fc-blue pointer" @click="saveItem(row)">{{$t('common.saveBtn')}}</span>
              <span class="fc-blue ml-10 pointer"  @click="calcelItem($index,row)">{{$t('common.cancelBtn')}}</span>
            </div>
            <div v-if="!row.isEdit && !isEdit">
              <span class="fc-blue pointer"  @click="editItem(row)">{{$t('common.editBtn')}}</span>
              <span class="fc-blue ml-10 pointer" v-if="$isNotEmpty(row.ctnNum) && $isNotEmpty(row.skuNum)" @click="avgItem(row)">{{$t('seaBl.avgBtn')}}</span>
              <span class="fc-red ml-10 pointer"  @click="delItem(row)">{{$t('common.deleteBtn')}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
import CurrencySelect from '@/components/CurrencySelect'
import { getGoodsByBlIdApi, saveGoodsByBlIdApi, avgGoodsByBlIdApi, delGoodsByIdApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'GoodsInfoTable',
	components: { CurrencySelect },
	props: {
		blId: String,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dataList: [],
			isEdit: false,
			loading: false

		};
	},
	created() {
		this.list()
	},
	mounted() {

	},
	methods: {
		// 获取商品列表
		async list() {
			if (this.$isEmpty(this.blId)) {
				return
			}
			this.loading = true
			let res = await getGoodsByBlIdApi({ blId: this.blId })
			if (res.ok) {
				res.content.list.forEach(item => {
					if (this.$isEmpty(item.currency)) {
						item.currency = 'EUR'
						item.currencyName = '欧元'
					}
				})
				this.dataList = res.content.list || []
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 选中SKU
		skuSelected(data, row) {
			row.skuName = data.skuName
			row.skuCnName = data.goodsCnName
			row.skuEnName = data.goodsEnName
			row.skuCode = data.skuCode
		},
		// 新增单条数据
		addItem() {
			this.loading = true
			let item = {
				blId: this.blId,
				ctnNum: null,
				currency: 'EUR',
				currencyName: '欧元',
				gw: null,
				id: null,
				importValue: null,
				nw: null,
				skuId: null,
				skuName: null,
				skuEnName: null,
				skuCnName: null,
				skuCode: null,
				skuNum: null,
				isEdit: true
			}
			this.isEdit = true
			this.dataList.push(item)
			this.loading = false
		},
		// 币种选择
		currencySelect(data, row) {
			row.currencyName = data
		},
		// 编辑
		editItem(row) {
			this.$set(row, 'isEdit', true)
			this.isEdit = true
		},
		// 取消编辑 新增删除 编辑回滚编辑前数据
		calcelItem(index, row) {
			this.list()
			this.isEdit = false
		},
		// 保存数据
		saveItem(row) {
			if (this.$isEmpty(row.skuId)) {
				this.$message.error(this.$t('seaBl.please_select_goods'))
				return
			}
			// if (this.$isEmpty(row.nw)) {
			// 	this.$message.error(this.$t('seaBl.please_input_nw'))
			// 	return
			// }
			// if (this.$isEmpty(row.gw)) {
			// 	this.$message.error(this.$t('seaBl.please_input_gw'))
			// 	return
			// }
			// if (this.$isEmpty(row.importValue)) {
			// 	this.$message.error(this.$t('seaBl.please_input_importValue'))
			// 	return
			// }
			this.loading = true
			saveGoodsByBlIdApi(row).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('common.saveSuccess'))
					this.isEdit = false
					this.list()
				} else {
					this.loading = false
				}
			})
		},
		delItem(row) {
			this.$confirm(this.$t('common.deleteTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				delGoodsByIdApi(row.id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			}).catch(() => {
				// do nothing
			})
		},
		// 均摊单个货品
		avgItem(row) {
			this.loading = true
			avgGoodsByBlIdApi(row.id).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('seaBl.avgSuccess'))
					this.loading = false
				} else {
					this.loading = false
				}
			})
		}
	}
};
</script>

<style scoped lang="less">
</style>
