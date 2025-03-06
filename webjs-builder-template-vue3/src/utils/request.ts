import router from '@/router';
import useUserStore from '@/stores/user';
import dayjs from 'dayjs';
import { debounce, throttle, type DebounceSettings, type ThrottleSettings } from 'lodash';
import { stringify } from 'qs';
import { reactive, watch } from 'vue';
import { optimizeObject } from './data';
import { getCamelCase, getSeparatorCase } from './string';

/**
 * 请求
 * @param options 选项
 */
export async function request<
  Data = any,
  RequestData extends Record<string, any> = Record<string, any>,
  >(
    options: RequestOptions<RequestData>,
): Promise<Response<Data, RequestData>> {
  const query = options.params && stringify(decodeData(optimizeObject(options.params)), { arrayFormat: 'repeat' });
  const url = `${options.url}${query ? `${options.url.includes('?') ? '&' : '?'}${query}` : ''}`;
  const headers = new Headers();
  const init: RequestInit = {
    method: options.method,
    headers,
  };
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      const name = getSeparatorCase(key, { mode: 'pascal' });
      const values = Array.isArray(value) ? value : [value];
      values
        .filter(value => value ?? undefined)
        .forEach(value => {
          if (typeof value === 'string') {
            headers.append(name, value);
          } else {
            headers.append(name, JSON.stringify(value));
          }
        });
    });
  }
  if (options.data) {
    const body = decodeData(optimizeObject(options.data, null));
    if (headers.get('Content-Type') === 'multipart/form-data') {
      const formData = new FormData();
      Object
        .entries(body)
        .filter(([, value]) => value ?? undefined)
        .forEach(([key, value]) => {
          if (typeof value === 'string' || value instanceof Blob) {
            formData.append(key, value);
          } else {
            formData.append(key, JSON.stringify(value));
          }
        });
      headers.delete('Content-Type');
      init.body = formData;
    } else {
      headers.append('Content-Type', 'application/json');
      init.body = JSON.stringify(body);
    }
  }
  const response: Response = {
    request: options,
    status: 0,
    statusText: '请求异常',
    headers: {},
    data: undefined,
  };
  try {
    const res = await fetch(url, init);
    const ok = res.status >= 200 && res.status < 400;
    response.status = res.status;
    response.statusText = res.statusText;
    res.headers.forEach((value, name) => {
      response.headers[getCamelCase(name)] = value;
    });
    switch (response.headers.contentType) {
      case 'application/json':
      case 'application/problem+json':
        response.data = encodeData(await res.json());
        break;
      case 'application/octet-stream':
        response.data = await (ok ? res.blob() : res.json());
        break;
      default:
        response.data = await res.text();
    }
    if (!ok) {
      if (response.status === 401) {
        if (response.data.detail === 'Full authentication is required to access this resource') {
          response.data.detail = '登录信息失效';
        }
        const userStore = useUserStore();
        if (userStore.passport) {
          const { name, fullPath } = router.currentRoute.value;
          navigateToLogin(name, fullPath);
        }
      }
      throw new ResponseError(response);
    }
  } catch (error) {
    throw new ResponseError(response, error as any);
  }
  return response as any;
}

export interface RequestOptions<
  Data extends Record<string, any> = Record<string, any>,
  > {
  /** 地址 */
  url: string;
  /** 方法 */
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** 头部 */
  headers?: Record<string, any>;
  /** 数据 */
  data?: Data;
  /** 参数 */
  params?: Record<string, any>;
}

export interface Response<
  Data = any,
  RequestData extends Record<string, any> = Record<string, any>,
  > {
  /** 请求 */
  request: RequestOptions<RequestData>;
  /** 状态码 */
  status: number;
  /** 状态文本 */
  statusText: string;
  /** 头部 */
  headers: Record<string, string>;
  /** 数据 */
  data: Data;
}

export class ResponseError extends Error {
  /** 响应 */
  response: Response;
  /** 请求 */
  request: RequestOptions<Record<string, any>>;
  constructor(response: Response, cause?: Error) {
    super(response.statusText, { cause });
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
    this.name = 'ResponseError';
    this.response = response;
    this.request = response.request;
  }
}

/**
 * 编码数据
 * @param data 数据
 */
function encodeData<DataType = any>(data: DataType): DataType {
  if (data instanceof Object) {
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Object) {
        encodeData(value);
      } else {
        // 编码时间
        if (/^\d{4}(-\d{2}){2}T(\d{2}:){2}\d{2}(\.\d+)?Z$/.test(value)) {
          (data as any)[key] = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    });
  }
  return data;
}

/**
 * 解码数据
 * @param data 数据
 */
function decodeData<DataType = any>(data: DataType): DataType {
  if (data instanceof Object) {
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Object) {
        decodeData(value);
      } else {
        // 解码时间
        if (/^\d{4}(-\d{2}){2} (\d{2}:){2}\d{2}(\.\d+)?$/.test(value)) {
          (data as any)[key] = new Date(value).toISOString();
        }
      }
    });
  }
  return data;
}

/**
 * 跳转登录页面
 */
const navigateToLogin = debounce((name: any, fullPath: string) => {
  if (name === 'Login') return;
  const userStore = useUserStore();
  userStore.logout();
  const redirect = encodeURIComponent(fullPath);
  router.push({
    name: 'Login',
    query: { redirect },
  });
}, 20);

/**
 * 使用请求
 * @param service 服务
 * @param options 选项
 */
export function useRequest<
  Params extends [any?] = [],
  Data = any,
  Error = any,
  >(
    service: (...params: Params) => Promise<Data>,
    options?: {
      /** 默认参数 */
      defaultParams?: Params[0];
      /** 手动请求 */
      manual?: boolean;
      /** 成功钩子 */
      onSuccess?: (data: Data, params: Params[0]) => void;
      /** 失败钩子 */
      onError?: (error: Error, params: Params[0]) => void;
      /** 加载状态延迟，默认为 `500` */
      loadingDelay?: number;
      /** 防抖间隔 */
      debounceInterval?: number;
      /** 防抖选项 */
      debounceOptions?: DebounceSettings,
      /** 节流间隔 */
      throttleInterval?: number;
      /** 节流选项 */
      throttleOptions?: ThrottleSettings;
      /** 格式化错误 */
      formatError?: (error: any) => Error;
    },
): UseRequestResult<Params, Data, Error> {
  const {
    loadingDelay = 500,
    debounceInterval,
    debounceOptions,
    throttleInterval,
    throttleOptions,
    onSuccess,
    onError,
    formatError,
    defaultParams,
    manual,
  } =
    options ?? {};

  // 状态
  const state = reactive({
    data: undefined as Data | undefined,
    pending: false,
    loading: false,
    error: undefined as Error | undefined,
    load: undefined as any as (...params: Params) => Promise<void>,
  });
  const internalState = {
    loadingCount: 0,
  };

  // 加载状态
  let updateLoading = (loading: boolean) => { state.loading = loading };
  if (loadingDelay > 0) {
    updateLoading = debounce(updateLoading, loadingDelay);
  }
  const setLoading = (loading: boolean) => {
    if (loading) {
      internalState.loadingCount++;
    } else {
      internalState.loadingCount--;
    }
    state.pending = internalState.loadingCount !== 0;
    updateLoading(state.pending);
  };

  // 加载
  state.load = async (...params) => {
    setLoading(true);
    try {
      state.data = await service(...params) as any;
      state.error = undefined;
      onSuccess?.(state.data as any, params[0]);
    } catch (error) {
      state.error = formatError ? formatError(error) : error as any;
      onError?.(state.error as any, params[0]);
    }
    setLoading(false);
  };
  if (debounceInterval as number > 0) {
    state.load = debounce(state.load, debounceInterval, debounceOptions) as any;
  }
  if (throttleInterval as number > 0) {
    state.load = throttle(state.load, throttleInterval, throttleOptions) as any;
  }
  if (
    !manual &&
    (service.length === 0 || defaultParams)
  ) {
    state.load(...[defaultParams] as any);
  }

  return state as any;
}

export interface UseRequestResult<
  Params extends [any?] = [],
  Data = any,
  Error = any,
  > {
  /** 数据 */
  data: Data | undefined;
  /** 挂起状态 */
  readonly pending: boolean;
  /** 加载状态 */
  readonly loading: boolean;
  /** 错误 */
  readonly error: Error | undefined;
  /** 加载 */
  readonly load: (...params: Params) => Promise<void>;
}

/**
 * 使用请求分页
 * @param service 服务
 * @param options 选项
 */
export function useRequestPagination<
  Data extends any[] = [],
  Error = any,
  >(
    service: (
      /** 参数 */
      params: {
        /** 页码 */
        current: number;
        /** 每页条数 */
        pageSize: number;
      },
    ) =>
      Promise<
        | {
          /** 数据 */
          data: Data;
          /** 总数 */
          total: number;
        }
        | void
      >,
    options?: {
      /** 初始页码，默认为 `1` */
      initialCurrent?: number;
      /** 初始每页条数，默认为 `20` */
      initialPageSize?: number;
      /** 手动请求 */
      manual?: boolean;
      /** 成功钩子 */
      onSuccess?: (data: Data) => void;
      /** 失败钩子 */
      onError?: (error: Error) => void;
      /** 加载状态延迟，默认为 `500` */
      loadingDelay?: number;
      /** 防抖间隔 */
      debounceInterval?: number;
      /** 防抖选项 */
      debounceOptions?: DebounceSettings,
      /** 节流间隔 */
      throttleInterval?: number;
      /** 节流选项 */
      throttleOptions?: ThrottleSettings;
      /** 格式化错误 */
      formatError?: (error: any) => Error;
    },
): UseRequestPaginationResult<Data, Error> {
  const {
    loadingDelay = 500,
    debounceInterval,
    debounceOptions,
    throttleInterval,
    throttleOptions,
    onSuccess,
    onError,
    formatError,
    initialCurrent = 1,
    initialPageSize = 20,
    manual,
  } =
    options ?? {};

  // 状态
  const state = reactive({
    current: initialCurrent > 0 ? initialCurrent : 1,
    pageSize: initialPageSize > 0 ? initialPageSize : 20,
    data: undefined as Data | undefined,
    total: 0,
    pending: false,
    loading: false,
    error: undefined as Error | undefined,
    load: undefined as any as () => Promise<void>,
    setCurrent: undefined as any as (current: number, forceLoad?: boolean) => void,
    setPageSize: undefined as any as (pageSize: number, forceLoad?: boolean) => void,
    setPagination: undefined as any as (current: number, pageSize: number, forceLoad?: boolean) => void,
  });
  const internalState = {
    loadingCount: 0,
  };

  // 加载状态
  let updateLoading = (loading: boolean) => { state.loading = loading };
  if (loadingDelay > 0) {
    updateLoading = debounce(updateLoading, loadingDelay);
  }
  const setLoading = (loading: boolean) => {
    if (loading) {
      internalState.loadingCount++;
    } else {
      internalState.loadingCount--;
    }
    state.pending = internalState.loadingCount !== 0;
    updateLoading(state.pending);
  };

  // 加载处理
  const loadHandle = async (): Promise<{
    data: Data;
    total: number;
  }> => {
    const result = await service({
      current: state.current,
      pageSize: state.pageSize,
    });
    const { data = [] as any as Data, total = 0 } = result ?? {};
    if (
      data.length === 0 &&
      state.current > 1
    ) {
      const maxCurrent = Math.ceil(total / state.pageSize);
      if (maxCurrent < state.current) {
        state.current = maxCurrent;
        return loadHandle();
      }
    }
    return { data, total };
  };

  // 加载
  state.load = async () => {
    setLoading(true);
    try {
      const { data, total } = await loadHandle();
      state.data = data as any;
      state.total = total;
      state.error = undefined;
      onSuccess?.(state.data as any);
    } catch (error) {
      state.error = formatError ? formatError(error) : error as any;
      onError?.(state.error as any);
    }
    setLoading(false);
  };
  if (debounceInterval as number > 0) {
    state.load = debounce(state.load, debounceInterval, debounceOptions) as any;
  }
  if (throttleInterval as number > 0) {
    state.load = throttle(state.load, throttleInterval, throttleOptions) as any;
  }
  if (!manual) {
    state.load();
  }
  watch(
    [
      () => state.current,
      () => state.pageSize,
    ],
    debounce(state.load, 20),
  );

  // 修改页码
  state.setCurrent = (current: number, forceLoad = false) => {
    current = current > 0 ? current : state.current;
    if (state.current !== current) {
      state.current = current;
    } else if (forceLoad) {
      state.load();
    }
  };

  // 修改每页条数
  state.setPageSize = (pageSize: number, forceLoad = false) => {
    pageSize = pageSize > 0 ? pageSize : state.pageSize;
    if (state.pageSize !== pageSize) {
      state.pageSize = pageSize;
    } else if (forceLoad) {
      state.load();
    }
  }

  // 同时修改页码和每页条数
  state.setPagination = (current: number, pageSize: number, forceLoad = false) => {
    current = current > 0 ? current : state.current;
    pageSize = pageSize > 0 ? pageSize : state.pageSize;
    if (state.current !== current) {
      state.current = current;
    }
    if (state.pageSize !== pageSize) {
      state.pageSize = pageSize;
    }
    if (
      state.current === current &&
      state.pageSize === pageSize &&
      forceLoad
    ) {
      state.load();
    }
  };

  return state as any;
}

export interface UseRequestPaginationResult<
  Data extends any[] = [],
  Error = any,
  > {
  /** 页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
  /** 数据 */
  data: Data | undefined;
  /** 总数 */
  readonly total: number;
  /** 挂起状态 */
  readonly pending: boolean;
  /** 加载状态 */
  readonly loading: boolean;
  /** 错误 */
  readonly error: Error | undefined;
  /** 加载 */
  readonly load: () => Promise<void>;
  /** 修改页码 */
  readonly setCurrent: (current: number, forceLoad?: boolean) => void;
  /** 修改每页条数 */
  readonly setPageSize: (pageSize: number, forceLoad?: boolean) => void;
  /** 同时修改页码和每页条数 */
  readonly setPagination: (current: number, pageSize: number, forceLoad?: boolean) => void;
}

/**
 * 使用请求更多
 * @param service 服务
 * @param options 选项
 */
export function useRequestMore<
  Data extends any[] = [],
  Error = any,
  >(
    service: (
      /** 参数 */
      params: {
        /** 页码 */
        current: number;
        /** 每页条数 */
        pageSize: number;
      },
    ) =>
      Promise<
        | {
          /** 数据 */
          data: Data;
          /** 总数 */
          total: number;
        }
        | void
      >,
    options?: {
      /** 初始每页条数，默认为 `20` */
      initialPageSize?: number;
      /** 数据项key，默认为自身 */
      dataItemKey?: string;
      /** 手动请求 */
      manual?: boolean;
      /** 成功钩子 */
      onSuccess?: (data: Data) => void;
      /** 失败钩子 */
      onError?: (error: Error) => void;
      /** 加载状态延迟，默认为 `500` */
      loadingDelay?: number;
      /** 防抖间隔 */
      debounceInterval?: number;
      /** 防抖选项 */
      debounceOptions?: DebounceSettings,
      /** 节流间隔 */
      throttleInterval?: number;
      /** 节流选项 */
      throttleOptions?: ThrottleSettings;
      /** 格式化错误 */
      formatError?: (error: any) => Error;
    },
): UseRequestMoreResult<Data, Error> {
  const {
    initialPageSize = 20,
    dataItemKey,
    loadingDelay = 500,
    debounceInterval,
    debounceOptions,
    throttleInterval,
    throttleOptions,
    manual,
    onSuccess,
    onError,
    formatError,
  } =
    options ?? {};

  // 状态
  const state = reactive({
    current: 1,
    pageSize: initialPageSize > 0 ? initialPageSize : 20,
    data: undefined as Data | undefined,
    pending: false,
    loading: false,
    loadingMore: false,
    noMore: false,
    error: undefined as Error | undefined,
    load: undefined as any as () => Promise<void>,
    loadMore: undefined as any as () => Promise<void>,
  });
  const internalState = {
    loadingCount: 0,
    loadingMore: false,
  };

  // 加载状态
  let updateLoading = (loading: boolean) => { state.loading = loading };
  let updateLoadingMore = () => { state.loadingMore = internalState.loadingMore };
  if (loadingDelay > 0) {
    updateLoading = debounce(updateLoading, loadingDelay);
    updateLoadingMore = debounce(updateLoadingMore, loadingDelay);
  }
  const setLoading = (loading: boolean) => {
    if (loading) {
      internalState.loadingCount++;
    } else {
      internalState.loadingCount--;
    }
    state.pending = internalState.loadingCount !== 0;
    updateLoading(state.pending);
  };
  const setLoadingMore = (loading: boolean) => {
    internalState.loadingMore = loading;
    state.pending = state.pending || loading;
    updateLoadingMore();
  };

  // 加载处理
  const loadHandle = async (): Promise<{
    data: Data;
    total: number;
  }> => {
    const result = await service({
      current: state.current,
      pageSize: state.pageSize,
    });
    const { data = [] as any as Data, total = 0 } = result ?? {};
    if (
      data.length === 0 &&
      state.current > 1
    ) {
      const maxCurrent = Math.ceil(total / state.pageSize);
      if (maxCurrent < state.current) {
        state.current = maxCurrent;
        return loadHandle();
      }
    }
    return { data, total };
  };

  // 加载
  state.load = async () => {
    state.current = 1;
    setLoading(true);
    try {
      const { data, total } = await loadHandle();
      state.data = data as any;
      state.noMore = Math.round(state.current * state.pageSize) >= total;
      state.error = undefined;
      onSuccess?.(state.data as any);
    } catch (error) {
      state.error = formatError ? formatError(error) : error as any;
      onError?.(state.error as any);
    }
    setLoading(false);
  };
  if (debounceInterval as number > 0) {
    state.load = debounce(state.load, debounceInterval, debounceOptions) as any;
  }
  if (throttleInterval as number > 0) {
    state.load = throttle(state.load, throttleInterval, throttleOptions) as any;
  }
  if (!manual) {
    state.load();
  }
  watch(
    () => state.pageSize,
    () => state.load(),
  );

  // 加载更多
  state.loadMore = async () => {
    if (state.noMore) return;
    if (!internalState.loadingMore) {
      state.current++;
    }
    setLoadingMore(true);
    try {
      const { data, total } = await loadHandle();
      const dataMap = new Map<any, any>(
        state.data?.map(item => [dataItemKey ? item[dataItemKey] : item, item])
      );
      data.forEach(item => {
        dataMap.set(dataItemKey ? item[dataItemKey] : item, item);
      });
      state.data = Array.from(dataMap.values()) as any;
      state.noMore = Math.round(state.current * state.pageSize) >= total;
      state.error = undefined;
      onSuccess?.(state.data as any);
    } catch (error) {
      state.error = formatError ? formatError(error) : error as any;
      onError?.(state.error as any);
    }
    setLoadingMore(false);
  };
  if (debounceInterval as number > 0) {
    state.loadMore = debounce(state.loadMore, debounceInterval, debounceOptions) as any;
  }
  if (throttleInterval as number > 0) {
    state.loadMore = throttle(state.loadMore, throttleInterval, throttleOptions) as any;
  }

  return state as any;
}

export interface UseRequestMoreResult<
  Data extends any[] = [],
  Error = any,
  > {
  /** 页码 */
  readonly current: number;
  /** 每页条数 */
  pageSize: number;
  /** 数据 */
  data: Data | undefined;
  /** 挂起状态 */
  readonly pending: boolean;
  /** 加载状态 */
  loading: boolean | 'restore';
  /** 错误 */
  readonly error: Error | undefined;
  /** 更多加载状态 */
  readonly loadingMore: boolean;
  /** 是否有更多数据 */
  readonly noMore: boolean;
  /** 加载 */
  readonly load: () => Promise<void>;
  /** 加载更多 */
  readonly loadMore: () => Promise<void>;
}

/**
 * 使用请求记录
 * @param service 服务
 * @param options 选项
 */
export function useRequestRecord<
  Params = any,
  Data = any,
  Error = any,
  Key extends string | number = string,
  >(
    service: (params: Params) => Promise<Data>,
    options: {
      /** 记录key */
      recordKey: (params: Params) => Key;
      /** 成功钩子 */
      onSuccess?: (data: Data, params: Params) => void;
      /** 失败钩子 */
      onError?: (error: Error, params: Params) => void;
      /** 加载状态延迟，默认为 `500` */
      loadingDelay?: number;
      /** 防抖间隔 */
      debounceInterval?: number;
      /** 防抖选项 */
      debounceOptions?: DebounceSettings,
      /** 节流间隔 */
      throttleInterval?: number;
      /** 节流选项 */
      throttleOptions?: ThrottleSettings;
      /** 格式化错误 */
      formatError?: (error: any) => Error;
    },
): UseRequestRecordResult<Params, Data, Error, Key> {
  const {
    recordKey,
    loadingDelay = 500,
    debounceInterval,
    debounceOptions,
    throttleInterval,
    throttleOptions,
    onSuccess,
    onError,
    formatError,
  } =
    options ?? {};

  // 状态
  const state = reactive({
    record: {} as Record<Key, {
      data: Data | undefined;
      pending: boolean;
      loading: boolean;
      error: Error | undefined,
    }>,
    load: undefined as any as (params: Params) => Promise<void>,
  });
  const internalState = {
    record: {} as Record<Key, {
      loadingCount: number;
    }>,
  };

  // 加载状态
  let updateLoading = (key: Key, loading: boolean) => { (state.record as any)[key].loading = loading };
  if (loadingDelay > 0) {
    updateLoading = debounce(updateLoading, loadingDelay);
  }
  const setLoading = (key: Key, loading: boolean) => {
    let internalRecordItem = internalState.record[key];
    if (loading) {
      internalRecordItem.loadingCount++;
    } else {
      internalRecordItem.loadingCount--;
    }
    (state.record as any)[key].pending = internalRecordItem.loadingCount !== 0;
    updateLoading(key, (state.record as any)[key].pending);
  };

  // 加载
  state.load = async (params: Params) => {
    const key = recordKey(params);
    let recordItem = (state.record as any)[key];
    if (!recordItem) {
      recordItem = (state.record as any)[key] = reactive({
        data: undefined,
        loading: false,
        pending: false,
        error: undefined,
      });
    }
    if (!internalState.record[key]) {
      internalState.record[key] = {
        loadingCount: 0,
      };
    }
    setLoading(key, true);
    try {
      recordItem.data = await service(params);
      recordItem.error = undefined;
      onSuccess?.(recordItem.data as any, params);
    } catch (error) {
      recordItem.error = formatError ? formatError(error) : error as any;
      onError?.(recordItem.error as any, params);
    }
    setLoading(key, false);
  };
  if (debounceInterval as number > 0) {
    state.load = debounce(state.load, debounceInterval, debounceOptions) as any;
  }
  if (throttleInterval as number > 0) {
    state.load = throttle(state.load, throttleInterval, throttleOptions) as any;
  }

  return state as any;
}

export interface UseRequestRecordResult<
  Params = any,
  Data = any,
  Error = any,
  Key extends string | number = string,
  > {
  /** 记录 */
  readonly record: Record<Key, {
    /** 数据 */
    data: Data | undefined;
    /** 挂起状态 */
    readonly pending: boolean;
    /** 加载状态 */
    readonly loading: boolean;
    /** 错误 */
    readonly error: Error | undefined;
  }>;
  /** 加载 */
  readonly load: (params: Params) => Promise<void>;
}