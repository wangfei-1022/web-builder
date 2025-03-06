import { getInterfaceType, getSeparatorCase, joinPath, type Request, type SchemaBase } from '@cloudplex/cortex';

export default function resourceGenerator(requests: Request[]) {
  const template = joinPath(__dirname, 'resource.ejs');

  // 准备数据
  const resourceRecord: Record<string, {
    requireSet: Set<string>;
    requests: Request[];
  }> = {};
  requests
    .forEach(request => {
      request.from.forEach(fileName => {
        const dist = `./resources/${fileName}.ts`;
        if (!resourceRecord[dist]) {
          resourceRecord[dist] = { requireSet: new Set(), requests: [] };
        }
        const schemas: SchemaBase[] = [];
        if (request.params) {
          schemas.push(...request.params);
        }
        if (request.body) {
          schemas.push(request.body);
        }
        if (request.query) {
          schemas.push(...request.query);
        }
        if (request.return) {
          schemas.push(request.return);
        }
        schemas.forEach(schema => {
          if (schema.type === 'ref') {
            resourceRecord[dist].requireSet.add(schema.refType);
          } else if (
            schema.type === 'array' &&
            schema.item.type === 'ref'
          ) {
            resourceRecord[dist].requireSet.add(schema.item.refType);
          }
        });
        resourceRecord[dist].requests.push(request);
      });
    });

  return Object
    .entries(resourceRecord)
    .map(([dist, resource]) => {
      // 生成模板依赖数据
      const requireContent = resource.requireSet.size
        ? `import type { ${Array.from(resource.requireSet)
          .sort((schemaName_0, schemaName_1) => {
            const compare_0 = schemaName_0.toLowerCase();
            const compare_1 = schemaName_1.toLowerCase();
            if (compare_0 < compare_1) return -1;
            if (compare_0 > compare_1) return 1;
            return 0;
          })
          .join(', ')} } from '../interfaces';`
        : undefined;

      // 生成模板请求数据
      const requests = resource.requests
        .map(request => {
          const templateRequest = {
            name: request.name,
            description: request.description,
            contentType: request.contentType,
            url: `\`\${__${getSeparatorCase(request.service, { mode: 'upper', separator: '_' })}__}${request.path}\``,
            method: request.method !== 'GET'
              ? request.method
              : undefined,
            headers: [
              {
                key: 'authorization',
                value: '`Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`',
              },
              {
                key: 'contentType',
                value: (request.contentType && request.contentType !== 'application/json')
                  ? `'${request.contentType}'`
                  : undefined,
              },
            ]
              .filter(({ value }) => value),
            params: request.params
              ?.map(param => {
                const templateRequestParam = {
                  name: param.name,
                  description: param.description,
                  type: param.type,
                }
                return templateRequestParam;
              }),
            body: request.body
              ? getInterfaceType(request.body, { objectIndent: 2 })
              : undefined,
            queryRequired: request.queryRequired,
            query: request.query
              ?.map(param => {
                const templateRequestParam = {
                  name: param.name,
                  description: param.description,
                  required: param.required,
                  type: getInterfaceType(param, { objectIndent: 4, objectPropFlag: 'notNull' }),
                }
                if (templateRequestParam.type.endsWith('[]')) {
                  templateRequestParam.type = `${templateRequestParam.type.slice(0, -2)} | ${templateRequestParam.type}`;
                }
                return templateRequestParam;
              }),
            return: getInterfaceType(request.return, { objectIndent: 2, objectPropFlag: 'notOptional' }),
          };
          if (!/^(string|number|boolean|Blob|void)$/.test(templateRequest.return)) {
            templateRequest.return = `OptimizeModel<${templateRequest.return}>`;
          }
          return templateRequest;
        });

      return {
        dist,
        content: {
          template,
          data: {
            requireContent,
            requests,
          },
        },
      };
    });
}