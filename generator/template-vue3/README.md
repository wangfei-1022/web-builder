# Cortex App

欢迎使用 Cortex App

## 开发调试

```bash
pnpm run dev
```

接下来就可以编写并且实时预览和调试应用了。

## 修改应用名称

```ts
// cortex.config.ts
export default defineConfig({
  name: '{app-name}',                             // 应用名称，默认为 `'Cortex App'`
});
```

在 .ts(x) 或 index.html 文件中使用：

```ts
__APP_NAME__;
```

在 vue 模板中使用：

```vue
<template>
  <div>{{ appName }}</div>
</template>

<script lang="ts" setup>
const appName = __APP_NAME__;
</script>
```

## 新增服务

配置服务：

```ts
// cortex.config.ts
export default defineConfig({
  services: [
    {
      name: '{service-name}',                     // 服务名称
      openAPIDoc: '{service-openapi-doc-url}',    // openAPI doc 地址
      gitee: {                                    // 码云配置，可选
        owner: '{owner-name}',                      // 所属组织名称
        repo: '{repository-name}',                  // 仓库名称
        branch: '{branch-name}',                    // 分支名称，可选，默认为 `'master'`
      },
    },
  ],
});
```

在根目录下创建 `.env` 文件（该文件不会通过 `git` 同步），并配置以下信息。

```bash
# .env
GITEE_ACCESS_TOKEN="git-access-token"
```

生成代码：

```bash
pnpm run generate-services
```

接下来就可以在代码中导入 `@/services/{service-name}` 使用已生成的服务了。

## 接入服务

搜索引用到以下路径的文件替换服务，完成应用基础功能。

- @/services/demo-service

删除以下文件夹：

- src/services/demo-service

## 生成组件

```bash
pnpm run generate-component
```

目前提供了3个组件模板：

- 实体表格
- 实体表单
- 实体选择器

> 注意：生成组件使用的是本地数据，如果远程有 API 变动，请重新生成服务再操作。

JDL 文件可以使用单行注释填写以下描述，以辅助组件生成：

```ts
interface FieldExtra {
  /** 是否可见（表格列使用） */
  visible?: boolean | 'always';
  /** 显示宽度（表格列使用） */
  width?: number;
  /** 开启排序（表格列使用） */
  sortable?: boolean;
  /** 字段值选项（表单和表格筛选使用） */
  options?: string[] | 'dict:{dictCode}' | 'entity:{EntityName}.{fieldName}';
  /**
   * 输入渲染方式（表单和表格筛选使用）
   * @description 类型为数字、布尔、日期、时间时，会根据类型自动推断，可以缺省
   * @description 类型为字符串时，缺省会使用 `'input'` 渲染
   * @description 类型为对象、数组时，缺省会使用 `'select'` 渲染
   * @description 若填写了 `options`，缺省会使用 `'select'` 渲染
   */
  inputRender?: 'autoComplete' | 'boolean' | 'checkbox' | 'date' | 'datetime' | 'file' | 'image' | 'input' | 'inputTag' | 'number' | 'radio' | 'select' | 'selectMultiple' | 'selectMultipleCreate' | 'textarea';
  /** 筛选字段（表格筛选使用） */
  filter?: boolean | 'inMore';
  /**
   * 筛选渲染方式（表格筛选使用）
   * @description 缺省时会根据 `inputRender` 进行渲染
   */
  filterRender?: 'autoComplete' | 'boolean' | 'checkbox' | 'date' | 'datetime' | 'input' | 'inputTag' | 'number' | 'radio' | 'select' | 'selectMultiple' | 'selectMultipleCreate' | 'textarea';
}
```

## 修改布局配置

```ts
// src/layouts/*/layout.config.ts
import { defineLayout } from '@/utils';

export default defineLayout({
  name: '{layout-name}',                          // 布局名称
  path: '{route-path}',                           // 路由路径
  component: {LayoutComponent},                   // 布局组件
  welcomePage: {BaseLayoutWelcome},               // 欢迎页面组件
  refreshPage: {BaseLayoutRefresh},               // 刷新页面组件，可选
});
```

修改菜单配置：

```ts
// src/layouts/*/menu.config.ts
import { defineMenu } from '@/utils';

export default defineMenu([
  {
    type: '{menu-type}',                          // 菜单类型，可选，默认为 `'route'`
    icon: {IconComponent},                        // 菜单图标，可选
    route: '{route-name}',                        // 路由名称，菜单类型为 `'route'` 时必填
    title: '{menu-title}',                        // 标题，菜单类型为 `'folder'`、`'group'` 时必填
    children: {MenuConfig},                       // 子级，菜单类型为 `'folder'`、`'group'` 时必填
  },
]);
```

## 修改页面配置
```ts
// src/pages/*/page.config.ts
import { definePages } from '@/utils';

export default definePages([
  {
    layout: '{layout-name}',                      // 所属布局，可选
    title: '{page-title}',                        // 页面标题
    name: '{route-name}',                         // 路由名称
    path: '{route-path}',                         // 路由路径
    component: {PageComponent},                   // 页面组件，支持异步组件 `() => import('{PageComponentPath}')` 构建将拆分成独立文件
    props: { [{propName}]: {propValue} },         // 页面组件属性，可选
    parentName: '{parent-page-route-name}',       // 父级路由名称，可选
    permission: '{permission-value}',             // 权限，可选
    initOpen: false,                              // 初始化打开，可选，默认为 `false`
    resident: false,                              // 常驻后台，可选，默认为 `false`
  },
]);
```

## 构建应用

```bash
pnpm run build
```

构建产物会生成到 `dist` 目录中。

## 预览应用

```bash
pnpm run preview
```

构建完成后就可以在本地预览应用了，通常会在此步骤测试上线效果。

## 部署应用

配置部署：

```ts
// cortex.config.ts
export default defineConfig({
  deploy: {
    branch: '{branch-name}',                      // 部署分支，可选，默认为 `'master'`
    dir: '{dir}',                                 // 部署目录，可选，默认为 `'dist'`
    host: '{remote-host}',                        // 远程主机
    port: 0,                                      // 远程端口
    path: '/{remote-path}',                       // 远程路径
    base: '/{base-name}/',                        // 基础路径，可选，默认为 `'/'`
  },
});
```

设置ssh用户名和密码：

```bash
# .env
SSH_USER_NAME=**                                  # ssh用户名
SSH_PASSWORD=**                                   # ssh密码
```

执行命令：

```bash
pnpm run deploy
```

构建产物会通过 `ssh` 部署到配置的服务器上，并在 `git` 创建相应版本的 `tag`。

> 注意：应用版本号小于 `1.0.0` 会跳过创建 `tag` 部署。