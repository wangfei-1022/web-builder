import { inject, reactive } from 'vue';

/**
 * 使用系统
 */
export function useSystem(): SyStemResult {
  const multiTabbed = inject('multiTabbed')!();

  const refreshCurrentPage = () => {
    multiTabbed.refreshCurrentTab();
  };

  const closeCurrentPage = () => {
    multiTabbed.closeCurrentTab();
  };

  const setTitle = (title: string) => {
    multiTabbed.setCurrentTabTitle(title);
  };

  return reactive({
    refreshCurrentPage,
    closeCurrentPage,
    setTitle,
  });
}

export interface SyStemResult {
  /**
   * 设置标题
   * @param title 标题
   */
  setTitle(title: string): void;
  /**
   * 刷新当前页面
   */
  refreshCurrentPage(): void;
  /**
   * 关闭当前页面
   */
  closeCurrentPage(): void;
};