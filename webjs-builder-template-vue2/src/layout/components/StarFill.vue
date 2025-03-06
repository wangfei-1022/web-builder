<template>
  <span :class="['iconfont icon-star1', {'collected': menuItem.favorite === true}]" @click.stop="checkFavorite"></span>
</template>
<script>
  export default {
    props: {
      menuItem: {
        type: Object,
        default: () => ({
            name: '',
            id: '',
            favorite: false
          })
      }
    },
    data() {
      return {}
    },
    computed: {},
    methods: {
      checkFavorite() {
        this.$store.dispatch('permission/favourMenu', this.menuItem).then(res => {
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .icon-star1{
    color: #ccc;
    font-size: 13px;
    &:hover{
      color: rgb(247, 186, 42);
    }
    &.collected{
      color: rgb(247, 186, 42);
    }
  }
</style>
