import { vitePluginForArco } from '@arco-plugins/vite-vue';
import cortex from '@cloudplex/cortex/lib/vite-plugin';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vitePluginForArco({
      theme: '@arco-themes/vue-cortex',
      varsInjectScope: ['*'],
    }),
    svgLoader({ defaultImport: 'url' }),
    cortex(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    __TOKEN_STORAGE_KEY__: JSON.stringify('__CORTEX_TOKEN'),
  },
  server: {
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          arco: ['@arco-design/web-vue'],
          chart: ['echarts', 'vue-echarts'],
          utils: ['big.js', 'dayjs', 'lodash', 'qs', 'xlsx'],
        },
      },
    },
  },
});