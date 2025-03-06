import { getCamelCase, getPascalCase, getSeparatorCase, getServices, joinPath, pluralize, type EjsContent, type ObjectSchema, type ObjectSchemaProperty, type Schema, type TemplateFile } from '@cloudplex/cortex';
import { componentNameInput, componentDirSelect, getEntityName, schemaSelect } from '../_utils';

export default async function formGenerator() {
  const templateFiles: TemplateFile[] = [];
  const services = await getServices();
  let componentTemplateSchemaProperties: ObjectSchemaProperty[];
  let serviceDir: string;

  // 选择模型
  const componentTemplate: TemplateFile = {
    dist: undefined as any as string,
    content: {
      template: joinPath(__dirname, 'form.ejs'),
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
      },
    },
  };
  templateFiles.push(componentTemplate);
  const componentTemplateData = (componentTemplate.content as EjsContent).data as ComponentTemplateData;

  // 选择组件模型
  componentTemplateData.schema = await schemaSelect(services.map(({ schemas }) => schemas).flat());
  componentTemplateSchemaProperties = (componentTemplateData.schema as ObjectSchema).properties!;
  serviceDir = `@/services/${componentTemplateData.schema.service}`;

  componentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
  componentTemplateData.imports['@/utils'].values.add('updateForm');
  componentTemplateData.imports['@/utils'].values.add('useFormTransform');
  componentTemplateData.imports['@arco-design/web-vue'].types.add('FormInstance');
  componentTemplateData.imports.lodash.values.add('cloneDeep');
  componentTemplateData.imports.vue.values.add('reactive');
  componentTemplateData.imports.vue.values.add('ref');
  componentTemplateData.imports.vue.values.add('watch');
  componentTemplateData.imports.vue.types.add('PropType');

  if (
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
      .some(({ type, extra }) => /^(checkbox|inputTag|selectMultiple(Create)?)$/.test(extra.inputRender) && !type.endsWith('[]'))
  ) {
    componentTemplateData.imports['@/utils'].values.add('parseJsonString');
  }
  if (
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
      .some(({ extra }) => /^(file|image)$/.test(extra.inputRender))
  ) {
    componentTemplateData.entity.SERVICE = getSeparatorCase(componentTemplateData.schema.service, { mode: 'upper', separator: '_' });
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
    componentTemplateData.imports['@arco-design/web-vue'].types.add('FileItem');
    componentTemplateData.imports['vue'].values.add('computed');
  }
  if (
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
      .some(({ type, extra }) => extra.filterRender === 'number' || (!extra.filterRender && type === 'number'))
  ) {
    componentTemplateData.imports['@/utils'].values.add('numberFormatter');
    componentTemplateData.imports['@/utils'].values.add('numberParser');
  }

  componentTemplateData.entity.dictCodes = Array.from(new Set(
    componentTemplateSchemaProperties
      .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
      .filter(({ extra }) => /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.inputRender) && extra.optionsFromDict)
      .map(({ extra }) => extra.optionsFromDict as string)
  ));
  if (componentTemplateData.entity.dictCodes.length) {
    componentTemplateData.imports[serviceDir].values.add('getAllDictItems');
    componentTemplateData.imports['@/utils'].values.add('getErrorMessage');
    componentTemplateData.imports['@/utils'].values.add('useRequestRecord');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
  }
  componentTemplateData.entity.entities = Array.from(
    new Map(
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
        .filter(({ extra }) => /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.filterRender) && extra.optionsFromEntity)
        .map(({ extra }) => {
          const Name = getPascalCase(getEntityName(extra.optionsFromEntity.name));
          const Names = pluralize(Name);
          const name = getCamelCase(Name);
          const description = services
            .find(({ name }) => name === componentTemplateData.schema.service)
            ?.schemas
            ?.find(schema => getEntityName(schema) === Name)
            ?.description ?? Name;
          return [Name, { Names, name, description }];
        })
    )
      .values()
  );
  if (componentTemplateData.entity.entities.length) {
    componentTemplateData.entity.entities.forEach(({ Names }) => {
      componentTemplateData.imports[serviceDir].values.add(`getAll${Names}`);
    });
    componentTemplateData.imports['@/utils'].values.add('getErrorMessage');
    componentTemplateData.imports['@/utils'].values.add('useRequest');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
  }

  // 输入组件名称
  const componentName = await componentNameInput(`${componentTemplateData.schema.extra.Name}Form`);

  // 选择组件目录
  const componentDir = await componentDirSelect();
  componentTemplate.dist = `${componentDir}/${componentName}.vue`;

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
  entity: {
    SERVICE?: string;
    dictCodes: string[];
    entities: {
      Names: string;
      name: string;
      description: string;
    }[];
  };
};