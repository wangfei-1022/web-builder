<template>
  <div>
    <div class="flex-right mb-10" v-if="!isEdit && !isDetail">
      <el-button type="primary" size="mini" @click="add">{{$t('seaBl.addCtn')}}</el-button>
    </div>
    <el-table :data="dataList" ref="dataTable" size="mini" height="250" border stripe v-loading="loading">
      <el-table-column :label="$t('seaBl.indexNo')" width="60">
        <template slot-scope="{$index}">
          {{$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="SKU" min-width="140" prop="skuCode">
        <template slot-scope="{row}">
          <el-select v-if="row.isEdit" v-model="row.skuCode" filterable remote :placeholder="$t('common.selectPlaceholder')" size="mini" :remote-method="remoteSku" :loading="loading1" @change='skuSelected($event,row)'>
            <el-option
              v-for="item in options"
              :key="item.skuCode"
              :label="item.skuCode"
              :value="item.skuCode">
            </el-option>
          </el-select>
          <span v-else>{{row.skuCode}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('seaBl.quantity')" width="140" prop="skuNum">
        <template slot-scope="{row}">
          <el-input v-if="row.isEdit" v-model="row.skuNum" oninput="value=value.replace(/[^\d]{1,9}/g,'')" size="mini"></el-input>
          <span v-else>{{row.skuNum}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('seaBl.goodsValue')" width="140" prop="importValue">
        <template slot-scope="{row}">
          <el-input v-if="row.isEdit" v-model="row.importValue" oninput="value=value.replace(/^\D*(\d{1,9}(?:\.\d{0,3})?).*$/g,'$1')" size="mini"></el-input>
          <span v-else>{{row.importValue}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('seaBl.currency')" width="140" prop="currency">
        <template slot-scope="{row}">
          <el-select v-if="row.isEdit" v-model="row.currency" size="mini" @change="setCurrencyName(row, $event)">
            <el-option v-for="item in currencyList" :key="item.code" :label="item.chineseName" :value="item.code"></el-option>
          </el-select>
          <span v-else>{{row.currencyName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" fixed="right" width="200" align="left" v-if="!isDetail" prop="id">
        <template slot-scope="{row,$index}">
          <div v-if="row.isEdit">
            <el-button type="text" size="mini" @click="saveItem(row)">{{$t('common.saveBtn')}}</el-button>
            <el-button type="text" size="mini" class="fc-red" @click="cancel(row, $index)">{{$t('common.cancelBtn')}}</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="mini" @click="editItem(row)">{{$t('common.editBtn')}}</el-button>
            <el-button type="text" size="mini" class="fc-red" @click="delItem($index)">{{$t('common.deleteBtn')}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCurrencyList } from '@/api/currency'
import { getCustomsSKUApi } from '@/api/OvlSeaSitManage/seaBl'
import { deepCloneMethod } from '@/utils'
export default {
  name: 'TaxTable',
  props: {
    blId: String,
    customsId: String,
    skuList: Array,
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      loading1: false,
      originalRow: null,
      options: [],
      currencyList: []
    };
  },
  created() {},
  mounted() {
    this.getCurrencyList()
  },
  computed: {
    dataList: function() {
      let _list = this.skuList ? deepCloneMethod(this.skuList) : []
      _list.map(item => {
        item.isEdit = false
      })
      return _list
    }
  },
  methods: {
    // 去重SKU下拉数据
    async remoteSku(skuStr) {
      this.loading1 = true
      let queryData = {
        blId: this.blId,
        skuCode: skuStr.trim()
      }
      const res = await getCustomsSKUApi(queryData)
      if (res.ok) {
        this.loading1 = false
        this.options = res.content.filter(item => this.$isEmpty(this.dataList.find(row => row.skuCode === item.skuCode))) || []
      } else {
        this.loading1 = false
        this.options = []
      }
    },
    // 选择SKU
    skuSelected(val, _row) {
      let data = this.options.find(item => item.skuCode === val)
      _row.skuId = data.skuId
      _row.skuName = data.skuName
      _row.isEdit = true
    },
    // 币种下拉
    async getCurrencyList() {
      const res = await getCurrencyList()
      if (res.ok && res.content) {
        this.currencyList = res.content.list
      }
    },
    // 新增记录
    add() {
      let itemData = {
        isEdit: true,
        skuId: null,
        skuCode: '',
        skuName: '',
        skuNum: '',
        importValue: '',
        currency: '',
        currencyName: ''
      }
      this.dataList.push(itemData)
      this.isEdit = true
    },
    editItem(obj) {
      this.originalRow = deepCloneMethod(obj)
      obj.isEdit = true
      this.isEdit = true
    },
    setCurrencyName(row, currencyCode) {
      row.currencyName = this.currencyList.filter(item => item.code === currencyCode)[0].chineseName
    },
    delItem(index) {
      this.confirmTips().then(() => {
        this.dataList.splice(index, 1)
        this.$message.success(this.$t('common.deleteSuccess'))
      })
    },
    cancel(row, index) {
      // 新增时取消
      if (!row.skuCode) {
        this.dataList.splice(index, 1)
      } else { // 编辑时取消
        row.isEdit = false
        row = deepCloneMethod(this.originalRow)
        this.originalRow = null
      }
      this.isEdit = false
    },
    // 保存数据
    saveItem(row) {
      if (this.$isEmpty(row.skuCode)) {
        this.$message.error(this.$t('seaBl.please_input_skuCode'))
        return
      }
      this.isEdit = false
      row.isEdit = false
    },
    reRenderTable() {
      this.$nextTick(() => {
        this.$refs.dataTable.doLayout()
      })
    }
  }
};
</script>

<style scoped lang="less">
</style>
