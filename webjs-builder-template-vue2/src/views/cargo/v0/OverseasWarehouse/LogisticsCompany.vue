<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot
      :searchFun="list"
      :resetFun="clearSearchForm"
      class="mb-10"
    >
      <template slot="multipleSearch">
        <el-form
          ref="formData"
          :inline="true"
          :model="formData"
          label-width="100px"
          >
            <el-form-item :label="$t('logisticsCompany.logistics_company_abbreviation')" prop="shortname">
              <el-input
                v-model="formData.shortname"
                maxlength="50"
                type="text"
                :placeholder="$t('logisticsCompany.please_enter_logistics_company_abbreviation')"
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsCompany.logistics_company_code')" prop="scacCode">
              <el-input
                v-model="formData.scacCode"
                maxlength="10"
                type="text"
                :placeholder="$t('logisticsCompany.please_enter_logistics_company_code')"
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsCompany.cn_name')" prop="chineseName">
              <el-input
                v-model="formData.chineseName"
                maxlength="50"
                type="text"
                :placeholder="$t('logisticsCompany.please_enter_cn_name')"
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsCompany.en_name')" prop="englishName">
              <el-input
                v-model="formData.englishName"
                maxlength="50"
                type="text"
                :placeholder="$t('logisticsCompany.please_enter_en_name')"
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsCompany.transport_mode')" prop="transportMode">
              <el-select
                v-model="formData.transportMode"
                size="mini"
                :placeholder="$t('logisticsCompany.please_enter_transport_mode')"
                @change="list"
              >
                <el-option :label="$t('logisticsCompany.transportMode.all')" :value="null" />
                <el-option :label="$t('logisticsCompany.transportMode.express_elivery')" :value="1" />
                <el-option :label="$t('logisticsCompany.transportMode.truck')" :value="2" />
                <el-option :label="$t('logisticsCompany.transportMode.railway')" :value="3" />
                <el-option :label="$t('logisticsCompany.transportMode.trailer')" :value="4" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('logisticsCompany.country')" prop="countryCode">
              <NationalGroupSelect v-model="formData.countryCode" @selected="list()" />
            </el-form-item>
        </el-form>
      </template>
    </TopSearchItemsSlot>
    <div class="mb-10 mt-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="edit()" >{{$t('logisticsCompany.add')}} </el-button>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <Pagination
      :total="total"
      :limit.sync="formData.pageSize"
      :page.sync="formData.pageNum"
      @pagination="list"
    />
    <LogisticsCompanyDialog
      :id="id"
      :is-detail="isDetail"
      :visible.sync="dialog.visible"
      @saved="list"
    />
  </div>
</template>

<script>
import LogisticsCompanyBtn from './components/LogisticsCompanyBtn'
import LogisticsCompanyDialog from './components/LogisticsCompanyDialog'
import { getCompanyListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import NationalGroupSelect from './components/NationalGroupSelect.vue'
export default {
	name: 'LogisticsCompany',
	components: { LogisticsCompanyBtn, LogisticsCompanyDialog, NationalGroupSelect },
	data() {
		return {
			formData: {
				shortname: '',
				scacCode: '',
				chineseName: '',
				englishName: '',
				countryCode: '',
				transportMode: null,
				pageSize: 50,
				pageNum: 1

			},
			id: null,
			isDetail: false,
			loading: false,
			total: 0,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.$t('logisticsCompany.logistics_company_code'),
					field: 'scacCode'
				},
				{
					headerName: this.$t('logisticsCompany.logistics_company_abbreviation'),
					field: 'shortname'
				},
				{
					headerName: this.$t('logisticsCompany.cn_name'),
					field: 'chineseName'
				},
				{
					headerName: this.$t('logisticsCompany.en_name'),
					field: 'englishName'
				},
				{
					headerName: this.$t('logisticsCompany.country'),
					field: 'countryName'
				},
				{
					headerName: this.$t('logisticsCompany.transport_mode'),
					field: 'transportModeName'
				},
				{
					headerName: this.$t('logisticsCompany.track_code'),
					field: 'trackCode'
				},
				{
					headerName: this.$t('logisticsCompany.track_url'),
					field: 'trackUrl'
				},
				{
					headerName: this.$t('logisticsCompany.operation'), pinned: 'right', field: `id`, width: 120,
					cellRendererFramework: 'LogisticsCompanyBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }

		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.list()
	},
	mounted() {

	},
	methods: {
		onReadyRight(params) {
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},
		/**
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			const res = await getCompanyListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res.ok) {
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
		edit(id, isDetail) {
			this.id = id || null
			this.dialog.visible = true
			this.isDetail = isDetail
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>
<style scoped lang="less">
</style>
