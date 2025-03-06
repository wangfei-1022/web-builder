<template>
  <FullScreen v-model="isFullScreen">
    <ACard :bordered="false">
      <div class="filters">
        <ARow :gutter="8">
          <ACol flex="1">
            <ASpace class="filters-input filters-input-active" wrap>
              <AInput placeholder="输入任意查询条件"
                      style="width: 200px;"
                      v-model="userListQuery.keywords"
                      allowClear />
            </ASpace>
          </ACol>

          <ACol flex="initial">
            <ASpace size="mini" wrap>
              <AButton style="padding: 0 4px;" type="text" @click="resetUserListQueryHandle">
                重置
              </AButton>
            </ASpace>
          </ACol>
        </ARow>
      </div>

      <div class="actions">
        <ARow :gutter="8">
          <ACol flex="1">
            <ASpace :size="0" wrap>
              <template #split>
                <ADivider direction="vertical" :margin="4" />
              </template>
              <AButton style="padding: 0 4px;" type="text" @click="showCreateUserListHandle">
                <template #icon>
                  <IconPlus />
                </template>新增
              </AButton>
            </ASpace>
          </ACol>

          <ACol flex="initial">
            <ASpace wrap>
              <AButton @click="userListRequest.load">
                <template #icon>
                  <IconRefresh />
                </template>
              </AButton>
              <AButton @click="toggleFullScreenHandle">
                <template #icon>
                  <IconFullscreenExit v-if="isFullScreen" />
                  <IconFullscreen v-else />
                </template>
              </AButton>
              <AButton @click="userListColumns.showSetting">
                <template #icon>
                  <IconSettings />
                </template>
              </AButton>
            </ASpace>
          </ACol>
        </ARow>
      </div>

      <div class="table">
        <ATable tableLayoutFixed
                size="small"
                :bordered="false"
                :scroll="{ x: '100%', y: '100%' }"
                :columns="userListColumns.value"
                columnResizable
                @columnResize="userListColumns.resize"
                :loading="userListRequest.loading"
                :data="userListRequest.data"
                rowKey="id"
                :pagination="{
                  total: userListRequest.total,
                  showTotal: true,
                  current: userListRequest.current,
                  pageSize: userListRequest.pageSize,
                  showPageSize: true,
                  pageSizeOptions: [20, 50, 100, 200],
                }"
                @pageChange="userListRequest.setCurrent"
                @pageSizeChange="userListRequest.setPageSize"
                :rowSelection="{
                  type: 'checkbox',
                  showCheckedAll: true,
                  width: 40,
                  fixed: true,
                }"
                v-model:selectedKeys="userListSelectedKeys">
          <!-- 数值明细入口模板 -->
          <template #detailEntry="{ record }">
            <ALink @click="viewUserListHandle(record.$raw)">
              {{ record.where }}
            </ALink>
          </template>
          <!-- 列操作区模板 -->
          <template #actions="{ record }">
            <ASpace :size="0">
              <template #split>
                <ADivider direction="vertical" :margin="4" />
              </template>
              <ALink @click="showUpdateUserListHandle(record.$raw)">编辑</ALink>
              <ALink @click="showDeleteUserListHandle(record.$raw)">删除</ALink>
            </ASpace>
          </template>
        </ATable>
      </div>
    </ACard>
  </FullScreen>
</template>

<script lang="tsx" setup>
import FullScreen from '@/components/FullScreen';
import { createUserList, deleteUserList, getAllUserLists, partialUpdateUserList, type UserListDto } from '@/services/test-service';
import { usePassport } from '@/stores/user';
import { getEntityUpdate, getErrorMessage, getModelFilesUpdate, useRequestPagination, useTableColumns } from '@/utils';
import { Drawer, Message, Modal } from '@arco-design/web-vue';
import { cloneDeep, debounce } from 'lodash';
import { computed, reactive, ref, watch } from 'vue';
import UserListDetail from './components/UserListDetail.vue';
import UserListForm from './components/UserListForm.vue';

// 全屏
const isFullScreen = ref(false);
const toggleFullScreenHandle = () => {
  isFullScreen.value = !isFullScreen.value;
};

// UserListDto请求参数
const userListInitialQuery = {
  /** 关键词 */
  keywords: undefined as string | undefined,
};
const userListQuery = reactive(cloneDeep(userListInitialQuery));
const userListSort = ref(['id,desc']);

// 重置UserListDto筛选
const resetUserListQueryHandle = () => {
  Object.entries(cloneDeep(userListInitialQuery)).forEach(([key, value]) => {
    // @ts-ignore
    userListQuery[key] = value;
  });
};

// 获取UserListDto
const userListRequest = useRequestPagination(
  async ({ current, pageSize }) => {
    const query = {
      ...userListQuery as any,
      page: current - 1,
      size: pageSize,
      sort: userListSort.value,
    };
    const { headers, data } = await getAllUserLists(query);
    return {
      data: data.map(item => {
        return {
          $raw: item,
          ...cloneDeep(item),
        };
      }),
      total: Number(headers.xTotalCount),
    };
  },
  {
    onError: error => Message.error(getErrorMessage(error)),
  },
);
watch(
  [
    () => ({ ...userListQuery }),
    userListSort,
  ],
  debounce(() => userListRequest.setCurrent(1, true), 500),
);

// UserListDto列
const userListColumns = useTableColumns({
  persistenceKey: 'UserList',
  initialValue: [
    { title: 'where', dataIndex: 'where', slotName: 'detailEntry', width: 200, ellipsis: true, tooltip: true },
    { title: 'limit', dataIndex: 'limit', width: 200, ellipsis: true, tooltip: true },
    { title: '操作', dataIndex: 'actions', slotName: 'actions', visible: 'always', width: 118, fixed: 'right' },
  ],
});

// 查看UserListDto
const viewUserListHandle = (userList: OptimizeModel<UserListDto>) => {
  Drawer.open({
    title: `${userList.where}`,
    content: () => (
      <UserListDetail raw={userList} />
    ),
    footer: false,
    width: 450,
  });
};

// 新增UserListDto
const showCreateUserListHandle = () => {
  const formRef = ref<InstanceType<typeof UserListForm>>();
  Modal.open({
    title: '新增UserListDto',
    content: () => (
      <UserListForm ref={instance => formRef.value = instance as any} />
    ),
    width: 318,
    maskClosable: false,
    onBeforeOk: async () => {
      try {
        const modelPatch = await formRef.value!.validate();
        try {
          const modelValue = {
            ...modelPatch,
          };
          await createUserList(modelValue);
          Message.success('新增UserListDto成功');
          userListRequest.load();
          return true;
        } catch (error) {
          Message.error(getErrorMessage(error));
          return false;
        }
      } catch (error) {
        return false;
      }
    },
  });
};

// 编辑UserListDto
const showUpdateUserListHandle = (userList: OptimizeModel<UserListDto>) => {
  const formRef = ref<InstanceType<typeof UserListForm>>();
  Modal.open({
    title: `编辑UserListDto：${userList.where}`,
    content: () => (
      <UserListForm ref={instance => formRef.value = instance as any} patch={userList} />
    ),
    width: 318,
    maskClosable: false,
    onBeforeOk: async () => {
      try {
        const modelPatch = await formRef.value!.validate();
        try {
          const modelValue = {
            ...modelPatch,
          };
          const modelUpdate = getEntityUpdate(modelValue, userList);
          if (modelUpdate) {
            await partialUpdateUserList(modelUpdate);
            Message.success('更新UserListDto成功');
            userListRequest.load();
          }
          return true;
        } catch (error) {
          Message.error(getErrorMessage(error));
          return false;
        }
      } catch (error) {
        return false;
      }
    },
  });
};

// 删除UserListDto
const showDeleteUserListHandle = (userList: OptimizeModel<UserListDto>) => {
  Modal.confirm({
    title: '操作确认',
    content: `是否确定删除UserListDto “${userList.where}”？`,
    okButtonProps: {
      type: 'secondary',
      status: 'danger',
    },
    maskClosable: false,
    onBeforeOk: async () => {
      try {
        await deleteUserList(userList.id);
        Message.success('删除UserListDto成功');
        userListRequest.load();
        return true;
      } catch (error) {
        Message.error(getErrorMessage(error));
        return false;
      }
    },
  });
};

// 选择UserListDto
const userListSelectedKeys = ref<number[]>([]);
watch(
  () => userListRequest.data,
  () => {
    userListSelectedKeys.value = [];
  },
);
const selectedUserLists = computed(() => (
  userListRequest.data
    ?.filter(({ id }) => userListSelectedKeys.value.includes(id))
    .map(({ $raw }) => $raw) ?? []
));
</script>

<style lang="less" scoped>
.full-screen {
  display: flex;
  flex-direction: column;

  &:not(.full-screen-active) {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.@{prefix}-card {
  display: flex;
  flex-direction: column;
  max-height: 100%;

  :deep(.@{prefix}-card-body) {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.filters-input {
  height: 40px;
  overflow: hidden;
}

.filters-input-active {
  height: auto;
}

.actions {
  width: 100%;
}

.table {
  width: 100%;
  flex: 1;
  overflow: hidden;
}
</style>