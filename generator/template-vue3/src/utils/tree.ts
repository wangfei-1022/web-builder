import { get, type PropertyPath } from 'lodash';

// export interface TreeNode<Data extends Record<string, any> = Record<string, any>> {
//   raw: Data;
//   parent: TreeNode<Data>;
//   children?: TreeNode<Data>[];
// };

// export type TreeNode2<
//   Data extends Record<string, any> = Record<string, any>,
//   ResultParentKey extends string = 'parent',
//   ResultChildrenKey extends string = 'children',
//   > = {
//     raw: Data;
//   } & {
//     [parent in ResultParentKey]: TreeNode2<Data, ResultParentKey, ResultChildrenKey>;
//   } & {
//     [chilren in ResultChildrenKey]?: TreeNode2<Data, ResultParentKey, ResultChildrenKey>[];
//   };

// /** 树节点引用 */
// export interface TreeNodeRef<
//   NodeData extends Record<string, any> = Record<string, any>,
//   ResultNodeData extends Record<string, any> = Record<string, any>,
//   > {
//   /** 源数据 */
//   raw: NodeData;
//   /** 根级源数据 */
//   rootRaw: NodeData;
//   /** 父级源数据 */
//   parentRaw?: NodeData;
//   /** 子级 */
//   children?: ResultNodeData[];
//   /** 层级 */
//   level: number;
// }

// /**
// * 映射树节点
// * @param treeData 树数据
// * @param callback 回调
// * @param options 选项
// */
// export function mapTreeNode2<
//   NodeData extends Record<string, any> = Record<string, any>,
//   ResultNodeData extends Record<string, any> = Record<string, any>,
//   >(
//     treeData: NodeData[],
//     callback: (treeNodeRef: TreeNodeRef<NodeData, ResultNodeData>, index: number, array: NodeData[]) => ResultNodeData | null,
//     options?: {
//       /** 子级 key，默认为 `'children'` */
//       childrenKey?: string;
//     },
// ) {
//   const { childrenKey = 'children' } = options ?? {};
//   const loopNodes = (raws: NodeData[], rootRaw?: NodeData, parentRaw?: NodeData, level = 1): ResultNodeData[] => {
//     return raws
//       .map((raw, index, array) => {
//         const nodeRef: TreeNodeRef<NodeData, ResultNodeData> = {
//           raw,
//           rootRaw: rootRaw ?? raw,
//           parentRaw,
//           level,
//         };
//         if (raw[childrenKey]) {
//           nodeRef.children = loopNodes(raw[childrenKey], nodeRef.rootRaw, raw, level + 1);
//         }
//         return callback(nodeRef, index, array)!;
//       })
//       .filter(result => result);
//   };
//   return loopNodes(treeData);
// }

// /**
//  * 制作树
//  * @param objects 对象列表
//  * @param options 选项
//  */
// export function makeTree2<
//   Data extends Record<string, any> = Record<string, any>,
//   ResultNodeData extends Record<string, any> = Record<string, any>,
//   >(
//     objects: Data[],
//     options?: {
//       /** key，默认为 `'id'` */
//       key?: string;
//       /** 父级 key，默认为 `['parent', 'id']` */
//       parentKey?: PropertyPath;
//       /** 映射方法 */
//       map?: (treeNodeRef: TreeNodeRef<Data, ResultNodeData>, index: number, array: Data[]) => ResultNodeData | null,
//     },
// ): ResultNodeData[] {
//   const {
//     key = 'id',
//     parentKey = ['parent', 'id'],
//     map = (result: TreeNodeRef<Data, ResultNodeData>): ResultNodeData => ({}),
//   } =
//     options ?? {};
//   const objectRecord: Record<string, TreeNode<Data>> = {};
//   objects.forEach(object => {
//     // 生成节点
//     const objectKey = object[key];
//     let objectResult = objectRecord[objectKey];
//     if (!objectResult) {
//       objectResult = objectRecord[objectKey] = {} as TreeNode<Data>;
//     }
//     objectResult.raw = object;
//     // 生成父级节点
//     const parentObjectKey = get(object, parentKey, null);
//     let parentObjectResult = objectRecord[parentObjectKey];
//     if (!parentObjectResult) {
//       parentObjectResult = objectRecord[parentObjectKey] = {} as TreeNode<Data>;
//     }
//     // 加入父级节点子级
//     let parentObjectResultChildren = parentObjectResult.children;
//     if (!parentObjectResultChildren) {
//       parentObjectResultChildren = parentObjectResult.children = [];
//     }
//     parentObjectResultChildren.push(objectResult);
//   });
//   const treeData = Object
//     .values(objectRecord)
//     .filter(object => !object.raw)
//     .map(object => object.children!)
//     .flat();
//   return mapTreeNode2(treeData, (nodeRef, index, array) => map(
//     {
//       raw: nodeRef.raw.raw,
//       rootRaw: nodeRef.rootRaw.raw,
//       parentRaw: nodeRef.parentRaw?.raw,
//       children: nodeRef.children,
//       level: nodeRef.level,
//     },
//     index,
//     array.map(item => item.raw),
//   ));
// }

/** 树节点数据 */
export type TreeNodeDataWithParent<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  ParentKey extends string = 'parent',
  > = TreeNodeData & {
    [parent in ParentKey]?: TreeNodeDataWithParent<TreeNodeData, ParentKey>;
  };

/** 树节点数据 */
export type TreeNodeDataWithChildren<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  ChildrenKey extends string = 'children',
  > = TreeNodeData & {
    [children in ChildrenKey]?: TreeNodeDataWithChildren<TreeNodeData, ChildrenKey>;
  };

/** 树节点事件 */
export type TreeNodeEvent<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  ParentKey extends string = 'parent',
  > = {
    item: TreeNodeData;
    index: number;
    array: TreeNodeData[];
  } & {
    [parent in ParentKey]: TreeNodeDataWithParent<TreeNodeData, ParentKey> | undefined;
  };

/**
 * 制作树
 * @param objects 对象列表
 * @param options 选项
 */
export function makeTree<
  Data extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
  ResultChildrenKey extends string = 'children',
  >(
    objects: Data[],
    options?: {
      /** key，默认为 `'id'` */
      key?: string;
      /** 父级 key，默认为 `['parent', 'id']` */
      parentKey?: PropertyPath;
      /** 结果子级列表 key，默认为 `'children'` */
      resultChildrenKey?: ResultChildrenKey;
      /** 映射方法 */
      map?: (object: TreeNodeDataWithChildren<Data, ResultChildrenKey>) => Result | null;
    },
): TreeNodeDataWithChildren<Result, ResultChildrenKey>[] {
  const {
    key = 'id',
    parentKey = ['parent', 'id'],
    resultChildrenKey = 'children',
    map,
  } = options || {};
  const objectRecord: Record<string, Record<string, any>> = {};
  objects.forEach(object => {
    // 生成对象
    const objectKey = object[key];
    let objectResult = objectRecord[objectKey];
    if (!objectResult) {
      objectResult = objectRecord[objectKey] = {};
    }
    Object.assign(objectResult, object);
    // 生成父级对象
    const parentObjectKey = get(object, parentKey, null);
    let parentObjectResult = objectRecord[parentObjectKey];
    if (!parentObjectResult) {
      parentObjectResult = objectRecord[parentObjectKey] = {};
    }
    // 加入父级对象子级列表
    let parentObjectResultChildren: Record<string, any>[] = parentObjectResult[resultChildrenKey];
    if (!parentObjectResultChildren) {
      parentObjectResultChildren = parentObjectResult[resultChildrenKey] = [];
    }
    parentObjectResultChildren.push(objectResult);
  });
  const treeData = Object
    .values(objectRecord)
    .filter(object => !object[key])
    .map(object => object[resultChildrenKey])
    .flat();
  return map
    ? mapTreeNode(treeData, ({ item }) => map!(item), { resultChildrenKey })
    : treeData;
}

/**
* 映射树节点
* @param treeData 树数据
* @param callback 回调
* @param options 选项
*/
export function mapTreeNode<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  RuntimeParentKey extends string = 'parent',
  ResultChildrenKey extends string = 'children',
  ResultNodeData extends Record<string, any> = Record<string, any>,
  >(
    treeData: TreeNodeData[],
    callback: (event: TreeNodeEvent<TreeNodeData, RuntimeParentKey>) => ResultNodeData | null,
    options?: {
      /** 子级列表 key，默认为 `'children'` */
      childrenKey?: string;
      /** 运行时父级 key，默认为 `'parent'` */
      runtimeParentKey?: RuntimeParentKey;
      /** 结果子级列表 key，默认为 `'children'` */
      resultChildrenKey?: ResultChildrenKey;
      /** 清理没有子级节点 */
      noChildrenClean?: boolean;
    },
    runtimeParent?: TreeNodeDataWithParent<TreeNodeData, RuntimeParentKey>,
): TreeNodeDataWithChildren<ResultNodeData, ResultChildrenKey>[] {
  const {
    childrenKey = 'children',
    runtimeParentKey = 'parent' as RuntimeParentKey,
    resultChildrenKey = 'children' as ResultChildrenKey,
    noChildrenClean,
  } = options || {};
  return treeData
    .map((item, index, array) => {
      const itemResult = callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
      if (itemResult && item[childrenKey]) {
        const itemChildrenResult = mapTreeNode(item[childrenKey], callback, options, { ...item, [runtimeParentKey]: runtimeParent });
        if (noChildrenClean && itemChildrenResult.length === 0) return null;
        itemResult[resultChildrenKey] = itemChildrenResult as any;
      }
      return itemResult;
    })
    .filter(item => item) as any;
}

/**
* 遍历树节点
* @param treeData 树数据
* @param callback 回调
* @param options 选项
*/
export function eachTreeNode<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  RuntimeParentKey extends string = 'parent',
  >(
    treeData: TreeNodeData[],
    callback: (event: TreeNodeEvent<TreeNodeData, RuntimeParentKey>) => boolean | void,
    options?: {
      /** 子级列表 key，默认为 `'children'` */
      childrenKey?: string;
      /** 运行时父级 key，默认为 `'parent'` */
      runtimeParentKey?: RuntimeParentKey;
      /** 回调顺序，默认为 `'pre'` */
      flush?: 'pre' | 'post';
    },
    runtimeParent?: TreeNodeDataWithParent<TreeNodeData, RuntimeParentKey>,
) {
  const {
    childrenKey = 'children',
    runtimeParentKey = 'parent' as RuntimeParentKey,
    flush = 'pre',
  } = options || {};
  return treeData.forEach((item, index, array) => {
    if (flush === 'pre') {
      callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
    }
    if (item[childrenKey]) {
      eachTreeNode(item[childrenKey], callback, options, { ...item, [runtimeParentKey]: runtimeParent });
    }
    if (flush === 'post') {
      callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
    }
  });
}

/**
* 测试一个树节点
* @param treeData 树数据
* @param callback 回调
* @param options 选项
*/
export function someTreeNode<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  RuntimeParentKey extends string = 'parent',
  >(
    treeData: TreeNodeData[],
    callback: (event: TreeNodeEvent<TreeNodeData, RuntimeParentKey>) => boolean | void,
    options?: {
      /** 子级列表 key，默认为 `'children'` */
      childrenKey?: string;
      /** 运行时父级 key，默认为 `'parent'` */
      runtimeParentKey?: RuntimeParentKey;
      /** 回调顺序，默认为 `'pre'` */
      flush?: 'pre' | 'post';
    },
    runtimeParent?: TreeNodeDataWithParent<TreeNodeData, RuntimeParentKey>,
) {
  const {
    childrenKey = 'children',
    runtimeParentKey = 'parent' as RuntimeParentKey,
    flush = 'pre',
  } = options || {};
  return treeData.some((item, index, array) => {
    if (flush === 'pre') {
      const result = callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
      if (result) return true;
    }
    if (item[childrenKey]) {
      const result = someTreeNode(item[childrenKey], callback, options, { ...item, [runtimeParentKey]: runtimeParent });
      if (result) return true;
    }
    if (flush === 'post') {
      const result = callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
      if (result) return true;
    }
    return false;
  });
}

/**
* 测试全部树节点
* @param treeData 树数据
* @param callback 回调
* @param options 选项
*/
export function everyTreeNode<
  TreeNodeData extends Record<string, any> = Record<string, any>,
  RuntimeParentKey extends string = 'parent',
  >(
    treeData: TreeNodeData[],
    callback: (event: TreeNodeEvent<TreeNodeData, RuntimeParentKey>) => boolean | void,
    options?: {
      /** 子级列表 key，默认为 `'children'` */
      childrenKey?: string;
      /** 运行时父级 key，默认为 `'parent'` */
      runtimeParentKey?: RuntimeParentKey;
      /** 回调顺序，默认为 `'pre'` */
      flush?: 'pre' | 'post';
    },
    runtimeParent?: TreeNodeDataWithParent<TreeNodeData, RuntimeParentKey>,
) {
  const {
    childrenKey = 'children',
    runtimeParentKey = 'parent' as RuntimeParentKey,
    flush = 'pre',
  } = options || {};
  return treeData.every((item, index, array) => {
    if (flush === 'pre') {
      const result = callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
      if (result) return true;
    }
    if (item[childrenKey]) {
      const result = everyTreeNode(item[childrenKey], callback, options, { ...item, [runtimeParentKey]: runtimeParent });
      if (result) return true;
    }
    if (flush === 'post') {
      const result = callback({ item, index, array, [runtimeParentKey]: runtimeParent } as any);
      if (result) return true;
    }
    return false;
  });
}