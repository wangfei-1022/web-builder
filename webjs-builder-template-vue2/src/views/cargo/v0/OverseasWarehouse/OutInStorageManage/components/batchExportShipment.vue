<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('outInStorageManage.batchExportShipment')"
			width="360px"
			:close-on-click-modal="false"
		>
			<div>
        <div class="flex-box">
          <div class="item-box flex-center" @click="()=>{$emit('saved',1);dialogVisible = false}">
            <div class="item-text">
              <i class="el-icon-circle-plus item-icon"></i>
              <div>{{$t('outInStorageManage.orderOfName')}}</div>
            </div>
          </div>
          <div class="item-box ml-20 flex-center" @click="()=>{$emit('saved',2);dialogVisible = false}">
            <div class="item-text ">
              <i class="el-icon-upload item-icon"></i>
              <div>{{$t('outInStorageManage.logisticsOfName')}}</div>
            </div>
            </div>
        </div>
			</div>

			<span slot="footer" class="dialog-footer">
				<el-button	size="mini"	@click="dialogVisible = false">	{{ $t("common.cancel") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'BatchExportShipment',
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dialogVisible: false
		}

	},
	methods: {
		/**
 * 新建编辑
 */
		edit() {
			// this.$router.push({ path: '/outbound/edit' })
			// this.dialogVisible = false
		}
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.item-box {
	width: 150px;
	height: 100px;
	background-color: #108ee9;
	color: #fff;
	border-radius: 4px;
	cursor: pointer;
	.item-icon {
		text-align: center;
		font-size: 26px;
		margin-bottom: 4px;
		width: 100%;
	}
}
</style>
