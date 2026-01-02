import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module', 'require']

export default defineConfig([
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [tseslint.configs.base],
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'warn',
      // 关闭显示使用any警告
      '@typescript-eslint/no-explicit-any': 'off',
      // 关闭变量未使用警告
      '@typescript-eslint/no-unused-vars': 'off',
      // 关闭显示使用Function警告
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // 全局变量
      'no-restricted-globals': ['error', ...DOMGlobals, ...NodeGlobals]
    }
  },
  {
    files: ['rollup.config.js', 'index.js'],
    rules: {
      // 全局变量
      'no-restricted-globals': 'off'
    }
  },
  {
    ignores: ['**/node_modules/**', '**/dist/']
  }
])
