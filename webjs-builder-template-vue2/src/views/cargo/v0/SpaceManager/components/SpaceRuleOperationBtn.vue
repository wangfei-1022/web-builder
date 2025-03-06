<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      type="text"
      size="mini"
      class="right-margin-button"
      v-permission="['shipping:rule:edit']"
      v-show="params.data.policyStatus === 1"
      @click="editTask">
      {{$t('common.editBtn')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="right-margin-button"
      v-permission="['shipping:rule:del']"
      v-show="params.data.policyStatus === 1"
      @click="deleteTask">
      {{$t('common.deleteBtn')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="right-margin-button"
      v-permission="['shipping:rule:stop']"
      v-show="params.data.policyStatus === 2"
      @click="stopTask">
      <i class="el-icon-loading" v-show="stopLoading"></i>
      <span v-show="!stopLoading" style="margin-left: 0;">{{$t('common.stopBtn')}}</span>
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="right-margin-button"
      v-permission="['shipping:rule:copy']"
      v-show="params.data.policyStatus === 3"
      @click="copyTask">
      {{$t('common.copyBtn')}}
    </el-button>
    <!-- <el-button
      type="text"
      size="mini"
      class="right-margin-button"
      v-show="!params.data.owner && !params.data.focus"
      @click="handleFavorite">
      <template v-if="loading">
        <i class="el-icon-loading"></i>
      </template>
      <template v-else>
        关注
      </template>
    </el-button>
    <el-button
      type="text"
      size="mini"
      class="right-margin-button"
      v-show="!params.data.owner && params.data.focus"
      @click="handleCancelFavorite">
      <template v-if="loading">
        <i class="el-icon-loading"></i>
      </template>
      <template v-else>
        取消关注
      </template>
    </el-button> -->
  </div>
</template>
<script>
  import { deleteRulesApi, favoriteApi, cancelFavoriteApi, stopRulesApi } from '@/api/spaceManager'
  export default {
    name: 'SpaceRuleOperationBtn',
    data() {
      return {
        loading: false,
        stopLoading: false
      }
    },
    beforeMount() {},
    computed: {
      checkStar() {
        return this.params.data.focus ? 'el-icon-star-on favorite active-star' : 'el-icon-star-off favorite'
      }
    },
    methods: {
      deleteTask() {
        this.$confirm(this.$t('spaceRule.spaceRuleList.deletedWarningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.deleteBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(async () => {
          const res = await deleteRulesApi(this.params.data.id)
          if (res.ok) {
            this.$message({
              message: this.$t('spaceRule.spaceRuleList.deletedSuccess'),
              type: 'success'
            })
            this.params.refreshData()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      stopTask() {
        this.$confirm(this.$t('spaceRule.spaceRuleList.stopSubtaskWarning'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('spaceRule.spaceRuleList.stopBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(async () => {
          const res = await stopRulesApi(this.params.data.id)
          if (res.ok) {
            this.$message({
              message: this.$t('spaceRule.spaceRuleList.taskBroken'),
              type: 'success'
            })
            this.params.refreshData()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      editTask() {
        this.$router.push({name: 'SpaceRuleSetter', params: {id: this.params.data.id}, query: {options: 'edit'}})
      },
      copyTask() {
        this.$router.push({name: 'SpaceRuleSetter', params: {id: this.params.data.id}, query: {options: 'copy'}})
      },
      async handleFavorite() {
        this.loading = true
        const res = await favoriteApi(this.params.data.id)
        if (res.ok) {
          this.params.data.focus = !this.params.data.focus
        }
        this.loading = false
      },
      async handleCancelFavorite() {
        this.loading = true
        const res = await cancelFavoriteApi(this.params.data.id)
        if (res.ok) {
          this.params.data.focus = !this.params.data.focus
        }
        this.loading = false
      }
    },
    mounted() {
    }
  }
</script>
<style scoped lang="scss">
  .edi-operation-button-in-aggrid .el-button{
    padding: 0;
  }
  .favorite{
    margin-left: 10px;
    color: #aaa;
    cursor: pointer;
    font-size: 16px;
  }
  .active-star {
    color: #F4CF2C;
    font-size: 18px;
  }
  .right-margin-button{
    margin: 0;
    margin-right: 10px!important;
  }
</style>
