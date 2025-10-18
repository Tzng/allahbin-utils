/**
 * 由id和text组成的选项
 */
export interface IOptions2 {
  /**
   * 文本
   */
  text: any;
  /**
   * 值
   */
  id: any;
  /**
   * 判断类型
   */
  type?: string;
  remark?: string;
  /**
   * 循环用的key，不一定有值，需要和后端确认！
   */
  key?: string;
}