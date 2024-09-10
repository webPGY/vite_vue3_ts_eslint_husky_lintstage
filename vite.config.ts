import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import { fileURLToPath, URL } from 'node:url'
// 导入自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
// 导入自动注册组件的插件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import postCssPxToRem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  console.log(`\n------当前环境: ${JSON.stringify(process.env.NODE_ENV)}`)

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      // eslint插件配置
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'], // 指定需要检查的文件
        exclude: ['node_modules/**', 'dist/**', 'public/**', 'assetes/**'], // 指定不需要检查的文件
        fix: true, // 是否自动修复
        cache: false // 是否启用缓存
      }),
      AutoImport({
        //plus按需引入
        resolvers: [ElementPlusResolver()],
        //引入vue 自动注册api插件
        imports: ['vue', 'vue-router', 'pinia'], // 配置需要自动导入的库
        dts: 'types/auto-import.d.ts', // 自动引入生成api的地址
        eslintrc: {
          enabled: false, // 是否开启eslint
          filepath: './.eslintrc-auto-import.json', // eslint配置文件地址
          globalsPropValue: true // 是否开启全局变量
        }
      }),
      Components({
        dirs: ['src/views', 'src/components'],
        //plus按需引入
        resolvers: [ElementPlusResolver()],
        // 配置需要将哪些后缀类型的文件进行自动按需引入
        extensions: ['vue', 'tsx'],
        dts: 'types/components.d.ts' //自动引入生成的组件的地址
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8888,
      // open: true,
      hmr: true,
      proxy: {
        '/mock': {
          target: 'http://localhost:6666',
          rewrite: (path: string) => path.replace(/^\/mock/, ''),
          changeOrigin: true
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 16, // 设计稿尺寸 1rem大小
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
            selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
          }),
          autoprefixer({
            // 自动添加前缀
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8'
              //'last 2 versions', // 所有主流浏览器最近2个版本
            ],
            grid: true
          })
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/varible.scss" as *;
          `
        }
      }
    },
    build: {
      target: 'es2015',
      // maxConcurrentEntries: Infinity,
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 220,
      assetsInlineLimit: 4096,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            // console.log('文件信息', assetInfo.name)
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name].[hash].[ext]`
          },
          manualChunks: {
            vue: ['vue']
          }
        }
      }
    }
  }
})
