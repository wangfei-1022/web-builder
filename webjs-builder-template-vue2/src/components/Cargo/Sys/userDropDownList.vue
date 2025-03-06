<!--待废弃，请谨慎使用。若使用相关功能，请查看cargoAdvanceSelect组件-->
<template>
  <div>
    <el-select
      v-model="currentUser.info"
      :filterable="allowCreate"
      :allow-create="allowCreate"
      default-first-option
      size="mini"
    >
      <el-option v-for="(item,index) in userList" :key="index" :label="item.chineseName" :value="chooseUserId?item.id:item.chineseName" />
    </el-select>
  </div>
</template>

<script>
import { getUserDropDownList } from '@/api/commonComponent'
export default {
  name: 'UserDropDownList',
  props: {
    refCode: { type: String, default: '' },
    userValue: { type: String, default: '' },
    chooseUserId: { type: Boolean, default: true }, // 是否在选中时设置userId值，为false 为当选中options是，value为userName
    allowCreate: { type: Boolean, default: false }
  },
  data() {
    return {
      userList: [],
      currentUser: {
        info: '',
        id: '',
        name: ''
      }
    }
  },
  watch: {
    userValue(newVal) {
      console.log('UserDropDownList userValue ', newVal)
      this.currentUser.info = newVal
    },
    'currentUser.info'(newVal, oldVal) {
      console.log('UserDropDownList currentUser.info ', newVal)
      if (!this.refCode) {
        this.$emit('set', newVal)
      } else {
        const returnValue = { 'refCode': this.refCode, 'value': this.newVal }
        this.$emit('set', returnValue)
      }
    }
  },
  created() {
  },
  beforeMount() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getUserDropDownList().then(res => {
        if (res.ok && res.content) {
          this.userList = res.content
          this.currentUser.info = this.userValue || this.userList[0].info
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
