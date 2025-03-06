<template>
  <div>
    <el-popover
      placement="bottom-end"
      title=""
      width="300"
      trigger="click"
      @show="getTaskList"
    >
      <div slot="reference" class="notification-btn">
        <div style="position: relative;" class="test">
          <el-badge :is-dot="unreadNumber" class="item">
            <i class="iconfont icon-xiaoxi1 top-account"></i>
          </el-badge>
        </div>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('common.navbar.notification')" name="notification">
          <div class="notification-container">
            <div v-if="unreadNumber">
              <el-row class="notification-item" v-for="(item, index) in notificationList" :key="index">
                <div @click="clickNotify(item)">
                  <el-col :span="3">
                    <i class="iconfont icon-xiaoxi1 top-account"></i>
                  </el-col>
                  <el-col :span="21">
                    <div class="content">
                      <div class="title">{{item.notifyTitle}}</div>
                      <div class="notification-time">{{item.messageTime}}</div>
                    </div>
                  </el-col>
                </div>
              </el-row>
              <div class="see-more" @click="seeMore">{{$t('common.navbar.viewMore')}}</div>
            </div>
            <div v-else>
              <el-empty :description="$t('common.navbar.messageEmpty')"></el-empty>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('common.navbar.taskList')" name="taskList">
          <div class="notification-container">
            <div v-if="hasTask">
              <div class="task-item" v-for="(item, index) in taskList" :key="index">
                <div class="task-name">
                  <i class="iconfont icon-piegraph"></i>
                  <el-tooltip class="item" effect="dark" :content="item.taskName" placement="top">
                    <div class="tooltip-div">{{item.taskName}}</div>
                  </el-tooltip>
                </div>
                <div class="task-status">{{item.taskStatusName}}</div>
                <div :class="['task-file', {'disabled-download': item.taskStatus !== 3}]" @click="clickTask(item)">
                  <i class="iconfont icon-clouddownload"></i>
                </div>
              </div>
              <div class="see-more" @click="viewMoreTask">{{$t('common.navbar.viewMore')}}</div>
            </div>
            <div v-else>
              <el-empty :description="$t('common.navbar.taskEmpty')"></el-empty>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script>
import { getMessageListApi } from '@/api/middleware/message'
import { getTaskListApi } from '@/api/taskManager/taskList'
import { parseTime } from '@/utils/index'

export default {
	name: 'Message',
	props: {},
	components: {},
	data() {
		return {
			activeName: 'notification',
			notificationList: [],
			taskList: []
		}
	},
	computed: {
		unreadNumber() {
			return !!this.$store.state.message.unreadNumber
		},
		hasTask() {
			return this.taskList.length > 0
		}
	},
	created() {
		this.$store.dispatch('message/getUnreadNumber')
	},
	methods: {
		clickNotify(row) {
			this.$router.push('/message/detail?id=' + row.id)
		},
		clickTask(row) {
			// 下载对应的任务文件
			if (row.taskStatus === 3) {
				this.downloadFile({
					fileName: row.parseCloudFileName,
					url: row.parseCloudFileLink
				})
			}
		},
		seeMore() {
			this.$router.push({ name: 'MessageList' })
		},
		viewMoreTask() {
			this.$router.push({ name: 'TaskList' })
		},
		getNotifyList() {
			let params = {
				notifyType: '',
				readFlag: false,
				pageNum: 1,
				pageSize: 6
			}
			getMessageListApi(params).then(res => {
				if (res && res.ok) {
					res.content.list.forEach(v => {
						v.messageTime = parseTime(v.createTime)
					})
					this.notificationList = res.content.list
				} else {
					this.notificationList = []
				}
			}).catch(err => {
				console.log(err)
			})
		},
		async getTaskList() {
			let res = await getTaskListApi({ pageSize: 6, pageNum: 1 })
			if (res.ok) {
				this.taskList = res.content.list
			} else {
				this.taskList = []
			}
		}
	},
	mounted() {
		this.getNotifyList()
		this.getTaskList()
	}
}
</script>
<style scoped lang="scss">
.notification-btn {
	border: none;
	padding: 10px 0;
}

.test {
	height: 20px;
	line-height: 20px;
	margin-top: -8px;
	cursor: pointer;
}

.notification-title {
	border-bottom: 1px solid #eee;
	padding-bottom: 8px;

	.right {
		float: right;
	}
}
.title {
	overflow: hidden;
	white-space: nowrap;
}

.content {
	font-size: 13px;

	.msg {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 130px;
	}
}

.notification-item {
	cursor: pointer;
	margin: 12px 8px;
}

.notification-time {
	color: #bbb;
	font-size: 12px;
}

.see-more {
	text-align: center;
	color: #3a71a8;
	cursor: pointer;
}

.top-account {
	cursor: pointer;
	width: 20px;
	height: 20px;
	color: #35628a;
	font-size: 20px;
}

.no-more {
	height: 150px;
	line-height: 150px;
	text-align: center;
}
.task-item {
	height: 35px;
	overflow: hidden;
	padding: 0 10px;
	margin: 12px 0;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
	.icon-piegraph {
		display: inline-block;
		vertical-align: middle;
	}
	.tooltip-div {
		width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		white-space: nowrap;
		vertical-align: middle;
	}
	.task-file {
		cursor: pointer;
		color: #207bda;
		&.disabled-download {
			cursor: not-allowed;
			color: #ccc;
		}
	}
}
</style>
