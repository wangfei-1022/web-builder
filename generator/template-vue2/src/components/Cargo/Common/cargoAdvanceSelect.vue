<!--高级Select组件=。。尽可能适应多数场景-灵活的-->
<template>
  <el-select
    ref="advanceSelectRef"
    v-model="value"
    class="cargo-advance-select"
    :style="{position:'relative'}"
    :remote-method="remoteMethod"
    :loading="loading"
    :remote="remote"
    :filter-method="localFilterMethod"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :collapse-tags="multiple"
    :allow-create="allowCreate"
    :filterable="remote?(1===1):filterable"
    size="mini"
    reserve-keyword
    :disabled="disabled"
    @keydown.native.enter.prevent="onEnter"
    @focus="toChooseFirstOption"
    @blur="onBlur"
    @change="toNotify()"
    @clear="toClear"
  >
    <div v-if="options.length>0&&(remote||filterable) && optionsTips" value="00000000" :disabled="1===1" class="tip-count-options w-full" :style="{'padding-top':'10px','padding-left':'18px','font-size':'14px',color:'#C0C4CC',height:'36px',position:'absolute',top:'0px',background: '#fcfcfc','z-index': '1000' }">{{$t('common.showHundredData')}}</div>
    <div v-if="options.length>0&&(remote||filterable) && optionsTips" value="00000001" class="w-full" style="font-size:14px;height:34px;color:#C0C4CC">{{$t('common.percentText')}}</div>
    <el-option
      v-for="(item,index) in options"
      :key="item[tagValue]+''+index"
      :style="{position:((remote||filterable)&&headers&&options.length>1&&index===0?'absolute':''),top:((remote||filterable)&&headers&&options.length>1&&index===0?'30px':''),background: (headers&&index===0?'#fcfcfc':''),'z-index':(headers&&index===0?'1000':''),'margin-top':((remote||filterable)&&headers&&index===1?'25px':'')}"
      :disabled="headers&&index===0"
      :label="item[tagName]"
      :value="item[tagValue]"
      class="w-full"
    >
      <slot :option="{item:item,fields:fields}">
        <div :style="{'display': 'flex','justify-content': 'space-between',width:optionsWidth}">
          <div v-for="(field) in fields" :key="field" :title="(item[field] || item[tagName])&&(item[field] || item[tagName]).length>10?(item[field] || item[tagName]):''" :style="{width:optionsColumnWidth,overflow: 'hidden','text-overflow':'ellipsis','white-space': 'nowrap'}">{{ fields.length>1?(item[field]+' ' || item[tagName]):(item[tagName]) }}</div>
        </div>
      </slot>
    </el-option>
  </el-select>
</template>

<script>

import request from '@/utils/request'
import qs from 'qs'
import lodash from 'lodash'

let lastTriggeredAt // 用户远程搜索（记录最后一次触发时间）
export default {
  name: 'CargoAdvanceSelect',
  props: {
    disabled: { type: Boolean, default: false }, // 不可编辑
    allowFetch: { type: Boolean, default: true }, // 是否让该组件去调取接口
    optionsWidth: { type: String, default: '400px' }, // options下拉框宽度
    optionsColumnWidth: { type: String, default: '100%' }, // options下拉框没一行列的宽度
    remote: { type: Boolean, default: false }, // （是否为远程搜索组件）
    clearable: { type: Boolean, default: true }, // （是否有清空按钮操作）
    allowCreate: { type: Boolean, default: false }, // （是否允许创建新条目进行选择）-- 未测试通过 .如果为true，则filterable 也要为true
    filterable: { type: Boolean, default: false }, // （是否允许过滤）-- 未测试通过 todo
    filterTagNames: { type: Array, default: () => [] }, // 参与非远程搜索时 过滤的 字段名称 （如果长度为0，默认根据tagName过滤）
    multiple: { type: Boolean, default: false }, // （是否多选）
    placeholder: { type: String, default: '请输入关键词' },
    wait: { type: Number, default: 200 }, // 远程搜索间隔时间
    tagName: { type: String, default: 'chineseName' }, // 要取来显示到select框内的字段名
    tagValue: { type: String, default: 'id' }, // select的value对应的字段，默认id
    url: { type: String, default: '' }, // 请求数据的url（会优先 根据url去远端获取数据）
    defaultValue: { type: [String, Number], default: '' }, // 默认值(multiple的话，defaultMultipleValue 一定要传值)-与defaultMultipleValue互斥(remote或者单选使用这个defaultValue默认值)
    defaultMultipleValue: { type: Array, default: () => [] }, // 默认值(multiple的话，defaultMultipleValue 一定要传值)
    remoteDefaultObj: { type: [Object, Array], default: null }, // 远程默认实体（远程组件在编辑后，再次访问是有默认值的）
    fixedOptions: { type: Array, default: null }, // 固定的select的option
    callbackParams: { type: Object, default: null }, // 回传参数，即把父组件传递的参数原样传回（场景：table编辑rowIndex）或者一个页面需使用多个本组件
    callbackMethod: { type: String, default: 'parentCallBack' }, // 回调的方法名
    callbackMethodType: { type: String, default: 'obj' }, // 回调的方法(传给父组件监听事件值的类型)
    method: { type: Function, default: null }, // 请求数据的方法  注意：url优先级高
    methodParams: { type: Object, default: () => ({}) }, // url或者method请求数据的方法参数
    headers: { type: Array, default: null }, // eg:[] 数组-options的头
    fields: { type: Array, default: () => ['chineseName'] }, // 下拉列表要展示的字段-options中要显示的实体的属性字段名
    optionsTips: { type: Boolean, default: true } // 是否显示options 头部提示文字
  },
  data() {
    return {
      oldOptions: [], // 为本地加载的数据保留一份副本
      options: [],
      value: '',
      loading: false
    }
  },
  computed: {
    firstHeader() {
      // 用来动态生成options的头
      // console.log('---------firstHeader===', this.headers)
      // console.log('---------this.fields===', this.fields)
      const fields = this.fields
      let firstHeader = null
      if (this.headers) {
        firstHeader = {}
        lodash.forEach(this.headers, (item, index) => {
          firstHeader[fields[index]] = item
        })
        // firstHeader[this.tagValue]一定要有值，否则在options循环时 会吃内存（element内部的问题，暂时没搞清楚）
        firstHeader[this.tagValue] = firstHeader[this.tagValue] || new Date() + ''
      }
      return firstHeader
    },
    emptyItem() {
      const emptyItem = {}
      emptyItem[this.tagValue] = this.multiple ? [] : ''
      lodash.forEach(this.fields, (item, index) => {
        emptyItem[item] = ''
      })
      return emptyItem
    }
  },
  watch: {
    defaultValue(data) {
      // if (!this.options || this.options.length <= 0) {
      // 为了设置默认值-默认项
      // this.initComponent() // 如需解决 远程默认第一项的问题，可注释该行代码-未测试
      // 1、如果执行会出现问题（1、像用户组件，返回的value，
      // 但是该方法实现中 需要去拼 remoteDefaultObj《里面没chineseName>的options,就会有问题<options里显示id而不是名称>。
      // callbackMethodType为obj的，remoteDefaultObj包含的比较多（有chineseName等）
      // 非远程搜索不涉及 remoteDefaultObj，所以没关系，也可以执行 initComponent（非远程搜索执行此initComponent，还可以解决toClear-》options=[]后的重新赋值问题）
      // 2、如果 注释这一句，像编辑进入的页面，如:结算单位的 远程默认<remoteDefaultObj>值赋不上去。所以下边根据情况判断）
      if (!this.remote || this.callbackMethodType === 'obj') {
        this.initComponent()
      }

      // 默认值发生变化，需要 fetchData(data)--注意：-data 是value不是label
      // }
    }
  },
  mounted() {
    if (this.remote) {
      // 远程的 都过滤
      // this.filterable = true
    }
    // if (!this.remote) {
    this.initComponent()
    // }
  },
  methods: {
    localFilterMethod(keyword) { // 非远程搜索数据的过滤方式
      let filters = [...this.oldOptions].filter((item, index) => {
        if (index === 0) {
          if (this.headers && this.headers.length > 0) {
            // 保持 options的title
            return true
          } else {
            return false
          }
        } else {
          if (this.filterTagNames.length <= 0) {
            return item[this.tagName].toLowerCase().indexOf(keyword.toLowerCase()) > -1
          } else {
            return this.filterTagNames.some(key => item[key].toLowerCase().indexOf(keyword.toLowerCase()) > -1)
          }
        }
      })
      if (this.headers && this.headers.length > 0 && filters.length <= 1) {
        // 说明filters中仅有的一条数据时 options的title。相当于没真实数据
        filters = []
      }
      this.options = filters
    },
    remoteMethod(keyword) {
      // keyword.trim()后为空，就不会进入这个方法
      lastTriggeredAt = new Date().getTime()
      setTimeout(() => {
        const now = new Date().getTime()
        if (now - this.wait >= lastTriggeredAt) { // 严格来说，应该用===
          // this.loading = true （设置为true，远程加载数据有延迟，那么 将this.loading 置位 false也有延时。这些因素会导致 下拉列表抖动）
          if (this.allowFetch) {
            this.fetchData(keyword).then(result => {
              if (result === 'success') { // 远程搜索默认选择 第一项
                this.toChooseFirstOption()
              }
            })
          } else {
            this.loading = false
          }
        } // 这个if判断用于：在this.wait长度的时间内，如果再次输入触发了setOptions，则会令“上一次”搜索不执行(因为本次改写了lastTriggeredAt的值)
      }, this.wait)
    },
    clearData() {
      this.options = []
    },
    fillData(defaultOptions) { // 填充数据
      this.options = [...defaultOptions]
    },
    fetchData(keyword, forceSearchAll) { // Boolean forceSearchAll 强制查询（该值为true，则说明强制走toQuery）
      // this.methodParams.keyword = keyword
      if (!forceSearchAll && !keyword) { // 如果keyword没有输入东西 ,todo
        this.value = ''
        this.toClear()
        this.loading = false
        return Promise.resolve('success')
      }
      return this.toQuery(keyword).then(res => {
        if (res.ok) {
          if (res.content && res.content.length > 0 || res.content && res.content.list && res.content.list.length > 0) {

            res.content.list
            const list = res.content.list ? [...res.content.list] : [...res.content]
            list.map(val => {
              if (val.cityDesc) {
                const cityDesc = JSON.parse(val.cityDesc)
                val.portEnNameCountryEnName = `${cityDesc.portEnName},${cityDesc.countryEnName}`
              }
            })
            this.options = list // res.content.list ? [...res.content.list] : [...res.content]
            // 固定options
            if (this.fixedOptions) {
              this.options.unshift(...this.fixedOptions)
            }
            this.$emit('childOptions', this.options)
          } else {
            this.options = []
          }
          if (this.options.length > 0) {
            // 默认选中第一行
            // if (!this.remote) {
            //   // 先不考虑 远程搜索 默认赋值的情况 todo
            //   this.value = this.options[0][this.tagValue]
            //   this.toNotify(this.options[0])
            // }

            if (this.headers && this.firstHeader) {
              this.options.unshift(this.firstHeader)
            }
            // 赋值 oldOptions(为本地加载的数据保留一份副本，用于本地查询使用、远程查询无参考价值)
            this.oldOptions = [...this.options]
          } else {
            if (!this.remote) { // 没找到数据记录且非远程加载
              // 先不考虑 远程搜索 默认赋值的情况 todo
              this.value = ''
              this.toClear()
            }
          }
          this.loading = false
        } else {
          this.loading = false
          return Promise.reject(res.message)
        }
      }).then(() =>
        // todo
         Promise.resolve('success')
      ).catch(err => {
        this.loading = false
        this.$message.error(err)
        return Promise.reject(err)
      })
    },
    toQuery(keyword) {
      const params = { ...this.methodParams }
      if (lodash.isObject(keyword)) {
        // 对象
        Object.assign(params, keyword) // 如果是对象，就和之前的查询参数进行合并
      } else {
        // 关键字是字符串
        if (keyword && keyword.trim()) {
          // 输入的不是空格
          params.keyword = keyword
        } else {
          // 查全部
          keyword = keyword ? keyword.trim() : keyword // 去除前后空格
        }
      }
      if (this.url) {
        // 优先根据URL查询
        return request(this.getURLRequestParams(params))
      } else {
        // 其次根据method方法查询
        return this.method(params)
      }
    },
    initComponent() {
      this.value = this.multiple ? this.defaultMultipleValue || [] : this.defaultValue
      if (this.remote) {
        if (this.remoteDefaultObj) {
          if (this.remoteDefaultObj.length) {
            // remoteDefaultObj 是数组
            if (this.remoteDefaultObj[0][this.tagValue]) {
              // 远程组件设置默认值
              this.options = [...this.remoteDefaultObj]
              if (this.firstHeader) {
                this.options.unshift(this.firstHeader)
              }
            }
          } else {
            // remoteDefaultObj 是对象
            if (this.remoteDefaultObj[this.tagValue]) {
              // 远程组件设置默认值
              this.options = [{ ...this.remoteDefaultObj }]
              if (this.firstHeader) {
                this.options.unshift(this.firstHeader)
              }
            }
          }
        }
      } else {
        if (!this.options || this.options.length <= 0) {
          if (this.allowFetch) {
            this.fetchData('', true)
          } else {
            // todo
          }
        }
      }
    },
    toClear() {
      // 注意：非远程加载不允许清空，因为清空后，options没东西了 todo
      this.options = []
      this.toNotify(this.emptyItem)
    },
    toNotify(item1) {
      if ((!this.value || this.value.length <= 0) && !this.remote && this.filterable) {
        // 针对 非远程、可过滤的本地 数据进行处理
        this.options = [...this.oldOptions]
      }
      let result
      const selectedItem = item1 || this.options.find(item => item[this.tagValue] === this.value) || this.emptyItem

      // 处理多选（因为多选的情况，也不会再options里找到匹配的）
      if (this.multiple) {
        selectedItem[this.tagValue] = this.value
      }
      // 处理允许创建（因为allowCreate=true的情况，也不会再options里找到匹配的）
      if (this.allowCreate) {
        selectedItem[this.tagValue] = this.value
      }

      if (this.callbackMethodType === 'value') {
        result = { 'value': selectedItem[this.tagValue] }
      } else if (this.callbackMethodType === 'label') {
        result = { 'label': selectedItem[this.tagName] }
      } else {
        result = { ...selectedItem, value: selectedItem[this.tagValue] }
      }
      // 进一步精简传输数据
      if (this.callbackParams) {
        this.$emit(this.callbackMethod, { ...result, ...this.callbackParams })
      } else {
        if (this.callbackMethodType === 'obj') {
          this.$emit(this.callbackMethod, result)
        } else {
          this.$emit(this.callbackMethod, result.value || result.label)
        }
      }
    },
    getURLRequestParams(params) {
      return {
        url: this.url,
        method: 'get',
        params: params,
        paramsSerializer: params => qs.stringify({ ...params }, { arrayFormat: 'repeat' })
        // 因为是get请求，对数组类型的查询参数做下处理，使成'?range=SALES&range=OPERATORS'这样的形式
      }
    },
    onEnter() {
      this.$emit('enter')
    },
    toChooseFirstOption() { // 默认选中第一项，未完善，待测试

      /* if (!this.$refs.advanceSelectRef.visible) {
        this.visible = true
      }
      const self = this
      this.$nextTick(() => {
        setTimeout(() => {
          if (self.$refs.advanceSelectRef.hoverIndex > -1) {
            // todo
          } else {
            self.$refs.advanceSelectRef.navigateOptions('next')
          }
        }, 300)
      })*/
    },
    onBlur() {
      this.$emit('blur')
    }
  }

}

</script>
<style lang="scss" scoped>
  .cargo-advance-select .fixed-options{
    position:absolute !important;
    top:60px !important;
    background: #f0f0f0 !important;
    z-index: 1000 !important;
  }
  .cargo-advance-select .normal-first-options{
    margin-top:60px;
  }
  .el-select-dropdown__list{ min-width: 280px}
</style>
