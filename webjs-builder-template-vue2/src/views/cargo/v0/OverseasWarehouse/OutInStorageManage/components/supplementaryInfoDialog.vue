<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('outInStorageManage.addInfo')"
			width="550px"
			:close-on-click-modal="false"
		>
			<div>
				<el-form
					v-if="dialogVisible"
					ref="formData"
					label-width="90px"
					label-position="left"
					:model="formData"
				>

					<el-form-item
						:label="$t('outInStorageManage.actualPalletQuantity')"
						prop="actualPalletQuantity"
						:rules="[{
								validator: $validators.pInt,
								message: $t('outInStorageManage.pInt'),
							},
						]"
					>
						<el-input v-model="formData.actualPalletQuantity" size="mini" />
					</el-form-item>
					<el-form-item
						:label="$t('outInStorageManage.boxQuantity')"
						prop="boxQuantity"
						:rules="[{
								validator: $validators.pInt,
								message: $t('outInStorageManage.pInt'),
							},
						]"
					>
						<el-input v-model="formData.boxQuantity" size="mini" />
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
        <div class="flex-between">
          <div>
            <div class="tips fc-yellow" v-if="$isEmpty(formData.actualPalletQuantity)&&$isEmpty(formData.boxQuantity)"><i class="el-icon-warning fc-red fs-16"></i> 至少要填写一个数量</div>
          </div>
          <div>
            <el-button
              type="primary"
              size="mini"
              @click="saveForm('formData')"
              :disabled="loading ||($isEmpty(formData.actualPalletQuantity)&&$isEmpty(formData.boxQuantity))"
            >
              {{ $t("common.confirmBtn") }}
            </el-button>
            <el-button
              size="mini"
              @click="dialogVisible = false"
              :disabled="loading"
            >
              {{ $t("common.cancelBtn") }}
            </el-button>
          </div>
        </div>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { saveOutboundsBaseInfo } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'SupplementaryInfoDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		actualPalletQuantity: Number,
		boxQuantity: Number,
		id: String
	},

	data() {
		return {
			loading: false,
			dialogVisible: false,
			formData: {
				actualPalletQuantity: null,
				boxQuantity: null
			}
		}
	},
	methods: {

		/**
		 * 保存数据
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.loading = true
					saveOutboundsBaseInfo(this.formData, this.id).then(res => {
						if (res.ok) {
							this.loading = false
							this.$message.success(this.$t('TipsMessage.saveMessage'))
							this.$emit('saved')
							this.dialogVisible = false
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
			if (!val) {
				this.formData.actualPalletQuantity = null
				this.formData.boxQuantity = null
			}
		},
		visible(val) {
			if (val) {
				this.formData.actualPalletQuantity = this.actualPalletQuantity
				this.formData.boxQuantity = this.boxQuantity
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.tips {
	font-size: 12px;
	// margin-bottom: 10px;
}
</style>
