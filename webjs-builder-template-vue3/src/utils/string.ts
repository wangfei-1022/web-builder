/**
 * 命名分组
 * @param value 值
 */
export function groupingCase(value: string) {
  return value
    .split(/[^A-Za-z0-9]+/)
    .reduce<string[]>((group, item) => {
      const matchs = item.match(/([A-Z][a-z]+|[A-Z][A-Z]+|[a-z][a-z]+|[A-Z]+|[a-z]+|\d+)/g);
      if (matchs) return group.concat(matchs);
      return group;
    }, []);
}

/**
 * 获取分隔线命名
 * @param value 值
 * @param options 选项
 */
export function getSeparatorCase(value: string, options?: {
  /** 模式，默认为 `'default'` */
  mode?: 'default' | 'upper' | 'lower' | 'pascal';
  /** 分隔符，默认为 `'-'` */
  separator?: string;
}): string {
  const { separator = '-', mode } = options || {};
  const group = groupingCase(value);
  switch (mode) {
    case 'upper': return group.join(separator).toUpperCase();
    case 'lower': return group.join(separator).toLowerCase();
    case 'pascal': return group
      .map(item => `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`)
      .join(separator);
    default: return group.join(separator);
  }
}

/**
 * 获取大驼峰命名
 * @param value 值
 */
export function getPascalCase(value: string): string {
  return groupingCase(value)
    .map(item => /^[A-Z0-9]+$/.test(item) ? item : `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`)
    .join('');
}

/**
 * 获取小驼峰命名
 * @param value 值
 */
export function getCamelCase(value: string): string {
  return groupingCase(value)
    .map((item, index) => {
      if (index === 0) return item.toLowerCase();
      return /^[A-Z0-9]+$/.test(item) ? item : `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`;
    })
    .join('');
}