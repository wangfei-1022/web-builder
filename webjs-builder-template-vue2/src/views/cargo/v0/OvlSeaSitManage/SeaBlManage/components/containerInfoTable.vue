<template>
  <div>
    <el-table :data="dataList" size="mini" height="250" border stripe v-loading="loading">
      <el-table-column :label="$t('seaBl.indexNo')" width="60">
        <template slot-scope="{$index}">
          {{$index+1}}
        </template>
      </el-table-column>
      <el-table-column width="140" :label="$t('seaBl.ctnNo')" prop="ctnNo" />
      <el-table-column width="140">
        <template slot="header">
          <span class="fc-red">*</span><span>{{$t('seaBl.ctnType')}}</span>
        </template>
        <template slot-scope="{row}">
          <el-select size="mini" v-model="row.ctnType" :placeholder="$t('seaBl.ctnType')" v-if="row.isEdit">
            <el-option v-for="item in containerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input size="mini" v-model="row.ctnType" :placeholder="$t('seaBl.ctnType')" v-if="row.isEdit" ></el-input> -->
          <span v-else>{{row.ctnType}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140">
        <template slot="header">
          <span>{{$t('seaBl.freePeriod')}}</span>
        </template>
        <template slot-scope="{row}">
          <el-input size="mini" v-model="row.freeStorageDay" :placeholder="$t('seaBl.freePeriod')" v-if="row.isEdit" ></el-input>
          <span v-else>{{row.freeStorageDay}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140">
        <template slot="header">
          <span>{{$t('seaBl.usingBox')}}</span>
        </template>
        <template slot-scope="{row}">
          <el-input size="mini" v-model="row.freeBoxDay" :placeholder="$t('seaBl.usingBox')" v-if="row.isEdit" ></el-input>
          <span v-else>{{row.freeBoxDay}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('seaBl.skuName')" prop="skuName" min-width="100" />
      <el-table-column :label="$t('seaBl.totalTray')" width="120" prop="trayNum" />
      <el-table-column label="SKU" min-width="140" prop="skuCode" />
      <el-table-column :label="$t('seaBl.totalSku')" width="70" prop="skuNum" />
      <el-table-column :label=" $t('seaBl.totalWatt')" width="70" prop="wattNum" />
      <el-table-column :label="$t('seaBl.nw')+'（KG）'" width="120" prop="nw" align="center" />
      <el-table-column :label="$t('seaBl.gw')+'（KG）'" width="120" prop="gw" align="center" />
      <el-table-column :label="$t('seaBl.importValue')" width="100" prop="importValue" />
      <el-table-column :label="$t('common.operation')" fixed="right" width="160" align="left" v-if="!isDetail">
        <template slot-scope="{row}">
          <div v-if="row.isEdit">
            <span class="fc-blue pointer" @click="saveItem(row)">{{$t('common.saveBtn')}}</span>
            <span class="fc-red ml-10 pointer" @click="calcelItem(row)">{{$t('common.cancelBtn')}}</span>
          </div>
          <div v-if="!row.isEdit && !isEdit">
            <span class="ml-10 pointer fc-blue" @click="editItem(row)">{{$t('common.editBtn')}}</span>
            <span class="ml-10 pointer fc-blue" @click="syncContainerType(row)">{{$t('seaBl.syncContainerType')}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
  </div>
</template>

<script>
import { getCtnByBlIdApi, saveCtnTypeApi, batchUpdateContainerTypeListApi } from '@/api/OvlSeaSitManage/seaBl'
import { getContainerTypeListApi } from '@/api/containerManager'
export default {
  name: 'ContainerInfoTable',
  props: {
    blId: String,
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataList: [],
      containerTypeList: [],
      isEdit: false,
      loading: false,
      total: 0,
      filter: {
        pageSize: 50,
        pageNum: 1
      }
    };
  },
  created() {
    this.list()
    this.getContainerTypeList()
  },
  mounted() {

  },
  methods: {
    // 获取商品列表
    async list() {
      if (this.$isEmpty(this.blId)) {
        return
      }
      this.loading = true
      let res = await getCtnByBlIdApi({ blId: this.blId, ...this.filter })
      if (res.ok) {
        this.dataList = res.content.list || []
        this.total = res.content.total
        this.loading = false
      } else {
        this.loading = false
      }
    },
    // 获取箱型下拉
    async getContainerTypeList() {
      const res = await getContainerTypeListApi()
      if (res.ok) {
        this.containerTypeList = res.content.map(item => {
          let _data = {
            label: item.englishName,
            value: item.englishName
          }
          return _data
        })
      }
    },
    // 编辑
    editItem(row) {
      this.$set(row, 'isEdit', true)
      this.isEdit = true
    },
    // 取消编辑 新增删除 编辑回滚编辑前数据
    calcelItem(row) {
      this.list()
      this.isEdit = false
    },
    // 保存数据
    saveItem(row) {
      if (this.$isEmpty(row.ctnType)) {
        this.$message.error(this.$t('seaBl.please_input_ctnType'))
        return
      }
      let data = {
        id: row.ctnId,
        ctnType: row.ctnType,
        freeBoxDay: row.freeBoxDay,
        freeStorageDay: row.freeStorageDay
      }
      this.loading = true
      saveCtnTypeApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('common.saveSuccess'))
          this.isEdit = false
          this.list()
        } else {
          this.loading = false
        }
      })
    },
    // 批量更新箱型
    async syncContainerType(_obj) {
      this.loading = true
      const res = await batchUpdateContainerTypeListApi(this.blId, {ctnType: _obj.ctnType})
      if (res.ok) {
        this.$message.success(this.$t('seaBl.batchUpdateContainerTypeSuccess'))
        this.list()
      }
      this.loading = false
    }
  }
};
</script>

<style scoped lang="less">
</style>
