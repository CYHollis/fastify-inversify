import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'

import { defineConfig } from 'rollup'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const pkg = require('./package.json')

export default defineConfig([
  {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.dependencies)],
    output: {
      file: 'dist/fastify-di.cjs',
      format: 'cjs',
      sourcemap: false
    },
    plugins: [
      json(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json' })
    ]
  },
  // 类型输出
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/fastify-di.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
])
