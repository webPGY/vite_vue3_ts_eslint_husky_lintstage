import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})
console.log(env.NODE_ENV, process.env.NODE_ENV)
export default [
  // 指定文件匹配模式
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  // 指定全局变量和环境
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 12, // 使用最新的 ECMAScript 语法
      sourceType: 'module' // 代码是 ECMAScript 模块
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...compat.extends('plugin:prettier/recommended'),
  ...compat.extends('.eslint-global-variables.json'),
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue', 'tests/**/*.ts', 'tests/**/*.tsx'],
    ignores: [
      '**/temp.js',
      'config/*',
      'public/*',
      'assets/*',
      'dist',
      '.vscode',
      'vite.config.ts',
      '.cz-config.js',
      'auto-import.d.ts',
      'components.d.ts',
      '*.local',
      '.DS_Store',
      '.idea',
      'pnpm-debug.log*',
      'yarn-debug.log*',
      'npm-debug.log*',
      '*.log',
      'logs',
      'tsconfig.node.tsbuildinfo',
      'eslint.config.{mjs,js,cjs}'
    ],
    // parser: 'vue-eslint-parser',
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': ['off'],
      'no-console': 'off', // 生产环境中警告 console 使用，开发环境中关闭规则
      'no-debugger': 'off', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      // 'no-console': env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中警告 console 使用，开发环境中关闭规则
      // 'no-debugger': env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中警告 debugger 使用，开发环境中关闭规则
      // indent: ['error', 2] // 缩进使用 2 个空格 而不是 4 个  error
      // 'linebreak-style': ['warn', 'windows'], // 使用 Unix 风格的换行符
      // quotes: ['warn', 'single'], // 使用单引号
      // semi: ['error', 'always'], // 语句末尾不加分号
      // 'no-unused-vars': 'error', // 关闭未使用变量警告
      '@typescript-eslint/no-unused-vars': 'off' // 关闭未使用变量警告
      // 'vue/multi-word-component-names': 'off', //Vue 组件的名称应该是多词的，以提高可读性和维护性
    }
  }
]
