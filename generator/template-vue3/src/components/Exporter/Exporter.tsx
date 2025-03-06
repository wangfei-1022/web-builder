import { getErrorMessage, type Response } from '@/utils';
import { Message, Modal } from '@arco-design/web-vue';
import { nextTick, ref, type RenderFunction } from 'vue';
import TemplateSelect from './TemplateSelect.vue';

/** 导出器 */
export const Exporter: ExporterMethods = {
  export: param => {
    if (typeof param === 'function') {
      return exportFile(param);
    } else {
      return new Promise(resolve => {
        const { title = '请选择导出模板', templates } = param;
        const request = ref<ExporterTemplate['request']>();
        Modal.open({
          title,
          content: () => <TemplateSelect templates={templates} v-model={request.value} />,
          width: 800,
          maskClosable: false,
          onBeforeOk: async () => {
            if (request.value) {
              const result = await exportFile(request.value);
              if (result) {
                resolve(result);
              }
              return result;
            }
            return false;
          },
        });
      });
    }
  },
};

export interface ExporterMethods {
  /**
   * 导出
   * @param request 请求
   */
  export(request: ExporterTemplate['request']): Promise<boolean>;
  /**
   * 导出
   * @param config 配置
   */
  export(config: ExporterConfig): Promise<boolean>;
}

export interface ExporterTemplate {
  /** 唯一标识 */
  id: string | number;
  /** 名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 请求 */
  request: () => Promise<Response<Blob, any>>;
}

export interface ExporterConfig {
  /** 标题 */
  title?: string | RenderFunction;
  /** 模板 */
  templates: ExporterTemplate[];
}

/**
 * 导出文件
 * @param request 请求
 */
export async function exportFile(request: ExporterTemplate['request']) {
  try {
    const { headers, data } = await request();
    const { filename = '未知文件' } = headers.contentDisposition
      ? Object.fromEntries(
        headers.contentDisposition
          .split(/ *; */)
          .map(item => item.split('='))
          .map(([key, value]) => [key, value?.replace(/^"|"$/g, '') || true]),
      )
      : {};
    const a = document.createElement('a');
    a.download = decodeURIComponent(filename as string);
    a.href = URL.createObjectURL(data);
    a.click();
    await nextTick();
    URL.revokeObjectURL(a.href);
    return true;
  } catch (error) {
    Message.error(getErrorMessage(error));
    return false;
  }
}