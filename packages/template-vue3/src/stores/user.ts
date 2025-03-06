import { getPassport, getPermissions, type PassportVM } from '@/services/demo-service';
import { defineStore } from 'pinia';
import { computed, reactive, readonly, ref } from 'vue';

/** 用户仓库 */
const useUserStore = defineStore('user', () => {
  /** 通行证 */
  const passport = ref<OptimizeModel<PassportVM>>();
  /** 权限 */
  const permissions = ref<{ [value: string]: boolean | undefined; }>();

  /**
   * 登录
   * @param token 令牌
   */
  const login = async (token?: string) => {
    if (token) {
      localStorage.setItem(__TOKEN_STORAGE_KEY__, token);
    }
    const [passportRequest, permissionsRequest] = await Promise.all([getPassport(), getPermissions()]);
    passport.value = passportRequest.data;
    permissions.value = permissionsRequest.data;
  };

  /**
   * 登出
   */
  const logout = () => {
    localStorage.removeItem(__TOKEN_STORAGE_KEY__);
    passport.value = undefined;
    permissions.value = undefined;
  };

  /**
   * 更新通行证
   * @param newPassport 新通行证
   */
  const updatePassport = (newPassport: NonNullable<typeof passport.value>) => {
    passport.value = newPassport;
  };

  return {
    /** 通行证 */
    passport: readonly(passport),
    /** 权限 */
    permissions: readonly(permissions),
    login,
    logout,
    updatePassport,
  };
});

export default useUserStore;

/**
 * 使用通行证
 */
export function usePassport() {
  const userStore = useUserStore();
  return computed(() => userStore.passport);
}

/**
 * 使用权限
 * @param value 权限值
 */
export function usePermission(value: string) {
  const userStore = useUserStore();
  return computed(() => (
    userStore.permissions
      ? userStore.permissions[value] !== false
      : false
  ));
}

/**
 * 使用权限
 * @param values 权限值
 */
export function usePermissions<Value extends string>(values: Value[]): { [permission in Value]: boolean } {
  return reactive(Object.fromEntries(
    values.map(value => [value, usePermission(value)])
  )) as any;
}