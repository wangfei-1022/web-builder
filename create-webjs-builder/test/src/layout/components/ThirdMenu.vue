<template>
  <div class="third-menu-wrap">
    <template v-for="item in thirdMenu">
      <div v-if="item.shape == 'dir'" class="third-menu-box whole-column" :key="`menu-${item.id}`">
        <h3>{{item.title}}</h3>
        <FourthMenu :base-path="item.path" :menuList="item.children" v-on="$listeners" />
      </div>
      <div v-else class="third-menu-box whole-column" :key="`menu-${item.id}`">
        <p>
          <app-link :to="resolvePath(item.path)">
            {{item.title || item.meta.title}}
          </app-link>
          <StarFill :menu-item="item" />
        </p>
      </div>
      <!-- <div  class="third-menu-box row-item">
        <p @click="redirectTo(item)" v-if="item.shape == 'menu'">
          <span>{{item.title}}</span>
          <StarFill :menu-item="item" />
        </p>
        <p class="third-menu-box row-item" v-else>
          <span>{{item.title}}</span>
        </p>
      </div> -->
    </template>
  </div>
</template>
<script>
import { resolve } from '@/utils/pathBrowserify'
import { isExternal } from '@/utils/validate'
import { mapGetters } from 'vuex'
import AppLink from './Sidebar/Link'
import FourthMenu from './FourthMenu'
import StarFill from './StarFill'
export default {
  name: 'ThirdMenu',
  props: {
    thirdMenu: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AppLink,
    FourthMenu,
    StarFill
  },
  data() {
    return {}
  },
  computed: {

  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return resolve(this.basePath, routePath)
    },
    redirectTo(menuObj) {
      this.$router.push({name: menuObj.name})
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
@mixin flexColumnBox {
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
}
.third-menu-wrap{
  position: relative;
  padding: 20px 0;
  width: auto;
  height: 100%;
  cursor: default;
  @include flexColumnBox;
}
.third-menu-box{
  font-size: 14px;
  height: 100%;
  border-right: 1px dashed rgba(0, 0, 0, 0.2);
  // &:first-child{
  //   padding-left: 20px;
  // }
  &:last-child{
    border: none;
  }
  &.whole-column{
    height: 100%;
    width: auto;
    min-width: 201px;
  }
  &.row-item{
    width: auto;
    min-width: 180px;
    height: 28px;
    line-height: 28px;
    color: #333;
    border: 0 none;
    &:hover{
      color: #10457D;
    }
    p{
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 0 20px;
      cursor: pointer;
      text-align: center;
    }
  }
  h3{
    font-size: 14px;
    height: 28px;
    line-height: 28px;
    margin: 0;
    font-weight: normal;
    text-align: center;
    color: #10457D;
  }
}
</style>
