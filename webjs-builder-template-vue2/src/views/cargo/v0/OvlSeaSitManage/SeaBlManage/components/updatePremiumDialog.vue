<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="$t('seaBl.updatePremium')" width="1000px" :close-on-click-modal="false">
      <div class="dialog-content">
        <el-table :data="dataList" size="mini"  border stripe v-loading="loading" :header-cell-style="{background:'#f5f7f7',color:'#707171'}">
          <el-table-column :label="$t('seaBl.indexNo')" width="60">
            <template slot-scope="{$index}">
              {{$index+1}}
            </template>
          </el-table-column>
          <el-table-column  :label="$t('seaBl.blNo')" prop="blNo" width="120" />
          <el-table-column :label="$t('seaBl.ctnNo')" prop="ctnNo" width="120" />
          <el-table-column :label="$t('seaBl.goodsValue')" prop="totalImportValue" width="120" />
          <el-table-column :label="$t('seaBl.oceanFreight')"  minWidth="140" >
            <template slot-scope="{row}">
              <el-input size="mini" v-model="row.freight" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('seaBl.currency')"  width="110" >
            <template slot-scope="{row}">
              <CurrencySelect v-model="row.freightCurrency" />
            </template>
          </el-table-column>
           <el-table-column :label="$t('seaBl.premium')"  minWidth="140" >
            <template slot-scope="{row}">
              <el-input size="mini" v-model="row.premium" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('seaBl.currency')"  width="110" >
            <template slot-scope="{row}">
              <CurrencySelect v-model="row.premiumCurrency" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="submitData('formData')">{{$t("common.saveBtn")}}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn")}}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { saveSeaCtnInfoApi, getSeaCtnListApi } from '@/api/OvlSeaSitManage/seaBl'
import CurrencySelect from '@/components/CurrencySelect'
export default {
	name: 'UpdatePremiumDialog',
	components: { CurrencySelect },
	props: {
		ids: Array,
		visible: {
			type: Boolean,
			default: false
		}

	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			dataList: []
		}
	},

	methods: {
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
		async init() {
			let res = await getSeaCtnListApi({ ids: this.ids })
			if (res.ok) {
				this.dataList = res.content || []
			}

		},
		// 保存数据
		submitData(refName) {
			saveSeaCtnInfoApi({ list: this.dataList }).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('common.saveSuccess'))
					this.loading = false
					this.$emit('saved')
					this.dialogVisible = false
				} else {
					this.loading = false
				}
			})
		}

	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.init()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
