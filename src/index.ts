// 主入口文件 - 导出所有工具函数

// 核心工具函数（适用于 Node.js、UniApp、React Native 等）
export * from './core/stringUtils';
export * from './core/arrayUtils';
export * from './core/objectUtils';
export * from './core/dateUtils';
export * from './core/numberUtils';
export * from './core/validationUtils';
export * from './core/asyncUtils';
export * from './core/colorUtils';
export * from './core/cryptoUtils';
export * from './core/pageUtils';

// 浏览器专用工具函数
export * from './browser/domUtils';
export * from './browser/cookieUtils';
export * from './browser/urlUtils';

// 请求工具函数
export * from './request';

// UniApp 工具函数
export * from './uniapp';

// 类型定义
export * from './types';

// 版本信息
export const version = '1.0.0';