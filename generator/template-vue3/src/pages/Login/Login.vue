<template>
  <div class="login">
    <div class="card">
      <div class="card-left-side">
        <img src="@/assets/cover.jpg" />
      </div>

      <div class="card-right-side">
        <div class="card-right-side-head">
          <div class="logo">
            <img src="@/assets/logo.svg" />
            <h1>{{ appName }}</h1>
          </div>
        </div>

        <div class="card-right-side-body">
          <AForm :model="formValue" layout="vertical" @submitSuccess="loginRequest.load">
            <AFormItem field="login"
                       :rules="[
                         { required: true, message: '此项为必填项' },
                         { minLength: 4, message: '最少4个字符' },
                         { maxLength: 30, message: '最多30个字符' },
                       ]"
                       hideLabel>
              <AInput placeholder="账号 / 手机号"
                      autocomplete="username"
                      v-model="formValue.login"
                      allowClear>
                <template #prefix>
                  <IconUser />
                </template>
              </AInput>
            </AFormItem>
            <AFormItem field="password"
                       :rules="[
                         { required: true, message: '此项为必填项' },
                         { minLength: 4, message: '最少4个字符' },
                         { maxLength: 30, message: '最多30个字符' },
                       ]"
                       hideLabel>
              <AInputPassword placeholder="请输入密码"
                              autocomplete="current-password"
                              v-model="formValue.password"
                              allowClear>
                <template #prefix>
                  <IconLock />
                </template>
              </AInputPassword>
            </AFormItem>
            <ASpace direction="vertical" size="medium" fill>
              <AFormItem field="rememberMe" noStyle>
                <ARow justify="space-between" align="center">
                  <ACol flex="initial">
                    <ACheckbox v-model="formValue.rememberMe">记住密码</ACheckbox>
                  </ACol>
                  <!-- <ACol flex="initial">
                    <ALink>忘记密码</ALink>
                  </ACol> -->
                </ARow>
              </AFormItem>
              <AButton type="primary"
                       long
                       :loading="loginRequest.loading"
                       htmlType="submit">
                登录
              </AButton>
              <!-- <AButton class="register-btn" type="text" status="normal" long>注册账号</AButton> -->
            </ASpace>
          </AForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loginByPassword, type LoginByPasswordVM } from '@/services/demo-service';
import useUserStore from '@/stores/user';
import { getErrorMessage, useRequest } from '@/utils';
import { Message } from '@arco-design/web-vue';
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const appName = __APP_NAME__;

// 表单
const formValue = reactive({
  /** 账号 / 手机号 */
  login: undefined as string | undefined,
  /** 密码 */
  password: undefined as string | undefined,
  /** 记住密码 */
  rememberMe: false,
});

// 登录
const loginRequest = useRequest(
  async () => {
    const modelValue = {
      ...formValue as OptimizeForm<typeof formValue, LoginByPasswordVM>,
    };
    const { data } = await loginByPassword(modelValue);
    await userStore.login(data);
  },
  {
    manual: true,
    onError: error => Message.error(getErrorMessage(error)),
  },
);

// 路由跳转
watch(
  () => userStore.passport,
  () => {
    if (userStore.passport) {
      if (route.query.redirect) {
        router.push(decodeURIComponent(route.query.redirect as string));
      } else {
        router.push('/');
      }
    }
  },
  { immediate: true },
);
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  background-color: #E5E9FF;
}

.card {
  margin: auto;
  background: @color-bg-1;
}

.card-left-side {
  display: none;
  width: 500px;
  height: 500px;
  background: #f2f4f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-right-side {
  padding: 32px 0;
  box-sizing: border-box;
}

.card-right-side-head {
  margin-bottom: 24px;
  padding: 0 24px;
}

.card-right-side-body {
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  margin: auto;

  img {
    height: 56px;
  }

  h1 {
    margin: 0 0 0 16px;
    font-size: 28px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.description {
  color: @color-text-3;
  text-align: center;
}

// .register-btn {
//   color: @color-text-3 !important;
// }

@media (min-width: 500px) {
  .card-right-side {
    width: 500px;
  }

  .card-right-side-head,
  .card-right-side-body {
    padding: 0 20%;
  }

  .card-right-side-head {
    margin-bottom: 36px;
  }
}

@media (min-width: 1000px) {
  .card {
    display: flex;
  }

  .card-left-side {
    display: block;
  }

  .card-right-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>