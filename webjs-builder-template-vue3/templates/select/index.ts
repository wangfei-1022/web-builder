import { getServices, joinPath, type EjsContent, type ObjectSchema, type ObjectSchemaProperty, type Schema, type TemplateFile } from '@cloudplex/cortex';
import { componentNameInput, componentDirSelect, schemaSelect } from '../_utils';

export default async function SelectGenerator() {
  const templateFiles: TemplateFile[] = [];
  const services = await getServices();
  let componentTemplateSchemaProperties: ObjectSchemaProperty[];
  let serviceDir: string;

  // 初始化组件模板
  const componentTemplate: TemplateFile = {
    dist: undefined as any as string,
    content: {
      template: joinPath(__dirname, 'select.ejs'),
      data: {
        imports: new Proxy({}, {
          get(target, prop) {
            let value = Reflect.get(target, prop);
            if (!value) {
              value = { values: new Set(), types: new Set() };
              Reflect.set(target, prop, value);
            }
            return value;
          }
        }),
        entity: {},
        functions: {},
      },
    },
  };
  templateFiles.push(componentTemplate);
  const componentTemplateData = (componentTemplate.content as EjsContent).data as ComponentTemplateData;

  // 选择组件模型
  componentTemplateData.schema = await schemaSelect(services.map(({ schemas }) => schemas).flat());
  componentTemplateSchemaProperties = (componentTemplateData.schema as ObjectSchema).properties!;
  serviceDir = `@/services/${componentTemplateData.schema.service}`;

  componentTemplateData.imports[serviceDir].values.add(`getAll${componentTemplateData.schema.extra.Names}`);
  componentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
  componentTemplateData.imports['@/utils'].values.add('getErrorMessage');
  componentTemplateData.imports['@/utils'].values.add('useRequestPagination');
  componentTemplateData.imports['@/utils'].values.add('useTableColumns');
  componentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
  componentTemplateData.imports.lodash.values.add('cloneDeep');
  componentTemplateData.imports.lodash.values.add('debounce');
  componentTemplateData.imports.vue.values.add('computed');
  componentTemplateData.imports.vue.values.add('reactive');
  componentTemplateData.imports.vue.values.add('ref');
  componentTemplateData.imports.vue.values.add('watch');
  componentTemplateData.imports.vue.types.add('PropType');

  if (
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id)$/.test(name))
      .some(({ type }) => /^(number|boolean)$/.test(type))
  ) {
    componentTemplateData.imports.lodash.values.add('get');
  }
  if (
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id)$/.test(name))
      .some(({ type }) => type === 'number')
  ) {
    componentTemplateData.imports['@/components/DataView'].values.add('NumberView');
  }
  if (
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id)$/.test(name))
      .some(({ type }) => type === 'boolean')
  ) {
    componentTemplateData.imports['@/components/DataView'].values.add('BooleanView');
  }

  if (componentTemplateSchemaProperties.some(({ extra }) => extra.sortable === true)) {
    componentTemplateData.functions.sort = {};
  }

  // 输入组件名称
  const componentName = await componentNameInput(`${componentTemplateData.schema.extra.Name}Select`);

  // 选择组件目录
  const componentPath = await componentDirSelect();
  componentTemplate.dist = `${componentPath}/${componentName}.vue`;

  // 排序依赖
  const sortHandle = (a: string, b: string) => {
    if (!a.startsWith('.') && b.startsWith('.')) return -1;
    if (a.startsWith('.') && !b.startsWith('.')) return 1;
    const matchA = a.toLowerCase();
    const matchB = b.toLowerCase();
    if (matchA < matchB) return -1;
    if (matchA > matchB) return 1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };
  const templateDatas = [
    componentTemplateData,
  ];
  templateDatas
    .filter(templateData => templateData)
    .forEach(templateData => {
      templateData.imports = Object.fromEntries(
        Object
          .entries(templateData.imports)
          .sort(([a], [b]) => sortHandle(a, b))
          .map(item => {
            item[1].values = new Set(Array.from(item[1].values).sort(sortHandle));
            item[1].types = new Set(Array.from(item[1].types).sort(sortHandle));
            return item;
          })
      );
    });

  return templateFiles;
}

type ComponentTemplateData = {
  schema: Schema;
  imports: Record<string, {
    default?: string;
    values: Set<string>;
    types: Set<string>;
  }>;
  functions: Record<string, Record<string, any>>;
};