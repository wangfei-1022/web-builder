<template>
    <div>
      <div class="box-content"  v-for="item in dataList" :key="item.id">
        <el-row :gutter="10">
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('blNo')}}：</span>
              <span class="label-text">{{item.blNo || '-'}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('vesselOrVoyage')}}：</span>
              <span class="label-text">{{item.vessel}}/{{item.voyage}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('ata')}}：</span>
              <span class="label-text">{{item.ata | formatDate('YYYY-MM-DD')}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('createTime')}}：</span>
              <span class="label-text">{{item.createTime | formatDate('YYYY-MM-DD')}}</span>
            </div>
          </el-col>
          <el-col :span="4" :lg="6">
            <div class="label-content">
              <span class="label-text">{{getZH('systemNo')}}：</span>
              <span class="label-text">{{item.systemNo}}</span>
            </div>
          </el-col>
          <el-col :span="4" :lg="2">
            <div class="flex-right">
              <el-button size="mini" type="primary" @click="edit('edit',item.id)" v-if="item.state==0">{{$t('common.editBtn')}}</el-button>
              <el-button size="mini" type="primary" @click="submitData(item.id)" v-if="item.state==0">{{$t('common.submitBtn')}}</el-button>
              <el-button size="mini" type="primary" @click="edit('confirm',item.id)" v-if="item.state==1">{{$t('seaBl.finishBtn')}}</el-button>
              <el-button size="mini" type="primary" @click="edit('view',item.id)" v-if="item.state!=0">{{$t('common.viewBtn')}}</el-button>
              <el-button size="mini" type="danger" @click="deleteData(item.id)" v-if="item.state==0">{{$t('common.deleteBtn')}}</el-button>
              <el-button size="mini" type="danger" @click="revocationData(item.id)" v-if="item.state==1">{{$t('common.revocationBtn')}}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('consignationDate')}}：</span>
              <span class="label-text">{{item.consignationDate |formatDate('YYYY-MM-DD')}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('consignationSupplierName')}}：</span>
              <span class="label-text">{{item.supplierName ||'-'}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('customsFinishDate')}}：</span>
              <span class="label-text">{{item.customsFinishDate | formatDate('YYYY-MM-DD')}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="label-content">
              <span class="label-text">{{getZH('clearInvoiceNo')}}：</span>
              <span class="label-text">{{item.clearInvoiceNo||'-'}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="label-content">
              <span class="label-text">{{getZH('delivery')}}：</span>
              <span class="label-text">{{item.delivery||'-'}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <div class="label-content">
              <span class="label-text">{{getZH('ctnNo')}}：</span>
              <span class="label-text">{{item.ctnNoList?item.ctnNoList.join(','):'-'}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="$isEmpty(dataList)" class="empty-box">
        暂无数据
      </div>
    </div>
</template>

<script>
import { deleteSeaCustomsApi, confirmSeaCustomsApi, cancelSeaCustomsCntApi, finishSeaCustomsApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'CustomsDeclarationTable',
	props: {
		dataList: Array
	},
	data() {
		return {

		};
	},
	created() {

	},
	mounted() {

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
		// 撤销数据
		revocationData(id) {
			this.confirmTips(this.$t('seaBl.revocationTips')).then(() => {
				cancelSeaCustomsCntApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.revocationSuccess'))
						this.$emit('update')
					}
				})
			})
		},
		// 报关单确认
		finishData(id) {
			this.confirmTips(this.$t('seaBl.submitTips')).then(() => {
				finishSeaCustomsApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.revocationSuccess'))
						this.$emit('update')
					}
				})
			})
		},
		// 删除数据
		deleteData(id) {
			this.confirmTips().then(() => {
				deleteSeaCustomsApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.$emit('update')
					}
				})
			})
		},
		// 提交数据
		submitData(id) {
			this.confirmTips(this.$t('seaBl.submitTips')).then(() => {
				confirmSeaCustomsApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.submitSuccess'))
						this.$emit('update')
					}
				})
			})
		},
		/**
	 * 新增编辑
	 */
		edit(operate, id) {
			this.$router.push({ name: `CustomsDeclarationDetail`, params: { operate, id } })
		}
	}
};
</script>

<style scoped lang="less">
.box-content {
	padding: 20px;
	padding-bottom: 10px;
	box-shadow: 1px 1px 5px #606266;
	margin-top: 20px;
	border-radius: 4px;
	// border: 1px solid #606266;
}
.label-content {
	font-size: 12px;
	margin-bottom: 10px;
	color: #606266;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.empty-box {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	color: #606266;
	height: 60px;
}
</style>
