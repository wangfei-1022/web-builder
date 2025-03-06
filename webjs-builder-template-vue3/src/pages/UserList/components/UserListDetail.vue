<template>
  <ASpace direction="vertical" size="medium" fill>
    <ACard :bordered="false">
      <Descriptions :cols="1" :columns="userListColumns" :data="userList">
      </Descriptions>
    </ACard>
  </ASpace>
</template>

<script lang="tsx" setup>
import Descriptions, { type DescriptionsColumnData } from '@/components/Descriptions';
import type { UserListDto } from '@/services/test-service';
import { cloneDeep } from 'lodash';
import { computed, type PropType } from 'vue';

// 定义属性
const props = defineProps({
  /** 源数据 */
  raw: Object as PropType<OptimizeModel<UserListDto>>,
});

// UserListDto
const userList = computed(() => {
  return props.raw && {
    ...cloneDeep(props.raw),
  };
});

// UserListDto列
const userListColumns: DescriptionsColumnData[] = [
  { title: 'where', dataIndex: 'where' },
  { title: 'limit', dataIndex: 'limit' },
];
</script>