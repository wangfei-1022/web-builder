declare global {
  const T: any;
}

const tmapContext = {
  origin: '//api.tianditu.gov.cn',
  script: undefined as HTMLScriptElement | undefined,
};

/**
 * 定义天地图
 * @param config 配置
 */
export function defineTMap(config: {
  /** 令牌 */
  tk: string;
}) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `${tmapContext.origin}/api?v=4.0&tk=${config.tk}`;
  tmapContext.script = script;
}

/**
 * 加载天地图
 */
export async function loadTMap() {
  if ((window as any).T) return;
  const { script } = tmapContext;
  if (!script) {
    throw new Error('请先执行 defineTMap 后再使用天地图');
  }
  if (!script.parentElement) {
    document.head.appendChild(script);
  }
  return new Promise<any>((resolve, reject) => {
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
  });
}