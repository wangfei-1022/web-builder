import { prompt, type Schema } from '@cloudplex/cortex';

/**
 * 模型选择器
 * @param schemas 模型
 */
export function schemaSelect(schemas: Schema[]) {
  const serviceSet = new Set(schemas.map(({ service }) => service));
  return prompt<Schema>({
    message: '请选择模型:',
    type: 'autocomplete',
    source: async (_, keyword) => (
      schemas
        .filter(({ type, properties }: any) => type === 'object' && properties)
        .map(schema => ({
          name: serviceSet.size > 1
            ? `${schema.service}/${schema.name}（${schema.description}）`
            : `${schema.name}（${schema.description}）`,
          value: schema,
        }))
        .filter(({ name }) => !keyword || new RegExp(keyword, 'i').test(name))
    ),
  });
}

/**
 * 获取实体名称
 * @param schema 模型
 */
export function getEntityName(schema: Schema) {
  return schema.name.replace(/(DTO|VM|VO)$/, '');
}