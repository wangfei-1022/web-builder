<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <el-menu-item :index="item.name" :class="{'submenu-title-noDropdown':!isNest}">
        <span class="item-menu-title">
          <el-tooltip class="item" effect="light" :visible-arrow="false" :open-delay="600" :content="onlyOneChild.title" placement="right-end" :offset="-35">
            <span @click="redirectTo(onlyOneChild)">{{ onlyOneChild.title }}</span>
          </el-tooltip>
          <i class="iconfont icon-trash2" @click="removeFavorite(onlyOneChild)" />
        </span>
      </el-menu-item>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.name" popper-append-to-body>
      <template slot="title">
        <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" /> -->
        <span class="item-menu-title">
          <i :class="['iconfont', item.meta.icon]" />
          <span>{{ item.title }}</span>
        </span>
      </template>
      <sidebar-item
        v-for="(child,index) in item.children"
        :key="index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import { resolve } from '@/utils/pathBrowserify'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return resolve(this.basePath, routePath)
    },
    redirectTo(routeObj) {
      this.$router.push({name: routeObj.name})
    },
    removeFavorite(menuObj) {
      menuObj.favorite = true
      this.$store.dispatch('permission/favourMenu', menuObj).then(res => {
        this.$notify({
          title: '',
          message: this.$t('common.navbar.setFavoriteSuccess'),
          duration: 1000,
          type: 'success',
          position: 'top-right'
        })
      }).catch(() => {
        this.$notify({
          title: '',
          message: this.$t('common.navbar.setFavoriteFailed'),
          duration: 1000,
          type: 'error',
          position: 'top-right'
        })
      })
    },
    generateTitle
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.nest-menu {
  .item-menu-title {
    i {
      display: none;
    }
  }
}
.el-menu-item{
  &:hover{
    .item-menu-title{
      i{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.item-menu-title {
  span{
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100px;
  }
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
    color: rgb(191, 203, 217);
  }
}
</style>
