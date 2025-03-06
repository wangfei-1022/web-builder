<template>
  <div>
    <div class="operate-buttons" style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff;margin-top:4px;">
      <div class="operate-buttons-left">
        <el-button type="primary" size="mini" plain @click="goBackToList">返回列表</el-button>
        <!--<el-button type="primary" size="mini">新建</el-button>-->
        <el-button type="success" size="mini" @click="doSaveUser">保存</el-button>
        <!--<el-button type="danger" size="mini">删除</el-button>-->
      </div>
      <div class="operate-buttons-right">
        <el-button size="mini" type="primary">用户习惯设置</el-button>
        <el-button v-permission="['sys:user:resetpassword']" size="mini" type="primary" @click="toResetPassword">重置密码</el-button>
        <el-button size="mini" type="primary" @click="toActivate">启用</el-button>
        <el-button size="mini" type="primary" @click="toDeactivate">禁用</el-button>
      </div>
    </div>
    <el-form :model="newUser" label-width="80px" label-position="left" style="padding:8px;">
      <el-row :gutter="25">
        <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
          <el-form-item class="is-required-after" label="用户名"><el-input v-model="newUser.userName" size="mini" /></el-form-item>
          <el-form-item class="is-required-after" label="中文名"><el-input v-model="newUser.chineseName" size="mini" /></el-form-item>
          <el-form-item class="is-required-after" label="英文名"><el-input v-model="newUser.englishName" size="mini" /></el-form-item>
          <el-form-item v-show="!$route.query.id" class="is-required-after" label="登录密码"><el-input v-model="newUser.password" size="mini" /></el-form-item>
          <el-form-item class="is-required-after" label="所属公司">
            <el-select v-model="newUser.officeId" size="mini" :placeholder="$t('common.placeholder')" @change="refreshDepartmentList">
              <el-option v-for="o in officeList" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="is-required-after" label="所属部门">
            <el-select id="new-user-department-id" v-model="newUser.departmentId" size="mini" :placeholder="$t('common.placeholder')" :disabled="newUser.officeId === ''">
              <el-option v-for="d in departmentList" :key="d.value" :label="d.label" :value="d.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
          <el-form-item label="电话"><el-input v-model="newUser.tel" size="mini" /></el-form-item>
          <el-form-item label="传真"><el-input v-model="newUser.fax" size="mini" /></el-form-item>
          <el-form-item class="is-required-after" label="手机"><el-input v-model="newUser.mobile" size="mini" /></el-form-item>
          <el-form-item label="QQ"><el-input v-model="newUser.qq" size="mini" /></el-form-item>
          <el-form-item label="微信"><el-input v-model="newUser.wechat" size="mini" /></el-form-item>
          <el-form-item class="is-required-after" label="邮箱"><el-input v-model="newUser.email" size="mini" /></el-form-item>
          <el-form-item label="备注"><el-input v-model="newUser.remark" size="mini" /></el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
          <span>用户类型（用于订单中的下拉选项）</span>
          <div class="user-duty-wrapper">
            <div v-for="d in newUser.sysUserDutyList" :key="d.dutyCode" class="one-user-duty" style="margin: 6px 0">
              <el-checkbox v-model="d.bAssigned">{{ d.dutyName }}</el-checkbox>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" />
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getOffice, getDepartmentByOfficeId, saveUser,
  getUserById, getUserDutyList, resetPassword, activateUser, deactivateUser } from '@/api/user'
import { toSimulateRefreshingListBackingTo } from '@/utils'

export default {
  name: 'NewUser',
  data() {
    return {
      newUser: {
        id: '',
        chineseName: '',
        departmentId: '',
        email: '',
        englishName: '',
        fax: '',
        userName: '',
        mobile: '',
        officeId: '',
        password: '',
        qq: '',
        remark: '',
        tel: '',
        wechat: '',
        sysUserDutyList: []
      },
      officeList: [],
      departmentList: []
    }
  },
  beforeMount() {
    getOffice().then(res => {
      this.officeList = res.content
    })

    //    getDepartment().then(res => {
    //      this.departmentList = res.content
    //    })
    if (this.$route.query.id) {
      getUserById(this.$route.query.id).then(res => {
        this.newUser = res.content
        return this.newUser.officeId
      }).then(id => {
        if (id) { // 如果有值，去捞对应的部门列表
          getDepartmentByOfficeId(id).then(res => {
            this.departmentList = res.content
          })
        }
      })
    } else { // 否则只单独捞用户职能类型list
      this.resetNewUser()
      getUserDutyList().then(res => {
        this.newUser.sysUserDutyList = res.content
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'UserManagement' && !to.query.id) {
        vm.resetNewUser()
      }
    })
  },
  methods: {
    goBackToList() {
      toSimulateRefreshingListBackingTo(this, 'UserManagement')
    },
    doSaveUser() {
      if (!this.newUser.userName) {
        return this.$message.warning('请输入用户名')
      }
      if (!this.newUser.chineseName) {
        return this.$message.warning('请输入中文名')
      }
      if (!this.newUser.englishName) {
        return this.$message.warning('请输入英文名')
      }
      if (!this.newUser.password && !this.newUser.id) { // 没id时(即新建时)，密码必填
        return this.$message.warning('请输入登录密码')
      }
      if (!this.newUser.mobile) {
        return this.$message.warning('请输入手机')
      }
      if (!this.newUser.email) {
        return this.$message.warning('请输入邮箱')
      }
      if (!this.newUser.officeId) {
        return this.$message.warning('请选择公司')
      }
      if (!this.newUser.departmentId) {
        return this.$message.warning('请选择部门')
      }

      saveUser(this.newUser, this.newUser.id).then(res => {
        if (res.ok) {
          this.$message.success('保存成功')
          if (!this.newUser.id) {
            this.newUser.id = res.content
          }
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    refreshDepartmentList(val) {
      this.newUser.departmentId = ''
      getDepartmentByOfficeId(val).then(res => {
        this.departmentList = res.content
      })
    },
    toResetPassword() {
      if (!this.newUser.id) {
        return this.$message.error('新建用户尚未完成')
      }
      resetPassword(this.newUser.id).then(res => {
        if (res.ok) {
          this.$message.success('重置密码成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    toActivate() {
      if (!this.newUser.id) {
        return this.$message.error('新建用户尚未完成')
      }
      activateUser(this.newUser.id).then(res => {
        if (res.ok) {
          this.$message.success('已启用')
        }
      })
    },
    toDeactivate() {
      if (!this.newUser.id) {
        return this.$message.error('新建用户尚未完成')
      }
      deactivateUser(this.newUser.id).then(res => {
        if (res.ok) {
          this.$message.success('已禁用')
        }
      })
    },
    resetNewUser() {
      this.newUser.id = ''
      this.newUser.chineseName = ''
      this.newUser.departmentId = ''
      this.newUser.email = ''
      this.newUser.englishName = ''
      this.newUser.fax = ''
      this.newUser.userName = ''
      this.newUser.mobile = ''
      this.newUser.officeId = ''
      this.newUser.password = ''
      this.newUser.qq = ''
      this.newUser.remark = ''
      this.newUser.tel = ''
      this.newUser.wechat = ''
      this.newUser.sysUserDutyList = []
    }
  }
}
</script>
<style>
  #new-user-department-id.el-input__inner{
    height: 28px!important;
  }
</style>
