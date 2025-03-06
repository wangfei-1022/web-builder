import { Drawer, Grid, Link, Table, Tag, type TableColumnData as ArcoTableColumnData } from '@arco-design/web-vue';
import { IconToLeft, IconToRight } from '@arco-design/web-vue/es/icon';
import { cloneDeep, debounce } from 'lodash';
import { computed, isRef, reactive, ref, watch, type Ref } from 'vue';
import { useSetting } from './setting';

/**
 * 使用表格列
 * @param options 选项
 */
export function useTableColumns(options: {
  /** 持久化 key */
  persistenceKey: string;
  /** 初始值 */
  initialValue: TableColumnData[] | Ref<TableColumnData[]>;
  /** 公共的 */
  common?: boolean;
}) {
  const { persistenceKey, initialValue, common } = options;
  const columns = ref<TableColumnInnerData[]>([]);
  const displayColumns = computed<ArcoTableColumnData[]>(() => ([
    ...columns.value
      .filter(({ visible }) => visible)
      .map(({ visible, disabled, ...column }) => column as ArcoTableColumnData),
    { cellClass: 'cell-ghost' },
  ]));
  const setting = useSetting<TableColumnSettingData[] | undefined>({ persistenceKey, common });
  // 合并列
  const mergeHandle = (raw: TableColumnData[]) => {
    if (Array.isArray(setting.value)) {
      const columnRecord = Object.fromEntries(
        setting.value
          .filter(column => column)
          .map(({ dataIndex, visible, width }, index) => [dataIndex, { sequence: index + 1, visible, width }]),
      );
      const sortColumns = (column_0: TableColumnData, column_1: TableColumnData) => {
        const column_0_sequence = columnRecord[column_0.dataIndex]?.sequence || Infinity;
        const column_1_sequence = columnRecord[column_1.dataIndex]?.sequence || Infinity;
        return column_0_sequence - column_1_sequence;
      };
      const _columns = cloneDeep(raw);
      columns.value = [
        _columns.filter(({ visible, fixed }) => visible !== 'dynamic' && fixed === 'left').sort(sortColumns),
        _columns.filter(({ visible, fixed }) => visible === 'dynamic' && fixed === 'left'),
        _columns.filter(({ visible, fixed }) => visible !== 'dynamic' && fixed === undefined).sort(sortColumns),
        _columns.filter(({ visible, fixed }) => visible === 'dynamic' && fixed === undefined),
        _columns.filter(({ visible, fixed }) => visible !== 'dynamic' && fixed === 'right').sort(sortColumns),
        _columns.filter(({ visible, fixed }) => visible === 'dynamic' && fixed === 'right'),
      ]
        .flat()
        .map(({ visible = false, ...column }) => ({
          ...column,
          visible: typeof visible === 'boolean'
            ? (columnRecord[column.dataIndex]?.visible ?? visible ?? false)
            : true,
          width: columnRecord[column.dataIndex]?.width || column.width,
          disabled: visible === 'always',
          dynamic: visible === 'dynamic',
        }));
    } else {
      resetHandle();
    }
  };
  // 重置列
  const resetHandle = () => {
    const _columns = cloneDeep(isRef(initialValue) ? initialValue.value : initialValue);
    columns.value = _columns.map(column => ({
      ...column,
      visible: !!column.visible,
      disabled: column.visible === 'always',
      dynamic: column.visible === 'dynamic',
    }));
  };
  // 调整列宽
  const resizeHandle = (dataIndex: string, width: number) => {
    const column = columns.value.find(column => column.dataIndex === dataIndex);
    if (column) {
      column.width = width;
    }
  };
  // 显示设置
  const showSettingHandle = () => {
    Drawer.open({
      header: false,
      footer: false,
      width: 320,
      content: () => {
        const changed = computed(() => {
          const raw = isRef(initialValue) ? initialValue.value : initialValue;
          return (
            JSON.stringify(raw.map(({ dataIndex, visible, width }) => ({ dataIndex, visible: !!visible, width }))) !==
            JSON.stringify(columns.value.map(({ dataIndex, visible, width }) => ({ dataIndex, visible, width })))
          );
        });
        const selectedKeys = computed({
          get: () => columns.value.filter(column => column.visible).map(column => column.dataIndex),
          set: keys => {
            const keyRecord = Object.fromEntries(keys.map(key => [key, key]));
            columns.value.forEach(column => {
              if (!column.disabled) {
                column.visible = !!keyRecord[column.dataIndex];
              }
            });
          },
        });
        return (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ marginBottom: '12px' }}>
              <Grid.Row gutter={8}>
                <Grid.Col flex="1">
                  {changed.value && <Tag color="blue">自定义布局</Tag>}
                </Grid.Col>
                <Grid.Col flex="initial">
                  <Link disabled={!changed.value} onClick={resetHandle}>重置布局</Link>
                </Grid.Col>
              </Grid.Row>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Table
                size="small"
                bordered={false}
                scroll={{ x: '100%', y: '100%' }}
                columns={[
                  { title: '表格列', dataIndex: 'title' },
                  { dataIndex: 'actions', width: 40, slotName: 'actions' },
                ]}
                data={columns.value}
                rowKey="dataIndex"
                pagination={false}
                rowSelection={{
                  type: 'checkbox',
                  showCheckedAll: true,
                  width: 24,
                }}
                v-model:selectedKeys={selectedKeys.value}
                draggable={{ type: 'handle', width: 32 }}
                onChange={newColumns => {
                  const _newColumns = newColumns as TableColumnInnerData[];
                  columns.value = [
                    ..._newColumns.filter(column => column.fixed === 'left'),
                    ..._newColumns.filter(column => column.fixed === undefined),
                    ..._newColumns.filter(column => column.fixed === 'right'),
                  ];
                }}
                v-slots={{
                  actions: ({ record }: { record: TableColumnData }) => {
                    switch (record.fixed) {
                      case 'left': return <IconToLeft />;
                      case 'right': return <IconToRight />;
                      default: return <span></span>;
                    }
                  },
                }}
              />
            </div>
          </div>
        );
      },
    });
  };
  // 初始化
  if (isRef(initialValue)) {
    watch(initialValue, mergeHandle, { immediate: true });
  } else {
    mergeHandle(initialValue);
  }
  // 更新设置
  watch(
    () => JSON.stringify(
      columns.value.map(({ dataIndex, visible, width }) => ({ dataIndex, visible, width })),
    ),
    debounce(() => {
      setting.value = columns.value
        .filter(({ dynamic }) => !dynamic)
        .map(({ dataIndex, visible, width, disabled }) => ({
          dataIndex,
          visible: disabled ? true : visible,
          width,
        }));
    }, 20),
  );
  return reactive({
    value: displayColumns,
    resize: resizeHandle,
    showSetting: showSettingHandle,
  });
}

/** 表格列数据 */
export interface TableColumnData extends ArcoTableColumnData {
  /** 数据索引 */
  dataIndex: string;
  /** 可见的 */
  visible?: boolean | 'always' | 'dynamic';
}

/** 表格列内部数据 */
interface TableColumnInnerData extends TableColumnData {
  /** 可见的 */
  visible: boolean;
  /** 禁用 */
  disabled: boolean;
  /** 动态的 */
  dynamic: boolean;
}

/** 表格列设置数据 */
interface TableColumnSettingData {
  /** 数据索引 */
  dataIndex: string;
  /** 可见的 */
  visible?: boolean;
  /** 宽度 */
  width?: number;
}