import { getPascalCase, glob, prompt } from '@cloudplex/cortex';

/**
 * 组件名称输入器
 * @param defaultValue 默认值
 */
export function componentNameInput(defaultValue: string) {
  return prompt<string>({
    message: '请输入组件名称:',
    type: 'input',
    default: defaultValue,
    filter: (value: string) => getPascalCase(value.trim()),
    validate: (name: string | undefined) => {
      if (!name) return '组件名称不可为空';
      if (!/^[A-Za-z]+[A-Za-z0-9]+$/.test(name)) return '组件名称不合法';
      return true;
    },
  });
}

/**
 * 组件目录选择器
 * @param options 选项 
 */
export async function componentDirSelect(options?: {
  name?: string;
  /** 类型 */
  types?: ('page' | 'component')[];
  /** 推荐目录 */
  recommendPath?: string;
}) {
  const { name = '组件', types = ['component'], recommendPath } = options ?? {};
  const pagePaths = await glob(['src/pages/*'], { onlyDirectories: true });
  let paths = ['src/components'].concat(pagePaths.map(path => [path, `${path}/components`]).flat());
  if (!types.includes('page')) {
    paths = paths.filter(path => path.endsWith('/components'));
  }
  if (!types.includes('component')) {
    paths = paths.filter(path => !path.endsWith('/components'));
  }
  return prompt<string>({
    message: `请选择${name}目录:`,
    type: 'autocomplete',
    default: recommendPath,
    source: async (_, keyword) => {
      const pathOptions = paths
        .filter(path => !keyword || new RegExp(keyword, 'i').test(path))
        .map(path => ({ name: path, value: path }));
      if (recommendPath && !paths.includes(recommendPath)) {
        pathOptions.splice(0, 0, { name: `${recommendPath}（新建）`, value: recommendPath });
      }
      return pathOptions;
    },
  });
}