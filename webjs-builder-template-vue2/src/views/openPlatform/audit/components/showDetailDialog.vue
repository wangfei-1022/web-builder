<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title='$t("openPlatform.aduit")'
			width="500px"
			:close-on-click-modal="false"
		>
      <div class="dialog-content">
        <el-form label-width="70px"  label-position="left"  :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading" >
          <el-form-item :label='$t("openPlatform.rateLimitLevel")' prop="rateLimitLevel" :rules="[ {required: true, message: '请选择限制等级'}]">
            <el-select v-model="formData.rateLimitLevel" size="mini" class="w-full">
              <el-option v-for="item in limitTypes" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="计费方案">
            <el-select v-model="formData.chargeType" size="mini" class="w-full">
              <el-option v-for="item in []" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- v-permission="['sys:template:update']" -->
        <el-button type="primary" :loading="loading"  size="mini" @click="saveForm" >
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{ $t("common.cancelBtn")  }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { auditSignApi, getLimitTypeSignApi } from '@/api/middleware/openPlatform'
export default {
	name: 'ShowDetailDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			required: true
		},
		limitTypes: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			dialogVisible: false,
			restrictionClass: [],
			loading: false,
			formData: {
				id: null,
				rateLimitLevel: null,
				chargeType: 1
			}
		}
	},
	computed: {

	},
	methods: {
		async saveForm() {
			this.loading = true
			this.formData.id = this.id
			let rs = await auditSignApi(this.formData)
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$emit('saved')
				this.$message.success(this.$t('common.uploadSuccess'))
			} else {
				this.loading = false
			}
		},
		// 获取详情
		getDetail() {

		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.rateLimitLevel = null
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
