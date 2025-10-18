// 主入口文件 - 导出所有工具函数

// 核心工具函数（适用于 Node.js、UniApp、React Native 等）
export * from './core/stringUtils';
export * from './core/arrayUtils';
export * from './core/objectUtils';
export * from './core/dateUtils';
export * from './core/numberUtils';
export * from './core/validationUtils';
export * from './core/asyncUtils';

// 浏览器专用工具函数
export * from './browser/domUtils';

// 版本信息
export const version = '1.0.0';