/**
 * 核心工具函数库
 * 统一导出所有工具对象
 */

import arrayUtils from './arrayUtils';
import stringUtils from './stringUtils';
import objectUtils from './objectUtils';
import numberUtils from './numberUtils';
import dateUtils from './dateUtils';
import asyncUtils, { AsyncQueue } from './asyncUtils';
import validationUtils from './validationUtils';

/**
 * 导出所有工具对象
 */
export {
  arrayUtils,
  stringUtils,
  objectUtils,
  numberUtils,
  dateUtils,
  asyncUtils,
  validationUtils,
  AsyncQueue
};

/**
 * 默认导出所有工具对象的集合
 */
export default {
  arrayUtils,
  stringUtils,
  objectUtils,
  numberUtils,
  dateUtils,
  asyncUtils,
  validationUtils,
  AsyncQueue
};