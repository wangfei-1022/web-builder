import { defineConfig } from '@cloudplex/cortex';

export default defineConfig({
  name: "EIST",
  template: {
    service: {
      resource: 'templates/resource/index.ts',
    },
    components: [
      { name: '实体表格', generator: 'templates/table/index.ts' },
      { name: '实体表单', generator: 'templates/form/index.ts' },
      { name: '实体选择器', generator: 'templates/select/index.ts' },
    ],
  },
  services: [
    {
      name: 'test-service',                     // 服务名称
      openAPIDoc: 'http://127.0.0.1:1022/static/api-doc.json',    // openAPI doc 地址
      gitee: {                                    // 码云配置，可选
        owner: 'wangfei-1022',                      // 所属组织名称
        repo: 'fly',                  // 仓库名称
        branch: 'master',                    // 分支名称，可选，默认为 `'master'`
      },
    },
    {
        name: 'base-service',                     // 服务名称
        openAPIDoc: 'http://127.0.0.1:1022/static/base-service-api-docs.json',    // openAPI doc 地址
        gitee: {                                    // 码云配置，可选
          owner: 'wangfei-1022',                      // 所属组织名称
          repo: 'fly',                  // 仓库名称
          branch: 'master',                    // 分支名称，可选，默认为 `'master'`
        },
      },
  ],
});