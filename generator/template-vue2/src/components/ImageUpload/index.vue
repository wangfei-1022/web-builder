<template>
  <div class="image-upload-wrap">
    <!-- <el-upload
      :action="fileUploadUrl"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :show-file-list="false"
      :disabled="uploadDisable"
      :headers="uploadHeads"
      multiple
    >
      <el-button size="mini" type="primary" :disabled="uploadDisable">{{$t('common.chooseFile')}}</el-button>
      <div slot="tip" class="el-upload__tip">
        {{$t('common.limitJPGPNG5M')}}
        <span v-show="limit">，{{$t('common.limitAllowUpload')}}{{limit}}{{$t('common.imagesQuantity')}}</span>
      </div>
    </el-upload> -->
    <UploadFile
      @remove="handleRemove"
      @success="uploadSuccess"
      :showFileList="false"
      :beforeUploadLimit="() => 10"
      :disabled="uploadDisable"
      :multiple="true"
      :maxSize="5"
      :accept="'.jpg,.png'">
      <template slot="upload">
        <el-button size="mini" type="primary">{{$t('common.chooseFile')}}</el-button>
      </template>
      <div slot="tip" class="el-upload__tip">
        {{$t('common.limitJPGPNG5M')}}
        <span v-show="limit">，{{$t('common.limitAllowUpload')}}{{limit}}{{$t('common.imagesQuantity')}}</span>
      </div>
    </UploadFile>
    <div v-show="fileList.length > 0" class="img-list">
      <div v-for="(item, index) in fileList" :key="index" class="img-item">
        <img :src="item.url" :alt="item.originFileName">
        <div class="img-opt-wrap">
          <i class="el-icon-delete" @click="handleRemove(item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'ImageUploadModule',
	props: {
		multiple: {
			type: Boolean,
			default: false
		},
		limit: {
			type: Number,
			default: null
		},
		value: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			disabled: false,
			singleFile: [],
			uploadDisable: false
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		fileUploadUrl() {
			return `${process.env.VUE_APP_BASE_API}/api/mdm-service/web/upload/file`
		},
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		},
		showLoading() {
			return this.disabled
		},
		fileList: {
			get: function () {
				return this.value
			},
			set: function (val) {
				return val
			}
		},
		finalLimit() {
			return this.limit - this.value.length
		}
	},
	watch: {
		fileList: function (val) {
			this.checkFileList()
		}
	},
	created() { },
	mounted() { },
	methods: {
		handleBeforeUpload(file) {
			const isJPG = file.type === 'image/jpeg'
			const isPNG = file.type === 'image/png'
			const isLimit5M = file.size / 1024 / 1024 < 5

			if (!isJPG && !isPNG) {
				this.$message.error(this.$t('common.limitJPGPNGInvalid'))
			}
			if (!isLimit5M) {
				this.$message.error(this.$t('common.limitSizeCommon'))
			}
			return isLimit5M && (isJPG || isPNG)
		},
		handleExceed(file, fileList) {
			this.$message.warning(`${this.$t('common.limitAllowUpload')}${this.limit}${this.$t('common.imagesQuantity')}`)
		},
		handleRemove(_obj) {
			this.fileList.splice(this.fileList.findIndex(item => item.cloudFileName === _obj.cloudFileName), 1)
			this.$emit('input', this.fileList)
			this.checkFileList()
		},
		uploadSuccess(res) {
			if (this.uploadDisable) {
				return false
			}
			if (res) {
				this.fileList.push(res)
				this.$emit('input', this.fileList)
			}
			this.checkFileList()
		},
		checkFileList() {
			this.uploadDisable = this.fileList.length >= this.limit
		}
	}
}
</script>
<style lang="scss" scoped>
.img-list {
	display: flex;
	flex-flow: row wrap;
	width: 100%;
	.img-item {
		position: relative;
		border: 1px dashed #c0ccda;
		padding: 2px;
		height: 80px;
		margin: 10px;
		overflow: hidden;
		img {
			object-fit: contain;
			height: 100%;
		}
		.img-opt-wrap {
			position: absolute;
			display: none;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.3);
			color: #fff;
			font-size: 20px;
			cursor: pointer;
		}
		&:hover {
			.img-opt-wrap {
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
