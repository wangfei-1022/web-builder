<template>
  <div class="fourth-menu-wrap" :style="wrapWidth">
    <div class="menu-item" v-for="item in menuList" v-if="!item.hidden" :key="item.code" @click="hideTopMenu">
      <app-link :title="item.title || item.meta.title" v-if="item.meta" :to="resolvePath(item.path)" class="clips-text">
        {{item.title || item.meta.title}}
      </app-link>
      <StarFill :menu-item="item" />
    </div>
  </div>
</template>
<script>
import { resolve } from '@/utils/pathBrowserify'
import { isExternal } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { generateTitle } from '@/utils/i18n'
import AppLink from './Sidebar/Link'
import StarFill from './StarFill'
export default {
  name: 'TheFourthMenu',
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  components: {
    AppLink,
    StarFill
  },
  data() {
    return {}
  },
  computed: {
    shownList() {
      return this.menuList.filter(item => !item.hidden)
    },
    wrapWidth: function() {
      let columns = 1
      columns = this.shownList.length % 12
      if (columns === 0) {
        columns = this.shownList.length / 12
      } else {
        columns = Math.ceil(this.shownList.length / 12)
      }
      return {width: `${columns * 200}px`}
    }
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return resolve(this.basePath, routePath)
    },
    hideTopMenu() {
      this.$emit('hideExtendImmediately')
    }
    // redirectTo(path) {
    //   this.$router.push({path: this.resolvePath(path)})
    // }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
  position: absolute;
  top: 0;
  right: 0;
  width:2px;
  height:2px;
  background-color:#f2f2f2;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track
{
  background-color:#f2f2f2;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  border-radius:2px;
  background-color:#ccc;
}
.fourth-menu-wrap{
  display: flex;
  // flex-flow: column nowrap;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  // align-content: flex-start;
  margin-top: 10px;
  height: calc(100% - 38px);
  overflow: hidden;
  // overflow-y: auto;
  text-align: center;
  position: relative;
}
.menu-item{
  width: 160px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  color: #333;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
  &:hover{
    color: #36a3f7;
  }
  .clips-text {
    width: 146px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
  }
  a{
    width: 100%;
    flex-shrink: 2;
    text-align: left;
  }
}
</style>
