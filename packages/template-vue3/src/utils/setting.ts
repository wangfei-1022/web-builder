import { usePassport } from '@/stores/user';
import { ref, watch, type Ref } from 'vue';

/** 设置存储 key */
const SETTING_RECORD_STORE_KEY = '__CORTEX_USER_SETTINGS';
/** 公共用户 key */
const COMMON_USER_KEY = '__common';

/**
 * 使用设置
 * @param options 选项
 */
export function useSetting<SettingType = any>(options: {
  /** 持久化列的 key */
  persistenceKey: string;
  /** 默认设置 */
  defaultSetting?: SettingType;
  /** 公共的 */
  common?: boolean;
}): Ref<SettingType> {
  const { persistenceKey, defaultSetting, common } = options;
  const user = !common && usePassport().value?.account || COMMON_USER_KEY;
  const setting = ref(getUserSetting(user, persistenceKey, defaultSetting));
  watch(setting, () => {
    setUserSetting(user, persistenceKey, setting.value);
  });
  return setting;
}

/**
 * 获取用户设置
 * @param user 用户标识
 * @param persistenceKey 持久化列的 key
 * @param defaultSetting 默认设置 
 */
function getUserSetting(user: string, persistenceKey: string, defaultSetting?: any) {
  const userSettingsRecord = getUserSettingsRecord();
  return (userSettingsRecord[user] as Object | undefined)?.hasOwnProperty(persistenceKey)
    ? userSettingsRecord[user][persistenceKey]
    : defaultSetting;
}

/**
 * 修改用户设置
 * @param user 用户标识
 * @param persistenceKey 持久化列的 key
 * @param setting 设置
 */
function setUserSetting(user: string, persistenceKey: string, setting: any) {
  const userSettingsRecord = getUserSettingsRecord();
  localStorage.setItem(SETTING_RECORD_STORE_KEY, JSON.stringify({
    ...userSettingsRecord,
    [user]: { ...userSettingsRecord[user], [persistenceKey]: setting },
  }));
}

/**
 * 获取用户设置列表记录
 */
function getUserSettingsRecord() {
  let userSettingsRecord: Record<string, any>;
  try {
    userSettingsRecord = JSON.parse(localStorage.getItem(SETTING_RECORD_STORE_KEY)!) || {};
  } catch (error) {
    userSettingsRecord = {};
  }
  return userSettingsRecord;
}