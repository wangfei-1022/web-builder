<template>
  <div :class="['page-search search-wrap', { 'slider-down': multipleForm }]" :style='{height: pageSearchHeight}' v-show="visible">
    <div v-show="showSingle" class="search-box-wrap page-search-form">
      <slot name="singleSearch"></slot>
    </div>
    <div v-show="multipleForm" class="search-box-wrap page-search-form">
      <slot name="multipleSearch"></slot>
    </div>
    <slot name="searchBtn">
      <div class="search-btn-wrap">
        <div></div>
        <div class="page-search-button">
          <el-button
            type="primary"
            @click="exportFn"
            size="mini"
            v-if="showExportBtn">
            {{$t('common.exportBtn')}}
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
            size="mini">
            {{$t('common.searchBtn')}}
          </el-button>
          <el-button @click="reset" icon="el-icon-refresh-left" size="mini">{{$t('common.resetBtn')}}</el-button>
        </div>
      </div>
    </slot>
    <div class="slider-pointer" v-if="advanceFilter">
      <span
        class="single-toolbar"
        @click="switchFilterMode"
        v-if="showSingle"
      >
        <i class="el-icon-arrow-down"></i>
      </span>
      <span
        class="advance-toolbar"
        @click="switchFilterMode"
        v-if="multipleForm"
      >
        <i class="el-icon-arrow-up"></i>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TopSearchItemsSlot',
  props: {
    searchFun: Function,
    resetFun: Function,
    exportFn: {
      type: Function,
      default: null
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showSingle: true,
      pageSearchHeight: 'auto', // 设置要展示的高度
      demoForm: {
        vesselName: '',
        voyageNo: ''
      },
      closure: null
    }
  },
  computed: {
    multipleForm() {
      return !this.showSingle
    },
    advanceFilter() {
      return this.$slots.singleSearch && this.$slots.multipleSearch
    },
    showExportBtn() {
      return typeof this.exportFn === 'function'
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          console.log(val)
          this.triggerResize()
        }
      }
    }
  },
  methods: {
    // closure() {
    /*
    * addEventListener、removeEventListener
    * 第二个参数为函数对象
    * 需要使用 this.fn 而非 this.fn()
    * 否则 removeEventListener 无法正确解绑对应的方法
    * 将throttle的匿名闭包绑定到本地变量作为函数对象
    * 传递给 eventListener 作为第二个参数
    */
    // this.closure = this.throttle(this.triggerResize, 100, 200)()
    // },
    /**
     *搜索
     */
    search() {
      if (this.$isNotEmpty(this.searchFun)) {
        this.searchFun()
      }
    },
    reset() {
      if (this.$isNotEmpty(this.resetFun)) {
        this.resetFun()
      }
    },
    switchFilterMode() {
      this.showSingle = !this.showSingle
      this.$emit('input', this.showSingle)
      this.triggerResize() // 切换模式后重新计算高度
    },
    /**
    * 计算底部按钮位置
    * 发生遮挡时换行
    */
    calcPosition() {
      let thisEl = this.$el
      let btn = thisEl.querySelector('.page-search-button')
      let btnXy = this.getXY(btn)
      // 找到当前显示的 .page-search-form
      let formItemList = thisEl.querySelector('.page-search-form:not([style*="display: none;"])').getElementsByClassName('el-form-item')
      let lastItem = formItemList[formItemList.length - 1]
      let lastItemWidth = lastItem.offsetWidth
      let lastItemHeight = lastItem.offsetHeight
      let lastXy = this.getXY(lastItem)
      let lastItemPosition = {
        x: lastXy.x + lastItemWidth,
        y: lastXy.y + lastItemHeight
      }

      let pageFormHeight = thisEl.offsetHeight
      // 交叉了则换行
      if (btnXy.x < lastItemPosition.x) {
        this.pageSearchHeight = pageFormHeight + 40 + 'px'
        this.$parent.resetHeight(pageFormHeight + 40)
      } else {
        this.$parent.resetHeight(pageFormHeight)
      }
      console.log('pageFormHeight,', pageFormHeight)
      // 高度更新后，重新计算列表高度
      if (this.$attrs.switchToggler) {
        this.$nextTick(() => {
          this.$attrs.switchToggler()
        })
      }
    },
    getXY(obj) {
      let x = 0; let y = 0;
      if (obj.getBoundingClientRect) {
        let box = obj.getBoundingClientRect();
        let D = document.documentElement;
        x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
        y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop
      } else {
        // eslint-disable-next-line no-empty
        for (; obj !== document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) { }
      }

      return {
        x: x,
        y: y
      }
    },
    triggerResize() {
      this.pageSearchHeight = 'auto'
      this.$nextTick(() => {
        this.calcPosition()
      })
    }
  },
  created() {
    this.showSingle = !!this.$slots.singleSearch
  },
  /*
  * 对于非 page cache 的页面
  * 在 mounted 和 beforeDestroy中处理
  */
  mounted() {
    this.triggerResize()
    this.closure = this.throttle(this.triggerResize, 100, 200)
    window.addEventListener('resize', this.closure, false)
  },
  beforeDestroy() {
    // 非cache的page 销毁时取消resize监听
    window.removeEventListener('resize', this.closure, false)
  },
  /*
  * 对于 page cache 的页面
  * 在activated 和 deactivated中处理
  */
  activated() {
    // 激活控件时重新注册resize事件
    window.addEventListener('resize', this.closure, false)
  },
  deactivated() {
    // 控件不激活时取消resize监听
    window.removeEventListener('resize', this.closure, false)
  }
}
</script>
<style lang="scss" scoped>
.search-box-wrap {
  ::v-deep .el-form-item {
    margin-bottom: 12px !important;
  }
  ::v-deep .el-form-item--medium {
    .el-form-item__label,
    .el-form-item__content {
      line-height: 28px;
    }
  }
}

.search-wrap {
  position: relative;
  width: 100%;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.05);
  padding: 12px 12px 0 12px;
  background: #fff;
  &.slider-down {
    height: auto;
  }
  .search-box-wrap {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .slider-pointer {
    position: absolute;
    text-align: center;
    right: 0;
    top: 0;
    height: 100%;
    padding: 0 5px;
    border-left: 1px solid #f4f4f4;
    font-size: 12px;
    color: #909399;
    overflow: hidden;
    &:hover {
      color: #409eff;
    }
    span {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 100%;
      cursor: pointer;
    }
  }
  .search-btn-wrap {
    position: absolute;
    right: 35px;
    bottom: 12px;
  }
}
</style>
