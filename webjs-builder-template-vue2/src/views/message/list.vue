<template>
  <div v-loading="fullscreenLoading" class="sys-right-inner-wrap">
    <el-tabs v-model="activeName" class="message-tab" @tab-click="handleSetTap">
      <el-tab-pane name="-1">
        <span slot="label">{{ $t('messageCenter.allMessage') }}
          <span v-if="allUnread" class="unread">({{ allUnread }})</span></span>
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label">{{ $t('messageCenter.sysMessage') }}
          <span v-if="sysUnread" class="unread">({{ sysUnread }})</span></span>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label">{{ $t('messageCenter.businessMessage') }}<span v-if="businessUnread" class="unread">({{ businessUnread }})</span></span>
      </el-tab-pane>
    </el-tabs>

    <div class="container-wrap">
      <div class="features-btn">
        <el-button type="primary" size="mini" @click="batchRead">{{ $t('messageCenter.allRead') }}</el-button>
        <div style="float: right">
          <i class="iconfont icon-refresh" @click="getList"></i>
          <el-switch v-model="readFlag" @change="isReadChange" />
          <span class="isRead">{{ $t('messageCenter.showUnread') }}</span>
        </div>
      </div>
      <el-table
        row-key="id"
        class="dataTable"
        :height="tableHeight"
        :data="tableDataList"
        :row-style="setRowStyle"
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
      >
        <el-table-column type="selection" width="55" fixed />
        <el-table-column prop="title" :label="''" align="center" width="50">
          <template slot-scope="scope">
            <div class="msg-title">
              <i v-if="!scope.row.readFlag" class="iconfont icon-youjian" />
              <i v-if="scope.row.readFlag" class="iconfont icon-yidudianjihou" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="notifyTitle"
          :label="$t('messageCenter.messageTitle')"
          align="left"
          width="500"
        />
        <el-table-column
          prop="notifyTypeName"
          :label="$t('messageCenter.messageType')"
          align="center"
          width="200"
        />
        <el-table-column
          prop="messageTime"
          :label="$t('messageCenter.messageTime')"
          align="center"
        />
      </el-table>

      <div class="pagination-wrap">
        <Pagination
          :total="pageTotal"
          :limit.sync="pagination.pageSize"
          :page.sync="pagination.pageNum"
          @pagination="getList"
        />
      </div>
    </div>

    <div class="messageDetail" v-if="showDetail">
      <div class="link">
        <a @click="goBackList">{{$t('messageCenter.goBackList')}}</a>
      </div>
      <div>
        <p class="messageTitle">{{detail.notifyTitle}}</p>
        <p class="messageTime">{{detail.messageTime}}</p>
        <p class="messageContent" v-html="detail.notifyContent"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { getMessageListApi, setMessageReadApi, getUnreadNumberByTypeApi, getMessageDetailApi } from '@/api/middleware/message'
import { parseTime } from '@/utils/index'

export default {
	name: 'MessageList',
	components: {},
	props: {
		read: null
	},
	data() {
		return {
			showDetail: false,
			detail: {},
			tableHeight: document.documentElement.clientHeight - 360,
			allUnread: 0,
			sysUnread: 0,
			businessUnread: 0,
			ids: [],
			readFlag: false,
			activeName: '-1',
			fullscreenLoading: false,
			pageSizeList: [10, 20, 30, 40],
			tableDataList: [],
			multipleSelection: [], // 列表选择
			pagination: {
				pageNum: 1,
				pageSize: 50
			},
			pageTotal: 0
		}
	},
	mounted() {
		/** 控制table的高度 */
		window.onresize = () => {
			this.updateTableHeight()
		}
		this.getList()
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
		updateTableHeight() {
			const offsetHei = document.documentElement.clientHeight
			const removeHeight = 360
			this.tableHeight = offsetHei - removeHeight
		},
		isReadChange() {
			this.getList()
		},
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		batchRead() {
			if (!this.multipleSelection.length) {
				this.$message({
					type: 'error',
					message: this.$t('messageCenter.needOneLine')
				})
				return
			}
			const data = {
				ids: []
			}
			this.multipleSelection.forEach(function (v) {
				data.ids.push(v.id)
			})
			setMessageReadApi(data).then(res => {
				if (res && res.ok) {
					this.$message({
						type: 'success',
						message: this.$t('messageCenter.updateSuccess')
					})
					// 获取最新数目
					this.$store.dispatch('message/getUnreadNumber')
					this.getList()
				}
			})
		},
		handleSetTap() {
			this.getList()
		},
		goBackList() {
			this.showDetail = false
		},
		clickRow(row) {
			getMessageDetailApi(row.id).then(res => {
				if (res && res.ok) {
					row.readFlag = true
					this.getUnreadNumber()

					this.showDetail = true
					res.content.messageTime = parseTime(res.content.createTime)
					this.detail = res.content
					this.$store.dispatch('message/getUnreadNumber')
				}
			})
		},
		setRowStyle(scope) {
			if (scope.row.readFlag) {
				return {
					color: '#aaa'
				}
			} else {
				return {
					color: '#333'
				}
			}
		},
		getUnreadNumber() {
			this.sysUnread = 0
			this.businessUnread = 0
			this.allUnread = 0
			getUnreadNumberByTypeApi().then(res => {
				if (res && res.content) {
					res.content.forEach(ex => {
						if (ex.notifyType === 1) {
							this.sysUnread = ex.notifyTypeCount
						}
						if (ex.notifyType === 2) {
							this.businessUnread = ex.notifyTypeCount
						}
						this.allUnread += Number(ex.notifyTypeCount)
					})
				}
			})
		},
		getList() {
			this.getUnreadNumber()

			const params = {
				notifyType: this.activeName === '-1' ? '' : this.activeName,
				readFlag: this.readFlag === false ? '' : !true,
				...this.pagination,
				...this.searchForm
			}
			this.fullscreenLoading = true
			getMessageListApi(params).then(res => {
				if (res && res.ok) {
					const ids = []
					res.content.list.forEach(function (v) {
						v.messageTime = parseTime(v.createTime)
						ids.push(v.id)
					})

					this.tableDataList = res.content.list
					this.ids = ids
					this.pageTotal = Number(res.content.total)
				} else {
					this.pageTotal = 0
					this.tableDataList = []
				}
				this.fullscreenLoading = false
			}).catch(() => {
				this.fullscreenLoading = false
			})
		}
	}
}

</script>
<style lang='scss' scoped>
@import "./detail.scss";
.sys-right-inner-wrap {
	width: 100% !important;
	margin: 0 !important;
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
	background: #f2f2f2;
}

.message-tab {
	background: #fff;
	padding: 0 20px;

	::v-deep .el-tabs__header {
		margin: 0;
	}

	.unread {
		color: red;
	}
}

.msg-title {
	cursor: pointer;
}

.icon-youjian {
	margin-right: 6px;
	color: #ffa200;
}

.icon-yidudianjihou {
	margin-right: 6px;
	color: #ccc;
}

.container-wrap {
	margin: 20px;
	padding: 10px 20px;
	background: #fff;
}

.pagination-wrap {
	margin-top: 20px;
	text-align: right;
}

.features-btn {
	margin-bottom: 15px;
}

.dataTable {
	margin-top: 15px;
}

.isRead {
	margin-left: 15px;
	font-size: 14px;
}

.icon-refresh {
	font-size: 24px;
	margin-right: 20px;
	display: inline-block;
	float: left;
	line-height: 21px;
	color: #425c88;
	cursor: pointer;
}
.messageDetail {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2002;
	margin: 0;
	z-index: 200;
}
</style>
