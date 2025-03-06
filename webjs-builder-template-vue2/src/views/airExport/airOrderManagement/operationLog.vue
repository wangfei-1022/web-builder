<template>
  <div>
    <el-table :data="rowData" height="590" style="width: 100%;" :border="true" size="mini">
      <el-table-column prop="operationTypeDesc" :label="this.$t('air.action')" min-width="8">
      </el-table-column>
      <el-table-column prop="createTime" :label="this.$t('air.operationTime')" min-width="13">
      </el-table-column>
      <el-table-column prop="createByName" :label="this.$t('air.operator')" min-width="8">
      </el-table-column>
      <el-table-column prop="operationContext" :label="this.$t('air.modifyContent')">
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
  </div>
</template>

<script>
import { getAirOrderOperationRecordPages } from '@/api/airExport'
import _URL from '@/api/urlTranslator'
import { getToken } from '@/utils/auth'
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: 'OperationLog',
  props: {
    order: { type: Object, default: () => { } },
    tabPane: {
      type: String,
      default () {
        return ""
      }
    }
  },
  data () {
    const defaultFilter = {
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      defaultFilter: defaultFilter,
      columnDefs: null,
      rowData: [],
      filter: this.$extends({}, defaultFilter),
      total: 0
    }
  },
  computed: {

  },
  watch: {
    tabPane (newV) {
      if (newV === "orderOperationLog") {
        this.list()
      }
    }
  },
  methods: {
    async list () {

      this.filter.orderId = this.order.id
      const res = await getAirOrderOperationRecordPages(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')

          } catch (e) {
            console.log(e)
          }
        })

        this.rowData = res.content.list
        this.total = Number(res.content.total)
      } else {
        this.rowData = []
        this.total = 0
      }
    }
  }
}
</script>
