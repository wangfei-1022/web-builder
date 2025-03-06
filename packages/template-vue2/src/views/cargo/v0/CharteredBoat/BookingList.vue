<template>
  <div
    style="padding: 10px;"
    class="app-main-inner"
  >
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :column-defs="columnDefs"
      :row-data="rowData"
      :enable-col-resize="true"
      :enable-sorting="true"
      :animate-rows="true"
      :grid-ready="onReady"
      :first-data-rendered="onFirstDataRendered"
      :pinned-bottom-row-data="pinnedBottomRowData"
      :style="listGridStyle"
      class="ag-theme-balham"
    />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'BlList',
  components: {},
  data() {
    return {
      gridOptions: null,
      columnDefs: null,
      rowData: [],
      isShowingMoreSearchCondition: false
    }
  },
  computed: {
    dynamicHeightFactor() { // 用于动态计算列表高度
      const least = 195
      return least
    },
    listGridStyle() {
      const s = {
        width: '100%',
        height: `calc(100vh - ${this.dynamicHeightFactor}px)`
      }
      return s
    },
    pinnedBottomRowData() {
      return [{ jobNo: '总记录数：' + this.rowData.length }]
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    this.gridOptions = {
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }
  },
  methods: {
    onReady(params) {
      const self = this
      window.addEventListener('resize', function() {
        setTimeout(function() {
          self.onFirstDataRendered()
        })
      })
    },
    onFirstDataRendered() {
      const self = this
      const allColumnIds = []
      this.gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId)
      })
      setTimeout(function() {
        self.gridOptions.columnApi.autoSizeColumns(allColumnIds)
      })
    },
    handleIsShowingMoreSearchConditionToggle(isShowingMoreSearchCondition) {
      this.isShowingMoreSearchCondition = isShowingMoreSearchCondition
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    },
    resetHeight() {
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
