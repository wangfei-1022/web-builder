<template>
  <el-pagination
   @size-change="handleSizeChange"
   @current-change="handleCurrentChange"
   :current-page="currPage"
   :page-sizes="sizeSelector"
   :page-size="pageSize"
   :layout="layout"
   :total="total">
  </el-pagination>
</template>
<script>
  export default {
    name: 'ELPagination',
    props: {
      layout: {
        type: String,
        default: 'total, prev, pager, next, sizes, jumper'
      },
      page: {
        type: Number,
        default: 1
      },
      size: {
        type: Number,
        default: 20
      },
      sizeSelector: {
        type: Array,
        default: () => { return [20, 30, 50, 100] }
      },
      total: {
        type: Number,
        default: 0
      }
    },
    computed: {
      currPage: {
        get() {
          return this.page
        },
        set(val) {
          this.$emit('update:page', val)
        }
      },
      pageSize: {
        get() {
          return this.size
        },
        set(val) {
          this.$emit('update:size', val)
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('paginationTrigger', { page: this.currPage, size: val })
      },
      handleCurrentChange(val) {
        this.$emit('paginationTrigger', { page: val, size: this.pageSize })
      }
    }
  }
</script>
<style lang="scss" scoped>
  
</style>