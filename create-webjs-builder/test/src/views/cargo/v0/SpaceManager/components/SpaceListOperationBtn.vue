<template>
  <div class="allocation-wrapper">
    <!-- <template v-if="params.data.bookingStatus === 2">
      <el-button type="text" size="mini" v-permission="['cas:flash:edit']" v-show="params.data.appointStatus === 1" @click="alloDialog=true" style="margin: 0;">分配</el-button>
      <el-button type="text" size="mini" v-permission="['cas:flash:edit']" v-show="params.data.appointStatus === 2" @click="cancelAllo" style="margin: 0;">取消分配</el-button>
    </template> -->
    <template>
      <el-button type="text" size="mini" v-permission="['cas:flash:edit']" v-show="params.data.appointStatus === 1" @click="alloDialog=true" style="margin: 0;">{{$t('spaceRule.spaceList.allotBtn')}}</el-button>
      <el-button type="text" size="mini" v-permission="['cas:flash:edit']" v-show="params.data.appointStatus === 2" @click="cancelAllo" style="margin: 0;">{{$t('spaceRule.spaceList.cancelAllotBtn')}}</el-button>
    </template>
    <el-dialog :visible.sync="alloDialog" :title="$t('spaceRule.spaceList.allotSpace')" :append-to-body="true" width="30%">
      <el-form :model="alloForm" ref="alloForm" :rules="alloRules">
        <el-form-item
          :label="`${$t('spaceRule.spaceList.selectAllotTarget')}: `"
          prop="appointedId">
          <el-cascader
          ref="userInfo"
          style="width: 280px;"
          size="mini"
          v-model="alloForm.appointedId"
          :options="departmentList"
          :props="{multiple: false, expandTrigger: 'hover', emitPath: false}"
          :show-all-levels="false"
          filterable
          clearable>
        </el-cascader>
        </el-form-item>
      </el-form>
      <div class="btn-wrap">
        <el-button type="primary" size="mini" @click="validateForm">{{$t('common.confirmBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getEmployeeListApi, allocationApi } from '@/api/spaceManager'
  import { mapState } from 'vuex'
  export default {
    name: 'SpaceListOperationBtn',
    data() {
      return {
        alloDialog: false,
        alloForm: {
          appointedId: '',
          appointedName: ''
        },
        alloRules: {
          appointedId: [
            {required: true, message: this.$t('spaceRule..spaceList.allotTargetEmptyInvalid'), trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        departmentList: state => state.user.departmentList
      })
    },
    methods: {
      async cancelAllo() {
        const res = await allocationApi(this.params.data.id)
        if (res.ok) {
          this.params.refreshData()
        }
      },
      validateForm() {
        this.$refs.alloForm.validate(valid => {
          if (valid) {
            const _node = this.$refs.userInfo.getCheckedNodes()
            this.alloForm.appointedName = _node[0].label
            this.submitForm()
          }
        })
      },
      async submitForm() {
        const res = await allocationApi(this.params.data.id, JSON.stringify(this.alloForm))
        if (res.ok) {
          this.$refs.alloForm.resetFields()
          this.alloDialog = false
          this.params.refreshData()
          // this.$nextTick(() => {
          //   this.$refs.alloForm.resetFields()
          // })
        }
      }
    },
    mounted() {}
  }
</script>
<style lang="scss" scoped>
.btn-wrap{
  width: 50%;
  margin-left: 50%;
  text-align: right;
}
</style>
