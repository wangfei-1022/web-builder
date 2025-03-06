import { loadEnv, defineConfig } from 'vite';
// import { createVuePlugin } from "vite-plugin-vue2";
import requireTransform from 'vite-plugin-require-transform';
import path from 'path'
import vitePluginTransformHtml from './plugins/vitePluginHtmlTransform';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';
// import vitePluginRequire from 'vite-plugin-require';
const ENV_PREFIX = ['VITE_', 'VUE_APP'];
const version = require('./version')
const versionNo = version.getVersion()

export default defineConfig(({ mode, command }) => {
  const envMap = loadEnv(mode, process.cwd(), ENV_PREFIX) || {};

  return {
    root: path.resolve(process.cwd()),
    define: {
      global: {},
      'process.env': {
        ...envMap,
        VUE_APP_VERSION: versionNo,
        NODE_ENV: mode
      }
    },
    plugins: [
      vue(),
      // vitePluginRequire(),
      vueJsx(),
      // createVuePlugin({
      //   jsx: true
      // }),
      vitePluginTransformHtml(envMap),
      requireTransform({
        fileRegex: /.js$|.vue$/
      })
    ],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: []
    },
    resolve: {
      alias: {
        "~@": path.resolve(__dirname, "./src"),
        "@": path.resolve(__dirname, "./src"),
        "~element-ui": path.resolve(__dirname, "./node_modules/element-ui"),
        "vue": "vue/dist/vue.esm.js"
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    css: {
      preprocessorOptions: {
        // 全局样式引入
        scss: {

        }
      }
    },
    server: {
      port: 1022,
      host: true,
      open: false,
    },
  }
})
