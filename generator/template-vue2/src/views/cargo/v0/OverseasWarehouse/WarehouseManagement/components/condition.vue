<template>
  <div class="pd-16 condition">
    <el-form-item :label=" $t('logisticsProduct.standard_product_rule')" class="mb-0">
      <div class="flex">
        <el-tooltip class="item" effect="dark" :content='$t("logisticsProduct.restrictive_condition_tips_warehouse")' placement="bottom">
          <span class="el-icon-warning fc-yellow icon-tips"></span>
        </el-tooltip>
        <div v-if="$isNotEmpty(conditionList)">
          <div
            v-for="(item, index) in conditionList"
            :key="index"
            class="flex"
          >
            <div
              v-if="!isDetail"
              class="el-icon-remove-outline removeIcon"
              @click="removeLimit(index)"
            />
            <div>
              <div class="mb-10 flex-box">
                <el-form-item
                  label=""
                  label-width="0px"
                  class="mb-0"
                  :prop="`conditionList[${index}].conditionTypeCode`"
                  :rules="[
                    {
                      required: index === 0,
                      message: $t(
                        'logisticsProduct.please_select_restrictive_condition'
                      ),
                    },
                  ]"
                >
                  <el-select
                    :disabled="isDetail"
                    v-model="item.conditionTypeCode"
                    size="mini"
                    :placeholder="$t('logisticsProduct.please_select_restrictive_condition')"
                    @change="fieldCodeChange(item)"
                  >
                    <el-option
                      v-for="(data, key) in limitingConditionsType"
                      :key="key"
                      :label="$t(`logisticsProduct.${data.name}`)"
                      :value="Number(key)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label=""
                  label-width="0px"
                  class="mb-0 ml-10"
                  :prop="`conditionList[${index}].fieldCode`"
                  :rules="[
                    {
                      required:
                        index === 0 || $isNotEmpty(item.conditionTypeCode),
                      message: $t(
                        'logisticsProduct.please_select_restrictive_dto'
                      ),
                    },
                  ]"
                >
                  <el-select
                    :disabled="isDetail"
                    v-model="item.fieldCode"
                    @change="item.unit=''"
                    size="mini"
                    :placeholder="
                      $t('logisticsProduct.please_select_restrictive_dto')
                    "
                  >
                    <el-option
                      v-for="data in filterTypes(item)"
                      :key="data.value"
                      :label="$t(`logisticsProduct.${data.name}`)"
                      :value="data.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label=""
                  label-width="0px"
                  class="mb-0 ml-10"
                  :prop="`conditionList[${index}][unit]`"
                  :rules="[
                    {
                      required:
                        index === 0 || $isNotEmpty(item.conditionTypeCode),
                      message:
                        item.conditionTypeCode != 4
                          ? $t('logisticsProduct.please_select_unit')
                          : $t('logisticsProduct.please_select_country'),
                    },
                  ]"
                >
                  <el-select
                    :disabled="isDetail"
                    v-model="item.unit"
                    size="mini"
                    :placeholder="$t('logisticsProduct.please_select_unit')"
                  >
                    <el-option
                      v-for="unitItem in filterUnits(item.conditionTypeCode,item.fieldCode)"
                      :key="unitItem.value"
                      :label="$t(`logisticsProduct.${unitItem.name}`)"
                      :value="unitItem.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <div
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  class="mb-10 flex-box"
                >
                  <div class="w-180 h-28 inlineBlock" />
                  <el-form-item
                    label=""
                    label-width="0px"
                    class="mb-0 ml-10"
                    :prop="`conditionList[${index}].children[${childIndex}].operator`"
                    :rules="[
                      {
                        required:
                          (index === 0 ||
                            $isNotEmpty(item.conditionTypeCode)) &&
                          childIndex === 0,
                        message: $t(
                          'logisticsProduct.please_select_comparison_operators'
                        ),
                      },
                    ]"
                  >
                    <el-select
                      v-model="child.operator"
                      :disabled="
                        $isEmpty(item.conditionTypeCode) ||
                        $isEmpty(item.fieldCode) || isDetail"
                      size="mini"
                      :placeholder="
                        $t(
                          'logisticsProduct.please_select_comparison_operators'
                        )
                      "
                      clearable
                    >
                      <el-option
                        v-for="operatorItem in filterOperators(item, child)"
                        :key="operatorItem.value"
                        :label="$t(`logisticsProduct.${operatorItem.name}`)"
                        :value="operatorItem.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label=""
                    label-width="0px"
                    class="mb-0 ml-10"
                    :prop="`conditionList[${index}].children[${childIndex}].referenceValue`"
                    :rules="[
                      {
                        required:
                          (index === 0 ||
                            $isNotEmpty(item.conditionTypeCode)) &&
                          (childIndex === 0 || $isNotEmpty(child.operator)),
                        message: $t('logisticsProduct.please_enter_number'),
                      },
                      { validator: checkDecima4 },
                    ]"
                  >
                    <el-input
                      v-model="child.referenceValue"
                      :disabled="$isEmpty(child.operator) ||isDetail"
                      class="w-180"
                      size="mini"
                      clearable
                      :placeholder="
                        $t('logisticsProduct.please_enter_number')
                      "
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pointer" v-if="!isDetail" @click="addLimit()">
        <span class="el-icon-circle-plus-outline"  />
        {{ $t("logisticsProduct.add_restrictive_condition") }}
      </div>
    </el-form-item>
    </div>
</template>

<script>
import limitingConditionsType from './limitingConditionsType'
import { checkDecima4 } from '@/utils/validate'
export default {
	name: 'Condition',
	props: {
		conditionList: {
			type: Array,
			default: () => []
		},
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			limitingConditionsType,
			checkDecima4,
			operators: [{
				name: 'equal',
				value: 10
			},
			{
				name: 'less_than',
				value: 13
			},
			{
				name: 'greater_than',
				value: 12
			},
			{
				name: 'equal_or_greater_than',
				value: 14
			},
			{
				name: 'equal_or_less_than',
				value: 15
			},
			{
				name: 'not_equal',
				value: 11
			}],
			types: [
				{
					name: 'size_restrictions',
					value: 2
				}
			]
		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		/**
		 *增加限制条件
		 */
		addLimit() {
			const data = {
				fieldCode: '',
				conditionTypeCode: '',
				unit: '',
				countryCodeList: [],
				children: [{
					operator: '',
					referenceValue: ''
				},
				{
					operator: '',
					referenceValue: ''
				}]
			}
			this.conditionList.push(data)
		},
		/**
		 * 减少限制条件
		 */
		removeLimit(index) {
			this.conditionList.splice(index, 1)
		},
		/**
		 * 过滤限制分类
		 */
		filterTypes(key) {
			if (this.$isEmpty(key.conditionTypeCode)) {
				return []
			}
			let arr = this.limitingConditionsType[key.conditionTypeCode].types
			if (this.$isEmpty(arr)) {
				return []
			}
			const currentIndex = this.conditionList.indexOf(key)
			arr = arr.filter(item => this.$isEmpty(this.conditionList.find((condition, index) => condition.fieldCode === item.value && index !== currentIndex)))
			return arr
		},
		/**
		 * 限制条件变更
		 */
		fieldCodeChange(item) {
			item.fieldCode = ''
			item.unit = ''
			item.countryCodeList = []
			item.children[0].operator = ''
			item.children[0].referenceValue = ''
			item.children[1].operator = ''
			item.children[1].referenceValue = ''
		},
		/**
		 * 获取单位
		 */
		filterUnits(key, childKey) {
			if (this.$isEmpty(key)) {
				return []
			}
			let arr = []
			let childArr = this.limitingConditionsType[key]
			if (this.$isNotEmpty(childKey)) {
				let childItem = childArr.types.find(item => item.value === childKey)
				if (childItem.units) {
					arr = childItem.units
				} else {
					arr = childArr.units
				}
			} else {
				arr = childArr.units
			}
			return arr
		},
		/**
		 * 获取限制条件
		 */
		filterOperators(data, childItem) {
			let arr = this.operators

			// 排除当前条
			const currentIndex = data.children.indexOf(childItem)
			arr = arr.filter(item => this.$isEmpty(data.children.find((child, index) => item.value === child.operator && index !== currentIndex)))
			return arr
		}
	}
};
</script>

<style scoped lang="less">
.removeIcon {
	margin-top: 10px;
	margin-right: 5px;
}
::v-deep.el-form-item__error {
	padding-top: 0px;
}
.icon-tips {
	margin-top: 9px;
	margin-right: 10px;
	margin-left: -4px;
	font-size: 16px;
}
</style>
