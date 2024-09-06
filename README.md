# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# https://eslint.nodejs.cn/docs/latest/use/configure/migration-guide
# pnpm dlx husky-init && pnpm install
# cz-customizable: 自定义你的Git Commit规范化之旅

在使用 eslint.config.mjs 配置文件时，ESLint 的命令行选项有所不同。--ext 选项在使用新的 eslint.config.* 文件时不再可用，因为文件扩展名可以直接在配置文件中指定。

已经在 eslint.config.mjs 文件中指定了匹配模式为 **/*.{js,mjs,cjs,ts,vue}，这会告诉 ESLint 自动处理这些扩展名的文件，因此无需在命令行中指定 --ext。

使用 eslint 命令直接运行：

直接使用一下命令：

eslint .