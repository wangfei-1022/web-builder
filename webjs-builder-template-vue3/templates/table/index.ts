import { getCamelCase, getPascalCase, getSeparatorCase, getServices, joinPath, prompt, pluralize, type EjsContent, type TemplateFile, type ObjectSchemaProperty, type ObjectSchema, type Schema } from '@cloudplex/cortex';
import { dirname, relative } from 'path';
import { componentNameInput, componentDirSelect, getEntityName, schemaSelect } from '../_utils';

export default async function tableGenerator() {
  const templateFiles: TemplateFile[] = [];
  const services = await getServices();
  let componentTemplateData: ComponentTemplateData;
  let componentTemplateSchemaProperties: ObjectSchemaProperty[];
  let serviceDir: string;
  let subComponentDir: string;
  let detailComponentTemplate: TemplateFile;
  let detailComponentTemplateData: DetailComponentTemplateData;
  let formComponentTemplate: TemplateFile;
  let formComponentTemplateData: FormComponentTemplateData;
  let batchFormComponentTemplate: TemplateFile;
  let batchFormComponentTemplateData: BatchFormComponentTemplateData;

  // 初始化组件模板
  const componentTemplate: TemplateFile = {
    dist: undefined as any as string,
    content: {
      template: joinPath(__dirname, 'table.ejs'),
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
  componentTemplateData = (componentTemplate.content as EjsContent).data as ComponentTemplateData;

  // 选择组件模型
  componentTemplateData.schema = await schemaSelect(services.map(({ schemas }) => schemas).flat());
  componentTemplateSchemaProperties = (componentTemplateData.schema as ObjectSchema).properties!;
  serviceDir = `@/services/${componentTemplateData.schema.service}`;

  componentTemplateData.imports['@/components/FullScreen'].default = 'FullScreen';
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

  if (
    componentTemplateSchemaProperties
      .filter(({ extra }) => extra.filter === true || extra.filter === 'inMore')
      .some(({ type, extra }) => extra.filterRender === 'number' || (!extra.filterRender && type === 'number'))
  ) {
    componentTemplateData.imports['@/utils'].values.add('numberFormatter');
    componentTemplateData.imports['@/utils'].values.add('numberParser');
  }
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

  componentTemplateData.imports[serviceDir].values.add(`getAll${componentTemplateData.schema.extra.Names}`);
  componentTemplateData.entity.dictCodes = Array.from(new Set(
    componentTemplateSchemaProperties
      .filter(({ extra }) => extra.filter === true || extra.filter === 'inMore')
      .filter(({ extra }) => /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.filterRender) && extra.optionsFromDict)
      .map(({ extra }) => extra.optionsFromDict as string)
  ));
  if (componentTemplateData.entity.dictCodes.length) {
    componentTemplateData.imports[serviceDir].values.add('getAllDictItems');
    componentTemplateData.imports['@/utils'].values.add('useRequestRecord');
  }
  componentTemplateData.entity.entities = Array.from(
    new Map(
      componentTemplateSchemaProperties
        .filter(({ extra }) => extra.filter === true || extra.filter === 'inMore')
        .filter(({ extra }) => /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.filterRender) && extra.optionsFromEntity)
        .map(({ extra }) => {
          const Name = getPascalCase(extra.optionsFromEntity.name);
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
    componentTemplateData.imports['@/utils'].values.add('useRequest');
  }

  if (componentTemplateSchemaProperties.some(({ extra }) => extra.filter === 'inMore')) {
    componentTemplateData.functions.queryMore = {};
  }
  if (componentTemplateSchemaProperties.some(({ extra }) => extra.sortable === true)) {
    componentTemplateData.functions.sort = {};
  }

  // 输入组件名称
  const componentName = await componentNameInput(componentTemplateData.schema.extra.Name);

  // 选择组件目录
  const componentDir = await componentDirSelect({
    types: ['page', 'component'],
    recommendPath: `src/pages/${componentName}`,
  });
  componentTemplate.dist = `${componentDir}/${componentName}.vue`;
  subComponentDir = componentDir.endsWith('/components') ? componentDir : `${componentDir}/components`;

  // 选择组件功能
  const functions = await prompt<string[]>({
    message: '请选择组件功能:',
    type: 'checkbox',
    choices: [
      { name: '实体明细', value: 'detail', checked: true },
      { name: '新增实体', value: 'create', checked: true },
      { name: '复制实体', value: 'copy' },
      { name: '编辑实体', value: 'update', checked: true },
      { name: '删除实体', value: 'delete', checked: true },
      { name: '批量新增实体', value: 'batchCreate' },
      { name: '批量复制实体', value: 'batchCopy' },
      { name: '批量编辑实体', value: 'batchUpdate' },
      { name: '批量删除实体', value: 'batchDelete' },
    ],
  });
  functions.forEach(componentFunction => {
    componentTemplateData.functions[componentFunction] = {};
  });
  if (componentTemplateData.functions.create) {
    componentTemplateData.imports[serviceDir].values.add(`create${componentTemplateData.schema.extra.Name}`);
    componentTemplateData.imports['@/stores/user'].values.add('usePassport');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.copy) {
    componentTemplateData.imports[serviceDir].values.add(`create${componentTemplateData.schema.extra.Name}`);
    componentTemplateData.imports['@/stores/user'].values.add('usePassport');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.update) {
    componentTemplateData.imports[serviceDir].values.add(`partialUpdate${componentTemplateData.schema.extra.Name}`);
    componentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
    componentTemplateData.imports['@/utils'].values.add('getEntityUpdate');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.delete) {
    componentTemplateData.imports[serviceDir].values.add(`delete${componentTemplateData.schema.extra.Name}`);
    componentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.batchCreate) {
    componentTemplateData.imports[serviceDir].values.add(`batchCreate${componentTemplateData.schema.extra.Names}`);
    componentTemplateData.imports['@/stores/user'].values.add('usePassport');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.batchCopy) {
    componentTemplateData.imports[serviceDir].values.add(`batchCreate${componentTemplateData.schema.extra.Names}`);
    componentTemplateData.imports['@/stores/user'].values.add('usePassport');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.batchUpdate) {
    componentTemplateData.imports[serviceDir].values.add(`batchPartialUpdate${componentTemplateData.schema.extra.Names}`);
    componentTemplateData.imports['@/utils'].values.add('getEntityUpdate');
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }
  if (componentTemplateData.functions.batchDelete) {
    componentTemplateData.imports[serviceDir].values.add(`batchDelete${componentTemplateData.schema.extra.Names}`);
    componentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
  }

  if (
    componentTemplateData.functions.create ||
    componentTemplateData.functions.copy ||
    componentTemplateData.functions.update
  ) {
    // 初始化表单组件模板
    formComponentTemplate = {
      dist: `${subComponentDir}/${componentName}Form.vue`,
      content: {
        template: joinPath(__dirname, '../form/form.ejs'),
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
          entity: {}
        },
      },
    };
    templateFiles.push(formComponentTemplate);
    formComponentTemplateData = (formComponentTemplate.content as EjsContent).data as FormComponentTemplateData;
    formComponentTemplateData.schema = componentTemplateData.schema;

    formComponentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
    formComponentTemplateData.imports['@/utils'].values.add('updateForm');
    formComponentTemplateData.imports['@/utils'].values.add('useFormTransform');
    formComponentTemplateData.imports['@arco-design/web-vue'].types.add('FormInstance');
    formComponentTemplateData.imports.lodash.values.add('cloneDeep');
    formComponentTemplateData.imports.vue.values.add('reactive');
    formComponentTemplateData.imports.vue.values.add('ref');
    formComponentTemplateData.imports.vue.values.add('watch');
    formComponentTemplateData.imports.vue.types.add('PropType');

    if (
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
        .some(({ type, extra }) => /^(checkbox|inputTag|selectMultiple(Create)?)$/.test(extra.inputRender) && !type.endsWith('[]'))
    ) {
      formComponentTemplateData.imports['@/utils'].values.add('parseJsonString');
    }
    if (
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
        .some(({ extra }) => /^(file|image)$/.test(extra.inputRender))
    ) {
      formComponentTemplateData.entity.SERVICE = getSeparatorCase(componentTemplateData.schema.service, { mode: 'upper', separator: '_' });
      formComponentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
      formComponentTemplateData.imports['@arco-design/web-vue'].types.add('FileItem');
      formComponentTemplateData.imports['vue'].values.add('computed');
    }
    if (
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
        .some(({ type, extra }) => extra.inputRender === 'number' || (!extra.inputRender && type === 'number'))
    ) {
      formComponentTemplateData.imports['@/utils'].values.add('numberFormatter');
      formComponentTemplateData.imports['@/utils'].values.add('numberParser');
    }

    formComponentTemplateData.entity.dictCodes = Array.from(new Set(
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
        .filter(({ extra }) => (!extra.inputRender || /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.inputRender)) && extra.optionsFromDict)
        .map(({ extra }) => extra.optionsFromDict as string)
    ));
    if (formComponentTemplateData.entity.dictCodes.length) {
      formComponentTemplateData.imports[serviceDir].values.add('getAllDictItems');
      formComponentTemplateData.imports['@/utils'].values.add('getErrorMessage');
      formComponentTemplateData.imports['@/utils'].values.add('useRequestRecord');
      formComponentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
    }
    formComponentTemplateData.entity.entities = Array.from(
      new Map(
        componentTemplateSchemaProperties
          .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
          .filter(({ extra }) => /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.inputRender) && extra.optionsFromEntity)
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
    if (formComponentTemplateData.entity.entities.length) {
      formComponentTemplateData.entity.entities.forEach(({ Names }) => {
        formComponentTemplateData.imports[serviceDir].values.add(`getAll${Names}`);
      });
      formComponentTemplateData.imports['@/utils'].values.add('getErrorMessage');
      formComponentTemplateData.imports['@/utils'].values.add('useRequest');
      formComponentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
    }

    const formComponentPath = `./${joinPath(relative(dirname(componentTemplate.dist), formComponentTemplate.dist))}`;
    componentTemplateData.imports[formComponentPath].default = `${componentName}Form`;

    if (componentTemplateData.functions.create) {
      componentTemplateData.functions.create.component = `${componentName}Form`;
    }
    if (componentTemplateData.functions.copy) {
      componentTemplateData.functions.copy.component = `${componentName}Form`;
    }
    if (componentTemplateData.functions.update) {
      componentTemplateData.functions.update.component = `${componentName}Form`;
    }
    if (
      componentTemplateData.functions.create ||
      componentTemplateData.functions.copy ||
      componentTemplateData.functions.update
    ) {
      componentTemplateData.imports['@/utils'].values.add('getModelFilesUpdate');
    }
  }

  if (
    componentTemplateData.functions.batchCreate ||
    componentTemplateData.functions.batchCopy ||
    componentTemplateData.functions.batchUpdate
  ) {
    // 初始化批量表单组件模板
    batchFormComponentTemplate = {
      dist: `${subComponentDir}/${componentName}BatchForm.vue`,
      content: {
        template: joinPath(__dirname, 'batchForm.ejs'),
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
    templateFiles.push(batchFormComponentTemplate);
    batchFormComponentTemplateData = (batchFormComponentTemplate.content as EjsContent).data as BatchFormComponentTemplateData;
    batchFormComponentTemplateData.schema = componentTemplateData.schema;

    batchFormComponentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
    batchFormComponentTemplateData.imports['@/utils'].values.add('updateForm');
    batchFormComponentTemplateData.imports['@/utils'].values.add('useFormTransform');
    batchFormComponentTemplateData.imports['@arco-design/web-vue'].types.add('FormInstance');
    batchFormComponentTemplateData.imports.lodash.values.add('cloneDeep');
    batchFormComponentTemplateData.imports.vue.values.add('computed');
    batchFormComponentTemplateData.imports.vue.values.add('reactive');
    batchFormComponentTemplateData.imports.vue.values.add('ref');
    batchFormComponentTemplateData.imports.vue.values.add('watch');
    batchFormComponentTemplateData.imports.vue.types.add('PropType');

    if (
      componentTemplateSchemaProperties
        .filter(({ name, extra }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name) && !/^(file|image)$/.test(extra.inputRender))
        .some(({ type, extra }) => /^(checkbox|inputTag|selectMultiple(Create)?)$/.test(extra.inputRender) && !type.endsWith('[]'))
    ) {
      batchFormComponentTemplateData.imports['@/utils'].values.add('parseJsonString');
    }
    if (
      componentTemplateSchemaProperties
        .filter(({ name, extra }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name) && !/^(file|image)$/.test(extra.inputRender))
        .some(({ type, extra }) => extra.inputRender === 'number' || (!extra.inputRender && type === 'number'))
    ) {
      batchFormComponentTemplateData.imports['@/utils'].values.add('numberFormatter');
      batchFormComponentTemplateData.imports['@/utils'].values.add('numberParser');
    }

    batchFormComponentTemplateData.entity.dictCodes = Array.from(new Set(
      componentTemplateSchemaProperties
        .filter(({ name, extra }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name) && !/^(file|image)$/.test(extra.inputRender))
        .filter(({ extra }) => (!extra.inputRender || /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.inputRender)) && extra.optionsFromDict)
        .map(({ extra }) => extra.optionsFromDict as string)
    ));
    if (batchFormComponentTemplateData.entity.dictCodes.length) {
      batchFormComponentTemplateData.imports[serviceDir].values.add('getAllDictItems');
      batchFormComponentTemplateData.imports['@/utils'].values.add('getErrorMessage');
      batchFormComponentTemplateData.imports['@/utils'].values.add('useRequestRecord');
      batchFormComponentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
    }
    batchFormComponentTemplateData.entity.entities = Array.from(
      new Map(
        componentTemplateSchemaProperties
          .filter(({ name, extra }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name) && !/^(file|image)$/.test(extra.inputRender))
          .filter(({ extra }) => /^(select(Multiple(Create)?)?|autoComplete|radio|checkbox)$/.test(extra.inputRender) && extra.optionsFromEntity)
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
    if (batchFormComponentTemplateData.entity.entities.length) {
      batchFormComponentTemplateData.entity.entities.forEach(({ Names }) => {
        batchFormComponentTemplateData.imports[serviceDir].values.add(`getAll${Names}`);
      });
      batchFormComponentTemplateData.imports['@/utils'].values.add('getErrorMessage');
      batchFormComponentTemplateData.imports['@/utils'].values.add('useRequest');
      batchFormComponentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
    }

    const batchFormComponentPath = `./${joinPath(relative(dirname(componentTemplate.dist), batchFormComponentTemplate.dist))}`;
    componentTemplateData.imports[batchFormComponentPath].default = `${componentName}BatchForm`;

    if (componentTemplateData.functions.batchCreate) {
      componentTemplateData.functions.batchCreate.component = `${componentName}BatchForm`;
    }
    if (componentTemplateData.functions.batchCopy) {
      componentTemplateData.functions.batchCopy.component = `${componentName}BatchForm`;
    }
    if (componentTemplateData.functions.batchUpdate) {
      componentTemplateData.functions.batchUpdate.component = `${componentName}BatchForm`;
    }
  }

  // 选择实体标题字段
  if (
    componentTemplateData.functions.detail ||
    componentTemplateData.functions.update ||
    componentTemplateData.functions.delete
  ) {
    componentTemplateData.entity.titleField = await prompt<string>({
      message: '请选择实体标题字段:',
      type: 'autocomplete',
      source: async (_, keyword) => (
        componentTemplateSchemaProperties
          .filter(({ name }) => !/^(id|entityUuid|.+Id|createdBy|createdTime|lastModifiedBy|lastModifiedTime)$/.test(name))
          .map(({ name, description }) => ({ name: `${name}（${description}）`, value: name }))
          .filter(({ name }) => !keyword || new RegExp(keyword, 'i').test(name))
      ),
    });
  }

  // 明细组件配置
  if (componentTemplateData.functions.detail) {
    // 初始化明细组件模板
    detailComponentTemplate = {
      dist: undefined as any as string,
      content: {
        template: joinPath(__dirname, 'detail.ejs'),
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
    templateFiles.push(detailComponentTemplate);
    detailComponentTemplateData = (detailComponentTemplate.content as EjsContent).data as DetailComponentTemplateData;
    detailComponentTemplateData.schema = componentTemplateData.schema;

    detailComponentTemplateData.imports['@/components/Descriptions'].default = 'Descriptions';
    detailComponentTemplateData.imports['@/components/Descriptions'].types.add('DescriptionsColumnData');
    detailComponentTemplateData.imports.lodash.values.add('cloneDeep');
    detailComponentTemplateData.imports.vue.values.add('computed');

    if (
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id)$/.test(name))
        .some(({ type }) => type === 'number')
    ) {
      detailComponentTemplateData.imports['@/components/DataView'].values.add('NumberView');
    }
    if (
      componentTemplateSchemaProperties
        .filter(({ name }) => !/^(id|entityUuid|.+Id)$/.test(name))
        .some(({ type }) => type === 'boolean')
    ) {
      detailComponentTemplateData.imports['@/components/DataView'].values.add('BooleanView');
    }

    detailComponentTemplateData.entity.titleField = componentTemplateData.entity.titleField!;

    // 选择明细组件类型
    detailComponentTemplateData.type = await prompt<string>({
      message: '请选择明细组件类型:',
      type: 'list',
      choices: [
        { name: '页面', value: 'page' },
        { name: '抽屉', value: 'drawer' },
      ],
    });
    if (detailComponentTemplateData.type === 'page') {
      const detailComponentDir = await componentDirSelect({
        name: '明细组件',
        types: ['page'],
        recommendPath: `src/pages/${componentName}`,
      });
      detailComponentTemplate.dist = `${detailComponentDir}/${componentName}Detail.vue`;

      detailComponentTemplateData.imports[serviceDir].values.add(`get${componentTemplateData.schema.extra.Name}`);
      detailComponentTemplateData.imports['@/stores/system'].values.add('useSystem');
      detailComponentTemplateData.imports['@/utils'].values.add('getEntityUpdate');
      detailComponentTemplateData.imports['@/utils'].values.add('getErrorMessage');
      detailComponentTemplateData.imports['@/utils'].values.add('useRequest');
      detailComponentTemplateData.imports['@arco-design/web-vue'].values.add('Message');
      detailComponentTemplateData.imports.vue.values.add('ref');
      detailComponentTemplateData.imports.vue.values.add('watchEffect');
      detailComponentTemplateData.imports['vue-router'].values.add('useRoute');

      if (componentTemplateData.functions.update) {
        detailComponentTemplateData.imports[serviceDir].values.add(`partialUpdate${componentTemplateData.schema.extra.Name}`);
        detailComponentTemplateData.imports['@/utils'].values.add('getModelFilesUpdate');
        detailComponentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
        let formComponentPath = joinPath(relative(dirname(detailComponentTemplate.dist), formComponentTemplate!.dist));
        if (formComponentPath.startsWith('../../')) {
          formComponentPath = formComponentPath.replace(/^(\.{2}\/){2}/, '@/');
        } else if (formComponentPath.startsWith('../')) {
          formComponentPath = formComponentPath.replace(/^\.{2}\//, '@/pages/');
        } else {
          formComponentPath = `./${formComponentPath}`;
        }
        detailComponentTemplateData.imports[formComponentPath].default = `${componentName}Form`;
        detailComponentTemplateData.functions.update = {};
        detailComponentTemplateData.functions.update.component = `${componentName}Form`;
      }
      if (componentTemplateData.functions.delete) {
        detailComponentTemplateData.imports[serviceDir].values.add(`delete${componentTemplateData.schema.extra.Name}`);
        detailComponentTemplateData.imports['@arco-design/web-vue'].values.add('Modal');
        detailComponentTemplateData.functions.delete = {};
      }

      componentTemplateData.functions.detail.type = 'navigate';
      componentTemplateData.functions.detail.route = `${componentName}Detail`;
    } else {
      detailComponentTemplate.dist = `${subComponentDir}/${componentName}Detail.vue`;
      detailComponentTemplateData.imports[serviceDir].types.add(componentTemplateData.schema.name);
      detailComponentTemplateData.imports.vue.types.add('PropType');

      const detailComponentPath = `./${joinPath(relative(dirname(componentTemplate.dist), detailComponentTemplate.dist))}`;
      componentTemplateData.imports[detailComponentPath].default = `${componentName}Detail`;
      componentTemplateData.imports['@arco-design/web-vue'].values.add('Drawer');
      componentTemplateData.functions.detail.type = 'view';
      componentTemplateData.functions.detail.component = `${componentName}Detail`;
    }
  }

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
    detailComponentTemplateData!,
    formComponentTemplateData!,
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
    titleField?: string;
    dictCodes: string[];
    entities: {
      Names: string;
      name: string;
      description: string;
    }[];
  };
  functions: Record<string, Record<string, any>>;
};

type DetailComponentTemplateData = {
  schema: Schema;
  imports: Record<string, {
    default?: string;
    values: Set<string>;
    types: Set<string>;
  }>;
  entity: {
    titleField: string;
  };
  functions: Record<string, Record<string, any>>;
  type: string;
};

type FormComponentTemplateData = {
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

type BatchFormComponentTemplateData = {
  schema: Schema;
  imports: Record<string, {
    default?: string;
    values: Set<string>;
    types: Set<string>;
  }>;
  entity: {
    dictCodes: string[];
    entities: {
      Names: string;
      name: string;
      description: string;
    }[];
  };
};