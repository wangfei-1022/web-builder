<template>
	<div class="mb-10">
		<div class="flex-right mb-10" @click="addItem" v-if="calcIsAdd">
			<el-button type="primary" size="mini">{{ $t("goodsManagement.add") }}</el-button>
		</div>
		<el-table :data="dataList">
			<el-table-column property="date">
				<template slot="header" slot-scope="{}">
					<span>
						{{ $t("goodsManagement.goodsSaleCountryList") }}
					</span>
				</template>
				<template slot-scope="{ row }">
					<span v-if="row.isEdit">
						<NationalGroupSelect
							v-model="row.countryCode"
							@selected="countrySelected($event, row)"
						/>
					</span>
					<span v-else>{{ row.countryCnName }}</span>
				</template>
			</el-table-column>
			<el-table-column property="quantity">
				<template slot="header" slot-scope="{}">
					<span>
						{{ $t("goodsManagement.declaredValue") }}
					</span>
				</template>
				<template slot-scope="{ row }">
					<span v-if="row.isEdit">
						<el-input
							:placeholder="$t('goodsManagement.inputDeclaredValue')"
							size="mini"
							v-model="row.declaredValue"
							oninput="value=value.replace(/[^\d|.]/g,'')"
							:min="1"
						/>
					</span>
					<span v-else>{{ row.declaredValue }}</span>
				</template>
			</el-table-column>
			<el-table-column property="width" width="130">
				<template slot="header" slot-scope="{}">
					<span>

						{{ $t("goodsManagement.currency") }}
					</span>
				</template>
				<template slot-scope="{ row }">
					<span v-if="row.isEdit">
						<el-select
							size="mini"
							v-model="row.currencyCode"
							@change="currencieChange($event, row)"
							:placeholder="getZH('pleaseCurrency')"
						>
							<el-option
								v-for="item in currencies"
								:key="item.code"
								:label="item.name"
								:value="item.code"
							></el-option>
						</el-select>
					</span>
					<span v-else>{{ row.currencyName }}</span>
				</template>
			</el-table-column>
			<el-table-column
				property="operation"
				:label="$t('common.operation')"
				width="100"
				v-if="!isDetail"
			>
				<template slot-scope="{ row, $index }">
          <div v-if='!row.disable'>
            <div class="operating" v-if="row.isEdit">
              <span @click="saveItem(row, $index)" class="fc-blue pointer">
                {{ $t("common.save") }}
              </span>
              <span
                @click="cancel(row, $index)"
                class="fc-red pointer ml-10"
                v-if="row.isEdit"
              >
                {{ $t("common.cancel") }}
              </span>
            </div>
            <div v-if="!row.isEdit">
              <span @click="editItem(row, $index)" class="fc-blue pointer">
                {{ $t("common.editBtn") }}
              </span>
              <span
                @click="delItem(row)"
                class="fc-red pointer ml-10"
                v-if="dataList.length > 1"
                >{{ $t("common.deleteBtn") }}</span
              >
            </div>
          </div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
import NationalGroupSelect from '../../components/NationalGroupSelect'
import { getCurrenciesApi } from "@/api/common"
export default {
	name: 'SaleCountryInfo',
	components: { NationalGroupSelect },
	props: {
		dataList: Array,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	watch: {
	},
	computed: {
		calcIsAdd() {
			let flag = true
			this.dataList.forEach(v => {
				if (v.isEdit) {
					flag = false
				}
			})
			return flag && !this.isDetail
		}
	},
	data() {
		return {
			isEdit: false,
			currencies: [],
			tempData: {}
		}
	},
	created() {
		this.getMyAccounts()
	},
	methods: {
		getMyAccounts() {
			getCurrenciesApi().then(res => {
				if (res.ok) {
					this.currencies = res.content || []
				}
			}).catch(err => {
				console.log(err)
			})
		},
		/**
		 * 选中币种
		 */
		currencieChange(data, row) {
			let itemData = this.currencies.find(item => item.code === data)
			row.currencyName = itemData.name
		},
		/**
		 * 选中国家
		 */

		countrySelected(itemData, row) {
			row.countryCnName = itemData.chineseName
			row.countryId = itemData.id
			row.countryCode = itemData.code2
			row.countryEnName = itemData.englishName
			// 判断是否维护重复数据
			let data = this.dataList.find(item => item !== row && item.countryCode === row.countryCode)
			if (this.$isNotEmpty(data)) {
				this.$alert(row.countryCnName + this.getZH('countryMaintained'), {
					confirmButtonText: this.$t("common.confirm")
				})
				row.countryCnName = ''
				row.countryEnName = ''
				row.countryId = ''
				row.countryCode = ''
				return
			} else {
				// 设置默认币种
				let currency = this.currencies.find(item => item.countries.includes(row.countryCnName))
				if (currency) {
					row.currencyCode = currency.code
					row.currencyName = currency.name
				} else {
					row.currencyCode = "CNY"
					row.currencyName = this.getZH("CNY")
				}
			}
		},
		/**
		 * 保存数据
		 */
		saveItem(row, index) {
			if (this.$isEmpty(row.countryCode)) {
				this.$alert(this.getZH('pleaseCountry'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.declaredValue)) {
				this.$alert(this.getZH('inputDeclaredValue'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			if (this.$isEmpty(row.currencyCode)) {
				this.$alert(this.getZH('pleaseCurrency'), {
					confirmButtonText: this.$t("common.confirm")
				})
				return
			}
			row.isEdit = false
			this.isEdit = false
			this.tempData = {}
		},
		/**
		 * 新增单条数据
		 */
		addItem() {
			let row = {
				countryCnName: '',
				countryEnName: '',
				countryCode: '',
				countryId: '',
				declaredValue: '',
				currencyCode: '',
				currencyName: '',
				disable: false,
				isEdit: true
			}
			this.dataList.push(row)
			this.isEdit = true
		},
		/**
		 *编辑当条数据
		 */
		editItem(row) {
			this.isEdit = true
			this.tempData = this.$extends({}, row)
			this.$set(row, 'isEdit', true)
		},
		/**
		 * 取消当前行操作
		 */
		cancel(row, index) {
			this.isEdit = false
			if (this.$isNotEmpty(this.tempData)) {
				this.tempData.isEdit = false
				this.$copyProps(row, this.tempData)
				this.tempData = {}
			} else {
				this.dataList.splice(index, 1)
				this.tempData = {}
			}
		},
		/**
		 * 删除行数据
		 */
		delItem(index) {
			this.dataList.splice(index, 1)
		},
		getZH(key, obj) {
			obj = obj || "goodsManagement"
			let str = obj + "." + key
			return this.$t(str)
		}
	}
}
</script>
<style>
</style>
