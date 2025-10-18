import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';
import { getModuleEntries } from './scripts/scan-modules.mjs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

/**
 * 动态获取所有模块的入口文件
 * 自动扫描 src 目录下的子目录，查找 index.ts 文件作为模块入口
 */
const moduleEntries = getModuleEntries('src');

export default [
  // 构建 JavaScript 文件 - 支持多入口
  {
    input: moduleEntries,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        declaration: false, // 禁用 TypeScript 插件的声明文件生成
        declarationMap: false, // 禁用声明映射文件
        outDir: null, // 让 Rollup 处理输出目录
      }),
    ],
    external: ['fs', 'path', 'url'],
  },
  // 构建 CommonJS 类型定义文件
  {
    input: moduleEntries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].d.ts',
    },
    plugins: [dts()],
  },
  // 构建 ESM 类型定义文件
  {
    input: moduleEntries,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      entryFileNames: '[name].d.ts',
    },
    plugins: [dts()],
  },
];