<template>
	<div>
    <div class="flex-box">
      <el-form-item label="联系人信息" />
      <el-form-item :label="''" label-width="0px">
        <el-checkbox
          v-model="data.ccOperatorFlag"
          class="ml-10"
          :disabled="isDetail"
        >
          {{$t('warehouse.ccOperatorFlag')}}
        </el-checkbox>
      </el-form-item>
    </div>
    <div v-for='(item,index) in data.warehouseContactsList' :key='index'>
      <el-row :gutter='20'>
        <el-col :span="8">
          <el-form-item :label="$t('warehouse.contactsType')" :prop="'warehouseContactsList.' +index +'.contactsType'"
          :rules="[
						{
							required: true,
							message: $t('warehouse.please_select_contactsType'),
							trigger: 'blur',
						},
					]"
        >
          <el-select size='mini' v-model="item.contactsType" :placeholder="$t('warehouse.please_select_contactsType')" :disabled="isDetail" >
            <el-option :label="$t('warehouse.inStorageContact')" :value="1" />
             <el-option :label="$t('warehouse.outStorageContact')" :value="2" />
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('warehouse.contactName')" :prop="'warehouseContactsList.' +index +'.contactsName'"
            :rules="[
              {
                required: true,
                message: $t('warehouse.please_contact_name'),
                trigger: 'blur',
              },
            ]"
        >
          <el-input size="mini" :placeholder="$t('warehouse.please_contact_name')" v-model="item.contactsName" :disabled="isDetail"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('warehouse.contactEmail')" :prop="'warehouseContactsList.' +index +'.contactsEmail'"
            :rules="[
              {
                required: true,
                message: $t('warehouse.please_contact_email'),
                trigger: 'blur',
              },
              { validator: $validators.checkEmail }
            ]"
        >
          <el-input size="mini" :placeholder="$t('warehouse.please_contact_email')" v-model="item.contactsEmail" :disabled="isDetail"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="2">
          <div class="flex-box">
            <el-form-item
              label=""
              label-width="0px"
              class="ml-10"
              v-if="
                data.warehouseContactsList.length - 1 === index && !isDetail
              "
            >
          <div
            class="el-icon-circle-plus-outline fs-18"
            @click="addItem()"
          ></div>
        </el-form-item>
        <el-form-item
          label=""
          label-width="0px"
          class="ml-10"
          v-if="data.warehouseContactsList.length > 1 && !isDetail "
        >
          <div
            class="el-icon-remove-outline fs-18"
            @click="removeItem(index)"
          ></div
        ></el-form-item>
          </div>
        </el-col>
      </el-row>
    </div>
	</div>
</template>

<script>
import { checkNumOrEnglish } from '@/utils/validate'
export default {
	name: 'ContactInfo',
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
		this.init()
	},
	watch: {

	},
	methods: {
		async init() {
			if (this.$isEmpty(this.data.warehouseContactsList)) {
				let initData = [{
					contactsType: '',
					contactsName: '',
					contactsEmail: ''

				}]
				this.$set(this.data, 'warehouseContactsList', initData)
				this.$set(this.data, 'ccOperatorFlag', true)
			}
		},
		/**
		 * 添加数据
		 */
		addItem() {
			let data = {
				contactsType: '',
				contactsName: '',
				contactsEmail: ''
			}
			this.data.warehouseContactsList.push(data)
		},
		/**
		 * 删除单条数据
		 */
		removeItem(index) {
			this.data.warehouseContactsList.splice(index, 1)
		}
	}
}
</script>

<style scoped lang="less">
</style>
